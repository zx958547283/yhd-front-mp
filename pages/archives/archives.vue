<template>
  <view class="box">
    <!-- 顶部  账户部分-->
    <view class="arc_top">
      <view class="cir" v-if="userImg!=''">
        <image :src="userImg" mode=""></image>
      </view>
      <view class="cir" v-if="userImg==''" style="font-weight:700;width:130rpx;height:130rpx;margin-bottom: 20rpx;border-radius: 50%;line-height: 130rpx;text-align: center;background-color: #F2F2F2;">
        {{name.substr(0,1)}}
      </view>
      <view class="cum">
        <view class="row" :style="mar==true?'margin-top:30rpx;':''">
          <text class="name">{{name}}</text>
          <text class="sex">{{sex==1?'男':(sex==2?'女':'')}}</text>
          <text>{{phone}}</text>
        </view>
        <view class="squ" v-if="tagarr.length!=0">
          <view class="fir" v-if="tagarr[0].name!=null&&tagarr[0]">
            {{tagarr[0].name}}
          </view>
          <view class="mid" v-if="tagarr[1].name!=null&&tagarr[1]">
            {{tagarr[1].name}}
          </view>
          <view class="las" v-if="tagarr[2].name!=null&&tagarr[2]">
            {{tagarr[2].name}}
          </view>
        </view>
      </view>
    </view>
    <!-- tab导航部分 -->
    <view class="tab">
      <view :class="currentindex==index?'tab_one':''" v-for="(item,index) in tablist" :key='index' @click="sel(index)">
        {{item}}
        <view class="line" v-if="currentindex==index"></view>
      </view>
    </view>
    <!-- 内容表格部分 -->
    <!-- 档案信息 -->
    <view class="fa_cell" v-if="currentindex==0">
      <tab-one :add="add"></tab-one>
    </view>
    <!-- 数据健康 -->
    <view class="fa_cell" v-if="currentindex==1">
      <tab-two :add="add"></tab-two>
    </view>
    <!-- 理疗记录 -->
    <view class="fa_cell" v-if="currentindex==2">
      <tab-three :add="add" :btm='btm' :fix='fix'></tab-three>
    </view>
  </view>
</template>

<script>
import TabOne from "@/pages/archives/tab-list/tab-one.vue"; //档案信息
import TabTwo from "@/pages/archives/tab-list/tab-two.vue"; //健康数据
import TabThree from "@/pages/archives/tab-list/tab-three.vue"; //理疗记录
import pakTool from "@/common/utils/utility.js";
export default {
  components: {
    TabOne,
    TabTwo,
    TabThree,
  },
  onReachBottom() {
    if (this.currentindex == 2) {
      this.btm++;
    }
  },
  onLoad(option) {
    // this.getData();
    if (option.add) {
      // 如果是从采集之后跳转回来的
      if (option.index) {
        this.currentindex = option.index;
      }
      this.add = option.add;
      this.userImg = this.$store.state.form.head;
      this.name = this.$store.state.form.name;
      this.sex = this.$store.state.form.sex;
      this.phone = this.$store.state.form.phone;
      this.tagarr = this.$store.state.form.tagarr;
      if (this.tagarr.length == 0) {
        this.mar = true;
      }
      return;
    }
  },
  onShow() {
    if (this.currentindex == 2 && this.fixImg == true) {
      console.log("修改了图片");
      this.fix++;
    }
  },
  data() {
    return {
      tablist: ["档案信息", "数据健康", "理疗记录"],
      currentindex: 0,
      userImg: "",
      name: "",
      sex: "",
      phone: "",
      tagarr: [],
      add: "", //用户id
      btm: 1, //监听tabthree 触底事件
      mar: false,
      fixImg: false,
      fix: 0,
    };
  },
  methods: {
    sel(index) {
      this.currentindex = index;
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  min-height: 100%;
  background-color: #f7f7f7;
  font-size: 30rpx;
  //账户信息部分
  .arc_top {
    height: 200rpx;
    background: linear-gradient(#ffffff, #f3f3f3);
    padding: 0 40rpx;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;

    .cir {
      height: 110rpx;
      width: 110rpx;
      border-radius: 50%;
      margin-top: 40rpx;
      float: left;
      overflow: hidden;
      font-size: 36rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }

    .cum {
      float: left;
      margin-top: 40rpx;
      margin-left: 30rpx;

      .row {
        height: 65rpx;

        .name {
          font-size: 34rpx;
          font-weight: 700;
          margin-right: 30rpx;
        }

        .sex {
          margin-right: 30rpx;
        }
      }

      .squ {
        view {
          display: inline-block;
          padding: 2rpx 15rpx;
          border-radius: 10rpx;
          color: white;
          font-size: 28rpx;
          // border: 1px solid #333;
        }

        .fir {
          background-color: #c59a76;
          margin-right: 13rpx;
        }

        .mid {
          background-color: #f9a94c;
          margin-right: 13rpx;
        }

        .las {
          background-color: #eb7054;
          margin-right: 13rpx;
        }
      }
    }
  }

  //tab 导航部分
  .tab {
    height: 84rpx;
    padding: 20rpx 0;
    display: flex;
    justify-content: space-around;
    background-color: #ffffff;
    font-size: 32rpx;
    .tab_one {
      color: #c59a76;

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

  .fa_cell {
    background-color: #f7f7f7;
  }
}
</style>
