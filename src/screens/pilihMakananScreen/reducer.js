import * as actionType from './constants.js'

const initialState = {
  isLoading: false,
  isError: false,
  isLoadingReset: false,
  isErrorReset: false,
  errorMsg: null,
  listMenuKantin: [],
  calculationOrder: 0,
  calculationPrice: 0,
  isResetSuccess: 0,
  isChange: 0,
  chosenFood: []
}

const listMenuKantinRequest = state => ({
  ...state,
  isLoading: true,
  isChange: 0,

})

const listMenuKantinSuccess = (state, payload) => {
  const page = payload.listMenuByCanteen[0].page;
  let finalPayload;

  if (page == 0) {
    finalPayload = payload
  } else {
    finalPayload = {
      listMenuByCanteen: state.listMenuKantin.listMenuByCanteen.concat(payload.listMenuByCanteen)
    }
  }

  return {
    ...state,
    isError: false,
    isLoading: false,
    isErrorReset: false,
    listMenuKantin: finalPayload,
    isResetSuccess: 0,
  }
}

const listMenuKantinFailed = (state, payload) => ({
  ...state,
  isLoading: false,
  isError: true,
  errorMsg: payload,
})


const listMenuKantinResetRequest = state => ({
  ...state,
  isLoadingReset: true
})

const listMenuKantinResetSuccess = (state, payload) => ({
  ...state,
  isErrorReset: false,
  isLoadingReset: false,
  listMenuKantin: [],
  isResetSuccess: 1,
  chosenFood: [],
  calculationPrice: 0,
  calculationOrder: 0,
})

const listMenuKantinResetFailed = (state, payload) => ({
  ...state,
  isLoadingReset: false,
  isErrorReset: true,
  errorMsg: payload,
  isResetSuccess: 2
})

const isChangeMenu = (state, payload) => ({
  ...state,
  isChange: payload
})

const chosenFood = (state, payload) => {
  let empty = state.chosenFood.filter(item => item.date == payload.date && item.breakTime == payload.breakTime && item.id == payload.id);
  if (payload.qty == 0) {
    let index = state.chosenFood.map(x => {
      return x.id;
    }).indexOf(payload.id)
    state.chosenFood.splice(index, 1)
  }

  state.chosenFood.map(item => {
    if (item.date == payload.date && item.breakTime == payload.breakTime && item.id == payload.id) {
      item.qty = payload.qty
      item.totalPrice = payload.totalPrice
    }
    return item;
  })

  if (empty.length == 0) {
    state.chosenFood.push({
      ...payload
    })
  }


  return {
    ...state,
    chosenFood: [...state.chosenFood],
    calculationPrice: state.chosenFood.reduce((prev, cur) => prev + cur.totalPrice, 0),
    calculationOrder: state.chosenFood.reduce((prev, cur) => prev + cur.qty, 0)
  }
}

const pilihMakananReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.LIST_MENU_BY_KANTIN_REQUEST:
      return listMenuKantinRequest(state, action.payload)
    case actionType.LIST_MENU_BY_KANTIN_SUCCESS:
      return listMenuKantinSuccess(state, action.payload)
    case actionType.LIST_MENU_BY_KANTIN_FAILED:
      return listMenuKantinFailed(state, action.payload)

    case actionType.LIST_MENU_BY_KANTIN_RESET_REQUEST:
      return listMenuKantinResetRequest(state, action.payload)
    case actionType.LIST_MENU_BY_KANTIN_RESET_SUCCESS:
      return listMenuKantinResetSuccess(state, action.payload)
    case actionType.LIST_MENU_BY_KANTIN_RESET_FAILED:
      return listMenuKantinResetFailed(state, action.payload)

    case actionType.IS_CHANGE_MENU:
      return isChangeMenu(state, action.payload)

    case actionType.CHOSEN_FOOD:
      return chosenFood(state, action.payload)
    default:
      return state
  }
}

export default pilihMakananReducer;