<template>
  <view v-if="tempFilePath" class="card">
    <view class="title">已录制1{{ recognizedText }}</view>
    <view class="app-between ">
      <view class="app-between player" @click="playBtn">
        <image class="icon-play" :src="playStatus === 0 ? '/static/icon/icon-play.png' : '/static/icon/icon-stop.png'"></image>
        <image class="icon-sound" src="/static/icon/icon-sound.png"></image>
        <text class="time">{{ getVoiceDuration }}</text>
      </view>
      <u-icon name="trash" color="#cccccc" size="42rpx" @click="delBtn"></u-icon>
    </view>
<!--    <view v-if="recognizedText" class="recognized-text">
      <view class="text-title">识别内容：</view>
      <view class="text-content">{{ recognizedText }}</view>
    </view> -->
  </view>

  <view v-if="longPress == 2" class="prompt-layer">
    <view class="prompt-popup">
      <view class="p">{{ '剩余：' + count + 's' }}</view>
      <view style="font-size: 42rpx;margin-top: 30rpx;">松手 完成</view>
    </view>
  </view>

  <button class="sbmit-btn" @longpress="longpressBtn" @touchend="touchendBtn">
    <text class="inner"></text>
  </button>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
const plugin = requirePlugin("WechatSI") // 添加插件导入

const recordAuth = ref(false) // 是否授权录音

// 录音
const recorderManager = uni.getRecorderManager() // 录音管理对象
let init: any = null // 录制时长计时器
let timer: any = null // 播放 录制倒计时
const count = ref(0) // 录制倒计时
const longPress = ref(1) // 1显示 按住说话 2显示 说话中

function recordingTimer(_time: any) {
  if (_time == undefined) {
    // 将计时器赋值给init
    init = setInterval(() => {
      time.value++
    }, 1000);
  } else {
    clearInterval(init)
  }
}

// 录音授权
function authorRecord() {
  uni.authorize({
    scope: 'scope.record',//这里选择scope.(录音、位置、用户信息...都可以)
    success() { // 允许授权
      console.log('已授权');
      recordAuth.value = true
    },
    fail() { // 拒绝授权
      uni.showModal({
        content: '检测到您没打开录音功能权限，是否去设置打开？',
        confirmText: "确认",
        confirmColor: '#1874f5',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            uni.openSetting({ // opensetting 是调起设置页面的
						  success: (res) => {
                // 获取设置授权的状态
                const setting = res.authSetting;
                recordAuth.value = setting['scope.record'] || false
              }
            })
          } else {
            return false;
          }
        }
      })
      return false;
    }
  })
}

// 长按录音事件
function longpressBtn() {
  if(!recordAuth.value) {
    authorRecord()
    return;
  }

  // 停止播放
  playBtn()
  // 清除播放时间
  time.value = 0;

  longPress.value = 2;
  clearInterval(init) // 清除定时器
  countdown(duration.value); // 倒计时
  recorderManager.onStop((res) => {
    tempFilePath.value = res.tempFilePath;
    recordingTimer(time.value);
  })
  const options = {
    duration: duration.value, // 指定录音的时长，单位 ms，最长录音为 600000（10 分钟）
    sampleRate: 16000, // 采样率
    numberOfChannels: 1, // 录音通道数
    encodeBitRate: 96000, // 编码码率
    format: 'mp3', // 音频格式，有效值 aac/mp3
    frameSize: 10, // 指定帧大小，单位 KB
  }
  recordingTimer(undefined);
  recorderManager.start(options);
  // 监听音频开始事件
  recorderManager.onStart((res) => {
    console.log(res)
  })
}

// 长按松开录音事件
function touchendBtn() {
  if(!recordAuth.value) {
    return;
  }
  
  longPress.value = 1;
  recorderManager.onStop((result) => {
  console.log("111111111111111")
    // 先上传录音文件
    uploadVoice(result).then((url: any) => {
      tempFilePath.value = url;
      innerAudioContext.src = url;
      time.value = Math.round(result.duration / 1000);
      voiceAllTime.value = time.value;

      // 然后进行语音识别
      plugin.translateVoice({
        filePath: result.tempFilePath,
        duration: result.duration,
        success: function(res: any) {
          console.log("语音识别结果:", res.result)
          // 这里可以处理识别出的文字
          // 比如存储到ref中或发送给父组件
        },
        fail: function(err: any) {
          console.error("语音识别失败:", err)
          uni.showToast({ 
            icon: "error", 
            title: "语音识别失败" 
          })
        }
      })
    })
  })
  recordingTimer(time.value)
  clearInterval(timer)
  recorderManager.stop();
}

// 上传录音
function uploadVoice(voice: any) {
  // const api = import.meta.env.VITE_BASE_API
  return new Promise((resolve, reject) => {
    // 通过 uni.uploadFile 上传录音文件，filePath 传 voice.tempFilePath，指定要上传文件资源路径
    // uni.uploadFile({
    //   url: `${import.meta.env.VITE_BASE_HOST}${api}/file/upload?module=voiceintroduct`,
    //   header: {
    //     "Authorization": `Bearer xxx`
    //   },
    //   filePath: voice.tempFilePath, // 要上传文件资源的路径
    //   name: 'file', // 文件对应的 key
    //   success: (res) => {
    //     const data = JSON.parse(res.data);
    //     if (data.code == 200) {
    //       // 调用接口上传
    //       saveAudio({ "introduceVoice": data.url, "introduceVoiceDuration": Math.round(voice.duration / 1000) }).then(() => {
    //         uni.showToast({ icon: "success", title: "保存成功！" })
    //         resolve(data.url)
    //       })
    //     } else {
    //       uni.showToast({ icon: "error", title: "上传失败！" })
    //     }
    //   }
    // })

    // 下面是示例，模拟上传成功之后的处理
    Promise.resolve().then(() => {
      uni.showToast({ icon: "success", title: "保存成功！" })
      resolve(voice.tempFilePath)
    }).catch(err => {
      console.log(err);
    })
  })
}

// 音频
const innerAudioContext = uni.createInnerAudioContext() // audio 上下文对象
const time = ref(0) //录音时长
const duration = ref(60000) //录音最大值ms 60000/1分钟
const tempFilePath: any = ref('') //音频路径
const playStatus = ref(0) //录音播放状态 0:未播放 1:正在播放
const voiceAllTime = ref(0) //记录音频原始总时长

// 显示音频剩余秒数
const getVoiceDuration = computed(() => {
  let _t = String(time.value)
  let str = _t.length > 1 ? `00:${_t}` : `00:0${_t}`;
  return str
})

// 播放
function updateTime(val: number) {
  time.value = Number(val);
  timer = setInterval(() => {
    if (time.value >= 1) {
      time.value--
    } else {
      time.value = voiceAllTime.value
      clearInterval(timer);
    }
  }, 1000);
}
function playBtn() {
  //点击播放
  if (playStatus.value == 0) {
    playStatus.value = 1;
    innerAudioContext.play();
    updateTime(time.value); // 倒计时
  } else {
    playStatus.value = 0;
    innerAudioContext.pause()
    clearInterval(timer)
  }
  //播放结束
  innerAudioContext.onEnded(() => {
    playStatus.value = 0;
  })
}

// 删除录音
function delBtn() {
  // 调用接口删除
  // 下面是示例，删除后的重置
  time.value = 0
  tempFilePath.value = ''
  playStatus.value = 0
  time.value = voiceAllTime.value = 0
  recognizedText.value = ''
}

// 倒计时
function countdown(val: any) {
  count.value = Number(val);
  timer = setInterval(() => {
    if (count.value > 0) {
      count.value--
    } else {
      longPress.value = 1;
      clearInterval(timer);
    }
  }, 1000);
}

// 获取录音权限状态
function getRecordSetting() {
  uni.getSetting({
    success(res) {
      const setting = res.authSetting;
      recordAuth.value = setting['scope.record'] || false
    }
  })
}

// 设置录音
function setVoice() {
  // 进入页面时调用接口获取上传的路由文件路径
  // 下面是示例
  tempFilePath.value = "https://web-ext-storage.dcloud.net.cn/uni-app/ForElise.mp3";
  innerAudioContext.src = tempFilePath.value;
  time.value = 30;
  voiceAllTime.value = time.value;
}

// 模拟请求，在定时器里动态设置duration 为5分钟录音时长
async function setDuration() {
  const res: number = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(5 * 60 * 1000)
    }, 1000)
  })
  duration.value = res
}

// 新增识别文字的响应式变量
const recognizedText = ref('')

onLoad(() => {
  setVoice()

  getRecordSetting()

  setDuration()
})
</script>

<style lang="scss" scoped>
.card {
  margin: 0 0 24rpx;
  padding: 100rpx 24rpx;
  background: #ffffff;

  .title {
    margin-bottom: 16rpx;
    color: #333333;
    font-size: 28rpx;
    font-weight: 700;
  }

  .desc {
    color: #666666;
    font-size: 24rpx;
    font-weight: 400;
  }

  .app-tags {
    .tag {
      padding: 12rpx 24rpx;
      border-radius: 28rpx;
      color: #666666;
      font-size: 24rpx;
      font-weight: 400;
      background: #f8f8f8;
    }
  }

  .player {
    padding: 8rpx 16rpx 8rpx 8rpx;
    width: 354rpx;
    height: 64rpx;
    border-radius: 40rpx;
    background: #f8f8f8;

    .icon-play {
      width: 48rpx;
      height: 48rpx;
    }

    .icon-sound {
      width: 172rpx;
      height: 32rpx;
    }

    .time {
      color: #666666;
      font-size: 24rpx;
      font-weight: 400;
    }
  }

  .recognized-text {
    margin-top: 20rpx;
    padding: 16rpx;
    background: #f8f8f8;
    border-radius: 12rpx;

    .text-title {
      color: #333333;
      font-size: 28rpx;
      font-weight: 500;
      margin-bottom: 8rpx;
    }

    .text-content {
      color: #666666;
      font-size: 26rpx;
      line-height: 1.5;
      word-break: break-all;
    }
  }
}

.sbmit-btn {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 114rpx;
  margin: auto;
  border-radius: 50%;
  width: 152rpx;
  height: 152rpx;
  background: #666666;
  box-shadow: 0 0 32rpx 0 #bababa40;
  z-index: 1;

  &::after {
    border: none;
  }

  .inner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border-radius: 50%;
    width: 52rpx;
    height: 52rpx;
    background: #ffffff;
  }
}

.prompt-layer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 5;

  .prompt-popup {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 220rpx;
    // line-height: 200rpx;
    color: #000000;
    font-size: 28rpx;
    font-weight: 400;
    text-align: center;

    &::after {
      content: '';
      position: absolute;
      left: -10%;
      bottom: -52%;
      border-radius: 50%; //顶部圆弧，底部圆弧： 0 0 50% 50%
      width: 120%;
      height: 185%;
      background: #cccccc;
      z-index: -1;
    }
  }
}
</style>
