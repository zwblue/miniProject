import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { parseData } from '../utils'

import './ShareIndex.scss'


type PageOwnProps = {
  shareIndexData: {
    data: any [],
    field: any [] 
  }
}

type PageState = {
  dataFormat: string[],
    handleShareIndexData: { goodsName: string; goodCode: string;lastPrice: string, currentPrice: string; increase: string; rise: string; }[]
}

interface ShareIndex {
  props: PageOwnProps;
  state: PageState;
}

class ShareIndex extends Component {
  static options = {
    addGlobalClass: true
  }
  static defaultProps = {
    shareIndexData: {
      data: [1],
      field: [1] 
    }
  }
  state = {
    dataFormat: ['goodsName', 'goodsCode', 'lastPrice', 'currentPrice', 'increase', 'rise'],
    handleShareIndexData: [{
      goodsName: '上证指数',
      goodCode: 'SH000001',
      lastPrice: '--',
      currentPrice: '--',
      increase: '--',
      rise: '--'
    }, {
      goodsName: '深证成指',
      goodCode: 'SZ39901',
      lastPrice: '--',
      currentPrice: '--',
      increase: '--',
      rise: '--'
    }, {
      goodsName: '创业板指',
      goodCode: 'SZ39906',
      lastPrice: '--',
      currentPrice: '--',
      increase: '--',
      rise: '--'
    }]
  }
  componentDidMount () {
  }
  componentDidShow () {
  }
  componentWillUpdate (nextState) {
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.shareIndexData !== nextProps.shareIndexData) {
      if (nextProps.shareIndexData.data.length) {
        // 需要的值对应的key数组
        const needKey = this.state.dataFormat
        const ShareIndexData = parseData(nextProps.shareIndexData, 'data', 'field', needKey)
        console.log('ShareIndexData', ShareIndexData)
        this.setState({
          handleShareIndexData: ShareIndexData
        })
      }
    }
    
  }
  jumpToPage (item) {
    const goodsName = item.goodsName
    const goodsCode = item.goodsCode
    Taro.navigateTo({
      url: `../stock/main?name=${goodsName}&code=${goodsCode}`
    })
  }
  render () {
    const { handleShareIndexData } = this.state
    return (
      <View className="share-box">
        {handleShareIndexData.map((item, index) => {
          return (
            <View className="share-item" onClick={this.jumpToPage.bind(this, item)} key={index}>
              <View className={`share-number ${parseInt(item.increase) >= 0 ? 'red' : 'green'}`}>{item.currentPrice}</View>
              <View className='share-content'>
                <View className='share-name'><Text>{item.goodsName.slice(0,2)}</Text></View>
                <View className={`share-change ${parseInt(item.increase) >= 0 ? 'red' : 'green'}`}>
                  {item.increase + '%'}
                </View>
              </View>
              {index !== handleShareIndexData.length-1 && <View className="line"></View>}
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

export default ShareIndex as ComponentClass<PageOwnProps, PageState>
