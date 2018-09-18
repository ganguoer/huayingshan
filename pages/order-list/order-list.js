//index.js 
//获取应用实例 
var config = require('../../config.js')

var app = getApp()
Page({

  data: {
    // 页面配置  
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 0,
    mid:''
  },
  onLoad: function (options) {
    var that = this;
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    //tab跳转
    that.setData({
      currentTab: options.id,
      
    })
    console.log(that.data.currentTab);
  
    wx.getStorage({
      key: 'order',
      success: function (res) {
        console.log(res);
        that.ordersn = res.data;
      },
    });
   
    that.mid = wx.getStorageSync('mid');

    if (this.data.currentTab === options.id) {
      wx.request({
        url: config.myOrder + options.id + '?mid=' + that.mid,
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
            listd: res.data.content
          });

        }

      })   
    } else {
      that.setData({
        currentTab: options.id
      })
    }

    
    wx.showToast({
      title: "加载中...",
      icon: "loading",
      duration: 10000
    });

  
  },
  // 滑动切换tab 
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  // 点击tab切换 
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    wx.showToast({
      title: "加载中...",
      icon: "loading",
      duration: 10000
    });
    var type = (Number(e.target.dataset.current)).toString();
    var mid=that.mid;
    wx.request({
      url: config.myOrder + type + '?mid='+ that.mid,
      data: {
       
      },
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideToast();
        console.log(res.data);
        that.setData({
          listd: res.data.content
        });
      }
    })
  },
  
  waitPay:function(){
    var that = this; 
    wx.login({
      success: function (res) {
        that.code = res.code;
        wx.request({
          url: config.orderPay,
          method: 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            code: that.code,
            ordersn: that.ordersn
          },
          success: function (res) {
            console.log(res);
            wx.requestPayment({
              "appId": res.data.appId,
              "nonceStr": res.data.nonceStr,
              "timeStamp": res.data.timeStamp,
              "signType": res.data.signType,
              "paySign": res.data.paySign,
              "package": res.data.package,
              success: function (res) {
                console.log(res);
                //跳转页面
                wx.redirectTo({
                  url: '../paySuccess/paySuccess',
                  success: function (res) {
                  },
                })
              },
              fail: function (res) {
                console.log(res);
                // wx.showToast({
                //   title: '支付失败',
                //   // icon:'success', 
                //   duration: 1000,
                // })
              }
            })

          }



        })
      }
    })
  }
}) 