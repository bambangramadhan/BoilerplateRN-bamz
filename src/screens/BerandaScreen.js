import React from 'react';
import _ from 'lodash';
import Moment from 'moment';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';
import RNExitApp from 'react-native-exit-app';
import { Navigation } from 'react-native-navigation';
import NetInfo from "@react-native-community/netinfo";
import { setJSExceptionHandler } from 'react-native-exception-handler';
import { View, Text, Platform, ScrollView, FlatList, RefreshControl, BackHandler, Alert } from 'react-native';

import Color from '../../style/color';
import navigation from '../../navigation/';
import VIcon from '../../components/VIcon';
import Button from '../../components/Button';
import Header from '../../components/Header';
import style from '../../style/defaultStyle';
import CardDate from '../../components/CardDate';
import CardFood from '../../components/CardFood';
import { isEdit } from '../totalPembayaran/action';
import { loadProfileRequest } from '../akun/action';
import MenuFilter from '../../components/MenuFilter';
import { width, height } from '../../utils/dimension';
import CardBeranda from '../../components/CardBeranda';
import { checkConnection } from '../connection/action';
import { fontPlatform } from '../../utils/fontPlatform';
import { customerNotificationRequest } from '../notification/action';
import LostConnection from '../../components/LostConnection';
import { listMyOrderRequest, listMyOrderSuccess, listScheduleRequest, isEditOrder, checkVersionRequest } from './action';

// setJSExceptionHandler((err, isFatal) => {
// 	Alert.alert(
// 		'Unexpected error occurred',
// 		'We have reported this to our team !\nPlease contact our support team in\nyour school',
// 		[
// 			{ text: 'OK', onPress: () => RNExitApp.exitApp() },
// 		],
// 		{ cancelable: false },
// 	);
// }, true)

export class BerandaScreen extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			filterIstirahat: 'Istirahat 1',
			selectedFilterIstirahat: 1,
			scrollPosition: 0,
			selectDate: null,
			selectTanggalTutup: null,
			showFilterOrder: false,
			isEditPesanan: false,
			editOrder: [],
			menuKantinChosen: [],
			refreshing: false,
			activeDay: true,
			status: true,
			componentId: 'Beranda'
		}
	}

	componentWillReceiveProps(nextProps) {
		const { isLoading, isLoadingSchedule, isEdit, schedule } = nextProps.berandaRedux
		if (isLoading == false && isLoadingSchedule == false && isEdit == 0 && nextProps.pesanRedux.isLoading == false && nextProps.loginRedux.isPasswordDefault == true && nextProps.akunRedux.isLoading == false && nextProps.akunRedux.isError == false) {
			this.props.isEditOrder(1);
			let data = {
				icon: 'Warning',
				title: 'Update Akun !',
				type: 'updatePassword',
				subtitle: 'Update terlebih dahulu \n password sebelum menggunakan \n aplikasi',
				onPress: () => this.gotoEditPassword()
			}
			Navigation.showOverlay(navigation.ModalConfirm(data));
			if (schedule.length !== 0) {
				this.setState({ activeDay: schedule[0].active })
			}
		} else if (isLoading == false && isLoadingSchedule == false && isEdit == 0 && nextProps.pesanRedux.isLoading == false && nextProps.loginRedux.isPasswordDefault == false) {
			this.props.isEditOrder(1);
			if (schedule.length !== 0) {
				this.setState({ activeDay: schedule[0].active })
			}
		}
	}

	componentDidMount() {
		Navigation.events().registerComponentDidAppearListener(componentId => {
			this.setState({ componentId: componentId.componentId })
		});
		this.berandaAction();
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	berandaAction = async () => {
		await this.props.checkConnection();
		if (!this.props.connectionRedux.isConnected.isConnected) {
			this.setState({
				status: false
			});
			return false;
		} else {
			this.setState({
				status: true
			});
		}
		NetInfo.addEventListener(connection => {
			this.setState({
				status: connection.isConnected
			})
		});
		this.selectDate(Moment().format('DD'), Moment().format('YYYY-MM-DD'), true);
		this.setNotification();
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	}

	setNotification = () => {
		const channel = new firebase.notifications.Android.Channel('kotakmakan', 'Channel Siswa', firebase.notifications.Android.Importance.Max)
			.setDescription('kotakmakan');
		firebase.notifications().android.createChannel(channel);
		firebase.messaging().hasPermission()
			.then(enabled => {
				if (enabled) {
					firebase.messaging().getToken()
						.then(fcmToken => {
							if (fcmToken) {
								console.log('fcmToken = ' + fcmToken);
							} else {
								//do nothing
							}
						});
				} else {
					firebase.messaging().requestPermission()
						.then(() => {
							firebase.messaging().getToken()
								.then(fcmToken => {
									if (fcmToken) {
										console.log('fcmToken = ' + fcmToken);
									} else {
										//do nothing
									}
								});
						})
						.catch((err) => {
							//do nothing
						})
				}
			})
		// firebase.messaging().subscribeToTopic('headline');
		this.messageListener = firebase.messaging().onMessage((message) => {
			const localNotification = new firebase.notifications.Notification({
				sound: 'default',
				show_in_foreground: true,
				show_in_background: true,
			})
				.setNotificationId(message.messageId)
				.setTitle(message.data.title)
				.setBody(message.data.body)
				.setData(message.data)
				.android.setChannelId('kotakmakan')
				.android.setSmallIcon('ic_kotakmakan_square')
				.android.setColor('#ffffff')
				.android.setPriority(firebase.notifications.Android.Priority.High)
				.android.setAutoCancel(true)
				.android.setVisibility(firebase.notifications.Android.Visibility.Public);
			firebase.notifications().displayNotification(localNotification);
		});
	}

	handleBackPress = () => {
		if (this.state.componentId == "Beranda" || this.state.componentId == "Pesan" || this.state.componentId == "Mutasi" || this.state.componentId == "Akun") {
			let data = {
				icon: 'Warning',
				title: 'Keluar !',
				type: 'updatePassword',
				subtitle: 'Keluar dari aplikasi KotakMakan ?',
				onPress: () => this.goOut()
			}
			Navigation.showOverlay(navigation.ModalConfirm(data));
			return true;
		}
		return false;
	}

	goOut() {
		RNExitApp.exitApp();
	}

	_onRefresh() {
		if (this.state.status) {
			this.props.listMyOrderRequest(this.props.akunRedux.token);
			this.props.listScheduleRequest(this.props.akunRedux.token);
			this.props.loadProfileRequest(this.props.akunRedux.token);
		}
	}

	selectDate = (date, tanggal_tutup, active) => {
		this.setState({
			selectDate: date,
			selectTanggalTutup: Moment(tanggal_tutup).format("YYYY-MM-DD"),
			activeDay: active
		});
	}

	gotoEditPassword = () => {
		Navigation.push(this.props.componentId, navigation.views.setting());
		Navigation.dismissOverlay("ModalConfirm");
	}

	substringCapital = (param) => {
		let val = param.substring(0, 3);
		return val.toUpperCase();
	}

	updateCountPesanan = (itemPesan, param, indexValPesan, indexItemPesan) => {
		let tmpListMyOrder = this.props.berandaRedux.listMyOrder.listMyOrder;
		tmpListMyOrder.map((val, indexVal) => {
			if (val._id == indexValPesan) {
				if (param == 'increment') {
					val.tempOrderAmount++
				} else {
					if (val.tempOrderAmount > 0) {
						val.tempOrderAmount--
					}
				}

				let arr = this.state.editOrder.filter(item => item.transactionDetailId == val._id)
				if ((val.tempOrderAmount - val.orderAmount) == 0) {
					let index = this.state.editOrder.map(x => {
						return x.transactionDetailId;
					}).indexOf(val._id)
					this.state.editOrder.splice(index, 1)
				}

				if (arr.length == 0) {
					this.state.editOrder.push({
						transactionId: val.transactionId,
						transactionDetailId: val._id,
						orderAmountOld: val.orderAmount,
						orderAmountNew: val.tempOrderAmount,
						menuName: val.menuName,
						price: val.capitalPrice
					})
				} else {
					this.state.editOrder.map(item => {
						if (item.transactionDetailId == val._id) {
							item.orderAmountNew = val.tempOrderAmount
						}
						return item;
					})
				}
				this.setState({ editOrder: this.state.editOrder })


				let empty = this.state.menuKantinChosen.filter(item => item.date == this.state.selectTanggalTutup && item.breakTime == this.state.filterIstirahat && item.id == val._id);

				if ((val.tempOrderAmount - val.orderAmount) == 0) {
					let index = this.state.menuKantinChosen.map(x => {
						return x.id;
					}).indexOf(val._id)
					this.state.menuKantinChosen.splice(index, 1)
				}

				if (empty.length == 0) {
					this.state.menuKantinChosen.push({
						id: val._id,
						breakTime: this.state.filterIstirahat,
						date: this.state.selectTanggalTutup,
						nama_menu: val.menuName,
						nama_outlet: val.outletName,
						qty: val.orderAmount,
						qtyNew: val.tempOrderAmount,
						price: parseInt(val.capitalPrice),
						totalPrice: (val.tempOrderAmount - val.orderAmount) * parseInt(val.capitalPrice),
						totalOrder: (val.tempOrderAmount - val.orderAmount)
					})
				} else {
					this.state.menuKantinChosen.map(item => {
						if (item.date == this.state.selectTanggalTutup && item.breakTime == this.state.filterIstirahat && item.id == val._id) {
							item.qtyNew = val.tempOrderAmount
							item.totalPrice = (val.tempOrderAmount - val.orderAmount) * parseInt(val.capitalPrice)
							item.totalOrder = (val.tempOrderAmount - val.orderAmount)
						}
						return item;
					})
				}
				this.setState({ menuKantinChosen: this.state.menuKantinChosen })
			}
		});

		this.props.listMyOrderSuccess({ listMyOrder: tmpListMyOrder });
	}

	handleScroll = (event) => {
		this.setState({ scrollPosition: event.nativeEvent.contentOffset.y });
	}

	gotoDetail = () => {
		Navigation.push(this.props.componentId, navigation.views.kandunganMakanan());
	}

	gotoNotification = () => {
		Navigation.push(this.props.componentId, navigation.views.notifikasi());
	}

	gotoTopup = (type) => {
		Navigation.push(this.props.componentId, navigation.views.topup({ type }));
	}

	gotoPesan = () => {
		navigation.common.switchToTab(this.props.componentId, 1);
	}

	splitName = (name) => {
		let split = name.split(" ")
		return split[0];
	}

	openModalFilter = (opt, styleModal, selected) => {
		let data = {
			text: opt,
			selected: selected,
			style: styleModal,
			onPress: (val) => this.setState({ filterIstirahat: val }, () => Navigation.dismissOverlay('ModalFilter'))
		}
		Navigation.showOverlay(navigation.ModalFilter(data));
	}

	editCancelled = () => {
		this.props.berandaRedux.listMyOrder.listMyOrder.map(val => {
			val.tempOrderAmount = val.orderAmount
		})
		this.setState({ isEditPesanan: !this.state.isEditPesanan, editOrder: [], menuKantinChosen: [] })
	}

	gotoTotalPembayaran = (editOrderFood) => {
		let calculationOrder;
		let calculationPrice;
		let result = _.chain(this.state.menuKantinChosen).groupBy("date").map(function (v, i) {
			let istirahat1 = [];
			let istirahat2 = [];
			let istirahat3 = [];
			calculationPrice = v.reduce((prev, cur) => prev + cur.totalPrice, 0)
			calculationOrder = v.reduce((prev, cur) => prev + cur.totalOrder, 0)
			v.map(val => {
				val.breakTime == 'Istirahat 1' ? istirahat1.push(val) : val.breakTime == 'Istirahat 2' ? istirahat2.push(val) : istirahat3.push(val)
			})
			return {
				date: i,
				istirahat1: istirahat1,
				istirahat2: istirahat2,
				istirahat3: istirahat3,
				total: calculationPrice
			}
		}).value();
		let menuKantinChosen = {
			orders: result,
			token: this.props.akunRedux.token
		}
		let editOrder = {
			token: this.props.akunRedux.token,
			editOrder: editOrderFood
		}

		let passProps = {
			calculationOrder,
			calculationPrice,
			menuKantinChosen,
			editOrder
		}
		this.props.isEdit(1);
		Navigation.push(this.props.componentId, navigation.views.totalPembayaran(passProps))
		this.props.berandaRedux.listMyOrder.listMyOrder.map(val => {
			val.tempOrderAmount = val.orderAmount
		})
		this.setState({ isEditPesanan: !this.state.isEditPesanan })
	}

	render() {
		let listMyOrder = '';
		let dayOff = '';
		let orderBreakTime = this.state.filterIstirahat == 'Istirahat 1' ? 1 : this.state.filterIstirahat == 'Istirahat 2' ? 2 : 3;
		let orderLength = '';
		let readCount;

		if (this.props.notificationRedux.customerNotification.count !== undefined) {
			readCount = this.props.notificationRedux.customerNotification.count;
		}

		if (this.props.berandaRedux.listMyOrder.listMyOrder !== undefined) {
			listMyOrder = this.props.berandaRedux.listMyOrder.listMyOrder.filter((val) => {
				return Moment(val.checkOutDate).format('YYYY-MM-DD') == Moment(this.state.selectTanggalTutup).format('YYYY-MM-DD') && val.orderAmount !== val.totalTakeout && val.orderAmount !== val.totalRefund;
			});
			orderLength = listMyOrder.filter(val => val.breakTime == orderBreakTime);
		}

		if (this.props.berandaRedux.schedule !== undefined) {
			dayOff = this.props.berandaRedux.schedule.filter((val) => {
				return Moment(val.closing_schedule).format('YYYY-MM-DD') == Moment(this.state.selectTanggalTutup).format('YYYY-MM-DD')
			});
		}

		console.log('connected', this.props.connectionRedux.isConnected);
		console.log('status', this.state.status);

		if (!this.state.status) {
			return (
				<LostConnection
					onPress={() => this.berandaAction()}
					type={'connection'}
				/>
			)
		} else

			return (
				<View style={{ flex: 1, backgroundColor: Color.white, paddingTop: 20 }}>
					<Header
						type={'notif'}
						title={`Hi, ${this.splitName(this.props.akunRedux.profile.customerName)} !`}
						subtitle={'Summary of your transaction and order'}
						onPress={this.gotoNotification}
						readCount={readCount}
					/>
					<ScrollView
						stickyHeaderIndices={[1]}
						scrollEventThrottle={16}
						onScroll={this.handleScroll}
						showsVerticalScrollIndicator={false}
						refreshControl={
							<RefreshControl
								refreshing={this.state.refreshing}
								onRefresh={this._onRefresh.bind(this)}
								colors={['purple', 'pink', 'red', 'blue']}
							/>
						}
					>
						<CardBeranda
							name={this.props.akunRedux.profile.customerName}
							school={this.props.akunRedux.profile.schoolCode.schoolName}
							code={this.props.akunRedux.profile.customerCode}
							balance={this.props.akunRedux.balance}
							onPress={() => this.gotoTopup(this.props.componentId)}
						/>
						<View style={{ width: width * 0.9, alignSelf: 'center', height: height * 0.16, backgroundColor: Color.white }}>
							<FlatList
								horizontal={true}
								showsHorizontalScrollIndicator={false}
								data={this.props.berandaRedux.schedule}
								renderItem={({ item }) =>
									<CardDate
										style={{ marginRight: 10 }}
										key={item.closing_schedule}
										isSelected={this.state.selectDate == Moment(item.closing_schedule).format('DD') ? true : false}
										isActive={this.state.isEditPesanan ? false : item.active}
										disabled={this.state.isEditPesanan ? true : false}
										month={this.substringCapital(Moment(item.closing_schedule).format('MMMM'))}
										date={Moment(item.closing_schedule).format('DD')}
										day={this.substringCapital(Moment(item.closing_schedule).format('dddd'))}
										onPress={() => this.selectDate(Moment(item.closing_schedule).format('DD'), item.closing_schedule, item.active)}
									/>
								}
								extraData={this.state}
								keyExtractor={item => item.closing_schedule}
							/>
							{
								listMyOrder.length !== 0 && (
									<View style={{ flexDirection: 'row', width: width * 0.9, justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', marginBottom: height * 0.01 }}>
										<Text style={{ fontFamily: fontPlatform(Platform.OS, 'Regular'), fontSize: style.FONT_SIZE_MID, color: Color.black }}>Pesanan Kamu</Text>
										<MenuFilter
											selected={this.state.filterIstirahat}
											options={['Istirahat 1', 'Istirahat 2', 'Istirahat 3']}
											isModalFilter={true}
											styleModal={{ right: width * 0.05, bottom: this.state.scrollPosition >= 295 ? height * 0.07 + 295 : height * 0.07 + this.state.scrollPosition }}
											onPress={(opt, styleModal) => this.openModalFilter(opt, styleModal, this.state.filterIstirahat)}
										/>
									</View>
								)
							}
						</View>

						<View style={orderLength.length === 0 && { width: width, height: height * 0.2, justifyContent: 'center', alignItems: 'center' }}>
							{
								orderLength.length === 0 ?
									dayOff.map((val, indexVal) => {
										let dayActive;
										val.active ?
											dayActive = (
												<View key={indexVal} style={{ justifyContent: 'center', alignItems: 'center' }}>
													<Text style={{ fontFamily: fontPlatform(Platform.OS, 'Medium'), fontSize: style.FONT_SIZE_MID, color: Color.grayText, textAlign: 'center' }}>Kamu belum melakukan pesanan, {'\n'} silahkan pesan terlebih dahulu !</Text>
												</View>
											)
											:
											dayActive = (
												<View key={indexVal} style={{ justifyContent: 'center', alignItems: 'center' }}>
													<Text style={{ fontFamily: fontPlatform(Platform.OS, 'Medium'), fontSize: style.FONT_SIZE_MID, color: Color.grayText, textAlign: 'center' }}>Kantin hari ini tutup, silahkan pesan {'\n'} di hari berikut yang tersedia ya !</Text>
												</View>
											)
										return dayActive;
									})
									:
									orderLength.map((item, indexItem) => {
										// if (item.orderAmount !== item.totalTakeout && item.orderAmount !== item.totalRefund) {
										return (
											<View key={indexItem} style={{ borderBottomWidth: indexItem == Object.keys(orderLength).length - 1 ? 0 : 0.4, paddingBottom: height * 0.02, borderBottomColor: Color.grayText, width: width * 0.88, alignSelf: 'center' }}>
												<CardFood
													key={item._id}
													disabled={true}
													style={{ marginTop: height * 0.02 }}
													source={{ uri: item.menuPic }}
													foodName={item.menuName}
													price={item.capitalPrice}
													outlet={item.outletName}
													number={item.tempOrderAmount}
													isEdit={this.state.isEditPesanan}
													// increment={() => this.updateCountPesanan(item, 'increment', item._id, indexItem)}
													// decrement={() => this.updateCountPesanan(item, 'decrement', item._id, indexItem)}
													onPress={this.gotoDetail}
												/>
											</View>
										)
										// }

									})
							}
							{
								this.state.isEditPesanan && orderLength.length !== 0 ?
									<View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: height * 0.02 }}>
										<VIcon
											onPress={this.editCancelled}
											type={VIcon.TYPE_FEATHER}
											name={'x'}
											size={25}
											color={Color.white}
											containerStyle={{ width: style.BUTTON_MODAL_WIDTH, height: style.BUTTON_MODAL_HEIGHT, backgroundColor: Color.primaryPink, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginHorizontal: width * 0.03, elevation: 3 }}
										/>
										<VIcon
											onPress={this.state.menuKantinChosen.length !== 0 ? () => this.gotoTotalPembayaran(this.state.editOrder) : null}
											type={VIcon.TYPE_FEATHER}
											name={'check'}
											size={25}
											color={Color.white}
											containerStyle={{ width: style.BUTTON_MODAL_WIDTH, height: style.BUTTON_MODAL_HEIGHT, backgroundColor: Color.primaryPurple, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginHorizontal: width * 0.03, elevation: 3 }}
										/>
									</View> :
									<Button
										text={'P E S A N'}
										style={{ width: width * 0.3, height: height * 0.05, backgroundColor: Color.primaryPurple, alignSelf: 'center', borderWidth: 0, marginVertical: height * 0.02, elevation: 3 }}
										styleText={{ color: Color.white }}
										onPress={this.gotoPesan}
									/>
							}
						</View>
					</ScrollView>
				</View>
			)
	}
}

const mapStateToProps = state => ({
	berandaRedux: state.beranda,
	akunRedux: state.akun,
	pesanRedux: state.pesan,
	loginRedux: state.login,
	connectionRedux: state.connection,
	notificationRedux: state.notification
})

const mapDispatchToProps = dispatch => ({
	listMyOrderRequest: (token) => dispatch(listMyOrderRequest(token)),
	listMyOrderSuccess: (data) => dispatch(listMyOrderSuccess(data)),
	listScheduleRequest: (data) => dispatch(listScheduleRequest(data)),
	isEditOrder: (data) => dispatch(isEditOrder(data)),
	isEdit: (data) => dispatch(isEdit(data)),
	loadProfileRequest: (data) => dispatch(loadProfileRequest(data)),
	customerNotificationRequest: (data) => dispatch(customerNotificationRequest(data)),
	checkVersionRequest: (data) => dispatch(checkVersionRequest(data)),
	checkConnection: () => dispatch(checkConnection())
})

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(BerandaScreen)