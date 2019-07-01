import React, { useEffect, useState } from 'react'
import { Button, Input, Table } from 'semantic-ui-react'
import { getKV, setKV } from 'utils/kv.js'

const keys = ['departmentTitle']

function KVRow({ k }) {
  const [v, setV] = useState('')
  const [desc, setDesc] = useState('')

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getKV(k).then(kv => {
      setV(kv.value)
      setDesc(kv.description)
      setLoading(false)
    })
  }, [k])

  return (
    <Table.Row>
      <Table.Cell collapsing>{k}</Table.Cell>
      <Table.Cell>
        <Input
          fluid
          disabled={!editing}
          loading={loading}
          className="static"
          value={v}
          onChange={(_, { value }) => {
            setV(value)
          }}
        />
      </Table.Cell>
      <Table.Cell>
        <Input
          fluid
          disabled={!editing}
          loading={loading}
          className="static"
          value={desc}
          onChange={(_, { value }) => {
            setDesc(value)
          }}
        />
      </Table.Cell>
      <Table.Cell collapsing>
        <Button
          icon={editing ? 'check' : 'edit'}
          loading={loading}
          disabled={loading}
          onClick={() => {
            if (!editing) setEditing(true)
            else {
              setLoading(true)
              setKV(k, { value: v, description: desc }).then(kv => {
                setV(kv.value)
                setDesc(kv.description)
                setEditing(false)
                setLoading(false)
              })
            }
          }}
        />
      </Table.Cell>
    </Table.Row>
  )
}

function KVs() {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell collapsing>Key</Table.HeaderCell>
          <Table.HeaderCell>Value</Table.HeaderCell>
          <Table.HeaderCell>Description</Table.HeaderCell>
          <Table.HeaderCell collapsing />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {keys.map(key => (
          <KVRow key={key} k={key} />
        ))}
      </Table.Body>
    </Table>
  )
}

export default KVs
