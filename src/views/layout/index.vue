<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main id="mask" />
      <right-panel v-if="showSettings" button-bom="0">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  created() {
    const user = this.$store.getters.name
    this.setWatermark(user)
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    setWatermark(str) {
      const id = 'mask'
      if (document.getElementById(id) !== null) {
        document.body.removeChild(document.getElementById(id))
      }
      const can = document.createElement('canvas')
      can.width = 140
      can.height = 90
      const cans = can.getContext('2d')
      cans.rotate(-20 * Math.PI / 180)
      cans.font = '18px Vedana'
      cans.fillStyle = 'rgba(200, 200, 200, 0.2)'
      cans.textAlign = 'left'
      cans.textBaseline = 'Middle'
      cans.fillText(str, can.width / 100, can.height / 2)

      const div = document.createElement('div')
      div.id = id
      div.style.pointerEvents = 'none'
      div.style.top = '0'
      div.style.left = '0'
      div.style.position = 'fixed'
      div.style.zIndex = '4'
      div.style.width = '100%'
      div.style.height = '100%'
      // console.log(div)
      div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
      document.body.appendChild(div)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px)
}

.mobile .fixed-header {
  width: 100%;
}

</style>
