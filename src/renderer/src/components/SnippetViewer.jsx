import React from 'react'
import useSyntaxHighlight from '../hook/useSyntaxHighlight'
import { Copy, X, Pencil } from 'lucide-react'

const SnippetViewer = ({ snippet, onClose, onEdit }) => {
  const highlightedContent = useSyntaxHighlight(snippet?.code || '', snippet?.language || 'text')

  if (!snippet) return null

  const isCode = snippet.language !== 'text'

  // Copy to clipboard logic
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Split code into lines for line numbers
  const codeLines = snippet.code.split('\n')

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 transition-colors duration-200">
      {/* HEADER / TOOLBAR - Aligned with grid header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-600/20 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded border border-primary-100 dark:border-primary-600/30">
              {snippet.language.toUpperCase()}
            </span>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              {snippet.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{codeLines.length} lines</span>
          <span className="text-xs text-slate-400 dark:text-slate-600">•</span>
          <span className="text-xs text-slate-500">
            {new Date(snippet.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 text-xs font-medium"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          )}

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 text-xs font-medium"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy
          </button>
        </div>
      </div>

      {/* CODE VIEW AREA with line numbers */}
      <div className="flex-1 overflow-auto bg-white dark:bg-slate-950 transition-colors duration-200">
        {isCode ? (
          <div className="flex min-h-full">
            {/* Line Numbers */}
            <div className="flex-shrink-0 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 px-3 py-4 select-none transition-colors duration-200">
              <div className="font-mono text-xs leading-6 text-slate-400 dark:text-slate-600 text-right">
                {codeLines.map((_, index) => (
                  <div key={index} className="h-6">
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 px-4 py-4">
              <pre className="font-mono text-sm leading-6 text-slate-800 dark:text-slate-200">
                <code>{highlightedContent}</code>
              </pre>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-base leading-7 text-slate-800 dark:text-slate-300">
                {snippet.code}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SnippetViewer
