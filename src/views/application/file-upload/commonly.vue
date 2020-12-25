<template>
  <div class="container">
    <div>
      <div class="container__title">一般上传</div>
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
      </div>
      <div class="container__table">
        <FileTable :tableData="tableData">
          <template v-slot="{ scope }">
            <el-button
              :disabled="scope.row.percentage === 100"
              @click="handlerUpload(scope.$index)"
              >{{ scope.row.percentage === 100 ? '已上传' : '上传' }}</el-button
            >
          </template>
        </FileTable>
      </div>
      <div style="text-align: center;">
        <el-button @click="goback">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import FileTable from '@/components/Table/FileTable';
import { uploadBaseic } from '@/api/upload';
export default {
  name: '',
  components: {
    FileTable
  },
  data() {
    return {
      tableData: []
    };
  },
  computed: {},
  watch: {},
  // 方法集合
  methods: {
    // 点击选择文件
    handlerClick() {
      this.$refs.inputfile.click();
    },
    // 选择文件回调
    handlerFileChange(event) {
      const list = [...event.target.files].map(item => {
        item.percentage = 0;
        return item;
      });
      this.tableData.push(...list);
    },
    // 上传
    async handlerUpload(index) {
      const item = this.tableData[index];
      console.log(item);
      try {
        const formData = new FormData();
        formData.append('file', item);
        let res = await uploadBaseic(
          formData,
          this.onUploadProgress(item, index)
        );
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },

    // 上传进度
    onUploadProgress(item, index) {
      return e => {
        item.percentage = ((e.loaded / e.total) * 100) | 0;
        this.tableData.splice(index, 1, item);
      };
    },

    // 返回
    goback() {
      this.$router.push({
        name: 'file-upload-index'
      });
    }
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
