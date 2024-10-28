<template>
	<view class="container" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
		<!-- 背景图 -->
		<image class="background-image" :src="backgroundImageSrc" mode="aspectFill" />

		<view class="progress-container">
			<view class="progress-bar">
				<view class="progress" :style="{ width: `${progress}%` }"></view>
			</view>
			<text class="progress-text">{{ currentScene }}/{{ totalScenes }}</text>
		</view>

		<!-- Test page content -->
		<template v-if="currentPage === 'test'">
			<!-- <view class="banner-container">
				<image class="logo" src="/static/signa.png" mode="aspectFit" />
				<view style="display: flex;">
					<text class="room-text">{{ scenarioData.location }}</text>
				</view>
			</view> -->
			<view class="banner-container">
				<image class="logo" src="/static/signa.png" mode="aspectFit" />
				<view class="test">
					<text class="room-text">{{ scenarioData?.location || '' }}</text>
				</view>
			</view>
			<view class="text-box" @tap="navigateToTest1" :class="{ 'disabled': isLoading }">
				<text class="text-content">{{ background }}</text>
				<view class="expand-icon">
					<image class="icon-image" src="/static/icon3.png" mode="aspectFit" />
				</view>
			</view>
		</template>

		<!-- Test1 page content -->
		<template v-else-if="currentPage === 'test1'">
			<onboarding-chat-bubble :userName="scenarioData.role" :avatar="npcAvatar" @tap="navigateToTest2"
				:description="description" :class="{ 'disabled': isLoading }"
				:requestCount="requestCount"></onboarding-chat-bubble>
		</template>

		<!-- Test2 page content -->
		<template v-else-if="currentPage === 'test2' " >
			<view class="options-container" :class="{ 'disabled': isLoading }">
				<view v-for="(option, index) in scenarioData && scenarioData.options
            ? scenarioData.options
            : []" :key="index" :class="['text-box1', { selected: selectedOptionIndex === index }]"
					@click="selectOption(index)">
					<text class="text-content1" :style="{ color: option.textColor || 'white' }">
						{{ option.text }}
					</text>
				</view>
				<view class="next-button-container">
					<image class="continue-button" src="/static/arrowright.png" mode="aspectFit" @click="nextPage1">
					</image>
				</view>
			</view>
		</template>

		<!-- Test3 page content -->
		<template v-else-if="currentPage === 'test3'">
			<view class="banner-container">
				<image class="logo" src="/static/signa.png" mode="aspectFit" />
				<view class="test">
					<text class="room-text">{{ scenarioData?.location || '' }}</text>
				</view>
			</view>
			<view class="text-box" @click="navigateToTest4" :class="{ 'disabled': isLoading }">
				<text class="text-content">{{ background }}</text>
				<view class="expand-icon">
					<image class="icon-image" src="/static/icon3.png" mode="aspectFit" />
				</view>
			</view>
		</template>

		<!-- Test4 page content -->
		<template v-else-if="currentPage === 'test4'">
			<onboarding-chat-bubble :userName="scenarioData.role" :avatar="npcAvatar" :dismiss="navigateToTest5"
				:description="description" :class="{ 'disabled': isLoading }"
				:requestCount="requestCount"></onboarding-chat-bubble>
		</template>

		<!-- Test5 page content -->
		<template v-else-if="currentPage === 'test5'" >
			<view class="options-container"  :class="{ 'disabled': isLoading }">
				<view v-for="(option, index) in scenarioData && scenarioData.options
            ? scenarioData.options
            : []" :key="index" :class="['text-box1', { selected: selectedOptionIndex === index }]"
					@click="selectOption(index)">
					<text class="text-content1" :style="{ color: option.textColor || 'white' }">
						{{ option.text }}
					</text>
				</view>
				<view class="next-button-container">
					<image class="continue-button" src="/static/arrowright.png" mode="aspectFit" @click="nextPage1">
					</image>
				</view>
			</view>
		</template>
		
	</view>
</template>

<script>
	import {
		findLastName,
		getAvatar
	} from "../../scripts/locate_name";
	import OnboardingChatBubble from "/components/OnboardingChatBubble.vue";
	import apiService from "@/services/api-service";
	import StateStack from "./StateStack";
	const stateStack = new StateStack();
	export default {
		components: {
			OnboardingChatBubble,
		},
		data() {
			return {
				currentPage: "test",
				userId: "",
				username: "",
				gender: "",
				selectedOptions: [],
				birthday: null,
				scenarioData: null,
				background: "Please click the arrow below to continue",
				jobId: "",
				npcName: "",
				npcAvatar: "",
				description: "",
				firstScene: false,
				selectedOptionIndex: null,
				num: null,
				baseURL: apiService.API_ENDPOINT,
				progress: 0,
				currentScene: 0,
				totalScenes: 5,
				isFirstScene: true, // Add this new property
				scenarioId: 1, // Add this new property
				isLoading: false,
				chatHistory: [], // Keep this new property
				backgroundImageSrc: '/static/onboarding/bg1.png',
				requestCount: 0,
				startX: 0, // 记录触摸开始时的 X 坐标
				endX: 0, // 记录触摸结束时的 X 坐标
			};
		},
		onLoad(option) {
			console.log("Received options:", option);
			// this.sendDataToBackend();
		},
		async created() {
			try {
				await this.initializeData();
				await this.getScenarioId();
				await this.getScenarioData();
			} catch (error) {
				console.error("Error during created lifecycle:", error);
				uni.showToast({
					title: "初始化失败",
					icon: "none",
				});
			}
		},
		methods: {
			initializeData() {
				const userId = uni.getStorageSync('userId');
				const jobId = uni.getStorageSync('jobId');
				if (!userId || !jobId) {
					uni.navigateTo({
						url: '/pages/landing/experience'
					});
					return;
				}
				this.userId = userId || "";
				const username = uni.getStorageSync('username');
				if (!username) {
					uni.navigateTo({
						url: '/pages/landing/experience'
					});
					return;
				}
				this.username = username;
				// this.gender = option.gender || "";
				this.jobId = jobId || "";
				// console.log("jobID:", this.jobId);
				// this.userId = option.userId || "";
				// this.username = decodeURIComponent(option.username || "");
				// this.gender = option.gender || "";
				// this.jobId = option.jobId || "";
				// console.log("jobID:", this.jobId);
				// this.background = option.background || "";
				// this.scenarioId = option.scenarioId || this.scenarioId;

				// if (option.options) {
				// 	try {
				// 		this.selectedOptions = JSON.parse(decodeURIComponent(option.options));
				// 	} catch (e) {
				// 		console.error("Error parsing options:", e);
				// 		this.selectedOptions = [];
				// 	}
				// }

				// if (option.birthday) {
				// 	try {
				// 		this.birthday = JSON.parse(decodeURIComponent(option.birthday));
				// 	} catch (e) {
				// 		console.error("Error parsing birthday:", e);
				// 		this.birthday = null;
				// 	}
				// }

				// console.log("Parsed data:", {
				// 	userId: this.userId,
				// 	username: this.username,
				// 	gender: this.gender,
				// 	selectedOptions: this.selectedOptions,
				// 	birthday: this.birthday,
				// 	jobId: this.jobId,
				// });
			},
			async getScenarioId() {
				try {
					const scenarioId = (() => {
						const indexes = this.username.split("##");
						const id = parseInt(indexes[1], 10);
						return !isNaN(id) ? id : undefined;
					})();

					console.log("####scenario id:############", scenarioId);
					const scenarioResponse = scenarioId !== undefined ?
						await apiService.startScenarioWithId(this.jobId, scenarioId) :
						await apiService.startScenario(this.jobId);

					console.log("#####################fetched scenario: ", scenarioResponse);

					// Get scenarioId
					this.scenarioId = scenarioResponse.scenario_id || 1;
					this.backgroundImageSrc = `/static/onboarding/bg${scenarioResponse.scenario_id}.png`;
				} catch (error) {
					console.error("Error fetching scenarioId:", error);
					uni.showToast({
						title: "获取场景ID失败",
						icon: "none",
					});
				}
			},
			getScenarioIdFromStorage() {
				return new Promise((resolve) => {
					uni.getStorage({
						key: "scenarioId",
						success: (res) => {
							resolve(res.data);
							console.log("get scenarioid by local", res.data);
						},
						fail: () => {
							resolve(null); // 如果未找到，返回 null
							console.log("unable to get scenario id by local");
						},
					});
				});
			},
			getScenarioData() {
				// const requestMethod = this.isFirstScene ?
				// 	apiService.startScenario(this.jobId) :
				// 	apiService.getCurrentScenario(this.jobId);
				const requestMethod = apiService.getCurrentScenario(this.jobId);
				return requestMethod
					.then((res) => {
						console.log("get current Scenario data:", res.scenario_id);
						this.scenarioData = res.scene.scenes || res;
						console.log("current npc name is --------", this.scenarioData.role);
						this.npcAvatar = getAvatar(this.scenarioData.role);
						console.log("src of npc avatar:", this.npcAvatar);
						// this.scenarioId = res.scenario_id || 1;
						this.handleScenarioData();
						this.updateProgress();
						this.isFirstScene = false;
					})
					.catch((err) => {
						console.error("Error getting scenario data:", err);
						throw err; // Re-throw the error to be caught in navigateToTest3
					});

			},
			handleScenarioData() {
				if (this.scenarioData) {
					this.description = this.scenarioData.description || "Unable to retrieve background information";
					this.background = this.scenarioData.background || "Please click the arrow below to continue";

					// 如果有选项，重置选项的文字颜色
					if (this.scenarioData.options) {
						this.scenarioData.options = this.scenarioData.options.map(
							(option) => ({
								...option,
								textColor: "white",
							})
						);
					} else {
						this.scenarioData.options = [];
					}

					// 重置选中的选项
					this.selectedOptionIndex = null;
					this.num = null;
				} else {
					console.warn("Background information not found in scenario data");
					this.description = "无法获取背景信息";
					this.background = "点击下方箭头继续";
					this.scenarioData = {
						options: [],
					};
				}
			},
			navigateToTest1() {
				if (this.isLoading) return;
				this.isLoading = true;
				uni.showLoading({
					title: 'loading...'
				});

				this.analyzeBackground();
				this.getScenarioData()
					.then(() => {
						this.currentPage = "test1";
					})
					.catch((error) => {
						console.error("Error loading scenario data:", error);
						uni.showToast({
							title: "loading failed, try again",
							icon: "none",
						});
					})
					.finally(() => {
						this.isLoading = false;
						uni.hideLoading();
					});
				stateStack.push("test1");
			},
			navigateToTest2() {
				if (this.isLoading) return;
				this.isLoading = true;
				uni.showLoading({
					title: 'loading...'
				});

				this.currentPage = "test2";
				this.getScenarioData()
					.catch((error) => {
						console.error("Error loading scenario data:", error);
						uni.showToast({
							title: "loading failed, try again",
							icon: "none",
						});
					})
					.finally(() => {
						this.isLoading = false;
						uni.hideLoading();
					});
				stateStack.push("test2");
			},
			navigateToTest3() {
				// Show loading indicator
				uni.showLoading({
					title: "loading...",
				});

				// Get new scenario data first
				this.getScenarioData()
					.then(() => {
						// Update the page only after new data is loaded
						this.currentPage = "test3";
						// Hide loading indicator
						uni.hideLoading();
					})
					.catch((error) => {
						console.error("Error loading scenario data:", error);
						uni.hideLoading();
						uni.showToast({
							title: "loading failed, try again",
							icon: "none",
						});
					});
			},
			navigateToTest4() {
				if (this.isLoading) return;
				this.isLoading = true;
				uni.showLoading({
					title: 'loading...'
				});

				this.currentPage = "test4";
				this.getScenarioData()
					.catch((error) => {
						console.error("Error loading scenario data:", error);
						uni.showToast({
							title: "loading failed, try again",
							icon: "none",
						});
					})
					.finally(() => {
						this.isLoading = false;
						uni.hideLoading();
					});
				stateStack.push("test4");
			},
			navigateToTest5() {
				if (this.isLoading) return;
				this.isLoading = true;
				uni.showLoading({
					title: 'loading...'
				});

				this.currentPage = "test5";
				this.getScenarioData()
					.catch((error) => {
						console.error("Error loading scenario data:", error);
						uni.showToast({
							title: "loading failed, try again",
							icon: "none",
						});
					})
					.finally(() => {
						this.isLoading = false;
						uni.hideLoading();
					});
				stateStack.push("test5");
			},
			analyzeBackground() {
				if (this.background) {
					this.npcName = findLastName(this.background);
					console.log("Now npc name is:", this.npcName);
					this.npcAvatar = getAvatar(this.npcName);
				}
			},
			selectOption(index) {
				this.selectedOptionIndex = index;
				this.num = index + 1;
				console.log(
					"Selected option:",
					this.num,
					this.scenarioData.options[index].text
				);

				this.scenarioData.options.forEach((option, i) => {
					option.textColor = i === index ? "black" : "white";
				});
			},


			// nextPage() {
			// 	if (this.num === null) {
			// 		uni.showToast({
			// 			title: "Please select an option",
			// 			icon: "none",
			// 		});
			// 		return;
			// 	}

			// 	// Add the current scenario and selected option to chat history
			// 	this.chatHistory.push({
			// 		background: this.background,
			// 		description: this.description,
			// 		selectedOption: this.scenarioData.options[this.selectedOptionIndex].text
			// 	});

			// 	console.log("Sending data to backend:", {
			// 		choice: this.num,
			// 		job_id: this.jobId,
			// 	});

			// 	// Log the chat history before navigating
			// 	console.log("Chat History:", this.chatHistory);

			// 	apiService
			// 		.chooseScenario(this.num, this.jobId)
			// 		.then((result) => {
			// 			console.log("Response data:", result);
			// 			// 增加请求计数
			// 			this.requestCount++;
			// 			console.log("API 请求次数:", this.requestCount)
			// 			if (
			// 				result.message ===
			// 				"Final choice made. Processing data in background."
			// 			) {
			// 				this.navigateToLoading();
			// 			} else {
			// 				// 更新当前场景
			// 				this.currentScene++;
			// 				// 重置选项
			// 				this.selectedOptionIndex = null;
			// 				this.num = null;
			// 				// 根据需要更新 currentPage
			// 				this.navigateToNextPage();
			// 			}

			// 			// 更新进度
			// 			this.updateProgress();
			// 		})
			// 		.catch((error) => {
			// 			console.error("Detailed error:", error);
			// 			uni.showToast({
			// 				title: `发生错误：${error.message}`,
			// 				icon: "none",
			// 			});
			// 		});
			// },
			
			nextPage1() {
				if (this.isLoading) return;
				this.isLoading = true;
				uni.showLoading({ title: 'loading...' });
				
				if (this.num === null) {
					uni.showToast({
						title: "Please select an option",
							icon: "none",
					});
					this.isLoading = false;
					uni.hideLoading();
					return;
				}

				// Add the current scenario and selected option to chat history
				this.chatHistory.push({
					background: this.background,
					description: this.description,
					selectedOption: this.scenarioData.options[this.selectedOptionIndex].text
				});

				// Start preparing the next page immediately
				const prepareNextPage = this.navigateToNextPage();

				// Make the API call
				const apiCall = apiService.chooseScenario(this.num, this.jobId);

				// Use Promise.all to wait for both the API call and page preparation
				Promise.all([apiCall, prepareNextPage])
					.then(([result, _]) => {
						console.log("Response data:", result);

						if (result.message === "Final choice made. Processing data in background.") {
							this.navigateToLoading();
						} else {
							this.selectedOptionIndex = null;
							this.num = null;
							// this.currentScene++; // 直接在这里增加场景计数
							this.updateProgress();
						}
					})
					.catch((error) => {
						console.error("Detailed error:", error);
						this.currentScene--;
						uni.showToast({
							title: "loading failed, try again",
							icon: "none",
						});
						
					})
					.finally(() => {
						this.isLoading = false;
						uni.hideLoading();
						// 根据错误消息类型判断是否需要恢复场景计数
						if (error.message === "loading failed, try again") {
							this.currentScene = this.currentScene;
						} else {
							this.currentScene++;
						}
					});
			},
			


			
			navigateToNextPage() {
				// 根据当前页面，决定下一个页面
				if (this.currentPage === "test2") {
					this.navigateToTest3();
				} else if (this.currentPage === "test5") {
					this.navigateToTest3();
				} else {
					this.navigateToTest3();
				}
			},
			navigateToLoading() {
				// 			const loadingPageUrl = `/pages/result/loading?jobId=${
				//     this.jobId
				//   }&userId=${this.userId}&username=${encodeURIComponent(
				//     this.username
				//   )}&gender=${this.gender}&birthday=${encodeURIComponent(
				//     JSON.stringify(this.birthday)
				//   )}&options=${encodeURIComponent(
				//     JSON.stringify(this.selectedOptions)
				//   )}&num=${this.num}`;
				const loadingPageUrl = `/pages/result/loading`;
				uni.navigateTo({
					url: loadingPageUrl,
					fail: (err) => {
						console.error("Navigation failed:", err);
						uni.showToast({
							title: "页面跳转失败",
							icon: "none",
						});
					},
				});
			},
			updateProgress() {
				this.progress = (this.currentScene / this.totalScenes) * 100;
			},
			onTouchStart(event) {
				// 记录触摸开始的 X 坐标
				console.log("touch start!!!!!!!!!!! ", this.startX);
				this.startX = event.changedTouches[0].clientX;
				this.endX = this.startX;
			},
			onTouchMove(event) {
				// 实时记录当前 X 坐标
				console.log("touch end!!!!!!!!!!! ", this.endX);
				this.endX = event.changedTouches[0].clientX;
			},
			onTouchEnd() {
				// 计算滑动距离
				const distance = this.startX - this.endX;
				if (this.currentPage === "test5") {
					console.log("move distance:", distance);
					if (distance < -150) { // 自定义左滑的最小距离，比如 50px
						this.navigateToTest3();
					}
				}
			},
		},
	};
</script>

<style scoped>
	@import url("/pages/test/common.css");


	/* ... 其他样式保持不变 ... */
</style>



