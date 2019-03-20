import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import ShareIndex from '../../components/ShareIndex'
import OptionalTitle from '../../components/optional/OptionalTitle'
import OptionalList from '../../components/optional/OptionalList'

import request, { marketIndex, optionStock } from '../../api'
import {parseData} from '../../utils/index'

import './optional.scss'


type PageOwnProps = {}

type PageState = {
  shareIndexData: {
    data:any[],
    field: any[]
  },
  savedCodeArray: [],
  optionalStockList: []
}

interface Index {
  props: PageOwnProps;
  state: PageState;
}

class Index extends Component {
  
    config: Config = {
    navigationBarTitleText: '首页'
  }
  state = {
    shareIndexData: {
      data:[],
      field:[]
    },
    savedCodeArray: [],
    optionalStockList: []
  }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  componentDidMount() {
    this.getShareIndexData()
  }
  componentWillUnmount () { }
  componentDidShow () { 
    const savedCodeArray = Taro.getStorageSync('savedCodeArray')
    this.setState({
      savedCodeArray
    })
    this.getOptionData(savedCodeArray)
  }

  componentDidHide () { }
  async getOptionData (savedCodeArray) {
    console.log(3333, savedCodeArray)
    if (savedCodeArray.length > 0) {
      try {
        const {data} = await request(optionStock, {
          goodsList: savedCodeArray
        })
        // 需要的值对应的key数组
        const needKeys = ['goodsName', 'goodsCode', 'lastPrice', 'currentPrice', 'rise', 'increase']
        const optionalStockList = parseData(data, 'data', 'field', needKeys)
        console.log(5666, optionalStockList)
        this.setState({
          optionalStockList
        })
      } catch (err) {
        console.log('optionStock接口报错', err)
      }
    }
  }
  async getShareIndexData () {
    const {data} = await request(marketIndex)
    console.log('shareIndex', data)
    this.setState({
      shareIndexData: data
    })
  }
  render () {
    const {shareIndexData, optionalStockList} = this.state
    return (
      <View className='optional-page'>
        <ShareIndex shareIndexData={shareIndexData}></ShareIndex>
        <OptionalTitle></OptionalTitle>
        <OptionalList optionalStockList={optionalStockList}></OptionalList>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as ComponentClass<PageOwnProps, PageState>
