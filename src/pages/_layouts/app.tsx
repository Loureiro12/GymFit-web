import { useState } from 'react'

import { Outlet, Link, Navigate } from 'react-router-dom'
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar'
import {
  Bell,
  Dumbbell,
  LogOut,
  UtensilsCrossed,
  Menu as MenuIcon,
  ChevronsLeft,
} from 'lucide-react'

import Logo from '../../assets/logo_full_h.svg'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const token = localStorage.getItem('token')
  const refreshToken = localStorage.getItem('refreshToken')

  if (token && refreshToken) {
    return (
      <div className="flex h-screen ">
        <Sidebar
          className="h-screen justify-around"
          collapsed={collapsed}
          transitionDuration={1000}
        >
          <Menu
            menuItemStyles={{
              button: ({ level, disabled }) => {
                if (level === 0)
                  return {
                    color: disabled ? '#7B6F72' : '#1D1617',
                    fontSize: 14,
                    fontWeight: 'lighter',
                  }
              },
            }}
          >
            {collapsed ? (
              <MenuItem
                icon={<MenuIcon />}
                onClick={() => setCollapsed(!collapsed)}
              ></MenuItem>
            ) : (
              <MenuItem
                suffix={<ChevronsLeft />}
                onClick={() => setCollapsed(!collapsed)}
              >
                <img
                  src={Logo}
                  alt="Logo do GymFir"
                  className="h-8"
                  onClick={() => setCollapsed(!collapsed)}
                />
              </MenuItem>
            )}
            <MenuItem
              icon={<UtensilsCrossed size={16} />}
              active={window.location.pathname === '/exercise'}
              className={
                window.location.pathname === '/exercise' ? 'bg-secondary' : ''
              }
            >
              <Link to="/exercise">Exercício</Link>
            </MenuItem>
            <MenuItem
              icon={<Dumbbell size={16} />}
              active={window.location.pathname === '/food'}
              className={
                window.location.pathname === '/food' ? 'bg-secondary' : ''
              }
            >
              <Link to="/food">Alimento</Link>
            </MenuItem>
          </Menu>

          <div
            className="flex items-center justify-center gap-2 p-4 shadow-sm"
            style={{ boxShadow: '0px -1px 1px rgba(0, 0, 0, 0.1)' }}
          >
            <LogOut size={16} />
            <p className="c text-sm font-normal">Sair</p>
          </div>
        </Sidebar>

        <div className="flex w-full flex-col">
          <header className="flex items-center justify-between bg-['#F7F8F8'] p-6 shadow-md">
            <div>
              <p className="hidden text-base font-medium md:block">
                Olá, André
              </p>
              <p className="hidden text-xs md:block">
                Hoje é Domingo, 12 de Janeiro 2022
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Bell size={16} />
              </Button>

              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <Outlet />
        </div>
      </div>
    )
  }
  return <Navigate to="/sign-in " />
}
