# Markdown Tab Implementation

## Summary

- Added a dedicated Markdown view and creation flow separate from Snippets.
- Hid the sidebar when viewing Markdown to avoid snippet interactions.
- Introduced a two‑column Markdown editor with live preview and saving.
- Ensured Markdown items do not appear in the Snippets tab.

## Activity Bar

- The Markdown icon sets `activeView` to `markdown`:
  - `src/renderer/src/components/layout/ActivityBar.jsx:57–61`

## Workbench View Switching

- Added/cleaned the `markdown` branch and ensured it renders when selected:
  - `src/renderer/src/components/workbench/Workbench.jsx:146–164`
- Simplified editor branch to avoid unexpected initial state:
  - `src/renderer/src/components/workbench/Workbench.jsx:46–49`
- Kept settings, editor, and markdown branches early to avoid being preempted by viewer/editor states.

## Sidebar Visibility

- Sidebar is hidden while the Markdown view is active so snippets aren’t visible/clickable:
  - `src/renderer/src/components/SnippetLibrary.jsx:191`

## Snippets Filtering

- Excluded markdown entries from the default Snippets list by filtering items:
  - `src/renderer/src/components/SnippetLibrary.jsx:57–65`
  - Filters out items with `type === 'markdown'`, `language === 'md'|'markdown'`, or titles ending in `.md`.

## Markdown View and Editor

- Implemented a Markdown page with a grid and an inline editor + preview:
  - `src/renderer/src/components/markdown/MarkDown.jsx`
- Header provides create action (`SidebarHeader` onAction), grid renders existing markdown files, editor shows textarea (left) and preview (right).
- Saves new markdown entries with:
  - `type: 'markdown'`
  - `language: 'md'`
  - `title` derived from first line (ensuring `.md` suffix)

## Icons and Aliases (Context)

- Normalized language aliases and expanded icons so `md` shows the Markdown icon and `.md` extensions are used:
  - `src/renderer/src/components/layout/Explorer.jsx:18–36`, `38–55`, `39–58`

## Usage

- Click the Markdown icon in the Activity Bar.
- Press the plus button or “Create one” to open the editor.
- Write markdown on the left; preview updates on the right.
- Click Save; the item persists and appears only in the Markdown grid.

## Notes

- Selection clearing on view change can be handled in `SnippetLibrary` (wrapper around `setActiveView`) if needed; hiding the sidebar suffices to prevent snippet interactions during Markdown.
