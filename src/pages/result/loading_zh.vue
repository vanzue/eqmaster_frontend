<template>
	<view class="container" @touchmove.prevent>
		<view class="splash-screen">
			<text class="splash-text">{{ $t('pages.result.loading.splash') }}</text>
			<view class="image-container">
				<image class="splash-image" :src="getImg('/static/web/cta-new.webp')" mode="widthFix"
					:style="{ left: splashImageLeft1 + 'rpx' }"></image>
				<image class="splash-image":src="getImg('/static/web/cta-new.webp')" mode="widthFix"
					:style="{ left: splashImageLeft2 + 'rpx' }"></image>
			</view>
			<view class="progress-container">
				<text class="splash-progress-text">{{ progress }}%</text>
				<view class="splash-progress-bar">
					<view class="splash-progress-fill" :style="{ width: progress + '%' }"></view>
				</view>
				<text class="status-text">{{ $t('pages.result.loading.status') }}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import apiService from '../../services/api-service';
import {
		getImg
	} from '../../scripts/constants.js';
	export default {
		data() {
			return {
				getImg,
				score: 28, // 示例分数，可根据需要动态更改
				maxScore: 100, // 假设最大分数为100
				userId: '',
				username: '',
				gender: '',
				birthday: null,
				selectedOptions: [],
				jobId: null,
				num: null,
				courseData: null,
				homepageData: {
					response: {
						personal_info: {
							name: '',
							tag: '',
							tag_description: '',
							job_id: ''
						},
						eq_scores: {
							score: 0,
							dimension1_score: 0,
							dimension1_detail: '',
							dimension2_score: 0,
							dimension2_detail: '',
							dimension3_score: 0,
							dimension3_detail: '',
							dimension4_score: 0,
							dimension4_detail: '',
							dimension5_score: 0,
							dimension5_detail: '',
							summary: '',
							detail: '',
							overall_suggestion: '',
							detail_summary: ''
						},
						contacts: []
					}
				},
				intervalId: null,
				progress: 0,
				progressInterval: null,
				// 新增的闪屏相关数据
				splashImageLeft1: 0,
				splashImageLeft2: 2030,
				imageWidth: 2000,
				interval: null,
				isExpanded: false, // 默认收起状态
				timeoutInterval: null,
				disableSwipe: true, // 添加这个属性来禁止左滑
			};
		},
		computed: {
			formattedBirthday() {
				if (this.birthday) {
					const date = new Date(this.birthday.year, this.birthday.month - 1, this.birthday.day);
					return date.toLocaleDateString();
				}
				return '未设置';
			}
		},
		// created() {
		// 	this.getHomepageData();
		// },
		onLoad(option) {
			this.getHomepageData();
			// 禁止左滑
			this.setSwipeBackDisabled();
		},
		onUnload() {
			if (this.intervalId) {
				clearInterval(this.intervalId);
			}
			if (this.progressInterval) {
				clearInterval(this.progressInterval);
			}
			if (this.interval) {
				clearInterval(this.interval);
			}
			uni.offTouchMove();
		},
		methods: {
			progressWidth(value) {
				// 计算进度条宽度百分比
				const percentage = (value / this.maxScore) * 100;
				return `${percentage}%`;
			},
			circleLeftPosition(value) {
				// 获取进度条实际宽度
				const percentage1 = (value / this.maxScore) * 100;
				const progressBarWidth = uni.getSystemInfoSync().windowWidth * 0.8; // 80%的屏幕宽度作为进度条的实际宽度
				console.log(percentage1)
				return (percentage1 / 100) * progressBarWidth;
			},
			getHomepageData() {
				const maxAttempts = 100; // Maximum number of retry attempts
				let attempts = 0;

				const fetchData = () => {
					this.$store.dispatch('fetchHomepageData')
						.then(() => {
							const homepageData = this.$store.state.homepageData;
							if (!homepageData || !homepageData?.response?.eq_scores) {
								attempts++;
								if (attempts < maxAttempts) {
									console.error('Homepage data is empty, retrying...');
									setTimeout(fetchData, 3000); // Retry after 3 seconds
								} else {
									uni.showToast({
										title: 'Failed to load data',
										icon: 'none'
									});
								}
							} else {
								console.log('Homepage data fetched successfully');
								this.clearAllIntervals();
								// Proceed to the next page
								const nextPageUrl = `/pages/result/result_zh`;
								uni.redirectTo({
									url: nextPageUrl,
									success: () => console.log('Navigation initiated successfully'),
									fail: (err) => console.error('Navigation failed:', err)
								});
							}
						})
						.catch((error) => {
							console.error('Error fetching homepage data:', error);
							attempts++;
							if (attempts < maxAttempts) {
								setTimeout(fetchData, 3000); // Retry after 3 seconds
							} else {
								uni.showToast({
									title: 'Failed to load data',
									icon: 'none'
								});
							}
						});
				};

				fetchData();
			},
			// getcourseData() {
			// 	const maxAttempts = 10;
			// 	let attempts = 0;

			// 	const fetchData = () => {
			// 		this.$store.dispatch('fetchcourseData')
			// 			.then(() => {
			// 				console.log('Course data fetched successfully');
			// 				this.clearAllIntervals();

			// 				const nextPageUrl = `/pages/result/result_en`;
			// 				uni.redirectTo({
			// 					url: nextPageUrl,
			// 					success: () => console.log('Navigation initiated successfully'),
			// 					fail: (err) => console.error('Navigation failed:', err)
			// 				});
			// 			})
			// 			.catch((error) => {
			// 				console.error('Error fetching course data:', error);
			// 				attempts++;
			// 				if (attempts < maxAttempts) {
			// 					setTimeout(fetchData, 3000);
			// 				} else {
			// 					uni.showToast({
			// 						title: 'Failed to load course data',
			// 						icon: 'none'
			// 					});
			// 				}
			// 			});
			// 	};

			// 	fetchData();
			// },

			startProgress() {
				const totalDuration = 30000; // 30秒
				const intervalDuration = totalDuration / 100; // 每次更新的间隔时间

				this.progressInterval = setInterval(() => {
					if (this.progress < 100) {
						this.progress += 1;
					} else {
						clearInterval(this.progressInterval);
					}
				}, intervalDuration);
			},
			animateImage() {
				
			},
			expand() {
				this.isExpanded = true; // 只展开，不再收起
			},
			// 添加新方法来设置禁止左滑
			setSwipeBackDisabled() {
				// 禁止左滑返回
				if (uni.setSwipeBackMode) {
					uni.setSwipeBackMode({
						mode: 'none',
						success: () => {
							console.log('禁止左滑返回成功');
						},
						fail: (err) => {
							console.error('禁止左滑返回失败:', err);
						}
					});
				} else {
					console.warn('当前环境不支持 setSwipeBackMode 方法');
				}

				// 禁止全局的滑动事件
				uni.onTouchMove((event) => {
					event.preventDefault();
				}, {
					passive: false
				});
			},
			clearAllIntervals() {
				if (this.interval) {
					clearInterval(this.interval);
					this.interval = null;
				}
				if (this.progressInterval) {
					clearInterval(this.progressInterval);
					this.progressInterval = null;
				}
				if (this.timeoutInterval) {
					clearInterval(this.timeoutInterval);
					this.timeoutInterval = null;
				}
			},
		},
		mounted() {
			this.startProgress(); // 开始进度条
			this.animateImage(); // 开始图片动画

			// 在设定的持续时间后隐藏闪屏（例如，30秒）
			this.timeoutInterval = setTimeout(() => {
				if (this.interval) {
					console.log("cancel splash by timeout.")
					clearInterval(this.interval);
				}
			}, 30000);
		},
		beforeDestroy() {
			// 页面销毁前清除定时器
			if (this.intervalId) {
				clearInterval(this.intervalId);
				this.intervalId = null;
			}
			if (this.progressInterval) {
				clearInterval(this.progressInterval);
				this.progressInterval = null;
			}
			if (this.interval) {
				clearInterval(this.interval);
				this.interval = null;
			}
		},
	}
</script>

<style scoped>
	.container {
		position: relative;
		background-color: #2F2F38;
		flex-direction: column;
		align-items: center;
		padding-top: 100rpx;
		width: 100%;
		height: 100vh;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		/* 添加以下样式来禁止触摸滑动 */
		touch-action: none;
	}

	.header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		z-index: 6;
		width: 90%;
		margin-top: 0.5vh;
	}

	.header-icon {
		width: 50rpx;
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* Splash screen styles */
	.splash-screen {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #000000;
		/* 黑色背景 */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		/* 确保splash screen在最上层 */
	}

	.splash-text {
		color: #FFFFFF;
		font-size: 44rpx;
		text-align: left;
		top: 20%;
		position: absolute;
		margin-bottom: 20rpx;
		text-align: center;
		/* 添加文本和图像之间的空间 */
		line-height: 60rpx;
		/* 调整高以提高可读性 */
		white-space: pre-wrap;
		/* 确保文本正确换行 */
		font-weight: 600;
	}

	.progress-container {
		position: absolute;
		top: 70vh;
		width: 70%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.splash-progress-text {
		font-size: 40rpx;
		color: #9EE44D;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.splash-progress-bar {
		width: 100%;
		height: 20rpx;
		background-color: #3d3d3d;
		border-radius: 15rpx;
		overflow: hidden;
		margin-bottom: 20rpx;
	}

	.splash-progress-fill {
		height: 100%;
		background-color: #9EE44D;
		border-radius: 15rpx;
	}
	.image-container {
	position: relative;
	width: 100%;
	height: 200px; /* 根据需要调整高度 */
	overflow: hidden;
	}
	.splash-image {
		width: 2000rpx;
		/* 放大图片的宽度 */
		height: auto;
		/* 保持纵横比 */
		margin-top: 20rpx;
		/* 在图像上方添加一些空间 */
		position: absolute;
		/* 绝对定位以便移动 */
		animation: slide 5s linear infinite;
	}
	.splash-image:nth-child(2) {
		left: 2000rpx; /* 根据需要调整宽度 */
	}
	

	@keyframes slide {
		0% {
			transform: translateX(-200rpx);
		}
		10%, 20% {
			transform: translateX(-630rpx); /* 第二张图片 */
		}
		30%, 40% {
			transform: translateX(-1035rpx); /* 第三张图片 */
		}
		50%, 60% {
			transform: translateX(-1435rpx); /* 第四张图片 */
		}
		70%, 80% {
			transform: translateX(-1830rpx); /* 第五张图片 */
		}
		90%, 100% {
			transform: translateX(-2250rpx); /* 图片完全移出视图 */
		}
	}

	.status-text {
		position: relative;
		font-size: 34rpx;
		font-weight: 350;
		color: #9EE44D;
	}
</style>