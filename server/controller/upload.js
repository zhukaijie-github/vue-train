const multiparty = require('multiparty'); // express 接收formdata数据的中间件
const fs = require('fs');
const path = require('path');

const UploadDir = path.resolve(__dirname, '../../', 'upload');

module.exports = {
  // 接收整体文件保存
  async baseic(req, res) {
    /* 生成multiparty对象，并配置上传目标路径 */
    let form = new multiparty.Form();
    // 设置编码
    // form.encoding = 'utf-8';
    // 设置文件存储路径，以当前编辑的文件为相对路径
    // form.uploadDir = './upload';
    // 设置文件大小限制
    // form.maxFilesSize = 1 * 1024 * 1024;
    form.parse(req, async (err, fields, files) => {
      console.log(fields);
      console.log(files);
      try {
        if (err) throw err;
        const [file] = files.file;
        // 创建读取流
        const reader = fs.createReadStream(file.path);

        const extname = path.extname(file.originalFilename);
        const fileDesc = file.originalFilename.split(extname)[0];
        // 为处理文件重名，给每个文件加了一个时间戳标识
        const fileResource = path.resolve(
          UploadDir,
          `${fileDesc}_${new Date() * 1}${extname}`
        );
        // 检测存储文件目录是否存在
        if (!fs.existsSync(UploadDir)) {
          fs.mkdirSync(UploadDir);
        }
        // 创建可写流
        let upstream = fs.createWriteStream(fileResource);

        // 读取流通过管道流入可写流
        reader.pipe(upstream);
        // res.status(400).send('Bad Request');
        res.send({
          code: 200,
          msg: 'success',
          data: `/upload/${fileDesc}_${new Date() * 1}${extname}`
        });
      } catch (error) {
        console.log(err);
        res.send({ code: 400, msg: '上传失败！' });
      }
    });
  },

  // 分片上传
  async sectioning(req, res) {
    let form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
      if (err) return;
      if (Math.random() < -1) {
        // 概率报错
        console.log('概率报错了');
        res.status(500).send('Bad Request');
      } else {
        const [chunk] = files.chunk;
        const [hash] = fields.hash;
        // const [filename] = fields.filename;
        const [fileHash] = fields.fileHash;
        const chunkDir = path.resolve(UploadDir, fileHash);
        console.log(chunkDir);

        // 检测储存目录是否存在
        if (!fs.existsSync(chunkDir)) {
          fs.mkdirSync(chunkDir);
        }
        // 创建读取流
        const reader = fs.createReadStream(chunk.path);
        const fileResource = path.resolve(chunkDir, hash);
        // 创建可写流
        let upstream = fs.createWriteStream(fileResource);

        // 读取流通过管道流入可写流
        reader.pipe(upstream);
        res.send({ code: 200, msg: 'success', data: '上传成功！' });
      }
    });
  },

  // 合并分片
  async merge(req, res) {
    const { fileHash, filename, size } = req.body;
    const chunkDir = path.resolve(UploadDir, fileHash);
    const chunkPaths = fs.readdirSync(chunkDir);
    // 否则直接读取目录的获得的顺序可能会错乱
    chunkPaths.sort((a, b) => a.split('-')[1] - b.split('-')[1]);
    const ext = path.extname(filename);
    await Promise.all(
      chunkPaths.map((chunkpath, index) => {
        return new Promise(resolve => {
          // 创建读取流
          const reader = fs.createReadStream(path.resolve(chunkDir, chunkpath));
          // 创建可写流
          const fileResource = path.resolve(UploadDir, `${fileHash}${ext}`);
          const upstream = fs.createWriteStream(fileResource, {
            start: index * size,
            end: (index + 1) * size
          });
          reader.on('end', () => {
            fs.unlinkSync(path.resolve(chunkDir, chunkpath));
            resolve();
          });
          reader.pipe(upstream);
        });
      })
    );
    // 删除hash目录
    setTimeout(() => {
      fs.rmdirSync(path.resolve(chunkDir));
    }, 200);

    res.send({ code: 200, msg: 'success', data: `/upload/${filename}` });
  },

  // 检测是否已有文件存在
  async verify(req, res) {
    const { fileHash, filename } = req.body;
    const ext = path.extname(filename);
    const fileResource = path.resolve(UploadDir, `${fileHash}${ext}`);
    const shouldUpload = !fs.existsSync(fileResource);
    let createUploadedList = [];
    if (shouldUpload) {
      // 返回已经上传切片名列表
      createUploadedList = fs.existsSync(path.resolve(UploadDir, fileHash))
        ? await fs.readdirSync(path.resolve(UploadDir, fileHash))
        : [];
    }
    res.send({
      code: 200,
      msg: 'success',
      data: { shouldUpload, uploadedList: createUploadedList }
    });
  },

  async other(req, res) {
    const { i } = req.body;
    setTimeout(() => {
      res.send({
        code: 200,
        msg: 'success',
        data: 'ok'
      });
    }, (i + 1) * 2000);
  }
};
