// Edit snippets

import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { X, Check, Pencil, Copy } from 'lucide-react'
import toCapitalized from '../hook/stringUtils'
import { useTextEditor } from '../hook/useTextEditor'
import { useKeyboardShortcuts } from '../hook/useKeyboardShortcuts'
import DocumentHeader from './layout/DocumentHeader'
const SnippetEditor = ({ onSave, initialSnippet, onCancel }) => {
  const { code, setCode, textareaRef, handleKeyDown } = useTextEditor(initialSnippet?.code || '')
  // 2. We keep language state here because it's specific to the UI, not the text editing logic
  const [language, setLanguage] = React.useState(initialSnippet?.language || 'txt')
  // Update language if initialSnippet changes
  React.useEffect(() => {
    if (initialSnippet) {
      setLanguage(initialSnippet.language)
      // Note: 'code' updates automatically inside useTextEditor via its internal useEffect
    }
  }, [initialSnippet])

  const isCode = (language || '') !== 'txt'
  const codeLines = (code || '').split('\n')
  const formattedTimestamp = new Date(initialSnippet?.timestamp || Date.now()).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  )
  React.useEffect(() => {
    const t = code || ''
    const has = (r) => r.test(t)
    let detected = 'txt'
    if (has(/^\s*<\w|<!DOCTYPE|<html[\s>]/i)) detected = 'html'
    else if (has(/\b(def|import\s+\w+|from\s+\w+|print\(|elif|except|with)\b/)) detected = 'py'
    else if (has(/\b(function|const|let|var|=>|console\.log|class\s+\w+)\b/)) detected = 'js'
    else if (has(/\{[\s\S]*\}|:\s*\w+;|@media|--[a-z-]+:/)) detected = 'css'
    else if (has(/\{\s*"|\[\s*\{|\}\s*\]/)) detected = 'json'
    else if (has(/^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)\b/i)) detected = 'sql'
    else if (has(/#include\s+<|std::|int\s+main\s*\(/)) detected = 'cpp'
    else if (has(/\bpublic\s+class\b|System\.out\.println|package\s+\w+/)) detected = 'java'
    else if (has(/^#!.*(bash|sh)|\becho\b|\bcd\b|\bfi\b/)) detected = 'sh'
    else if (has(/^(# |## |### |> |\* |\d+\. )/m)) detected = 'md'
    if (detected !== language) setLanguage(detected)
  }, [code])

  // update or create snippet
  const handleSave = () => {
    if (!code.trim()) return

    const title = initialSnippet?.title || 'untitled'

    // Construct the object
    const newSnippet = {
      id: initialSnippet?.id || Date.now().toString(),
      title: title,
      code: code,
      language: language,
      timestamp: Date.now(),
      type: 'snippet'
    }

    // Send it back to the parent
    onSave(newSnippet)

    // Reset form only if not editing
    if (!initialSnippet) {
      setCode('')
    }
  }
  // Handle keyboard shortcuts
  useKeyboardShortcuts({
    onEscape: onCancel,
    onSave: handleSave
  })
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code || '')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    handleSave()
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 transition-colors duration-200">
      {/* VS Code Style Header */}
     

      <DocumentHeader
        title={initialSnippet?.title || 'Untitled'}
        subtitle={language}
        onClose={onCancel}
        rightContent={
          <>
            {/* Meta info */}
            <div className="flex items-center gap-2 text-xs text-slate-500 ">
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span>{formattedTimestamp}</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              {onSave && (
                <button
                  onClick={handleSave}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  title="Edit snippet"
                >
                  <Pencil size={12} />
                </button>
              )}

              <button
                onClick={handleCopy}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                <Copy size={12} />
              </button>
            </div>
          </>
        }
      />

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        {/* EDITOR AREA */}
        <div className="flex-1 relative">
          <textarea
            placeholder="Type your snippets here..."
            value={code}
            ref={textareaRef}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="
                    w-full h-full
                    bg-slate-50 dark:bg-[#0f172a]
                    text-slate-800 dark:text-slate-300
                    p-4
                    font-mono text-sm

                    /* REMOVE BORDERS & RINGS */
                    resize-none
                    border-none
                    outline-none
                    focus:outline-none
                    focus:ring-0  /* This is key: removes the blue Tailwind glow */

                    /* TYPOGRAPHY POLISH */
                    leading-relaxed /* More space between lines (1.625) */
                    tracking-normal

                    /* VISUAL FLINT */
                    caret-primary-600 dark:caret-primary-400 /* Colored blinking cursor */
                    selection:bg-primary-200 dark:selection:bg-primary-900/50 /* Highlight color */

                    transition-colors duration-200
                  "
            spellCheck="false"
            autoFocus
          />
        </div>

        {/* Footer - Save button only */}
        <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-2 bg-white dark:bg-slate-800/50 flex items-center justify-end backdrop-blur-sm transition-colors duration-200">
          <button
            type="submit"
            className="px-3 py-1.5 text-xs bg-primary-600 hover:bg-primary-500 text-white rounded font-medium transition-colors"
          >
            {initialSnippet ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

SnippetEditor.propTypes = {
  onSave: PropTypes.func.isRequired,
  initialSnippet: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    code: PropTypes.string,
    language: PropTypes.string,
    timestamp: PropTypes.number
  }),
  onCancel: PropTypes.func
}

export default SnippetEditor
