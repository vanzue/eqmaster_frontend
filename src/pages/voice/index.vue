<template>
  <view class="container">
    <button 
      @touchstart="streamRecord" 
      @touchend="endStreamRecord" 
      type="primary" 
      class="voice-btn">按住说话</button>
    <view class="text-area">语音识别内容：{{currentText}}</view>
  </view>
</template>

<script>
const plugin = requirePlugin("WechatSI");
const voicManager = plugin.getRecordRecognitionManager();

export default {
  data() {
    return {
      currentText: ""
    }
  },
  methods: {
    streamRecord() {
      voicManager.start({
        lang: 'zh_CN',
      })
    },
    endStreamRecord() {
      voicManager.stop()
    },
    initRecord() {
      voicManager.onRecognize = (res) => {
        this.currentText = res.result
      }
      
      voicManager.onStop = (res) => {
        let text = res.result
        if(text === '') {
          console.log('没有说话')
          return
        }
        this.currentText = text
      }
    }
  },
  onLoad() {
    this.initRecord()
  }
}
</script>

<style>
.container {
  padding: 20px;
}

.voice-btn {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30rpx auto;
  background-color: #007AFF;
  color: #fff;
}

.voice-btn:active {
  background-color: #0056b3;
}

.text-area {
  margin-top: 30rpx;
  padding: 20rpx;
  min-height: 100rpx;
  border: 1px solid #eee;
  border-radius: 10rpx;
}
</style>