import { createBrowserRouter } from 'react-router-dom'

import { Home } from './pages/app/home'
import { SignIn } from './pages/auth/sign-in'

import { AppLayout } from './pages/_layouts/app'
import { AuthLayout } from './pages/_layouts/auth'
import { SignUp } from './pages/auth/sign-up'
import { ExerciseHome } from './pages/app/exercise/exercise-home'
import { FoodHome } from './pages/app/food/food-home'
import { FoodEdit } from './pages/app/food/food-edit'
import { FoodCreate } from './pages/app/food/food-create'
import { ExerciseEdit } from './pages/app/exercise/exercise-edit'
import { ExerciseCreate } from './pages/app/exercise/exercise-create'

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
        path: '/exercise/:id',
        element: <ExerciseEdit />,
      },
    ],
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/exercise/create',
        element: <ExerciseCreate />,
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
    element: <AppLayout />,
    children: [
      {
        path: '/food/:id',
        element: <FoodEdit />,
      },
    ],
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/food/create',
        element: <FoodCreate />,
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
