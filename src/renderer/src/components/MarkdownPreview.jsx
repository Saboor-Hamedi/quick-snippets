import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/light'
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python'
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml'
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css'
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql'
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash'
import docco from 'react-syntax-highlighter/dist/esm/styles/hljs/docco'
import atomOneDark from 'react-syntax-highlighter/dist/esm/styles/hljs/atom-one-dark'

// Register only core languages for light build
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('xml', xml)
SyntaxHighlighter.registerLanguage('html', xml) // alias
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('sql', sql)
SyntaxHighlighter.registerLanguage('bash', bash)

const normalizeLang = (lang) => {
  const l = (lang || '').toLowerCase()
  const map = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'javascript',
    tsx: 'javascript',
    py: 'python',
    sh: 'bash',
    shell: 'bash',
    html: 'html',
    xml: 'xml',
    css: 'css',
    sql: 'sql',
    bash: 'bash',
    javascript: 'javascript',
    python: 'python'
  }
  return map[l] || l
}

const MarkdownPreview = ({ content }) => {
  const isDark = document.documentElement.classList.contains('dark')
  const style = isDark ? atomOneDark : docco

  return (
    <div className="p-4 preview-content">
      <div className="prose prose-slate dark:prose-invert max-w-none preview-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 className="font-bold text-2xl mb-3" {...props} />,
            h2: ({ node, ...props }) => <h2 className="font-bold text-xl mb-2" {...props} />,
            h3: ({ node, ...props }) => <h3 className="font-bold text-lg mb-2" {...props} />,
            a: ({ node, href, children, ...props }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 hover:underline"
                {...props}
              >
                {children}
              </a>
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 pl-4 text-slate-500 dark:text-slate-400"
                {...props}
              />
            ),
            p: ({ children, ...props }) => <p {...props}>{renderWithTags(children)}</p>,
            li: ({ children, ...props }) => <li {...props}>{renderWithTags(children)}</li>,
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              const lang = normalizeLang(match?.[1])
              if (!inline && lang) {
                return (
                  <CodeBlock
                    language={lang}
                    code={String(children).replace(/\n$/, '')}
                    style={style}
                  />
                )
              }
              return (
                <code
                  className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#161b22] text-pink-600 dark:text-pink-400"
                  {...props}
                >
                  {children}
                </code>
              )
            }
          }}
        >
          {content || ''}
        </ReactMarkdown>
      </div>
    </div>
  )
}

const renderWithTags = (children) => {
  const flatten = (nodes) =>
    nodes
      .map((n) => (typeof n === 'string' ? n : (n && n.props && n.props.children) || ''))
      .join(' ')
  const text = Array.isArray(children) ? flatten(children) : String(children || '')
  const parts = text.split(/(#[a-zA-Z0-9_-]+)/g)
  return parts.map((part, i) =>
    part.startsWith('#') ? (
      <span
        key={i}
        className="inline-block px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 dark:bg-[#1e3a8a] dark:text-sky-200 text-xs mr-1 align-middle"
      >
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

const CodeBlock = ({ language, code, style }) => {
  const [copied, setCopied] = React.useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }
  return (
    <div className="relative group">
      <button
        onClick={onCopy}
        className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy code"
      >
        {copied ? '✓ Copied' : 'Copy'}
      </button>
      <SyntaxHighlighter
        PreTag="div"
        language={language}
        style={style}
        customStyle={{ margin: 0, borderRadius: 6 }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export default React.memo(MarkdownPreview)
