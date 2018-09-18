var Handle = function(callback,id){
    this.callback = callback;
    this.id = id ? (id.indexOf('#')==-1 ? "#"+id : id) : "#ListBody";
}


//检测到底
Handle.prototype.isListEnd = function(e){
  var self = this;
  var app = getApp();
  //获取选择器对象
  wx.getSystemInfo({
    success:function(res){
      var selectorQuery = wx.createSelectorQuery();
      //获取视口结点对象
      var nodesRef = selectorQuery.selectViewport();
      //获取节点高度
      nodesRef.boundingClientRect(function (rect) {
        self.viewPortH = res.windowHeight;
        var touchedInfo = e.changedTouches[0];
        //获取距离视口顶部的位置
        var toTop = touchedInfo.clientY;
        console.log(toTop);
        //触摸点相对于底部的位置为
        var toBottom = self.viewPortH - toTop;
        //当文档相对于可视区的高度为
        var currentDocHeight = touchedInfo.pageY + toBottom;

        wx.createSelectorQuery().select(self.id).boundingClientRect(function (rect) {
          var docHeight = rect.height  // 节点的高度
          //如果文档已经到底部，那么加载下一页
          if (currentDocHeight >= docHeight) {
            self.callback();
          }
        }).exec();


      }).exec();
    }
  });
 



}

module.exports = Handle;