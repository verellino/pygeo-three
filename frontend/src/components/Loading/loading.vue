<template>
  <transition name="loading">
    <div v-show="visible" class="loading">
      <div class="loading-wrapper" :style="{ padding: text ? '20px' : '15px' }">
        <v-progress-circular indeterminate></v-progress-circular>
        <span class="loading-text" v-show="text">{{ text }}</span>
      </div>
      <div class="loading-mask" @touchmove.stop.prevent></div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "loading",
  data() {
    return {
      visible: false,
    };
  },
  props: {
    text: String,
  },
};
</script>
<style lang="scss">
.fixbg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.loading {
  transition: opacity 0.2s linear;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  // 看哪种效果好，是否删除下面的
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9000;

  &-wrapper {
    position: fixed;
    left: 50%;
    top: 50%;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    box-sizing: border-box;
    text-align: center;
    z-index: 9000;
  }

  &-text {
    display: block;
    color: #fff;
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
  }

  &-mask {
    position: fixed;
    // size: 100%;
    opacity: 0;
    background: transparent;
    z-index: 3000;
  }
}

.loading-enter,
.loading-leave-active {
  opacity: 0;
}
</style>
