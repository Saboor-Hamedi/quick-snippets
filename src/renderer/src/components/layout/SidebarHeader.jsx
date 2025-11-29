import React from 'react'
import PropTypes from 'prop-types'
import { Plus } from 'lucide-react'

const SidebarHeader = ({ title, count, itemLabel, onAction }) => (
  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-shrink-0 transition-colors duration-200">
    <div className="flex items-center gap-3 p-2 ">
      <h1 className="text-sm font-medium text-slate-900 dark:text-white">{title}</h1>
      <>
        {/* If you want to show number of snippets */}
        <p className="text-xs text-slate-500 ">
          {count}
          {count !== 1 ? 's' : ''}
        </p>
      </>
    </div>

    {onAction && (
      <button
        onClick={onAction}
        className="flex-shrink-0 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
        title={`New ${itemLabel || 'Item'}`}
      >
        <Plus size={12} />
      </button>
    )}
  </div>
)

// Export this too!
export const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <p className="text-slate-500">{message}</p>
  </div>
)

SidebarHeader.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  itemLabel: PropTypes.string,
  onAction: PropTypes.func
}

export default SidebarHeader
