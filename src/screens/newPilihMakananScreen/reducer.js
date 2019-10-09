import Moment from 'moment';
import { PURGE } from 'redux-persist';
import * as actionType from './constants.js';

const initialState = {
  isLoading: false,
  isError: false,
  isLoadingReset: false,
  isErrorReset: false,
  errorMsg: null,
  listMenuKantinFood: [],
  listMenuKantinDrink: [],
  listMenuKantinSnack: [],
  calculationOrder: 0,
  calculationPrice: 0,
  isResetSuccess: 0,
  isChange: 0,
  chosenFood: [],
  isMatch: false,
  listMenuKantin: []
}

const listMenuKantinRequest = state => ({
  ...state,
  isLoading: true,
  isMatch: false
})

const listMenuKantinSuccess = (state, payload) => {
  const page = payload.listMenuByCanteen.page;
  const menuType = payload.listMenuByCanteen.filterMenuType;
  const dataSchedule = payload.listMenuByCanteen.dataSchedule.filter(val => {
    return val.isActive == true && Moment(val.menu.startDateMenu).format('YYYY-MM-DD') <= Moment().format('YYYY-MM-DD');
  })
  let finalPayload;

  if (page == 0 && state.isChange == 0) {

    finalPayload = {
      page: page,
      filterMenuType: menuType,
      totalPage: payload.listMenuByCanteen.totalPage,
      dataSchedule: dataSchedule
    }
  } else if (page !== 0 && state.isChange == 1) {

    finalPayload = {
      page: page,
      filterMenuType: menuType,
      totalPage: payload.listMenuByCanteen.totalPage,
      dataSchedule: state.listMenuKantin.dataSchedule.concat(dataSchedule)
    }
  }

  // console.log('minuman');
  // if ((page == 0 && menuType == 2) && state.isChange == 0) {
  //   return {
  //     ...state,
  //     isError: false,
  //     isLoading: false,
  //     isErrorReset: false,
  //     listMenuKantinDrink: {
  //       page: page,
  //       filterMenuType: menuType,
  //       totalPage: payload.listMenuByCanteen.totalPage,
  //       dataSchedule: dataSchedule
  //     },
  //     isResetSuccess: 0,
  //   }
  // } else if (page !== 0 && menuType == 2 && state.isChange == 1) {
  //   return {
  //     ...state,
  //     isError: false,
  //     isLoading: false,
  //     isErrorReset: false,
  //     listMenuKantinDrink: {
  //       page: page,
  //       filterMenuType: menuType,
  //       totalPage: payload.listMenuByCanteen.totalPage,
  //       dataSchedule: state.listMenuKantinDrink.dataSchedule.concat(dataSchedule)
  //     },
  //     isResetSuccess: 0,
  //   }
  // }

  // console.log('snack');
  // if ((page == 0 && menuType == 3) && state.isChange == 0) {
  //   return {
  //     ...state,
  //     isError: false,
  //     isLoading: false,
  //     isErrorReset: false,
  //     listMenuKantinSnack: {
  //       page: page,
  //       filterMenuType: menuType,
  //       totalPage: payload.listMenuByCanteen.totalPage,
  //       dataSchedule: dataSchedule
  //     },
  //     isResetSuccess: 0,
  //   }
  // } else if (page !== 0 && menuType == 3 && state.isChange == 1) {
  //   return {
  //     ...state,
  //     isError: false,
  //     isLoading: false,
  //     isErrorReset: false,
  //     listMenuKantinSnack: {
  //       page: page,
  //       filterMenuType: menuType,
  //       totalPage: payload.listMenuByCanteen.totalPage,
  //       dataSchedule: state.listMenuKantinSnack.dataSchedule.concat(dataSchedule)
  //     },
  //     isResetSuccess: 0,
  //   }
  // }

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
  listMenuKantinFood: [],
  listMenuKantinDrink: [],
  listMenuKantinSnack: [],
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
      if (x.date == payload.date && x.breakTime == payload.breakTime && x.id == payload.id) {
        return x.id;
      }
    }).indexOf(payload.id);
    if (index > -1) {
      state.chosenFood.splice(index, 1)
    }
  }

  state.chosenFood.map(item => {
    if (item.date == payload.date && item.breakTime == payload.breakTime && item.id == payload.id) {
      item.qty = payload.qty
      item.totalPrice = payload.totalPrice
    }
    return item;
  })

  if (empty.length == 0 && payload.qty !== 0) {
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

const isMatch = state => ({
  ...state,
  isMatch: true
})

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

    case actionType.IS_MATCH:
      return isMatch(state, action.payload)

    case PURGE:
      return initialState;
    default:
      return state
  }
}

export default pilihMakananReducer;




import Moment from 'moment';
import { PURGE } from 'redux-persist';
import * as actionType from './constants.js';

const initialState = {
  isLoading: false,
  isError: false,
  isLoadingReset: false,
  isErrorReset: false,
  errorMsg: null,
  listMenuKantinFood: [],
  listMenuKantinDrink: [],
  listMenuKantinSnack: [],
  calculationOrder: 0,
  calculationPrice: 0,
  isResetSuccess: 0,
  isChange: 0,
  chosenFood: [],
  isMatch: false
}

const listMenuKantinRequest = state => ({
  ...state,
  isLoading: true,
  isMatch: false
})

const listMenuKantinSuccess = (state, payload) => {
  const page = payload.listMenuByCanteen.page;
  const menuType = payload.listMenuByCanteen.filterMenuType;
  const dataSchedule = payload.listMenuByCanteen.dataSchedule.filter(val => {
    return val.isActive == true && Moment(val.menu.startDateMenu).format('YYYY-MM-DD') <= Moment().format('YYYY-MM-DD');
  })

  if ((page == 0 && menuType == 1) && state.isChange == 0) {
    console.log('makanan');

    return {
      ...state,
      isError: false,
      isLoading: false,
      isErrorReset: false,
      listMenuKantinFood: {
        page: page,
        filterMenuType: menuType,
        totalPage: payload.listMenuByCanteen.totalPage,
        dataSchedule: dataSchedule
      },
      isResetSuccess: 0,
    }
  } else if (page !== 0 && menuType == 1 && state.isChange == 1) {
    return {
      ...state,
      isError: false,
      isLoading: false,
      isErrorReset: false,
      listMenuKantinFood: {
        page: page,
        filterMenuType: menuType,
        totalPage: payload.listMenuByCanteen.totalPage,
        dataSchedule: state.listMenuKantinFood.dataSchedule.concat(dataSchedule)
      },
      isResetSuccess: 0,
    }
  }

  console.log('minuman');
  if ((page == 0 && menuType == 2) && state.isChange == 0) {
    return {
      ...state,
      isError: false,
      isLoading: false,
      isErrorReset: false,
      listMenuKantinDrink: {
        page: page,
        filterMenuType: menuType,
        totalPage: payload.listMenuByCanteen.totalPage,
        dataSchedule: dataSchedule
      },
      isResetSuccess: 0,
    }
  } else if (page !== 0 && menuType == 2 && state.isChange == 1) {
    return {
      ...state,
      isError: false,
      isLoading: false,
      isErrorReset: false,
      listMenuKantinDrink: {
        page: page,
        filterMenuType: menuType,
        totalPage: payload.listMenuByCanteen.totalPage,
        dataSchedule: state.listMenuKantinDrink.dataSchedule.concat(dataSchedule)
      },
      isResetSuccess: 0,
    }
  }

  console.log('snack');
  if ((page == 0 && menuType == 3) && state.isChange == 0) {
    return {
      ...state,
      isError: false,
      isLoading: false,
      isErrorReset: false,
      listMenuKantinSnack: {
        page: page,
        filterMenuType: menuType,
        totalPage: payload.listMenuByCanteen.totalPage,
        dataSchedule: dataSchedule
      },
      isResetSuccess: 0,
    }
  } else if (page !== 0 && menuType == 3 && state.isChange == 1) {
    return {
      ...state,
      isError: false,
      isLoading: false,
      isErrorReset: false,
      listMenuKantinSnack: {
        page: page,
        filterMenuType: menuType,
        totalPage: payload.listMenuByCanteen.totalPage,
        dataSchedule: state.listMenuKantinSnack.dataSchedule.concat(dataSchedule)
      },
      isResetSuccess: 0,
    }
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
  listMenuKantinFood: [],
  listMenuKantinDrink: [],
  listMenuKantinSnack: [],
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
      if (x.date == payload.date && x.breakTime == payload.breakTime && x.id == payload.id) {
        return x.id;
      }
    }).indexOf(payload.id);
    if (index > -1) {
      state.chosenFood.splice(index, 1)
    }
  }

  state.chosenFood.map(item => {
    if (item.date == payload.date && item.breakTime == payload.breakTime && item.id == payload.id) {
      item.qty = payload.qty
      item.totalPrice = payload.totalPrice
    }
    return item;
  })

  if (empty.length == 0 && payload.qty !== 0) {
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

const isMatch = state => ({
  ...state,
  isMatch: true
})

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

    case actionType.IS_MATCH:
      return isMatch(state, action.payload)

    case PURGE:
      return initialState;
    default:
      return state
  }
}

export default pilihMakananReducer;