import { ComponentClass } from 'react'
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import '../utils/wxParse/wxParse.wxss'
import WxParse from '../utils/wxParse/wxParse'

type PageOwnProps = {
  html: string
}
type PageState = {
}

interface wxParse {
  props: PageOwnProps;
  state: PageState;
}
class wxParse extends Component {
  static defaultProps = {
    html: ''
  }
  componentDidMount() {
    WxParse.wxParse('article', 'html', this.props.html, this.$scope, 5)
  }

  render() {
    return (
      <View>
        <import src='../utils/wxParse/wxParse.wxml' />
        <template is='wxParse' data='{{wxParseData:article.nodes}}'/>
      </View>
    )
  }
}
export default wxParse as ComponentClass<PageOwnProps, PageState>
