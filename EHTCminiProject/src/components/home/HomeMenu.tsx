import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import './HomeMenu.scss'


type PageOwnProps = {
  menuData: []
}

type PageState = {
  defaultMenuData: { 
    name: string;
    type: string;
    path: string;
    bg: string;
    icon: any;
  }[]
}

interface HomeMenu {
  props: PageOwnProps;
  state: PageState;
}

class HomeMenu extends Component {
  static defaultProps = {
    menuData: []
  }
  state = {
    defaultMenuData :[
      {name: '我的自选', type: 'tab', path: '../optional/optional', bg: '5f93ed', icon: require('../../images/menu/ht_12.png')},
      {name: '自选资讯', type: 'tab', path: '../optional/optional', bg: 'e16969', icon: require('../../images/menu/ht_03.png')},
      {name: '板块', type: 'tab', path: '../optional/optional', bg: 'e38900', icon: require('../../images/menu/block.png')},
      {name: '港股', type: 'tab', path: '../optional/optional', bg: 'c74a23', icon: require('../../images/menu/hk.png')},
      {name: '热搜股票', type: 'tab', path: '../optional/optional', bg: 'e4ad2e', icon: require('../../images/menu/ht_19.png')},
      {name: '龙虎榜', type: 'tab', path: '../optional/optional', bg: 'd45b26', icon: require('../../images/menu/ht_21.png')},
      {name: '条件选股', type: 'tab', path: '../optional/optional', bg: '49b0b0', icon: require('../../images/menu/ht_09.png')},
      {name: '新股日历', type: 'tab', path: '../optional/optional', bg: '824ca6', icon: require('../../images/menu/ht_18.png')}
    ]
  }
  jumpToPage (url: string) :void {
    // weapp / swan / alipay / h5 / rn / tt
    console.log('TARO_ENV', process.env.TARO_ENV)
    if(process.env.TARO_ENV === 'h5') {
      Taro.navigateTo({
        url: url
      })
    } else {
      Taro.switchTab({
        url: url
      })
    }
    
  }
  render () {
    const menuData =this.props.menuData.length ? this.props.menuData : this.state.defaultMenuData
    return (
      <View className="menu-box">
        {menuData.map((item, index) => {
          return (
            <View className='menu-item-box' onClick={this.jumpToPage.bind(this, item.path)} key={index}>
              <View className='menu-item' style={{ background: "#" + item.bg }}>
                <Image className="menu-icon" src={item.icon}></Image>
              </View>
              <View className="menu-title"><Text>{item.name}</Text></View>
            </View>
          )
        })}
      </View>
    )
  }
}

export default HomeMenu as ComponentClass<PageOwnProps, PageState>
