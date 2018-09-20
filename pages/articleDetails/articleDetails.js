
var eatdetailData = require('../../data/eatdetail.js')

var WxParse = require('../../wxParse/wxParse.js');
var request = require("../../libs/proxy.js");
var BaseModel = request.simpleCall;
// articleDetails.js
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
    console.log("log------------------------>articleId");
    console.log(options.articleId);
    
    var id = options.articleId;

    this.setData({
      eatdetailList: eatdetailData.postList[0].data
    })
   


    // wx.request({
    //   url: 'https://citgroup.cn/findById',
    //   data: {
    //     id: options && options.articleId
    //   },
    //   method: "post",
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     //res.data为我们自己后台的返回
    //     var that = this;
    //        console.log(res);
    //     if(res.status == "SUCCESS"){
    //       if(res.data){
    //         var articleInfo = res.data;
    //         var txt = articleInfo.newsDescribe;
    //         txt = txt.replace(/\/?u\//g,"http://www.citgroup.cn/u/");
    //         WxParse.wxParse('article', 'html', txt, self, 5);
    //         self.setData({
    //           title: articleInfo.newsName,
    //           time: articleInfo.infoModifiedtime
    //          }
    //         );
    //       }
    //     }
    //   }
    // });
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