import { useState } from "react"
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
          <div className="border flex flex-col h-20 ">
            <span>password:</span>
            <input type="password" value={pass} required
              onChange={(e) => setPass(e.currentTarget.value)}
              className="border active:appearance-none focus:outline-0 py-0.5 px-2 text-black"
            ></input>
          </div>
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
