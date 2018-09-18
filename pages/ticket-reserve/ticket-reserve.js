// pages/hotel-reserve/hotel-reserve.js
var config = require('../../config.js')
var app = getApp();
var inputContent = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    usedate: '选择日期',
    dingnum: 1,
    // 使用data数据对象设置样式名 
    minusStatus: 'disabled',
    price: 1,
    totalprice: 0,
    mid:'',
    inputContent:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    var _this = this; 
    _this.query = query;
   
    _this.setData({
      title: query.title,
      price: query.price,
      productid: query.productid,
      suitid: query.suitid
    })

    // _this.mid = wx.getStorageSync('mid');
    // console.log(_this.mid);
    wx.getStorage({
      key: 'mid',
      success: function (res) {
        _this.setData({
          mid: res.data,

        });
      },
    })
    
   
  },
  /* 点击减号 */
  bindMinus: function () {
    var dingnum = this.data.dingnum;
    // 如果大于1时，才可以减 
    if (dingnum > 1) {
      dingnum--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态 
    var minusStatus = dingnum <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回 
    this.setData({
      dingnum: dingnum,
      totalprice:  this.data.price * dingnum,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var dingnum = this.data.dingnum;
    // 不作过多考虑自增1 
    dingnum++;
    // 只有大于一件的时候，才能normal状态，否则disable状态 
    var minusStatus = dingnum < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回 
    this.setData({
      dingnum: dingnum,
      totalprice:  this.data.price * dingnum,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindBlur: function (e) {
    // 在input里获取用户输入的值---主要代码逻辑
    inputContent[e.currentTarget.id] = e.detail.value
    var dingnum = inputContent[e.currentTarget.id];
    console.log(dingnum);
    this.setData({
      dingnum: dingnum,
      totalprice: this.data.price * dingnum,
    });
  },

  //为picker绑定方法： 其中获得的时间为2017-06-01格式的。
  bindDateChange: function (e) {
    var that = this;
    that.setData({
      usedate: e.detail.value,
      totalprice: this.data.price * 1
    })

  },
 
  //表单提交
  formSubmit: function (e) {
    var warn = "";//弹框时提示的内容
    var flag = true;//判断信息输入是否完整
    var formData = e.detail.value;
    //判断的顺序依次是：入住日期-离店日期-姓名-手机号
    if (e.detail.value.linkman == "") {
      warn = "请填写您的姓名！";
    } else if (e.detail.value.linktel == "") {
      warn = "请填写您的手机号！";
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.linktel))) {
      warn = "手机号格式不正确";
    } else if (e.detail.value.usedate == '选择日期') {
      warn = "请选择游玩日期";
    }
    // else if(false){
    //   加了一个判断是否授权登陆的逻辑
    // }

    if (warn != "") {
      wx.showModal({
        title: '提示',
        content: warn
      })
      return;
    }
   
    wx.showToast({
      title: "加载中...",
      icon: "loading",
      duration: 10000
    }),
      
      wx.checkSession({
        success: function (res) {
          wx.request({
            url: config.spotOrder,
            data: formData,
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },

            success: function (res) {
              wx.hideToast();
              wx.setStorage({
                key: 'ticketInfo',
                data: formData
              });

              wx.setStorage({
                key: 'ticketOrder',
                data: res.data
              });
              wx.navigateTo({
                url: '../ticket-payment/ticket-payment'
              })

              console.log('form发生了submit事件，携带数据为：', e.detail.value);
            },
            fail: function (res) {
              wx.showModal({
                title: '提交失败',
                content: res.data
              })
            }
          })
        },
        fail: function (res) {
          app.onLogin();
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