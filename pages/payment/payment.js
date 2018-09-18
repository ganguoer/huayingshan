// pages/payment/payment.js

var config = require('../../config.js')

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var that = this;
    wx.getStorage({
      key: 'order',
      success: function (res) {
         console.log(res);
        that.ordersn = res.data;
       },
    })
    
  
    wx.getStorage({
      key: 'orderInfo',
      success: function(res) {
        that.setData({ title: res.data['title']});
        that.setData({ roomname: res.data['roomname'] });
        that.setData({ startdate: res.data['startdate'] });
        that.setData({ leavedate: res.data['leavedate'] });
        that.setData({ dingnum: res.data['dingnum'] });
        that.setData({ linkman: res.data['linkman'] });
        that.setData({ linktel: res.data['linktel'] });
        that.setData({ remark: res.data['remark'] });
        that.setData({ price: res.data['price'] });
        console.log(res);
        that.data = res.data;
      },
    })
  
   
  },

    payoff: function(e){
        var that = this; 
        that.getOpenId();

    },
    
    //获取openid
    getOpenId: function () {
      var that = this;
      var price = that.data.price;
      // wx.getStorage({
      //   key: 'mid',
      //   success: function (res) {
      //     that.mid = res.data;
      //   }
      // })
      wx.login({
        success: function (res) {
          that.code=res.code;
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