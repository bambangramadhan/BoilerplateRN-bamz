import color from './color'
import style from './defaultStyle'

const fonts = {
  header: {
    fontSize: style.FONT_SIZE_TITLE,
    fontWeight: 'bold',
  },
  subHeader: { fontSize: style.FONT_SIZE },
  body: {
    fontSize: style.FONT_SIZE_SMALL,
    fontWeight: 'normal',
  },
  whiteText: { color: color.white },
  darkText: { color: color.primaryFontColor },
  greyText: { color: color.grey },
}

export default fonts
