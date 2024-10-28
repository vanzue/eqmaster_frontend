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
		<template v-else-if="currentPage === 'test2' ">
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
					<image class="continue-button" src="/static/arrowright.png" mode="aspectFit" @click="nextPage">
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
		<template v-else-if="currentPage === 'test5'">
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
					<image class="continue-button" src="/static/arrowright.png" mode="aspectFit" @click="nextPage">
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
	// import StateStack from "./StateStack";
	// const stateStack = new StateStack();
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
				num: "", // Changed from null to empty string
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
				dialogueHistory: [], // Modified structure for dialogue history
				scores: {
					Perception: 0,
					"Self Regulation": 0,
					Empathy: 0,
					"Social Skill": 0,
					Motivation: 0
				},
			};
		},
		watch: {
			isLoading(newValue) {
				if (newValue) {
					uni.showLoading({
						title: 'loading...'
					});
				} else {
					uni.hideLoading();
				}
			}
		},
		onLoad(option) {
			console.log("Received options:", option);
			// this.sendDataToBackend();
		},
		async created() {
			console.log("Initial num value:", this.num);
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
				
				// const requestMethod = apiService.getCurrentScenario(this.jobId);
				console.log("11111111111111111111111111111");
				const requestMethod = apiService.initializeScenario();
				return requestMethod
					.then((res) => {
						console.log("########initialize Scenario data:", res);
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

					// Store the current scene data with the new structure
					this.dialogueHistory.push({
						background: this.background,
						description: this.description,
						choice: null,     // Will be updated when option is selected
						analysis: null    // Will be updated when option is selected
					});

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

					// 只重置选中的选项索引，不重置 num
					this.selectedOptionIndex = null;
					// 删除这行
					// this.num = ""; // 不要重置 num
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

				this.analyzeBackground();
				this.currentPage = "test1";
				this.isLoading = false;
				// this.getScenarioData()
				// 	.then(() => {
				// 		this.currentPage = "test1";
				// 	})
				// 	.catch((error) => {
				// 		console.error("Error loading scenario data:", error);
				// 		uni.showToast({
				// 			title: "loading failed, try again",
				// 			icon: "none",
				// 		});
				// 	})
				// 	.finally(() => {
				// 		this.isLoading = false;
				// 	});
				// stateStack.push("test1");
			},
			navigateToTest2() {
				if (this.isLoading) return;
				this.isLoading = true;

				this.currentPage = "test2";
				this.isLoading = false;
				// this.getScenarioData()
				// 	.catch((error) => {
				// 		console.error("Error loading scenario data:", error);
				// 		uni.showToast({
				// 			title: "loading failed, try again",
				// 			icon: "none",
				// 		});
				// 	})
				// 	.finally(() => {
				// 		this.isLoading = false;
				// 	});
				// stateStack.push("test2");
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
				this.currentPage = "test4";
				this.isLoading = false;

				// this.currentPage = "test4";
				// this.getScenarioData()
				// 	.catch((error) => {
				// 		console.error("Error loading scenario data:", error);
				// 		uni.showToast({
				// 			title: "loading failed, try again",
				// 			icon: "none",
				// 		});
				// 	})
				// 	.finally(() => {
				// 		this.isLoading = false;
				// 	});
				// stateStack.push("test4");
			},
			navigateToTest5() {
				if (this.isLoading) return;
				this.isLoading = true;
				this.currentPage = "test5";
				this.isLoading = false;

				// this.currentPage = "test5";
				// this.getScenarioData()
				// 	.catch((error) => {
				// 		console.error("Error loading scenario data:", error);
				// 		uni.showToast({
				// 			title: "loading failed, try again",
				// 			icon: "none",
				// 		});
				// 	})
				// 	.finally(() => {
				// 		this.isLoading = false;
				// 	});
				// stateStack.push("test5");
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
				this.num = this.num + (index + 1).toString();

				// Update the current scene's choice and analysis
				if (this.dialogueHistory.length > 0) {
					const currentScene = this.dialogueHistory[this.dialogueHistory.length - 1];
					const selectedOption = this.scenarioData.options[index];
					currentScene.choice = selectedOption.text;
					currentScene.analysis = `Selected option ${index + 1}: ${selectedOption.text}`;

					// Calculate and update scores if the option has scores
					if (selectedOption.scores) {
						Object.entries(selectedOption.scores).forEach(([dimension, score]) => {
							if (this.scores.hasOwnProperty(dimension)) {
								this.scores[dimension] += score;
							}
						});
					}
				}

				this.scenarioData.options.forEach((option, i) => {
					option.textColor = i === index ? "black" : "white";
				});
			},
			


			nextPage() {
				if (this.isLoading) return;
				
				if (!this.num) {
					uni.showToast({
						title: "Please select an option",
						icon: "none",
					});
					return;
				}

				this.isLoading = true;
				console.log("Current Scores:", this.scores);
				console.log("Current dialogueHistory:", this.dialogueHistory);

				// 从本地存储获取 jobId
				const jobId = uni.getStorageSync('jobId');
				if (!jobId) {
					console.error("No jobId found in storage");
					uni.showToast({
						title: "Session error, please try again",
						icon: "none",
					});
					return;
				}

				if (this.num.length === 5) {
					apiService.finalizeScenario(this.scores, jobId, this.dialogueHistory)
						.then((result) => {
							console.log("Final Scenario Results:", {
								scores: this.scores,
								dialogueHistory: this.dialogueHistory,
								jobId: jobId,
								finalResponse: result
							});
							this.navigateToLoading();
						})
						.catch((error) => {
							console.error("Detailed error:", error);
							uni.showToast({
								title: `发生错误：${error.message}`,
								icon: "none",
							});
						})
						.finally(() => {
							this.isLoading = false;
						});
				} else {
					apiService.retrieveScenario(this.scenarioId, this.num)
						.then((result) => {
							console.log("#####retrieveScenarioResponse data:", result);
							this.scenarioData = result.scene.scenes;
							this.handleScenarioData();
							this.requestCount++;
							this.selectedOptionIndex = null;
							this.currentScene++;
							this.updateProgress();
							this.currentPage = "test3";
						})
						.catch((error) => {
							console.error("Detailed error:", error);
							uni.showToast({
								title: `发生错误：${error.message}`,
								icon: "none",
							});
						})
						.finally(() => {
							this.isLoading = false;
						});
				}
			},

			// 删除或注释掉 navigateToNextPage1 方法，因为我们不再需要它
			// navigateToNextPage1() {
			// 	this.getScenarioData()  // 这里会导致数据被覆盖
			// 		.then(() => {
			// 			this.currentPage = "test3";
			// 			this.isLoading = false;
			// 			uni.hideLoading();
			// 		})
			// 		.catch((error) => {
			// 			console.error("Error loading scenario data:", error);
			// 			uni.hideLoading();
			// 			uni.showToast({
			// 				title: "loading failed, try again",
			// 				icon: "none",
			// 			});
			// 		});
			// },
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
							title: "Page navigation failed",
							icon: "none",
						});
					},
				});
			},
			updateProgress() {
				this.progress = (this.currentScene / this.totalScenes) * 100;
			},
			onTouchStart(event) {
				// 触摸开始的 X 坐标
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
			// Add a helper method to reset scores if needed
			resetScores() {
				this.scores = {
					Perception: 0,
					"Self Regulation": 0,
					Empathy: 0,
					"Social Skill": 0,
					Motivation: 0
				};
			}
		},
	};
</script>

<style scoped>
	@import url("/pages/test/common.css");


	/* ... 其他样式保持不变 ... */
</style>




















