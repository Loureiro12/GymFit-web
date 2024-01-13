import './global.css'

import { Toaster } from 'sonner'
import { RouterProvider } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { ProSidebarProvider } from 'react-pro-sidebar'

import { router } from './routes'

export function App() {
  return (
    <HelmetProvider>
      <Toaster richColors />
      <Helmet titleTemplate="%s | GymFit" />
      <ProSidebarProvider>
        <RouterProvider router={router} />
      </ProSidebarProvider>
    </HelmetProvider>
  )
}
