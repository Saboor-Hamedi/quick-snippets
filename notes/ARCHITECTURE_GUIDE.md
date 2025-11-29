# Architecture Guide - Quick Snippets App

**Last Updated:** 2025-11-26

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Application Architecture](#application-architecture)
3. [Component Hierarchy](#component-hierarchy)
4. [Data Flow](#data-flow)
5. [How to Add New Features](#how-to-add-new-features)
6. [Code Issues & Recommendations](#code-issues--recommendations)

---

## 🎯 Project Overview

**Quick Snippets** is an Electron-based code snippet manager with a VS Code-inspired interface. It allows users to:

- Create and manage code snippets
- Organize snippets into projects
- Search and filter snippets
- Syntax highlighting for multiple languages
- Dark/Light theme support

**Tech Stack:**

- **Frontend:** React, TailwindCSS
- **Backend:** Electron (Main Process)
- **Database:** SQLite (via better-sqlite3)
- **Syntax Highlighting:** highlight.js
- **Build Tool:** Vite + electron-vite

---

## 🏗️ Application Architecture

### **Main Components Structure**

```
SnippetLibrary (Root Component)
├── ActivityBar (Left sidebar navigation)
├── Sidebar (File explorer)
│   └── Explorer (Reusable file list component)
│       └── SidebarHeader (Header with count & actions)
├── Workbench (Main content area)
│   ├── WelcomePage
│   ├── SnippetEditor
│   ├── SnippetViewer
│   ├── SettingsPanel
│   └── Grid Views (Snippets/Projects)
│       └── SnippetCard
└── Modals
    ├── CreateProjectModal
    ├── RenameModal
    ├── DeleteModal
    └── CommandPalette
```

---

## 📦 Component Hierarchy

### **1. SnippetLibrary.jsx** (Root Container)

**Location:** `src/renderer/src/components/SnippetLibrary.jsx`

**Responsibilities:**

- Central state management (activeView, modals, search)
- Data fetching via `useSnippetData` hook
- Keyboard shortcuts handling
- Routing between different views

**Key State:**

```javascript
- activeView: 'welcome' | 'snippets' | 'projects' | 'settings'
- sidebarCollapsed: boolean
- searchTerm: string
- deleteModal: { isOpen, id, title }
- createProjectModalOpen: boolean
- renameModal: { isOpen, item }
- isCreatingSnippet: boolean
- isCommandPaletteOpen: boolean
```

**Data from Hook:**

```javascript
const {
  snippets, // Array of snippet objects
  projects, // Array of project objects
  selectedSnippet, // Currently selected item
  setSelectedSnippet,
  saveSnippet, // Function to save/update snippet
  saveProject, // Function to save/update project
  deleteItem, // Function to delete snippet/project
  createProject // Function to create new project
} = useSnippetData()
```

---

### **2. ActivityBar.jsx** (Navigation)

**Location:** `src/renderer/src/components/layout/ActivityBar.jsx`

**Purpose:** Left-side vertical navigation bar (VS Code style)

**Current Views:**

- **Snippets** (Files icon) - Shows all code snippets
- **Projects** (FolderKanban icon) - Shows all projects
- **Settings** (Settings icon) - App settings & themes

**Props:**

```javascript
{
  activeView: string,      // Current active view
  setActiveView: func,     // Function to change view
  toggleSidebar: func      // Function to show/hide sidebar
}
```

**Behavior:**

- Clicking active view → toggles sidebar
- Clicking different view → switches view & shows sidebar

---

### **3. Sidebar.jsx** (File Explorer Wrapper)

**Location:** `src/renderer/src/components/layout/Sidebar.jsx`

**Purpose:** Wrapper that passes props to Explorer component

**Props:**

```javascript
{
  activeView: string,
  items: array,              // Filtered snippets or projects
  searchTerm: string,
  setSearchTerm: func,
  selectedSnippet: object,
  onSelect: func,
  onDeleteRequest: func,
  onCreateProject: func,
  onCreateSnippet: func,
  onRenameRequest: func
}
```

---

### **4. Explorer.jsx** (File List Component)

**Location:** `src/renderer/src/components/layout/Explorer.jsx`

**Purpose:** Reusable component that displays file list with search

**Features:**

- SidebarHeader with title, count, and create button
- Search input
- File list with icons, rename, and delete actions
- Empty state handling

**Props:** Same as Sidebar (passed through)

**File Icons Mapping:**

```javascript
javascript: '📄', python: '🐍', html: '🌐', css: '🎨',
json: '📋', markdown: '📝', java: '☕', cpp: '⚙️'
```

---

### **5. SidebarHeader.jsx** (Reusable Header)

**Location:** `src/renderer/src/components/layout/SidebarHeader.jsx`

**Purpose:** Standardized header for views

**Props:**

```javascript
{
  title: string,        // e.g., "SNIPPETS", "PROJECTS"
  count: number,        // Number of items (currently commented out)
  itemLabel: string,    // e.g., "snippet", "project"
  onAction: func        // Optional: Create button handler
}
```

**Exports:**

- `SidebarHeader` (default)
- `EmptyState` (named export) - Shows "No items" message

---

### **6. Workbench.jsx** (Main Content Area)

**Location:** `src/renderer/src/components/workbench/Workbench.jsx`

**Purpose:** Renders the main content based on activeView

**View Priority (top to bottom):**

1. **Settings** → `<SettingsPanel />`
2. **Editor** (creating new snippet) → `<SnippetEditor />`
3. **Editing** (editing existing) → `<SnippetEditor initialSnippet={...} />`
4. **Viewing** (selected snippet) → `<SnippetViewer />`
5. **Projects Grid** → Grid of `<SnippetCard />` components
6. **Snippets Grid** → Grid of `<SnippetCard />` components
7. **Welcome** (fallback) → `<WelcomePage />`

**Props:**

```javascript
{
  activeView: string,
  selectedSnippet: object,
  onSave: func,
  onCloseSnippet: func,
  onCancelEditor: func,
  snippets: array,
  projects: array,
  onDeleteRequest: func,
  onNewSnippet: func,      // Opens snippet editor
  onNewProject: func       // Opens project modal
}
```

---

### **7. SnippetEditor.jsx** (Code Editor)

**Location:** `src/renderer/src/components/SnippetEditor.jsx`

**Purpose:** Create or edit code snippets

**Features:**

- Textarea with syntax-aware tab handling
- Language selector (11 languages supported)
- Auto-title generation from first line
- Keyboard shortcuts (Ctrl+S to save, Esc to close)

**Props:**

```javascript
{
  onSave: func,           // Called with snippet object
  initialSnippet: object, // Optional: for editing
  onCancel: func          // Close editor
}
```

**Snippet Object Structure:**

```javascript
{
  id: string,           // Timestamp-based ID
  title: string,        // Auto-generated or custom
  code: string,         // The actual code
  language: string,     // 'js', 'py', 'html', etc.
  timestamp: number,    // Creation/update time
  type: 'snippet'       // Always 'snippet'
}
```

---

### **8. SnippetViewer.jsx** (Code Display)

**Location:** `src/renderer/src/components/SnippetViewer.jsx`

**Purpose:** Display code with syntax highlighting and line numbers

**Features:**

- Syntax highlighting via `useHighlight` hook
- Line numbers
- Copy button
- Edit button
- Close button

**Props:**

```javascript
{
  snippet: object,    // Snippet to display
  onClose: func,      // Close viewer
  onEdit: func        // Switch to edit mode
}
```

---

## 🔄 Data Flow

### **Data Loading (On App Start)**

```
1. SnippetLibrary mounts
   ↓
2. useSnippetData hook runs
   ↓
3. useEffect calls loadData()
   ↓
4. window.api.getSnippets() + window.api.getProjects()
   ↓
5. Main process reads from SQLite database
   ↓
6. Data returned to renderer
   ↓
7. setSnippets() + setProjects() update state
   ↓
8. UI re-renders with data
```

### **Creating a New Snippet**

```
1. User clicks "+" in SidebarHeader OR presses Ctrl+N
   ↓
2. setIsCreatingSnippet(true) in SnippetLibrary
   ↓
3. Workbench renders SnippetEditor (activeView='editor')
   ↓
4. User types code and clicks Save
   ↓
5. SnippetEditor calls onSave(newSnippet)
   ↓
6. SnippetLibrary calls saveSnippet(newSnippet)
   ↓
7. useSnippetData hook → window.api.saveSnippet()
   ↓
8. Main process saves to SQLite
   ↓
9. Hook reloads snippets from database
   ↓
10. UI updates with new snippet
    ↓
11. setIsCreatingSnippet(false) closes editor
```

### **Creating a New Project**

```
1. User clicks "+" in Projects SidebarHeader OR presses Ctrl+Shift+N
   ↓
2. setCreateProjectModalOpen(true)
   ↓
3. CreateProjectModal appears
   ↓
4. User enters project name and description
   ↓
5. Modal calls onSave(projectData)
   ↓
6. SnippetLibrary calls createProject(projectData)
   ↓
7. useSnippetData hook → window.api.saveProject()
   ↓
8. Main process saves to SQLite
   ↓
9. Hook reloads projects from database
   ↓
10. UI updates with new project
    ↓
11. setCreateProjectModalOpen(false) closes modal
```

---

## 🛠️ How to Add New Features

### **Adding a New View to ActivityBar**

**Example: Adding a "Favorites" view**

**Step 1:** Update `ActivityBar.jsx`

```javascript
import { Star } from 'lucide-react' // Add icon

// Add new icon in the component
;<ActivityBarIcon
  label="Favorites"
  active={activeView === 'favorites'}
  onClick={() => handleItemClick('favorites')}
  icon={<Star />}
/>
```

**Step 2:** Update `SnippetLibrary.jsx`

```javascript
// Add state for favorites
const [favorites, setFavorites] = useState([])

// Update filteredItems logic
const filteredItems = useMemo(() => {
  let items = snippets
  if (activeView === 'projects') items = projects
  if (activeView === 'favorites') items = favorites
  // ... rest of filter logic
}, [snippets, projects, favorites, searchTerm, activeView])
```

**Step 3:** Update `Workbench.jsx`

```javascript
// Add new view case
if (activeView === 'favorites') {
  const items = favorites
  return (
    <div className="h-full flex flex-col...">
      <SidebarHeader title="Favorites" count={items.length} itemLabel="favorite" />
      {/* Render favorites grid */}
    </div>
  )
}
```

**Step 4:** Update `Sidebar` to show favorites when activeView='favorites'

---

### **Adding a New Language to Syntax Highlighting**

**Step 1:** Update `useHighlight.js`

```javascript
// Import the language
import rust from 'highlight.js/lib/languages/rust'

// Register it
hljs.registerLanguage('rust', rust)

// Add alias if needed
const languageMap = {
  // ... existing mappings
  rs: 'rust'
}
```

**Step 2:** Update `SnippetEditor.jsx`

```javascript
// Add to language dropdown
<option value="rust">Rust</option>
```

**Step 3:** Update `Explorer.jsx` (optional)

```javascript
// Add file icon
const getFileIcon = (language) => {
  const icons = {
    // ... existing icons
    rust: '🦀'
  }
  return icons[language?.toLowerCase()] || '📄'
}

// Add file extension
const getExtension = (language) => {
  const extensions = {
    // ... existing extensions
    rust: '.rs'
  }
  return extensions[language?.toLowerCase()] || '.txt'
}
```

---

### **Adding a New Modal**

**Example: Adding an "Export" modal**

**Step 1:** Create the modal component

```javascript
// src/renderer/src/components/ExportModal.jsx
const ExportModal = ({ isOpen, onClose, onExport, snippets }) => {
  // Modal implementation
}
```

**Step 2:** Add state in `SnippetLibrary.jsx`

```javascript
const [exportModalOpen, setExportModalOpen] = useState(false)
```

**Step 3:** Add keyboard shortcut (optional)

```javascript
// In useEffect keyboard handler
if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
  e.preventDefault()
  setExportModalOpen(true)
}
```

**Step 4:** Render the modal

```javascript
<ExportModal
  isOpen={exportModalOpen}
  onClose={() => setExportModalOpen(false)}
  onExport={handleExport}
  snippets={snippets}
/>
```

---

## ⚠️ Code Issues & Recommendations

### **Issues Found:**

#### **1. Unused Import in SnippetCard.jsx**

**File:** `src/renderer/src/components/SnippetCard.jsx` (Line 7)

```javascript
import SidebarHeader from '../components/layout/SidebarHeader' // ❌ NOT USED
```

**Fix:** Remove this import - SidebarHeader is not used in SnippetCard

---

#### **2. Language Default Inconsistency**

**Files:** `useHighlight.js` and `SnippetEditor.jsx`

**Issue:**

- `useHighlight.js` uses `language = 'txt'` as default
- `SnippetEditor.jsx` uses `language: 'txt'`
- But the mapping converts `txt` → `txt` instead of `txt` → `text`

**Current Code:**

```javascript
// useHighlight.js
const languageMap = {
  txt: 'txt' // ❌ Should be 'text' for plain text
}
```

**Recommendation:** Change to:

```javascript
const languageMap = {
  txt: 'plaintext' // Or just handle 'txt' directly in the check
}
```

---

#### **3. SidebarHeader Count Display is Commented Out**

**File:** `src/renderer/src/components/layout/SidebarHeader.jsx` (Lines 9-15)

**Issue:** The count display is commented out, so users don't see "5 snippets" anymore

**Current:**

```javascript
{
  /* <span className="text-xs text-slate-400 dark:text-slate-600">•</span>
<p className="text-xs text-slate-500">
  {count} {itemLabel}
  {count !== 1 ? 's' : ''}
</p> */
}
```

**Recommendation:** Either:

- Uncomment it to show counts again
- Remove the commented code if it's intentionally hidden
- Make it conditional via a prop `showCount={true}`

---

#### **4. Explorer.jsx Has Unused Safety Check**

**File:** `src/renderer/src/components/layout/Explorer.jsx` (Lines 74-76)

**Issue:**

```javascript
const safeItems = items || [] // ✅ Good safety check
const displayCount = activeView === 'snipets' ? null : safeItems.length // ❌ Typo: 'snipets'
```

**Problems:**

1. Typo: `'snipets'` should be `'snippets'`
2. `displayCount` is calculated but never used (count is passed directly)
3. The wrapper `<div>` was changed to `<>` fragment, removing the container styling

**Recommendation:**

- Fix typo: `activeView === 'snippets'`
- Either use `displayCount` or remove it
- Restore the wrapper div with proper classes

---

#### **5. Missing PropTypes in Explorer.jsx**

**File:** `src/renderer/src/components/layout/Explorer.jsx`

**Issue:** The component expects `onCreateProject` and `onCreateSnippet` props, but in `Sidebar.jsx` it's passed as a single `onCreate` prop

**Current Sidebar.jsx:**

```javascript
<Explorer
  onCreate={handleCreate} // ❌ Wrong prop name
  // Should be:
  onCreateProject={onCreateProject}
  onCreateSnippet={onCreateSnippet}
/>
```

**Fix:** Update Sidebar.jsx to pass both props correctly

---

#### **6. Inconsistent Fragment Usage**

**File:** `src/renderer/src/components/layout/Explorer.jsx`

**Issue:** The root element was changed from a styled `<div>` to a fragment `<>`

**Before:**

```javascript
<div className="flex-1 flex flex-col h-full bg-slate-50...">
```

**After:**

```javascript
<>  // ❌ Lost all styling
```

**Impact:** The Explorer component lost its background color, borders, and layout styling

**Fix:** Restore the wrapper div

---

### **Recommendations:**

#### **1. Extract Magic Strings to Constants**

```javascript
// Create src/renderer/src/constants/views.js
export const VIEWS = {
  WELCOME: 'welcome',
  SNIPPETS: 'snippets',
  PROJECTS: 'projects',
  SETTINGS: 'settings'
}

// Usage:
setActiveView(VIEWS.SNIPPETS)
if (activeView === VIEWS.PROJECTS) { ... }
```

#### **2. Create a Shared Types File**

```javascript
// src/renderer/src/types/snippet.js
export const createSnippet = (data) => ({
  id: data.id || Date.now().toString(),
  title: data.title || '',
  code: data.code || '',
  language: data.language || 'txt',
  timestamp: data.timestamp || Date.now(),
  type: 'snippet'
})
```

#### **3. Add Error Boundaries**

Wrap major components in error boundaries to prevent full app crashes

#### **4. Implement Debounced Search**

The search currently filters on every keystroke. Consider debouncing for better performance:

```javascript
import { useMemo, useState, useEffect } from 'react'
import { debounce } from 'lodash'

const debouncedSearch = useMemo(() => debounce((term) => setSearchTerm(term), 300), [])
```

#### **5. Add Loading States**

Show loading indicators when fetching data from the database

---

## 📝 Summary

### **Key Architectural Patterns:**

1. **Single Source of Truth:** `useSnippetData` hook manages all data
2. **Unidirectional Data Flow:** Props down, events up
3. **Component Composition:** Reusable components (SidebarHeader, Explorer)
4. **View-based Routing:** `activeView` state controls what's displayed
5. **Modal Management:** Centralized in SnippetLibrary

### **Main Data Entities:**

- **Snippet:** Code with language, title, timestamp
- **Project:** Collection/category with name, description
- **View State:** Current active view, selected item, modals

### **Critical Files:**

- `SnippetLibrary.jsx` - Root orchestrator
- `useSnippetData.js` - Data management hook
- `Workbench.jsx` - View router
- `ActivityBar.jsx` - Navigation
- `Explorer.jsx` - File list display

---

**End of Architecture Guide**
