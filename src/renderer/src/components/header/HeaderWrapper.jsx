const HeaderWrapper = ({ children }) => {
  return (
    <div
      className="
      flex items-center justify-between
      px-4 py-2
      border-b border-slate-200 dark:border-slate-800
      bg-white dark:bg-slate-900
      flex-shrink-0
      transition-colors duration-200
      "
    >
      {children}
    </div>
  )
}

export default HeaderWrapper
