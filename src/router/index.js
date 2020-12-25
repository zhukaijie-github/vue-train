import Vue from 'vue';
import Router from 'vue-router';
import Layout from '../layout/index.vue';

Vue.use(Router);

const routes = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/vueReview',
      hidden: true
    },
    {
      path: '/vueReview',
      redirect: '/vueReview/baseic',
      component: Layout,
      hidden: false,
      meta: {
        title: 'Vue 回顾'
      },
      children: [
        {
          path: 'baseic',
          name: 'baseic',
          meta: {
            title: '基础篇'
          },
          hidden: false,
          component: () =>
            import(
              /* webpackChunkName: "vueReview" */ '@/views/vueReview/baseic.vue'
            )
        }
      ]
    },
    {
      path: '/application',
      redirect: '/application/file-upload/index',
      component: Layout,
      hidden: false,
      meta: {
        title: '场景应用'
      },
      children: [
        {
          path: 'file-upload/index',
          name: 'file-upload-index',
          meta: {
            title: '文件上传'
          },
          hidden: false,
          component: () =>
            import(
              /* webpackChunkName: "application" */ '@/views/application/file-upload/index.vue'
            )
        },
        {
          path: 'file-upload/commonly',
          name: 'file-upload-commonly',
          meta: {
            title: '一般上传'
          },
          hidden: true,
          component: () =>
            import(
              /* webpackChunkName: "application" */ '@/views/application/file-upload/commonly.vue'
            )
        },
        {
          path: 'file-upload/sectioning',
          name: 'file-upload-sectioning',
          meta: {
            title: '分片上传'
          },
          hidden: true,
          component: () =>
            import(
              /* webpackChunkName: "application" */ '@/views/application/file-upload/sectioning.vue'
            )
        }
      ]
    },
    {
      path: '/activity',
      name: '抽奖',
      component: () =>
        import(/* webpackChunkName: 'activity' */ '@/views/activity.vue')
    }
  ]
});

export default routes;
