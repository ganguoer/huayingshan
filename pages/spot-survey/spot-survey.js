Page({
  data: {
    imgUrls: [
      "http://zdp.citgroup.cn/image/hys/hys01.jpg",
      "http://zdp.citgroup.cn/image/hys/hys01.jpg"
    
    ],
    Height: 0,
    scale: 12,
    latitude: "",
    longitude: "",
    markers: [],
    controls: [{
      id: 1,
      iconPath: 'http://zdp.citgroup.cn/image/sub.png',
      position: {
        left: 300,
        top: 100 - 50,
        width: 18,
        height: 18
      },
      clickable: true
    },
    {
      id: 2,
      iconPath: 'http://zdp.citgroup.cn/image/add.png',
      position: {
        left: 330,
        top: 100 - 50,
        width: 18,
        height: 18
      },
      clickable: true
    }
    ],
    circles: []

  },

  onLoad: function () {
    var _this = this;

    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        _this.setData({
          view: {
            Height: res.windowHeight
          }

        })



      }
    })

    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {

        _this.setData({
          latitude: 24.8129432897,
          longitude: 103.3243775368,
          markers: [{
            id: "1",
            latitude: 24.8129432897,
            longitude: 103.3243775368,
            width: 20,
            height: 20,
            iconPath: "http://zdp.citgroup.cn/image/location0.png",
            title: "石林"

          }],
          //    circles: [{
          //      latitude: 24.8129432897,
          //      longitude: 103.3243775368,
          //      color: '#FF0000DD',
          //      fillColor: '#7cb5ec88',
          //      radius: 3000,
          //      strokeWidth: 0.1
          //    }]

        })
      }

    })

  },

  regionchange(e) {
    // console.log("regionchange===" + e.type)
  },

  //点击merkers
  //  markertap(e) {
  //    console.log(e.markerId)

  //    wx.showActionSheet({
  //       itemList: ["A"],
  //       success: function (res) {
  //         console.log(res.tapIndex)
  //       },
  //       fail: function (res) {
  //         console.log(res.errMsg)
  //       }
  //    })
  //  },

  //点击缩放按钮动态请求数据
  controltap(e) {
    var that = this;
    // console.log("scale===" + this.data.scale)
    if (e.controlId === 1) {
      // if (this.data.scale === 13) {
      that.setData({
        scale: --this.data.scale
      })
      // }
    } else {
      // if (this.data.scale !== 13) {
      that.setData({
        scale: ++this.data.scale
      })
      // }
    }


  },


})