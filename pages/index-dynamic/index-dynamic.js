var request = require("../../libs/proxy.js");
var PushHandle = require("../../libs/doPull.js"); //simpleCall
var BaseModel = request.BaseModel;

var eatData = require('../../data/eat.js');
var zhuData = require('../../data/zhu.js');
var walkData = require('../../data/walk.js');
var youData = require('../../data/you.js');
var shopData = require('../../data/shop.js');
var yuData = require('../../data/yu.js');
//var BaseModel = request.simpleCall;
Page({
  data: {
    getMore:false,
    newsActive:7,
    items:[]
  },
  model:null,
  goArticle:function(e){
   var dtSet =  e.currentTarget.dataset;
   var articleId = dtSet.articleid;
    console.log(articleId);
    wx.navigateTo({
      url: '../articleDetails/articleDetails?articleId=' + articleId
    });
  },
  pushHandle:null,
  onLoad: function (options) {
    var param = options;
    var self = this;
    this.model = new BaseModel();
    var list = ["吃", "住", "行", "游", "购", "娱"];
    wx.setNavigationBarTitle({
      title: list[param.id - 1]
    })

    if (param.id == 1){
      this.setData({
        eatList: eatData.postList[0].data.news
      })
      console.log(eatData.postList[0].data.news)
    } else if (param.id == 2){
      this.setData({
        eatList: zhuData.postList[0].data.news
      })
    } else if (param.id == 3) {
      this.setData({
        eatList: walkData.postList[0].data.news
      })
    } else if (param.id == 4) {
      this.setData({
        eatList: youData.postList[0].data.news
      })
    } else if (param.id == 5) {
      this.setData({
        eatList: shopData.postList[0].data.news
      })
    } else if (param.id == 6) {
      this.setData({
        eatList: yuData.postList[0].data.news
      })
    }else{
      console.log('nobody')
    }
     
    
   
 
    // console.log(eatData.postList[0].data.news)

  },
  
})
