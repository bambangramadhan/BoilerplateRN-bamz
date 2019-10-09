import NetInfo from "@react-native-community/netinfo";

export function netInfo() {
  let res = NetInfo.fetch().then(isConnected => {
    return isConnected
  });

  // const unsubscribe = NetInfo.addEventListener(state => {
  //   console.log("Connection type", state);
  // });

  // Unsubscribe
  // unsubscribe();
  return res;
}