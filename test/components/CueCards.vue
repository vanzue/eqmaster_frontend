<template>
	<view class="popup-content" @click.stop>
		<view class="card-box">
			<view class="card-header">
				<view class="title">
					Choose your advice card
					<image class="card-close-image" src="/static/battlefield/material-symbols_close.png" mode=""
						@click="setShowCardPopup"></image>
				</view>
				<view class="jewelry">
					<image class="jewelry-image" src="/static/battlefield/jewelry.png" mode=""></image>
					<view class="jewelry-num">
						{{ homepageData?.response?.personal_info?.num_diamond || 100 }}
					</view>
				</view>
			</view>
			<view class="card-center" @click.stop>
				<view class="box" :class="{ 'card-selected': selectedCard === 1 }" @click="selectedCard = 1">
					<view class="top">
						<text>Best Answer</text>
						<view class="top-content">
							Refine your answer for smoother conversations.
						</view>
					</view>
					<view class="jewelry">
						<image class="jewelry-image" src="/static/battlefield/jewelry.png" mode="widthFix"></image>
						<view class="jewelry-num-dark">
							60
						</view>
					</view>
				</view>
				<view class="box" :class="{ 'card-selected': selectedCard === 2 }" @click="selectedCard = 2">
					<view class="top">
						<text>Get Hint</text>
						<view class="top-content">
							Reveal helpful clues to guide your next move.
						</view>
					</view>
					<view class="jewelry">
						<image class="jewelry-image" src="/static/battlefield/jewelry.png" mode="widthFix"></image>
						<view class="jewelry-num-dark">
							20
						</view>
					</view>
				</view>
			</view>
			<view class="card-button">
				<button :disabled="!selectedCard || cardButtonLoading || !eqScoresNum"
					@click="exchangeClick">Confirm</button>
			</view>
		</view>
	</view>
</template>

<script>
	import apiService from '../services/api-service';
	export default {
		props: {
			showCardPopup: {
				type: Boolean,
				default: false
			},
			cardButtonLoading: {
				type: Boolean,
				default: false
			},
		},
		data() {
			return {
				selectedCard: 0,
				loading: false,
				isLoading: true,
				error: null,
				homepageData: {
					response: {
						personal_info: {
							name: ''
						},
						eq_scores: {
							score: 0,
							overall_suggestion: ''
						},
						contacts: []
					}
				},
			};
		},
		onLoad(option) {
			console.log(option);
		},
		computed: {
			userId() {
				return this.$store.getters.getUserId;
			},
			eqScoresNum() {
				if (Math.round(this.homepageData?.response?.eq_scores?.score || 0) <= 0) {
					return false;
				}
				return true;
			}
		},
		methods: {
			setShowCardPopup() {
				this.$emit('closeCueCard');
			},
			exchangeClick() {
				this.$emit('exchangeClick', this.selectedCard);
			},
			async getHomepageData() {
				try {
					this.isLoading = true;
					this.error = null;
					console.log('Fetching homepage data with userId:', this.userId);

					const data = await apiService.getHomepageData(this.userId);
					this.homepageData = data;
					console.log('Homepage data received:', this.homepageData);

				} catch (error) {
					this.error = 'Error fetching homepage data';
					console.error(this.error, error);
				} finally {
					this.isLoading = false;
				}
			},
		},
		created() {
			this.getHomepageData();
		},
	}
</script>

<style scoped>
	.popup-content {
		width: 580rpx;
		/* Set the width to 90% */
		/* height: 810rpx; */
		background-color: #D6FCF6;
		border-radius: 32rpx;
		padding: 56rpx 32rpx;
		display: flex;
		/* justify-content: center; */
		align-items: left;
		flex-direction: column;
	}

	.card-box {}

	.card-header {
		display: block;
	}

	.title {
		width: 100%;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 40rpx;
		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-weight: 600;
		color: #2D6985;
	}

	.card-close-image {
		position: absolute;
		right: 0;
		width: 48rpx;
		height: 48rpx;
	}

	.jewelry {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 32rpx;
		gap: 16rpx;
	}

	.jewelry-image {
		width: 56rpx;
		height: 56rpx;
	}



	.card-center {
		margin-top: 24rpx;
		display: flex;
		gap: 24rpx;
	}

	.box {
		display: block;
		justify-content: center;
		color: #252529;
		width: 282rpx;
		/* height: 354rpx; */
		padding: 40rpx 24rpx;
		gap: 40rpx;
		border-radius: 32rpx;
		background: #FFFFFF;
		box-shadow: 0 0 24rpx 0 #90E0E7;
	}

	.top {
		display: block;
		height: 176rpx;
		text-align: center;
	}

	text {
		font-size: 34rpx;
		font-weight: 600;
		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
		color: #252529;
	}

	.top-content {
		font-size: 24rpx;
		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-weight: 400;
		margin-top: 24rpx;
		text-align: left;
		line-height: 32rpx;
		color: #67677A;
	}

	.jewelry {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 40rpx;
		gap: 16rpx;
	}

	.jewelry-image {
		width: 56rpx;
		height: 56rpx;
	}

	.jewelry-num {
		color: #90E0E7;
		font-size: 40rpx;
		font-weight: 800;
		text-align: left;
		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
	}

	.jewelry-num-dark {
		color: #2D6985;
		font-size: 40rpx;
		font-weight: 900;
		text-align: left;
		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
	}

	.card-selected {
		border: 3px solid #90E0E7;
	}

	.card-button {
		display: flex;
		width: 100%;
		margin-top: 64rpx;
	}

	button {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #90E0E7 !important;
		border-radius: 400rpx;
		font-size: 30rpx;
		font-weight: 600;
		color: #252529 !important;

		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;

	}

	button[disabled] {
		opacity: 50%;
	}
</style>