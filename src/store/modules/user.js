import { loginApi, getInfoApi } from '@/api/user';
import { getToken, removeToken } from '@/utils/auth';
import { resetRouter } from '@/router';

const getDefaultState = () => {
  return {
    user: null,
    name: '',
    avatar: '',
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_USER: (state, userInfo) => {
    state.user = userInfo;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      loginApi(userInfo)
        .then((resp) => {
          const res = typeof resp === 'string' ? JSON.parse(resp) : resp;
          if (res.msg) reject(res.msg); // 如果有错误消息，直接停止，变为失败状态
          const { data } = resp;
          if (data) {
            resolve();
            commit('SET_USER', data);
          } else {
            reject('账号或密码错误');
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfoApi(getToken())
        .then((response) => {
          if (typeof response === 'string') {
            const res = JSON.parse(response);
            if (res.msg) reject(res.msg);
          } else {
            resolve();
            commit('SET_USER', response.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      resetRouter();
      commit('RESET_STATE');
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
