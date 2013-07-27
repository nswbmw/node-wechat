## Node.js 微信公众平台 API ##

### 安装　###

    npm install node-wechat

### 示例 ###

    var http = require('http'),
        wechat = require('node-wechat');

    http.createServer(function (req, res) {
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
          MsgType : "text",
          Content : "这是文本回复",
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
