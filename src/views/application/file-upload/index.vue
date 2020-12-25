<!-- 文件上传 -->
<template>
  <div class="upload-wrapper">
    <el-row :gutter="12">
      <el-col :span="8" v-for="(item, index) in list" :key="index">
        <el-card shadow="always" @click.native="handlerNavgo(item)">
          <div>{{ item.title }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'file-upload-index',
  data() {
    return {
      list: [
        {
          title: '一般上传',
          name: 'file-upload-commonly'
        },
        {
          title: '分片上传',
          name: 'file-upload-sectioning'
        }
      ]
    };
  },
  methods: {
    handlerNavgo(item) {
      this.$router.push({
        name: item.name
      });
    }
  }
};
</script>
