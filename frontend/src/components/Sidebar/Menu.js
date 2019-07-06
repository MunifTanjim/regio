import React, { useEffect, useState } from 'react'
import { Menu, Sidebar } from 'semantic-ui-react'
import { getKV } from 'utils/kv.js'
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
  const [appName, setAppName] = useState('Regio')

  useEffect(() => {
    getKV('appName').then(kv => setAppName(appName => kv.value || appName))
  }, [])

  return (
    <Sidebar
      vertical
      borderless
      animation="push"
      as={Menu}
      visible={sidebarVisible}
      content={<MenuItems items={items} appName={appName} />}
      className="regio"
    />
  )
}

export default SidebarMenu
