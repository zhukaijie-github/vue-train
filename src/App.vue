<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  border: none;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
  text-align: left;
}
#app .scrollbar-wrapper {
  overflow-x: hidden !important;
}
#app .el-scrollbar {
  height: 100%;
}
a {
  text-decoration: underline;
}
</style>
