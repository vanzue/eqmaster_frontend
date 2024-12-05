<template>
	<view class="bubble-container">
		<text class="txt">{{ wording }}</text>
		<view class="commit-container" v-if="commit !== '' && isLastElement">
			<image class="commit-icon" src="/static/battlefield/commit_warning-fill.png"></image>
			<text class="commit">{{ commit }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			wording: {
				type: String,
				required: true
			},
			commit: {
				type: String,
				required: false,
				default: '',
			},
			isLastElement: {
				type: Boolean,
				default: false,
			}
		}
	}
</script>

<style scoped>
	.bubble-container {
		background-color: #d6fcf6;
		border-radius: 10px;
		padding: 12px;
		margin-top: 48rpx;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
		line-height: 1.5;
	}

	.txt {
		margin: 5rpx 5rpx;
		font-size: 15px;
		font-weight: normal;
		color: #000;
	}

	.commit-container {
		display: flex;
		margin-top: 16rpx;
	}

	.commit-icon {
		width: 40rpx;
		height: 40rpx;
		margin-right: 10rpx;
	}

	.commit {
		flex: 1;
		font-size: 13px;
		color: #872E13;
		word-wrap: break-word;
	}
</style>