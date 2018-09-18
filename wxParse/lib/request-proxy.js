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
var reqProxy = function (options/*obj*/,SystemCall/*如果需要返回微信的原生调用请传此参数为true*/) {
  var pUrl = null;
  var config = getConfig();
  //apiBase为 config.js中的配置项。
  var baseUrl = config ? config.apiBase : "citgroup.cn";

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
//构造函数，创建分页查询对象
var DataPool = function(page,size){
    this.hasNext = true,
    //总记录数
    //当前页面
    this.page = page || 1,
    //页大小
    this.size = size || 10;
}

/**
 * loadData
 * 将从第一页开始加载。
 * 分页调用
 */
DataPool.prototype.loadData = function(options){
  this.page = 1;
  var pUrl = null;
  var self = this;
  if (!options) {
    return "必须传递参数";
  }
  this.options = options;

  var config = getConfig();

  var baseUrl = config ? config.apiBase : "citgroup.cn";

  var path = null, data = null, success = null, types = null;
  if (options && typeof options === "object") {
    path = options.path;
        data = options.data || {};
        data.page = this.page;
        data.size = this.size;
      
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
      success: function (res) {
        var dt = res.data;
        if (dt.status == "SUCCESS") {
          wx.hideLoading();
          self.total = self.num = dt.data.num ? dt.data.num : dt.data.total ? dt.data.toal : 0;          
          options.success(res.data);
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
 * step1:通过num(total),计算出总页数。pagemax = num/size;
 * step2:游标记录当前页数页。
 * 触发一次加载数据的项，游标后移一位。
 */

//计算总页数
DataPool.prototype.calcPageMax = function(){
  return Math.ceil(this.total/this.size);
}

//是否有下一页数据。
DataPool.prototype.hasNextPage = function(){
  var self = this;
  if (self.total == 0) {
    return false;
  } else {
    //总页面数为
    var totalPage = this.calcPageMax();
    //页数是否大于页总数
    if (self.page >= totalPage) {
      self.hasNext = false;
      return false;
    } else {
      self.hasNext = true;
      return true;
    }
  }
}
//获取下一页数据。,如果有数据将一直获取，没有下一页数据则返回false;
DataPool.prototype.getNextPage = function(){
  if (this.hasNextPage()){
      reqProxy(this.getOptions());
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
    this.options.data.size = this.size;
  }

  return this.options;
}

module.exports = {
  reqProxySimple: reqProxy,
  BaseModel:DataPool
}