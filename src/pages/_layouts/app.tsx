import { useState } from 'react'

import { Outlet } from 'react-router-dom'
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar'
import { Dumbbell, LogOut, UtensilsCrossed } from 'lucide-react'

import Logo from '../../assets/logo_full_h.svg'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="flex h-screen ">
      <Sidebar
        className="h-screen justify-around"
        collapsed={collapsed}
        transitionDuration={1000}
      >
        <div className="flex items-center justify-center p-4 shadow-sm">
          <img
            src={Logo}
            alt="Logo do GymFir"
            className="h-8"
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>
        <Menu
          menuItemStyles={{
            button: ({ level, disabled }) => {
              // only apply styles on first level elements of the tree
              if (level === 0)
                return {
                  color: disabled ? '#7B6F72' : '#1D1617',
                  fontSize: 14,
                  fontWeight: 'lighter',
                }
            },
          }}
        >
          <MenuItem icon={<UtensilsCrossed size={16} />}>Exercício</MenuItem>
          <MenuItem icon={<Dumbbell size={16} />}>Alimento</MenuItem>
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
        <header className="flex justify-between bg-slate-500 p-8">
          <p>header</p>
          <p>header</p>
        </header>
        <Outlet />
      </div>
    </div>
  )
}
