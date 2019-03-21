import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'

import request, { optionStock } from '../../api'
import { parseData } from '../../utils'

import './optionalEdit.scss'

const initConfig = {
  clientY: 0, // 记录距离屏幕的距离
  height: 54, //  item的高度
  startOffsetTop: 0, // 距离外元素的开始距离
  endIndex: -1, // 最终移到的index
  startIndex: -1 // 开始的index 用来保留starIndex 在触摸结束后用来删除
}
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
    canScrollY: true,
    touchYValue: 0,
    titleList: ['删除', '名称', '置顶', '移动'],
    savedCodeArray:[],
    handledStockCodes: [],
    // localStockCodes
    activeItemConfig: {
      clientY: 0, // 记录距离屏幕的距离
      height: 54, //  item的高度
      startOffsetTop: 0, // 距离外元素的开始距离
      endIndex: -1,// 开始的index 用来保留starIndex 在触摸结束后用来删除
      startIndex: -1 // 开始的index 用来保留starIndex 在触摸结束后用来删除
    },
    activeItem: {
      goodsCode: '--',
      goodsName: '--'
    }
  }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { 
    this.setState({
      activeItemConfig: {...initConfig},
      savedCodeArray: Taro.getStorageSync('savedCodeArray'),
      canScrollY: true,
      touchYValue: 0,
    }, () => {
      this.getOptionData()
    })
  }

  componentDidHide () { }
  async getOptionData () {
    const {savedCodeArray} = this.state
    if (savedCodeArray.length > 0) {
      try {
        const {data} = await request(optionStock, {
          goodsList: savedCodeArray
        })
        // 需要的值对应的key数组
        const needKeys = ['goodsName', 'goodsCode']
        const handledStockCodes = parseData(data, 'data', 'field', needKeys)
        this.setState({
          handledStockCodes
        })
      } catch (err) {
        console.log('optionStock接口报错', err)
      }
    }
  }
  removeStock (goodsCode, index = -1) {
    const {savedCodeArray, handledStockCodes} = this.state
    if (index === -1) {
      index = savedCodeArray.findIndex((item) => item === goodsCode)
    }
    savedCodeArray.splice(index, 1)
    Taro.setStorageSync('savedCodeArray', savedCodeArray)
    handledStockCodes.splice(index, 1)
    this.setState({
      savedCodeArray,
      handledStockCodes
    })
  }
  setTopStock (goodsCode) {
    const {savedCodeArray, handledStockCodes} = this.state
    const index = savedCodeArray.findIndex((item) => item === goodsCode)
    const topLocalStock = savedCodeArray.splice(index, 1)
    const topHandedStock = handledStockCodes.splice(index, 1)
    // 返回的是一个数组
    savedCodeArray.unshift(topLocalStock[0])
    handledStockCodes.unshift(topHandedStock[0])

    this.setState({
      savedCodeArray,
      handledStockCodes
    })
    Taro.setStorageSync('savedCodeArray', savedCodeArray)
  }
  onScroll = ():void => {
  }
  touchmove = (e) => {
    const {clientY, startOffsetTop, height} = this.state.activeItemConfig
    // 1、选中item的y移动了多少
    const yMoveValue = e.touches[0].clientY - clientY
    // 2、移动item的y现在的位置
    const offsetTop = yMoveValue + startOffsetTop
    this.setState({
      touchYValue: offsetTop
    })
    // 3、移动item到了哪个index的范围
    const number = offsetTop/height
    const endIndex = parseInt(number)
    // 4、保存下最终到的index， touchend时 添加选中的item
    this.setState({
      activeItemConfig:{
        ...this.state.activeItemConfig, endIndex
      } 
    })
  }
  touchend (e) {
    const {startIndex, endIndex} = this.state.activeItemConfig
    const {savedCodeArray, activeItem, handledStockCodes} = this.state
    // 1、拖动完毕，开启滑动
    this.setState({
      canScrollY: true
    }) 
    // 2、删除选中的item
    this.removeStock('', startIndex)
    // 3、在最后的index中添加选中的item
    console.log(endIndex, activeItem.goodsCode)
    savedCodeArray.splice(endIndex, 0, activeItem.goodsCode)
    this.setState({
      savedCodeArray
    })
    Taro.setStorageSync('savedCodeArray', savedCodeArray)

    handledStockCodes.splice(endIndex, 0, activeItem)
    this.setState({
      handledStockCodes
    })
    // 4、完成后，将endIndex 初始化
    this.setState({
      activeItemConfig:{
        ...this.state.activeItemConfig, endIndex: -1, startIndex: -1
      } 
    })
  }
  touchstart (e) {
    // 1、选中item距离屏幕的y值，
    // 2、选中item距离外元素的y值
    // 3、选中的item是第几个
    // 4、保留item下标index，后来删除
    // 5、选中item的数据
    // 6、移动item的下标，这个是监听改变的
    // 7、移动item的距离，这个是监听改变的
    // 关闭scroll-view可以轮动 拖动时滚动会出问题
    const { height} = this.state.activeItemConfig
    const {handledStockCodes} = this.state
    const startIndex = parseInt(e.currentTarget.offsetTop / height)
    console.log(startIndex)
    this.setState({
      activeItemConfig:{
        ...this.state.activeItemConfig,
        clientY: e.touches[0].clientY,
        startOffsetTop: e.currentTarget.offsetTop,
        startIndex,
        endIndex: startIndex,
      },
      activeItem:  handledStockCodes[startIndex],
      canScrollY: false,
      touchYValue: e.currentTarget.offsetTop
    })
  
  }
  render () {
    const {titleList, canScrollY, activeItemConfig, activeItem, handledStockCodes, touchYValue} = this.state
    return (
      <ScrollView className='edit-box' onScroll={this.onScroll} scrollY={canScrollY}>
        <View className="title bot-bd">
          {titleList.map((item,index)=>{
            return (
              <View key={index} className={'title'+index +' title-item'}>
                {item}
              </View>
            )
          })}
        </View>
        <View className='list-box'>
          <View className={`list-item bot-bd active-item ${canScrollY ? 'isHide' : ''}`} style={{top: touchYValue+"px"}}>
            <View className="remove"></View>
            <View className="desc">
              <View className="stock-name">
                {activeItem.goodsName}
              </View>
              <View>
                {activeItem.goodsCode}
              </View>
            </View>
            <View className="toTop"></View>
            <View className="move-box">
              <View className="move"></View>
            </View>
          </View>
          { handledStockCodes.map((item, index) => {
            return (
              <View key={index} className={`list-item bot-bd ${activeItemConfig.startIndex === index ? 'start-item' : ''}`} >
                <View className="remove" onClick={this.removeStock.bind(this,item.goodsCode)}></View>
                <View className="desc">
                  <View className="stock-name">
                    {item.goodsName}
                  </View>
                  <View>
                    {item.goodsCode}
                  </View>
                </View>
                <View className={`toTop ${index === 0 ? 'hide' : ''}`} onClick={this.setTopStock.bind(this, item.goodsCode)}></View>
                <View className="move-box" onTouchMove={this.touchmove} onTouchEnd={this.touchend} onTouchStart={this.touchstart}>
                  <View className="move"></View>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>
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
