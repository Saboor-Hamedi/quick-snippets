import React from 'react'
import PropTypes from 'prop-types'
import Explorer from './Explorer'
const Sidebar = ({
  activeView,
  items,
  searchTerm,
  setSearchTerm,
  selectedSnippet,
  onSelect,
  onDeleteRequest,
  onCreateProject,
  onCreateSnippet,
  onRenameRequest
}) => {
  // Get file extension icon based on language

  // 1. Logic: Decide which "Create" function to pass down
  // The Explorer component expects a single 'onCreate' prop,
  // but your App passes two separate functions. We map them here.
  const handleCreate = activeView === 'projects' ? onCreateProject : onCreateSnippet
  // Get file extension from language

  // 2. Render the Explorer

  return (
    <Explorer
      activeView={activeView}
      items={items}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedSnippet={selectedSnippet}
      onSelect={onSelect}
      onDeleteRequest={onDeleteRequest}
      onRenameRequest={onRenameRequest}
      onCreate={handleCreate} // <--- Passing the mapped function
    />
  )
}

Sidebar.propTypes = {
  activeView: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  selectedSnippet: PropTypes.object,
  onSelect: PropTypes.func.isRequired,
  onDeleteRequest: PropTypes.func.isRequired,
  onCreateProject: PropTypes.func.isRequired,
  onCreateSnippet: PropTypes.func.isRequired,
  onRenameRequest: PropTypes.func.isRequired
}
export default Sidebar
