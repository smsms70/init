import { CenterComponents } from "./Home/Home"

export default function NotFoundPage() {
  return (
    <CenterComponents>
      <section className="border w-100 h-44 flex flex-col shadow rounded">
        <div className=" flex flex-col mt-4 items-center">
          <h1 className="text-5xl">404</h1>
          <span className="text-xl">
            page not found
          </span>
        </div>
        <div className=" mt-auto mb-6 flex justify-center">
          <button onClick={() => { window.location.href = "/" }}
            className="border rounded shadow px-2 py-1 cursor-pointer hover:scale-105 duration-150">go back</button>
        </div>
      </section>
    </CenterComponents>
  )
}
