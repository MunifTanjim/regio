import api from './api'

export const getKV = async key => {
  const { data, error } = await api(`/kv/${key}`)
  if (error) throw error
  return data
}

export const setKV = async (
  key,
  { value = '', description = '' } = { value: '', description: '' }
) => {
  const { data, error } = await api(`/kv/${key}`, {
    method: 'PUT',
    body: { value, description }
  })
  if (error) throw error
  return data
}
