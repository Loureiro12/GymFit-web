import { Outlet } from 'react-router-dom'
import { Headphones } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-8">
      <div className="flex items-center gap-3 text-lg  text-foreground">
        <Headphones className="h-5 w-5" />
        <span className="font-semibold">GymFit</span>
      </div>

      <div className="">
        <Outlet />
      </div>

      <footer>
        Painel do parceiro &copy; gymFit - {new Date().getFullYear()}
      </footer>
    </div>
  )
}
