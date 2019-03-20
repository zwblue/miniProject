import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './updateLog.scss'


type PageOwnProps = {}

type PageState = {}

interface updateLog {
  props: PageOwnProps;
}

class updateLog extends Component {
  
    config: Config = {
    navigationBarTitleText: '首页'
  }
  state={
    logList: [
      {
        title: 'e海通财小程序v1.3.3',
        desc: '更新内容',
        contentArray: ['为小程序添加置顶行情信息'],
        time: '2017年11月'
      },
      {
        title: 'e海通财小程序v1.3.2',
        desc: '更新内容',
        contentArray: ['修改美股指数等分时图显示不正常问题', '修改html解析问题'],
        time: '2017年9月'
      },
      {
        title: 'e海通财小程序v1.3.1',
        desc: '更新内容',
        contentArray: [
          '首页tab增加资讯功能',
          '行情“沪深”中增加资金流入、资金流出模块',
          '行情增加“全球”模块',
          '行情增加“全部”模块',
          '个股分时线增加小红点',
          '个股页面增加“资金”模块',
          '个股页面增加“诊股”模块',
          '“我的”点击二维码增加版本修改信息'
        ],
        time: '2017年7月'
      },
      {
        title: 'e海通财小程序v1.2.5',
        desc: '更新内容',
        contentArray: ['个股十字线重叠问题', '修改其他已知问题'],
        time: '2017年6月1日'
      },
      {
        title: 'e海通财小程序v1.2.4',
        desc: '更新内容',
        contentArray: [
          '首页排版布局修改',
          '首页指数样式修改',
          '新增4小时新闻直播模块，以及更多详情页',
          '新增我的自选模块',
          '新增入口板块、港股',
          '新增自选资讯功能',
          '新增编辑自选股功能',
          '个股页面新增十字线功能',
          '个股页面新增资讯模块',
          '个股页面新增大事件模块',
          '个股页面新增F10模块',
          '修改个股页面添加自选按钮位置',
          '修改个股页面分钟K线下拉菜单',
          '修改其他已知问题'
        ],
        time: '2017年5月31日'
      }
    ]
  }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    const {logList} = this.state
    return (
      <View className='log-box'>
        <View className='newest'>最新版本</View>
        {logList.map((item, index)=>{
          return (
            <View key={index}>
              <View className="title">
                <View className="lf">{item.title}</View>
                <View className="rt">{item.time}</View>
              </View>
              <View className="content">
                <View className="desc">{item.desc}</View>
                {item.contentArray.map((item, contentIndex)=>{
                 return(
                  <View key={contentIndex}>
                    {(contentIndex + 1) + '.' + item}
                  </View>
                 )
                })}
              </View>
            </View>
          )
        })}
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

export default updateLog as ComponentClass<PageOwnProps, PageState>
