var http = require('http'),
    wechat = require('node-wechat')(your_token);

http.createServer(function (req, res) {
  //检验 token
  wechat.checkSignature(req, res);
  //预处理
  wechat.handler(req, res);

  //监听文本信息
  wechat.text(function (data) {

    //console.log(data.ToUserName);
    //console.log(data.FromUserName);
    //console.log(data.CreateTime);
    //console.log(data.MsgType);
    //...

    var msg = {
      FromUserName : data.ToUserName,
      ToUserName : data.FromUserName,
      //MsgType : "music",
      Title : "宋冬野",
      Description : "宋冬野——摩登天空7",
      MusicUrl : "http://zhangmenshiting.baidu.com/data2/music/71272862/44897031226800128.mp3?xcode=8c25fcb0e8157c1d4ee014e7c541cba8c3b34145ef4199ad",
      //HQMusicUrl : "http://zhangmenshiting.baidu.com/data2/music/71272862/44897031226800128.mp3?xcode=8c25fcb0e8157c1d4ee014e7c541cba8c3b34145ef4199ad",
      //FuncFlag : 0
    }

    //回复信息
    wechat.send(msg);
  });

  //监听图片信息
  wechat.image(function (data) {
    var msg = {
      FromUserName : data.ToUserName,
      ToUserName : data.FromUserName,
      //MsgType : "text",
      Content : "这是图片回复"
    }
    wechat.send(msg);
  });

  //监听地址信息
  wechat.location(function (data) {
    var msg = {
      FromUserName : data.ToUserName,
      ToUserName : data.FromUserName,
      //MsgType : "text",
      Content : "这是地址回复"
    }
    wechat.send(msg);
  });

  //监听链接信息
  wechat.link(function (data) {
    var msg = {
      FromUserName : data.ToUserName,
      ToUserName : data.FromUserName,
      //MsgType : "text",
      Content : "这是链接回复"
    }
    wechat.send(msg);
  });

  //监听事件信息
  wechat.event(function (data) {
    var msg = {
      FromUserName : data.ToUserName,
      ToUserName : data.FromUserName,
      //MsgType : "text",
      Content : (data.Event == "subscribe") ? "欢迎订阅" : "欢迎再次订阅"
    }
    wechat.send(msg);
  });

  //监听语音信息
  wechat.voice(function (data) {
    var msg = {
      FromUserName : data.ToUserName,
      ToUserName : data.FromUserName,
      //MsgType : "text",
      Content : "这是语音回复"
    }
    wechat.send(msg);
  });

  //监听视频信息
  wechat.video(function (data) {
    var msg = {
      FromUserName : data.ToUserName,
      ToUserName : data.FromUserName,
      //MsgType : "text",
      Content : "这是视频回复"
    }
    wechat.send(msg);
  });

  //监听所有信息
  wechat.all(function (data) {
    var msg = {
      FromUserName : data.ToUserName,
      ToUserName : data.FromUserName,
      //MsgType : "news",
      Articles : [
        {
          Title: "习近平印尼国会演讲 向现场观众问好:阿巴嘎坝",
          Description: "央广网雅加达10月3日消息 北京时间3日上午11时许，正在印度尼西亚进行国事访问的中国国家主席习近平，在印尼国会发表重要演讲，阐述如何进一步促进双边关系、中国与东盟关系发展的构想，以及中国和平发展的理念。",
          PicUrl: "http://news.cnr.cn/special/xjp4/zb/zy/201310/W020131003454716456595.jpg",
          Url: "http://news.cnr.cn/special/xjp4/zb/zy/201310/t20131003_513743132.shtml"
        },
        {
          Title: "九寨沟：少数游客拦车翻栈道致交通瘫痪",
          Description: "10月2日，九寨沟发生大规模游客滞留事件。因不满长时间候车，部分游客围堵景区接送车辆，导致上下山通道陷入瘫痪。大批游客被迫步行十几公里下山，包括80岁老人及9个月小孩。入夜后，游客围住售票处要求退票，并一度“攻陷”售票处。10月3日凌晨，九寨沟管理局、阿坝大九旅集团九寨沟旅游分公司发致歉书向游客致歉。",
          PicUrl: "http://www.chinadaily.com.cn/dfpd/shehui/attachement/jpg/site1/20131003/a41f726719b213b7156402.jpg",
          Url: "http://www.chinadaily.com.cn/dfpd/shehui/2013-10/03/content_17008311.htm"  
        },
        {
          Title: "美政府关门第二天 官民高呼“伤不起”",
          Description: "中新社华盛顿10月2日电 (记者 张蔚然)美国政府“关门”进入第二天，白宫与国会对峙僵局未破，美国继续在“喊话”模式中运转。越来越多的联邦部门和民众都在抱怨“伤不起”，调门越喊越高。",
          PicUrl: "http://i1.hexunimg.cn/2013-10-03/158486762.jpg",
          Url: "http://www.chinanews.com/gj/2013/10-03/5343908.shtml?f=baidu"
        }
      ]
    }
    wechat.send(msg);
  });

}).listen(80);