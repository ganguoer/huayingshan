var config = require('../../config.js')
// pages/w-hotel-details/w-hotel-details.js
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxParseData: '',
    info1: '',
    info2: '',
    info4: '',
    list: [],
    screenWidth:''
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var self = this;
    wx.showToast({
      title: "加载中...",
      icon: "loading",
      duration: 10000
    });


    var baseUrl = config.hotelShow + options.id;
    wx.request({
      url: baseUrl,
      data: {
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideToast();
        //res.data为我们自己后台的返回
        console.log(res.data)
       
        self.setData({
          info1: res.data.content.info1[0],
          info2: res.data.content.info2[0],
          list: res.data.content.info2,
          info4: res.data.content.info4
        });
        if (res.data && res.data.content) {
          var txt = new Array();
          txt[0] = res.data.content.info1[0].content;
          txt[1] = res.data.content.info1[0].fuwu;
          txt[2] = res.data.content.info1[0].notice;
          txt[3] = res.data.content.info1[0].traffic;
          
          
          if (!!txt[0]){
            WxParse.wxParse('content', 'html', txt[0], self, 5);
         }
          if (!!txt[1]) {
            WxParse.wxParse('spot', 'html', txt[1], self, 5);
          }
          if (!!txt[2]) {
            WxParse.wxParse('notice', 'html', txt[2], self, 5);
          }
          if (!!txt[3]) {
            WxParse.wxParse('traffic', 'html', txt[3], self, 5);
          }
         
         
        }

        }
    }) ;
   

  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})