/**
 * components/CodeEditor.jsx — integrated with Monaco Editor
 */
import Editor, { loader } from '@monaco-editor/react'
import { useTheme } from '../context/ThemeContext'
import { useEffect } from 'react'

// Custom Zinc Theme
const defineTheme = (monaco) => {
  monaco.editor.defineTheme('zinc-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '71717a', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'f59e0b', fontStyle: 'bold' },
      { token: 'string', foreground: '10b981' },
      { token: 'number', foreground: 'f43f5e' },
      { token: 'identifier', foreground: 'e4e4e7' },
    ],
    colors: {
      'editor.background': '#09090b', // zinc-950
      'editor.foreground': '#e4e4e7', // zinc-200
      'editorLineNumber.foreground': '#3f3f46', // zinc-700
      'editor.lineHighlightBackground': '#18181b', // zinc-900
      'editorCursor.foreground': '#f59e0b', // amber-500
      'editorIndentGuide.background': '#18181b',
      'editor.selectionBackground': '#27272a', // zinc-800
    }
  })
}

export default function CodeEditor({ value, onChange, disabled }) {
  const { dark } = useTheme()

  function handleEditorChange(value) {
    onChange(value)
  }

  return (
    <div className="w-full h-full overflow-hidden border-t border-zinc-200 dark:border-zinc-800">
      <Editor
        key={value === '' ? 'loading' : 'loaded'} // Optional key to force refresh on first load
        height="100%"
        defaultLanguage="javascript"
        theme={dark ? 'zinc-dark' : 'vs'}
        value={value}
        onChange={handleEditorChange}
        options={{
          readOnly: disabled,
          fontSize: 13,
          fontFamily: 'JetBrains Mono, monospace',
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 20 },
          lineNumbersMinChars: 3,
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          fontLigatures: true,
          automaticLayout: true,
          tabSize: 2,
        }}
        beforeMount={defineTheme}
      />
    </div>
  )
}
