<template>
	<view class="page-container">
		<!-- 主要按钮 -->
		<button 
			@touchstart="streamRecord" 
			@touchend="endStreamRecord" 
			type="primary"
			class="voice-btn">
			按住说话
		</button>

		<!-- 识别结果 -->
		<view class="result-text"> 
			语音识别内容：{{currentText}} 
		</view>
 
		<!-- 语音音阶动画 -->
		<view class="prompt" v-if="animation">
			<section class="dots-container">
				<view class="dot"></view>
				<view class="dot"></view>
				<view class="dot"></view>
				<view class="dot"></view>
				<view class="dot"></view>
			</section>
			<text>录音中...</text>
		</view>

		<!-- 新增：录音历史列表 -->
		<view class="history-container">
			<view class="history-title">录音历史</view>
			<view class="history-list">
				<view v-for="(item, index) in recordHistory" :key="index" class="history-item">
					<view class="history-info">
						<text class="history-text">{{item.text || '无识别文字'}}</text>
						<text class="history-time">{{formatDuration(item.duration)}}</text>
					</view>
					<button 
						@tap="playHistoryVoice(item.filePath)" 
						:disabled="isPlaying"
						type="default" 
						size="mini"
						class="history-play-btn">
						{{ (isPlaying && currentPlayingIndex === index) ? '播放中...' : '播放' }}
					</button>
				</view>
				<view v-if="recordHistory.length === 0" class="no-history">
					暂无录音历史
				</view>
			</view>
		</view>
	</view>
</template>
 
<script>
	var plugin = requirePlugin("WechatSI")
	let manager = plugin.getRecordRecognitionManager()
	export default {
		data() {
			return {
				currentText: "",
				animation: false,
        // 新增：录音相关数据
        tempFilePath: '', // 录音文件路径
        duration: 0,     // 录音时长
        isPlaying: false, // 是否正在播放
        // 新增：录音历史数组
        recordHistory: [],
        currentPlayingIndex: -1
			}
		},
		methods: {
			// 检查并请求录音权限
			checkRecordAuth() {
				return new Promise((resolve, reject) => {
					uni.getSetting({
						success: (res) => {
							console.log('权限状态:', res.authSetting['scope.record'])
							
							// 首次使用，未发起过授权请求
							if (!res.authSetting['scope.record']) {
								uni.authorize({
									scope: 'scope.record',
									success: () => {
										console.log('用户同意授权录音')
										resolve(true)
									},
									fail: (err) => {
										console.log('用户拒绝授权录音:', err)
										this.showAuthModal()
										reject(err)
									}
								})
							}
							// 已拒绝授权
							else if (res.authSetting['scope.record'] === false) {
								this.showAuthModal()
								reject(new Error('未获得录音权限'))
							}
							// 已授权
							else {
								resolve(true)
							}
						},
						fail: (err) => {
							console.error('获取授权信息失败:', err)
							reject(err)
						}
					})
				})
			},

			// 显示权限说明弹窗
			showAuthModal() {
				uni.showModal({
					title: '需要录音权限',
					content: '请在设置中开启录音权限，以便使用语音识别功能',
					confirmText: '去设置',
					success: (res) => {
						if (res.confirm) {
							uni.openSetting({
								success: (res) => {
									console.log('打开设置页面:', res.authSetting)
								}
							})
						}
					}
				})
			},

			// 修改开始录音方法
			async streamRecord() {
				try {
					// 先检查权限
					await this.checkRecordAuth()
					
					// 有权限后开始录音
					console.log('开始录音')
					this.animation = true
					manager.start({
						lang: 'zh_CN',
					})
					this.startRecording()
				} catch (err) {
					console.error('录音启动失败:', err)
					uni.showToast({
						title: '无法使用录音功能',
						icon: 'none'
					})
				}
			},

			endStreamRecord: function() {
				this.animation = false;
				console.log('结束录音')
				manager.stop()
        // 新增：同时停止录音
        this.recorder.stop()
			},
			initRecord: function() {
				//有新的识别内容返回，则会调用此事件
				manager.onRecognize = (res) => {
					let text = res.result
					this.currentText = text
				}
				// 识别结束事件
				manager.onStop = (res) => {
					console.log(res, 37);
					let text = res.result
					if (text == '') {
						console.log('没有说话')
						return
					}
					this.currentText = text
				}
			},

      // 新增：初始化录音管理器
      initRecorder() {
        this.recorder = uni.getRecorderManager()
        
        this.recorder.onStart(() => {
          console.log('录音开始')
        })
        
        this.recorder.onStop((res) => {
          console.log('录音结束，完整返回数据:', res)
          console.log('文件路径:', res.tempFilePath)
          console.log('录音时长:', res.duration)
          console.log('当前识别文字:', this.currentText)
          
          if (res.tempFilePath && res.duration > 0) {
            const newRecord = {
              filePath: res.tempFilePath,
              duration: res.duration,
              text: this.currentText,
              time: new Date().toLocaleTimeString()
            }
            console.log('准备添加新录音:', newRecord)
            this.recordHistory.unshift(newRecord)
            console.log('添加后的历史记录:', this.recordHistory)
          } else {
            console.log('录音无效，未保存')
          }
        })
        
        this.recorder.onError((res) => {
          console.error('录音错误:', res)
          uni.showToast({
            title: '录音失败',
            icon: 'none'
          })
        })
      },

      // 新增：开始录音
      startRecording() {
        this.isRecording = true
        this.currentText = ''
        
        // 开始录音
        this.recorder.start({
          duration: 60000, // 最长录音时长，单位ms
          sampleRate: 16000,
          numberOfChannels: 1,
          encodeBitRate: 96000,
          format: 'mp3',
          frameSize: 50
        })
      },

      // 新增：播放历史录音
      playHistoryVoice(filePath) {
        if (this.isPlaying) return
        
        this.isPlaying = true
        const index = this.recordHistory.findIndex(item => item.filePath === filePath)
        this.currentPlayingIndex = index
        
        const innerAudioContext = uni.createInnerAudioContext()
        innerAudioContext.src = filePath
        
        innerAudioContext.onPlay(() => {
          console.log('开始播放历史录音')
        })
        
        innerAudioContext.onEnded(() => {
          console.log('播放结束')
          this.isPlaying = false
          this.currentPlayingIndex = -1
          innerAudioContext.destroy()
        })
        
        innerAudioContext.onError((res) => {
          console.error('播放错误:', res)
          this.isPlaying = false
          this.currentPlayingIndex = -1
          innerAudioContext.destroy()
          uni.showToast({
            title: '播放失败',
            icon: 'none'
          })
        })
        
        innerAudioContext.play()
      },

      // 新增：格式化时长显示
      formatDuration(duration) {
        const seconds = Math.floor(duration / 1000)
        return `${seconds}秒`
      }
		},
		onLoad() {
			this.initRecord()
      // 新增：初始化录音管理器
      this.initRecorder()
		},
    // 新增：页面卸载时清理资源
    onUnload() {
      if (this.recorder) {
        this.recorder.stop()
      }
    }
	}
</script>
 
<style lang="scss" scoped>
	/* 新增基础样式 */
	.page-container {
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	/* 主按钮样式 */
	.voice-btn {
		width: 300rpx !important; /* 强制设置宽度 */
		height: 300rpx !important; /* 强制设置高度 */
		border-radius: 50% !important; /* 圆形按钮 */
		display: flex !important;
		align-items: center !important;
		justify-content: center !important;
		margin: 30rpx auto !important; /* 居中显示 */
		font-size: 32rpx !important;
	}

	/* 识别结果文本样式 */
	.result-text {
		padding: 20rpx;
		background-color: #f5f5f5;
		border-radius: 8rpx;
		margin: 20rpx 0;
	}

	/* 录音播放区域样式 */
	.audio-box {
		margin: 20rpx 0;
		padding: 20rpx;
		background: #f5f5f5;
		border-radius: 8rpx;
		display: flex;
		align-items: center;
		gap: 20rpx;

		.play-btn {
			min-width: 160rpx !important;
			margin: 0 !important;
		}

		.duration {
			font-size: 26rpx;
			color: #666;
		}
	}

	/* 原有的动画样式 */
	.prompt {
		width: 100%;
		height: 160rpx;
		position: fixed;
		bottom: 50vh;
		z-index: 100; /* 确保动画显示在最上层 */
	}
 
	.prompt text {
		position: absolute;
		bottom: 2px;
		color: white;
		left: calc(45%);
		animation: puls 1.5s infinite ease-in-out;
	}
 
	.dots-container {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80px;
		width: 45%;
		position: absolute;
		bottom: 0px;
		left: calc(27.5%);
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 40rpx;
	}
 
	.dot {
		height: 28rpx;
		width: 28rpx;
		margin-right: 20rpx;
		border-radius: 20rpx;
		background-image: linear-gradient(#5396FF, #AEDAFF);
		animation: pulse 1.5s infinite ease-in-out;

		&:last-child {
			margin-right: 0;
		}

		&:nth-child(1) {
			animation-delay: -0.3s;
		}

		&:nth-child(2) {
			animation-delay: -0.1s;
		}

		&:nth-child(3) {
			animation-delay: 0.1s;
		}
	}
 
	@keyframes pulse {
		0% {
			transform: scale(0.8);
			background-color: #66A3FF;
			box-shadow: 0 0 0 0 rgba(102, 163, 255, 0.7);
		}
 
		50% {
			transform: scale(1.2);
			background-color: #ADD8FF;
			box-shadow: 0 0 0 10px rgba(174, 218, 255, 0);
		}
 
		100% {
			transform: scale(0.8);
			background-color: #66A3FF;
			box-shadow: 0 0 0 0 rgba(102, 163, 255, 0.7);
		}
	}
 
	@keyframes puls {
		0% {
			transform: translateY(0px)
		}
 
		50% {
			transform: translateY(-4px)
		}
 
		100% {
			transform: translateY(0px)
		}
	}

	/* 新增：历史记录样式 */
	.history-container {
		margin-top: 30rpx;
		padding: 20rpx;
		background: #fff;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
	}

	.history-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
		padding-bottom: 16rpx;
		border-bottom: 1px solid #eee;
	}

	.history-list {
		.history-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0;
			border-bottom: 1px solid #f5f5f5;

			&:last-child {
				border-bottom: none;
			}
		}

		.history-info {
			flex: 1;
			margin-right: 20rpx;
		}

		.history-text {
			font-size: 28rpx;
			color: #333;
			margin-bottom: 8rpx;
			display: block;
		}

		.history-time {
			font-size: 24rpx;
			color: #999;
		}

		.history-play-btn {
			min-width: 120rpx !important;
			margin: 0 !important;
		}
	}

	.no-history {
		text-align: center;
		color: #999;
		font-size: 28rpx;
		padding: 40rpx 0;
	}
</style>
