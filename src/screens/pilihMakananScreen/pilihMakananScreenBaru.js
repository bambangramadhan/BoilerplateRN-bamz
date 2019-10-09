import React from 'react';
import _ from 'lodash';
import Moment from 'moment';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { View, ScrollView, FlatList } from 'react-native';

import Color from '../../style/color';
import navigation from '../../navigation';
import CardDate from '../../components/CardDate';
import CardFood from '../../components/CardFood';
import { isEdit } from '../totalPembayaran/action';
import FooterCart from '../../components/FooterCart';
import HeaderFood from '../../components/HeaderFood';
import MenuFilter from '../../components/MenuFilter';
import { width, height } from '../../utils/dimension';
import FooterLoadingFlatlist from '../../components/FooterLoadingFlatlist';
import { listMenuByKantinRequest, listMenuByKantinSuccess, listMenuByKantinResetRequest, chosenFood } from './action';

export class PilihMakananScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tmpListMenuKantin: [],
      menuName: '',
      istirahat1: true,
      istirahat2: false,
      istirahat3: false,
      filterCategories: 'Makanan',
      filterIstirahat: 'Istirahat 1',
      selectDate: null,
      selectTanggalTutup: null,
      isLoading: false,
      currentPage: 0,
    }
  }

  componentDidMount() {
    this.getListMenuKantin();
    this.selectDate(this.props.dataprops.payload.selectDate, this.props.dataprops.payload.closing_schedule);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.pilihMakananRedux.isLoading) {
      this.setState({ isLoading: false });
    }
  }

  getListMenuKantin() {
    let menuType = this.state.filterCategories == 'Makanan' ? 1 : this.state.filterCategories == 'Minuman' ? 2 : 3;
    this.props.listMenuByKantinRequest({ token: this.props.akunRedux.token, outletCode: this.props.dataprops.payload.outletCode, menuName: '', page: this.state.currentPage, menuType: menuType })
  }

  componentWillUnmount() {
    this.props.dataprops.payload.activeClick();
  }

  selectDate = (date, closing_schedule) => {
    this.setState({
      selectDate: date,
      selectTanggalTutup: Moment(closing_schedule).format("YYYY-MM-DD")
    });
    let tempOrder = this.props.pilihMakananRedux.chosenFood.filter(val => val.date == Moment(closing_schedule).format("YYYY-MM-DD"))
    if (this.props.pilihMakananRedux.listMenuKantin.listMenuByCanteen !== undefined) {
      let sameOrder = this.props.pilihMakananRedux.listMenuKantin.listMenuByCanteen;
      sameOrder.map(val => {
        let compare = tempOrder.filter(item => item.id == val.menu._id && this.state.filterIstirahat == item.breakTime)
        if (compare.length > 0) {
          if (compare[0].breakTime == 'Istirahat 1') {
            val.breakTime1.count = compare[0].qty
          } else if (compare[0].breakTime == 'Istirahat 2') {
            val.breakTime2.count = compare[0].qty
          } else {
            val.breakTime3.count = compare[0].qty
          }
        } else {
          if (this.state.filterIstirahat == 'Istirahat 1') {
            val.breakTime1.count = 0
          } else if (this.state.filterIstirahat == 'Istirahat 2') {
            val.breakTime2.count = 0
          } else {
            val.breakTime3.count = 0
          }
        }
        return val;
      })
      sameOrder = this.props.pilihMakananRedux.listMenuKantin;
      this.props.listMenuByKantinSuccess(sameOrder)
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
      })

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
    this.props.isEdit(0);
    Navigation.push(this.props.componentId, navigation.views.totalPembayaran(passProps))
  }

  backToPesan = () => {
    Navigation.pop(this.props.componentId)
  }

  updateCountPesanan = (param, indexValPesan) => {
    let data;
    let qty;
    let tmpListMenuKantin = this.props.pilihMakananRedux.listMenuKantin.listMenuByCanteen;
    tmpListMenuKantin.map((val) => {
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
    tmpListMenuKantin = this.props.pilihMakananRedux.listMenuKantin;
    this.props.listMenuByKantinSuccess(tmpListMenuKantin);
  }

  gotoDetail = (passProps) => {
    Navigation.push(this.props.componentId, navigation.views.kandunganMakanan(passProps))
  }

  onChangeText = (val) => {
    this.setState({ menuName: val })
    let menuType = this.state.filterCategories == 'Makanan' ? 1 : this.state.filterCategories == 'Minuman' ? 2 : 3;
    this.props.listMenuByKantinRequest({ token: this.props.akunRedux.token, outletCode: this.props.dataprops.payload.outletCode, menuName: val, page: 0, menuType: menuType })
  }

  openModalFilter = (opt, styleModal, selected, param) => {
    let data = {
      text: opt,
      selected: selected,
      style: styleModal,
      onPress: param == 'menu' ?
        (val) => this.setState({ filterCategories: val, currentPage: 0 }, () => Navigation.dismissOverlay('ModalFilter')) :
        (val) => {
          val === 'Istirahat 1' ?
            this.setState({
              filterIstirahat: val,
              istirahat1: true,
              istirahat2: false,
              istirahat3: false
            }, () => Navigation.dismissOverlay('ModalFilter'))
            :
            val === 'Istirahat 2' ?
              this.setState({
                filterIstirahat: val,
                istirahat1: false,
                istirahat2: true,
                istirahat3: false
              }, () => Navigation.dismissOverlay('ModalFilter'))
              :
              this.setState({
                filterIstirahat: val,
                istirahat1: false,
                istirahat2: false,
                istirahat3: true
              }, () => Navigation.dismissOverlay('ModalFilter'))
        }
    }
    Navigation.showOverlay(navigation.ModalFilter(data));
  }

  onEndReached = () => {
    if (this.props.pilihMakananRedux.listMenuKantin.listMenuByCanteen !== undefined) {
      if (!this.state.isLoading && this.state.currentPage < this.props.pilihMakananRedux.listMenuKantin.listMenuByCanteen[0].totalPage - 1) {
        this.setState({
          currentPage: this.state.currentPage + 1,
          isLoading: true
        }, () => this.getListMenuKantin());
      }
    }
  }

  render() {
    let listMenuKantin = '';

    if (this.props.pilihMakananRedux.listMenuKantin.listMenuByCanteen !== undefined) {
      listMenuKantin = this.props.pilihMakananRedux.listMenuKantin.listMenuByCanteen.filter((val) => {
        return val.isActive == true;
      });
    }

    return (
      <View style={{ flex: 1, backgroundColor: Color.white, paddingTop: 20 }}>
        <HeaderFood
          value={this.state.menuName}
          text={'Pilih Makanan'}
          nameIcon={'search'}
          onPress={this.backToPesan}
          onChangeText={(val) => this.onChangeText(val)}
        />
        <View>
          <View style={{ width: width * 0.9, alignSelf: 'center', height: width * 0.17, }}>
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
                    onPress={() => this.selectDate(Moment(item.closing_schedule).format('DD'), item.closing_schedule, (item.day + '' + item.date + ' ' + item.month))}
                  />
                }
                extraData={this.state}
              />
            </ScrollView>
          </View>

          <View style={{ flexDirection: 'row', width: width * 0.9, marginTop: height * 0.02, justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center' }}>
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
        </View>

        <View style={{ width: width, height: height * 0.59, justifyContent: 'center', alignItems: 'center' }}>

          <FlatList
            data={_.uniqBy(listMenuKantin, 'menu._id')}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {

              if ((item.breakTime1.available === this.state.istirahat1) && (this.state.filterIstirahat === 'Istirahat 1') || (item.breakTime2.available === this.state.istirahat2) && (this.state.filterIstirahat === 'Istirahat 2') || (item.breakTime3.available === this.state.istirahat3) && (this.state.filterIstirahat === 'Istirahat 3')) {
                let menuType = item.menu.menuType == 1 ? 'Makanan' : item.menu.menuType == 2 ? 'Minuman' : 'Snack';
                if (menuType == this.state.filterCategories) {
                  return (
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
                  )
                }

              }
            }}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => <FooterLoadingFlatlist isLoading={this.state.isLoading} />}
          />
        </View>

        {
          listMenuKantin.length !== 0 && this.props.akunRedux.balance > this.props.pilihMakananRedux.calculationPrice ?
            (
              <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: height * 0.02 }}>
                <FooterCart
                  number={this.props.pilihMakananRedux.calculationOrder}
                  price={this.props.pilihMakananRedux.calculationPrice}
                  text={'LANJUTKAN'}
                  onPress={() => this.gotoTotalPembayaran(this.props.pilihMakananRedux.calculationOrder, this.props.pilihMakananRedux.calculationPrice)}
                />
              </View>
            )
            :
            (
              <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: height * 0.02 }}>
                <FooterCart
                  number={this.props.pilihMakananRedux.calculationOrder}
                  price={this.props.pilihMakananRedux.calculationPrice}
                  text={'BATAL'}
                  onPress={this.backToPesan}
                  isInfoBalance={true}
                  infoBalance={'saldo tidak cukup'}
                  style={{ backgroundColor: Color.primaryPink }}
                />
              </View>
            )
        }

      </View>
    )
  }
}

const mapStateToProps = state => ({
  akunRedux: state.akun,
  pilihMakananRedux: state.pilihMakanan,
  berandaRedux: state.beranda
})

const mapDispatchToProps = dispatch => ({
  listMenuByKantinRequest: (val) => dispatch(listMenuByKantinRequest(val)),
  listMenuByKantinSuccess: (val) => dispatch(listMenuByKantinSuccess(val)),
  listMenuByKantinResetRequest: (val) => dispatch(listMenuByKantinResetRequest(val)),
  chosenFood: (val) => dispatch(chosenFood(val)),
  isEdit: (val) => dispatch(isEdit(val))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PilihMakananScreen)

09.31, 'Jumat 12 Juli 2019'