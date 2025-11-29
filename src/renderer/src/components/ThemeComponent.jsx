import { useEffect } from 'react'

const ThemeComponent = () => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center text-slate-400">
      <span className="text-lg">🌙</span>
    </div>
  )
}

export default ThemeComponent
