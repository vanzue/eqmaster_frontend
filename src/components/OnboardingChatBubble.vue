<template>
	<!--<view class="bubble-container">-->
		<view class="text-box" @click="dismiss" :style="{'--theme-color-matching': themeColors.matching, '--theme-color-theme': themeColors.theme }">
			<view class="user-info" :class="isOddRequest ? 'odd-style' : 'even-style'">
				<image class="user-avatar" :src="avatar" mode="aspectFill" />
				<view class="character-name">
					<view :class="isOddRequest ? 'character-background-right' : 'character-background-left'">
						<view class="character">{{ userName }}</view>
					</view>
					<view :class="isOddRequest ? 'character-background-radius-right' : 'character-background-radius-left'"></view>
				</view>
				<!-- <view :class="isOddRequest ? 'user-name-right' : 'user-name-left'">
					<text class="user-name-text"
						:class="isOddRequest ? 'name-text-right' : 'name-text-left'">{{ userName }}</text>
					<image class="name-background"
						:src="isOddRequest ? '/static/rec-left.png' : '/static/rec-right.png'" mode="aspectFill" />
				</view> -->
			</view>
			<view class="text-content">{{ description }}</view>
			<view class="expand-icon" >
				<image class="icon-image" src="/static/icon3.png" mode="aspectFit" />
			</view>
		</view>
	<!--</view>-->
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
					return false;
				}
				return true;
			},
			themeColors() {
				return this.$store.getters.getThemeColors;
			},
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
		/* overflow: visible; */
		border: 6rpx solid #F2BC74;
	}

	.text-content {
		color: white;
		font-size: 28rpx;
		line-height: 1.4;
	}

	.user-avatar {
		width: 105rpx;
		height: 105rpx;
		border-radius: 60rpx;
		/* margin-left: 5%; */
		z-index: 3;
		border: solid 6rpx #F2BC74;
	}

	.character-name {
		position: relative;
		width: 176rpx;
		height: 23px;
		/* margin-left: 24rpx; */
	}
	.character-background-left {
		position: relative;
		width: 100%;
		height: 100%;
		background-color: #F2BC74;
		/* border-top-left-radius: 10px; */
		clip-path: polygon(90% 0, 100% 100%, 0 100%, 0 0);
		display: flex;
		justify-content: center;
		align-items: center;
		left: -24rpx;
	}
	.character-background-right {
		position: relative;
		width: 100%;
		height: 100%;
		background-color: #F2BC74;
		/* border-top-left-radius: 10px; */
		clip-path: polygon(100% 0, 100% 100%, 0 100%, 10% 0);
		display: flex;
		justify-content: center;
		align-items: center;
		left: 24rpx;
	}
	.character-background-radius-left {
		position: absolute;
		top: 0;
		right: 24rpx;
		width: 10px; /* 调整大小以匹配斜边 */
		height: 100%;
		background: #F2BC74;
		transform: skewX(20deg); /* 调整倾斜度以匹配斜边角度 */
		transform-origin: right top;
		border-radius: 0 6px 0 0; /* 设置圆角以匹配上面clip-path斜切角的弧度 */
	}
	.character-background-radius-right {
		position: absolute;
		top: 0;
		left: 24rpx;
		width: 10px; /* 调整大小以匹配斜边 */
		height: 100%;
		background: #F2BC74;
		transform: skewX(-20deg); /* 调整倾斜度以匹配斜边角度 */
		transform-origin: right top;
		border-radius: 6px 0 0 0; /* 设置圆角以匹配上面clip-path斜切角的弧度 */
	}
	.character {
		/* position: absolute; */
		/* right: 20px; */
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
		left: 20%;
		display: flex;
		flex-direction: row;
		z-index: 2;
	}

	.user-name-right {
		position: absolute;
		left: 48%;
		display: flex;
		flex-direction: row;
		z-index: 2;
	}

	.user-name-text {
		position: relative;
		color: #000;
		margin-top: 10rpx;
		font-size: 16px;
		width: 228rpx;
		text-align: center;
		z-index: 4;
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