// src/components/SProgressBar.vue
<template>
  <view class="container-sprogress">
    <canvas :id="canvasId" :canvas-id="canvasId" class="progress-canvas" @tap="handleCanvasTap"></canvas>
  </view>

  
</template>

<script>
  import SProgressBarScript from './SProgressBarScript.js';

  export default {
    ...SProgressBarScript
  };
</script>

<style scoped>
  .container-sprogress {
    width: 100%;
    overflow-x: hidden;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    background-color: #2F2F38;
    margin-right: 3rpx;
  }

  .progress-canvas {
    width: 100%;
    height: 1100rpx;
  }
</style>