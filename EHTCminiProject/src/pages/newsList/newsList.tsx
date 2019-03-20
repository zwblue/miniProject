import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import HomeNewsList from '../../components/home/HomeNewsList'
import BaseListState from '../../components/BaseListState'
import request, { getnews24List } from '../../api'
import {setLastTimeStamp} from '../../utils/index'
import './newsList.scss'

// 因为这三种状态只出现一种，所以我给他设个初始状态
const initState = {
  loading: false,
  noData: false,
  loadFail: false
}
type PageOwnProps = {}
type PageState = {
  newsListData: {
    Data: any[],
    Field: string[]
  },
  lastTimeStamp: number,
  listState: {
    loading: boolean,
    noData: boolean,
    loadFail: boolean
  },
  stateText: {
    loadingText: string,
    noDataText: string,
    loadFailText: string
  },
}

interface Index {
  props: PageOwnProps;
}

class Index extends Component {
    config: Config = {
    navigationBarTitleText: '首页',
    enablePullDownRefresh: true
  }
  scroll = {}
  state = {
    newsListData: {
      Data: [],
      Field: []
    },
    lastTimeStamp: 0,
    listState: {
      loading: false,
      noData: false,
      loadFail: true
    },
    stateText: {
      loadingText: '数据加载中...',
      noDataText: '没有更多的数据了...',
      loadFailText: '加载失败，点击重新加载'
    },
    // 数据加载中
    // 没有更多的数据了...
    // 加载失败，点击重新加载
  }
  componentWillUnmount () { }
  componentDidShow () {
    this.getListData(()=>{})
  }
  componentDidHide () { }
  async getListData (callback) {
    // this.loadingIsShow = true
    try {
      this.setState({
        listState: {...initState, loading: true}
      })
      const {data} = await request(getnews24List,
        {
          pageSize: 10,
          timeStamp: 0,
          direction: 0
        }
      )
      const arr = data.Data
      const field = data.Field
      console.log(1111)
      const lastTimeStamp = setLastTimeStamp(arr, field, 'displaytime')
      this.setState({
        lastTimeStamp,
        newsListData: {
          Data: arr,
          Field: field
        }
      }, () => {
        if (typeof callback === "function") {
          callback()
        }
      })
      this.updateListState(arr)
     
    } catch (error) {
      this.setState({
        listState: {...initState, loadFail: true}
      })
    }
  }
  updateListState (data) {
    if (data.length < 10 ) {
      this.setState({
        listState: {...initState, noData: true},
      })
    } else {
      this.setState({
        listState: {...initState, loading: false}
      })
    }
  }
  async loadMoreListData (callback) {
    console.log(this.state.listState)
    if (this.state.listState.loading) {
      return
    }
    try {
      this.setState({
        listState: {...initState, loading: true}
      })
      const {data} = await request(getnews24List,
        {
          pageSize: 10,
          timeStamp: this.state.lastTimeStamp,
          direction: 1
        }
      )
      const arr = data.Data
      const field = data.Field

      const lastTimeStamp = setLastTimeStamp(arr, field, 'displaytime')

      const listData = this.state.newsListData
      const addData = [...listData.Data, ...arr]
      this.setState({
        lastTimeStamp,
        newsListData:{
          Data: addData,
          Field: data.Field
        } 
      }, () => {
        if (typeof callback === "function") {
          callback()
        }}
      )
      this.updateListState(arr)
    } catch (error) {
      this.setState({
        newsListData:{} 
      })
      this.setState({
        listState: {...initState, loadFail: true}
      })
    }
    // this.loadingIsShow = false
  }
  onPullDownRefresh () {
    console.log('刷新')
    this.setState({
      newsListData:{
        Data: []
      } 
    })
    this.getListData(() => { Taro.stopPullDownRefresh() })
  }
  onReachBottom () {
    console.log('到底了')
    this.loadMoreListData()
  }
  render () {
    const {listState, stateText} = this.state
    return (
      <View className='index'>
        <HomeNewsList listData={this.state.newsListData}></HomeNewsList>
        <BaseListState stateText={stateText} listState={listState}></BaseListState>
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
