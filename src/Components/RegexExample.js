// let word = '3. Isi kode perusahaan "70002" dan pilih "Benar"'
// var regex = /"([^"]+)"/g;
// let word3 = word.match(regex)
// console.log('word3', word3);
// let word4 = <Text style={{ fontFamily: fontPlatform(Platform.OS, 'Bold'), color: Color.black }}>{word3.map(val => val)}</Text>

let word = '3. Masukkan sandi bank #013 dan nomor rekenening yang dituju dengan #856666 + 10 digit DOKU ID Anda. (#DIGIT) dan pilih #benar, DOKU ID anda adalah #DOKUID'
var hastag = /(\#\w+)/g // #blablab
var regex = /"([^"]+)"/g; // "blabla"
let word3 = word.split(hastag)
  // let word4 = word3.replace(hastag, 'DOKU ID')
  // let word3 = word.replace(regex, <Text style={{ fontFamily: fontPlatform(Platform.OS, 'Bold'), color: Color.black }}>$1</Text>)

  // let word5 = word3.map((val, index) => {
  //   let DOKUID = 12819289182;

  //   let chosenWord = val.substring(0, 1) == '#' ? <Text style={{ fontFamily: fontPlatform(Platform.OS, 'Bold'), color: Color.black }}>{val.substring(1) == "DIGIT" ? word3[index - 2].substring(1) + DOKUID : val.substring(1) == "DOKUID" ? DOKUID : val.substring(1)}</Text> : <Text style={{ fontFamily: fontPlatform(Platform.OS, 'Regular'), color: Color.grayText }}>{val}</Text>

  //   return (
  //     <Text key={index}>
  //       {chosenWord}
  //     </Text>
  //   )

  // })

  // console.log('word5', word5);
