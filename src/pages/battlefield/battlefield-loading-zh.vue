<template>
  <view class="background-image loading-container">
    <image
      class="background-image"
      :src="getImg('/static/web/battlefield/background.webp')"
      mode="aspectFill"
    />
    <!-- Content -->
    <view class="loading-text-container">
      <text class="loading-text">{{ this.courseInfo.course_data.location }}</text>
      <!-- <text class="loading-text">{{ $t('pages.battlefield.loading.title') }}</text> -->
    </view>
  </view>
</template>

<script>
import { startField } from "../../scripts/battlefield-chat";
import apiService from '../../services/api-service';
import { getImg } from "../../scripts/constants";
export default {
	data() {
		return {
			getImg,}
			},
  computed: {
			courseInfo() {
				return this.$store.getters.getCourseInfo;
			},
		},
			
  async mounted() {
    const result = await startField(1, "1");
    console.log("result from start field:", result);
	result.response.dialog.map( (item) => {
		this.$store.commit('setAudios',{ key: `voice-${item.words || item.content}`, value: item.voice_url });
	})
    // uni.setStorage({
    //   key: "chats",
    //   data: result.response.dialog,
    //   // task_check: result.task_check, 
    // });
	uni.setStorage({
	  key: "chats",
	  data: {
	    dialog: result.response.dialog,
	    task_check: result.task_check
	  }
	});
			uni.reLaunch({
				url: '/pages/battlefield/battlefield-playground'
			})
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
