import * as types from './mutations-type';

export default {
  setCollapse({ commit, state }) {
    commit(types.SET_COLLAPSE, !state.isCollapse);
  },
  setRequestList({ commit }, requestList = []) {
    commit(types.SET_REQUESTLIST, requestList);
  }
};
