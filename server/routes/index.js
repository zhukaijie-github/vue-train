const { uploadRouter } = require('./upload');

// 将所有的路由注册下
const router = function(app) {
  app.use('/upload', uploadRouter);
};

module.exports = {
  router
};
