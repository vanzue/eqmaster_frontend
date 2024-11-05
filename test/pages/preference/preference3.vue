<template>
	<view class="container">
		<view class="text-content">
			<text class="question">{{
        scenarioText || "Start your personalized EQ journey now!"
      }}</text>
			<!-- <text class="question1">个性化偏好</text> -->
		</view>

		<view class="card">
			<image class="card-image" :src="$t('images.startTest')" mode="aspectFit" />
			<button class="start-button" @click="startTest" :class="{ 'is-loading': isLoading }">
				<text v-if="!isLoading" class="arrow">Start ↗</text>
				<view v-else class="loader"></view>
			</button>
		</view>
	</view>
</template>

<script lang="ts">
	import { defineComponent } from "vue";
	import apiService from "../../services/api-service.js";

	type BirthdayType = {
		month : string;
		day : number;
		year : number;
	};

	export default defineComponent({
		data() {
			return {
				scenarioText: "",
				userId: 0,
				username: "",
				gender: "",
				birthday: null as BirthdayType | null,
				isLoading: false,
			};
		},
		onLoad(options : any) {
			const username = uni.getStorageSync('username');
			if (!username) {
				uni.navigateTo({
					url: '/pages/landing/experience',
					fail: (err) => {
						console.error('Navigation to experience page failed:', err);
						uni.showToast({
							title: 'Failed to navigate to experience page',
							icon: 'none'
						});
					}
				});
				return;
			}
			this.username = username;
			if (
				!this.username 
				// ||
				// this.selectedOptions.length === 0
			) {
				console.error("Some required data is missing or invalid in preference3");
			}
		},
		methods: {
			startTest() {
				if (!this.isLoading) {
					this.isLoading = true;
					this.navigateToNextPage();
				}
			},
			async navigateToNextPage() {
				try {
					const response = await apiService.createProfile({
						name: this.username,
						job_level: this.jobLevel || "",
						gender: this.gender,
						concerns: this.selectedOptions || ["Fitting in"],
					});

					// console.log("Backend response:", response);

					this.jobId = response.job_id;
					this.userId = response.user_id;
					uni.setStorageSync('userId', response.user_id);
					uni.setStorageSync('jobId', response.job_id);
					this.$store.commit('setUserId', response.user_id);
					this.$store.commit('setJobId', response.jobId);

					await this.getScenarioId();
					// const scenarioResponse = await apiService.initializeScenario();
					// if(scenarioResponse) {
					// 	this.$store.commit('setScenarioResponse', scenarioResponse.scene.scenes || scenarioResponse);
					// }
					// Get scenarioId
					// const fetchedScenarioId = scenarioResponse.scenario_id || 1;
					// console.log("Fetched scenarioId:", fetchedScenarioId);

					const testPageUrl = `/pages/test/test`;

					uni.navigateTo({
						url: testPageUrl,
					});
				} catch (err) {
					uni.showToast({
						title: "something error happened",
						icon: "none",
					});
				} finally {
					this.isLoading = false;
				}
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
					const scenarioIdVal = scenarioResponse.scenario_id || 1;
					this.$store.commit('setScenarioId', scenarioIdVal);
					// this.backgroundImageSrc = `/static/onboarding/bg${scenarioResponse.scenario_id}.png`;
				} catch (error) {
					console.error("Error fetching scenarioId:", error);
					uni.showToast({
						title: "获取场景ID失败",
						icon: "none",
					});
				}
			},
		},
	});
</script>

<style scoped>
	@import url("common.css");

	.container {
		display: flex;
		flex-direction: column;
		background-color: #1c1c1e;
		padding: 40px 20px;
	}

	/* 文本内容设置 */
	.text-content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		margin-top: 0px;
		margin-bottom: 0px;
	}

	.question {
		font-size: 20px;
		color: #ffffff;
		margin-bottom: 8px;
		font-weight: bold;
	}

	.subtitle {
		font-size: 14px;
		color: #8e8e93;
	}

	.card {
		background-color: #1c1c1e;
		border-radius: 20px;
		overflow: hidden;
		margin-top: 10vh;
	}

	.card-image {
		width: 100%;
		height: 33vh;
	}

	.start-button {
		position: relative;
		bottom: 120rpx;
		background-color: #1c1c1e;
		border: none;
		border-radius: 20px;
		font-size: 14px;
		width: 40%;
		color: #ffffff;
		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont,
			"Helvetica Neue", Helvetica, Arial, sans-serif;
		display: flex;
		justify-content: center;
		align-items: center;
		/* padding: 10px 0; */
	}

	.arrow {
		margin-left: 2px;
	}

	.welcome {
		font-size: 18px;
		color: #ffffff;
		margin-bottom: 8px;
	}

	/* 添加调试信息样式 */
	.debug-info {
		margin-top: 20px;
		padding: 10px;
		background-color: #2c2c2e;
		border-radius: 10px;
	}

	.start-button.is-loading {
		/* opacity: 0.7; */
		cursor: not-allowed;
		padding: 11.5rpx 0;
	}

	.loader {
		border: 2px solid #1c1c1e;
		/* Match button background color */
		border-top: 2px solid #ffffff;
		border-radius: 50%;
		width: 20px;
		height: 20px;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>