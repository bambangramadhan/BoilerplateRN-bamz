import React from 'react';
import Moment from 'moment';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { View, Text, ScrollView, Platform, RefreshControl, FlatList } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";

import Color from '../../style/color';
import navigation from '../../navigation/';
import Header from '../../components/Header';
import Style from '../../style/defaultStyle';
import MenuFilter from '../../components/MenuFilter';
import { width, height } from '../../utils/dimension';
import { fontPlatform } from '../../utils/fontPlatform';
import rupiahConverter from '../../utils/rupiahConverter';
import TextMutasiDeposit from '../../components/TextMutasiDeposit';
import TextMutasiAplication from '../../components/TextMutasiAplication';
import FooterLoadingFlatlist from '../../components/FooterLoadingFlatlist';
import { listMyTransactionRequest, listMyTransactionSuccess, isFilterMutasi, listMyTransactionDateRequest } from './action';

export class MutasiScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      selectDate: 'Pilih Tanggal',
      allFilter: 'Semua Filter',
      selectedFilterDate: 1,
      selectedFilterAll: 1,
      isDateTimePickerVisible: false,
      date: '',
      listMyTransactionState: [],
      refreshing: false,
      isLoading: false,
      currentPage: 0,
    }
  }

  async componentWillReceiveProps(nextProps) {
    const { isError, isLoading, isFilter } = nextProps.mutasiRedux;
    if (isError == false && isLoading == false && isFilter == 0) {
      Navigation.dismissOverlay("ModalLoading");
    }
  }

  componentDidAppear() {
    if (this.props.mutasiRedux.listMyTransaction.aplication == undefined) {
      this.props.listMyTransactionRequest({ token: this.props.akunRedux.token, filter: 4, page: 0 });
      Navigation.showOverlay(navigation.ModalLoading());
      this.props.isFilterMutasi(0);
    }
  }

  _onRefresh() {
    let filter = this.state.allFilter == 'Semua Filter' ? 4 : this.state.allFilter == 'Aplikasi' ? 0 : this.state.allFilter == 'Kasir' ? 1 : this.state.allFilter == 'Pengembalian' ? 2 : 3;
    this.props.listMyTransactionRequest({ token: this.props.akunRedux.token, filter: filter, page: 0 });
    this.setState({ selectDate: 'Pilih Tanggal' })
  }

  getMutasi() {
    let filter = this.state.allFilter == 'Semua Filter' ? 4 : this.state.allFilter == 'Aplikasi' ? 0 : this.state.allFilter == 'Kasir' ? 1 : this.state.allFilter == 'Pengembalian' ? 2 : 3;
    this.props.listMyTransactionRequest({ token: this.props.akunRedux.token, filter: filter, page: this.state.currentPage });
  }

  gotoNotification = () => {
    Navigation.push(this.props.componentId, navigation.views.notifikasi());
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    let filter = this.state.allFilter == 'Semua Filter' ? 4 : this.state.allFilter == 'Aplikasi' ? 0 : this.state.allFilter == 'Kasir' ? 1 : this.state.allFilter == 'Pengembalian' ? 2 : 3;
    this.hideDateTimePicker();
    this.props.listMyTransactionDateRequest({ token: this.props.akunRedux.token, filter: filter, startDate: Moment(date).format('LL'), endDate: Moment(date).format('LL') });
    Navigation.showOverlay(navigation.ModalLoading());
    this.props.isFilterMutasi(0);
    this.setState({ selectDate: Moment(date).format('LL') });
  };

  openModalFilter = (opt, styleModal, selected) => {
    let data = {
      text: opt,
      selected: selected,
      style: styleModal,
      onPress: (val) => {
        let filter = val == 'Semua Filter' ? 4 : val == 'Aplikasi' ? 0 : val == 'Kasir' ? 1 : val == 'Pengembalian' ? 2 : 3;
        val == this.state.allFilter ?
          this.setState({ allFilter: val }, () => Navigation.dismissOverlay('ModalFilter'))
          :
          this.setState({ allFilter: val, selectDate: 'Pilih Tanggal' }, () => Navigation.dismissOverlay('ModalFilter'), this.props.listMyTransactionRequest({ token: this.props.akunRedux.token, filter: filter, page: 0 }), this.props.isFilterMutasi(2))
      }
    }
    Navigation.showOverlay(navigation.ModalFilter(data));
  }

  splitName = (name) => {
    let split = name.split(" ")
    return split[0];
  }

  onEndReachedMutasi = () => {
    if (!this.state.isLoading && this.state.currentPage < this.props.mutasiRedux.listMyTransaction.totalPage - 1) {
      this.setState({
        currentPage: this.state.currentPage + 1,
        isLoading: true
      }, () => this.getMutasi());
    }
  }

  render() {
    let listMyTransaction;

    if (this.props.mutasiRedux.listMyTransactionAll !== undefined) {
      if (this.state.allFilter == 'Semua Filter') {
        listMyTransaction = (
          <FlatList
            data={this.props.mutasiRedux.listMyTransactionAll}
            keyExtractor={(item) => item._id}
            renderItem={({ item, index }) => {
              if (item.type !== 'deposit') {
                return (
                  <TextMutasiAplication
                    created_at={Moment(item.created_at).format('LLLL')}
                    checkOutDate={`${Moment(item.checkOutDate).format('dddd')}, ${Moment(item.checkOutDate).format('D')} ${Moment(item.checkOutDate).format('MMMM')}`}
                    transactionDetail={item.transactionDetail}
                    outletName={item.outletName}
                    total={this.props.mutasiRedux.totalPrice}
                    balance={item.balance}
                    index={index}
                    transactionType={item.transactionType}
                    listMyTransactionState={this.props.mutasiRedux.listMyTransactionAll}
                  />

                )
              } else {
                return (
                  <TextMutasiDeposit
                    created_at={Moment(item.created_at).format('LLLL')}
                    status={item.status}
                    type={item.type}
                    depositBalance={item.depositBalance}
                    index={index}
                    listMyTransactionState={this.props.mutasiRedux.listMyTransactionAll}
                  />
                )
              }
            }}
            extraData={{ ...this.state, ...this.props }}
          />
        )

        // this.props.mutasiRedux.listMyTransactionAll.map((val, index) => {
        //   if (val.type == 'deposit') {
        //     return (
        //       <View key={val._id}>
        //         <TextMutasiDeposit
        //           created_at={Moment(val.created_at).format('LLLL')}
        //           status={val.status}
        //           type={val.type}
        //           depositBalance={val.depositBalance}
        //           index={index}
        //           listMyTransactionState={this.props.mutasiRedux.listMyTransactionAll}
        //         />
        //       </View>
        //     )
        //   } else {
        //     return (
        //       <View key={val._id}>
        //         <TextMutasiAplication
        //           created_at={Moment(val.created_at).format('LLLL')}
        //           checkOutDate={`${Moment(val.checkOutDate).format('dddd')}, ${Moment(val.checkOutDate).format('D')} ${Moment(val.checkOutDate).format('MMMM')}`}
        //           transactionDetail={val.transactionDetail}
        //           outletName={val.outletName}
        //           total={this.props.mutasiRedux.totalPrice}
        //           balance={val.balance}
        //           index={index}
        //           transactionType={val.transactionType}
        //           listMyTransactionState={this.props.mutasiRedux.listMyTransactionAll}
        //         />
        //       </View>
        //     )
        //   }
        // })
      }
    }

    if (this.props.mutasiRedux.listMyTransaction !== undefined) {
      if (this.state.allFilter == 'Topup') {
        if (this.props.mutasiRedux.listMyTransaction.deposit !== undefined) {
          listMyTransaction = (
            <FlatList
              data={this.props.mutasiRedux.listMyTransaction.deposit}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) =>
                <TextMutasiDeposit
                  created_at={Moment(item.created_at).format('LLLL')}
                  status={item.status}
                  type={item.type}
                  depositBalance={item.depositBalance}
                  index={index}
                  listMyTransactionState={this.props.mutasiRedux.listMyTransaction}
                />
              }
              extraData={{ ...this.state, ...this.props }}
            />
          )



          // this.props.mutasiRedux.listMyTransaction.deposit.map((val, index) => {
          //   return (
          //     <View key={val._id}>
          //       <TextMutasiDeposit
          //         created_at={Moment(val.created_at).format('LLLL')}
          //         status={val.status}
          //         type={val.type}
          //         depositBalance={val.depositBalance}
          //         index={index}
          //         listMyTransactionState={this.props.mutasiRedux.listMyTransaction}
          //       />
          //     </View>
          //   )
          // })
        }
      } else {
        if (this.props.mutasiRedux.listMyTransaction.aplication !== undefined) {
          listMyTransaction = (
            <FlatList
              data={this.props.mutasiRedux.listMyTransaction.aplication}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) =>
                <TextMutasiAplication
                  created_at={Moment(item.created_at).format('LLLL')}
                  checkOutDate={`${Moment(item.checkOutDate).format('dddd')}, ${Moment(item.checkOutDate).format('D')} ${Moment(item.checkOutDate).format('MMMM')}`}
                  transactionDetail={item.transactionDetail}
                  outletName={item.outletName}
                  total={this.props.mutasiRedux.totalPrice}
                  balance={item.balance}
                  index={index}
                  transactionType={item.transactionType}
                  listMyTransactionState={this.props.mutasiRedux.listMyTransaction}
                />
              }
              extraData={{ ...this.state, ...this.props }}
            />
          )


          // this.props.mutasiRedux.listMyTransaction.aplication.map((val, index) => {
          //   return (
          //     <View key={val._id}>
          //       <TextMutasiAplication
          //         created_at={Moment(val.created_at).format('LLLL')}
          //         checkOutDate={`${Moment(val.checkOutDate).format('dddd')}, ${Moment(val.checkOutDate).format('D')} ${Moment(val.checkOutDate).format('MMMM')}`}
          //         transactionDetail={val.transactionDetail}
          //         outletName={val.outletName}
          //         total={this.props.mutasiRedux.totalPrice}
          //         balance={val.balance}
          //         index={index}
          //         transactionType={val.transactionType}
          //         listMyTransactionState={this.props.mutasiRedux.listMyTransaction}
          //       />
          //     </View>
          //   )
          // })
        }
      }
    }


    return (
      <View style={{ flex: 1, backgroundColor: Color.white, paddingTop: 20 }}>
        <Header
          type={'notif'}
          title={`Hi, ${this.splitName(this.props.akunRedux.profile.customerName)} !`}
          subtitle={'Summary of your transaction history'}
          onPress={this.gotoNotification}
        />
        <View style={{ flexDirection: 'row', width: width * 0.9, height: height * 0.07, justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center' }}>
          <MenuFilter
            selected={this.state.selectDate}
            styleModal={{ bottom: height * 0.6, right: width * 0.67 }}
            onPress={this.showDateTimePicker}
          />
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
          />
          <MenuFilter
            selected={this.state.allFilter}
            options={['Semua Filter', 'Aplikasi', 'Kasir', 'Pengembalian', 'Topup']}
            isModalFilter={true}
            styleModal={{ right: width * 0.05, top: height * 0.22 }}
            onPress={(opt, styleModal) => this.openModalFilter(opt, styleModal, this.state.allFilter)}
          />
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
              colors={['purple', 'pink', 'red', 'blue']}
            />
          }
          onEndReached={this.onEndReachedMutasi}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => <FooterLoadingFlatlist isLoading={this.state.isLoading} />}
        >
          <View style={{ width: width * 0.8, height: '100%', alignSelf: 'center' }}>
            {listMyTransaction}
          </View>
        </ScrollView>

      </View>
    )
  }
}

const mapStateToProps = state => ({
  akunRedux: state.akun,
  mutasiRedux: state.mutasi
})

const mapDispatchToProps = dispatch => ({
  listMyTransactionRequest: (data) => dispatch(listMyTransactionRequest(data)),
  listMyTransactionSuccess: (data) => dispatch(listMyTransactionSuccess(data)),
  isFilterMutasi: (data) => dispatch(isFilterMutasi(data)),
  listMyTransactionDateRequest: (data) => dispatch(listMyTransactionDateRequest(data)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MutasiScreen)