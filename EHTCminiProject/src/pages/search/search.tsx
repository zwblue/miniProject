import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'

import request, { searchStock } from '../../api'

import './search.scss'


type PageOwnProps = {}

type PageState = {
  searchCodeArray: any[];
  savedCodeArray: any[];
  isLoading: boolean;
  inputVaule: string;
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
    searchCodeArray: [],      // 当前搜索结果的列表数据
    savedCodeArray: [],       // 缓存保存的已添加的数据
    isLoading: false,         // 接口慢时，还是上一个接口请求时的
    inputVaule: ''            // 保存value值，来判断没有搜索到相关股票的显示
  }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { 
    const savedCodeArray = Taro.getStorageSync('savedCodeArray') || []
    this.setState({
      savedCodeArray
    })
  }

  componentDidHide () { }
  onInput = ({target}) => {
    console.log(target.value)
    this.setState({
      inputVaule: target.value
    })
    this.changeInputValue(target.value)
  }
  async changeInputValue (inputValue) {
    this.setState({
      isLoading: true
    })
    try {
      const {data} = await request(searchStock, {
        keyWords: inputValue
      })
      this.setState({
        searchCodeArray: data
      })
      this.setState({
        isLoading: false
      })
    } catch (error) {
      console.log(error)
      this.setState({
        isLoading: false
      })
    }
  }
  addStockCodeToStorage (val) {
    console.log('setsyncStorage', val)
    try {
      const savedCodeArray = Taro.getStorageSync('savedCodeArray') || []
      savedCodeArray.push(val)
      this.setState({
        savedCodeArray
      })
      Taro.setStorageSync('savedCodeArray', savedCodeArray)
    } catch (e) {
      console.log('暂未在storage存储addedStockCodeArray的值')
    }
  }
  render () {
    const {searchCodeArray, savedCodeArray, inputVaule } = this.state
    return (
      <View className='index'>
        <View className="search-box">
          <View className="search-button">
            <View className="search-icon"></View>
            <Input className="search-input" onInput={this.onInput} placeholder='请输入股票代码/简拼'></Input>
          </View>
        </View>
        <View className='list-box'>
        {
          searchCodeArray.map((item,index)=>{
            return (
              <View key={index} className='item-box bot-bd'>
                <View className="lf-area">
                  <View className="item-name">{item.stockName}</View>
                  <View className="item-code">{item.stockCode}</View>
                </View>
                <View className="rt-area">
                  { savedCodeArray.includes(item.stockCode) && <View><Text>已添加</Text></View>}
                  { !savedCodeArray.includes(item.stockCode) && <View className='add-icon' onClick={this.addStockCodeToStorage.bind(this,item.stockCode)}>
                  </View>}
                </View>
              </View>
            )
          })
        }
          {!searchCodeArray.length && inputVaule && <View className='no-data'>
            没有搜索到相关股票
          </View>}
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

export default Index as ComponentClass<PageOwnProps, PageState>
