<template>
	<view class="container">
		<image class="background-image" :src="backgroundImage" mode="widthFix"></image>

		<view class="content">
			<view class="text-content">
				<text class="greeting">{{$t('pages.landing.greeting')}}</text>
			</view>
			<text class="question">{{$t('pages.landing.question')}}</text>

			<input class="name-input" type="nickname" @blur="bindblur" :placeholder="$t('pages.landing.input_name')" v-model="username" />

			<view class="button-container">
				<image class="continue-button" src="/static/arrowright.png" mode="aspectFit" @tap="nextStep"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getImg
	} from '../../scripts/constants.js';
	export default {
		data() {
			return {
				username: '',
				backgroundImage: getImg('/static/picture1.png'),
				getImg,
			};
		},
		
		methods: {
			bindblur(e){
				this.userName = e.detail.value; // 获取微信昵称
			},
			nextStep() {
				if (this.username.trim()) {
					console.log("user input name:", this.username);
					this.$store.commit('setUsername', this.username);
					uni.setStorageSync('username', this.username);
					uni.reLaunch({
						url: `/pages/preference/preference3`
					});
				} else {
					uni.showToast({
						title: this.$t('pages.landing.input_name_reminder'),
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
		z-index: 1;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		padding: 40rpx 20rpx;
		z-index: 1;
		position: relative;
		padding: 20px;
		margin-left: 10rpx;
	}

	.text-content {
		margin-top: 145rpx;
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
		margin-top: 250rpx;
		margin-bottom: 150rpx;
	}

	.button-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: auto;
		margin-bottom: 1100rpx;
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