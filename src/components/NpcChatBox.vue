<template>
	<view class="bubble-container">
		<view class="background-parent">
			<view class="user-info">
				<view class="avatar-background">
					<image class="avatar" :src="avatar" mode="aspectFill"></image>
				</view>
				<view class="name">
					<!-- <image class="character-background"
						:src="playAudioIndex === index ? '/static/battlefield/character_background1.png' : '/static/battlefield/character_background2.png'"
						mode="scaleToFill" @click="playAudio()"></image> -->
					<!-- <view class="character">{{ name }}</view> -->
					<view class="character-background" :style="{backgroundColor: themeColors.theme}">
						<view class="character">{{ name }}</view>
						<image class="playing" src="/static/battlefield/playing.png"></image>
					</view>
					<view class="character-background-radius" :style="{backgroundColor: themeColors.theme}"></view>
				</view>
			</view>
		</view>
		<text class="txt">{{ dialog }}</text>
	</view>
</template>


<script>
	export default {
		props: {
			avatar: {
				type: String,
				required: true
			},
			name: {
				type: String,
				required: true
			},
			dialog: {
				type: String,
				required: true
			},
			isLastElement: {
				type: Boolean,
				default: false,
			},
			playAudioIndex: {
				type: Number,
				default: -1,
			},
			index: {
				type: Number,
				default: 0,
			}
		},
		computed: {
			themeColors() {
				return this.$store.getters.getThemeColors;
			},
		},
		methods: {
			playAudio() {
				if (this.playAudioIndex == -1) {
					this.$emit('playAudio', {
						dialog: this.dialog,
						index: this.index
					});
				}
			}
		},
	};
</script>


<style scoped>
	.bubble-container {
		background-color: #2F2F38;
		border-radius: 32rpx;
		padding: 50rpx 42rpx 36rpx 42rpx;
		margin-top: 100rpx;
		/* width: 100%; */
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
		/* border: 2px solid #F2BC74; */
		/* line-height: 1.5; */
		position: relative;
	}

	.background-parent {
		position: absolute;
		top: -43rpx;
		width: 91px;
		left: 60rpx;
		/*Use height to cut the image*/
		height: 24px;
		overflow: visible;
		display: flex;
		flex-direction: row;
	}

	/* .character-background {
		width: 200rpx;
		height: 50rpx;
		position: absolute;
		left: 10%;
	} */

	.character-background {
		width: 91px;
		height: 100%;
		background-color: #90e0e7;
		border-top-left-radius: 10px;
		clip-path: polygon(90% 0, 100% 100%, 0 100%, 0 0);
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.character-background-radius {
		position: absolute;
		top: 0;
		right: 0;
		width: 10px; /* 调整大小以匹配斜边 */
		height: 100%;
		background: #90e0e7;
		transform: skewX(20deg); /* 调整倾斜度以匹配斜边角度 */
		transform-origin: right top;
		border-radius: 0 6px 0 0; /* 设置圆角以匹配上面clip-path斜切角的弧度 */
	}
	.playing {
		position: absolute;
		width: 14px;
		height: 10px;
		left: 130rpx;
	}

	.character {
		color: #000;
		left: 15%;
		position: absolute;
	}

	.avatar-background {
		position: absolute;
		top: -30rpx;
		width: 90rpx;
		height: 90rpx;
		border-radius: 50%;
		overflow: hidden;
		border: solid;
		border-color: #90e0e7;
		/* border: 3px solid #F2BC74; */
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 4;
	}

	.avatar {
		width: 100%;
		height: 100%;
	}

	.txt {
		text-align: left;
		font-size: 30rpx;
		color: #D7D8E0;
		line-height: 40rpx;
	}

	.name {
		position: absolute;
		left: 80rpx;
		height: 25px;
		width: 100%;
		top: -1px;
		z-index: -1;
	}
</style>