<template>
	<view class="inner-container">
		<view class="bubble-container">
			<image class="avatar" :src="avatar" mode="aspectFill"></image>
			<view class="background-parent">
				<image class="character-background" src="/static/battlefield/character_background1.png">
				</image>
				<view class="character">{{ character }}</view>
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
				audioContext: null,
			}
		},
		async mounted() {
			this.audioContext = uni.createInnerAudioContext();
			uni.getStorage({
				key: `voice-${this.wording}`,
				success: (res) => {
					this.audioContext.src = res.data;
					this.audioContext.play();
					
				},
				fail: (error) => {
					console.log(`fail to get ${this.character} voice`, error);
				}
			})
		},
		created() {
			console.log("create large bubble");
		},
		watch: {
			wording(newValue) {
				if (this.audioContext) {
					this.audioContext.pause();
					this.audioContext.currentTime = 0;
				}
				uni.getStorage({
					key: `voice-${this.wording}`,
					success: (res) => {
						this.audioContext.src = res.data;
						this.audioContext.play();
					},
					fail: (error) => {
						console.log(`fail to get ${this.wording} audio`, error)
					}
				})
			},
		},
		unmounted() {
			console.log("unmounted");
			if (this.audioContext) {
				this.audioContext.pause();
				this.audioContext.destroy();
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
		position: absolute;
		bottom: 1vh;
		width: 90%;
		background-color: #23232a;
		border-radius: 10px;
		padding: 12px;
		color: #FFFFFF;
		max-width: 80%;
		border: solid 2px #90E0E7;
		overflow: visible;
		z-index: 3;
	}

	.character-background {
		width: 200rpx;
		height: 48rpx;
		position: absolute;
		z-index: 2;
		left: 5%;
	}

	.background-parent {
		position: absolute;
		top: -48rpx;
		width: 200rpx;
	}

	.character {
		color: #000;
		z-index: 3;
		position: absolute;
		left: 20%;
	}

	.wording {
		font-size: 16px;
		text-align: left;
		color: #FFFFFF;
		z-index: 3;
	}
</style>