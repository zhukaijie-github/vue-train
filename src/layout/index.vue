<!-- 布局 -->

<template>
  <div class="layout-wrapper">
    <Sidebar />
    <div :class="['layout-container', { collapse: isCollapse }]">
      <Navbar />
      <AppMain />
    </div>
  </div>
</template>

<script>
import { AppMain, Sidebar, Navbar } from './components/index';
import { mapGetters } from 'vuex';

export default {
  name: '',
  components: {
    AppMain,
    Sidebar,
    Navbar
  },
  computed: {
    ...mapGetters(['isCollapse'])
  }
};
</script>
<style lang="scss" scoped>
.layout-wrapper {
  display: flex;
  height: 100%;
}
.layout-container {
  flex: 1;
  width: calc(100% - 240px);
  transition: width 0.3s ease;
  &.collapse {
    width: calc(100% - 64px) !important;
  }
}
</style>
