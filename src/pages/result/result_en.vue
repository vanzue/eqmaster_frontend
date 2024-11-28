<template>
	<view class="container">
		<scroll-view scroll-y style="height: 100%;">
			<view class="content">
				<view class="header">
					<image class="header-icon" src="/static/back.png" @click="navigateToHome"></image>
					<text class="score-title-head">My EQ report</text>
					<image class="header-icon" src="/static/battlefield/share.png"></image>
				</view>
				<view class="background-curve">
					<view class="animal-box">
						<view class="animal-my-eq-type">
							My EQ companion
						</view>
						<view class="animal-name"
							:style="{ backgroundImage: `url(${illustrationData.animal_name_bg})` }">
							<view class="animal-score-desc">
								{{ illustrationData.animal_name }}
							</view>
						</view>
						<image class="animal-icon" :src="illustrationData.animal_icon"></image>
						<view class="animal-score">
							<view class="animal-score-title">
								EQ points
							</view>
							<view class="animal-score-desc"
								:style="{ backgroundImage: `url(${getImg('/static/web/resulten/animal-name-3.webp')})`}">
								{{homepageData?.response?.eq_scores?.score}}/100
							</view>
						</view>
						<view class="animal-desc" :style="{ backgroundImage: `url(${getImg('/static/web/resulten/quote.webp')})` }">
							<view class="card-text-container">
								<!-- <text class="card-title">{{ homepageData.response.eq_scores.summary }}</text>
								<text class="card-description">{{ homepageData.response.eq_scores.overall_suggestion }}</text> -->
								<text class="card-title">{{ illustrationData.weakness }}</text>
								<text class="card-description">{{ illustrationData.characteristics }}</text>
							</view>
						</view>
					</view>
				</view>

				<view class="overview-container">
					<view class="overview">
						<view class="overview-title">Overview</view>
						<view class="overview-content">
							<image class="overview-content-icon" src="/static/resulten/pattern.svg"></image>
							<view class="overview-content-item">
								<view class="overview-content-title">
									{{ homepageData?.response?.eq_scores?.detail_summary }}
								</view>
								<view class="overview-content-detail">
									{{ homepageData?.response?.eq_scores?.detail }}
								</view>
							</view>
							<view class="speed-right">
								<view class="speed-title">
									{{ caleOverviewScores.length > 0 ? caleOverviewScores[caleOverviewScores.length - 1].name : '' }}
								</view>
								<view class="">
									<view class="blood-container">
										<view class="health-bar-container">
											<view class="health-bar-line"></view>
											<view class="health-bar-background">
												<view class="health-bar-foreground"
													:style="progressWidth(caleOverviewScores.length > 0 ? caleOverviewScores[caleOverviewScores.length - 1].score : 0, 1)">
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>

							<view v-for="(score, index) in caleOverviewScores" :key="index" class="speed-right">
								<view v-if="index < caleOverviewScores.length - 1">
									<view class="speed-title">
										{{ score.name }}
									</view>
									<view class="">
										<view class="blood-container">
											<view class="health-bar-container">
												<view class="health-bar-line"></view>
												<view class="health-bar-background">
													<view class="health-bar-foreground"
														:style="progressWidth(score.score)">
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="improved-container">
					<view class="improved">
						<view class="improved-title">To be improved:</view>
						<view class="improved-content">
							<view class="improved-content-item">
								<view class="improved-content-title">
									<image class="improved-show-icon" :src="caleOverviewScores.length > 0 ? caleOverviewScores[caleOverviewScores.length - 1].icon1 : ''"></image>
									{{ caleOverviewScores.length > 0 ? caleOverviewScores[caleOverviewScores.length - 1].name : '' }}
								</view>
								<view class="improved-content-description">
									{{ caleOverviewScores.length > 0 ? caleOverviewScores[caleOverviewScores.length - 1].detail : '' }}
								</view>
							</view>
						</view>

						<view class="improved-title key-strength-title">key strength:</view>
						<view v-for="(score, index) in caleOverviewScores" :key="index"
							class="improved-content key-strength-content">
							<view v-if="index < caleOverviewScores.length - 1">
								<image class="key-strength-nice" src="/static/resulten/nice.png"></image>
								<view class="improved-content-item">
									<view class="improved-content-title key-strength-content-title">
										<image class="improved-show-icon" :src="score.icon"></image>
										{{ score.name }}
									</view>
									<view class="improved-content-description">
										{{ score.detail }}
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="guide-button-container">
					<button class="guide-button" @click="navigateToGuide">My personalized courses</button>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {
		illustrationSrc
	} from '@/scripts/illustrationHelper.js';
import {
		getImg
	} from '../../scripts/constants.js';
	export default {
		data() {
			return {
				getImg,
				score: 28, // 示例分数，可根据需要动态更改
				maxScore: 100, // 假设最大分数为100
				gender: '',
				birthday: null,
				progress: 0,
				imageWidth: 2000,
				isExpanded: false, // 默认收起状态
			};
		},
		computed: {
			homepageData() {
				return this.$store.getters.getHomepageData;
			},
			userId() {
				return this.$store.getters.getUserId;
			},
			username() {
				return this.$store.getters.getUsername;
			},
			formattedBirthday() {
				if (this.birthday) {
					const date = new Date(this.birthday.year, this.birthday.month - 1, this.birthday.day);
					return date.toLocaleDateString();
				}
				return '未设置';
			},
			illustrationData() {
				return illustrationSrc(this.homepageData, this.$store);
			},
			caleOverviewScores() {
				if (this.homepageData && this.homepageData.response && this.homepageData.response.eq_scores) {
					const scores = [{
							name: this.$t('pages.result.result.perception'),
							score: this.homepageData.response.eq_scores.dimension1_score,
							detail: this.homepageData.response.eq_scores.dimension1_detail,
							icon: '/static/resulten/awareness0.svg',
							icon1: '/static/resulten/awareness1.svg',
						},
						{
							name: 'self regulation',
							score: this.homepageData.response.eq_scores.dimension2_score,
							detail: this.homepageData.response.eq_scores.dimension2_detail,
							icon: '/static/resulten/regulation0.svg',
							icon1: '/static/resulten/regulation0.svg',
						},
						{
							name: 'social skill',
							score: this.homepageData.response.eq_scores.dimension3_score,
							detail: this.homepageData.response.eq_scores.dimension3_detail,
							icon: '/static/resulten/socialskill0.svg',
							icon1: '/static/resulten/socialskill1.svg'
						},
						{
							name: 'empathy',
							score: this.homepageData.response.eq_scores.dimension4_score,
							detail: this.homepageData.response.eq_scores.dimension4_detail,
							icon: '/static/resulten/empathy0.svg',
							icon1: '/static/resulten/empathy1.svg'
						},
						{
							name: 'motivation',
							score: this.homepageData.response.eq_scores.dimension5_score,
							detail: this.homepageData.response.eq_scores.dimension5_detail,
							icon: '/static/resulten/motivation0.svg',
							icon1: '/static/resulten/motivation1.svg'
						}
					];

					// Sort scores in descending order
					scores.sort((a, b) => b.score - a.score);
					console.log(scores);
					return scores;
				}
				return [];
			}
		},
		watch: {
			homepageData: {
				immediate: true,
				async handler(val) {
					// console.log(val)
				},
				// deep: true,
			}
		},
		created() {
			this.$store.dispatch('fetchcourseData')
		},
		onUnload() {},
		onReady(option) {
			// console.log('option', option);
		},
		methods: {
			progressWidth(value, isOne) {
				if (!value) return {};

				const maxScore = 20;
				const percentage = (value / maxScore) * 100;
				const color = isOne ? '#EA833D' : '#23A06B';
				const width = `${percentage}%`;

				return {
					width,
					backgroundColor: color,
					transition: 'width 0.5s ease, background-color 0.5s ease'
				};
			},
			circleLeftPosition(value) {
				// 获取进度条实际宽度
				const percentage1 = (value / this.maxScore) * 100;
				const progressBarWidth = uni.getSystemInfoSync().windowWidth * 0.8; // 80%的屏幕宽度作为进度条的实际宽度
				console.log(percentage1)
				return (percentage1 / 100) * progressBarWidth;
			},
			navigateToGuide() {
				console.log('Navigating to guide with data:', {
					userId: this.userId,
					username: this.username,
					jobId: this.homepageData.response.personal_info.job_id
				});
				// uni.reLaunch({
				// 	url: `/pages/dashboard/dashboard_en?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.homepageData.response.personal_info.job_id}`
				// });
				this.$store.commit('setHomeNavName', 'dashboard2');
				uni.reLaunch({
					url: `/pages/dashboard/dashboard_en`
				});
			},
			expand() {
				this.isExpanded = true; // 只展开，不再收起
			},
			navigateToHome() {
				uni.reLaunch({
					url: `/pages/dashboard/dashboard_en`
				});
			}
		},
	};
</script>

<style scoped>
	@font-face {
		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
		src: url('https://eqmaster.blob.core.chinacloudapi.cn/static/web/fonts/Poppins-Italic.ttf?sp=r&st=2024-11-18T09:41:26Z&se=2025-11-18T17:41:26Z&sv=2022-11-02&sr=c&sig=WL07d2l6cOkDXNTjNxkTEU3Yl0J%2FrNlWU%2FUPGJRPfhA%3D') format('truetype');
		font-weight: normal;
		font-style: normal;
	}

	.container {
		/* position: absolute; */
		/* position: fixed; */
		background-color: #2F2F38;
		display: flex;
		flex-direction: column;
		align-items: center;
		/* padding-top: 88rpx; */
		width: 100%;
		height: 100vh;
		overflow: hidden;
		left: 0;
		/* -webkit-overflow-scrolling: touch; */
	}

	.header {
		position: absolute;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		z-index: 6;
		width: 95%;
		height: 104rpx;
		padding-top: 88rpx;
	}

	.header-icon {
		width: 50rpx;
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}


	.content {
		display: flex;
		/* 避免 flex 布局干扰 */
		flex-direction: column;
		align-items: center;
		padding-bottom: 106px;
		/* margin-left: 20px;
		margin-right: 20px; */
	}

	.background-curve {
		width: 100%;
		height: 848rpx;
		position: relative;
		z-index: 5;
		display: flex;
		overflow: hidden;
		/* Changed from visible to hidden */
		/* justify-content: center;
		align-items: center; */
		background-image: 
		url("https://eqmaster.blob.core.chinacloudapi.cn/static/web/resulten/header-bg.webp?sp=r&st=2024-11-18T09:41:26Z&se=2025-11-18T17:41:26Z&sv=2022-11-02&sr=c&sig=WL07d2l6cOkDXNTjNxkTEU3Yl0J%2FrNlWU%2FUPGJRPfhA%3D");
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.animal-box {
		display: flex;
	}

	.animal-my-eq-type {
		position: absolute;
		display: flex;
		justify-content: left;
		align-items: center;
		width: 125.57px;
		height: 31px;
		top: 200rpx;
		left: 52rpx;
		color: #D7D8E0;
		font-size: 26rpx;
		font-weight: 400;
	}

	.animal-name {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 125.57px;
		height: 31px;
		top: 258rpx;
		left: 32rpx;
		background-image: none;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		font-size: 40rpx;
		color: #FDEDC8;
		font-weight: 600;
	}

	.animal-icon {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		top: 220rpx;
		left: 400rpx;
		width: 296rpx;
		height: 300rpx;
	}

	.animal-score {
		display: block;
		position: absolute;
		top: 404rpx;
		left: 32rpx;
	}

	.animal-score-title {
		font-size: 26rpx;
		font-weight: 400;
		color: #D7D8E0;
		margin-left: 20rpx;
		margin-bottom: 14rpx;
	}

	.animal-score-desc {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 173.14rpx;
		height: 60rpx;

		background-image: none;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		font-size: 36rpx;
		color: #FDEDC8;
		font-weight: 600;
	}

	.animal-desc {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 686rpx;
		height: 236rpx;
		top: 580rpx;
		left: 32rpx;
		background-image: none;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		font-size: 40rpx;
		color: #FFA1FC;
		font-weight: 600;
	}

	.card-text-container {
		display: flex;
		height: 100%;
		flex-direction: column;
		padding: 8rpx 32rpx;
		justify-content: center;
		margin-top: 25rpx;
		/* align-items: center; */
	}

	.score-title-head {
		font-size: 40rpx;
		font-weight: bold;
		color: #FFFFFF;
		z-index: 6;
	}


	.card-title {
		font-size: 34rpx;
		color: #E8FFC4;
	}

	.card-description {
		font-size: 28rpx;
		font-weight: 400;
		color: #FFFFFF;
		margin-top: 16rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.overview-container {
		display: flex;
		position: relative;
		background-color: #1B5A50;
		width: 686rpx;
		height: auto;
		margin-top: 32rpx;
		border-radius: 32rpx;
	}

	.overview {
		/* width: 100%; */
		padding: 16rpx;
	}

	.overview-title {
		font-size: 40rpx;
		font-weight: 600;
		color: #E8FFC4;
		margin-left: 16rpx;
	}

	.overview-content {
		position: relative;
		display: block;
		width: 654rpx;
		height: auto;
		background-color: #C6DBB8;
		border-radius: 32rpx;
		margin-top: 44rpx;
		/* padding-left: 32rpx;
		padding-left: 32rpx; */
	}

	.overview-content-icon {
		position: absolute;
		top: -20rpx;
		left: 64rpx;
		width: 526rpx;
		height: 50rpx;
	}

	.overview-content-item {
		padding: 60rpx 32rpx 32rpx 32rpx;
		display: block;
	}

	.overview-content-title {
		font-size: 34rpx;
		color: #2F2F38;
		font-weight: 600;
	}

	.overview-content-detail {
		margin-top: 16rpx;
		font-size: 30rpx;
		color: #373742;
		font-weight: 400;
	}

	.speed-right {
		text-align: left;
		display: block;
		font-size: 34rpx;
		/* height: 138rpx; */
		/* background-color: #9EE44D33; */
		padding: 0 32rpx;
		border-radius: 24rpx;
		color: #67677A;
		font-size: 30rpx;
		font-weight: 400;
		/* margin-top: 24rpx; */
		margin-bottom: 20rpx;
	}

	.speed-title {
		color: #373742;
	}

	.blood-container {
		height: 56rpx;
		/* padding: 20rpx 0; */
		display: flex;
		gap: 44rpx;
		/* flex-direction: column; */
		align-items: center;
	}

	.health-bar-container {
		width: 100%;
		height: 16rpx;
		/* margin-bottom: 10rpx; */
		position: relative;
		overflow: visible;
	}

	.health-bar-background {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 5px;
		position: relative;
		overflow: visible;
		z-index: 3;
	}

	.health-bar-foreground {
		/* margin-top: 2rpx; */
		height: 100%;
		border-radius: 5px;
		position: absolute;
		top: 0;
		left: 0;
		/* 添加只在上方显示阴影的代码 */
		overflow: visible;
		box-shadow: 0 -6px 6px -3px rgba(255, 255, 255, 0.3);
	}

	.health-bar-line {
		position: absolute;
		left: 50%;
		width: 2rpx;
		height: 10px;
		background-color: #ffffff;
		z-index: 3;
		/* 中间的白线 */
	}

	.improved-container {
		display: flex;
		position: relative;
		background: linear-gradient(359.63deg, #2F2F38 8.92%, #3A3A45 100.62%);
		width: 686rpx;
		height: auto;
		margin-top: 32rpx;
		border-radius: 32rpx;
	}

	.improved {
		width: 100%;
		padding: 16rpx;
	}

	.improved-title {
		height: 88rpx;
		font-size: 40rpx;
		font-weight: 600;
		color: #FFFFFF;
		margin-left: 16rpx;
	}

	.improved-content {
		width: 100%;
		/* height: 184px; */
		gap: 0px;
		border-radius: 24rpx;
		opacity: 0px;
		background: linear-gradient(90deg, #2C6E5F 0.52%, #50856E 99.36%);
	}

	.improved-content-item {
		padding: 60rpx 32rpx 60rpx 32rpx;
	}

	.improved-content-title {
		display: flex;
		align-items: center;
		gap: 12rpx;
		font-size: 30rpx;
		color: #FCDDB2;
		font-weight: 600;
	}

	.improved-show-icon {
		width: 40rpx;
		height: 32rpx;
	}

	.improved-content-description {
		font-size: 30rpx;
		font-weight: 400;
		color: #D7D8E0;
		margin-top: 18rpx;
	}

	.key-strength-title {
		height: 88rpx;
		display: flex;
		align-items: center;
		margin-top: 14rpx;
		font-weight: 600;
	}

	.key-strength-content {
		position: relative;
		background: #373742CC;
		border: 1px solid #67677A66;
		margin-bottom: 32rpx;
	}

	.key-strength-content-title {
		display: flex;
		align-items: center;
		color: #E8FFC4;
		gap: 12rpx;
	}

	.key-strength-nice {
		position: absolute;
		width: 184rpx;
		height: 184rpx;
		right: 16rpx;
		bottom: 0;
	}

	.guide-button-container {
		z-index: 1000;
		/* 确保按钮悬浮在其他内容之上 */
		position: fixed;
		/* 固定定位 */
		bottom: 0;
		transform: translateX(-50%);
		/* 调整水平位置以居中 */
		left: 50%;
		/* 水平居中 */
		width: 100%;
		height: 180rpx;
		background: #2F2F38;
		border-top: 1px solid #454552;
		padding-top: 24rpx;
	}

	.guide-button {
		width: 80%;
		height: 88rpx;
		background: linear-gradient(101.13deg, #EDFB8B 13.84%, #9EE44D 84.78%);
		color: #252529;
		font-size: 36rpx;
		border-radius: 50rpx;
		text-align: center;
		/* line-height: 100rpx; */
		display: flex;
		justify-content: center;
		align-items: center;
		/* margin-bottom: 30rpx; */
	}
</style>