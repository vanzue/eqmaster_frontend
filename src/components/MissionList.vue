<template>
	<view class="container-box" :style="{'--theme-color-matching': themeColors.matching, '--theme-color-theme': themeColors.theme, '--theme-color-font-title': themeColors.popup_font_title }">
		<view class="content-task">
			<view class="card-header">
				<view class="title">
					{{ $t('pages.battlefield.playground.tasks_title') }}
					<image class="card-close-image" src="/static/battlefield/material-symbols_close.png" mode=""
						@click="closeCardBox"></image>
				</view>
			</view>
			<view class="task-list">
				<view class="task-item" v-for="(item,index) in listData" :key="index">
					<view class="left">
						<image class="radiocheck-image" src="/static/battlefield/radiocheck.png" mode=""
							v-if="item._status"></image>
						<image class="radiocheck-image" src="/static/battlefield/radiocheck-disabled.png" mode=""
							v-else></image>
					</view>
					<view class="right">
						<view class="top">
							{{ item._title }}
						</view>
						<view class="bottom">
							<view class="blood-container">
								<view class="health-bar-container">
									<view class="health-bar-line"></view>
									<view class="health-bar-background">
										<view class="health-bar-foreground" :style="healthBarStyle(item)">
										</view>
									</view>
								</view>
								<view class="completed-num">
									{{ item._completedRoundNum }}/{{ item.totalRoundNum }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import TaskList from '../models/TaskList';
	export default {
		props: {
			listData: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				taskList: null,
			};
		},
		created() {
			console.log(this.listData);
			this.taskList = new TaskList(this.listData);
		},
		methods: {
			closeCardBox() {
				// 按钮点击事件
				this.$emit('closeMissionCard');
			},
			healthBarStyle(val) {
				const percentage = val ? (val._completedRoundNum / val.totalRoundNum) * 100 : 0;
				const color = percentage < 50 ? '#E8FFC4' : '#90E0E7';
				const width = `${percentage}%`;
				return {
					width,
					backgroundColor: color,
					transition: 'width 0.5s ease, background-color 0.5s ease'
				};
			},
		},
		computed: {
			totalTasks() {
				return this.taskList ? this.taskList.getTotalTaskLength() : 0;
			},
			completedTasks() {
				return this.taskList ? this.taskList.getDoneTaskLength() : 0;
			},
			themeColors() {
				return this.$store.getters.getThemeColors;
			},
		},
		listData: {
			handler(newListData) {
				this.taskList = new TaskList(newListData);
			},
			deep: true
		}
	}
</script>

<style scoped>
	.container-box {
		width: 100%;
		border-top-left-radius: 32rpx;
		border-top-right-radius: 32rpx;
		z-index: 3;
		position: absolute;
		height: 732rpx;
		bottom: 0px;
		left: 0;
		background-color: var(--theme-color-matching);
		display: flex;
		flex-direction: column;
	}

	.content-task {
		/* display: flex; */
		padding: 40rpx 36rpx 96rpx 32rpx;
	}

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
		font-weight: 700;
		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
		color: var(--theme-color-font-title);
	}

	.card-close-image {
		position: absolute;
		right: 0;
		width: 48rpx;
		height: 48rpx;
	}

	.task-list {
		display: block;
		text-align: center;
		width: 686rpx;
		height: 500rpx;
		gap: 16rpx;
		/* opacity: 0px; */
		margin-top: 40rpx;
		color: #2D6985;
	}

	.task-item {
		display: flex;
		/* 				height: 156rpx; */
		align-items: center;
		background-color: #FFFFFF;
		margin-bottom: 16rpx;
		padding: 24rpx 32rpx;
		border-radius: 24rpx;
		gap: 32rpx;
	}

	.top {
		font-size: 30rpx;
		line-height: 40rpx;
		font-weight: 600;
		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
		color: var(--theme-color-font-title);
	}

	.radiocheck-image {
		width: 53.34rpx;
		height: 53.34rpx;
	}

	.right {
		text-align: left;
		display: block;
		font-size: 34rpx;
	}

	.blood-container {
		height: 56rpx;
		/* padding: 20rpx 0; */
		display: flex;
		gap: 44rpx;
		/* flex-direction: column; */
		align-items: center;
	}

	.health-bar-container {
		width: 436rpx;
		height: 20rpx;
		/* margin-bottom: 10rpx; */
		position: relative;
		overflow: visible;
	}
	.completed-num {
		color: var(--theme-color-font-title);
	}

	.health-bar-background {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		background-color: #E3E3E3 !important;
		border-radius: 5px;
		position: relative;
		overflow: visible;
		z-index: 3;
	}

	.health-bar-foreground {
		margin-top: 2rpx;
		height: 16rpx;
		border-radius: 5px;
		position: absolute;
		top: 0;
		left: 0;
		/* 添加只在上方显示阴影的代码 */
		overflow: visible;
		box-shadow: 0 -6px 6px -3px var(--theme-color-theme);
		border-bottom: transparent;
	}

	.health-bar-line {
		position: absolute;
		left: 50%;
		width: 2rpx;
		height: 10px;
		background-color: #ffffff;
		z-index: 3;
		/* 中间的白线 */
	}

	.right {
		text-align: left;
		display: block;
		font-size: 34rpx;

	}

	.blood-container {
		height: 56rpx;
		/* padding: 20rpx 0; */
		display: flex;
		gap: 44rpx;
		/* flex-direction: column; */
		align-items: center;
	}

	.health-bar-container {
		width: 436rpx;
		height: 20rpx;
		/* margin-bottom: 10rpx; */
		position: relative;
		overflow: visible;
	}

	.health-bar-background {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 5px;
		position: relative;
		overflow: visible;
		z-index: 3;
	}

	.health-bar-foreground {
		margin-top: 2rpx;
		height: 16rpx;
		border-radius: 5px;
		position: absolute;
		top: 0;
		left: 0;
		/* 添加只在上方显示阴影的代码 */
		overflow: visible;
		box-shadow: 0 -6px 6px -3px rgba(255, 255, 255, 0.3);
	}

	.health-bar-line {
		position: absolute;
		left: 50%;
		width: 2rpx;
		height: 10px;
		background-color: #ffffff;
		z-index: 3;
		/* 中间的白线 */
	}
</style>