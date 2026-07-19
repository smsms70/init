import { Routes, Route } from "react-router"
import HomePage from "../pages/Home/Home"
import DashboardPage from "../pages/Dashboard/DashboardMain"
import DashboardProjectElement from "../pages/Dashboard/DashboardElement"
import LoginPage from "../pages/Auth/LoginPage"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/:project_id" element={<DashboardProjectElement />} />

      <Route path="/auth/login" element={<LoginPage />} />
    </Routes>
  )
}
