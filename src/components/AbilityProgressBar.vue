<template>
	<view :class="['progress-container', isWeChatMiniProgram ? 'progress-container-wechat' : '']">
	  <!-- 第一段进度条 -->
	  <view class="progress-segment" :class="{ 'first-segment': true }" :style="getSegmentStyle(segment1Width, 0)"></view>
	  <!-- 间隙 -->
	  <view class="progress-gap"></view>
	  <!-- 第二段进度条 -->
	  <view class="progress-segment" :style="getSegmentStyle(segment2Width, segment1Width)"></view>
	  <!-- 间隙 -->
	  <view class="progress-gap"></view>
	  <!-- 第三段进度条 -->
	  <view class="progress-segment" :class="{ 'last-segment': true }" :style="getSegmentStyle(segment3Width, segment1Width + segment2Width)"></view>
  
	  <!-- 更新指示器为图片 -->
	  <view class="progress-indicator" :style="getIndicatorStyle">
	    <image class="indicator-icon" :src="getIndicatorIcon" mode="aspectFit" />
	  </view>
	</view>
</template>

<script>
import { getImg } from '../scripts/constants';
export default {
	props: {
		segment1Width: {
			type: Number,
			default: 33
		},
			segment2Width: {
			type: Number,
			default: 34
		},
		segment3Width: {
			type: Number,
			default: 33
		},
		currentProgress: {
			type: Number, // 当前的进度百分比，例如 50 表示 50%
			default: 10
		},
		indicatorIcon: {
			type: String,
			default: '@/static/capybara1.png'
		},
		animal: {
			type: String,
			default: 'capybara1'
		},
		activeColor: {
			type: String,
			default: '#FFD700'
		}
	},
	data() {
		return {
			getImg,
			}
		},
	computed: {
		totalWidth() {
			return this.segment1Width + this.segment2Width + this.segment3Width;
		},
		getIndicatorStyle() {
			const positionPercentage = (this.currentProgress / 100) * this.totalWidth;
			return {
				left: `calc(${positionPercentage}% - 100rpx)` // 10px 是圆形半径
			};
		},
		getIndicatorIcon() {
			return getImg(`/static/web/${this.animal}_progress.webp`);
		},
		isWeChatMiniProgram() {
			const systemInfo = uni.getSystemInfoSync();
			return systemInfo.uniPlatform === 'mp-weixin';
		},
	},
	methods: {
		getSegmentStyle(width, startPosition) {
			const segmentStart = startPosition;
			const segmentEnd = startPosition + width;
			const progressWidth = (this.currentProgress / 100) * this.totalWidth;
			
			let activeWidth = 0;
			if (progressWidth > segmentStart) {
				activeWidth = Math.min(progressWidth - segmentStart, width);
			}
			
			const activePercentage = (activeWidth / width) * 100;
			console.log(activePercentage);
			return {
				width: `${width}%`,
				background: `linear-gradient(to right, ${this.activeColor} ${activePercentage}%, rgba(255, 255, 255, 0.3) ${activePercentage}%)`
			};
		}
	}
};
</script>

<style>
.progress-container {
	position: absolute;
	display: flex;
	width: 90%;
	left: 5%;
	height: 22px; /* 增加高度以适应边框 */
	background-color: transparent;
	justify-content: space-between;
	align-items: center;
	
	border-radius: 12px; /* 增加边框的圆角 */
	overflow: visible; /* 改为 visible 以允许指示器超出容器 */
	box-sizing: border-box; /* 确保边框包含在总宽度内 */
	margin-top: 70rpx; /* 保留之前添加的向下移动 */
}
.progress-container-wechat {
	margin-top: 60rpx; /* 保留之前添加的向下移动 */
}

.progress-segment {
	height: 80%;
	overflow: hidden; /* 确保渐变不会超出圆角边界 */
	/* border: 2px solid rgba(255, 255, 255, 0.3); */
}

.first-segment {
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;

}

.last-segment {
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;

}

.progress-gap {
	width: 5px; /* 每个段之间的间隙 */
	background-color: transparent;
}

.progress-indicator {
	position: absolute;
	top: -54px; /* 调整为原来的两倍 */
	width: 48px; /* 调整为原来的两倍 */
	height: 48px; /* 调整为原来的两倍 */
	z-index: 1;
}

.indicator-icon {
	width: 200rpx; /* 调整为原来的两倍 */
	height: 200rpx; /* 调整为原来的两倍 */
}
</style>
