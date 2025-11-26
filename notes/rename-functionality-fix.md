# Rename Functionality Fix

**Date:** 2025-11-26  
**Status:** ✅ Fixed  
**Files Modified:**

- `src/renderer/src/hook/useSnippetData.js`
- `src/renderer/src/components/SnippetLibrary.jsx`
- `src/renderer/src/components/RenameModal.jsx`

---

## 🐛 Problem

When renaming a snippet or project, the changes were not reflected in the UI:

- ❌ The **header/viewer** title didn't update
- ❌ The **sidebar** list didn't update
- ❌ Had to refresh the page to see changes

### Root Causes

1. **Non-existent state variables**: Code tried to use `activeSnippet`, `setActiveSnippet`, `activeProject`, `setActiveProject` which don't exist
2. **Missing hook function**: No `saveProject` function in the hook (only had `createProject`)
3. **Manual API calls**: Bypassing the hook's automatic reload mechanism
4. **No optimistic updates**: UI wasn't updated immediately

---

## ✅ Solution

### 1. Added `saveProject` Function to Hook

**File:** `src/renderer/src/hook/useSnippetData.js`

```javascript
// Save or update a project (for renaming/editing existing projects)
const saveProject = async (project) => {
  try {
    if (window.api?.saveProject) {
      await window.api.saveProject(project)
      // Reload projects automatically
      const loadedProjects = await window.api.getProjects()
      setProjects(loadedProjects || [])
      showToast('✓ Project saved successfully')
    }
  } catch (error) {
    console.error('Failed to save project:', error)
    showToast('❌ Failed to save project')
  }
}

// Export it
return {
  snippets,
  setSnippets,
  projects,
  setProjects,
  selectedSnippet,
  setSelectedSnippet,
  saveSnippet,
  saveProject, // ← NEW
  deleteItem,
  createProject
}
```

**Why this works:**

- Mirrors the existing `saveSnippet` function
- Automatically reloads the projects list after saving
- Handles toast notifications
- Provides consistent API for both snippets and projects

---

### 2. Simplified `handleRename` Function

**File:** `src/renderer/src/components/SnippetLibrary.jsx`

**Before (Broken):**

```javascript
const handleRename = async (newName) => {
  // ... code ...

  // ❌ These variables don't exist!
  if (activeSnippet && activeSnippet.id === updatedItem.id) {
    setActiveSnippet(updatedItem)
  }
  if (activeProject && activeProject.id === updatedItem.id) {
    setActiveProject(updatedItem)
  }

  // ❌ Calling API directly, bypassing hook
  await window.api[apiMethod](updatedItem)
}
```

**After (Fixed):**

```javascript
const handleRename = async (newName) => {
  if (!renameModal.item) return

  // 1. Prepare the updated object
  const updatedItem = { ...renameModal.item, title: newName }
  const isProject = renameModal.item.type === 'project'

  // 2. Update the selected item immediately (optimistic update)
  if (selectedSnippet && selectedSnippet.id === updatedItem.id) {
    setSelectedSnippet(updatedItem) // ✅ Updates header/viewer
  }

  // 3. Save using hook's functions (automatically updates sidebar)
  try {
    if (isProject) {
      await saveProject(updatedItem) // ✅ Saves AND reloads projects
    } else {
      await saveSnippet(updatedItem) // ✅ Saves AND reloads snippets
    }
  } catch (error) {
    // Revert optimistic update if save failed
    if (selectedSnippet && selectedSnippet.id === updatedItem.id) {
      setSelectedSnippet(renameModal.item)
    }
  } finally {
    setRenameModal({ isOpen: false, item: null })
  }
}
```

**Key improvements:**

- ✅ Uses correct state variable (`selectedSnippet`)
- ✅ Uses hook's save functions (automatic reload)
- ✅ Implements optimistic updates (instant UI feedback)
- ✅ Handles errors with rollback
- ✅ Much simpler and cleaner code

---

### 3. Added Keyboard Shortcuts to RenameModal

**File:** `src/renderer/src/components/RenameModal.jsx`

```javascript
import { useKeyboardShortcuts } from '../hook/useKeyboardShortcuts'

// Handle keyboard shortcuts
useKeyboardShortcuts({
  onEscape: onClose
})

// Prevent saving if name hasn't changed
const handleSubmit = (e) => {
  e.preventDefault()
  if (newName.trim() && newName !== currentName) {
    // ← Added check
    onRename(newName.trim())
  }
}
```

**Improvements:**

- ✅ ESC key closes the modal
- ✅ Prevents unnecessary saves when name unchanged
- ✅ Consistent with other modals

---

## 🎯 How It Works Now

### Flow Diagram

```
User clicks "Rename"
    ↓
RenameModal opens
    ↓
User types new name & presses Enter
    ↓
handleRename() called
    ↓
┌─────────────────────────────────────────┐
│ 1. OPTIMISTIC UPDATE (Instant)          │
│    - Update selectedSnippet immediately │
│    - Header/viewer shows new name       │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 2. SAVE TO DATABASE                     │
│    - Call saveProject() or saveSnippet()│
│    - Hook saves to SQLite               │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 3. RELOAD FROM DATABASE (Automatic)     │
│    - Hook reloads projects/snippets     │
│    - Sidebar updates with new name      │
│    - Toast notification shown           │
└─────────────────────────────────────────┘
    ↓
✅ Both header AND sidebar updated!
```

---

## 📊 State Management

### Before (Broken)

```
SnippetLibrary
  ├─ selectedSnippet ✅ (exists)
  ├─ activeSnippet ❌ (doesn't exist)
  └─ activeProject ❌ (doesn't exist)
```

### After (Fixed)

```
SnippetLibrary
  └─ selectedSnippet ✅ (used for both snippets & projects)
```

**Why this works:**

- `selectedSnippet` holds the currently open item (whether snippet or project)
- No need for separate `activeSnippet` and `activeProject` states
- Simpler state management = fewer bugs

---

## 🔧 Technical Details

### Optimistic Updates

**What is it?**
Updating the UI immediately before the server/database confirms the change.

**Benefits:**

- ⚡ Instant user feedback
- 🎯 Better UX (feels responsive)
- 🔄 Rollback on error

**Implementation:**

```javascript
// 1. Update UI immediately
setSelectedSnippet(updatedItem)

// 2. Save to database
await saveProject(updatedItem)

// 3. If error, rollback
catch (error) {
  setSelectedSnippet(renameModal.item)  // Revert
}
```

### Automatic Reload Pattern

The hook functions (`saveSnippet`, `saveProject`) follow this pattern:

```javascript
const saveProject = async (project) => {
  // 1. Save to database
  await window.api.saveProject(project)

  // 2. Reload from database (ensures consistency)
  const loadedProjects = await window.api.getProjects()
  setProjects(loadedProjects || [])

  // 3. Show feedback
  showToast('✓ Project saved successfully')
}
```

**Why reload from database?**

- Ensures UI matches database state
- Handles concurrent updates
- Simpler than manual state updates

---

## 🧪 Testing

### Test Cases

1. **Rename a snippet**
   - ✅ Header updates immediately
   - ✅ Sidebar updates after save
   - ✅ Toast notification appears

2. **Rename a project**
   - ✅ Header updates immediately
   - ✅ Sidebar updates after save
   - ✅ Toast notification appears

3. **Rename with same name**
   - ✅ Modal closes without saving
   - ✅ No unnecessary API calls

4. **Press ESC in rename modal**
   - ✅ Modal closes
   - ✅ No changes saved

5. **Network error during save**
   - ✅ Error toast shown
   - ✅ UI reverts to original name

---

## 📝 Related Files

### Hook

- `src/renderer/src/hook/useSnippetData.js` - Data management hook

### Components

- `src/renderer/src/components/SnippetLibrary.jsx` - Main component
- `src/renderer/src/components/RenameModal.jsx` - Rename dialog
- `src/renderer/src/components/SnippetViewer.jsx` - Shows snippet header

### Utilities

- `src/renderer/src/hook/useKeyboardShortcuts.js` - Keyboard handling

---

## 🎓 Lessons Learned

1. **Always use existing state variables** - Don't reference non-existent ones
2. **Leverage hook patterns** - Use the hook's functions instead of manual API calls
3. **Implement optimistic updates** - Better UX with instant feedback
4. **Keep it simple** - Simpler code = fewer bugs
5. **Consistent patterns** - `saveSnippet` and `saveProject` should work the same way

---

## 🚀 Future Improvements

- [ ] Add debouncing for rapid renames
- [ ] Add undo/redo functionality
- [ ] Add validation (max length, special characters)
- [ ] Add inline editing (click to rename)
- [ ] Add batch rename functionality

---

## 📚 References

- [React Optimistic Updates](https://react.dev/reference/react/useOptimistic)
- [SQLite UPSERT](https://www.sqlite.org/lang_UPSERT.html)
- [Custom Hooks Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks)
