import { Link } from "react-router"

export default function HomePage() {
  return (
    <section className="h-screen flex flex-col justify-center">
      <section className="flex mt-[-15%] items-center flex-col font-medium">
        <h1 className=" text-[2.75rem] font-mono ">InitMap</h1>
        <section className="mt-5">
          <Link to={"./dashboard"}>
            <div className="w-30 h-14 flex bg-white rounded-2xl justify-center items-center text-2xl font-medium border duration-200 hover:scale-x-105 hover:border-blue-400">
              Create
            </div>
          </Link>
          <div className="flex mt-2 items-center">
            <div className="w-3 h-3 mr-2 bg-blue-400 rounded-full"></div>
            <div className="font-thin">App running</div>
          </div>
        </section>
      </section>
    </section>
  )
}

