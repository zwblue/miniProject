import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import loadingImage from '../images/home/default.gif'

import './BaseListState.scss'
type PageOwnProps = {
  listState: {
    loading: boolean,
    noData: boolean,
    loadFail: boolean
  },
  stateText: {
    loadingText: string,
    noDataText: string,
    loadFailText: string
  }
}
type PageState = {
}

interface wxParse {
  props: PageOwnProps;
  state: PageState;
}
class wxParse extends Component {
  static defaultProps = {
    listState: {
      loading: false,
      noData: false,
      loadFail: false
    },
    stateText: {
      loadingText: '',
      noDataText: '',
      loadFailText: ''
    }
  }
  componentDidMount() {

  }
  render() {
    const {stateText, listState} = this.props
    return (
      <View>
        {listState.loading && (
          <View className='loading box'>
          <Image className='loading-icon' src={loadingImage}></Image>{stateText.loadingText}
        </View>
        )}
        {listState.noData && (
          <View className='no-data box'>
            {stateText.noDataText}
          </View>
        )}
        {listState.loadFail && (
          <View className='load-fail box'>
            {stateText.loadFailText}
          </View>
        )}
      </View>
    )
  }
}
export default wxParse as ComponentClass<PageOwnProps, PageState>
