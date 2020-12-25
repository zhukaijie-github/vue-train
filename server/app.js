const express = require('express');
const path = require('path');
// 引入路由
const { router } = require('./routes/index');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '1mb' })); //body-parser 解析json格式数据
app.use(
  bodyParser.urlencoded({
    //此项必须在 bodyParser.json 下面,为参数编码
    extended: true
  })
);
app.use('/static', express.static(path.resolve(__dirname, '..', 'upload')));

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.header('X-Powered-By', ' 3.2.1');
  next();
});

// 注册路由
router(app);

app.listen(3000, () => {
  console.log('开始监听3000');
});
