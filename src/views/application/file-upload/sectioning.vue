<template>
  <div class="container">
    <div>
      <div class="container__title">分片上传</div>
      <div class="container__body">
        <el-button type="primary" @click="handlerClick">选择文件</el-button>
        <input
          type="file"
          multiple="multiple"
          name=""
          id=""
          ref="inputfile"
          style="display: none;"
          @change="handlerFileChange"
        />
        <span v-if="container.file">{{ container.file.name }}</span>
        <el-button @click="handlerUpload" :disabled="isStart">上传</el-button>
        <el-button @click="hpause">{{ isPause ? '恢复' : '暂停' }}</el-button>
        <el-button @click="handlerVerify">检测</el-button>
        <el-button @click="handlerbf">并发请求</el-button>
      </div>
      <div class="container__table">
        <h2>计算hash</h2>
        <el-progress :percentage="hashPercentage"></el-progress>
        <h2>总进度</h2>
        <el-progress :percentage="totalPercentage"></el-progress>
        <el-table :data="data" style="width: 100%; margin-top: 20px;">
          <el-table-column prop="hash" label="切片hash" min-width="40%">
          </el-table-column>
          <el-table-column label="大小(KB)" min-width="20%">
            <template slot-scope="scope">
              <div>
                {{ $formSize(scope.row.chunk.size) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="percentage" label="进度" min-width="40%">
            <template slot-scope="scope">
              <div>
                <el-progress :percentage="scope.row.percentage"></el-progress>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="text-align: center;">
        <el-button @click="goback">返回</el-button>
      </div>
      <!-- <textarea name="" id="" cols="30" rows="10" v-model="comments"></textarea>
      <p>{{ commentLen }}</p> -->
    </div>
  </div>
</template>

<script>
import {
  uploadSectioning,
  uploadMerge,
  uploadVerify,
  uploadOther
} from '@/api/upload';
import { limitRequest } from '@/utils/limit-request.js';
import { mapGetters } from 'vuex';
const SIZE = 0.5 * 1024 * 1024; // 默认10MB 大小切片
export default {
  name: '',
  components: {},
  data() {
    return {
      container: {
        file: null
      },
      data: [],
      hashPercentage: 0,
      isStart: false,
      isPause: false,
      comments: ''
    };
  },
  computed: {
    commentLen() {
      if (this.comments.length > 0) {
        let count = this.comments.length;
        const arr = this.comments.split('');
        if (arr.length > 1) {
          count -= arr.filter(v => v === ' ' || v === '\n').length;
        }
        return count < 0 ? 0 : count;
      } else {
        return 0;
      }
    },
    totalPercentage() {
      /* if (!this.container.file || !this.data.length) return 0;
      const loaded = this.data
        .map(item => {
          return item.size * item.percentage;
        })
        .reduce((prev, cur) => prev + cur);
      return parseInt((loaded / this.container.file.size).toFixed(2)); */
      if (!this.container.file || !this.data.length) return 0;
      const loaded = this.data
        .map(item => item.chunk.size * item.percentage)
        .reduce((acc, cur) => acc + cur);
      return parseInt((loaded / this.container.file.size).toFixed(2));
    },
    ...mapGetters(['requestList'])
  },
  watch: {},
  // mounted() {
  //   setTimeout(() => {
  //     this.tableHeight = '560px';
  //   }, 2000);
  // },
  // 方法集合
  methods: {
    // 点击选择文件
    handlerClick() {
      this.$refs.inputfile.click();
    },
    // 选择文件回调
    handlerFileChange(event) {
      const [file] = event.target.files;
      this.container.file = file;
      this.data = [];
      this.hashPercentage = 0;
      this.isStart = false;
      this.isPause = false;
    },
    // 生成切片
    createFileChunk(file, size = SIZE) {
      const fileChunkList = [];
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) });
        cur += size;
      }
      return fileChunkList;
    },
    // 生成文件 hash（web-worker）
    calculateHash(fileChunkList) {
      return new Promise(resolve => {
        // 添加 worker 属性
        this.container.worker = new Worker('/hash.js');
        this.container.worker.postMessage({ fileChunkList });
        this.container.worker.onmessage = e => {
          const { percentage, hash } = e.data;
          this.hashPercentage = percentage;
          if (hash) {
            resolve(hash);
          }
        };
      });
    },

    // 上传
    async handlerUpload() {
      if (!this.container.file) return;
      this.isStart = true;
      const fileChunkList = this.createFileChunk(this.container.file);

      this.container.hash = await this.calculateHash(fileChunkList);

      // 检测是否已有文件
      let { shouldUpload, uploadedList } = await uploadVerify({
        fileHash: this.container.hash,
        filename: this.container.file.name
      });
      if (!shouldUpload) {
        this.$message.success('秒传：上传成功');
        return;
      }

      this.data = fileChunkList.map(({ file }, index) => ({
        fileHash: this.container.hash,
        chunk: file,
        hash: this.container.hash + '-' + index, // 文件名 + 数组下标
        percentage: uploadedList.includes(this.container.hash + '-' + index)
          ? 100
          : 0,
        index
      }));

      await this.uploadChunks(uploadedList);
    },

    // 上传切片
    async uploadChunks(uploadedList) {
      const requestList = this.data
        .filter(({ hash }) => {
          return !uploadedList.includes(hash);
        })
        .map(({ chunk, hash, index }) => {
          const formData = new FormData();
          formData.append('chunk', chunk);
          formData.append('hash', hash);
          formData.append('filename', this.container.file.name);
          formData.append('fileHash', this.container.hash);
          return { formData, index };
        });
      // .map(async ({ formData, index }) => {
      //   return uploadSectioning(
      //     formData,
      //     this.onUploadProgress(this.data[index])
      //   ).catch(() => {
      //     console.log('上传失败');
      //   });
      // });
      const fetch = ({ formData, index }) => {
        return new Promise((resolve, reject) => {
          uploadSectioning(formData, this.onUploadProgress(this.data[index]))
            .then(res => {
              resolve(res);
            })
            .catch(() => {
              reject();
            });
        });
      };

      limitRequest(fetch, requestList, 2, async () => {
        await this.mergeRequest();
      });
      // console.log();
      // await Promise.all(requestList);
    },

    // 合并切片
    async mergeRequest() {
      try {
        let res = await uploadMerge({
          fileHash: this.container.hash,
          filename: this.container.file.name,
          size: SIZE
        });
        console.log(res);
        this.$message.success('上传成功！');
      } catch (error) {
        console.log(error);
      }
    },

    // 暂停 或者 恢复
    async hpause() {
      try {
        if (this.isPause) {
          // 恢复
          this.isPause = false;
          console.log('恢复');
          // 检测是否已有文件
          let { shouldUpload, uploadedList } = await uploadVerify({
            fileHash: this.container.hash,
            filename: this.container.file.name
          });
          if (!shouldUpload) {
            this.$message.success('秒传：上传成功');
            return;
          }

          this.data = this.data.map(item => {
            item.percentage = uploadedList.includes(item.hash) ? 100 : 0;
            return item;
          });

          await this.uploadChunks(uploadedList);
        } else {
          // 暂停
          this.isPause = true;
          console.log('暂停');
          this.requestList.forEach(item => {
            item();
          });
          this.$store.dispatch('setRequestList');
        }
      } catch (error) {
        console.log(error);
      }
    },

    // 检测
    async handlerVerify() {
      if (!this.container.hash) return;
      let { shouldUpload, uploadedList } = await uploadVerify({
        fileHash: this.container.hash,
        filename: this.container.file.name
      });
      console.log(shouldUpload, uploadedList);
    },

    // 上传进度
    onUploadProgress(item) {
      console.log(item);
      return e => {
        item.percentage = ((e.loaded / e.total) * 100) | 0;
      };
    },

    // 返回
    goback() {
      this.$router.push({
        name: 'file-upload-index'
      });
    },

    // 并发请求事件
    handlerbf() {
      function fetch(params) {
        return new Promise((resolve, reject) => {
          uploadOther(params)
            .then(res => {
              resolve(res);
            })
            .catch(() => {
              reject();
            });
        });
      }
      const list = [];
      for (let i = 0; i < 10; i++) {
        list.push({ i });
      }
      limitRequest(fetch, list, 2, () => {
        console.log('请求完毕');
      });
    }

    // sendRequest(arr, max, callback) {
    //   let fetchArr = [], // 存储并发max的promise数组
    //     i = 0;

    //   function fetch(params) {
    //     return new Promise((resolve, reject) => {
    //       uploadOther(params)
    //         .then(res => {
    //           resolve(res);
    //         })
    //         .catch(() => {
    //           reject();
    //         });
    //     });
    //   }

    //   function toFetch() {
    //     if (i === arr.length) {
    //       // 所有的都处理完了， 返回一个resolve
    //       return Promise.resolve();
    //     }

    //     let one = fetch(arr[i++]); // 取出第i个url， 放入fetch里面 , 每取一次i++
    //     one.then(() => {
    //       fetchArr.splice(fetchArr.indexOf(one), 1);
    //     }); // 当promise执行完毕后，从数组删除
    //     fetchArr.push(one); //将当前的promise存入并发数组中       其实将这个push放到上一行会更好理解，那样就是我们同步的思维顺序，先push进去，再等promise执行完了之后再删除。  但由于then是异步的，所以怎么放都可以。

    //     let p = Promise.resolve();
    //     if (fetchArr.length >= max) {
    //       // 当并行数量达到最大后， 用race比较 第一个完成的， 然后再调用一下函数自身。
    //       p = Promise.race(fetchArr);
    //     }
    //     return p.then(() => {
    //       console.log(i);
    //       return toFetch();
    //     });
    //   }

    //   // arr循环完后， 现在fetchArr里面剩下最后max个promise对象， 使用all等待所有的都完成之后执行callback
    //   toFetch()
    //     .then(() => {
    //       return Promise.all(fetchArr);
    //     })
    //     .then(() => {
    //       callback();
    //     });
    // }
  }
};
</script>

<style lang="scss" scoped>
.file-name {
  margin: 0 20px;
}
.container {
  margin-top: 20px;
  &__title {
    margin-bottom: 20px;
    font-weight: 400;
    color: #1f2f3d;
  }
  &__body {
    padding: 20px;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    transition: 0.2s;
  }
  &__table {
    margin-bottom: 30px;
  }
  ::v-deep .el-progress__text {
    font-size: 14px !important;
  }
}
</style>
