// pages/w-ticket-details/w-ticket-details.js
var WxParse = require('../../wxParse/wxParse.js');
var config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxParseData:'',
    info1:'',
    info2:'',
    info3:'',
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    wx.showToast({
      title: "加载中...",
      icon: "loading",
      duration: 10000
    });
    // console.log(options);
    var baseUrl = config.spotShow + options.id;
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
        console.log(res.data.content);
        that.setData({
          info1: res.data.content.info1[0],
          list: res.data.content.info3,
          info3: res.data.content.info3[0],
        });
        
        if (res.data && res.data.content) {
          var txt = new Array();
          txt[0] = res.data.content.info1[0].booknotice;
          txt[1] = res.data.content.info1['0'].content;
          
          
          if (!!txt[0]) {
            WxParse.wxParse('booknotice', 'html', txt[0], that, 5);
          }
          if (!!txt[1]) {
            WxParse.wxParse('content', 'html', txt[1], that, 5);
          }  
        }

      }

    })
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