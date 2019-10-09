export function fontPlatform(OS, fontType) {
  switch (fontType) {
    case 'Regular' :
      return OS === 'ios' ? 'CircularStd-Book' : 'CircularStd-Book'
      break;

    case 'RegularItalic' :
      return OS === 'ios' ? 'CircularStd-BookItalic' : 'CircularStd-BookItalic'
      break;

    case 'Bold' :
      return OS === 'ios' ? 'CircularStd-Bold' : 'CircularStd-Bold'
      break;

    case 'BoldItalic' :
      return OS === 'ios' ? 'CircularStd-BoldItalic' : 'CircularStd-BoldItalic'
      break;

    case 'Medium' :
      return OS === 'ios' ? 'CircularStd-Medium' : 'CircularStd-Medium'
      break;

    case 'MediumItalic' :
      return OS === 'ios' ? 'CircularStd-MediumItalic' : 'CircularStd-MediumItalic'
      break;

    case 'Black' :
      return OS === 'ios' ? 'CircularStd-Black' : 'CircularStd-Black'
      break;

    case 'BlackItalic' :
      return OS === 'ios' ? 'CircularStd-BlackItalic' : 'CircularStd-Black'
      break;
  }
}