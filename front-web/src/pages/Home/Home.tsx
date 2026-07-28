import { Link } from "react-router"
import type { JSX } from "react/jsx-runtime"

export default function HomePage() {
  return (
    <CenterComponents>
      <>
        <header className="flex shadow px-5 relative flex-col  items-center">
          <h1 className=" text-[2.50rem] font-mono font-semibold h-16 leading-16 text-center borde px-4 rounded-xl">init</h1>
          <div className="flex border-b ">
            <span className="text-2xl font-mono font-light">~/idea/</span>
            <span className="text-xl font-mono font-light">code/</span>
            <span className=" font-mono font-light">project</span>
          </div>
        </header>
        <section className="mt-8">
          <Link to={"./dashboard"}>
            <div className="w-30 h-14 flex bg-white rounded-2xl justify-center items-center text-2xl font-medium border-2 duration-200 hover:scale-x-105 hover:border-blue-400">
              Create
            </div>
          </Link>
          <div className="flex mt-2 items-center">
            <div className="w-3 h-3 mr-2 bg-blue-400 rounded-full"></div>
            <div className="font-thin">App running</div>
          </div>
        </section>
      </>
    </CenterComponents>
  )
}

export function CenterComponents({ children }: { children: JSX.Element }) {
  return (
    <section className="h-screen flex flex-col justify-center">
      <section className="flex mt-[-15%] items-center flex-col font-medium">
        {children}
      </section>
    </section>

  )
}
