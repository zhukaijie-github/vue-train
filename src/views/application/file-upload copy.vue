<!-- 文件上传 -->
<template>
  <div class="upload-wrapper">
    <el-radio-group v-model="tabIndex">
      <el-radio-button
        v-for="item in tabList"
        :label="item.value"
        :key="item.value"
        >{{ item.label }}</el-radio-button
      >
    </el-radio-group>
    <component :is="variable"></component>
  </div>
</template>

<script>
import { FileBaseic, FileSequel } from '@/components/FileUpload';
export default {
  name: '',
  components: {
    'file-baseic': FileBaseic,
    'file-sequel': FileSequel
  },
  directives: {},
  filters: {},
  mixins: [],
  model: {},
  props: {},
  data() {
    return {
      tabIndex: '0',
      tabList: [
        {
          label: '基础上传',
          value: '0',
          component: 'file-baseic'
        },
        {
          label: '断点续传',
          value: '1',
          component: 'file-sequel'
        },
        {
          label: '大文件上传',
          value: '2'
        }
      ]
    };
  },
  computed: {
    variable() {
      return this.tabList[this.tabIndex].component;
    }
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {},
  // 方法集合
  methods: {}
};
</script>
<style lang="scss" scoped>
.file-name {
  margin: 0 20px;
}
</style>
