var config = require("config.js");
//app.js
App({
  onLaunch: function () {
    var config = require("./config.js");
    this.setConfig(config);
    this.onLogin();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
 

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function () {

  },

  onLogin:function(){
    wx.login({
      success: function (res) {
        console.log(res);
        wx.setStorage({
          key: 'code',
          data: res.code,
        });

        wx.request({
          url: config.ecLogin,
          data: {
            code: res.code,
            
          },
          method: 'GET',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
           
             //存储sessionkey
              wx.setStorage({
                key: 'sessionkey',
                data: res.data.status,
              });
              
            
              //存储mid
              wx.setStorageSync('mid',res.data.mid);
            
              wx.setStorage({
                key: 'mid',
                data: res.data.mid,
              });

          }
        })
      }
    })
  },
  globalData: {
    userInfo: null
  },
  setConfig:function(config){
    this.config = config;
  },
  getConfig: function () {
    if (!this.config) {
      console.log("配置未被正确加载~");
      return;
    } else {
      return this.config;
    }
  },
})