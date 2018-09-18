// pages/hotel-reserve/hotel-reserve.js
var config = require('../../config.js')

var app = getApp();

var inputContent = {}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    startdate: '选择日期',
    leavedate: '选择日期',
    dingnum: 1,
    // 使用data数据对象设置样式名 
    minusStatus: 'disabled',
    totalNight:0,
    price:1,
    totalprice:0,
    mid: '',
    inputContent: {}
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (query) {
    var _this=this;
    // console.log(query);
    _this.query = query;
    var totalnum;
  
    wx.getStorage({
      key: 'mid',
      success: function (res) {
        _this.setData({
          mid: res.data,

        });
      },
    })
   
    _this.setData({
      title: query.title,
      roomname: query.roomname,
      price: query.price,
      hotelid: query.hotelid,
      suitid: query.suitid
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
      totalprice: this.data.totalNight * this.data.price * dingnum,
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
      totalprice: this.data.totalNight * this.data.price * dingnum,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件--在input里获取用户输入的值 */
  bindBlur: function (e) {
    // 在input里获取用户输入的值---主要代码逻辑
    inputContent[e.currentTarget.id] = e.detail.value
    var dingnum = inputContent[e.currentTarget.id];
    console.log(dingnum);
    this.setData({
      dingnum: dingnum,
      totalprice: this.data.totalNight * this.data.price * dingnum
    });
  },

  calcDate:function(){
    if(this.startTime && this.endTime){
      var dt1 = new Date(this.startTime);
      var dt2 = new Date(this.endTime);
      var data = Math.floor((dt2.getTime() - dt1.getTime()) / (1000 * 60 * 60 * 24));
       
       if(data<=0){
         wx.showModal({
           title: '提示',
           content: '请选择合适的离店日期'
         })
         return;
       }
      this.setData(
        {
          totalNight: data,
          totalprice: data * this.data.price * this.data.dingnum
        }
      )
    
    }
  },
  //为picker绑定方法： 其中获得的时间为2017-06-01格式的。
  bindDateChange: function (e) {
    var startT = e.detail.value;
    this.startTime = e.detail.value;
    this.calcDate();
    var that = this;
    that.setData({
      startdate: startT
    })
   
  },
  bindDateChangeTwo: function (e) {
    var that = this;
    var endT = e.detail.value;
    this.endTime = endT;
    this.calcDate();
    that.setData({
      leavedate: endT
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
    } else if (e.detail.value.startdate == '选择日期') {
      warn = "请选择入住日期";
    } else if (e.detail.value.leavedate == '选择日期') {
      warn = "请选择离店日期";
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
          url: config.hotelOrder,
          data: formData,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },

          success: function (res) {
            wx.hideToast();
            wx.setStorage({
              key: 'orderInfo',
              data: formData
            });

            wx.setStorage({
              key: 'order',
              data: res.data
            });
            wx.navigateTo({
              url: '../payment/payment'
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
      fail:function(res){
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