<template>
	<view class="card-container">
		<view class="avatar-container">
			<image class="avatar" :src="avatar" mode="aspectFill"></image>
		</view>
		<view class="description">
			<view class="name-icon-container" style="">
				<view class="name">{{ name }}</view>
				<!-- 根据 npcHealth 显示不同的 SVG 图标 -->
				<image v-if="npcHealth > 10" :src="greenIcon" class="health-icon"></image>
				<image v-else-if="npcHealth <= 10" :src="redIcon" class="health-icon"></image>
			</view>
			<view class="comment">{{ comment }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			name: {
				type: String,
				required: true
			},
			avatar: {
				type: String,
				required: true
			},
			comment: {
				type: String,
				required: true
			},
			npcHealth: { // 将 npcHealth 作为 prop 添加
				type: [Number, String], // 支持数字和字符串类型
				required: true
			}
		},
		data() {
			return {
				greenIcon: '/static/battlefield/prime_sort-up-fill.svg', // 假设绿色的SVG图标路径
				redIcon: '/static/battlefield/prime_sort-down-fill.svg' // 假设红色的SVG图标路径
			}
		}
	}
</script>

<style scoped>
	.card-container {
		display: flex;
		align-items: flex-start;
		padding: 20px 16px;
		border-radius: 16px;
		background-color: #454552;
		margin: 16px 0;

	}

	.avatar {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}

	.avatar-container {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		border: solid 1px #F2Bc74;
		flex-shrink: 0;
	}

	.description {
		margin-left: 16px;
		color: #fff;
		display: flex;
		flex-direction: column;
	}
	.name-icon-container {
		display: flex; 
		align-items: center;
		height: 22px;
		flex-direction: row; 
		align-items: center;
	}
	.name {
		font-weight: bold;
		font-size: 17px;
	}

	.health-icon {
		width: 16px;
		height: 16px;
		margin-left: 8px;
		margin-top: 4px;
	}

	.comment {
		font-size: 14px;
		font-weight: 400;
		margin-top: 8px;
	}
</style>