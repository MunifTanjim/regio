import { get, groupBy, keyBy, map, mapValues, pickBy, union } from 'lodash-es';
import { combineReducers } from 'redux';
import { TERMS_ADD_PAGE, TERMS_PURGE_PAGINATION, TERMS_REMOVE_PAGE, TERMS_REQUEST_PAGE, TERM_ADD, TERM_ADD_BULK, TERM_ADD_BULK_BY_TEACHERID, TERM_REMOVE, TERM_SECTIONS_SET, TERM_UPDATE } from '../actions/actionTypes.js';
import getPaginationReducer from './helpers/get-pagination-reducer.js';




const itemsReducer = (
  state = { byId: {}, allIds: [], idsBySessionYear: {} },
  { type, data }
) => {
  switch (type) {
    case TERM_ADD:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...data
          }
        },
        allIds: union(state.allIds, [data.id]),
        idsBySessionYear: {
          ...state.idsBySessionYear,
          [data.SessionYearId]: union(
            get(state.idsBySessionYear, data.SessionYearId, []),
            [data.id]
          )
        }
      }
    case TERM_ADD_BULK:
    case TERM_ADD_BULK_BY_TEACHERID:
      return {
        ...state,
        byId: {
          ...state.byId,
          ...keyBy(data.items, 'id')
        },
        allIds: union(state.allIds, map(data.items, 'id')),
        idsBySessionYear: {
          ...state.idsBySessionYear,
          ...mapValues(
            groupBy(data.items, 'SessionYearId'),
            (items, SessionYearId) =>
              union(
                get(state.idsBySessionYear, SessionYearId, []),
                map(items, 'id')
              )
          )
        }
      }
    case TERM_REMOVE:
      const _SessionYearId = get(state.byId, [
        data.params.TermId,
        'SessionYearId'
      ])

      return {
        ...state,
        byId: pickBy(state.byId, i => i !== data.params.TermId),
        allIds: state.allIds.filter(i => i !== data.params.TermId),
        idsBySessionYear: {
          ...state.idsBySessionYear,
          [_SessionYearId]: get(state.idsBySessionYear, _SessionYearId).filter(
            i => i !== data.params.TermId
          )
        }
      }
    case TERM_UPDATE:
      return {
        ...state,
        byId: {
          ...state.byId,
          [data.id]: {
            ...state.byId[data.id],
            ...data
          }
        }
      }
    default:
      return state
  }
}

const markedIdsReducer = (state = {}, { type, data }) => {
  switch (type) {
    case TERM_ADD:
      return {
        ...state,
        [`${data.SessionYearId}-${data.level}-${data.term}`]: data.id
      }
    case TERM_ADD_BULK:
      return {
        ...state,
        ...mapValues(
          keyBy(
            data.items,
            ({ SessionYearId, level, term }) =>
              `${SessionYearId}-${level}-${term}`
          ),
          'id'
        )
      }
    case TERM_REMOVE:
      return {
        ...pickBy(state, id => id !== data.id)
      }
    default:
      return state
  }
}

const sectionsReducer = (state = {}, { type, data, params }) => {
  switch (type) {
    case TERM_SECTIONS_SET:
      return {
        ...state,
        [params.TermId]: union(get(state, params.TermId, []), data.items)
      }
    default:
      return state
  }
}

const termsReducer = combineReducers({
  items: itemsReducer,
  markedIds: markedIdsReducer,
  sections: sectionsReducer,
  pagination: getPaginationReducer({
    ADD_PAGE: TERMS_ADD_PAGE,
    REMOVE_PAGE: TERMS_REMOVE_PAGE,
    REQUEST_PAGE: TERMS_REQUEST_PAGE
  })
})

export default (state, action) => {
  if (action.type === TERMS_PURGE_PAGINATION) {
    state.pagination = undefined
  }

  return termsReducer(state, action)
}
