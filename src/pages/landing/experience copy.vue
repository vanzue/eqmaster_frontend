<template>
	<view class="container">
		<!-- 背景图片 -->
		<image class="background-image" :src="backgroundImage" mode="widthFix"></image>
		<!-- <image class="illustration1" src="/static/img1.png" mode="widthFix"></image> -->

		<!-- 内容区域 -->
		<view class="content">
			<view class="text-content">
				<text class="greeting">嗨??</text>
			</view>
			<text class="question">很开心见到你！你叫什么名字？</text>
			<text class="question1">完善个人信息</text>

			<!-- 输入框 -->
			<input class="name-input" placeholder="请输入" :value="username" v-model="username" />

			<!-- 继续按钮 -->
			<view class="button-container">
				<image class="continue-button" src="/static/arrowright.png" mode="aspectFit" @tap="nextStep"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		v4 as uuidv4
	} from 'uuid';
	import {
		getImg
	} from '../../scripts/constants.js';
	export default {
		data() {
			return {
				username: '',
				getImg,
				backgroundImage: getImg('/static/web/picture1.webp'), // 确保背景图片路径正确
			};
		},
		mounted() {
			const randomNum = Math.floor(Math.random() * 10); // 生成1到10之间的随机数字
			this.username = "tester-" + uuidv4().slice(0, 6) + `##${randomNum}`;
		},
		methods: {
			nextStep() {
				if (this.username.trim()) {
					const userId = 'fixedUserId12345'; // 使用固定的用户ID
					// 保存用户名和ID
					uni.setStorageSync('username', this.username);
					uni.setStorageSync('userId', userId);
					// 导航到下一页，并传递参数
					uni.reLaunch({
						url: `/pages/preference/preference?userId=${userId}&username=${encodeURIComponent(this.username)}`
					});
				} else {
					// 提示用户输入名字
					uni.showToast({
						title: '请输入您的名字',
						icon: 'none'
					});
				}
			},
		},
	};
</script>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: #1c1c1e;
		/* 确保背景颜色覆盖整个页面 */
		position: relative;
		overflow: hidden;
		touch-action: none;
	}

	.background-image {
		position: absolute;
		top: 40px;
		right: 0px;
		width: 30%;
		height: 100vh;
		/* 确保背景图片覆盖整个视窗 */
		z-index: 1;
		/* 确保背景图片位于内容之下 */
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		/* 将内容区域向上对齐 */
		padding: 40rpx 20rpx;
		z-index: 1;
		/* 确保内容位于背景图片之上 */
		position: relative;
		padding: 20px;
		margin-left: 10rpx;
	}

	.text-content {

		/* 增加底部间距 */
		margin-top: 145rpx;
		/* 增加底部间距 */

	}

	.greeting {
		font-size: 38rpx;
		color: #ffffff;
		margin-bottom: 20rpx;
		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-weight: bold;
	}


	.question {
		font-size: 38rpx;
		color: #ffffff;
		margin-bottom: 10rpx;
		font-weight: bold;
		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
	}

	.question1 {
		font-size: 28rpx;
		color: #bcbcbc;
		margin-bottom: 190rpx;
		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
	}

	.subtitle {
		font-size: 28rpx;
		color: #8e8e93;
		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;

	}

	.name-input {
		width: 90%;
		background-color: #2c2c2e;
		border-radius: 20rpx;
		padding: 20rpx 30rpx;
		color: #ffffff;
		font-size: 32rpx;
		margin-top: 100rpx;
		margin-bottom: 150rpx;
	}

	.button-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: auto;
		margin-bottom: 1100rpx;
		/* 调整底部间距，避免过大的白色区域 */
	}

	.continue-button {
		width: 40rpx;
		height: 40rpx;
		background-color: #8BC34A;
		border-radius: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 30rpx;
	}

	.arrow {
		color: #242424;
		font-size: 50rpx;

	}
</style>