<template>
  <view class="background-image loading-container">
    <image
      class="background-image"
      src="/static/battlefield/background1.png"
      mode="aspectFill"
    />
    <!-- Content -->
    <view class="loading-text-container">
      <text class="loading-text">Meeting Room</text>
    </view>
  </view>
</template>

<script>
import { startField } from "../../scripts/battlefield-chat";
import apiService from '../../services/api-service';

export default {
  async mounted() {
    const result = await startField(4, "4");
    console.log("result from start field:", result);
    uni.setStorage({
      key: "chats",
      data: result.dialog,
    });

			const voiceMap = {
				"Jason": {
					"voice": "onyx",
					"style": "serious"
				},
				"Anna": {
					"voice": "nova",
					"style": "empathetic"
				},
				"Sam": {
					"voice": "echo",
					"style": "empathetic"
				}
			};
			try {
				const promises = result.dialog.map(async (item) => {
					const result = await apiService.getVoice(item.words || item.content, voiceMap[item.role]["voice"], voiceMap[item.role]["style"]);
					uni.setStorageSync(`voice-${item.words || item.content}`, result.message);
				})
				await Promise.all(promises);
			} catch (error) {
				console.log("get voice fail", error);
			} finally {
				uni.navigateTo({
					url: '/pages/battlefield/battlefield-playground'
				})
			}
		}
	}
</script>

<style scoped>
@import "./common.css";

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-text-container {
  width: 30%;
  background-color: rgba(16, 16, 16, 0.4);
  height: 40px;
  border-radius: 40rpx;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-text {
  color: #fff;
  font-size: 25rpx;
}
</style>
