import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import SearchEntry from '../../components/SearchEntry'
import HomeMenu from '../../components/home/HomeMenu'
import ShareIndex from '../../components/ShareIndex'
import HomeNewsTitle from '../../components/home/HomeNewsTitle'
import HomeNewsList from '../../components/home/HomeNewsList'
import request, { getnews24List, marketIndex } from '../../api'
import './index.scss'


type PageOwnProps = {}

type PageState = {
  shareIndexData: {
    data: string[],
    field: string[]
  },
  newsListData: {}
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
    },
    newsListData: {}
  }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  componentDidMount () {
    this.getShareIndexData()
    this.getListData()
  }
  async getListData () {
    const {data} = await request(getnews24List,
      {
        pageSize: 20,
        timeStamp: 0,
        direction: 0
      }
    )
    this.setState({ newsListData : data })
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
    const {shareIndexData, newsListData} = this.state
    return (
      <View className='container'>
        <SearchEntry></SearchEntry>
        <HomeMenu menuData={[]}></HomeMenu>
        <View className="divider"></View>
        <ShareIndex shareIndexData={shareIndexData} ></ShareIndex>
        <HomeNewsTitle></HomeNewsTitle>
        <HomeNewsList listData={newsListData} ></HomeNewsList>
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
