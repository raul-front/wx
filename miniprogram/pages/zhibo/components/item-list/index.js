const { showToastSuccess } = require('../../../../utils/func')

// pages/zhibo/components/list-item/index.js
Component({
  properties: {
    list: Array,
  },
  data: {
    show: false,
    actions: [],

  },
  methods: {
    openHref (e) {
      const index = e.currentTarget.dataset.index
      const item = this.data.list[index]
      const actions = item.live_link.map(x => {
        return { name: x.text, subname: x.href, href: x.href }
      })
      this.setData({
        actions: actions,
        show: true,
      })
    },
    onSelect (e) {
      wx.setClipboardData({
        data: e.detail.href,
        success () {
          showToastSuccess('ε€εΆζε')
        },
      })
    },
    onClose () {
      this.setData({ show: false })
    },
  },
})
