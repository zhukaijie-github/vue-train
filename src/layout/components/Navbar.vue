<!-- 布局头部 -->
<template>
  <div class="layout-nav">
    <i
      :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
      @click="handlerChangeCollapse"
    ></i>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  props: {},
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['isCollapse'])
  },
  // 方法集合
  methods: {
    handlerChangeCollapse() {
      this.$store.dispatch('setCollapse');
    }
  }
};
</script>
<style lang="scss" scoped>
.layout-nav {
  position: relative;
  display: flex;
  height: 50px;
  padding: 0 30px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  align-items: center;
  i {
    font-size: 30px;
    cursor: pointer;
  }
}
</style>
