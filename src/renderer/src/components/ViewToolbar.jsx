import React from 'react'
import PropTypes from 'prop-types'
import { Plus, PanelLeft, PanelRight, SplitSquareVertical, Eye, Code2 } from 'lucide-react'

const ViewToolbar = ({
  onNew,
  layoutMode,
  setLayoutMode,
  previewPosition,
  setPreviewPosition,
  resetSplit
}) => {
  return (
    <div className="flex items-center justify-end gap-2 px-2 py-2 flex-shrink-0">
      {onNew && (
        <button
          onClick={onNew}
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-[#333] dark:text-slate-200"
          title="New"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
      <button
        onClick={() => setLayoutMode('editor')}
        className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${
          layoutMode === 'editor'
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-[#333] dark:text-slate-200'
        }`}
        title="Editor Only"
      >
        <Code2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => setLayoutMode('split')}
        className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${
          layoutMode === 'split'
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-[#333] dark:text-slate-200'
        }`}
        title="Split View"
      >
        <SplitSquareVertical className="w-4 h-4" />
      </button>
      <button
        onClick={() => setLayoutMode('preview')}
        className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 ${
          layoutMode === 'preview'
            ? 'text-primary-600 dark:text-primary-400'
            : 'text-[#333] dark:text-slate-200'
        }`}
        title="Preview Only"
      >
        <Eye className="w-4 h-4" />
      </button>
      {layoutMode === 'split' && (
        <>
          <button
            onClick={() => setPreviewPosition(previewPosition === 'right' ? 'left' : 'right')}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-[#333] dark:text-slate-200"
            title={previewPosition === 'right' ? 'Preview Right' : 'Preview Left'}
          >
            {previewPosition === 'right' ? (
              <PanelRight className="w-4 h-4" />
            ) : (
              <PanelLeft className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={resetSplit}
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-[#333] dark:text-slate-200"
            title="Reset Split"
          >
            <SplitSquareVertical className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  )
}

ViewToolbar.propTypes = {
  onNew: PropTypes.func,
  layoutMode: PropTypes.oneOf(['editor', 'split', 'preview']).isRequired,
  setLayoutMode: PropTypes.func.isRequired,
  previewPosition: PropTypes.oneOf(['left', 'right']).isRequired,
  setPreviewPosition: PropTypes.func.isRequired,
  resetSplit: PropTypes.func.isRequired
}

export default ViewToolbar
