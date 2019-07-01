import React from 'react'

import { Sidebar, Menu } from 'semantic-ui-react'

import MenuItems from './MenuItems.js'

const items = [
  {
    title: `Dashboard`,
    link: '/'
  },
  {
    title: `Profile`,
    link: '/profile'
  },
  {
    title: `Batches`,
    link: '/batches',
    permits: ['sysadmin', 'head']
  },
  {
    title: `Sessions`,
    link: '/sessionyears',
    permits: ['sysadmin', 'head']
  },
  {
    title: `Terms`,
    link: '/terms',
    permits: ['sysadmin', 'head', 'teacher']
  },
  {
    title: `Courses`,
    link: '/courses'
  },
  {
    title: `Students`,
    link: '/students',
    permits: ['sysadmin', 'head', 'teacher']
  },
  {
    title: `Teachers`,
    link: '/teachers'
  },
  {
    title: `Routines`,
    link: '/routines'
  },
  {
    title: `KV`,
    link: '/kv',
    permits: ['sysadmin']
  }
]

function SidebarMenu({ sidebarVisible }) {
  return (
    <Sidebar
      vertical
      borderless
      animation="push"
      as={Menu}
      visible={sidebarVisible}
      content={<MenuItems items={items} />}
      className="regio"
    />
  )
}

export default SidebarMenu
