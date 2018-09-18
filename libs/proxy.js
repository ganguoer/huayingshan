/**
 * author 
 * add by mjw
 */
//带系统的调用
function getConfig(){
  //获取小程序实例
  var apiInst = getApp(),
  //获取配置信息
  config = apiInst.getConfig();
  return config ? config : null;
}
var reqProxy = function (options/*obj*/,isCallMe,SystemCall/*如果需要返回微信的原生调用请传此参数为true*/) {
  var pUrl = null;
  var baseUrl = null;
  var config = getConfig();
  
  //apiBase为 config.js中的配置项。
  if(isCallMe){
    baseUrl = isCallMe;
  }else{
    baseUrl = config ? config.apiBase : "citgroup.cn";
  }
  

  var path = null, data = null, success = null, types = null;
  if (options && typeof options === "object") {
    path = options.path;
    data = options.data;
    success = options.success;
    types = options.types;
  } else {
    return;
  }
  types = types ? types : "post";

  if (!path) {
    return;
  } else {
    pUrl = baseUrl + path;
    data = data ? JSON.stringify(data) : "";
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
  //请求微信的接口调用
    wx.request({
      url: pUrl,
      data: data,
      method: types,
      header: {
        'content-type': 'application/json'
      },
      success: function(res){
          wx.hideLoading();
            if (SystemCall){
              options.success(res);
            }else{
              options.success(res.data);
            }
            
        
      }
    });
  }
}

var reqPHPProxy = function (options/*obj*/, SystemCall/*如果需要返回微信的原生调用请传此参数为true*/) {
  var pUrl = null;
  var self = this;
  var data = null;
  if (!options) {
    return "必须传递参数";
  }

 
  // var config = getConfig();
  var baseUrl = options.path;


  var path = null, data = null, success = null, types = null;
  if (options && typeof options === "object") {
    //url
    pUrl = baseUrl;
    //分页
    pUrl += ("/" + options.data.page + "?");
  } else {
    return;
  }

  //参数
  for (var key in data) {
    if (key == "page" || key == "pageSize") {
      continue;
    } else {
      pUrl += (key + '=' + data[key] + '&');
    }

  }
  pUrl = (pUrl[pUrl.length - 1] == '?' || pUrl[pUrl.length - 1] == '&') ? pUrl.slice(0, -1) : pUrl;


  wx.showLoading({
    title: "加载中...",
    mask: true
  });
  types = "GET";
  wx.request({
    url: pUrl,
    method: types,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      wx.hideLoading();
      if (SystemCall) {
        options.success(res);
      } else {
        options.success(res.data);
      }


    }
  });
}


//构造函数，创建分页查询对象
var DataPool = function(page,pageSize){
    this.hasNext = true,
    //总记录数
    this.total=0,
    //当前页面
    this.page = page || 1,
    this.isphp=false;
    //页大小
    this.pageSize = pageSize || 10;
}
/**
 * 如果不需要分页，isPage = true;
 */
DataPool.prototype.loadPHPData = function (options, isPage){
  this.page = 0;
  var pUrl = null;
  var self = this;
  var data = null;
  if (!options) {
    return "必须传递参数";
  }
  this.options = options;
  // var config = getConfig();
  var baseUrl = options.path;


  var path = null, data = null, success = null, types = null;
  if (options && typeof options === "object") {
    pUrl = baseUrl;
    data = options.data || {};
    this.page =data.page;
    this.isphp=data.isphp;
    success = options.success;
  } else {
    return;
  }
  if(!isPage){
    pUrl += ("/" + this.page + "?");
  }
  //分页
  
  //参数
  for (var key in data) {
    if (key=="page" || key=="pageSize"){
      continue;
    }else{
      pUrl += (key + '=' + data[key] + '&');
    }
    
  }
  pUrl = (pUrl[pUrl.length - 1] == '?' || pUrl[pUrl.length - 1] == '&') ? pUrl.slice(0, -1) : pUrl;
  console.log(pUrl);


  types = "GET";
  wx.request({
    url: pUrl,
    method: types,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var dt = res.data;
      if (dt.success == "true" || dt.success == true) {
        wx.hideLoading(); 
        self.total =  dt.content.total ? dt.content.total : 0;
        options.success(res.data);
      }
    }
  });


}

/**
 * loadData
 * 将从第一页开始加载。
 * 分页调用
 */
DataPool.prototype.loadData = function(options,isCallMe){
  this.page = 1;
  var pUrl = null;
  var self = this;
  if (!options) {
    return "必须传递参数";
  }
  this.options = options;

  var config = getConfig();
 var baseUrl = null;

  
  var path = null, data = null, success = null, types = null;
  if (options && typeof options === "object") {
    path = options.path;
        data = options.data || {};
        data.page = this.page;
        data.pageSize = this.pageSize;
      
    success = options.success;
    types = options.types;
  } else {
    return;
  }

 
  if (isCallMe) {
    baseUrl = isCallMe;
    data=[];
  } else {
    baseUrl = config ? config.apiBase : "citgroup.cn";
  }
  types = types ? types : "post";
 

  if (!path ) {
   
   return;
  } else {
    pUrl = baseUrl + path;
 
    data = data ? JSON.stringify(data) : "";
    wx.showLoading({
      title: "加载中...",
      mask: true
    });
    //请求微信的接口调用
    wx.request({
      url: pUrl,
      data: data,
      method: types,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var dt = res.data;
        
        if (dt.status == "SUCCESS") {
          wx.hideLoading();
        
          self.total = self.num = dt.data.totalNum ? dt.data.totalNum : dt.data.total ? dt.data.toal : 0;          
          options.success(res.data);
        }
        if ( dt.success) {
          wx.hideLoading();
         self.total = self.num = dt.data.totalNum ? dt.data.totalNum : dt.data.total ? dt.data.toal : 0;
          console.log(pUrl+'='+data);
          options.success(res);
        }
      }
    });
  }
},
/**
 * 如果返回的数据格式如下
 * {
 *  status:"SUCCESS",
 *  data:{
 *    total/num : "234",
 *    result:[item1,item2,item...] 
 *  }
 * }
 */

/**
 * step1:通过num(total),计算出总页数。pagemax = num/.pageSize;
 * step2:游标记录当前页数页。
 * 触发一次加载数据的项，游标后移一位。
 */

//计算总页数
DataPool.prototype.calcPageMax = function(){
  return Math.ceil(this.total/this.pageSize);
}

//是否有下一页数据。
DataPool.prototype.hasNextPage = function(){
  var self = this;
  console.log(self);
  if (self.total == 0) {
    return false;
  } else {
    //总页面数为
    var totalPage = this.calcPageMax();
    var validPage=0;
    if (self.isphp) {
      validPage = self.page+1;
    } else {
      validPage = self.page;
    }

    //页数是否大于页总数
    if (validPage>= totalPage) {
      self.hasNext = false;
      return false;
    } else {
      self.hasNext = true;
      return true;
    }
  }
}
//获取下一页数据。,如果有数据将一直获取，没有下一页数据则返回false;
DataPool.prototype.getNextPage = function(isPHP){
  if (this.hasNextPage()){      
      if(isPHP){
        reqPHPProxy(this.getOptions());
      }else{
        reqProxy(this.getOptions());
      }
      return true;
    }else{
      return false;
    }
}

//调整分布参数
DataPool.prototype.getOptions = function(){
  this.page ++;
  if(this.options){
    this.options.data = this.options.data || {};
    this.options.data.page = this.page;
    this.options.data.pageSize = this.pageSize;
  }
  return this.options;
}


module.exports = {
  //详情页
  simpleCall: reqProxy,
  //列表页调此接口
  BaseModel:DataPool
}

//有没有下一页数据，如果有返回true,没有返回false
//hasNextPage方法

//获取下一页数据
//getNextPage