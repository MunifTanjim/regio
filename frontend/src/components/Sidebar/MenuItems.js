import { Link, Match } from '@reach/router'
import { zipObject } from 'lodash-es'
import React from 'react'
import { Accordion, Header, Icon, Image, Menu } from 'semantic-ui-react'
import Logo from '../../logo.svg'
import Permit from '../Permit.js'
import './MenuItems.css'

const zipPermits = permits => zipObject(permits, permits.map(Boolean))

const isDeep = link => (link === '/' ? false : true)

const ParentItem = ({ link, title, icon, active, children }) => (
  <Accordion className="parent-item">
    <Accordion.Title
      as={props => <Menu.Item as={Link} {...props} />}
      to={link}
      active={active}
      className="parent-item-title"
    >
      {icon ? <Icon name={icon} className="item-icon" /> : null}
      {title}
      <Icon name="dropdown" className="parent-item-dropdown-icon" />
    </Accordion.Title>
    <Accordion.Content
      as={Menu.Menu}
      active={active}
      content={children}
      className="parent-item-content"
    />
  </Accordion>
)

const Item = ({ link, title, icon, permits = [], children }) => (
  <Permit {...zipPermits(permits)}>
    <Match path={`${link}${isDeep(link) ? '/*' : ''}`}>
      {({ match }) =>
        children ? (
          <ParentItem
            link={link}
            title={title}
            icon={icon}
            active={Boolean(match)}
            children={children}
          />
        ) : (
          <Menu.Item as={Link} to={link} active={Boolean(match)}>
            {icon ? <Icon name={icon} className="item-icon" /> : null}
            {title}
          </Menu.Item>
        )
      }
    </Match>
  </Permit>
)

const ItemsFactory = ({ items }) => {
  return items.map(({ ...props }) => (
    <ItemFactory key={props.link} {...props} />
  ))
}

const ItemFactory = ({ items, ...props }) => (
  <Item
    key={props.link}
    children={items ? <ItemsFactory items={items} /> : null}
    {...props}
  />
)

const Items = ({ items }) => <ItemsFactory items={items} />

function SidebarMenuItems({ items, appName }) {
  return (
    <>
      <Menu.Item as={Link} to="/" className="logo">
        <Header as="h2" textAlign="center">
          <Image size="small" src={Logo} alt="Regio Logo" />
          <Header.Subheader>{appName}</Header.Subheader>
        </Header>
      </Menu.Item>

      <Items items={items} />
    </>
  )
}

export default SidebarMenuItems
