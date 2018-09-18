var bmap = require('../../libs/bmap-wx.min.js');
var proxy = require("../../libs/proxy.js");
var BaseModel = proxy.simpleCall;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxImgWidth: 0,
    minImgWidth: 0,
    scall: 10,
    varySmall: false,//是否最少了
    varyBig: false,//是否最大了
    mapUrl: "",
    lineList: [],
    linesArray: [{
      dtTop: 30,
      dtLeft: 200
    }, {
      dtTop: 100,
      dtLeft: 260
    }, {
      dtTop: 150,
      dtLeft: 370
    }, {
      dtTop: 180,
      dtLeft: 300
    }],
    mapLinesArray: []
  },
  //推荐路线
  recomandLines: function () {
   
    var self = this;
    self.data.isType = self.data.isType == 1 ? 0 : 1;
    var lineType = self.data.isType;
    if(lineType != 1){
      self.setData({
        linesListHeight: 0,
        paddingBottom: 0,
      });
    }else{
      this.setData({
        isType: lineType
      });
      var jqDt = self.jqData;
      if (jqDt) {
        console.log(jqDt.routes.length * 40)
        self.setData({
          linesListHeight: jqDt.routes.length * 40,
          paddingBottom:50,
          lineList: jqDt.routes
        })
      }
    }
    
  },
  onPullDownRefresh:function(){
    wx.stopPullDownRefresh();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var self = this;
    this.jqId = options.jqId;
    //初始化开用区域高度和宽度
    wx.getSystemInfo({
      success: function (res) {
        self.setData({
          minImgWidth: res.windowWidth,
          mapHeight: res.windowHeight
        });

        var center = self.getViewMapCenter();
        self.setData({
          cLeft: center.left,
          cTop: center.top
        });
      }
    });
    self.setData({
      linesListHeight: 0,
      paddingBottom: 0,
    })

    //获取参数
    console.log(options);
    this.model = new BaseModel({
      path: "/tscenic/selectSceniceInfosForApplet",
      data: {
        pkScenic: options.jqId
      },
      success: function (res) {
        //获取景区数据
        self.jqData = res.data;
        var mapImage = res.data.mapInfo.mapPath;
        self.pkMap = res.data.mapInfo.pkMap;
        mapImage = mapImage.replace(/\\/g, "//");
        var mapUrl = "https://mjw.citgroup.cn" + mapImage;
        self.setData({
          mapUrl: mapUrl
        });

      }
    });
  },
  initImage: function (event) {

    var self = this;
    console.log(event.detail);
    var imageDetail = event.detail;
    var minHeight = self.data.mapHeight;
    //初始缩放比例按地图高度计算
    var initScall = (minHeight / imageDetail.height) * 10;
    //保存初始缩放比
    self.initSize = initScall;
    self.backScall = initScall;
    self.setData({
      scall: initScall
    });
    console.log("初始缩放比例为:", initScall / 10);
    this.setData({
      maxImgWidth: imageDetail.width,
      maxImgHeight: imageDetail.height,
      imageWidth: imageDetail.width,
      imageHeight: imageDetail.height
    });
    var imgWidth = this.data.maxImgWidth * (this.data.scall / 10);
    var imgHeight = this.data.maxImgHeight * (this.data.scall / 10);
    //初始化地图在中间显示
    self.posX = self.data.minImgWidth / 2 - imgWidth / 2;
    this.setData({
      imageWidth: imgWidth,
      imageHeight: imgHeight,
      mapLeft: self.posX,
      mapTop: 0
    });
    //重新计算标注的位置
    this.calcRateFlag();
    //  this.drawLine(this.data.mapLinesArray);
  },
  //初始化缩放比
  initScall: function () {
    var self = this;
    self.isReset = true;
    //原比例
    self.backScall = self.initSize;
    //放回初始比例，不是最大了
    self.data.varyBig = false;
    self.setData({
      scall: self.initSize
    });
    var imgWidth = this.data.maxImgWidth * (this.data.scall / 10);
    var imgHeight = this.data.maxImgHeight * (this.data.scall / 10);
    //初始化地图在中间显示
    self.posX = self.data.minImgWidth / 2 - imgWidth / 2;
    self.posY = 0;
    this.setData({
      imageWidth: imgWidth,
      imageHeight: imgHeight,
      mapLeft: self.posX,
      mapTop: 0
    });
    //重新计算标注的位置
    this.calcRateFlag();
  },
  drawLine: function (ptArry) {
    var arrayPt = ptArry;
    // 使用 wx.createContext 获取绘图上下文 context
    var context = wx.createCanvasContext('router')
    context.setStrokeStyle("#ff0000");
    context.setLineWidth(2);
    context.clearRect(0, 0, this.data.imageWidth, this.data.imageHeight);
    if (arrayPt.length == 0) return;
    context.moveTo(arrayPt[0].nodeHorizontal, arrayPt[0].nodeVertical);
    arrayPt.forEach(function (e) {
      context.lineTo(e.nodeHorizontal, e.nodeVertical)
    })


    context.stroke()
    context.draw();
  },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function (context) {

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

  //重新计算线标注比例
  getReCalcRateFlag: function (arry) {
    //  this.justPosInit();
    var self = this;
    var linesArray = arry;
    var mapLinesArrary = [];
    for (var line in linesArray) {
      var lineChange = {};

      lineChange.vpointHorizontal = linesArray[line].vpointHorizontal * (self.data.scall / 10);
      lineChange.vpointVertical = linesArray[line].vpointVertical * (self.data.scall / 10);
      lineChange.pkSpotBase = linesArray[line].pkSpotBase;
      lineChange.spotName = linesArray[line].spotName;
      mapLinesArrary.push(lineChange);
    }

    // this.drawLine(this.data.mapLinesArray);
    self.mapArray = mapLinesArrary;
    return mapLinesArrary;
  },
  //放到最大并移动到指定点00位置
  bigToMost: function (pt) {
    var self = this;
    this.data.varySmall = false;
    //设定缩放到最大1-10
    self.data.scall = 10;
    var imgWidth = this.data.maxImgWidth;
    var imgHeight = this.data.maxImgHeight;
    if (imgWidth > this.data.maxImgWidth) {
      this.data.varyBig = true;
      //回退，此次放大无效
      this.data.scall -= 1;
      return;
    };
    //计算指定点的位置
    self.posX = 0;
    self.posY = 0;
    var center = self.getViewMapCenter();
    self.posX = center.left - pt.left;
    self.posY = center.top - pt.top;
    this.setData({
      imageWidth: imgWidth,
      imageHeight: imgHeight,
      mapLeft: self.posX,
      mapTop: self.posY,
      pt: pt,
      isAnimial: true
    });
    //重新计算标注的位置
    this.calcRateFlag();
  },
  //调整中点放大后偏移
  adjustOffsetCenter: function () {
    var self = this;
    //flag1
    var center = self.getViewMapCenter();
    var MapCenterX = center.left - self.posX;
    var MapCenterY = center.top - self.posY;
    //缩放前的尺寸
    var backX = this.data.maxImgWidth * (self.backScall / 10);
    var backY = this.data.maxImgHeight * (self.backScall / 10);

    //缩放后的尺寸
    var currentX = this.data.maxImgWidth * (self.data.scall / 10);
    var currentY = this.data.maxImgHeight * (self.data.scall / 10);
    //取二者的中间值，则放大了这么多尺寸
    var diffX = (currentX - backX) / 2;
    var diffY = (currentY - backY) / 2
    self.posX = self.posX - diffX;
    self.posY = self.posY - diffY;
  },
  //之前的尺寸
  backScall: 1,
  //放大地图
  bigImg: function () {
    var self = this;
    if (this.data.varyBig) {
      return;
    } else {

      //能放大，则一定能缩小到原来的尺寸
      this.data.varySmall = false;
      self.backScall = this.data.scall;
      this.data.scall += 1;
    }



    var imgWidth = this.data.maxImgWidth * (this.data.scall / 10);
    var imgHeight = this.data.maxImgHeight * (this.data.scall / 10);
    if (imgWidth > this.data.maxImgWidth) {
      this.data.varyBig = true;
      //回退，此次放大无效

      this.data.scall -= 1;
      self.backScall = this.data.scall;
      return;
    };
    var center = self.getViewMapCenter();
    //调整地图的偏移
    self.adjustOffsetCenter();
    this.setData({
      imageWidth: imgWidth,
      imageHeight: imgHeight,
      mapLeft: self.posX,
      mapTop: self.posY
    });
    //重新计算标注的位置
    this.calcRateFlag();

  },
  //开始移动的位置
  posStart: null,
  //结束的位置
  posEnd: null,
  //绝对定位的x起始位置
  posX: 0,
  //绝对定位的y起始位置
  posY: 0,
  shiftStart: function (e) {
    var pos = e.changedTouches[0];
    this.posStart = this.posStart || {};
    this.posStart.ptStartX = pos.clientX;
    this.posStart.ptStartY = pos.clientY;
  },
  //点击地图上的某个景点
  clickMapJd: function (e) {
    // console.log(e.currentTarget);
    // this.data.scall = 10;
    var target = e.currentTarget;
    var dataset = target.dataset;
    //重新计算标注的位置

    var self = this;
    var jdData = self.jqData;
    var spots = jdData && jdData.spots;

    var spot = dataset && dataset.spot;

    this.setData({
      spot: spot
    });
    var point = {};
    point.left = target.offsetLeft;
    point.top = target.offsetTop;
    var pt = {};
    for (var i = 0; i < spots.length; i++) {
      if (spots[i].pkSpotBase == spot) {
        pt.left = spots[i].vpointHorizontal;
        pt.top = spots[i].vpointVertical;
        pt.spotName = spots[i].spotName;
        pt.spotProfile = spots[i].spotProfile;
        pt.spotLogo = spots[i].spotLogo && spots[i].spotLogo.replace(/\\/g, "/");//
        pt.spotVoice = spots[i].spotVoice && spots[i].spotVoice.replace(/\\/g, "/");
        break;
      }
    }
    self.setData({
      pt:pt,
      isShowModel:true
    });
    //将地图移动到中间位置
    // this.movePointToCenter(pt);
    //将地图放到最大
    // this.bigToMost(pt);
  },
  closeJdModel: function (e) {
    this.setData({
      isShowModel: false,
      isPlay:false
    });
    wx.pauseBackgroundAudio();
    this.setData({
      isPaly: false
    });
  },
  //移动到
  shiftTo: function (e) {
    var self = this;
    var pos = e.changedTouches[0];
    this.posEnd = this.posEnd || {};
    this.posEnd.ptEndX = pos.clientX;
    this.posEnd.ptEndY = pos.clientY;

    self.moveMap();


  },
  //移动地图
  moveMap: function () {
    var self = this;
    this.posX += (this.posEnd.ptEndX - this.posStart.ptStartX);
    this.posY += (this.posEnd.ptEndY - this.posStart.ptStartY);

    //下边界的范围
    var xLeft = self.data.minImgWidth - self.data.imageWidth;
    var yTop = self.data.mapHeight - self.data.imageHeight > 0 ? 0 : self.data.mapHeight - self.data.imageHeight;
    //限定左边界的移动位置
    if (this.posX > 0) {
      this.posX = 0;
    }
    //限定上边界的移动位置
    if (this.posY > 0) {
      this.posY = 0;

    }
    //限定右边界的移动位置
    if (this.posX < xLeft) {
      this.posX = xLeft;
    }
    //限定下边界的移动位置
    if (this.posY < yTop) {

      this.posY = yTop;
    }


    self.setData({
      mapLeft: self.posX,
      mapTop: self.posY
    });

  },
  //显示的类型 (1)-景点(1-景点) ， (2)-服务（2.厕所，3）
  isType: 0,

  //放大缩小后的映射地址
  mapArray: [],

  //缩小地图
  smallImg: function () {
    var self = this;
    //太小则不能再缩小
    if (this.data.varySmall) {
      return;
    } else {
      //能缩小则，则一定能放大到原来的尺寸
      this.data.varyBig = false;
      self.backScall = this.data.scall;
      //缩小0.1倍
      this.data.scall -= 1;
    }

    var imgWidth = this.data.maxImgWidth * (this.data.scall / 10);
    var imgHeight = this.data.maxImgHeight * (this.data.scall / 10);
    //缩小的宽比最小跨度小，则太小了
    if (imgWidth < this.data.minImgWidth) {
      this.data.varySmall = true;
      //回退，此次缩小无效
      this.data.scall += 1;
      self.backScall = this.data.scall;
      return;
    }

    if (imgHeight < this.data.mapHeight) {
      this.data.varySmall = true;
      //回退，此次缩小无效
      this.data.scall += 1;
      return;
    }
    //调整左上角的偏移
    self.adjustOffsetCenter();
    this.setData({
      imageWidth: imgWidth,
      imageHeight: imgHeight,
      mapLeft: self.posX,
      mapTop: self.posY,
      isAnimial: false
    });


    //重新计算标注的位置
    this.calcRateFlag();
    //调整右边界距离
    this.justRightRange();

  },
  //两次点击显示隐藏景点
  doubleClick: false,
  calcRateFlag: function () {
    var self = this;
    if (!self.jqData) {
      return;
    }
    var jqDt = self.jqData;
    var self = this;
    // 线路位置重算
    if (self.isType == 1 && self.isDrawRouter) {
      if (self.nodeList && !self.nodeList.length) {
        return;
      } else {
        var jqLine = self.getNodeCalcRateFlag(self.nodeList);
        self.drawLine(jqLine);
      }
      /*下面是听取杨总意见修改*/
    }

    //景点位置重算
    if (self.data.isType == 2) {
      if (jqDt.spots && !jqDt.spots.length) {
        return;
      } else {
        // self.drawLine(lines);
        self.setData({
          isType: 2,
          jdData: self.getReCalcRateFlag(jqDt.spots)
        });
      }
    }

    //服务点位置重算
    if (self.data.isType == 3) {
      if (self.services && !self.services.length) {
        return;
      } else {
        // self.drawLine(lines);
        self.setData({
          isType: 3,
          cesuoData: self.getReCalcRateFlag(self.services)
        });
      }
    }

  },
  /**
   * 用户点击右上角分享
   */
  justPosInit: function () {
    var self = this;
    self.posX = 0;
    self.posY = 0;
    this.setData({
      mapLeft: self.posX,
      mapTop: self.posY
    });

  },
  //获取地图的中心点位置
  getMapCenter: function () {

  },
  movePointToCenter: function (point) {
    var self = this;
    var center = this.getViewMapCenter();
    //x轴上相对于可视区的偏移
    var diffX = point.left - Math.abs(self.posX);
    //y轴上相对于可视区的偏移
    var diffY = point.top - Math.abs(self.posY);
    //向中心移动的位置是左差
    var $diffX = diffX - center.left;
    var $diffY = diffY - center.top;
    console.log("$diffX", $diffX);
    console.log("$diffY", $diffY);
    self.posX = self.posX - $diffX;
    self.posY = self.posY - $diffY;

    self.setData({
      mapLeft: self.posX,
      mapTop: self.posY
    });
  },
  //获取可视区的中心位置
  getViewMapCenter: function () {
    //下坐标
    var topH = this.data.mapHeight;
    //右坐标
    var leftW = this.data.minImgWidth;
    var center = {};
    center.left = leftW / 2;
    center.top = topH / 2;
    return center;
  },
  //从中心位置进和缩放
  scallFromViewCenter: function () {

  },
  onShareAppMessage: function () {
    var BMap = new bmap.BMapWX({
      ak: 'PGngpxpl61tITF2YUcGYHf3Q54orVCqr'
    });


    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      console.log(data);

    }
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success,
      iconPath: '../../image/location.png',
      iconTapPath: '../../image/location.png'
    });
  },
  //景区数据
  jqData: null,
  jdData: null,
  //点击景点-默认
  clickJd: function (e) {
    this.setData({
      isType: 2,
      linesListHeight: 0,
      paddingBottom: 0
    });
    var self = this;
    var jqDt = self.jqData;
    if (!jqDt) {
      return;
    } else {
      self.jdData = jqDt.spots;
    }

    //如果没有景点
    if (self.jdData && self.jdData.length == 0) {
      wx.showToast({
        title: '没有相关景点',
      })
    } else {
      self.setData({
        isType: 2,
        jdData: self.getReCalcRateFlag(jqDt.spots)
      });
    }
  },
  isStop: false,
  //文字介绍
  clickDescribe: function () {

  },
  //景点解说
  clickVoice: function (e) {

    this.isStop = !this.isStop;
    var target = e.currentTarget;
    var dataset = target.dataset;
    if (this.isStop) {
      wx.playBackgroundAudio({
        dataUrl: "https://mjw.citgroup.cn" + dataset.jdvoice,
        title: '语音',
        coverImgUrl: ''
      });
      this.setData({
        isPaly: true
      });
    } else {
      wx.pauseBackgroundAudio();
      this.setData({
        isPaly: false
      });
    }


  },
  doubleClick: true,
  //厕所3
  clickCesuo: function (e) {
    this.setData({
      isType: 3,
      linesListHeight: 0,
      paddingBottom: 0
    });
    var self = this;
    var jqDt = self.jqData;
    var serviceList = [];
    if (!jqDt) {
      return;
    } else {
      var services = jqDt.services;
      if (services.length == 0 || services.length == null) {
        wx.showToast({
          title: '附近没有服务',
        })
      }
      for (var j = 0; j < services.length; j++) {
        if (services[j].serviceName == "厕所") {
          serviceList.push(services[j]);
        }
      }
      self.services = serviceList;
    }

    //如果没有景点
    if (serviceList && serviceList.length == 0) {
      wx.showToast({
        title: '附近没有厕所',
      })
    } else {
      self.setData({
        isType: 3,
        cesuoData: self.getReCalcRateFlag(serviceList)
      });


    }
  },
  //公交4
  clickGongjiao: function (e) {
    this.setData({
      isType: 4
    });
  },
  //超市5
  clickSuperMarket: function (e) {
    this.setData({
      isType: 5
    });
  },
  //住宿6
  clickZhusu: function (e) {
    this.setData({
      isType: 6
    });
  },
  loadingRouter:function(e){
    wx.hideLoading();
  },
  //获取我的位置
  isShowPos:false,
  MyPosition: function () {
    
    // wx.showToast({
    //   title: '不在指定范围内',
    // });
    var self = this;
    self.setData({
      linesListHeight: 0,
      paddingBottom: 0
    });
    
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log("当前经度：gps", latitude);
        console.log("当前纬度：gps", longitude);
        self.peoplePos = new BaseModel({
          path: "/tscmap/selectMapPosition",
          data: {
            pkMap: self.pkMap,
            pointLa: latitude,
            pointLo: longitude
          },
          success:function(res){
              if(res.status == "SUCCESS"){
                var data  = res.data;
                if(data.height < 0 || data.width <0){
                  wx.showToast({
                    title: '不在景区范围内',
                  });
                  return;
                }else{
                  self.isShowPos = !self.isShowPos;
                }
                console.log("坐标位置：",data);
                self.setData({
                  isShowPos:true,
                  peopleX:data.width*(self.data.scall/10),
                  peopleY:data.height*(self.data.scall / 10)
                });
              }
          }
        });
      }
    });
  },
  //重新计算线标注比例
  getNodeCalcRateFlag: function (arry) {
    // this.justPosInit();
    var self = this;
    var linesArray = arry;
    var mapLinesArrary = [];
    for (var line in linesArray) {
      var lineChange = {};
      lineChange.nodeHorizontal = linesArray[line].nodeHorizontal * (self.data.scall / 10);
      lineChange.nodeVertical = linesArray[line].nodeVertical * (self.data.scall / 10);
      mapLinesArrary.push(lineChange);
    }
    if(self.isDrawRouter){
      this.drawLine(this.data.mapLinesArray);
    }
     
    self.mapArray = mapLinesArrary;
    return mapLinesArrary;
  },
  //缩小时调整右边界
  justRightRange: function () {
    var self = this;
    //获取相对于可视区的中心实际坐标
    var viewX = self.posX + self.data.imageWidth;
    var viewY = self.posY + self.data.imageHeight;
    //下坐标
    var topH = this.data.mapHeight;
    //右坐标
    var leftW = this.data.minImgWidth;
    var isOutBoundX = viewX - leftW;
    var isOutBoundY = viewY - topH;
    if (isOutBoundX < 0) {
      self.posX += Math.abs(isOutBoundX);
    }

    if (isOutBoundY < 0) {
      self.posY += Math.abs(isOutBoundY);
    }

    self.setData({
      mapLeft: self.posX,
      mapTop: self.posY
    });
  },
  //线路选择时的编号
  selRoute:"",
  //线路选择事件
  getRouter: function (e) {
    var self = this;
    var target = e.currentTarget;
    //获取点击时的router-id
    var routerObj = target.dataset;
    if (!routerObj) {
      return;
    }

    var routerId = routerObj.id;
    self.selRoute = routerId;
    self.setData({
      selRoute: self.selRoute
    })
    this.jqSubLineModel = new BaseModel({
      path: "/maproute/selectRouteAndNodes",
      data: {
        pkRoute: routerId
      },
      success: function (res) {

        if (res.data && res.data.routeNodes) {

          var nodeList = res.data.routeNodes;
          //在这里协商一种策略，就是没有图片，直接按线路数据绘制路径
          if (res.data.drawnMapPath == "" || res.data.drawnMapPath == null){
              //计算线标注比例,按缩放比例绘制地图
              var lines = self.getNodeCalcRateFlag(nodeList);
              //绘制线
              self.drawLine(lines);
             // 将当前线路放入全局，以实现比例实现缩放。
              self.nodeList = nodeList;
              //按数据绘制
              self.isDrawRouter = true;
          }else{
              self.isDrawRouter = false;
              self.data.isType = 0;
              self.setData({
                routerImg: res.data.drawnMapPath,
                isType:0,
                linesListHeight:0,
                paddingBottom:0
              });
              wx.showLoading({
                title: '线路加载中',
              });
          }
      
      
        }
      }
    })
  }
})