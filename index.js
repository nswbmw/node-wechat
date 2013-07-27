var crypto = require('crypto'),
    events = require('events'),
    emitter = new events.EventEmitter(),
    xml2js = require('xml2js');

var Wechat = function() {
}

//检验 token
Wechat.prototype.checkSignature = function (req) {
  var signature = req.query.signature,
      timestamp = req.query.timestamp,
      nonce = req.query.nonce,
      echostr = req.query.echostr;

  var arr = [this.token, timestamp, nonce].sort(),
      sha1 = crypto.createHash('sha1'),
      sha1Str = sha1.update(arr.join('')).digest('hex');

  return sha1Str === signature;
}

//监听文本信息
Wechat.prototype.text = function (callback) {
  emitter.on("text", callback);
  return this;
}

//监听图片信息
Wechat.prototype.image = function (callback) {
  emitter.on("image", callback);
  return this;
}

//监听地址信息
Wechat.prototype.location = function (callback) {
  emitter.on("location", callback);
  return this;
}

//监听链接信息
Wechat.prototype.link = function (callback) {
  emitter.on("link", callback);
  return this;
}

//监听事件信息
Wechat.prototype.event = function (callback) {
  emitter.on("event", callback);
  return this;
}

//监听所有信息
Wechat.prototype.all = function (callback) {
  emitter.on("text", callback);
  emitter.on("image", callback);
  emitter.on("location", callback);
  emitter.on("link", callback);
  emitter.on("event", callback);

  return this;
}

//接收器
Wechat.prototype.handler = function (req, res) {
  this.res = res;
  var buf = '';
  var obj = this;

  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    buf += chunk;
  });

  req.on('end', function() {
    xml2js.parseString(buf, function (err, json) {
      obj.parse(json.xml);
    });
  });
}

//解析器
Wechat.prototype.parse = function (data) {
  this.ToUserName = data.ToUserName[0];
  this.FromUserName = data.FromUserName[0];
  this.CreateTime = data.CreateTime[0];
  this.MsgType = data.MsgType[0];

  switch(this.MsgType) {
    case 'text' : 
      this.Content = data.Content[0];
      this.MsgId = data.MsgId[0];

      emitter.emit("text", this);
      break;

    case 'image' : 
      this.PicUrl = data.PicUrl[0];
      this.MsgId = data.MsgId[0];

      emitter.emit("image", this);
      break;

    case 'location' : 
      this.Location_X = data.Location_X[0];
      this.Location_Y = data.Location_Y[0];
      this.Scale = data.Scale[0];
      this.Label = data.Label[0];
      this.MsgId = data.MsgId[0];

      emitter.emit("location", this);
      break;

    case 'link' : 
      this.Title = data.Title[0];
      this.Description = data.Description[0];
      this.Url = data.Url[0];
      this.MsgId = data.MsgId[0];

      emitter.emit("link", this);
      break;

    case 'event' : 
      this.Event = data.Event[0];
      this.EventKey = data.EventKey[0];

      emitter.emit("event", this);
      break;
  }
}

//回复消息
Wechat.prototype.send = function (data) {
  var msg = "" +
      "<xml>" +
      "<ToUserName><![CDATA[" + data.ToUserName + "]]></ToUserName>" +
      "<FromUserName><![CDATA[" + data.FromUserName + "]]></FromUserName>" +
      "<CreateTime>" + Date.now() + "</CreateTime>" +
      "<MsgType><![CDATA[" + data.MsgType + "]]></MsgType>" +
      "<FuncFlag>" + data.FuncFlag + "</FuncFlag>";

  switch(data.MsgType) {
    case 'text' : 
      msg += "" +
        "<Content><![CDATA[" + data.Content + "]]></Content>" +
        "</xml>";
      break;

    case 'music' :
      msg += "" +
        "<Music>" +
        "<Title><![CDATA[" + data.Title + "]]></Title>" +
        "<Description><![CDATA[" + data.Description + "]]></Description>" +
        "<MusicUrl><![CDATA[" + data.MusicUrl + "]]></MusicUrl>" +
        "<HQMusicUrl><![CDATA[" + data.HQMusicUrl + "]]></HQMusicUrl>" +
        "</Music>" +
        "</xml>";
      break;

    case 'news' : 
      var ArticlesStr = "";

      for (var i in data.Articles) {
        ArticlesStr += "" +
          "<item>" + 
          "<Title><![CDATA[" + data.Articles[i].Title + "]]></Title>" + 
          "<Description><![CDATA[" + data.Articles[i].Description + "]]></Description>" + 
          "<PicUrl><![CDATA[" + data.Articles[i].PicUrl + "]]></PicUrl>" + 
          "<Url><![CDATA[" + data.Articles[i].Url + "]]></Url>" + 
          "</item>";
      }

      msg += "</xml>";
      break;
  }

  this.res.writeHead(200, {'Content-Type': 'text/plain'});
  this.res.end(msg);
  return this.res;
}

module.exports = new Wechat();