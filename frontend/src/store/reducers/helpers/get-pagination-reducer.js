const initialPaginationState = {
  fetching: false,
  pages: {},
  hasPages: 0,
  totalPages: 0,
  totalItems: 0,
  itemsPerPage: 0,
  nextLink: null
}

const getPaginationReducer = ({ ADD_PAGE, REMOVE_PAGE, REQUEST_PAGE }) => (
  state = initialPaginationState,
  { type, data, page, query = '' }
) => {
  switch (type) {
    case ADD_PAGE:
      return {
        fetching: false,
        pages: {
          ...state.pages,
          [page]: {
            fetching: false,
            itemIds: data.items.map(item => item.id),
            query
          }
        },
        hasPages: state.hasPages + 1,
        totalPages: data.totalPages,
        totalItems: data.totalItems,
        itemsPerPage: data.itemsPerPage,
        nextLink: data.nextLink
      }
    case REMOVE_PAGE:
      return {
        ...state,
        fetching: false,
        pages: {
          ...state.pages,
          [page]: undefined
        }
      }
    case REQUEST_PAGE:
      return {
        ...state,
        fetching: true,
        pages: {
          ...state.pages,
          [page]: {
            fetching: true,
            itemIds: [],
            query
          }
        }
      }
    default:
      return state
  }
}

export default getPaginationReducer
