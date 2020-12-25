<!-- 布局主体 -->
<template>
  <div class="layout-main">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <div class="main-container">
        <router-view />
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.layout-main {
  height: calc(100% - 50px);
}
.main-container {
  padding: 30px;
}
</style>
