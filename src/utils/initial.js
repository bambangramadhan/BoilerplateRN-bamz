const initial = (name, defaultValue = 'NA') => {
    if (name === '' || !name) return defaultValue
    const split = name.split(' ')
    const initialName = split[0][0] + (split[1] ? split[1][0] : '')
    return initialName.toUpperCase()
  }
  
  export default initial
  