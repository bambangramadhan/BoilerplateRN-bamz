import client from '../../utils/apolloProxy';
import gql from 'graphql-tag';

export const mutationEditOrder = (token, editOrder) => {

  token = '"' + token + '"';
  editOrder = JSON.stringify(editOrder).replace(/"(\w+)"\s*:/g, '$1:');

  let mutation;

  mutation = gql`mutation {
    editOrderCustomer(token: ${token}, editOrder: ${editOrder}) {
      statusText
      statusCode
      message
    }
  }`

  return client.mutate({ mutation: mutation })
}