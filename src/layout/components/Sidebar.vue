<!-- 布局侧边栏 -->
<template>
  <div :class="['layout-aside', { collapse: isCollapse }]">
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        class="el-menu-vertical-demo"
        :default-active="defaultActive"
        unique-opened
        :collapse="isCollapse"
      >
        <template v-for="item in routes">
          <el-submenu :index="item.path" :key="item.path">
            <template slot="title">
              <i class="el-icon-folder"></i>
              <span>{{ item.meta.title }}</span>
            </template>
            <template v-for="v in item.children">
              <el-menu-item :index="item.path + '/' + v.path" :key="v.path">
                <router-link
                  class="aside-meun__item"
                  :to="{ path: item.path + '/' + v.path }"
                  >{{ v.meta.title }}</router-link
                >
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: '',
  components: {},
  directives: {},
  filters: {},
  mixins: [],
  model: {},
  props: {},
  data() {
    return {
      routes: []
    };
  },
  computed: {
    defaultActive() {
      return this.$route.path;
    },
    ...mapGetters(['isCollapse'])
  },
  watch: {},
  created() {
    const { routes } = this.$router.options;
    this.routes = this.getRoutes(routes);
    console.log(this.$store.state);
  },
  // 方法集合
  methods: {
    getRoutes(routes = []) {
      let list = [];
      routes.map(item => {
        if (item.children && item.children.length > 0) {
          item.children = this.getRoutes(item.children);
          list.push(item);
        } else {
          if (!item.hidden) {
            list.push(item);
          }
        }
      });
      return list;
    }
  }
};
</script>
<style lang="scss" scoped>
.layout-aside {
  width: 240px;
  height: 100%;
  background-color: rgb(48, 65, 86);
  transition: width 0.3s ease;
  &.collapse {
    width: 64px !important;
  }
  ::v-deep .el-menu {
    background-color: transparent;
    border-right: none;
  }
  ::v-deep .el-submenu__title {
    // padding-left: 20px !important;
    color: rgb(191, 203, 217);
    &:hover {
      background-color: #263445 !important;
    }
  }
  ::v-deep .el-submenu .el-menu-item {
    // padding: 0 !important;
    background-color: #1f2d3d !important;
    a {
      display: block;
      // padding-left: 40px;
      color: rgb(191, 203, 217);
      text-decoration: none;
    }
    &:hover {
      background-color: #001528 !important;
    }
  }
  ::v-deep .el-menu-item.is-active {
    a {
      color: rgb(64, 158, 255);
    }
  }
}
</style>
