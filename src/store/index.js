import {
	createStore
} from 'vuex';
import apiService from "@/services/api-service";
import {DEFAULT_LOCALE} from "@/locale";

import { getImg } from '../scripts/constants';
export default createStore({
	state: {
		userId: 0, //用户ID
		username: '', //用户名
		userInfo: {}, //用户信息
		locale: DEFAULT_LOCALE,
		jobId: '',
		selectedOptions: {},
		homepageData: {},
		courseData: {},
		intervalId: null, // 定时器ID
		homeNavName: 'dashboard',
		npcs: [{
				characterName: "领导",
				health: 10,
				avatar: getImg("/static/web/battlefield/boss.webp"),
				voice: "zh-CN-XiaoruiNeural",
				style: "serious",
				rate: "0%",
				
			},
			{
				characterName: "同事A",
				health: 10,
				avatar:  getImg("/static/web/battlefield/xiaoA.webp"),
				voice: "zh-CN-YunxiNeural",
				style: "friendly",
				rate: "10%",
			},
			{
				characterName: "同事B",
				health: 10,
				avatar:  getImg("/static/web/battlefield/xiaoB.webp"),
				voice: "zh-CN-XiaoxiaoNeural",
				style: "angry",
				rate: "10%",
			},
		],
		weakness: null,
		characteristics: null,
		diamondCount: 0,
		gemCount: 0,
		audios: new Map(),
    scenario_id: 1,
    scenarioResponse: {},
		courseInfo: {}, // 添加新的state属性
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
		setLocale(state, locale) {
			state.locale = locale;
			console.log(`setStorageSync locale: ${locale}`);
			uni.setStorageSync("locale", locale);
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
		  console.log('@@@@@@@@@@@@Scenario response updated:', scenarioResponse);
		},
		setCourseInfo(state, courseInfo) {
			state.courseInfo = courseInfo;
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
		getLocale(state) {
			return state.locale;
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
			console.log('@@@@@@@@@@@@@Getting scenario response:', state.scenarioResponse);
		  
			return state.scenarioResponse;
		},
		getCourseInfo(state) {
			return state.courseInfo;
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

				if (homepageData.response && homepageData.response.eq_scores) {
					commit('setHomepageData', homepageData);
					commit('setGemCount', homepageData.response.personal_info.num_star)
				}

				// commit('setDiamondCount', homepageData.response.personal_info.num_diamond);
				console.log("##########commit homepage data:", homepageData);
			} catch (error) {
				// console.error('Error fetching homepage data:', error);
				console.log("####get home page data failed.")
				throw error;
			}
		},
		async fetchcourseData({
			commit,
			state
		}) {
			try {
				console
				const courseData = await apiService.getBattlefield(this.state.userId);
				if (!courseData) {
					throw new Error('No course data received');
				}
				console.log("Fetched course data:", courseData);
				commit('setcourseDatas', courseData);
				console.log("Committed course data:", state.courseData);
			} catch (error) {
				console.error('Error fetching course Data:', error);
			}
		},
		async fetchCourseInfo({ commit }, courseId) {
			try {
				const courseInfo = await apiService.getCourseInfo(courseId);
				if (!courseInfo) {
					throw new Error('No course info received');
				}
				console.log("Fetched course info:", courseInfo);
				commit('setCourseInfo', courseInfo);
			} catch (error) {
				console.error('Error fetching course info:', error);
				throw error;
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
		},

	}
})