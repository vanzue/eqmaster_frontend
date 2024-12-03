<template>
	<view class="container">
		<view class="overlay"></view>
		<view class="navbar" :style="{ height: navBarHeight + 'px' }">
			<image class="back-button" src="/static/battlefield/back-iconpng.png" @tap="goToDashboard" :style="{marginTop: navBarTop + 'px'}"></image>
			<view class="progress-bar" :style="{marginTop: navBarTop + 'px'}">
				<progress-bar :isActive="true" class="progress-bar-item"></progress-bar>
				<progress-bar :isActive="false" class="progress-bar-item"></progress-bar>
			</view>
			<view class="wetchat-menu" :style="{marginTop: navBarTop + 'px'}"></view>
		</view>

		<!-- Content -->
		<view class="content">
			<text class="title content-item">Unit {{ this.courseInfo.course_data.course_level }} </text>
			<text class="subtitle content-item">{{ this.courseInfo.course_data.title }}</text>
			<text class="time-info content-item">{{ $t('pages.battlefield.intro.unit1.time') }}</text>
			<view class="description content-item" id="desc">
				{{ this.courseInfo.course_data.background }}
			</view>

			<!-- <text class="title content-item">{{ $t('pages.battlefield.intro.unit1.title') }}</text>
			<text class="subtitle content-item">{{ $t('pages.battlefield.intro.unit1.subtitle') }}</text>
			<text class="time-info content-item">{{ $t('pages.battlefield.intro.unit1.time') }}</text>
			<view class="description content-item" id="desc">
				{{ $t('pages.battlefield.intro.unit1.desc') }}
			</view> -->
		</view>
		<view class="continue-button-container">
			<button class="continue-btn" @click="navigateToNextPage">{{ $t('pages.battlefield.intro.continue') }}</button>
		</view>
	</view>
</template>

<script>
	import ProgressBar from '@/components/ProgressBar.vue'; // 引入组件
	export default {
		components: {
			ProgressBar, // 注册组件
		},
		data() {
			return {};
		},
		created() {
			this.loadCourse();
			// console.log('courseInfo:', this.courseInfo)
		},
		computed: {
			npcs() {
				return this.$store.getters.getNpcs;
			},
			courseData() {
				return this.$store.getters.getcourseData;
			},
			courseInfo() {
				return this.$store.getters.getCourseInfo;
			},
			navBarTop() {
				return this.$store.getters.getNavBarTop;
			},
			navBarHeight() {
				return this.$store.getters.getNavBarHeight;
			},
		},
		methods: {
			navigateToNextPage() {
				uni.reLaunch({
					url: '/pages/battlefield/battlefield-task' // Replace this with the actual path to your next page
				});
			},
			goToDashboard() {
				if (getCurrentPages().length > 1) {
					uni.navigateBack(); // 返回上一个页面
				} else {
					uni.redirectTo({
						url: '/pages/dashboard/dashboard_zh' // 如果没有历史记录，导航到指定页面
					});
				}
			},
			async loadCourse() {
				try {
					await this.$store.dispatch('fetchCourseInfo', this.courseData.next_course_id)
					console.log('courseInfo:', this.courseInfo)
					// 成功获取课程信息后的操作
				} catch (error) {
					// 处理错误
				}
			},
		}
	}
</script>

<style scoped>
	@import "./common.css";

	.navbar {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		padding: 0 20rpx;
		position: relative;
		z-index: 3;
		/* margin-top: 90rpx; */
		/* margin-left: 0 20rpx; */
		/* 确保导航栏在叠加层之上 */
	}

	.back-button {
		width: 24px;
		height: 24px;
	}

	.progress-bar {
		flex: 1;
		width: 100%;
		height: 20px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 16rpx;
	}
	.progress-bar-item {
		width: 193rpx;
	}

	.wetchat-menu {
		width: 200rpx;
	}

	.content {
		padding: 40rpx;
		text-align: center;
		z-index: 3;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 160rpx;
		/* 确保页面内容在叠加层之上 */
	}

	.title {
		font-size: 24px;
		font-weight: 700;
		color: #fff;
		/* 具体设置白色 */
	}

	.subtitle {
		font-size: 34px;
		font-weight: 700;
		margin: 10px 0;
		color: #fff;
		/* 具体设置白色 */
	}

	.time-info {
		font-size: 16px;
		color: #bbb;
		margin-bottom: 20px;
	}

	.description {
		font-size: 34rpx;
		font-weight: 400;
		align-items: center;
		line-height: 48rpx;
		text-align: center;
		color: #fff;
		/* 具体设置白色 */
	}

	#desc,
	#desc .npc-name {
		line-height: 54rpx;
	}

	.content-item {
		/* margin-top: 30rpx; */
		line-height: 68rpx;
	}

	.npc-name {
		width: max-content;
		height: 52rpx;
		background-color: #2D6985;
		font-size: 34rpx;
		font-weight: 400;
		white-space: nowrap;
		/* 强制不换行 */
		padding: 4rpx 12rpx;
		line-height: 52rpx;
		/* 上下居中 */
		position: relative;
		border-radius: 26rpx;
	}

	.npc-avatar {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		background-color: #fff;
		position: relative;
		top: 8rpx;
		/* position: absolute;
		top: 50%;
		transform: translateY(-50%); */
	}

	.description-text {}
</style>