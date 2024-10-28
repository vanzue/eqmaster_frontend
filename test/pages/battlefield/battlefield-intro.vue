<template>
	<view class="container">
		<view class="overlay"></view>
		<view class="navbar">
			<image class="back-button" src="/static/battlefield/back-iconpng.png" @tap="goToDashboard"></image>
			<view class="progress-bar">
				<progress-bar :isActive="true"></progress-bar>
				<progress-bar :isActive="false"></progress-bar>
			</view>
		</view>

		<!-- Content -->
		<view class="content">
			<text class="title content-item">UNIT 1</text>
			<text class="subtitle content-item">Managing Tensions in a Meeting</text>
			<text class="time-info content-item">3-4min</text>
			<view class="description content-item">
				<text class="npc-name">
					<image :src="npcs[0].avatar" class="npc-avatar"></image> Jason
				</text>
				&nbsp;joins your team meeting, frustrated by the lack of feedback on his project. Tension rises as
				<text class="npc-name">
					<image :src="npcs[1].avatar" class="npc-avatar"></image> Sam
				</text>
				&nbsp;feels uneasy, and
				<text class="npc-name">
					<image :src="npcs[2].avatar" class="npc-avatar"></image> Anna
				</text>
				&nbsp;stays calm. How will you respond to ease the situation?
			</view>
		</view>
		<view class="continue-button-container">
			<button class="continue-btn" @click="navigateToNextPage">Continue</button>
		</view>
	</view>
</template>

<script>
	import ProgressBar from '/components/ProgressBar.vue'; // 引入组件
	export default {
		components: {
			ProgressBar, // 注册组件
		},
		data() {
			return {};
		},
		computed: {
			npcs() {
				return this.$store.getters.getNpcs;
			},
		},
		methods: {
			navigateToNextPage() {
				uni.navigateTo({
					url: '/pages/battlefield/battlefield-task' // Replace this with the actual path to your next page
				});
			},
			goToDashboard() {
				uni.navigateTo({
					url: "/pages/dashboard/dashboard_en",
				});
			},
		}
	}
</script>

<style scoped>
	@import "./common.css";

	.navbar {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 20rpx;
		position: relative;
		z-index: 3;
		margin-top: 5vh;
		margin-left: 20rpx;
		/* 确保导航栏在叠加层之上 */
	}

	.back-button {
		width: 24px;
		height: 24px;
	}

	.progress-bar {
		flex: 1;
		width: 100%;
		height: 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
	}

	.content {
		padding: 40rpx;
		text-align: center;
		z-index: 3;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 160rpx;
		/* 确保页面内容在叠加层之上 */
	}

	.title {
		font-size: 24px;
		font-weight: 700;
		color: #fff;
		/* 具体设置白色 */
	}

	.subtitle {
		font-size: 34px;
		font-weight: 700;
		margin: 10px 0;
		color: #fff;
		/* 具体设置白色 */
	}

	.time-info {
		font-size: 16px;
		color: #bbb;
		margin-bottom: 20px;
	}

	.description {
		font-size: 17px;
		font-weight: 350;
		align-items: center;
		line-height: 48rpx;
		color: #fff;
		/* 具体设置白色 */
	}

	.content-item {
		/* margin-top: 30rpx; */
		line-height: 48rpx;
	}

	.npc-name {
		width: max-content;
		height: 52rpx;
		background-color: #2D6985;
		font-size: 34rpx;
		font-weight: 400;
		white-space: nowrap;
		/* 强制不换行 */
		padding: 4rpx 12rpx;
		line-height: 52rpx;
		/* 上下居中 */
		position: relative;
		border-radius: 26rpx;
	}

	.npc-avatar {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background-color: #fff;
		margin-top: 10px;
		position: relative;
		top: 8rpx;
		/* position: absolute;
		top: 50%;
		transform: translateY(-50%); */
	}

	.description-text {}
</style>