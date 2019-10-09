import React from 'react';
import _ from 'lodash';
import Moment from 'moment';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { View, ScrollView, FlatList, Text, Platform, RefreshControl } from 'react-native';

import Color from '../../style/color';
import navigation from '../../navigation';
import Style from '../../style/defaultStyle';
import CardDate from '../../components/CardDate';
import CardFood from '../../components/CardFood';
import FooterCart from '../../components/FooterCart';
import HeaderSearch from '../../components/HeaderSearch';
import MenuFilter from '../../components/MenuFilter';
import { width, height } from '../../utils/dimension';
import { checkConnection } from '../connection/action';
import { fontPlatform } from '../../utils/fontPlatform';
import FooterLoadingFlatlist from '../../components/FooterLoadingFlatlist';
import { listMenuByKantinRequest, listMenuByKantinSuccess, listMenuByKantinResetRequest, chosenFood, isChangeMenu, isMatch } from './action';

export class PilihMakananScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tmpListMenuKantin: [],
      filterCategories: 'Makanan',
      filterIstirahat: 'Istirahat 1',
      selectDate: null,
      selectTanggalTutup: null,
      selectDay: null,
      isLoading: false,
      currentPage: 0,
      refreshing: false,
      listMenuKantinFood: [],
      listMenuKantinDrink: [],
      listMenuKantinSnack: [],
      dayOff: []
    }
  }

  componentDidMount() {
    this.getListMenuKantin();
    this.props.isChangeMenu(0);
  }

  componentWillReceiveProps(nextProps) {
    const { isError, isLoading, isMatch, isChange, listMenuKantinFood, listMenuKantinDrink, listMenuKantinSnack } = nextProps.pilihMakananRedux;
    if (!isLoading) {
      this.setState({ isLoading: false });
    }
    if (isLoading == false && isError == false && isMatch == false && isChange == 0) {
      // setTimeout(() => {
      this.selectDate(this.props.dataprops.payload.selectDate, this.props.dataprops.payload.closing_schedule, this.props.dataprops.payload.selectDay, 'Makanan');
      // }, 100);

      // let listMenuCanteenFood = listMenuKantinFood.dataSchedule.filter((val) => {
      //   return val.isActive == true && Moment(val.menu.startDateMenu).format('YYYY-MM-DD') <= Moment().format('YYYY-MM-DD');
      // });

      // let listMenuCanteenDrink = listMenuKantinDrink.dataSchedule.filter((val) => {
      //   return val.isActive == true && Moment(val.menu.startDateMenu).format('YYYY-MM-DD') <= Moment().format('YYYY-MM-DD');
      // });

      // let listMenuCanteenSnack = listMenuKantinSnack.dataSchedule.filter((val) => {
      //   return val.isActive == true && Moment(val.menu.startDateMenu).format('YYYY-MM-DD') <= Moment().format('YYYY-MM-DD');
      // });



      // this.setState({
      //   listMenuKantinFood: listMenuKantinFood,
      //   listMenuKantinDrink: listMenuKantinDrink,
      //   listMenuKantinSnack: listMenuKantinSnack
      // })
    }
  }

  getListMenuKantin() {
    let menuType = this.state.filterCategories == 'Makanan' ? 1 : this.state.filterCategories == 'Minuman' ? 2 : 3;
    this.props.listMenuByKantinRequest({ token: this.props.akunRedux.token, outletCode: this.props.dataprops.payload.outletCode, menuName: '', page: this.state.currentPage, limit: 10, menuType: menuType })
  }

  componentWillUnmount() {
    this.props.dataprops.payload.activeClick();
  }

  selectDate = (date, closing_schedule, day, filterCategories) => {
    this.setState({
      selectDate: date,
      selectTanggalTutup: Moment(closing_schedule).format("YYYY-MM-DD"),
      selectDay: day
    });
    let tempOrder = this.props.pilihMakananRedux.chosenFood.filter(val => val.date == Moment(closing_schedule).format("YYYY-MM-DD"))
    // let categories = filterCategories == 'Makanan' ? this.props.pilihMakananRedux.listMenuKantinFood : filterCategories == 'Minuman' ? this.props.pilihMakananRedux.listMenuKantinDrink : this.props.pilihMakananRedux.listMenuKantinSnack;
    let categories = this.props.pilihMakananRedux.listMenuKantin;
    console.log('categories', categories);

    if (categories.dataSchedule !== undefined) {
      categories.dataSchedule.map(val => {
        let compare = tempOrder.filter(item => item.id == val.menu._id)
        if (compare.length > 0) {
          val.breakTime1.count = 0;
          val.breakTime2.count = 0;
          val.breakTime3.count = 0;
          compare.map(item => {
            if (item.breakTime == 'Istirahat 1') {
              val.breakTime1.count = item.qty;
            } else if (item.breakTime == 'Istirahat 2') {
              val.breakTime2.count = item.qty;
            } else {
              val.breakTime3.count = item.qty;
            }
          })
        } else {
          val.breakTime1.count = 0;
          val.breakTime2.count = 0;
          val.breakTime3.count = 0;
        }
        return val;
      })
      this.props.isMatch();
      this.props.isChangeMenu(0);
      // setTimeout(() => {
      this.props.listMenuByKantinSuccess({ listMenuByCanteen: categories });
      // }, 100);
    }
  }

  substringCapital = (param) => {
    let val = param.substring(0, 3);
    return val.toUpperCase();
  }

  gotoTotalPembayaran = (calculationOrder, calculationPrice) => {
    let result = _.chain(this.props.pilihMakananRedux.chosenFood).groupBy("date").map(function (v, i) {
      let istirahat1 = [];
      let istirahat2 = [];
      let istirahat3 = [];
      let total = v.reduce((prev, cur) => prev + cur.totalPrice, 0)
      v.map(val => {
        val.breakTime == 'Istirahat 1' ? istirahat1.push(val) : val.breakTime == 'Istirahat 2' ? istirahat2.push(val) : istirahat3.push(val)
      });

      return {
        date: i,
        istirahat1: istirahat1,
        istirahat2: istirahat2,
        istirahat3: istirahat3,
        total: total
      }
    }).value();
    let menuKantinChosen = {
      orders: result.sort((a, b) => {
        var dateA = new Date(a.date);
        var dateB = new Date(b.date);
        return dateA - dateB;
      }),
      token: this.props.akunRedux.token
    }

    let passProps = {
      calculationOrder,
      calculationPrice,
      menuKantinChosen
    }
    Navigation.push(this.props.componentId, navigation.views.totalPembayaran(passProps))
  }

  backToPesan = () => {
    Navigation.pop(this.props.componentId)
  }

  updateCountPesanan = (param, indexValPesan) => {
    let data;
    let qty;
    // let categories = this.state.filterCategories == 'Makanan' ? this.props.pilihMakananRedux.listMenuKantinFood : this.state.filterCategories == 'Minuman' ? this.props.pilihMakananRedux.listMenuKantinDrink : this.props.pilihMakananRedux.listMenuKantinSnack;
    let categories = this.props.pilihMakananRedux.listMenuKantin;
    categories.dataSchedule.map((val) => {
      if (val._id == indexValPesan) {
        if (this.state.filterIstirahat == 'Istirahat 1') {
          if (param == 'increment') {
            val.breakTime1.count++;
          } else {
            if (val.breakTime1.count > 0) {
              val.breakTime1.count--;
            }
          }
        } else if (this.state.filterIstirahat == 'Istirahat 2') {
          if (param == 'increment') {
            val.breakTime2.count++;
          } else {
            if (val.breakTime2.count > 0) {
              val.breakTime2.count--;
            }
          }
        } else {
          if (param == 'increment') {
            val.breakTime3.count++;
          } else {
            if (val.breakTime3.count > 0) {
              val.breakTime3.count--;
            }
          }
        }

        qty = this.state.filterIstirahat == 'Istirahat 1' ? val.breakTime1.count : this.state.filterIstirahat == 'Istirahat 2' ? val.breakTime2.count : val.breakTime3.count
        data = {
          id: val.menu._id,
          breakTime: this.state.filterIstirahat,
          date: this.state.selectTanggalTutup,
          nama_menu: val.menu.menuName,
          nama_outlet: val.outletCode.outletName,
          kode_outlet: val.outletCode.outletCode,
          qty: qty,
          jenis_menu: val.menu.menuType,
          price: parseInt(val.menu.price),
          totalPrice: qty * parseInt(val.menu.price)
        }
      }
    });

    this.props.chosenFood(data);
    this.props.isChangeMenu(0);
    this.props.listMenuByKantinSuccess({ listMenuByCanteen: categories });
  }

  gotoDetail = (passProps) => {
    Navigation.push(this.props.componentId, navigation.views.kandunganMakanan(passProps))
  }

  onChangeText = (val) => {
    this.props.isChangeMenu(0);
    let menuType = this.state.filterCategories == 'Makanan' ? 1 : this.state.filterCategories == 'Minuman' ? 2 : 3;
    this.props.listMenuByKantinRequest({ token: this.props.akunRedux.token, outletCode: this.props.dataprops.payload.outletCode, menuName: val, page: 0, limit: 15, menuType: menuType })
  }

  openModalFilter = (opt, styleModal, selected, param) => {
    let data = {
      text: opt,
      selected: selected,
      style: styleModal,
      onPress: param == 'menu' ?
        (val) => {
          val == this.state.filterCategories ?
            this.setState({ filterCategories: val, currentPage: 0 },
              () => Navigation.dismissOverlay('ModalFilter'))
            :
            this.setState({ filterCategories: val, currentPage: 0 },
              () => Navigation.dismissOverlay('ModalFilter')),
            this.props.isChangeMenu(0),
            this.props.listMenuByKantinRequest({ token: this.props.akunRedux.token, outletCode: this.props.dataprops.payload.outletCode, menuName: '', page: 0, limit: 10, menuType: val == 'Makanan' ? 1 : val == 'Minuman' ? 2 : 3 }),
            this.selectDate(this.state.selectDate, this.state.selectTanggalTutup, this.state.selectDay, val)
        } :
        (val) => this.setState({ filterIstirahat: val }, () => Navigation.dismissOverlay('ModalFilter'))
    }
    Navigation.showOverlay(navigation.ModalFilter(data));
  }

  onEndReached = () => {
    // let categories = this.state.filterCategories == 'Makanan' ? this.props.pilihMakananRedux.listMenuKantinFood : this.state.filterCategories == 'Minuman' ? this.props.pilihMakananRedux.listMenuKantinDrink : this.props.pilihMakananRedux.listMenuKantinSnack;
    let categories = this.props.pilihMakananRedux.listMenuKantin;
    if (!this.state.isLoading && this.state.currentPage < categories.totalPage - 1) {
      this.setState({
        currentPage: this.state.currentPage + 1,
        isLoading: true
      }, () => this.getListMenuKantin(),
        this.props.isChangeMenu(1)
      );
    }
  }

  _onRefresh() {
    let menuType = this.state.filterCategories == 'Makanan' ? 1 : this.state.filterCategories == 'Minuman' ? 2 : 3;
    this.props.isChangeMenu(0);
    this.props.listMenuByKantinRequest({ token: this.props.akunRedux.token, outletCode: this.props.dataprops.payload.outletCode, menuName: '', page: 0, limit: 10, menuType: menuType })
    this.setState({ menuName: '' })
  }

  render() {

    let dayOff = this.props.berandaRedux.schedule.slice(1).filter((val) => {
      return Moment(val.closing_schedule).format('YYYY-MM-DD') == Moment(this.state.selectTanggalTutup).format('YYYY-MM-DD')
    });

    let listMenuKantin = this.state.filterCategories == 'Makanan' ? this.props.pilihMakananRedux.listMenuKantinFood : this.state.filterCategories == 'Minuman' ? this.props.pilihMakananRedux.listMenuKantinDrink : this.props.pilihMakananRedux.listMenuKantinSnack;

    return (
      <View style={{ flex: 1, backgroundColor: Color.white, paddingTop: 20 }}>
        <HeaderSearch
          text={'Pilih Makanan'}
          nameIcon={'search'}
          onPress={this.backToPesan}
          onChangeText={(val) => this.onChangeText(val)}
        />
        <View>
          <View style={{ width: width * 0.9, alignSelf: 'center', height: width * 0.17 }}>
            <ScrollView
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              pagingEnabled={false}
            >
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={this.props.berandaRedux.schedule.slice(1)}
                keyExtractor={(item) => item.closing_schedule}
                renderItem={({ item }) =>
                  <CardDate
                    style={{ marginHorizontal: 5 }}
                    key={item.closing_schedule}
                    isSelected={this.state.selectDate == Moment(item.closing_schedule).format('DD') ? true : false}
                    isActive={item.active}
                    month={this.substringCapital(Moment(item.closing_schedule).format('MMMM'))}
                    date={Moment(item.closing_schedule).format('DD')}
                    day={this.substringCapital(Moment(item.closing_schedule).format('dddd'))}
                    onPress={() => this.selectDate(Moment(item.closing_schedule).format('DD'), item.closing_schedule, Moment(item.closing_schedule).format('dddd'), this.state.filterCategories)}
                  />
                }
                extraData={this.state}
              />
            </ScrollView>
          </View>
        </View>

        {dayOff.map((val, indexVal) => {
          let dayActive;
          val.active ?
            dayActive = (
              <View key={indexVal} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', width: width * 0.9, marginTop: height * 0.02, justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', marginBottom: height * 0.01 }}>
                  <MenuFilter
                    selected={this.state.filterCategories}
                    options={['Makanan', 'Minuman', 'Snack']}
                    isModalFilter={true}
                    styleModal={{ right: 0, left: width * 0.05, top: height * 0.3 }}
                    onPress={(opt, styleModal) => this.openModalFilter(opt, styleModal, this.state.filterCategories, 'menu')}
                  />
                  <MenuFilter
                    selected={this.state.filterIstirahat}
                    options={['Istirahat 1', 'Istirahat 2', 'Istirahat 3']}
                    isModalFilter={true}
                    styleModal={{ right: width * 0.05, top: height * 0.3 }}
                    onPress={(opt, styleModal) => {
                      this.openModalFilter(opt, styleModal, this.state.filterIstirahat, 'active')
                    }}
                  />
                </View>

                {listMenuKantin.length == 0 ?
                  <View style={{ justifyContent: 'center', alignItems: 'center', width: width, height: height * 0.59 }}>
                    <Text style={{ fontFamily: fontPlatform(Platform.OS, 'Medium'), fontSize: Style.FONT_SIZE_MID, color: Color.grayText, textAlign: 'center' }}>{`Kantin ini tidak menyediakan untuk\nkategori ${this.state.filterCategories}, silahkan cek menu\nkategori lainnya.`}</Text>
                  </View>
                  :

                  <View style={{ width: width, height: height * 0.59, justifyContent: 'center', alignItems: 'center' }}>

                    <FlatList
                      refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh.bind(this)}
                          colors={['purple', 'pink', 'red', 'blue']}
                        />
                      }
                      data={_.uniqBy(this.props.pilihMakananRedux.listMenuKantin.dataSchedule, 'menu._id')}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item, index }) => {

                        if ((item.breakTime1.available == true) && (this.state.filterIstirahat == 'Istirahat 1') || (item.breakTime2.available == true) && (this.state.filterIstirahat == 'Istirahat 2') || (item.breakTime3.available == true) && (this.state.filterIstirahat == 'Istirahat 3')) {
                          if ((item.monday == true) && (this.state.selectDay == 'Senin') || (item.tuesday == true) && (this.state.selectDay == 'Selasa') || (item.wednesday == true) && (this.state.selectDay == 'Rabu') || (item.thursday == true) && (this.state.selectDay == 'Kamis') || (item.friday == true) && (this.state.selectDay == 'Jumat') || (item.saturday == true) && (this.state.selectDay == 'Sabtu') || (item.sunday == true) && (this.state.selectDay == 'Minggu')) {
                            return (
                              // <View key={index} style={{ borderBottomWidth: index == Object.keys(listMenuKantin).length - 1 ? 0 : 0.4, paddingBottom: height * 0.02, borderBottomColor: Color.grayText, width: width * 0.87, alignSelf: 'center' }}>
                              <CardFood
                                key={item._id}
                                style={{ marginTop: height * 0.02 }}
                                source={{ uri: item.menu.picture }}
                                foodName={item.menu.menuName}
                                price={parseInt(item.menu.price)}
                                number={this.state.filterIstirahat === 'Istirahat 1' ? item.breakTime1.count : this.state.filterIstirahat === 'Istirahat 2' ? item.breakTime2.count : item.breakTime3.count}
                                isEdit={true}
                                styleText={{ justifyContent: 'center' }}
                                increment={() => this.updateCountPesanan('increment', item._id)}
                                decrement={() => this.updateCountPesanan('decrement', item._id)}
                                onPress={() => this.gotoDetail(item.menu)}
                              />
                              // </View>
                            )
                          }
                        }
                      }}
                      extraData={{ ...this.props, ...this.state }}
                      onEndReached={this.onEndReached}
                      onEndReachedThreshold={0.1}
                      ListFooterComponent={() => <FooterLoadingFlatlist isLoading={this.state.isLoading} />}
                      showsVerticalScrollIndicator={false}
                    />
                  </View>
                }

                {
                  this.props.pilihMakananRedux.listMenuKantin.length !== 0 && this.props.akunRedux.balance >= this.props.pilihMakananRedux.calculationPrice ?
                    (
                      <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: height * 0.007 }}>
                        <FooterCart
                          number={this.props.pilihMakananRedux.calculationOrder}
                          price={this.props.pilihMakananRedux.calculationPrice}
                          text={'LANJUTKAN'}
                          disabled={this.props.pilihMakananRedux.calculationOrder == 0 ? true : false}
                          onPress={() => this.gotoTotalPembayaran(this.props.pilihMakananRedux.calculationOrder, this.props.pilihMakananRedux.calculationPrice)}
                        />
                      </View>
                    )
                    :
                    (
                      <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: height * 0.007 }}>
                        <FooterCart
                          number={this.props.pilihMakananRedux.calculationOrder}
                          price={this.props.pilihMakananRedux.calculationPrice}
                          text={'BATAL'}
                          onPress={this.backToPesan}
                          isInfoBalance={true}
                          infoBalance={'transaksi tidak bisa dilanjutkan'}
                          style={{ backgroundColor: Color.primaryPink }}
                        />
                      </View>
                    )
                }
              </View>

            )
            :
            dayActive = (
              <View key={indexVal} style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '65%' }}>
                <Text style={{ fontFamily: fontPlatform(Platform.OS, 'Medium'), fontSize: Style.FONT_SIZE_MID, color: Color.grayText, textAlign: 'center' }}>Kantin hari ini tutup, silahkan pesan {'\n'} di hari berikut yang tersedia ya !</Text>
              </View>
            )
          return dayActive;
        })}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  akunRedux: state.akun,
  pilihMakananRedux: state.pilihMakanan,
  berandaRedux: state.beranda,
  connectionRedux: state.connection
})

const mapDispatchToProps = dispatch => ({
  listMenuByKantinRequest: (val) => dispatch(listMenuByKantinRequest(val)),
  listMenuByKantinSuccess: (val) => dispatch(listMenuByKantinSuccess(val)),
  listMenuByKantinResetRequest: (val) => dispatch(listMenuByKantinResetRequest(val)),
  chosenFood: (val) => dispatch(chosenFood(val)),
  isChangeMenu: (val) => dispatch(isChangeMenu(val)),
  checkConnection: (val) => dispatch(checkConnection(val)),
  isMatch: (val) => dispatch(isMatch(val))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PilihMakananScreen)







import React from 'react';
import _ from 'lodash';
import Moment from 'moment';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { View, ScrollView, FlatList, Text, Platform, RefreshControl } from 'react-native';

import Color from '../../style/color';
import navigation from '../../navigation';
import Style from '../../style/defaultStyle';
import CardDate from '../../components/CardDate';
import CardFood from '../../components/CardFood';
import FooterCart from '../../components/FooterCart';
import HeaderSearch from '../../components/HeaderSearch';
import MenuFilter from '../../components/MenuFilter';
import { width, height } from '../../utils/dimension';
import { checkConnection } from '../connection/action';
import { fontPlatform } from '../../utils/fontPlatform';
import FooterLoadingFlatlist from '../../components/FooterLoadingFlatlist';
import { listMenuByKantinRequest, listMenuByKantinSuccess, listMenuByKantinResetRequest, chosenFood, isChangeMenu, isMatch } from './action';

export class PilihMakananScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tmpListMenuKantin: [],
      filterCategories: 'Makanan',
      filterIstirahat: 'Istirahat 1',
      selectDate: null,
      selectTanggalTutup: null,
      selectDay: null,
      isLoading: false,
      currentPage: 0,
      refreshing: false,
    }
  }

  componentDidMount() {
    this.getListMenuKantin();
    this.props.isChangeMenu(0);
  }

  componentWillReceiveProps(nextProps) {
    const { isError, isLoading, isMatch, isChange } = nextProps.pilihMakananRedux;
    if (!isLoading) {
      this.setState({ isLoading: false });
    }
    if (isLoading == false && isError == false && isMatch == false && isChange == 0) {
      setTimeout(() => {
        this.selectDate(this.props.dataprops.payload.selectDate, this.props.dataprops.payload.closing_schedule, this.props.dataprops.payload.selectDay, 'Makanan');
      }, 100);
    }
  }

  getListMenuKantin() {
    let menuType = this.state.filterCategories == 'Makanan' ? 1 : this.state.filterCategories == 'Minuman' ? 2 : 3;
    this.props.listMenuByKantinRequest({ token: this.props.akunRedux.token, outletCode: this.props.dataprops.payload.outletCode, menuName: '', page: this.state.currentPage, limit: 10, menuType: menuType })
  }

  componentWillUnmount() {
    this.props.dataprops.payload.activeClick();
  }

  selectDate = (date, closing_schedule, day, filterCategories) => {
    this.setState({
      selectDate: date,
      selectTanggalTutup: Moment(closing_schedule).format("YYYY-MM-DD"),
      selectDay: day
    });
    let tempOrder = this.props.pilihMakananRedux.chosenFood.filter(val => val.date == Moment(closing_schedule).format("YYYY-MM-DD"))
    let categories = filterCategories == 'Makanan' ? this.props.pilihMakananRedux.listMenuKantinFood : filterCategories == 'Minuman' ? this.props.pilihMakananRedux.listMenuKantinDrink : this.props.pilihMakananRedux.listMenuKantinSnack;
    console.log('categories', categories);

    if (categories.dataSchedule !== undefined) {
      categories.dataSchedule.map(val => {
        let compare = tempOrder.filter(item => item.id == val.menu._id)
        if (compare.length > 0) {
          val.breakTime1.count = 0;
          val.breakTime2.count = 0;
          val.breakTime3.count = 0;
          compare.map(item => {
            if (item.breakTime == 'Istirahat 1') {
              val.breakTime1.count = item.qty;
            } else if (item.breakTime == 'Istirahat 2') {
              val.breakTime2.count = item.qty;
            } else {
              val.breakTime3.count = item.qty;
            }
          })
        } else {
          val.breakTime1.count = 0;
          val.breakTime2.count = 0;
          val.breakTime3.count = 0;
        }
        return val;
      })
      this.props.isMatch();
      this.props.isChangeMenu(0);
      setTimeout(() => {
        this.props.listMenuByKantinSuccess({ listMenuByCanteen: categories });
      }, 100);
    }
  }

  substringCapital = (param) => {
    let val = param.substring(0, 3);
    return val.toUpperCase();
  }

  gotoTotalPembayaran = (calculationOrder, calculationPrice) => {
    let result = _.chain(this.props.pilihMakananRedux.chosenFood).groupBy("date").map(function (v, i) {
      let istirahat1 = [];
      let istirahat2 = [];
      let istirahat3 = [];
      let total = v.reduce((prev, cur) => prev + cur.totalPrice, 0)
      v.map(val => {
        val.breakTime == 'Istirahat 1' ? istirahat1.push(val) : val.breakTime == 'Istirahat 2' ? istirahat2.push(val) : istirahat3.push(val)
      });

      return {
        date: i,
        istirahat1: istirahat1,
        istirahat2: istirahat2,
        istirahat3: istirahat3,
        total: total
      }
    }).value();
    let menuKantinChosen = {
      orders: result.sort((a, b) => {
        var dateA = new Date(a.date);
        var dateB = new Date(b.date);
        return dateA - dateB;
      }),
      token: this.props.akunRedux.token
    }

    let passProps = {
      calculationOrder,
      calculationPrice,
      menuKantinChosen
    }
    Navigation.push(this.props.componentId, navigation.views.totalPembayaran(passProps))
  }

  backToPesan = () => {
    Navigation.pop(this.props.componentId)
  }

  updateCountPesanan = (param, indexValPesan) => {
    let data;
    let qty;
    let categories = this.state.filterCategories == 'Makanan' ? this.props.pilihMakananRedux.listMenuKantinFood : this.state.filterCategories == 'Minuman' ? this.props.pilihMakananRedux.listMenuKantinDrink : this.props.pilihMakananRedux.listMenuKantinSnack;
    categories.dataSchedule.map((val) => {
      if (val._id == indexValPesan) {
        if (this.state.filterIstirahat == 'Istirahat 1') {
          if (param == 'increment') {
            val.breakTime1.count++;
          } else {
            if (val.breakTime1.count > 0) {
              val.breakTime1.count--;
            }
          }
        } else if (this.state.filterIstirahat == 'Istirahat 2') {
          if (param == 'increment') {
            val.breakTime2.count++;
          } else {
            if (val.breakTime2.count > 0) {
              val.breakTime2.count--;
            }
          }
        } else {
          if (param == 'increment') {
            val.breakTime3.count++;
          } else {
            if (val.breakTime3.count > 0) {
              val.breakTime3.count--;
            }
          }
        }

        qty = this.state.filterIstirahat == 'Istirahat 1' ? val.breakTime1.count : this.state.filterIstirahat == 'Istirahat 2' ? val.breakTime2.count : val.breakTime3.count
        data = {
          id: val.menu._id,
          breakTime: this.state.filterIstirahat,
          date: this.state.selectTanggalTutup,
          nama_menu: val.menu.menuName,
          nama_outlet: val.outletCode.outletName,
          kode_outlet: val.outletCode.outletCode,
          qty: qty,
          jenis_menu: val.menu.menuType,
          price: parseInt(val.menu.price),
          totalPrice: qty * parseInt(val.menu.price)
        }
      }
    });

    this.props.chosenFood(data);
    this.props.isChangeMenu(0);
    this.props.listMenuByKantinSuccess({ listMenuByCanteen: categories });
  }

  gotoDetail = (passProps) => {
    Navigation.push(this.props.componentId, navigation.views.kandunganMakanan(passProps))
  }

  onChangeText = (val) => {
    this.props.isChangeMenu(0);
    let menuType = this.state.filterCategories == 'Makanan' ? 1 : this.state.filterCategories == 'Minuman' ? 2 : 3;
    this.props.listMenuByKantinRequest({ token: this.props.akunRedux.token, outletCode: this.props.dataprops.payload.outletCode, menuName: val, page: 0, limit: 15, menuType: menuType })
  }

  openModalFilter = (opt, styleModal, selected, param) => {
    let data = {
      text: opt,
      selected: selected,
      style: styleModal,
      onPress: param == 'menu' ?
        (val) => {
          val == this.state.filterCategories ?
            this.setState({ filterCategories: val, currentPage: 0 },
              () => Navigation.dismissOverlay('ModalFilter'))
            :
            this.setState({ filterCategories: val, currentPage: 0 },
              () => Navigation.dismissOverlay('ModalFilter')),
            this.props.isChangeMenu(0),
            this.props.listMenuByKantinRequest({ token: this.props.akunRedux.token, outletCode: this.props.dataprops.payload.outletCode, menuName: '', page: 0, limit: 10, menuType: val == 'Makanan' ? 1 : val == 'Minuman' ? 2 : 3 }),
            this.selectDate(this.state.selectDate, this.state.selectTanggalTutup, this.state.selectDay, val)
        } :
        (val) => this.setState({ filterIstirahat: val }, () => Navigation.dismissOverlay('ModalFilter'))
    }
    Navigation.showOverlay(navigation.ModalFilter(data));
  }

  onEndReached = () => {
    let categories = this.state.filterCategories == 'Makanan' ? this.props.pilihMakananRedux.listMenuKantinFood : this.state.filterCategories == 'Minuman' ? this.props.pilihMakananRedux.listMenuKantinDrink : this.props.pilihMakananRedux.listMenuKantinSnack;
    if (!this.state.isLoading && this.state.currentPage < categories.totalPage - 1) {
      this.setState({
        currentPage: this.state.currentPage + 1,
        isLoading: true
      }, () => this.getListMenuKantin(),
        this.props.isChangeMenu(1)
      );
    }
  }

  _onRefresh() {
    let menuType = this.state.filterCategories == 'Makanan' ? 1 : this.state.filterCategories == 'Minuman' ? 2 : 3;
    this.props.isChangeMenu(0);
    this.props.listMenuByKantinRequest({ token: this.props.akunRedux.token, outletCode: this.props.dataprops.payload.outletCode, menuName: '', page: 0, limit: 10, menuType: menuType })
    this.setState({ menuName: '' })
  }

  render() {
    let listMenuKantinFood = '';
    let listMenuKantinDrink = '';
    let listMenuKantinSnack = '';
    let dayOff = this.props.berandaRedux.schedule.slice(1).filter((val) => {
      return Moment(val.closing_schedule).format('YYYY-MM-DD') == Moment(this.state.selectTanggalTutup).format('YYYY-MM-DD')
    });

    if (this.props.pilihMakananRedux.listMenuKantinFood.dataSchedule !== undefined) {
      listMenuKantinFood = this.props.pilihMakananRedux.listMenuKantinFood.dataSchedule.filter((val) => {
        return val.isActive == true && Moment(val.menu.startDateMenu).format('YYYY-MM-DD') <= Moment().format('YYYY-MM-DD');
      });
    }

    if (this.props.pilihMakananRedux.listMenuKantinDrink.dataSchedule !== undefined) {
      listMenuKantinDrink = this.props.pilihMakananRedux.listMenuKantinDrink.dataSchedule.filter((val) => {
        return val.isActive == true && Moment(val.menu.startDateMenu).format('YYYY-MM-DD') <= Moment().format('YYYY-MM-DD');
      });
    }

    if (this.props.pilihMakananRedux.listMenuKantinSnack.dataSchedule !== undefined) {
      listMenuKantinSnack = this.props.pilihMakananRedux.listMenuKantinSnack.dataSchedule.filter((val) => {
        return val.isActive == true && Moment(val.menu.startDateMenu).format('YYYY-MM-DD') <= Moment().format('YYYY-MM-DD');
      });
    }

    let listMenuKantin = this.state.filterCategories == 'Makanan' ? listMenuKantinFood : this.state.filterCategories == 'Minuman' ? listMenuKantinDrink : listMenuKantinSnack;

    return (
      <View style={{ flex: 1, backgroundColor: Color.white, paddingTop: 20 }}>
        <HeaderSearch
          text={'Pilih Makanan'}
          nameIcon={'search'}
          onPress={this.backToPesan}
          onChangeText={(val) => this.onChangeText(val)}
        />
        <View>
          <View style={{ width: width * 0.9, alignSelf: 'center', height: width * 0.17 }}>
            <ScrollView
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              pagingEnabled={false}
            >
              <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                data={this.props.berandaRedux.schedule.slice(1)}
                keyExtractor={(item) => item.closing_schedule}
                renderItem={({ item }) =>
                  <CardDate
                    style={{ marginHorizontal: 5 }}
                    key={item.closing_schedule}
                    isSelected={this.state.selectDate == Moment(item.closing_schedule).format('DD') ? true : false}
                    isActive={item.active}
                    month={this.substringCapital(Moment(item.closing_schedule).format('MMMM'))}
                    date={Moment(item.closing_schedule).format('DD')}
                    day={this.substringCapital(Moment(item.closing_schedule).format('dddd'))}
                    onPress={() => this.selectDate(Moment(item.closing_schedule).format('DD'), item.closing_schedule, Moment(item.closing_schedule).format('dddd'), this.state.filterCategories)}
                  />
                }
                extraData={this.state}
              />
            </ScrollView>
          </View>
        </View>

        {dayOff.map((val, indexVal) => {
          let dayActive;
          val.active ?
            dayActive = (
              <View key={indexVal} style={{ justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', width: width * 0.9, marginTop: height * 0.02, justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', marginBottom: height * 0.01 }}>
                  <MenuFilter
                    selected={this.state.filterCategories}
                    options={['Makanan', 'Minuman', 'Snack']}
                    isModalFilter={true}
                    styleModal={{ right: 0, left: width * 0.05, top: height * 0.3 }}
                    onPress={(opt, styleModal) => this.openModalFilter(opt, styleModal, this.state.filterCategories, 'menu')}
                  />
                  <MenuFilter
                    selected={this.state.filterIstirahat}
                    options={['Istirahat 1', 'Istirahat 2', 'Istirahat 3']}
                    isModalFilter={true}
                    styleModal={{ right: width * 0.05, top: height * 0.3 }}
                    onPress={(opt, styleModal) => {
                      this.openModalFilter(opt, styleModal, this.state.filterIstirahat, 'active')
                    }}
                  />
                </View>

                <View style={{ width: width, height: height * 0.59, justifyContent: 'center', alignItems: 'center' }}>

                  <FlatList
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh.bind(this)}
                        colors={['purple', 'pink', 'red', 'blue']}
                      />
                    }
                    data={_.uniqBy(listMenuKantin, 'menu._id')}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => {

                      if ((item.breakTime1.available == true) && (this.state.filterIstirahat == 'Istirahat 1') || (item.breakTime2.available == true) && (this.state.filterIstirahat == 'Istirahat 2') || (item.breakTime3.available == true) && (this.state.filterIstirahat == 'Istirahat 3')) {
                        if ((item.monday == true) && (this.state.selectDay == 'Senin') || (item.tuesday == true) && (this.state.selectDay == 'Selasa') || (item.wednesday == true) && (this.state.selectDay == 'Rabu') || (item.thursday == true) && (this.state.selectDay == 'Kamis') || (item.friday == true) && (this.state.selectDay == 'Jumat') || (item.saturday == true) && (this.state.selectDay == 'Sabtu') || (item.sunday == true) && (this.state.selectDay == 'Minggu')) {
                          return (
                            // <View key={index} style={{ borderBottomWidth: index == Object.keys(listMenuKantin).length - 1 ? 0 : 0.4, paddingBottom: height * 0.02, borderBottomColor: Color.grayText, width: width * 0.87, alignSelf: 'center' }}>
                            <CardFood
                              key={item._id}
                              style={{ marginTop: height * 0.02 }}
                              source={{ uri: item.menu.picture }}
                              foodName={item.menu.menuName}
                              price={parseInt(item.menu.price)}
                              number={this.state.filterIstirahat === 'Istirahat 1' ? item.breakTime1.count : this.state.filterIstirahat === 'Istirahat 2' ? item.breakTime2.count : item.breakTime3.count}
                              isEdit={true}
                              styleText={{ justifyContent: 'center' }}
                              increment={() => this.updateCountPesanan('increment', item._id)}
                              decrement={() => this.updateCountPesanan('decrement', item._id)}
                              onPress={() => this.gotoDetail(item.menu)}
                            />
                            // </View>
                          )
                        }
                      }
                    }}
                    extraData={{ ...this.props, ...this.state }}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={() => <FooterLoadingFlatlist isLoading={this.state.isLoading} />}
                    showsVerticalScrollIndicator={false}
                  />
                </View>

                {
                  listMenuKantinFood.length !== 0 && this.props.akunRedux.balance >= this.props.pilihMakananRedux.calculationPrice ?
                    (
                      <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: height * 0.007 }}>
                        <FooterCart
                          number={this.props.pilihMakananRedux.calculationOrder}
                          price={this.props.pilihMakananRedux.calculationPrice}
                          text={'LANJUTKAN'}
                          disabled={this.props.pilihMakananRedux.calculationOrder == 0 ? true : false}
                          onPress={() => this.gotoTotalPembayaran(this.props.pilihMakananRedux.calculationOrder, this.props.pilihMakananRedux.calculationPrice)}
                        />
                      </View>
                    )
                    :
                    (
                      <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: height * 0.007 }}>
                        <FooterCart
                          number={this.props.pilihMakananRedux.calculationOrder}
                          price={this.props.pilihMakananRedux.calculationPrice}
                          text={'BATAL'}
                          onPress={this.backToPesan}
                          isInfoBalance={true}
                          infoBalance={'transaksi tidak bisa dilanjutkan'}
                          style={{ backgroundColor: Color.primaryPink }}
                        />
                      </View>
                    )
                }
              </View>

            )
            :
            dayActive = (
              <View key={indexVal} style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '65%' }}>
                <Text style={{ fontFamily: fontPlatform(Platform.OS, 'Medium'), fontSize: Style.FONT_SIZE_MID, color: Color.grayText, textAlign: 'center' }}>Kantin hari ini tutup, silahkan pesan {'\n'} di hari berikut yang tersedia ya !</Text>
              </View>
            )
          return dayActive;
        })}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  akunRedux: state.akun,
  pilihMakananRedux: state.pilihMakanan,
  berandaRedux: state.beranda,
  connectionRedux: state.connection
})

const mapDispatchToProps = dispatch => ({
  listMenuByKantinRequest: (val) => dispatch(listMenuByKantinRequest(val)),
  listMenuByKantinSuccess: (val) => dispatch(listMenuByKantinSuccess(val)),
  listMenuByKantinResetRequest: (val) => dispatch(listMenuByKantinResetRequest(val)),
  chosenFood: (val) => dispatch(chosenFood(val)),
  isChangeMenu: (val) => dispatch(isChangeMenu(val)),
  checkConnection: (val) => dispatch(checkConnection(val)),
  isMatch: (val) => dispatch(isMatch(val))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PilihMakananScreen)

