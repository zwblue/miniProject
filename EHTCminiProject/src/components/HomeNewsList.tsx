import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import BaseWxParse from '../components/BaseWxParse'
import { parseData, parseTime } from '../utils'

import './HomeMenu.scss'


type PageOwnProps = {
  listData: {}
}

type PageState = {
  handledListData: Array<any>
}

interface HomeNewsList {
  props: PageOwnProps;
  state: PageState;
}

class HomeNewsList extends Component {
  static defaultProps = {
    listData: {}
  }
  constructor(props) {
    super(props)
    this.state = {
      handledListData: []
    }
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.listData !== nextProps.listData) {
      console.log(this.props.listData, nextProps)
      if (nextProps.listData.Data.length) {
        // 需要的值对应的key数组
        // const needKey = this.state.dataFormat
        const handledListData = parseData(nextProps.listData)
        this.setState({
          handledListData
        })
      }
    }
  }
  getContent (item):string {
    const img = item.image_url ? "<img src='" + item.image_url + "'/>" : ''
    return item.title + img
  }
  render () {
    const {handledListData} = this.state
    return (
      <View className="list-box">
        {handledListData.map((item, index) => {
          return (
            <View className='item-box' key={index}>
              <View className='left-point'>
                <View className='inner-point'></View>
              </View>
              <View>
                <BaseWxParse html={this.getContent(item)}></BaseWxParse>
              </View>
              <View className='time'>
                <Text>{parseTime(item.displaytime, '{y}/{m}/{d} {h}:{i}')}</Text>
              </View>
            </View>
          )
        })}
      </View>
    )
  }
}

export default HomeNewsList as ComponentClass<PageOwnProps, PageState>
