import { createBrowserRouter } from 'react-router-dom'

import { Home } from './pages/app/home'
import { SignIn } from './pages/auth/sign-in'

import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { SignUp } from './pages/auth/sign-up'
import { ExerciseHome } from './pages/app/exercise/exercise-home'
import { FoodHome } from './pages/app/food/food-home'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
    ],
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/exercise',
        element: <ExerciseHome />,
      },
    ],
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/food',
        element: <FoodHome />,
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/sign-in',
        element: <SignIn />,
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/sign-up',
        element: <SignUp />,
      },
    ],
  },
])
