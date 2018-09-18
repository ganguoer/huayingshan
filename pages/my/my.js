// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    this.reLoad();
  },


  reLoad: function (options){
    var that = this;
    wx.checkSession({
      success: function (res) {
        wx.getUserInfo({
          success: function (res) {
            console.log(res);
            that.setData({
              userinfo: res.userInfo
            });
          }
        })
        
      },
      fail: function (res) {
        //登陆按钮
        
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
    // var that = this;
    // // 获取用户资料
    // wx.getUserInfo({
    //   success: function (res) {
    //     that.setData({
    //       userinfo: res.userInfo
    //     });
    //   }
    // });
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