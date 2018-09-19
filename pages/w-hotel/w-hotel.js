// pages/w-hotel/w-hotel.js

// var config=require('../../config.js')
var hotelData = require('../../data/hotel.js')

var request = require("../../libs/proxy.js");
var PushHandle = require("../../libs/doPull.js"); //simpleCall
var BaseModel = request.BaseModel;
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

    this.setData({
      hotelList: hotelData.postList[0].content.info1
    })
    // console.log(that.posts_key)
    console.log(postsData.postList[0].content.info1)
    
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
//**************************************************** */
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     list: [],
//     scrollTop: 0,
//     scrollHeight: 0,
//     name:'',
//     getMore: true,
//     page:0,
//     disabled:false
//   },
//   model: null,

//   pushHandle: null,
//   //搜索，访问网络
 
//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {

//     /****************************************** */
//     var that = this;
//     wx.getSystemInfo({
//       success: function (res) {
//         that.setData({
//           scrollHeight: res.windowHeight
//         });
//       }
//     });
//     that.loadPHPData();

//   },
//   //加载数据
//   loadPHPData:function(){
//     var self = this;
//     this.model = new BaseModel();
  
//     this.model.loadPHPData({
//       path: postsData.postList,
//       types: 'GET',
//       data:{
//         isphp:true,
//         page:0
//       },
//       success: function (res) {
//         console.log("返回数据：", res);
//         var list1 = self.data.list;
//         for (var i = 0; i < res.content.info1.length; i++) {
//           list1.push(res.content.info1[i]);
//         }
//         self.setData({
//           list: list1,
//           getMore: self.model.hasNextPage()
//         });


//       }
//     });
//   },
//   // 下拉刷新
//   pullListEnd: function (e) {
//     var self = this;
     
//     var pushHandle = new PushHandle(function () {
//       self.model.getNextPage(true);
//     });
//     pushHandle.isListEnd(e);
//   },

//   //关键字搜索
//   searchList: function (e) {
//     var self = this;   
//       if(!!self.data.name){
//         self.setData({
//           list: [],
//           disabled:true
//         });
//         this.model.loadPHPData({
//           path: postsData.postList,
//           types: 'GET',
//           data: {
//             name: self.data.name,
//             page:0,
//             isphp: true
//           },
//           success: function (res) {
//             console.log("返回数据：", res);
//             var list1 = self.data.list;
//             for (var i = 0; i < res.content.info1.length; i++) {
//               list1.push(res.content.info1[i]);
//             }
//             self.setData({
//               list: list1,
//               disabled: false,
//               getMore: self.model.hasNextPage()
//             });
//           }
//         });
//       }else{
//         wx.showToast({
//           title: '请输入酒店名称',
//           duration: 1000
//         })
//       }
//   },
//   searchName:function(e){
//     var that = this;
//     that.setData({
//       name: e.detail.value
//     })
//   },
 
// })