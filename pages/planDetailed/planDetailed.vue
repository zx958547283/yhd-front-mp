<template>
  <view class="planDetailed">
    <!-- 重写微信顶部栏 -->
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
            方案详情
          </view>
        </view>
      </qb-header>
    </view>
    <!-- 用户信息 -->
    <view class="arc_top" :style="{ margin: ser_top + 'rpx 0 0 0;'}">
      <view class="cir" v-if="userImage!=''">
        <image :src="userImage"></image>
      </view>
      <view class="cir" v-if="userImage==''" style="font-weight:700;width:130rpx;height:130rpx;margin-bottom: 20rpx;border-radius: 50%;line-height: 130rpx;text-align: center; background-color: #F2F2F2;">
        {{userName.substr(0,1)}}
      </view>
      <view class="cum">
        <view class="row" :style="mar==true?'margin-top:30rpx;':''">
          <text class="name">{{userName}}</text>
          <text class="sex">{{userSex==1?'男':(userSex==2?'女':'')}}</text>
          <text>{{userPhone}}</text>
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

    <!-- 方案详情 -->
    <view class="fa_cell" v-show="currentindex==0">
      <detailed :send='send' :care_plan_id='care_plan_id' :add='add' :one='one'></detailed>
    </view>
    <!-- 历史记录 -->
    <view class="fa_cell" v-show="currentindex==1">
      <history :sendhis='sendhis'></history>
    </view>

  </view>
</template>

<script>
// 方案详情
import Detailed from "@/pages/planDetailed/planTab/detailed.vue";
// 历史记录
import History from "@/pages/planDetailed/planTab/history.vue";
import pakTool from "../../common/utils/utility.js";
import qbHeader from "@/components/header.vue";
export default {
  components: {
    Detailed,
    History,
    qbHeader,
  },
  onShow() {
    if (this.currentindex == 0) {
      this.one++;
    }
    if (this.currentindex == 1 && this.fixImg == true) {
      this.getFixHis();
    }
  },
  onLoad(option) {
    // this.getlist()
    var that = this;
    uni.getSystemInfo({
      success(res) {
        that.phoneHeight = res.windowHeight;
        // 计算组件的高度
        let view = uni.createSelectorQuery().select(".qh");
        view
          .boundingClientRect((data) => {
            let navHeight = data.height;
            const systemInfo = uni.getSystemInfoSync();
            let pxToRpxScale = 750 / systemInfo.windowWidth;
            // 搜索框距离顶部导航的位置
            that.ser_top =
              (navHeight + systemInfo.statusBarHeight) * pxToRpxScale;
          })
          .exec();
      },
    });
    this.add = option.add;
    // 提交记录之后跳转的历史记录
    if (option.index) {
      console.log("执行了提交跳转");
      this.userImage = this.$store.state.form.head;
      this.userName = this.$store.state.form.name;
      this.userSex = this.$store.state.form.sex;
      this.userPhone = this.$store.state.form.phone;
      this.tagarr = this.$store.state.form.tagarr;
      if (this.tagarr.length == 0) {
        this.mar = true;
      }
      this.currentindex = option.index;
      this.care_plan_id = option.his;
      this.getlist();
      this.gethis();
      return;
    }
    // this.add = option.add
    // this.gethis()
    if (option.id || option.add) {
      //首次添加
      console.log("执行了首次添加");
      this.care_plan_id = option.id;
      this.add = option.add;
      this.userImage = this.$store.state.form.head;
      this.userName = this.$store.state.form.name;
      this.userSex = this.$store.state.form.sex;
      this.userPhone = this.$store.state.form.phone;
      this.tagarr = this.$store.state.form.tagarr;
      if (this.tagarr.length == 0) {
        this.mar = true;
      }
      this.getlist();
      this.gethis();
      return;
    }
  },
  data() {
    return {
      add: "", // 客户id
      care_plan_id: "", // 获取详情id
      userImage: "",
      userName: "",
      userSex: "",
      userPhone: "",
      tablist: ["方案详情", "历史记录"],
      currentindex: 0,
      send: "", // 给表单信息子组件
      sendhis: "", //发送历史给子组件
      startIndex: 1, //起始页
      pagesize: 3, //每页数量
      tagarr: [],
      one: 0, //tabone显示
      mar: false,
      sty: {
        background: "rgb(248, 248, 248)",
        fontColor: "",
        iconColor: "",
        iconText: "", //导航栏文字
      },
      ser_top: 0,
      total: 0,
      fixImg: false,
    };
  },
  onReachBottom() {
    // 到达底部
    if (this.currentindex == 1) {
      if (this.total == 0) {
        uni.showToast({
          title: "没有更多数据了",
          icon: "none",
        });
        return;
      }
      this.startIndex++;
      this.gethis();
    }
  },
  methods: {
    sel(index) {
      this.currentindex = index;
    },
    getlist() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        // care_plan_id: '9d3b3298-7363-4371-a7ba-f0a0004fcf13'
        care_plan_id: this.care_plan_id,
      };
      pakTool
        .request(this, "/madyApp/getCarePlanDetail", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":{"selectBuList":[{"name":"腰部","id":"2ad39827-5db4-43ae-b597-fcf1764e991c"},{"name":"右大腿","id":"9f4655bd-f5f0-411d-9a57-2b3fca6d6532"}],"memberCarePlan":{"id":"77987646-211e-43b7-a382-00371f4587de","care_project_id":"8dcc7d25-a0a7-11ea-a951-506b4bc21cca","care_project_name":"元化灸","member_id":"b0e964f2-384d-4dc8-91fd-3b45bb7b60de","plan_times":"2","execute_times":null,"plan_amount":null,"status":null,"finish_time":null,"t_content":"以华佗夹脊穴为核心的经络疏通","p_content":"推拿、按揉背部膀胱经、肩胛部及手少阳三焦经 排出瘀堵的寒湿","b_content":"2ad39827-5db4-43ae-b597-fcf1764e991c,9f4655bd-f5f0-411d-9a57-2b3fca6d6532","y_content":"","create_user":null,"create_time":"2020-07-27 15:03:33.0","edit_user":null,"edit_time":null,"exc_key":"0","dr":"0","care_num":"000003"},"maladys":[{"create_time":"2020-07-27T07:03:33.000+0000","name":"高血脂","id":"c4bc4db0-a0a7-11ea-a951-506b4bc21cca"}],"isNew":true,"points":[{"create_time":"2020-06-20T07:50:29.000+0000","acupoint_name":"三阴交","id":"1e3d5e85-4450-4b97-a2af-ff9fd5679806"},{"create_time":"2020-06-20T07:43:37.000+0000","acupoint_name":"阴陵泉","id":"6501e0e1-0871-49c7-b7c6-362aaa4153b2"}],"products":[]}}
          const { data } = res;
          this.send = data;
        });
    },
    //获取历史
    gethis() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        plan_id: this.care_plan_id,
        startIndex: this.startIndex,
        pagesize: this.pagesize,
      };
      pakTool
        .request(this, "/madyApp/getMemberCareRecord", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":[{"member_id":"b0e964f2-384d-4dc8-91fd-3b45bb7b60de","img_path":"http://xiaode.oos-cn.ctyunapi.cn/20200727/png/yhd/upload/202007271509124277602.png","care_project_name":"元化灸","record_no":"000001","comment":"46","id":"6f6ae151-f9f5-455f-aa9c-4bf124589d90","care_plan_id":"c32a7e3a-e9c3-4b33-b36b-73d0b88a173a","record_time":"2020-07-27","username":"B1健康专员"}]}
          const { data } = res;
          // this.sendhis = data
          this.total = data.length;
          this.sendhis = [...this.sendhis, ...data];
          console.log(data, "我是历史记录");
        });
    },
    //获取修改后的历史
    getFixHis() {
      this.startIndex = 1;
      this.total = 0;
      this.sendhis = [];
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        plan_id: this.care_plan_id,
        startIndex: this.startIndex,
        pagesize: this.pagesize,
      };
      pakTool
        .request(this, "/madyApp/getMemberCareRecord", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":[{"member_id":"3edbf37b-c0e6-42b8-b056-3e321940e36a","img_path":"http://xiaode.oos-cn.ctyunapi.cn/20200728/jpg/yhd/upload/202007281821377694170.jpg","care_project_name":"元化灸","record_no":"000001","comment":"6","id":"f4cec84a-98a0-4b47-812f-8a3eaacd627b","care_plan_id":"d53e53ed-35c5-4781-881e-1025e09abe05","record_time":"2020-07-28","username":"张"}]}
          const { data } = res;
          // this.sendhis = data
          this.total = data.length;
          this.sendhis = [...this.sendhis, ...data];
          // console.log(data,'我是历史记录')
        });
    },
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
.planDetailed {
  // height: 100%;
  // background-color: #F7F7F7;
  font-size: 30rpx;
  overflow: hidden;
  // 用户信息
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
    padding: 20rpx 0 0 0;
    margin-bottom: 20rpx;
    display: flex;
    justify-content: space-around;
    background-color: #ffffff;
    font-size: 32rpx;
    box-shadow: 0px 2px 12px 0 rgba(133, 133, 133, 0.1);
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
  }
}
</style>
