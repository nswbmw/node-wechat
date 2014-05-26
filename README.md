## Node.js 微信公众平台 API ##

### 安装　###

    npm install node-wechat

### 使用示例 1 ###

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
          //MsgType : "text",
          Content : "这是文本回复",
          //FuncFlag : 0
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

      //监听语音信息
      //wechat.voice(function (data) { ... });

      //监听视频信息
      //wechat.video(function (data) { ... });

      //监听所有信息
      //wechat.all(function (data) { ... });
    }).listen(80);

详见 `example.js` 。

### 使用示例 2 ###

    var http = require('http'),
        wechat = require('node-wechat')(your_token);

    http.createServer(function (req, res) {
      //检验 token
      wechat.checkSignature(req, res);
      //预处理
      wechat.handler(req, res);

      //链式监听
      wechat.text(function (data) {
        // TODO
      }).image(function (data) {
        // TODO
      }).location(function (data) {
        // TODO
      }).link(function (data) {
        // TODO
      }).event(function (data) {
        // TODO
      }).voice(function (data) {
        // TODO
      }).video(function (data) {
        // TODO
      }).all(function (data) {
        var msg = {
          FromUserName : data.ToUserName,
          ToUserName : data.FromUserName,
          //MsgType : "news",
          Articles : [...]
        }
        wechat.send(msg);
      });

    }).listen(80);

详见 `example2.js` 。

如需更多功能，你可以尝试 [wechat](https://github.com/node-webot/wechat)