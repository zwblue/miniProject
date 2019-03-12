import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import SearchEntry from '../../components/SearchEntry'
import BaseMenu from '../../components/BaseMenu'
import ShareIndex from '../../components/ShareIndex'
import request, { getnews24List, marketIndex } from '../../api'
import './index.scss'


type PageOwnProps = {}

type PageState = {
  shareIndexData: {
    data: string[],
    field: string[]
  }
}

interface Index {
  props: PageOwnProps;
}

class Index extends Component {
    config: Config = {
    navigationBarTitleText: '首页'
  }
  state = {
    shareIndexData: {
      field: [],
      data: [],
    }
  }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  componentDidMount () {
    this.getShareIndexData()
  }
  async getShareIndexData () {
    const {data} = await request(marketIndex)
    console.log('shareIndex', data)
    this.setState({ shareIndexData : data })
  }
  componentDidShow () { 
  }

  componentDidHide () { }

  render () {
    const {shareIndexData} = this.state
    return (
      <View className='container'>
        <SearchEntry></SearchEntry>
        <BaseMenu menuData={[]}></BaseMenu>
        <View className="divider"></View>
        <ShareIndex shareIndexData={shareIndexData} ></ShareIndex>
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
