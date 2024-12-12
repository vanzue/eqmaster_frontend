<template>
	<view class="inner-container" :style="{'--theme-color-matching': themeColors.matching, '--theme-color-theme': themeColors.theme, '--theme-color-font-title': themeColors.popup_font_title }">
		<view class="bubble-container">
			<image class="avatar" :src="avatar" mode="aspectFill"></image>
			<view class="background-parent">
				<view class="character-background" :style="{backgroundColor: themeColors.theme}">
					<view class="character">{{ character }}</view>
					<image class="playing" src="/static/battlefield/playing.png"></image>
				</view>
				<view class="character-background-radius" :style="{backgroundColor: themeColors.theme}"></view>
				<!-- <image class="character-background" src="/static/battlefield/character_background1.png"></image> -->
			</view>
			<text class="wording">{{ wording }}</text>
		</view>
	</view>
</template>

<script>
import apiService from '../services/api-service'
	export default {
		props: {
			avatar: {
				type: String,
				required: true
			},
			character: {
				type: String,
				required: true
			},
			wording: {
				type: String,
				required: true
			},
		},
		data() {
			return {
				audioContextOut: null,
			}
		},
		computed: {
			themeColors() {
				return this.$store.getters.getThemeColors;
			},
		},
		async mounted() {
			const app = getApp();
			app.globalData.audioContextGloabal = uni.createInnerAudioContext();
			const audio = this.$store.getters.getAudios(`voice-${this.wording}`);
			if (audio) {
				app.globalData.audioContextGloabal.src = audio;
				app.globalData.audioContextGloabal.play();
			}
		},
		created() {
			
		},
		watch: {
			wording(newValue) {
				const audio = this.$store.getters.getAudios(`voice-${this.wording}`);
				const app = getApp();
				if (audio) {
					app.globalData.audioContextGloabal.src = audio;
					app.globalData.audioContextGloabal.play();
				}
			},
		},
		unmounted() {
			const app = getApp();
			console.log("unmounted");
			if (app.globalData.audioContextGloabal) {
				app.globalData.audioContextGloabal.pause();
				app.globalData.audioContextGloabal.destroy();
			}
		},
	}
</script>

<style scoped>
	.inner-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 12px;
		position: absolute;
		top: 40vh;
		z-index: 11;
	}

	.avatar {
		width: 654rpx;
		height: 628rpx;
		position: absolute;
		top: -631rpx;
		left: 48rpx;
	}

	.bubble-container {
		position: relative;
		bottom: 1vh;
		width: 90%;
		background-color: #23232a;
		border-radius: 10px;
		padding: 12px;
		color: #FFFFFF;
		max-width: 80%;
		/* border: solid 2px #F2BC74; */
		border: solid 2px var(--theme-color-theme);
		overflow: visible;
		z-index: 3;
	}

	/* .character-background {
		width: 200rpx;
		height: 48rpx;
		position: absolute;
		z-index: 2;
		left: 5%;
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
		width: 40rpx;
		height: 40rpx;
		right: 10rpx;
	}

	.background-parent {
		position: absolute;
		top: -48rpx;
		/* width: 200rpx; */
		height: 48rpx;
	}

	.character {
		color: #000;
		z-index: 3;
		position: absolute;
		left: 32rpx;
	}

	.wording {
		font-size: 16px;
		text-align: left;
		color: #FFFFFF;
		z-index: 3;
	}
</style>