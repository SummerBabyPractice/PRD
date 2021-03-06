const util = require('../lib/utils');

// 这是一个中间件函数，目的在真的处理一个请求前校验一些信息
// 比如用户的 sessionToken是否合法，对应的 userid是谁
exports.requireLogin = function (req, res, next) {
  if (!util.paramValidator(req.cookies.sessionToken)) {
    return res.status(401).send('UnAuthorized');
  }
  Parse.User.become(req.cookies.sessionToken)
  .then(user => {
    req.user = user;
    next()
  })
  .catch(e => {
    return res.status(401).send(e.message);
  })
}

//分页检查组件， 假如接口的 query没有传这两个参数就填上默认的
exports.pagination = function (req, res, next) {
  var page = req.query.page
  var limit = req.query.limit
  if (!util.paramValidator(page) || page == 0) {
    req.query.page = 1
  }
  if (!util.paramValidator(limit)) {
    req.query.limit = 10
  }
  next()
}

exports.CORS = function (req, res, next) {
  res.set('Access-Control-Allow-Origin', req.headers.origin);
  res.set('Access-Control-Allow-Credentials', 'true');
  next();
}

exports.pathLogger = function (req, res, next) {
  console.log(`${req.method} request to path: ${req.path}`);
  next();
}