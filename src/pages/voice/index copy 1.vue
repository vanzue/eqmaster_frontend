initRecorderManager() {
  voicManager.onRecognize = (res) => {
    this.text = res.result;
  }
  
  voicManager.onStop = async (res) => {
    let text = res.result;
    if(text === '') {
    console.log('没有说话');
    return;
    }

    this.anasLoadingObj = {
    loading: true,
    text: "",
    };

    if (this.isCanceling) {
    console.log("Recording was canceled");
    this.resetRecording();
    this.anasLoadingObj.loading = false;
    return;
    }

    try {
      // const transcript = await this.uploadAndRecognizeSpeech(path);
      if (text.length === 0) {
        this.isCanceling = true;
        console.log("record is none, canceling...");
        this.resetRecording(); // 重置录音状态
        uni.showToast({
          title: "没有听清楚",
          icon: "none",
        });
        this.anasLoadingObj.loading = false;
        return; // 直接返回，避免后续逻辑执行
      }
      const newMessage = {
        role: "user",
        // content: transcript,
        content: text,
        shouldAnimate: false,
      };
      this.chattingHistory.push(newMessage);
      this.allHistory.push(newMessage);
      this.$nextTick(() => {
        setTimeout(() => {
          newMessage.shouldAnimate = true;
          this.anasLoadingObj.text = "正在分析中";
        }, 50);
      });
      this.sendMessageNavShow = false;
      const validChats = filterChatHistory(this.allHistory);
      const judgeResult = await reply(validChats, "1");


      await this.handleRecorderReply(judgeResult);
      this.anasLoadingObj.loading = false;
    } catch (error) {
      this.anasLoadingObj.loading = false;
      this.sendMessageNavShow = true;
      if (this.chattingHistory.length > 0) {
        this.chattingHistory.pop();
      }
    }
  });
},