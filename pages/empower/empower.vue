<template>
  <view class="home" @click.stop='empowerClick'>
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" style="border-radius: 20rpx;overflow: hidden;">
      <swiper-item v-for="item in piclist" :key='item'>
        <image :src="item.pic" mode=""></image>
      </swiper-item>
    </swiper>
    <view class="content-top">
      <view class="content-top-left">
        <image src="https://jk.laohaowaner.com/yhdresource/upload/imgs/home_add.png" class="pic" mode=""></image>
        <view class="tianjia">
          添加客户
        </view>
      </view>
      <view class="content-top-right">
        <image src="https://jk.laohaowaner.com/yhdresource/upload/imgs/home_manager.png" class="pic" mode=""></image>
        <view class="guanli">
          客户管理
        </view>
      </view>
    </view>
    <view class="empower-bg">
      <text class="empower">授权登录</text>
    </view>
    <!-- 导航 -->
    <view class="footer">
      <block>
        <view class="footer_item" hover-class="none">
          <view class='footer_item_icon is_select_icon'></view>
          <text class='footer_item_text is_select_text'>首页</text>
        </view>
      </block>
      <block>
        <view class="footer_item" hover-class="none">
          <view class='footer_item_icon un_select_icon'></view>
          <text class='footer_item_text un_select_text'>我的</text>
        </view>
      </block>
    </view>
    <!-- 弹窗 -->
    <uni-popup ref="popup" type="center">
      <view class="pop">
        <image src="../../static/images/perfect.png" mode=""></image>
        <view class="sus_txt">
          授权登录
        </view>
        <view class="con_txt">
          授权才能享受更好的体验
        </view>
        <view class="btm">
          <button class='yes' @getuserinfo='onGotUserInfo' open-type="getUserInfo">点击授权</button>
          <button class="no" @click.stop="close">残忍拒绝</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import config from "../../common/config/config.js";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import pakTool from "../../common/utils/utility.js";

import { mapState, mapMutations } from "vuex";
export default {
  components: {
    uniPopup
  },
  data() {
    return {
      piclist: [], // 轮播图
      code: ""
    };
  },

  onLoad(options) {
    this.gethome();
    // console.log(options);
    // this.sence = options.scene;
    // console.log(`parent_id---${this.sence}`);
    // #ifdef H5
    // 做会员页微信认证
    document.title = "页面跳转中…";

    // #endif
    // #ifdef MP-WEIXIN
    // 微信认证
    // this.showMpWeixin = true;
    let admin_id = uni.getStorageSync("admin_user_id");
    let wxMemberId = uni.getStorageSync("wx_memberId");
    console.log(admin_id + "======" + wxMemberId);
    if (admin_id && wxMemberId) {
      console.log("21312312222222222222222222");
      uni.switchTab({
        url: "/pages/home/home"
      });
    } else {
      if (uni.getStorageSync("user")) {
        // 如果已有缓存则直接进首页
        uni.showLoading({
          title: "登陆中..."
        });
        // app.globalData.userInfo = uni.getStorageSync("user");
        setTimeout(() => {
          uni.hideLoading();
          uni.redirectTo({
            url: "/pages/login/login"
          });
        }, 500);
      } else {
        this.getWxSessionKey();
      }
    }
    // #endif
  },

  onShow() {},
  onReady() {},
  methods: {
    // 获取首页轮播图
    gethome() {
      let requestPak = pakTool.createRequestPak();
      console.log(requestPak);
      requestPak.requestBody = {
        encryptedData: ""
      };
      pakTool
        .request(this, "/madyApp/getHomePageInfo", requestPak)
        .then(res => {
          const { data } = res;
          this.piclist = data;
        });
    },
    // 授权登录
    empowerClick() {
      this.$refs.popup.open();
    },
    // 取消授权
    close() {
      this.$refs.popup.close();
    },
    // 微信登录 获取sessionKey
    getWxSessionKey() {
      wx.login({
        success: res => {
          console.log(res);
          this.code = res.code;
          let requestPak = pakTool.createRequestPak();
          console.log(requestPak);
          requestPak.requestBody = {
            encryptedData: "",
            iv: "",
            code: res.code,
            shareUserId: 1
          };
          pakTool
            .request(this, "customerApp/getWxSessionKey", requestPak)
            .then();
        }
      });
    },
    // 获取用户信息时
    onGotUserInfo(e) {
      console.log(e);
      let that = this;
      if (e.detail.errMsg != "getUserInfo:ok") {
        // 'getUserInfo:ok' 'getUserInfo:fail auth deny'
        setTimeout(() => {
          this.closeDialog();
        }, 100);
        return;
      }
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        code: that.code,
        shareUserId: 1
      };
      console.log("-------------weixinLogin---------");
      console.log(requestPak);
      pakTool.requestRest(
        requestPak,
        "customerApp/weixinLogin",
        function(responsePak) {
          console.log(responsePak, 999999);
          console.log(responsePak.resultBody);
          if (responsePak.resultBody) {
            // responsePak.resultBody.wxUserInfo.guid = responsePak.resultBody.wxUserInfo.id;
            // app.globalData.userInfo = responsePak.resultBody.wxUserInfo;
            uni.setStorageSync("user", responsePak.resultBody);
            uni.redirectTo({
              url: "/pages/login/login"
            });
          } else {
            wx.showToast({
              icon: "none",
              title: responsePak.resultBody.message
            });
          }
        },
        function(err) {
          wx.showToast({
            icon: "none",
            title: err.msg //'服务器开小差，请重试~',
          });
        }
      );
    },
    // 取消授权
    closeDialog(ev) {
      // dialog.confirmEnterDefault(this);
      uni.showToast({
        title: "取消授权",
        icon: "none",
        duration: 1500
      });
    }
  }
};
</script>

<style lang="less" scoped>
.home {
  min-height: 100%;
  overflow: hidden;
  swiper {
    margin: 46rpx 30rpx;
    // width: 100%;
    height: 300rpx;
    box-sizing: border-box;
    swiper-item {
      width: 100%;
      height: 100%;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .empower-bg {
    padding: 50rpx 30rpx;
    width: 100%;
    height: 300rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;

    .empower {
      background: #c59a76;
      border-radius: 25rpx;
      padding: 26rpx 80rpx;
      color: #fff;
    }
  }

  .detail {
    width: 200px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: #cdcdcd;
    position: relative;
    top: 10px;
    left: 80px;
    border: 1px solid yellow;
  }

  .content-top {
    display: flex;
    justify-content: space-between;
    padding-left: 30rpx;
    padding-right: 30rpx;

    .content-top-left {
      flex: 0 0 47%;
      height: 210rpx;
      background-color: #ffe5df;
      border-radius: 20rpx !important;

      //padding-top: 71px;
      // float: left;
      .pic {
        width: 86rpx;
        height: 86rpx;
        position: relative;
        top: 32rpx;
        left: 116rpx;
      }

      .tianjia {
        width: 100%;
        height: 68rpx;
        background-color: #fff4f1;
        border-radius: 0 0 20rpx 20rpx;
        text-align: center;
        line-height: 68rpx;
        position: relative;
        top: 56rpx;
      }
    }

    .content-top-right {
      flex: 0 0 47%;
      height: 210rpx;
      background-color: #ffebd4;
      border-radius: 20rpx !important;

      .pic {
        width: 86rpx;
        height: 86rpx;
        position: relative;
        top: 32rpx;
        left: 116rpx;
      }

      .guanli {
        width: 100%;
        height: 68rpx;
        background-color: #fff4e7;
        border-radius: 0 0 20rpx 20rpx;
        text-align: center;
        line-height: 68rpx;
        position: relative;
        top: 56rpx;
      }
    }
  }
  // 底部导航
  .footer {
    position: fixed;
    bottom: 0;
    padding-bottom: env(safe-area-inset-bottom);
    width: 100%;
    height: 100rpx;
    line-height: 100rpx;
    display: flex;
    justify-content: space-around;
    background-color: white;
    box-shadow: 0px -1rpx 1rpx 0px rgba(229, 229, 229, 0.5);
    .footer_item {
      width: 212rpx;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .footer_item_icon {
        width: 46rpx;
        height: 46rpx;
      }
      .footer_item_text {
        font-size: 22rpx;
        line-height: 28rpx;
      }
    }
    .is_select_icon {
      background: url("../../static/tabbar/home_active.png") no-repeat;
      background-size: 100% 100%;
    }
    .un_select_icon {
      background: url(../../static/tabbar/mine.png) no-repeat;
      background-size: 100% 100%;
    }
    .is_select_text {
      color: #c59a76;
    }
    .un_select_text {
      color: #373434;
    }
  }

  //弹窗
  .pop {
    width: 605rpx;
    height: 580rpx;
    background-color: #ffffff;
    position: relative;
    border-radius: 20rpx;
    display: table;
    image {
      width: 206rpx;
      height: 206rpx;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -10%);
    }

    .sus_txt {
      font-size: 36rpx;
      color: #c59a76;
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .con_txt {
      color: #333333;
      margin: 50% auto 0;
      text-align: center;
    }

    .btm {
      display: flex;
      justify-content: space-around;
      padding: 0 30rpx;
      margin-top: 96rpx;

      .yes {
        padding: 5rpx 30rpx;
        display: inline-block;
        background-color: #c59a76;
        color: white;
        border-radius: 44rpx;
        font-size: 32rpx;
      }

      .no {
        padding: 5rpx 30rpx;
        background-color: #ffffff;
        display: inline-block;
        color: #c59a76;
        border-radius: 44rpx;
        box-sizing: border-box;
        border: 2rpx solid #c59a76;
        font-size: 32rpx;
      }
    }
  }
}
</style>
