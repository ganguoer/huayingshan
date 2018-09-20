
var dynamic = require('../../data/dynamic.js')

var request = require("../../libs/proxy.js");
var PushHandle = require("../../libs/doPull.js"); //simpleCall
var BaseModel = request.BaseModel;
//var BaseModel = request.simpleCall;
Page({
  data: {
    getMore:false,
    newsActive:7,
    items:[]
  },
  model:null,
  getSelType:function(e){
    var self = this;
    this.data.items = [];
    var tartget = e.currentTarget.dataset;
    var selType = tartget.selid;
    var leftX = 0;
    switch(selType){
      case '8': leftX= "25%";break;
      case '9': leftX= "50%";break;
      case '10': leftX = "75%"; break;
      default : leftX = "0"
    }
    //设置头部位置
    self.setData({
      newsActive:selType,
      posX: leftX
    });
    //加载数据
    var self = this;
    this.model = new BaseModel();
    if (selType == 7) {
      this.setData({
        dynamics: dynamic.postList[0].data.news
      })
    }else if (selType==8){
      this.setData({
        dynamics: dynamic.postList[0].data.news2
      })
    }else if(selType==9){
      this.setData({
        dynamics: dynamic.postList[0].data.news3
      })
    }

    // this.model.loadData({
    //   path: "/tscnews/selectNewsForApplet",
    //   data: {
    //     newsType: selType
    //   },
    //   success: function (res) {
    //     if (res.status == "SUCCESS" && res.data) {
    //       var itemList = self.data.items;        
    //       itemList = itemList.concat(res.data.news);
    //       for (var i in itemList) {
    //         itemList[i].newsThumbnail = itemList[i].newsThumbnail && itemList[i].newsThumbnail.replace(/\\/g, "/");
    //         console.log(itemList[i].newsThumbnail);
    //       }
    //       self.setData({
    //         items: itemList,
    //         getMore: self.model.hasNextPage()
    //       });
    //     }
    //   }
    // });
  },
  goArticle:function(e){
   var dtSet =  e.currentTarget.dataset;
   var articleId = dtSet.articleid;
    console.log(articleId);
    wx.navigateTo({
      url: '../articleDetails/articleDetails?articleId=' + articleId
    });
  },
  pushHandle:null,
  onLoad: function () {
    var self = this;
    this.model = new BaseModel();
      this.setData({
        dynamics: dynamic.postList[0].data.news
      })
      // console.log(that.posts_key)
    console.log(dynamic.postList[0].data.news)


    // this.model.loadData({
    //   path: "/tscnews/selectNewsForApplet",
    //   data: {
    //     newsType: "7"
    //   },
    //   success: function (res) {
    //     if (res.status == "SUCCESS" && res.data) {
    //       var itemList = self.data.items;         
    //       itemList = itemList.concat(res.data.news);
    //       for (var i in itemList) {
    //         itemList[i].newsThumbnail = itemList[i].newsThumbnail && itemList[i].newsThumbnail.replace(/\\/g,"/");            
    //       }
    //       self.setData({
    //         items: itemList,
    //         getMore: self.model.hasNextPage()
    //       });
    //     }

    //   }
    // });
  },
  pullListEnd:function(e){
    var self = this;
    var pushHandle = new PushHandle(function(){
      self.model.getNextPage();
    });
    pushHandle.isListEnd(e);
  }
  
})
