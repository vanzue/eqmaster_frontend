<template>
	<view class="container" >
		<scroll-view scroll-y style="height: 100%">
			<!-- <view class="debug-info">
    如需调试信息，可取消注释以下行
    <text>homepageData: {{ JSON.stringify(homepageData) }}</text>
   </view> -->
			<image class="head-image" :src="
          this.isPass
            ? getImg('/static/web/battlefield/IP-green.webp')
            : getImg('/static/web/battlefield/IP-grey.webp')
        " mode="aspectFit"></image>
			<view class="card first-card">
				<view class="status-text">
					{{ this.isPass ? "你真棒!" : "真遗憾..." }}
				</view>
				<reward-bar :style="{ backgroundColor: 'transparent', width: '300rpx' }" :gemCount="this.gemCount"
					gem-icon-width="40px" gem-icon-height="40px"></reward-bar>
				<view class="diamond-wrapper">
					<image class="diamond-image" :src="getImg('/static/web/battlefield/diamond.webp')" mode="aspectFill"></image>
					<text class="diamond-text">
						{{ this.isPass ? "+10" : "+3" }}
					</text>
				</view>
			</view>

			<view class="card second-card">
				<!-- <vtew class="score">
     <text class="summary-dimension">情绪平衡力</text>
     <text class="course-score">+15</text>
    </view>
    <view class="progress-container">
     <view class="progress-bar1">
      <view class="progress" :style="{ width: progressWidth(45) }">
      </view>
     </view>
     <text class="score-title2">45%</text>
    </view> -->
				<view class="comments">
					<view class="comment-header">
						<!-- <view class="down-line"></view> -->
						<text class="comment-title">互动评价</text>
					</view>

					<view class="sub-card">
						<npc-comment :name="'老板'" :avatar="getImg('/static/web/battlefield/boss.webp')" :comment="comments[0]"
							:npcHealth="Number(npcHealthValues[0])"></npc-comment>
						<npc-comment :name="'同事A'" :avatar="getImg('/static/web/battlefield/xiaoA.webp')" :comment="comments[1]"
							:npcHealth="npcHealthValues[1]"></npc-comment>
						<npc-comment :name="'同事B'" :avatar="getImg('/static/web/battlefield/xiaoB.webp')" :comment="comments[2]"
							:npcHealth="npcHealthValues[2]"></npc-comment>
					</view>

				</view>
			</view>

			<view class="card third-card">
				<view class="third-card-title">
					<text class="tips-title">本关情商技巧</text>
					<image class="tips-icon" :src="getImg('/static/web/battlefield/eqtips.webp')" mode="widthFix"></image>
					<!-- <view class="down-line second-line"></view> -->
				</view>
				<view class="suggestion">
					<text>{{ suggestion }}</text>
					<image class="tips-icon1"  :src="getImg('/static/web/battlefield/eqtips1.webp')" mode="widthFix"></image>

				</view>

			</view>
			<view class="status-text1">
				<text class="tips-title1">--到底啦--</text>
			</view>

			<view class="guide-button-container">
				<image class="guide-icon" src="/static/battlefield/time.png" mode="aspectFill"></image>
				<image class="guide-icon" src="/static/battlefield/flag.png" mode="aspectFill"></image>
				<button class="guide-button" @click="this.isFromMap ? navigateToIntro() : navigateToMap()">
					<!-- {{ this.isFromMap ? "Back to Map" : (this.isPass ? "Continue" : "Try again") }} -->
					<!-- {{ this.isPass ? "Continue" : "Try again" }} -->
					{{ this.isFromMap ? "再玩一次":"完成" }}
				</button>
			</view>

		</scroll-view>
	</view>
</template>

<script>
	import RewardBar from "@/components/RewardBar.vue";
	import NpcComment from "@/components/NpcComment.vue"; // ���入组件
	import api from "../../services/api-service";
	import { getImg } from "../../scripts/constants";
	export default {
		components: {
			NpcComment, // 注册组件
			RewardBar,
		},
		data() {
			return {
				getImg,
				comments: [
					"你这小子真是越来越懂我了，简直像我肚子里的蛔虫。每次点的菜都能踩准我的心思，不多不少，恰到好处。",
					"厉害啊，“蛔虫”。不过我们这种小人物的口味可没人在乎咯。",
					"看来今天的饭局是主攻辣味了啊，像我这种不吃辣的也只能凑合着了。没事儿，你们尽兴就好，我不重要，反正我的口味也没人太在意。",
				],
				suggestion: "注意倾听每个人的需求，及时回应对方的感受。适当分配话题焦点，别让任何人感到被忽视。观察细微表情，察言观色，提前调整自己的言行。",
				gemCount: 0,
				npcHealthValues: [],
				isFromMap: false, // 新增属性以接收参数
			};
		},
		methods: {
			progressWidth(value) {
				// 计算进度条宽度百分比
				const percentage = (value / 100) * 100;
				// console.log('${percentage}%：', `${percentage}%`)
				return `${percentage}%`;
			},
			navigateToMap() {
				console.log("Navigating to guide with data:", {
					userId: this.userId,
					username: this.username,
					// jobId: this.homepageData.response.personal_info.job_id
				});
				uni.navigateTo({
					url: `/pages/dashboard/dashboard_zh`,

					// url: `/pages/dashboard/dashboard?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.homepageData.response.personal_info.job_id}`
				});
			},
			navigateToIntro() {
				console.log("Navigating to guide with data:", {
					userId: this.userId,
					username: this.username,
					// jobId: this.homepageData.response.personal_info.job_id
				});
				uni.navigateTo({
					url: `/pages/battlefield/battlefield-intro-zh`,

					// url: `/pages/dashboard/dashboard?userId=${this.userId}&username=${encodeURIComponent(this.username)}&jobId=${this.homepageData.response.personal_info.job_id}`
				});
			},

			navigateToNextPage() {
				uni.navigateTo({
					url: "/pages/battlefield/battlefield-task-zh", // Replace this with the actual path to your next page
				});
			},
		},

		onLoad(options) {
			// 接收上个页面传来的参数
			if (options.isFromMap !== undefined) {
				this.isFromMap = options.isFromMap === 'true'; // 将字符串转换为布尔值
			}
			// this.homepageData = api.getHomepageData()
			uni.getStorage({
				key: "isPass",
				success: (res) => {
					// 根据存储的值更新 isPass
					console.log("res: ", res);
					this.isPass = res.data || false; // 如果 res.data 为 undefined，则默认为 false
				},
				fail: () => {
					console.warn("获取 isPass 值败");
					this.isPass = false; // 失败时可以设置默认值
					// console.log("this.isPass: ", this.isPass);
				},
			});
			const evalResult = uni.getStorage({
				key: "evalResult",
				success: (res) => {
					console.log("result:", res);
					const dbCourse = res.data.db_course;
					const list = Object.keys(dbCourse)
						.filter((key) => key.startsWith("comment")) // 筛选以 'comment' 开头的键
						.sort() // 如果你想按照 comment1, comment2 的顺序排列
						.map((key) => dbCourse[key]); // 提取这些键的值      ;
					this.comments = list;
					this.suggestion = res.data.db_course.tips
						.map(tip => `• ${tip}`) // 在每行开头添加 bullet point
						.join('\n'); // 用换行符连接所有行

				},
			});
			uni.getStorage({
				key: "npcHealth",
				success: (res) => {
					this.npcHealthValues = res.data;
					console.log("NPC health 获取成功:", this.npcHealthValues);
				},
				fail: (err) => {
					console.error("获取 NPC health 失���:", err);
				},
			});


			uni.getStorage({
				key: "gemCount",
				success: (res) => {
					console.log("res.data: ", res.data);
					this.gemCount = parseInt(res.data);
					// let diamondAdd = 3; // 默认值为 3
					// if (gemCount > 0) {
					//  diamondAdd = 10; // 如果 gemCount > 0, 设置 diamondAdd 为 10
					// }
					// this.diamondAdd = diamondAdd;
					// console.log('获取到的 Gem Count:', gemCount, 'Diamond Add 值为:', diamondAdd);
				},
				fail: (err) => {
					console.error("获取 Gem Count 失败:", err);
					this.gemCount = 0;
					// this.diamondAdd = 3;
				},
			});
			this.$store.commit('initNpcsHealth');
		},
	};
</script>

<style scoped>
	.container {
		width: 100%;
		min-height: 100vh;
		background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.9)),
			url("https://eqmaster.blob.core.chinacloudapi.cn/static/web/battlefield/background.webp?sp=r&st=2024-11-18T09:41:26Z&se=2025-11-18T17:41:26Z&sv=2022-11-02&sr=c&sig=WL07d2l6cOkDXNTjNxkTEU3Yl0J%2FrNlWU%2FUPGJRPfhA%3D");
		background-color: #2F2F38;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 40px;
		padding-left: 10px;
	}

	.comments {
		margin-top: 20px;
		margin-left: 6px;
	}

	.comment-title {
		color: #fff;
		font-weight: 600;
		font-size: 40rpx;
		line-height: 50rpx;
		text-decoration: underline;
		text-decoration-thickness: 6rpx;
		text-decoration-color: #9EE44D;
		text-underline-offset: 8rpx;
		border-radius: 10rpx;
		/* box-shadow: inset 0 -3px 0 0 #9EE44D, inset 0 -3px 0 0 #9EE44D; */
	}

	.tips-title {
		color: #fff;
		font-weight: 600;
		font-size: 40rpx;
		line-height: 50rpx;
		width: 230rpx;
		text-decoration: underline;
		text-decoration-thickness: 6rpx;
		text-decoration-color: #9EE44D;
		text-underline-offset: 8rpx;
		border-radius: 10rpx;
		margin: 20px 3px 0px 0px;
		white-space: nowrap;
	}

	.tips-title1 {
		color: #fff;
		font-weight: 300;
		font-size: 30rpx;
		color: #888888;
		text-align: center;

	}

	.comment-header {
		position: relative;
	}

	.score-title2 {
		color: #fff;
		margin-left: 3px;
	}

	.card {
		width: 90%;
		height: 30vh;
		margin-top: 2vh;
		background-color: #373742;
		z-index: 3;
		border-radius: 20px;
		position: relative;
		overflow: visible;
		padding: 10px;
	}

	.first-card {
		height: 25vh;
		margin-top: 10vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.head-image {
		position: absolute;
		left: 23%;
		top: -5%;
		width: 50%;
		z-index: 4;
	}

	.status-text {
		color: #fff;
		text-align: center;
		font-size: 56rpx;
		line-height: 64rpx;
		height: 64rpx;
		margin-top: 80rpx;
		font-weight: 700;

	}

	.status-text1 {
		color: #fff;
		text-align: center;
		font-size: 56rpx;
		line-height: 64rpx;
		height: 64rpx;
		margin-top: 80rpx;
		font-weight: 700;
		margin-bottom: 15vh;
	}

	.diamond-wrapper {
		margin-top: 10rpx;
	}

	.diamond-image {
		width: 60rpx;
		height: 60rpx;
	}

	.diamond-text {
		font-size: 48rpx;
		font-weight: 800;
		line-height: 56rpx;
		position: relative;
		top: -12%;
		left: 5%;
		color: #f2bc74;
	}

	.progress-container {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.progress-bar1 {
		margin-left: 10px;
		width: 85%;
		height: 15rpx;
		background-color: #7d7b7e;
		border-radius: 15rpx;
		overflow: hidden;
		margin-top: 15rpx;
		margin-bottom: 15rpx;
	}

	.progress {
		height: 100%;
		background-color: #f2bc74;
	}

	.score {
		margin: 10px;
		margin-left: 10px;
		width: 80%;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		gap: 10px;
		align-items: center;
	}

	.summary-dimension {
		margin-top: 3px;
		font-weight: bold;
		color: #fff;
	}

	.course-score {
		color: #f2bc74;
	}

	.down-line {
		position: absolute;
		width: 18%;
		bottom: 4px;
		height: 3px;
		background-color: #9EE44D;
	}

	.sub-card {
		margin-right: 5px;
	}

	.second-card {
		height: auto;
	}

	.third-card-title {
		margin-top: 0rpx;
		margin-left: 20rpx;
		position: relative;
		display: flex;
		flex-direction: row;
	}

	.tips-icon {
		width: 400rpx;
	}

	.tips-icon1 {
		width: 300rpx;
		margin-top: 0rpx;
		/* margin-left: 20rpx; */
		left: 55%;
		top: 40%;
		position: absolute;
		display: flex-end;
		flex-direction: row;
		z-index: -1
	}

	.second-line {
		width: 30%;
	}

	.suggestion {
		width: 654rpx;
		margin-left: 24rpx;
		margin-bottom: 44rpx;
		line-height: 48rpx;
		color: #fff;
	}

	.third-card {
		height: auto;
		/* margin-bottom: 13vh; */
	}

	.guide-button-container {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100rpx;
		z-index: 1000;
		position: fixed;
		/* 固定定位 */
		bottom: 40px;
	}

	.guide-icon {
		width: 88rpx;
		height: 88rpx;
		background-color: transparent;
		margin-left: 20rpx;
		margin-right: 30rpx;
	}

	.guide-button {
		width: 50%;
		height: 100rpx;
		background: linear-gradient(101.13deg, #EDFB8B 13.84%, #9EE44D 84.78%);
		color: #252529;
		font-size: 30rpx;
		font-weight: 600;
		border-radius: 50rpx;
		text-align: center;
		line-height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		/* margin-bottom: 30rpx; */
		z-index: 1000;
		/* 确保按钮悬浮在其他内容之上 */
		position: fixed;
		/* 固定定位 */
		bottom: 40px;
		/* transform: translateX(-50%); */
		/* 调整水平位置以居中 */
		right: 10%;
		/* 水平居中 */
		font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
	}
</style>