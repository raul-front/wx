/*
 * @Descripttion: 分页Page的构造方法
 * @Author: pujianguo
 * @Date: 2020-12-25 16:24:13
 */

const OriginPage = Page

const PaginationPage = (options = {}) => {
  const { data, state, onPullDownRefresh, onReachBottom } = options
  const mountOptions = {
    data: {
      isSearch: false, // 没有搜索的页面直接为false
      initLoading: true, // 初始化加载的标识
      showRefreshLoading: false, // scroll-view 下拉刷新标识
      query: {},
      list: [],
      isShowFooterLoading: false,
      isShowFooterNoMore: false,
      ...data,
    },
    state: {
      isPage: true, // 滚动是否是页面，scroll-view可设置为false
      loading: false,
      currentPage: 0,
      pages: 0,
      size: 10,
      showNoMoreMinLength: 10, // 超过n条数据展示没有更多的提示
      ...state,
    },
    // onLoad (...res) {
    //   this.refreshListData()
    //   onLoad && onLoad.apply(this, res)
    // },

    onPullDownRefresh () {
      if (onPullDownRefresh) { // 页面中重写
        onPullDownRefresh.apply(this)
      } else {
        !this.data.isSearch && this.refreshListData()
      }
    },
    onReachBottom () {
      if (onReachBottom) { // 页面中重写
        onReachBottom.apply(this)
      } else {
        !this.data.isSearch && this.getListData()
      }
    },
    // scroll-view 滑动到顶部
    scrollToUpper () {
      !this.data.isSearch && this.refreshListData()
    },
    // scroll-view 滑动到底部
    scrollToLower () {
      !this.data.isSearch && this.getListData()
    },

    refreshListData () {
      this.state.currentPage = 0
      this.getListData(true)
    },
    getListData (isRefresh = false) {
      if (this.state.loading || (this.state.currentPage > 0 && this.state.currentPage >= this.state.pages)) {
        return
      }
      const query = Object.assign({
        offset: this.state.currentPage * this.state.size,
        limit: this.state.size,
      }, this.data.query)
      this.state.loading = true
      this.setFooter()
      wx.showNavigationBarLoading()
      const isShowRequestLoading = !this.data.initLoading && isRefresh
      // !this.state.isPage && isRefresh && this.setData({ showRefreshLoading: true }) // 测试发现这里可以不设置；设置了会在首次onLoad时展示出来，需要更多判读，所以不设置
      this.getDataHandle(query, isShowRequestLoading).then(({ items, count }) => {
        let list = items
        if (!isRefresh) {
          list = this.data.list.concat(items)
        }
        this.state.currentPage = this.state.currentPage + 1
        this.state.pages = Math.ceil(count / this.state.size)
        this.setData({ list: list })
      }).catch(_ => {
        console.log('get page data err：', _)
      }).finally(_ => {
        if (this.data.initLoading) {
          this.setData({ initLoading: false })
        }
        this.state.loading = false
        this.setFooter()
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
        this.setData({ showRefreshLoading: false })
      })
    },

    setFooter () {
      let isShowFooterLoading = false
      let isShowFooterNoMore = false
      if (this.state.loading && this.state.currentPage > 0) {
        isShowFooterLoading = true
      }
      if (!this.state.loading && this.data.list.length > this.state.showNoMoreMinLength && this.state.currentPage === this.state.pages) {
        isShowFooterNoMore = true
      }
      this.setData({
        isShowFooterLoading,
        isShowFooterNoMore,
      })
    },
  }
  return OriginPage(Object.assign({}, options, mountOptions)) // 调用原生的Page构造函数
}

export default PaginationPage
