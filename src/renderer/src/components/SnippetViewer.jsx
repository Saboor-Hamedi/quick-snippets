// SNIPPET VIEWER - Full screen snippet view (opens when clicking on snippet card)
// Shows code with syntax highlighting and line numbers
import React from 'react'
import PropTypes from 'prop-types'
import useHighlight from '../hook/useHighlight'
import toCapitalized from '../hook/stringUtils'
import { Copy, Pencil } from 'lucide-react'
import DocumentHeader from './layout/DocumentHeader'
import SidebarHeader from './layout/SidebarHeader'

const SnippetViewer = ({ snippet, onClose, onEdit }) => {
  const highlightedContent = useHighlight(snippet?.code || '', snippet?.language || 'txt')

  if (!snippet) return null

  const isCode = (snippet.language || '') !== 'txt'
  const codeLines = snippet.code.split('\n')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formattedTimestamp = new Date(snippet.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div
      className="h-full flex flex-col bg-white dark:bg-slate-950
        transition-colors duration-200"
    >
      {/* VS Code Style Tab Header */}
      <DocumentHeader
        title={snippet.title}
        onClose={onClose}
        rightContent={
          <>
            {/* Meta info */}
            <div className="flex items-center gap-2 text-xs text-slate-500 ">
              <span>{codeLines.length} lines</span>
              <span className="text-slate-400 dark:text-slate-600">•</span>
              <span>{formattedTimestamp}</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  onClick={onEdit}
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

      {/* Code view area */}
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
                <code className="hljs" dangerouslySetInnerHTML={{ __html: highlightedContent }} />
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

SnippetViewer.propTypes = {
  snippet: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    code: PropTypes.string,
    language: PropTypes.string,
    timestamp: PropTypes.number
  }),
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func
}

export default SnippetViewer
