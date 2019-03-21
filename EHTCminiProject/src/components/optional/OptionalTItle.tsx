import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './OptionalTitle.scss'


type PageOwnProps = {}

type PageState = {}

interface OptionalTitle {
  props: PageOwnProps;
}

class OptionalTitle extends Component {
  config: Config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  jumpToEditOptionalPage = () => {
    Taro.navigateTo({
      url: `/pages/optionalEdit/optionalEdit`
    })
  }
  render () {
    return (
      <View className="title-box top-bd bot-bd">
        <View>我的自选股</View>
        <View className="edit-box" onClick={this.jumpToEditOptionalPage}>
          <View>编辑</View>
          <View className="edit-icon"></View>
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

export default OptionalTitle as ComponentClass<PageOwnProps, PageState>
