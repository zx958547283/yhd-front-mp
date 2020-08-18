<template>
  <view class="box">
    <!-- 顶部搜索-->
    <!-- <uni-search-bar @ser='ser' placeholder="姓名/电话" :radius="100" :cancelButton="none" @confirm="search"></uni-search-bar> -->
    <view style="height: 140rpx;box-sizing: border-box;">
      <view class="tab" style="padding: 30rpx 50rpx 20rpx 50rpx;">
        <view :class="currenttab == index?'tab_one':''" v-for="(item,index) in tablist" :key='index' @click="seltab(index)">
          {{ item }}
          <view class="line" v-if="currenttab == index"></view>
        </view>
      </view>
    </view>
    <swiper :duration="500" @change="swiperChange" :current="currenttab">
      <!-- <swiper-item >
        <tab-one :tabOne='tabOne' @oneDel = 'oneDel' @twoDel = 'twoDel' @fourDel = 'fourDel' @bru='bru'></tab-one>
      </swiper-item> -->
      <swiper-item>
        <!-- 待接单 -->
        <tab-two :tabTwo='tabTwo' @oneDel='oneDel' @twoDel='twoDel' @fourDel='fourDel' @bru='bru'></tab-two>
      </swiper-item>
      <swiper-item>
        <!-- 待到店 -->

        <tab-three :tabThree='tabThree' @oneDel='oneDel' @twoDel='twoDel' @fourDel='fourDel' @bru='bru'></tab-three>

      </swiper-item>
      <swiper-item>
        <!-- 完成 -->

        <tab-four :tabFour='tabFour' @oneDel='oneDel' @twoDel='twoDel' @fourDel='fourDel' @bru='bru'></tab-four>

      </swiper-item>
      <swiper-item>
        <!-- 已取消 -->

        <tab-five :tabFive='tabFive' @oneDel='oneDel' @twoDel='twoDel' @fourDel='fourDel' @bru='bru'></tab-five>

      </swiper-item>
    </swiper>

  </view>
</template>

<script>
import pakTool from "@/common/utils/utility.js"; // 调取接口
import tabTwo from "./tab/tabTwo.vue";
import tabOne from "./tab/tabOne.vue";
import tabThree from "./tab/tabThree.vue";
import tabFour from "./tab/tabFour.vue";
import tabFive from "./tab/tabFive.vue";
export default {
  components: {
    tabOne,
    tabTwo,
    tabThree,
    tabFour,
    tabFive,
  },
  onReady(option) {},
  onLoad(option) {
    if (option) {
      this.booking_id = option.booking_id;
      this.currenttab = option.tab;
      this.getList();
    }
  },
  // onPullDownRefresh() {
  //       this.getList()
  //       setTimeout(function () {
  //           uni.stopPullDownRefresh();
  //       }, 1000);
  //   },
  watch: {},
  onShow() {
    this.getList();
  },
  data() {
    return {
      phoneHeight: "",
      hei: "",
      tablist: ["待接单", "待到店", "已完成", "已取消"], //导航栏标签
      currenttab: 0, //当前选中的tab
      tabOne: [],
      tabTwo: [], // 待接单列表
      tabThree: [],
      tabFour: [],
      tabFive: [],
      booking_id: "",
      name: "", // 客户名字
      member_id: "",
      staff_id: "",
    };
  },
  methods: {
    bru(val) {
      if (val) {
        this.getList();
      }
    },
    swiperChange(e) {
      console.log(e);
      this.currenttab = e.detail.current;
    },
    //切换tab栏
    seltab(index) {
      this.currenttab = index;
      console.log(index);
    },
    // 获取预约列表
    getList() {
      if (uni.getStorageSync("isAdmin") == "N") {
        this.staff_id = uni.getStorageSync("admin_user_id");
      }
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        booking_id: this.booking_id,
        staff_id: this.staff_id,
      };
      pakTool.request(this, "ums/getMemberBookings", requestPak).then((res) => {
        // {"ok":true,"message":"","pk":null,"code":"200","data":[{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-17 11:41:25","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"888","id":"fe1d53eb-315f-4602-b285-c70523c72763","book_date":"2020-08-30","status":"1"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-17 11:34:16","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"4","id":"2c5de083-951d-4b91-8911-4ee473963ae7","book_date":"2020-08-30","status":"5"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-17 11:18:43","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"是","id":"4197086a-76ea-4f12-bb4c-c9dca6948ea3","book_date":"2020-08-30","status":"5"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-17 11:16:07","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"我","id":"2dca67c6-4b59-487f-b4db-fceee0032836","book_date":"2020-08-30","status":"4"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-17 10:38:45","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"","id":"7a7c60ac-cf34-4af8-942f-0d9048caadeb","book_date":"2020-08-30","status":"4"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-17 10:37:03","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"","id":"3f43000a-3036-4a90-b832-2686ddf00920","book_date":"2020-08-30","status":"4"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-17 10:29:24","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"","id":"b5cd9fbd-0882-4270-baf1-24d309af0d25","book_date":"2020-08-30","status":"3"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-17 10:09:24","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"99","id":"91f02d27-225b-44e0-ba3f-8764269238b2","book_date":"2020-08-30","status":"5"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-14 18:14:51","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"","id":"be0a805b-925d-4072-9812-ee57a1151013","book_date":"2020-08-30","status":"3"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-14 18:14:30","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"","id":"dd593c50-8173-479f-a72d-77bbedf12dd3","book_date":"2020-08-30","status":"4"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-14 18:13:29","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"","id":"de660400-2d2c-43c6-ad4a-963f215d6f7a","book_date":"2020-08-30","status":"4"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-14 18:03:11","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"","id":"8b700c4c-a750-4304-936b-6675a6154bf0","book_date":"2020-08-30","status":"3"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-14 16:10:13","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"","id":"49788b49-0ce4-4c59-aa4d-6decbaead373","book_date":"2020-08-30","status":"3"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-14 16:03:07","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"","id":"e07eaa0b-dffd-4777-9e57-276976ff1f55","book_date":"2020-08-30","status":"3"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-14 15:52:03","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"","id":"24582790-63b4-4286-83aa-304b470a9982","book_date":"2020-08-30","status":"3"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-14 15:39:55","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"","id":"7a2537b7-4d19-49aa-85fb-ddb64a7bd428","book_date":"2020-08-30","status":"3"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-14 15:22:40","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"","id":"a3dac347-cc0e-474e-a788-e06e911b5185","book_date":"2020-08-30","status":"3"},{"member_id":"985be3eb-67df-484d-8bac-a096601b54ca","booking_id":"286df443-e534-4199-ba00-785edf79fe42","start_time":"09:00","create_time":"2020-08-14 11:21:09","edit_time":null,"name":"马大力","end_time":"09:30","contact_mobile":"13382018111","memo":"啊啊啊","id":"edcb6ff4-f88d-4f4d-ae6e-eef3abfbbad0","book_date":"2020-08-30","status":"5"}]}
        const { data } = res;
        // this.tabOne = [];  // 全部
        this.tabTwo = []; // 待接单
        this.tabThree = []; // 待到店
        this.tabFour = []; // 已完成
        this.tabFive = []; //已取消
        data.map((item) => {
          // 所有
          // this.tabOne = data
          // 待接单
          if (item.status == 1) {
            this.tabTwo.push(item);
          } else if (item.status == 2) {
            //待到店
            this.tabThree.push(item);
          } else if (item.status == 3) {
            this.tabFour.push(item);
          } else if (item.status == 4 || item.status == 5) {
            this.tabFive.push(item);
          }
        });
        console.log(this.tabFive, "55555555");
      });
    },
    oneDel(val) {
      console.log(val);
      if (val == 1) {
        this.getList();
      }
    },
    twoDel(val) {
      console.log(val, "two");
      if (val == 2) {
        this.getList();
      }
    },
    fourDel(val) {
      console.log(val);
      if (val == 4) {
        this.getList();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  font-size: 30rpx;
  min-height: 100%;
  // padding: 0 38rpx 38rpx 38rpx;
  background-color: #f7f7f7;
  /deep/swiper {
    height: calc(100vh - 140rpx) !important;
  }
  .tab {
    // padding: 30rpx 180rpx;
    display: flex;
    justify-content: space-between;
    background-color: white;
    height: 64rpx;
    .tab_one {
      // padding-bottom: 20rpx;
      color: #c59a76;
      // border-bottom: 5rpx solid #c59a76;
      .line {
        height: 10rpx;
        width: 55rpx;
        margin: 0 auto;
        border-radius: 20rpx;
        background-color: #c59a76;
        margin-top: 15rpx;
      }
    }
  }

  .tab_main {
    padding: 30rpx;

    .amount {
      color: #696969;
      text-align: center;
      padding-bottom: 30rpx;
    }

    .main_one {
      box-sizing: border-box;
      height: 140rpx;
      background-color: #ffffff;
      padding: 20rpx;
      position: relative;
      margin-bottom: 20rpx;
      border-radius: 10rpx;

      .cir {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        overflow: hidden;
        image {
          width: 100%;
          height: 100%;
        }
      }

      .name {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        left: 150rpx;
        font-weight: 700;
      }

      .doc_name {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        right: 65rpx;
        font-weight: 700;
        font-size: 30rpx;
        .settop {
          display: inline-block;
          float: right;
          border: 2rpx solid #c59a76;
          padding: 5rpx 20rpx;
          z-index: 9999;
          display: inline-block;
          color: #c59a76;
          border-radius: 15rpx;
          box-sizing: border-box;
          font-size: 30rpx;
        }
        .deltop {
          display: inline-block;
          float: right;
          // border: 2rpx solid #c59a76;
          padding: 5rpx 20rpx;
          z-index: 9999;
          display: inline-block;
          color: white;
          background-color: #c59a76;
          border-radius: 15rpx;
          font-size: 30rpx;
        }
      }

      .phone {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        left: 330rpx;
      }

      .point {
        width: 16rpx;
        height: 26rpx;
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        right: 30rpx;
        vertical-align: top;

        image {
          width: 100%;
          height: 100%;
          vertical-align: top;
        }
      }
    }

    .none {
      padding: 50rpx;

      .img {
        width: 550rpx;
        height: 406rpx;
        margin: 0 auto;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .txt {
        text-align: center;
        margin-top: -50rpx;
      }
    }
  }
}
</style>
