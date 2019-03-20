import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './OptionalList.scss'


type PageOwnProps = {
  optionalStockList: any[]
}

type PageState = {
  titleItems: {name: string; sort: string; key: string; }[];
  handleOptionalList: [];
  sortIndex: number;
}

interface OptionalList {
  props: PageOwnProps;
  state: PageState;
}

class OptionalList extends Component {
  static options = {
    addGlobalClass: true
  }
    config: Config = {
    navigationBarTitleText: '首页'
  }
  static defaultProps = {
    optionalStockList: []
  }
  state = {
    titleItems: [
      { name: '名称', sort: '', key: 'goodsName' },
      { name: '最新价', sort: '', key: 'currentPrice' },
      { name: '涨跌', sort: '', key: 'rise' },
      { name: '涨跌幅', sort: '', key: 'increase' }
    ],
    handleOptionalList: [],
    sortIndex: -1
  }
  componentWillReceiveProps (nextProps) {
    console.log(88888, this.props.optionalStockList, nextProps.optionalStockList)
    if(this.props.optionalStockList !== nextProps.optionalStockList) {
      this.handleOptionalList(nextProps.optionalStockList)
    }
  }

  componentWillUnmount () { }

  componentDidShow () { 
  }

  componentDidHide () { }
  handleOptionalList (optionalList = this.props.optionalStockList ) {
    // 若当前价格为0 则显示lastPrice
    console.log(3333, optionalList)
    const newOptionalList = optionalList.map((item) => {
      if (parseInt(item.currentPrice) === 0) {
        return {
          ...item, currentPrice: item.lastPrice, rise: '0.0', increase: '0.00', isGray: true
        }
      } else {
        return item
      }
    })
    // 根据sortIndex有排序来对数据进行排序
    const {sortIndex, titleItems} = this.state
    if (sortIndex!== -1) {
      const sortType = titleItems[sortIndex].sort
      const key = titleItems[sortIndex].key
      if (sortType === 'up') {
        newOptionalList.sort((a, b) => { return a[key] - b[key] })
      } else {
        newOptionalList.sort((a, b) => { return b[key] - a[key] })
      }
    }
    console.log('newOptionalList',newOptionalList)
    this.setState({
      handleOptionalList: newOptionalList
    })
  }
  setSort (index) {
    const {sortIndex, titleItems} = this.state
    // 设定能排序的title下标 ，不能设置的不执行该方法
    const canSetSortArrary = [1, 3]
    if (!canSetSortArrary.includes(index)) { return }
    // 设置若反复点击则设他的反排序
    if (sortIndex === index) {
      const sortType = titleItems[index].sort === 'up' ? 'down' : 'up'
      const copyTitleItems = titleItems
      copyTitleItems[index].sort = sortType
      this.setState({
        titleItems: copyTitleItems
      })
    } else {
      const copyTitleItems = titleItems
      copyTitleItems[index].sort = 'up'
      this.setState({
        titleItems: copyTitleItems
      })
    }
    this.setState({
      sortIndex: index
    })
    // 将其他的sort初始化 each不行
    const newtitleItems = titleItems.map((element, tindex) => {
      if (index !== tindex) {
        return {
          ...element, sort: ''
        }
      } else {
        return element
      }
    })
    this.setState({
      titleItems: newtitleItems
    },()=>{
      this.handleOptionalList()
    })
  }
  jumpToPage = () => {
    Taro.navigateTo({
      url: '../search/main'
    })
  }
  render () {
    const {titleItems, handleOptionalList} = this.state
    return (
      <View className='optional-list-page'>
        <View className="title-box bot-bd">
          {titleItems.map((item, index)=>{
            return (
              <View key={index} className={'area' + index} onClick={this.setSort.bind(this, index)}>
                {item.name} {item.sort ? item.sort === 'up' ? '↑' : '↓' : '' }
              </View>
            )
          })}
        </View>
        <View className="list-box">
          {handleOptionalList.map((item,index)=>{
            return (
              <View key={index} className="item-box bot-bd">
                <View className="item-desc area0">
                  <View className="name">
                    {item.goodsName}
                  </View>
                  <View className="code">
                    {item.goodsCode}
                  </View>
                </View>
                <View className={`area1 item-price ${item.rise >= 0 ? 'red' : 'greem' } ${ item.isGray ? 'gray': ''}`}>{item.currentPrice}</View>
                <View className={`area2 item-rise ${item.rise >= 0 ? 'red' : 'greem' } ${ item.isGray ? 'gray': ''}`}>{item.rise}</View>
                <View className={`area3 item-increase ${item.rise >= 0 ? 'red' : 'greem' } ${ item.isGray ? 'gray': ''}`} >{item.increase + '%'}</View>
              </View>
            )
          })}
        </View>
        <View className="add-optiona bot-bd" onClick={this.jumpToPage}>
            <View className="add-icon"></View>
        </View>
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

export default OptionalList as ComponentClass<PageOwnProps, PageState>
