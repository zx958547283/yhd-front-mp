<template>
  <view class="mine">
    <view class="list">
      <view class="text">姓名</view>
      <input type="text" value="userName" class="userPhone" v-model="userName" />
    </view>
    <view class="list">
      <view class="text">手机号码</view>
      <input type="text" value="userPhone" class="userPhone" v-model="userPhone" maxlength="11" />
    </view>
    <button type="primary" @click="save" class="baocun">保存</button>
  </view>
</template>

<script>
import pakTool from "../../common/utils/utility.js";
export default {
  data() {
    return {
      userName: "", // 名字
      userPhone: "", // 手机
      id: "", // 账户id
      head: "", // 头像
      head_url: "", // 传后台
    };
  },
  onLoad(option) {
    console.log(option);
    this.id = option.id; // 账户id
    this.userName = option.username; // 姓名
    this.userPhone = option.mobile; // 手机
  },
  methods: {
    //保存上传
    save() {
      if (!/^1[3456789]\d{9}$/.test(this.userPhone)) {
        uni.showToast({
          title: "手机号码有误，请重填",
          icon: "none",
          duration: 2000,
        });
        return false;
      }
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        id: this.id, // 账户id
        mobile: this.userPhone, // 手机
        username: this.userName, // 姓名
      };
      pakTool
        .request(this, "customerApp/updateAdmin", requestPak)
        .then((res) => {
          const { data, code, message } = res;
          if (code == 200) {
            uni.showToast({
              title: "保存成功",
              success: function () {
                uni.switchTab({
                  url: "/pages/mine/mine",
                });
              },
            });
          } else {
            uni.showToast({
              title: message,
              icon: "none",
            });
          }
        });
    },
  },
};
</script>

<style lang="scss">
.mine {
  width: 100%;
  height: 100%;
  background-color: #fff;

  .list {
    width: 100%;
    height: 100rpx;
    padding: 0 30rpx;
    box-sizing: border-box;

    .text {
      float: left;
      margin-right: 70rpx;
      line-height: 100rpx;
      height: 100rpx;
      width: 25%;
    }

    .userPhone {
      float: left;
      height: 100rpx;
    }
  }

  .baocun {
    width: 90%;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    background-color: #c59a76;
    position: absolute;
    left: 50%;
    bottom: 150rpx;
    transform: translate(-50%, -50%);
  }
}
</style>
