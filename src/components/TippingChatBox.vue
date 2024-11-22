<template>
	<view class="tip-container">
		<!-- <image class="tip-background" src="/static/battlefield/question-mark.png" mode="widthFix"></image> -->
		<view class="tip-content">
			<image class="tip-mark" src="/static/battlefield/tip-yellow-zh.svg"></image>
			<text class="tip-text">Tip: {{ tip }}</text>
		</view>
		<image class="tip-mark-yellow" :src="getImg('/static/web/battlefield/tips-icon-zh.webp') "></image>
	</view>
</template>

<script>
	import { getImg } from '../scripts/constants';
	export default {
		props: {
			tip: {
				type: String,
				required: true
			}
		},
		data() {
			return {
				getImg,
			};
		}
	};
</script>

<style>
	.tip-container {
		position: relative;
		/* width: 100%; */
		background-color: #FFFFFF;
		border-radius: 10px;
		padding: 40rpx 48rpx;
		box-sizing: border-box;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		margin-top: 48rpx;
	}

	.tip-background {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 40%;
		height: auto;
		opacity: 0.8;
	}
	
	.tip-mark{
		width: 48rpx;
		height: 48rpx;
		top: 10rpx;
		/* margin-left: 3px; */
		z-index: 2;
	}

	.tip-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: start;
		overflow: visible;
		width: 100%;
		gap: 16rpx;
	}

	.tip-text {
		width: fit-content;
		font-size: 15px;
		color: #333;
		line-height: 1.5;
	}
	.tip-mark-yellow {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 222rpx;
		height: 220rpx;
	}
</style>