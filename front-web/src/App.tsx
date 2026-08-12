import { Sidebar } from "./components/Sidebar"

function App() {
  return (
    <div className="relative min-h-screen">
      <Sidebar />
      <div className="ml-64 min-h-screen p-8">
        main content
      </div>
    </div>
  )
}

export default App
