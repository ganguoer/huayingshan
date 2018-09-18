var request = require("../../libs/proxy.js");
var PushHandle = require("../../libs/doPull.js"); //simpleCall
var BaseModel = request.BaseModel;
//var BaseModel = request.simpleCall;
Page({
  data: {
    getMore:true,
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
      case '8': leftX= "33%";break;
      case '9': leftX= "67%";break;
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
    this.model.loadData({
      path: "/tscnews/selectNewsForApplet",
      data: {
        newsType: selType
      },
      success: function (res) {
        if (res.status == "SUCCESS" && res.data) {
          var itemList = self.data.items;
          itemList = itemList.concat(res.data.news);
          console.log(itemList);
          self.setData({
            items: itemList,
            getMore: self.model.hasNextPage()
          });
        }
      }
    });
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
  onLoad: function (options) {
    var param = options;
    var self = this;
    this.model = new BaseModel();
    var list = ["吃", "住", "行", "游", "购", "娱"];
    wx.setNavigationBarTitle({
      title: list[param.id - 1]
    })
    this.model.loadData({
      path: "/tscnews/selectNewsForApplet",
      data: {
        newsType: param.id
      },
      success: function (res) {
        if (res.status == "SUCCESS" && res.data) {
          var itemList = self.data.items;
          itemList = itemList.concat(res.data.news);
          for (var i in itemList) {
            itemList[i].newsThumbnail = itemList[i].newsThumbnail && itemList[i].newsThumbnail.replace(/\\/g, "/");
          }
          self.setData({
            items: itemList,
            getMore: self.model.hasNextPage()
          });
        }

      }
    });
  },
  pullListEnd:function(e){
    var self = this;
    var pushHandle = new PushHandle(function(){
      self.model.getNextPage();
    });
    pushHandle.isListEnd(e);
  }
  
})
