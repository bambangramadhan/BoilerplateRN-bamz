import React from 'react';
import { View, Dimensions, Modal, Text, StyleSheet, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { loginRequest, loginStatus } from './action';
import Button from '../../Components/Button'
import TextInputDefault from '../../Components/TextInput'
import CardFood from '../../Components/CardFood'
import CardDate from '../../Components/CardDate'
import { Avatar } from '../../Components/Avatar'
import { validate } from '../../utils/validateEmail';
import ModalConfirm from '../../Components/ModalConfirm'
import ModalAlert from '../../Components/ModalAlert'
import RatingOutlet from '../../Components/RatingOutlet';
import ButtonCounter from '../../Components/ButtonCounter';
import FooterCart from '../../Components/FooterCart';


export class LoginScreen extends React.PureComponent {

  state = {
    text: '',
    password: '',
    secureTextEntry: true,
    modalVisible: false
  };

  openModal = () => this.setState({ modalVisible: true });
  closeModal = () => this.setState({ modalVisible: false });

  handleChange = () => {
    alert('woy')
  }

  cekValidate = (val) => {
    if (validate(val)) {
      return true
    }
  }

  render() {
    const SCREEN_WIDTH = Dimensions.get("window").width;
    const SCREEN_HEIGHT = Dimensions.get("window").height;
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, }}>
        {/* <TextInput 
          placeholder={'TEST'}
          onChangeText={(val)=>{console.log('validate email = '+validate(val))}}
          onSubmitEditing={() => {
            this.inputPassword.focus();
          }}
        />

        <TextInput 
          placeholder={'TEST'}
          onChangeText={(val)=>{console.log('validate email = '+validate(val))}}
          ref={input => {
            this.inputPassword = input;
          }}
        /> */}
        {/* <TextInputDefault
          label={'Username'}
          value = {this.state.text}
          onChangeText={(val) => this.setState({text: val})}
          secureTextEntry={false}
          typeIcon={'AntDesign'}
          nameIcon={'checkcircle'}
          sizeIcon={17}
          keyboardType={'number-pad'}
          onSubmitEditing={() => {
            this.inputPassword.focus();
          }}
        />

        <TextInputDefault
          label={'Password'}
          style={{ borderWidth: 1, borderColor: "transparent"}}
          value = {this.state.password}
          onChangeText={(val) => this.setState({password: val})}
          secureTextEntry={true}
          typeIcon={'Entypo'}
          nameIcon={'eye-with-line'}
          sizeIcon={20}
          ref={input => {
            this.inputPassword = input;
          }}
        />

        <Button 
          text={'L O G I N'}
          onPress={this.handleChange}
          
          /> */}

        {/* <CardFood 
          style={{width: SCREEN_WIDTH * 0.22, height: SCREEN_HEIGHT * 0.1, borderRadius: 19}}
          source={{uri: 'https://www.dbs.com/iwov-resources/images/newsroom/indonesia/Blog/2609217/makanan%20khas%20indonesia/Image%20Banner%20travel.png'}}
          onPress={this.handleChange}
        /> */}

        {/* <CardDate
            isActive={false}
            current= {'JAN'}
            date={12}
            day= {'SUN'}
          /> */}

        {/* <Avatar size="small" name={'Bambang Ramadhan'} source={'https://www.dbs.com/iwov-resources/images/newsroom/indonesia/Blog/2609217/makanan%20khas%20indonesia/Image%20Banner%20travel.png'} /> */}

        {/* <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.closeModal}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.description}>
              {[
                "A native modal is easy enough to implement but the risk is that ",
                "the user can feel trapped if they can't close the Modal. \n\n",
                "The only way they can is by clicking on:"
              ]}
            </Text>
            <Button 
              height="0.05"
              width='0.5'
              text='Close modal'
              onPress={this.closeModal}
            />
          </View>
        </Modal>

        <Button height="0.05" width='0.5' text="Native Modal" onPress={this.openModal} /> */}

        {/* <ModalAlert 
          icon={'Success'}
          title={'Update Akun !'}
          subtitle={'Update terlebih dahulu \n password dan email sebelum \n menggunakan aplikasi'}
        /> */}

        <RatingOutlet
          rating={3.7}
          allUser={'(200+)'}
          outlet={'Outlet H M Betawi'}
          categories={['Makanan', 'Minuman', 'Snack']}
        />
        {/* <FooterCart 
          number={4}
          price={5000000}
          text={'L A N J U T K A N'}
        /> */}

        {/* <VIcon
          type={'Feather'}
          name={'x'}
          size={25}
          color={color.white}
          containerStyle={[{ width: style.BUTTON_MODAL_WIDTH, height: style.BUTTON_MODAL_HEIGHT, backgroundColor: color.primaryPink, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginHorizontal: width * 0.02, activeOpacity: 0, elevation: 5 }]}
          onPress={this.topUp}
        /> */}

      </View>
    )
  }

}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
    borderRadius: 20,
    borderColor: "white",
    borderWidth: 2,
    marginHorizontal: 40,
    marginVertical: 220
  },
  description: {
    padding: 20,
    fontSize: 18
  }
});

const mapStateToProps = state => ({ loginRedux: state.login })

const mapDispatchToProps = dispatch => ({
  loginRequest: () => dispatch(loginRequest()),
  loginStatus: (val) => dispatch(loginStatus(val))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen)