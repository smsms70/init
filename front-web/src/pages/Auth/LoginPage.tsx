import { useEffect, useRef, useState } from "react"
import { EyeIcon, EyeOffIcon } from "../../assets/icons"
import { fetchLogin } from "../../components/fetchData"

export default function LoginPage() {
  const [pass, setPass] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  type loginData = {
    token: string
  }
  const submitHandler = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      setLoading(true)
      if (pass.length < 5) throw new Error("password too short")
      const response: loginData = await fetchLogin({ password: pass })

      console.log("response: ", response)

      window.location.href = '/dashboard';
    } catch (err) {
      console.log(err)
      setError("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="w-full border  py-20 flex justify-center">
      <div className="flex flex-col min-h-72 overflow-hidden min-w-80 shadow rounded border border-gray-300">
        <div className="h-20 flex justify-center items-center bg-primary">
          <div className="h-12 w-12 rounded-full bg-white"></div>
        </div>

        <form action="submit" onSubmit={(e) => submitHandler(e)}
          className="text-[15px] font-medium flex my-5 px-2 flex-col min-h-56 h-full text-gray-700/95">
          <div className="border mb-5">
            <span>username: </span>
            <span className="font-mono">admin</span>
          </div>
          <PasswordInput value={pass} onChange={setPass} />
          <div className="border mt-auto p-2 flex flex-col items-center justify-center">
            {
              loading ? (
                <div>loading...</div>
              ) : (
                error && <div className="text-red-700">Error: {error}</div>
              )
            }
            <button type="submit" disabled={loading}
              className="px-3 pt-0.5 w-fit border rounded cursor-pointer text-black hover:scale-105 duration-150">
              Log in
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

function PasswordInput({ value, onChange }: { value: string, onChange: (value: string) => void }) {
  const [showPass, setShowPass] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    const end = input.value.length
    const frame = requestAnimationFrame(() => {
      input.setSelectionRange(end, end)
    })
    return () => cancelAnimationFrame(frame)
  }, [showPass])

  return (
    <div className="border flex flex-col h-20 ">
      <span>password:</span>
      <div className="relative">
        <input ref={inputRef} type={showPass ? "text" : "password"} value={value} required autoComplete="current-password"
          onChange={(e) => onChange(e.currentTarget.value)}
          className="border active:appearance-none focus:outline-0 py-0.5 px-2 pr-10 text-black w-full"
        ></input>

        <button type="button"
          onClick={() => setShowPass((v) => !v)}
          onMouseDown={(e) => e.preventDefault()}
          aria-label={showPass ? "Hide password" : "Show password"}
          title={showPass ? "Hide password" : "Show password"}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-800 cursor-pointer duration-150">

          {showPass ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
        </button>
      </div>
    </div>
  )
}
