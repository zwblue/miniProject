import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import ht_code from '../../images/user/ht_code.png'
import './user.scss'


type PageOwnProps = {}

type PageState = {}

interface Index {
  props: PageOwnProps;
}

class Index extends Component {
  
    config: Config = {
    navigationBarTitleText: '首页'
  }
  state = {
    timer: 1500,
    animationData: []
  }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {

   }

  componentDidHide () { 
    this.rotatePoint(0, 0)
  }
  rotatePoint (timer, deg) {
    const animation = Taro.createAnimation({
      duration: timer,
      timingFunction: 'ease'
    })
    animation.export()
    animation.rotate(deg).step()
    this.setState({
      animationData: animation.export()
    })
  }
  jumpToPage = () => {
    // 旋转动画
    this.rotatePoint(this.state.timer, 1440)
    setTimeout(() => {
      Taro.navigateTo({
        url: `/pages/updateLog/updateLog`
      })
      // 小程序中返回时并没有将数据重置，所以手动将其归0，否则将会出现不转的情况
    }, this.state.timer)
  }
  render () {
    return (
      <View className='user-box'>
        <View className="logo-box" onClick={this.jumpToPage}>
          <Image className='ht-image' src={ht_code}></Image>
          <View className='logo' animation={this.state.animationData}></View>
        </View>
        <View className='desc'>
          <Text>下载海通APP，</Text>        
          <Text>查看行情、快速交易，一站式搞定。</Text>        
          <Text>还可在线开户，助您一指擒牛！</Text>        
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
