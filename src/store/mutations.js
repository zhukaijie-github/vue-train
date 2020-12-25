import * as types from './mutations-type';

export default {
  [types.SET_COLLAPSE](state, isCollapse = false) {
    state.isCollapse = isCollapse;
  },
  [types.SET_REQUESTLIST](state, requestList = []) {
    state.requestList = requestList;
  }
};
