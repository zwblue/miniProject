import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './SearchEntry.scss'


type PageOwnProps = {}

type PageState = {}

interface SearchEntry {
  props: PageOwnProps;
}

class SearchEntry extends Component {
  onStockSearchEvent = ():void => {
    Taro.navigateTo({
      url: '../search/search'
    })
  }
  render () {
    return (
      <View className="search-box" onClick={this.onStockSearchEvent}>
        <View className="search-button">
          <View className="search-icon"></View>
          <View className="search-text"><Text>请输入股票代码/简拼</Text></View>
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

export default SearchEntry as ComponentClass<PageOwnProps, PageState>
