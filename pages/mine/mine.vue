<template>
  <view class="mine">
    <qb-header :navigationBarStyle='sty'></qb-header>
    <view style="position: relative;">
      <!-- 顶部信息栏 -->
      <view class="header" @click="mrevise">
        <image :src="head" mode="" class="pic01"></image>
        <view class="pic02">
          <view class="userName">{{ userName }}</view>
          <view class="userPhone">{{userPhone}}</view>
        </view>
      </view>
      <!-- 展示数据 -->
      <view class="arc_btm" v-if="isAdmin=='Y' || depts.length!=0">
        <view class="btm_num" v-if="depts.length!=0">
          <view class="txt">
            {{ managers }}
          </view>
          <view class="num">
            店长
          </view>
        </view>
        <view class="btm_num" v-if="isAdmin=='Y' && depts.length==0">
          <view class="txt">
            {{ assistants }}
          </view>
          <view class="num">
            员工总数
          </view>
        </view>
        <view class="btm_num">
          <view class="txt">
            {{ servers }}
          </view>
          <view class="num">
            服务专员
          </view>
        </view>
        <view class="btm_num">
          <view class="txt">
            {{ healthers }}
          </view>
          <view class="num">
            健康专员
          </view>
        </view>
        <view class="btm_num">
          <view class="txt">
            {{ customers }}
          </view>
          <view class="num">
            客户总数
          </view>
        </view>
      </view>
    </view>
    <!-- 页面功能区 -->
    <view class="page" :style="isAdmin=='N'?'margin: 30rpx 30rpx 150rpx;':'margin: 150rpx 30rpx 150rpx;'">
      <view class="myPerson page01" @click="mycus">
        <image src="http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201437528207716.png" mode="" class="pic04"></image>
        <view class="font01">我的客户</view>
        <view class="jiantou"></view>
      </view>
      <view class="myPerson page01" @click="myManagers" v-if="depts.length!=0">
        <image src="http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201437528207716.png" mode="" class="pic04"></image>
        <view class="font01">店长列表</view>
        <view class="jiantou"></view>
      </view>
      <view class="myPerson" @click="myHealthy" v-if="isAdmin=='Y'">
        <image src="http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201438386483843.png" mode="" class="pic04"></image>
        <view class="font01">健康专员</view>
        <view class="jiantou"></view>
      </view>
      <view class="myPerson" @click="myServicer" v-if="isAdmin=='Y'">
        <image src="http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201438386483843.png" mode="" class="pic04"></image>
        <view class="font01">服务专员</view>
        <view class="jiantou"></view>
      </view>
      <view class="myPerson page03" @click="logout">
        <image src="http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201439126852785.png" mode="" class="pic04"></image>
        <view class="font01">退出登录</view>
        <view class="jiantou"></view>
      </view>
    </view>
    <uni-popup ref="popup" type="center">
      <view class="pop">
        <view class="sus_txt">
          退出
        </view>
        <view class="con_txt">
          确定要退出登录吗?
        </view>
        <view class="btm">
          <view class="yes" @click.stop="jump">
            确定
          </view>
          <view class="no" @click.stop="close">
            取消
          </view>
        </view>
      </view>
    </uni-popup>
    <qb-footer :choose="2"></qb-footer>
  </view>
</template>

<script>
import qbFooter from "@/components/qb-footer.vue";
import { mapState } from "vuex";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import pakTool from "@/common/utils/utility.js"; // 调用接口
import qbHeader from "@/components/header.vue";
export default {
  data() {
    return {
      isAdmin: "", //判断是否是店长
      userName: "",
      userPhone: "",
      head: "",
      erweima: "",
      sty: {},
      depts: uni.getStorageSync("depts"), // 是否是经销商
      managers: 0, // 店长
      assistants: 0, // 员工人数
      servers: 0, // 服务专员
      healthers: 0, // 健康专员
      customers: 0 // 客户人数
    };
  },
  components: {
    uniPopup,
    qbFooter,
    qbHeader
  },
  computed: { ...mapState(["avatar_url", "user_name", "level_type"]) },
  onLoad(options) {
    this.isAdmin = uni.getStorageSync("isAdmin");
    this.tableData = uni.getStorageSync("user");
    this.userPhone = uni.getStorageSync("phone");
    this.userName = this.tableData.nickname;
    this.head = this.tableData.icon;
  },
  onShow() {
    // 获取数据
    this.getData();
  },
  methods: {
    // 获取数据
    getData() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {};
      pakTool.request(this, "/madyApp/getCenterData", requestPak).then(res => {
        let { data } = res;
        this.assistants = data.assistants; // 员工人数
        this.customers = data.customers; // 客户人数
        this.healthers = data.healthers; // 健康专员
        this.managers = data.managers; // 店长
        this.servers = data.servers; // 服务专员
        console.log(data);
      });
    },
    // 修改信息
    mrevise() {
      uni.navigateTo({
        url: "/pages/mine/mrevise"
      });
    },
    // 我的客户
    mycus() {
      let index;
      if (this.depts.length != 0 || this.isAdmin == "Y") {
        index = 1;
      } else {
        index = 0;
      }
      uni.navigateTo({
        url: "/pages/manage/manage?index=" + index
      });
    },
    // 店长管理
    myManagers() {
      uni.navigateTo({
        url: "/pages/mine/managers"
      });
    },
    // 健康专员管理
    myHealthy() {
      uni.navigateTo({
        url: "/pages/mine/healthy"
      });
    },
    // 服务专员管理
    myServicer() {
      uni.navigateTo({
        url: "/pages/mine/servicer"
      });
    },
    // 注销
    logout() {
      this.$refs.popup.open();
    },
    // 取消返回当前页面
    close() {
      this.$refs.popup.close();
    },
    // 确定退出登录回到登陆页面
    jump() {


      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        loginPhoneNum: uni.getStorageSync("phone")
      };

      pakTool.request(this,"/customerApp/logout",requestPak).then((res) => {

        const {
          code,
          message
        } = res

        if (code == 200) {
            uni.showToast({
              title: '退出成功',
              success:function () {
                // 清除缓存
                uni.clearStorageSync();
                uni.reLaunch({
                  url: "/pages/empower/empower"
                });
              }
            });
        }
        else {
            uni.showToast({
                title: message,
                icon: 'none'
            })
        }

      })
    }
  }
};
</script>

<style lang="scss" scoped>
.mine {
  min-height: 100%;
  background-color: #f7f7f7;
  background-image: url(../../static/mine/bgc.png);
  background-repeat: no-repeat;
  background-size: 100% 460rpx;
  // 顶部信息栏
  .header {
    // width: 100%;
    height: 320rpx;
    box-sizing: border-box;
    padding: 45rpx 30rpx;
    display: flex;
    align-items: center;
    position: relative;

    .pic01 {
      width: 130rpx;
      height: 130rpx;
      background-color: #ffffff;
      border-radius: 50%;
      margin-right: 20rpx;
    }

    .pic02 {
      // width: 45%;
      height: 130rpx;
      position: relative;
      top: 15rpx;

      .userName {
        font-size: 34rpx;
        color: #84571a;
        font-weight: bold;
        padding-bottom: 10rpx;
        letter-spacing: 0.72rpx;
        margin: 0 20rpx;
      }

      .userPhone {
        font-size: 32rpx;
        color: #84571a;
        padding-bottom: 10rpx;
        margin: 0 20rpx;
      }
    }

    .pic03 {
      width: 130rpx;
      height: 130rpx;
      background-color: #ffffff;
    }
  }

  // 展示数据
  .arc_btm {
    position: absolute;
    bottom: -110rpx;
    width: 92%;
    padding: 50rpx 0;
    margin: 0 30rpx;
    display: flex;
    justify-content: space-around;
    background: #ffffff;
    border-radius: 30rpx;
    box-shadow: 0 4rpx 24rpx 12rpx rgba(133, 133, 133, 0.1);
    margin-top: 20rpx;

    .btm_num {
      flex: 0 0 20%;

      .txt {
        text-align: center;
        color: #c59a76;
        font-size: 36rpx;
      }

      .num {
        text-align: center;
        font-size: 28rpx;
      }
    }
  }

  //页面功能区
  .page {
    border-radius: 30rpx;
    background-color: #ffffff;
    box-shadow: 0px 2px 12px 6px rgba(133, 133, 133, 0.1);
    box-sizing: border-box;

    > view:nth-child(6) {
      border-bottom: 0;
    }

    .myPerson {
      width: 100%;
      height: 110rpx;
      background-color: #ffffff;
      padding: 0 34rpx 0 30rpx;
      border-bottom: 2rpx solid #eeeeee;
      box-sizing: border-box;

      .font01 {
        font-size: 32rpx;
        font-weight: bold;
        line-height: 110rpx;
        color: #333333;
        float: left;
      }

      .pic04 {
        width: 40rpx;
        height: 44rpx;
        float: left;
        position: relative;
        top: 34rpx;
        padding-right: 20rpx;
      }

      .jiantou {
        float: right;
        position: relative;
        top: 40rpx;
      }
    }

    .page01 {
      border-radius: 30rpx 30rpx 0 0;
    }

    .page03 {
      border-radius: 0 0 30rpx 30rpx;
    }
  }

  .jiantou {
    width: 20rpx;
    height: 20rpx;
    border-top: 4rpx solid #cccccc;
    border-right: 4rpx solid #cccccc;
    transform: rotate(45deg);
  }

  //弹窗
  .pop {
    width: 605rpx;
    height: 463rpx;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 20rpx;

    .sus_txt {
      font-size: 36rpx;
      color: #c59a76;
      margin-bottom: 70rpx;
    }

    .con_txt {
      margin-bottom: 90rpx;
    }

    .btm {
      .yes {
        width: 237rpx;
        height: 82rpx;
        line-height: 82rpx;
        text-align: center;
        background-color: #c59a76;
        color: #ffffff;
        border-radius: 44rpx;
        float: left;
        margin-right: 25rpx;
      }

      .no {
        width: 237rpx;
        height: 82rpx;
        line-height: 82rpx;
        text-align: center;
        background-color: #ffffff;
        color: #c59a76;
        border-radius: 44rpx;
        border: 1rpx solid #c59a76;
        float: left;
      }
    }
  }
}
</style>
