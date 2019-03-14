import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text} from '@tarojs/components'

import './HomeNewsTitle.scss'
type PageOwnProps = {
}

type PageState = {
  title: string
}

interface HomeNewsTitle {
  props: PageOwnProps;
  state: PageState;
}

class HomeNewsTitle extends Component {
  // 使用全局样式
  static options = {
    addGlobalClass: true
  }
  state = {
    title: '小时新闻直播'
  }
  jumpToNewList = () :void => {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.navigateTo({
        url: '../newsList/newsList'
      })
    } else {
      Taro.navigateTo({
        url: '../newsListH5/newsList'
      })
    }
  }
  render () {
    const {title} = this.state
    return (
      <View className="news-box top-bd bot-bd" onClick={this.jumpToNewList}>
        <View className="lf-area">
          <View className="news-icon"></View>
            <Text>{title}</Text>
        </View>
        <View className="rt-area">
          <Text>更多</Text>
          <View className="more-icon"></View>
        </View>
      </View>
    )
  }
}

export default HomeNewsTitle as ComponentClass<PageOwnProps, PageState>
