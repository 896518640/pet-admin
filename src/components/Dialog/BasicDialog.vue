<template>
  <transition name="dialog-fade">
    <!--self：事件修饰符，只有点击自己才触发，点击子元素不触发  -->
    <div v-show="visible" class="cat-dialog__wrapper" @click.self="handleClose">
      <!-- 对话框 -->
      <div class="cat-dialog" :style="{ width, marginTop: top }">

        <!-- 对话框顶部 标题 + 关闭按钮 -->
        <div class="cat-dialog__header">
          <slot name="title">
            <span class="cat-dialog__title">{{ title }}</span>
          </slot>
          <button class="cat-dialog__headerbtn" @click="handleClose">
            <i class="el-icon-close" />
          </button>
        </div>

        <!-- 对话框内容 -->
        <div class="cat-dialog__body">
          <slot />
        </div>

        <!-- 对话框底部 一般都是一些操作，没有传入footer插槽就不显示v-if -->
        <div v-if="$slots.footer" class="cat-dialog__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BusicDialog',
  props: {
    title: {
      type: String,
      default: '提示'
    },
    // 弹框宽度
    width: {
      type: String,
      default: '30%'
    },
    // 弹框距离顶部距离
    top: {
      type: String,
      default: '15vh'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose() {
      // visible是父组件传过来的props，子组件不能直接修改，需要子传父
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="scss" scopeds>
.cat-dialog__wrapper{
  position: fixed;
  top:0;
  left: 0;
  right:0;
  bottom:0;
  z-index:2000;
  background: rgba(0,0,0,.3);
  .cat-dialog{
    position: relative;
    background: #fff;
    border-radius: 2px;
    margin: 15vh auto 50px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    box-sizing: border-box;
    width: 30%;
    color: #666;
    height: auto;
    .cat-dialog__header{
      // background: rgba(0,0,0,.01);
      // border-bottom: 1px solid #ddd;
      height: 50px;
      display: flex;
      justify-content: space-between;
      color: #666;
      align-items: center;
      padding: 0 10px;
      // .dialog__title{

      // }
      .cat-dialog__headerbtn{
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: none;
        outline: none;
        border: none;
        cursor: pointer;
      }
    }
    .cat-dialog__body{
      padding: 20px 10px;
      color: #666;
      // display: flex;
    }
    .cat-dialog__footer{
      padding: 5px 10px;
      // background: rgba(48, 41, 41, 0.01);
      // border-top: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
    }
  }
}
// 进入动画
.dialog-fade-enter-active {
  animation: dialog-fade-in 0.4s;
}
// 离开动画
.dialog-fade-leave-active {
  animation: dialog-fade-out 0.4s;
}

@keyframes dialog-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}
</style>

