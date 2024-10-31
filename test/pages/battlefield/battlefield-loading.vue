<template>
  <view class="background-image loading-container">
    <image class="background-image" src="/static/battlefield/background1.png" mode="aspectFill" />
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
  data() {
    return {};
  },
  computed: {
    userId() {
      return this.$store.getters.getUserId;
    },
    couseId() {
      return this.$store.getters.getCourseId;
    },
  },
  watch: {
    couseId: {
      immediate: true,
      async handler(val) {
        if (!val) {
          uni.navigateTo({
            url: '/pages/dashboard/dashboard_en' // Replace this with the actual path to your next page
          });
        }
      },
      // deep: true,
    },
  },
  async mounted() {
    const result = await startField(this.userId, this.couseId);
    console.log("result from start field:", result);
    uni.setStorage({
      key: "chats",
      data: result.dialog,
    });
    try {
      const npcs = this.$store.getters.getNpcs;
      const npcsMap = new Map(npcs.map(item => [item.characterName, item]));

      const promises = result.dialog.map(async (item) => {
        const result = await apiService.getVoice(item.words || item.content, npcsMap.get(item.role).voice, npcsMap.get(item.role).style, npcsMap.get(item.role).rate);
        this.$store.commit('setAudios', { key: `voice-${item.words || item.content}`, value: result.message });
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
