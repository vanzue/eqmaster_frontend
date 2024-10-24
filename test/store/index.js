import { createStore } from 'vuex'

export default createStore({
  state: {
    userId: 0, //用户ID
    username: '', //用户名
    userInfo: {}, //用户ID
    jobId: '',
    selectedOptions: {},
  },
  mutations: {
    setUserId(state, userId) {
      state.userId = userId;
    },
    setUsername(state, username) {
      state.username = username;
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    setJobId(state, jobId) {
      state.jobId = jobId;
    },
    setSelectedOptions(state, selectedOptions) {
      state.selectedOptions = selectedOptions;
    }
  },
  getters: {
    getUserId(state) {
      return state.userId;
    },
    getUsername(state) {
      return state.username;
    },
    getUserInfo(state) {
      return state.userInfo;
    },
    getJobId(state) {
      return state.jobId;
    },
    getSelectedOptions(state) {
      return state.selectedOptions;
    }
  },
  actions: {
  }
})
