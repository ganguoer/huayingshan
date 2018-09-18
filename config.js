/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/lao

var imgUrl ='https://mjw.citgroup.cn/mapImages/image';

var host = "mjw.citgroup.cn"

var echost='shilin.citgroup.cn'

// var echost = '192.168.2.186'
var config = {
 
    // 下面的地址配合云端 Server 工作
    // host,
     shilinHost: `http://${echost}/`,
    //酒店列表接口
     hotelList: `https://${echost}/phone/api/hotel/index`,
    //酒店详情接口
     hotelShow: `https://${echost}/phone/api/hotel/show/`,
    //酒店下单接口
     hotelOrder: `https://${echost}/phone/api/login/create`,
    //门票列表接口
     spotList: `https://${echost}/phone/api/spot/index`,
    //门票详情接口
     spotShow: `https://${echost}/phone/api/spot/show/`,
    //门票下单接口
     spotOrder: `https://${echost}/phone/api/login/spotCreate`,
    //支付接口
    orderPay: `https://${echost}/phone/wxpay/weixinpay`,
    //登陆接口
    ecLogin: `https://${echost}/phone/member/login/wx_login`,
    //个人订单接口
    myOrder: `https://${echost}/phone/api/order/list/`,

    //数据接口调用
    apiBase: `https://${host}`,

    // 登录地址，用于建立会话
    loginUrl: `https://${host}/login`,

    // 测试的请求地址，用于测试会话
    requestUrl: `https://${host}/testRequest`,

    // 用code换取openId
    openIdUrl: `https://${host}/openid`,

    // 测试的信道服务接口
    tunnelUrl: `https://${host}/tunnel`,

    // 生成支付订单的接口
    paymentUrl: `https://${host}/payment`,

    // 发送模板消息接口
    templateMessageUrl: `https://${host}/templateMessage`,

    // 上传文件接口
    uploadFileUrl: `https://${host}/upload`,

    // 下载示例图片接口
    downloadExampleUrl: `https://${host}/static/weapp.jpg`
};

module.exports = config
