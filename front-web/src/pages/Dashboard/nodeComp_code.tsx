import { useRef, useState } from "react"
import { CopyIcon } from "../../assets/icons"
import Editor from 'react-simple-code-editor/src/index';
import type { ProjectNode, DBNode } from "./dashboardElement_types";
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-okaidia.css'

const LanguageMap: Record<string, Prism.Grammar> = {
  html: languages.html,
  css: languages.css,
  js: languages.js,
  jsx: languages.jsx,
  tsx: languages.tsx,
  go: languages.go,
  python: languages.python,
  ts: languages.ts
}
export function NodeCode({ node, onUpdate }: {
  node: ProjectNode,
  onUpdate: (newItem: ProjectNode, toFetch?: Partial<DBNode>) => void
}) {
  const containerEditorRef = useRef<HTMLDivElement>(null)
  const [copy, setCopy] = useState(false);

  if (node.type !== "code") {
    throw new Error("incorrect type")
  }
  const lang = LanguageMap[node.language || "js"]
  const updateType = (type: ProjectNode["type"]) => {
    onUpdate({
      ...node,
      type: type,
      state: { ...node.state, edit: true },
    }, { Type: type })
  }
  const removeType = (e: React.KeyboardEvent) => {
    if ((e.key == "Delete" || e.key == "Backspace") && !node.data) {
      updateType("string")
    }
  }
  const handleFocusTextarea = () => {
    const textarea = containerEditorRef.current?.querySelector('textarea');
    if (textarea) {
      textarea.focus()
    }
  }
  const handleCopyTextare = async () => {
    const textAreaText = containerEditorRef.current?.querySelector('textarea');
    try {
      if (!textAreaText) return
      await navigator.clipboard.writeText(textAreaText.value)
      setCopy(true)
      setTimeout(() => setCopy(false), 1000)
    } catch (err) {
      setCopy(false)
      console.error('error in copy:', err)
    }
  }

  return (
    <>
      <div className="group min-w-52 flex flex-col relative overflow-hidden rounded-xl bg-black/90"
        ref={containerEditorRef} onClick={e => {
          e.preventDefault();
          handleFocusTextarea()
        }
        }>
        <section className="z-10 h-3 relative mt-2 mr-2  text-sm text-white/60 ">
          <div className={`group/select right-0 flex absolute border rounded border-gray-500 gap-1 group-hover:opacity-100 duration-200 
            ${node.state.edit ? "opacity-100" : "opacity-0"}`}>
            <select name="languages" defaultValue={node.language} onChange={e => {
              onUpdate({ ...node, language: e.target.value });
            }} className="bg-black font-semibold cursor-pointer border border-transparent rounded hover:border-gray-500 hover:text-gray-300">
              <option value="html">html</option>
              <option value="css">css</option>
              <option value="js">js</option>
              <option value="ts">ts</option>
              <option value="python">python</option>
              <option value="jsx">jsx</option>
              <option value="tsx">tsx</option>
              <option value="go">go</option>

            </select>
            <button onClick={() => handleCopyTextare()}
              className="group/copy p-1 border bg-black rounded border-black cursor-pointer hover:border-gray-500">
              <CopyIcon className={` size-5 duration-150 ${copy ? "text-green-500" : "group-hover/copy:text-gray-300"}`} />
            </button>
          </div>
        </section>

        <Editor
          placeholder="Type some code…"
          value={node.data}
          onValueChange={(code) => onUpdate({ ...node, data: code })}
          onFocus={() => onUpdate({ ...node, state: { ...node.state, edit: true } })}
          onBlur={() => onUpdate({ ...node, state: { ...node.state, edit: false } })}
          onKeyDown={e => removeType(e)}
          highlight={(code) => highlight(code, lang, node.language || "js")}
          padding={20}
          style={{ fontFamily: 'monospace' }}
          className="w-full text-gray-200 "
        />
      </div>
    </>
  )
}
