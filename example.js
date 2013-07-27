var http = require('http'),
    wechat = require('node-wechat');

http.createServer(function (req, res) {
  //预处理
  wechat.handler(req, res);

  //监听所有信息
  wechat.all(function (data) {

    //console.log(data.ToUserName);
    //console.log(data.FromUserName);
    //console.log(data.CreateTime);
    //console.log(data.MsgType);
    //...

    var msg = {
      FromUserName : data.ToUserName,
      ToUserName : data.FromUserName,
      MsgType : "music",
      Title : "董小姐",
      Description : "宋冬野——摩登天空7",
      MusicUrl : "http://zhangmenshiting.baidu.com/data2/music/64912782/45952989248400128.mp3?xcode=50fcadfb3d3b6fbe9a90307b21b6e74592e7f08e9d243cf5",
      HQMusicUrl : "http://zhangmenshiting.baidu.com/data2/music/64912782/45952989248400128.mp3?xcode=50fcadfb3d3b6fbe9a90307b21b6e74592e7f08e9d243cf5",
      FuncFlag : 0
    }

    //回复信息
    wechat.send(msg);
  });

  //监听图片信息
  //wechat.image(function (data) { ... });

  //监听地址信息
  //wechat.location(function (data) { ... });

  //监听链接信息
  //wechat.link(function (data) { ... });

  //监听事件信息
  //wechat.event(function (data) { ... });

  //监听所有信息
  //wechat.all(function (data) { ... });

}).listen(80);