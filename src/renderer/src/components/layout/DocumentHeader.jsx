import PropTypes from 'prop-types'
import { X } from 'lucide-react'
import HeaderWrapper from '../header/HeaderWrapper'
/**
 * SidebarHeader - VS Code style tab header for editors/viewers
 * Used in SnippetEditor and SnippetViewer
 */
const DocumentHeader = ({ title, subtitle, onClose, rightContent }) => {
  return (
    <HeaderWrapper>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs font-medium text-slate-900 dark:text-white truncate max-w-[20rem]">
          {title}
        </span>
        {subtitle && (
          <>
            <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
            <small className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              {subtitle}
            </small>
          </>
        )}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 px-2">
        {rightContent}

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-colors"
            title="Close"
          >
            <X size={12} />
          </button>
        )}
      </div>
    </HeaderWrapper>
  )
}

DocumentHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  onClose: PropTypes.func.isRequired, // Made required for documents
  rightContent: PropTypes.node
}
export default DocumentHeader
