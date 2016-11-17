var url = require('url'),
    querystring = require('querystring'),
    crypto = require('crypto'),
    events = require('events'),
    emitter = new events.EventEmitter(),
    xml2js = require('xml2js');

var Wechat = function(token) {
  if (!(this instanceof Wechat)) {
    return new Wechat(token);
  }
  this.token = token;
  this.res = null;
}

//检验 token
Wechat.prototype.checkSignature = function(req, res) {
  if (req.method === 'GET') {
    var queryObj = querystring.parse(url.parse(req.url).query);
    var signature = queryObj.signature,
        timestamp = queryObj.timestamp,
        nonce = queryObj.nonce,
        echostr = queryObj.echostr;

    var sha1 = crypto.createHash('sha1'),
        sha1Str = sha1.update([this.token, timestamp, nonce].sort().join('')).digest('hex');

        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end((sha1Str === signature) ? echostr : '');
        return res; 
  }
}

//预处理器
Wechat.prototype.handler = function(req, res) {
  var xml = '';
  var self = this;
  self.res = res;

  req.setEncoding('utf8');
  req.on('data', function (chunk) {
    xml += chunk;
  });

  req.on('end', function() {
    self.toJSON(xml);
  });

  /**
   * clear all listening events to avoid repeat triggers
   */
  emitter.removeAllListeners('text');
  emitter.removeAllListeners('voice');
  emitter.removeAllListeners('event');
}

//解析器
Wechat.prototype.toJSON = function(xml) {
  var msg = {};
  xml2js.parseString(xml, function (err, result) {
    var data = result.xml;

    msg.ToUserName = data.ToUserName[0];
    msg.FromUserName = data.FromUserName[0];
    msg.CreateTime = data.CreateTime[0];
    msg.MsgType = data.MsgType[0];

    switch(msg.MsgType) {
      case 'text' : 
        msg.Content = data.Content[0];
        msg.MsgId = data.MsgId[0];

        emitter.emit("text", msg);
        break;

      case 'image' : 
        msg.PicUrl = data.PicUrl[0];
        msg.MsgId = data.MsgId[0];
        msg.MediaId = data.MediaId[0];

        emitter.emit("image", msg);
        break;

      case 'voice' :
        msg.MediaId = data.MediaId[0];
        msg.Format = data.Format[0];
        msg.MsgId = data.MsgId[0];

        emitter.emit("voice", msg);
        break;

      case 'video' :
        msg.MediaId = data.MediaId[0];
        msg.ThumbMediaId = data.ThumbMediaId[0];
        msg.MsgId = data.MsgId[0];

        emitter.emit("video", msg);
        break;
        
      case 'location' : 
        msg.Location_X = data.Location_X[0];
        msg.Location_Y = data.Location_Y[0];
        msg.Scale = data.Scale[0];
        msg.Label = data.Label[0];
        msg.MsgId = data.MsgId[0];
   
        emitter.emit("location", msg);
        break;

      case 'link' : 
        msg.Title = data.Title[0];
        msg.Description = data.Description[0];
        msg.Url = data.Url[0];
        msg.MsgId = data.MsgId[0];

        emitter.emit("link", msg);
        break;

      case 'event' : 
        msg.Event = data.Event[0];
        msg.EventKey = data.EventKey[0];

        emitter.emit("event", msg);
        break;
    }
  });
  return msg;
}

//监听文本信息
Wechat.prototype.text = function(callback) {
  emitter.once("text", callback);
  return this;
}

//监听图片信息
Wechat.prototype.image = function(callback) {
  emitter.once("image", callback);
  return this;
}

//监听地址信息
Wechat.prototype.location = function(callback) {
  emitter.once("location", callback);
  return this;
}

//监听链接信息
Wechat.prototype.link = function(callback) {
  emitter.once("link", callback);
  return this;
}

//监听事件信息
Wechat.prototype.event = function(callback) {
  emitter.once("event", callback);
  return this;
}

//监听语音信息
Wechat.prototype.voice = function(callback) {
  emitter.once("voice", callback);
  return this;
}

//监听视频信息
Wechat.prototype.video = function(callback) {
  emitter.once("video", callback);
  return this;
}

//监听所有信息
Wechat.prototype.all = function(callback) {
  if (emitter.listenerCount('text') === 0) emitter.once("text", callback);
  if (emitter.listenerCount('image') === 0) emitter.once("image", callback);
  if (emitter.listenerCount('location') === 0) emitter.once("location", callback);
  if (emitter.listenerCount('link') === 0) emitter.once("link", callback);
  if (emitter.listenerCount('event') === 0) emitter.once("event", callback);
  if (emitter.listenerCount('voice') === 0) emitter.once("voice", callback);
  if (emitter.listenerCount('video') === 0) emitter.once("video", callback);

  return this;
}

//将 js 组装成 xml
Wechat.prototype.toXML = function(data) {
  //自动检测 MsgType
  var MsgType = "";
  if (!data.MsgType) {
    if (data.hasOwnProperty("Content")) MsgType = "text";
    if (data.hasOwnProperty("MusicUrl")) MsgType = "music";
    if (data.hasOwnProperty("Articles")) MsgType = "news";
  } else {
    MsgType = data.MsgType;
  }

  var msg = "" +
      "<xml>" +
      "<ToUserName><![CDATA[" + data.ToUserName + "]]></ToUserName>" +
      "<FromUserName><![CDATA[" + data.FromUserName + "]]></FromUserName>" +
      "<CreateTime>" + Date.now()/1000 + "</CreateTime>" +
      "<MsgType><![CDATA[" + MsgType + "]]></MsgType>";

  switch(MsgType) {
    case 'text' : 
      msg += "" +
        "<Content><![CDATA[" + (data.Content || '') + "]]></Content>" +
        "</xml>";
      return msg;

    case 'image' :
      msg += "" +
        "<Image>" +
        "<MediaId><![CDATA[" + data.MediaId +"]]></MediaId>" +
        "</Image>" +
        "</xml>";

    case 'voice' :
      msg += "" +
        "<Voice>" +
        "<MediaId><![CDATA[" + data.MediaId +"]]></MediaId>" +
        "<Title><![CDATA[" + data.Title +"]]></Title>" +
        "<Description><![CDATA[" + data.Description +"]]></Description>" +
        "</Voice>" +
        "</xml>";

    case 'video' :
      msg += "" +
        "<Video>" +
        "<MediaId><![CDATA[" + data.MediaId +"]]></MediaId>" +
        "</Video>" +
        "</xml>";

    case 'music' :
      msg += "" +
        "<Music>" +
        "<Title><![CDATA[" + (data.Title || '') + "]]></Title>" +
        "<Description><![CDATA[" + (data.Description || '') + "]]></Description>" +
        "<MusicUrl><![CDATA[" + (data.MusicUrl || '') + "]]></MusicUrl>" +
        "<HQMusicUrl><![CDATA[" + (data.HQMusicUrl || data.MusicUrl || '') + "]]></HQMusicUrl>" +
        "<ThumbMediaId><![CDATA[" + (data.ThumbMediaId || '') + "]]></ThumbMediaId>" +
        "</Music>" +
        "</xml>";
      return msg;

    case 'news' : 
      var ArticlesStr = "";
      var ArticleCount = data.Articles.length;
      for (var i in data.Articles) {
        ArticlesStr += "" +
          "<item>" + 
          "<Title><![CDATA[" + (data.Articles[i].Title || '') + "]]></Title>" + 
          "<Description><![CDATA[" + (data.Articles[i].Description || '') + "]]></Description>" + 
          "<PicUrl><![CDATA[" + (data.Articles[i].PicUrl || '') + "]]></PicUrl>" + 
          "<Url><![CDATA[" + (data.Articles[i].Url ||'') + "]]></Url>" + 
          "</item>";
      }

      msg += "<ArticleCount>" + ArticleCount + "</ArticleCount><Articles>" + ArticlesStr + "</Articles></xml>";
      return msg;
  }
}

//回复消息
Wechat.prototype.send = function(data) {
  this.res.writeHead(200, {'Content-Type': 'text/plain'});
  this.res.end(this.toXML(data));
  return this;
}

module.exports = Wechat;
