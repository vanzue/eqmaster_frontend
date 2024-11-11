import {
	createStore
} from 'vuex';
import apiService from "@/services/api-service";

export default createStore({
	state: {
		userId: 0, //用户ID
		username: '', //用户名
		userInfo: {}, //用户信息
		jobId: '',
    couseId: 1, //课程ID
		selectedOptions: {},
		homepageData: {},
		courseData: {},
		intervalId: null, // 定时器ID
		homeNavName: 'dashboard',
		npcs: [{
				characterName: "Jason",
				health: 10,
				avatar: "/static/battlefield/boss11.png",
				voice: "en-US-DavisNeural",
				style: "chat",
				rate: "-10%",
			},
			{
				characterName: "Sam",
				health: 10,
				avatar: "/static/battlefield/xiaoA1.png",
				voice: "en-US-JasonNeural",
				style: "friendly",
				rate: "0%",
			},
			{
				characterName: "Anna",
				health: 10,
				avatar: "/static/battlefield/xiaoB1.png",
				voice: "en-US-JennyNeural",
				style: "chat",
				rate: "0%",
			},
		],
		weakness: null,
		characteristics: null,
		diamondCount: 0,
		gemCount: 0,
		audios: new Map(),
    scenario_id: 1,
    scenarioResponse: {},
	},
	mutations: {
		setUserId(state, userId) {
			state.userId = userId;
		},
		clearIntervalId(state) {
			if (state.intervalId) {
				clearInterval(state.intervalId);
				state.intervalId = null;
			}
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
		},
		setSelectedOptions(state, selectedOptions) {
			state.selectedOptions = selectedOptions;
		},
		setHomepageData(state, homepageData) {
			state.homepageData = homepageData;
		},
		setHomeNavName(state, homeNavName) {
			state.homeNavName = homeNavName;
		},
		setNpcs(state, npcs) {
			state.npcs = npcs;
		},
		setWeakness(state, weakness) {
			state.weakness = weakness;
		},

		setcourseDatas(state, courseData) {
			state.courseData = courseData;
		},

		setCharateristics(state, characteristics) {
			state.characteristics = characteristics;
		},
		setDiamondCount(state, diamondCount) {
			state.diamondCount = diamondCount;
		},
		setGemCount(state, gemCount) {
			state.gemCount = gemCount;
		},
		setAudios(state, {
			key,
			value
		}) {
			state.audios.set(key, value);
		},
		initNpcsHealth(state) {
			state.npcs.forEach((item) => item.health = 10);
		},
		setScenarioId(state, scenarioId) {
		  state.scenarioId = scenarioId;
		},
		setScenarioResponse(state, scenarioResponse) {
		  state.scenarioResponse = scenarioResponse;
		},
		setCourseId(state, courseId) {
			state.courseId = courseId;
			if (courseId) {
				this.dispatch('fetchNpcsByCourseId', courseId);
			}
		},
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
		},
		getHomepageData(state) {
			return state.homepageData;
		},
		getHomeNavName(state) {
			return state.homeNavName;
		},
		getNpcs(state) {
			return state.npcs;
		},
		getWeakness(state) {
			return state.weakness;
		},
		getcourseData(state) {
			return state.courseData;
		},
		getCharacteristics(state) {
			return state.characteristics;
		},
		getDiamondCount(state) {
			return state.diamondCount;
		},
		getGemCount(state) {
			return state.gemCount;
		},
		getAudios: (state) => (key) => {
			return state.audios.get(key);
		},
		getScenarioId(state) {
			return state.scenarioId;
		},
    getScenarioResponse(state) {
      return state.scenarioResponse;
    },
		getCourseId(state) {
			return state.courseId;
		},
	},
	actions: {
		async fetchHomepageData({
			commit,
			state
		}) {
			try {
				const homepageData = await apiService.getHomepageData(this.state.userId);
				console.log("#####store homepage data:", homepageData);

				if(!homepageData.response.eq_scores){
					throw new Error('EQ scores not found in homepage data');
				}

				commit('setHomepageData', homepageData);
				commit('setGemCount', homepageData.response.personal_info.num_star)
				// commit('setDiamondCount', homepageData.response.personal_info.num_diamond);
				console.log("##########commit homepage data:", homepageData);
			} catch (error) {
				// console.error('Error fetching homepage data:', error);
				console.log("####get home page data failed.")
				throw error;
			}
		},
		async fetchNpcsByCourseId({ commit }, courseId) {
			try {
				const npcData = await apiService.getNpcsByCourseId(courseId);
				if (!npcData) {
					throw new Error('No NPC data received');
				}
				commit('setNpcs', npcData);
				console.log("##########commit NPC Data:", npcData);
			} catch (error) {
				console.error('Error fetching NPC data:', error);
				// 可以在这里添加一些错误处理逻辑，比如显示一个错误消息给用户
			}
		},
		async fetchcourseData({
			commit,
			rootState
		}) {
			try {
				if (!rootState.userId) {
					throw new Error('User ID is not set');
				}
				const courseData = await apiService.getBattlefield(rootState.userId);
				if (!courseData) {
					throw new Error('No course data received');
				}
				commit('setcourseDatas', courseData);
				console.log("##########commit course Data:", courseData);
			} catch (error) {
				console.error('Error fetching course Data:', error);
				// 可以在这里添加一些错误处理逻辑，比如显示一个错误消息给用户
			}
		},
		clearAllState({
			commit
		}) {
			commit('setUserId', null);
			commit('setUsername', null);
			commit('setUserInfo', null);
			commit('setJobId', null);
			commit('setSelectedOptions', []);
			commit('setHomepageData', {});
			commit('setHomeNavName', '');
			commit('setWeakness', '');
			commit('setCharateristics', '');
			commit('setcourseData', {});
			commit('setAudios', {});
			commit('setGemCount', 0);
			commit('setDiamondCount', 0);

			const username = uni.getStorageSync('username');
			localStorage.clear();
			uni.setStorageSync('username', username);
		}
	}
})