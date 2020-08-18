<template>
  <view class="mine">
    <view class="list01" @click="upload">
      <view style="border-bottom: 2rpx solid #f7f7f7;width: 100%;height: 100%;">
        <text view class="text01">头像</text>
        <view class="cir">
          <image :src="head" mode="" class="head"></image>
          <!--  <image src="../../static/detail/top-01.png" v-if="head==''" class="cinema" ></image> -->
        </view>
        <view class="jiantou"></view>
      </view>
    </view>
    <view class="list02">
      <view view class="text02">手机号码</view>
      <!-- <view class="userPhone">{{}}</view> -->
      <input type="text" value="userPhone" class="userPhone" v-model="userPhone" />
    </view>
    <button type="primary" @click="save" class="baocun">保存</button>
  </view>
</template>

<script>
import pakTool from "../../common/utils/utility.js";
export default {
  data() {
    return {
      userPhone: "",
      head: "", //头像
      head_url: "", //传后台
    };
  },
  onLoad() {
    this.head = uni.getStorageSync("user").icon;
    this.userPhone = uni.getStorageSync("phone");
  },
  methods: {
    //头像上传
    upload(e) {
      var that = this;
      uni.chooseImage({
        count: 1,
        sizeType: ["compressed", "camera"],
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          this.head = tempFilePaths[0];
          console.log(this.head);
          uni.uploadFile({
            url: that.config.contextPath + "common/uploadFile",
            filePath: tempFilePaths[0],
            name: "file",
            success: (uploadFileRes) => {
              let temp = JSON.parse(uploadFileRes.data);
              this.head_url = temp.data.fileURL;
            },
          });
        },
      });
    },
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
        member_id: uni.getStorageSync("admin_user_id"), // 用户id
        member_header: this.head_url, // 头像
        phone: this.userPhone, // 手机
      };
      pakTool.request(this, "/madyApp/saveCustomer", requestPak).then((res) => {
        const { data, code } = res;
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
            title: "保存失败",
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
  .list01 {
    width: 100%;
    height: 160rpx;
    padding: 0 30rpx;
    box-sizing: border-box;
    .text01 {
      font-size: 30rpx;
      float: left;
      height: 160rpx;
      line-height: 160rpx;
      padding-right: 140rpx;
    }
    .cir {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 50%;
      overflow: hidden;
      transform: translate(0, -50%);
      position: relative;
      .head {
        width: 100%;
        height: 100%;
      }
      .cinema {
        width: 100rpx;
        height: 100rpx;
        // float: left;
        // position: relative;
        // top: 30rpx;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .jiantou {
      width: 20rpx;
      height: 20rpx;
      border-top: 4rpx solid #cccccc;
      border-right: 4rpx solid #cccccc;
      transform: rotate(45deg);
      float: right;
      position: relative;
      top: -35rpx;
    }
  }
  .list02 {
    width: 100%;
    // height: 160rpx;
    padding: 0 30rpx;
    box-sizing: border-box;
    .text02 {
      float: left;
      margin-right: 70rpx;
      line-height: 100rpx;
      height: 100rpx;
    }
    .userPhone {
      float: left;
      height: 100rpx;
    }
  }
  .list03 {
    width: 100%;
    height: 100rpx;
    padding: 0 30rpx;
  }
  .list04 {
    width: 210rpx;
    height: 210rpx;
    border: 2rpx dashed #d9d9d9;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    top: 30rpx;
    left: 270rpx;
    .xx {
      z-index: 999;
      width: 30rpx;
      height: 30rpx;
      position: absolute;
      top: 0;
      right: 0;
      vertical-align: top;
      transform: translate(50%, -50%);
      image {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
    }
    .squ {
      width: 210rpx;
      height: 210rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      .ppp {
        width: 62rpx;
        height: 50rpx;
        margin: 45rpx 0 40rpx;
      }
      .tianjia {
        font-size: 28rpx;
        color: #c2c2c2;
        text-align: center;
      }
    }
    .head02 {
      width: 100%;
      height: 100%;
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
