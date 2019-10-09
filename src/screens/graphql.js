import client from '../../utils/apolloProxy';
import gql from 'graphql-tag';

export const queryListMyOrder = (token) => {
  token = '"' + token + '"'
  const query = gql`
  {
    listMyOrder(token: ${token}){
      transactionId
      _id
      outletCode
      outletName
      menuCode
      menuName
      breakTime
      checkOutDate
      checkoutHour
      orderAmount
      totalTakeout
      totalRefund
      capitalPrice
      updated_at
      saldo
      menuPic
    }
  }`;
  return client.query({ query: query })
}

export const querySchedule = (token) => {
  token = '"' + token + '"'
  const query = gql`
    {
      schedule(token: ${token}){
        school_code
        closing_schedule
        date
        active
        day
        month
        year
      }
    }`;
  return client.query({ query: query })
}

export const mutationEditOrder = (token, editOrder) => {

  token = '"' + token + '"';
  editOrder = editOrder;
  let mutation;

  mutation = gql`mutation {
    editOrderCustomer(token: ${token}, editOrder: [{ transactionId: "${editOrder[0].transactionId}",
      transactionDetailId: "${editOrder[0].transactionDetailId}",
      orderAmountOld: ${editOrder[0].orderAmountOld},
      orderAmountNew: ${editOrder[0].orderAmountNew},
      menuName: "${editOrder[0].menuName}",
      price: ${editOrder[0].price} }]) {
      statusText
      statusCode
      message
    }
  }`

  return client.mutate({ mutation: mutation })
}