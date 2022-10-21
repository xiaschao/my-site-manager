import router from './router';
import store from './store';
import { Message } from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { getToken } from '@/utils/auth'; // get token from localStorage
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  const hasUserInfo = store.getters.userInfo;
  if (to.meta.auth) {
    // 该页面需要鉴权
    if (!hasUserInfo) {
      // 仓库中没有用户信息
      const hasToken = getToken();
      if (hasToken) {
        // 如果本地有token
        try {
          await store.dispatch('user/getInfo');
          next();
        } catch (error) {
          Message.error(error);
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      } else {
        // 没有token
        Message.error('请先进行登录');
        next(`/login?redirect=${to.path}`);
        NProgress.done();
      }
    } else {
      // 有用户信息
      next();
    }
  } else {
    // 不需要鉴权
    if (to.path === '/login' && hasUserInfo) {
      next({ name: 'Dashboard' });
      NProgress.done();
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
