<template>
  <view style="overflow: hidden;">
    <view class="qh">
      <qb-header :navigationBarStyle='sty' custom='true' showBack="true">
        <view style="position: relative;width: 100%;">
          <view style="position: absolute;left: 20rpx;" @click="back">
            <image src="../../static/tabbar/back.png" mode="" style="width: 20rpx;height: 36rpx;;"></image>
          </view>
          <view style="position: absolute;left: 100rpx;" @click="gohome">
            <image src="../../static/tabbar/gohome.png" mode="" style="width: 39rpx;height: 35rpx;;"></image>
          </view>
          <view style="margin: 0 auto;width: 100%;text-align: center;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;width: 300rpx;" @click="more">
            {{detail.title}}
          </view>
        </view>
      </qb-header>
    </view>
    <view class="article" :style="{ margin: ser_top + 'rpx 0 0 0;'}">
      <view style="padding-top: 33rpx;" v-if="detail.media_type==2">
        <video enable-play-gesture='true' :src="detail.media_path" :poster="detail.media_cover_path" style="width: 100%;height: 300rpx;"></video>
      </view>
      <view class="top" :style="detail.media_type==1?'':'border-bottom: 1rpx solid #D8D8D8;'">
        <view class="title">
          {{detail.title}}
        </view>
        <view class="from">
          <text style="color: #333333;margin-right: 20rpx;">昇晟元化</text>
          <text style="color: rgb(195, 195, 195);margin-right: 15rpx;">{{detail.display_time}}</text>
          <text style="color:#8F620C" v-if="detail.is_show_home">#为你推荐</text>
          <!-- <text style="float: right;font-size: 20rpx;">赞</text> -->
        </view>
      </view>
      <view v-if="detail.media_type==1" class='dio'>
        <!-- <audio  @timeupdate = 'timeupdate' style="text-align: left" class="vio" :src="detail.media_path"    :action="audioAction" controls></audio> -->
        <zaudio :info="audiolist" :time='time'></zaudio>

      </view>
      <view class="main" v-html="detail.content">
        {{detail.content}}
      </view>

    </view>
  </view>
</template>

<script>
import qbHeader from "@/components/header.vue";
import zaudio from "@/components/audio/zaudio";
export default {
  components: {
    qbHeader,
    zaudio,
  },
  onLoad(option) {
    // console.log(this.$audio.duration)
    // console.log(option,'option')
    var that = this;
    uni.getSystemInfo({
      success(res) {
        that.phoneHeight = res.windowHeight;
        // 计算组件的高度
        let view = uni.createSelectorQuery().select(".qh");
        // console.log(view)
        view
          .boundingClientRect((data) => {
            let navHeight = data.height;
            const systemInfo = uni.getSystemInfoSync();
            let pxToRpxScale = 750 / systemInfo.windowWidth;
            // 搜索框距离顶部导航的位置
            that.ser_top =
              (navHeight + systemInfo.statusBarHeight) * pxToRpxScale;
            console.log(that.ser_top);
          })
          .exec();
      },
    });
    this.detail = JSON.parse(decodeURIComponent(option.detail));
    console.log(this.detail);
    if (this.detail.media_type == 1) {
      this.audiolist = {
        src: this.detail.media_path,
        title: "昇晟元化音频文件",
        singer: "昇晟元化",
        coverImgUrl: "昇晟元化",
      };
    }
  },
  data() {
    return {
      ser_top: 0,
      detail: {},
      audiolist: {},
      sty: {
        background: "rgb(248, 248, 248)",
        fontColor: "",
        iconColor: "",
        iconText: "", //导航栏文字
      },
    };
  },

  methods: {
    // 顶部导航栏功能
    back() {
      uni.navigateBack({
        delta: "1",
      });
    },
    gohome() {
      uni.switchTab({
        url: "/pages/home/home",
      });
    },
    timeupdate(e) {
      console.log(e);
    },
    getHeight(val) {
      console.log(val.navigationHeight);
      this.mar_top = val.navigationHeight;
    },
  },
};
</script>

<style lang="less" scoped>
.qh {
  position: fixed;
  // position: -webkit-sticky;
  top: 0rpx;
  z-index: 101;
  width: 100%;
}
.article {
  padding: 0 30rpx 20rpx 30rpx;
  .top {
    padding-bottom: 30rpx;
    .title {
      padding-top: 30rpx;
      font-size: 30rpx;
      font-weight: 700;
      color: #333333;
    }
    .from {
      text {
        font-size: 24rpx;
      }
    }
  }
  .dio {
    margin: 10rpx 0 20rpx 0;
    audio {
      display: flex;
      flex-direction: column;
    }
  }

  .main {
    padding: 30rpx 0;
    font-size: 28rpx;
    color: #696969;
    line-height: 40rpx;
  }
}
</style>
