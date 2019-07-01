import { get, map, union } from 'lodash-es';

const getGroupedIdsByEntityReducer = idKey => (state, { data, params }) => {
  const entityId = get(data, 'params', params)[idKey]

  return {
    ...state,
    [entityId]: union(
      get(state, entityId, []),
      data.items ? map(data.items, 'id') : [data.id]
    )
  }
}

export default getGroupedIdsByEntityReducer
