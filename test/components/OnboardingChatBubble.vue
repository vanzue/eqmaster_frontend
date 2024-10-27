<template>
	<view class="bubble-container">
		<view class="text-box">
			<view class="user-info" :class="isOddRequest ? 'odd-style' : 'even-style'">
				<image class="user-avatar" :src="avatar" mode="aspectFill" />
				<view :class="isOddRequest ? 'user-name-right' : 'user-name-left'">
					<text class="user-name-text"
						:class="isOddRequest ? 'name-text-right' : 'name-text-left'">{{ userName }}</text>
					<image class="name-background"
						:src="isOddRequest ? '/static/rec-left.png' : '/static/rec-right.png'" mode="aspectFill" />
				</view>

			</view>
			<view class="text-content" @tap="dismiss">{{ description }}</view>
			<view class="expand-icon">
				<image class="icon-image" src="/static/icon3.png" mode="aspectFit" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			userName: {
				type: String,
				required: true,
			},
			avatar: {
				type: String,
				required: true,
			},
			dismiss: {
				type: Function,
				required: true,
			},
			description: {
				type: String,
				default: "这里是描述信息",
			},
			requestCount: {
				type: Number,
				required: true
			}
		},
		computed: {
			isOddRequest() {
				if (this.requestCount % 2 === 0) {
					console.log("It's an even request!!!!")
					return false;
				}
				return true;
			}
		}
	};
</script>

<style>
	@import url("../pages/test/common.css");

	.bubble-container {
		position: absolute;
		bottom: 80rpx;
		left: 40rpx;
		right: 40rpx;
		padding-top: 50rpx;
		padding-bottom: 50rpx;
		padding-left: 50rpx;
		padding-right: 50rpx;
		overflow: visible;
	}

	.text-box {
		position: absolute;
		bottom: 60rpx;
		left: 40rpx;
		right: 40rpx;
		background-color: rgba(55, 55, 66, 0.8);
		border-radius: 50rpx;
		padding-top: 50rpx;
		padding-bottom: 50rpx;
		padding-left: 50rpx;
		padding-right: 50rpx;
		z-index: 1;
		overflow: visible;
		border: 6rpx solid #f2bc74;
	}

	.text-content {
		color: white;
		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-size: 28rpx;
		line-height: 1.4;
	}

	.user-avatar {
		width: 105rpx;
		height: 105rpx;
		border-radius: 60rpx;
		margin-left: 5%;
		z-index: 3;
		border: solid 6rpx #f2bc74;
	}

	.name-background {
		width: 200rpx;
		height: 50rpx;
		position: relative;
		left: -50%;
		z-index: -1;
	}

	.user-name-left {
		position: absolute;
		left: 30%;
		display: flex;
		flex-direction: row;
		z-index: 2;
	}

	.user-name-right {
		position: absolute;
		left: 65%;
		display: flex;
		flex-direction: row;
		z-index: 2;
	}

	.user-name-text {
		position: relative;
		color: #000;
		margin-top: 10rpx;
		font-size: 16px;
		z-index: 4;
	}

	.name-text-right {
		right: 10rpx;
	}

	.name-text-left {
		left: 10rpx;
	}

	.user-info {
		position: absolute;
		top: -85rpx;
		width: 100%;
		display: flex;
		align-items: center;
	}

	.even-style {
		left: 15rpx;
		flex-direction: row;
	}

	.odd-style {
		right: 15rpx;
		flex-direction: row-reverse;
	}
</style>