<template>
  <view class="plan">
    <!-- 用户信息 -->
    <view class="arc_top">
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

    <view class="tabthree">
      <!-- 理疗数据 -->
      <view class="pressure" v-for="(item,index) in tableData" :key='index' @click="planDetailed(item.id)">
        <view class="title">
          <text class="text" style="font-weight: 700;">方案编号:</text>
          <text>{{ item.care_num }}</text>
        </view>
        <view class="main">
          <view>
            <text class="text">项目名称:</text>
            <text>{{ item.care_project_name }}</text>
          </view>
          <view style="margin: 20rpx 0;">
            <text class="text">方案时间:</text>
            <text>{{ item.create_time }}</text>
          </view>
          <view>
            <text class="text">症状类型:</text>
            <text v-for="i in item.maladys" :key='i' style="margin-right: 10rpx;">{{ i.name }}</text>
          </view>
          <uni-icons type="arrowright" class="arrow" size="32" color="#CCCCCC"></uni-icons>
        </view>
      </view>
    </view>
    <view class="none" v-if="tableData.length==0">
      <view class="img">
        <image src="../../static/images/none.png" mode=""></image>
      </view>
      <view class="txt">
        暂无数据
      </view>
    </view>
  </view>
</template>

<script>
import uniIcons from "@/components/uni-icons/uni-icons.vue";
import pakTool from "../../common/utils/utility.js";
export default {
  components: {
    uniIcons,
  },
  onShow() {
    if (this.back == 1) {
      this.tableData.length = 0;
      this.startIndex = 1;
      this.getlist();
    }
  },
  onLoad(option) {
    if (option.add) {
      this.add = option.add;
      this.getlist();
      console.log(this.$store.state.form);
      console.log("添加客户跳转");
      this.userImage = this.$store.state.form.head;
      this.userName = this.$store.state.form.name;
      this.userSex = this.$store.state.form.sex;
      this.userPhone = this.$store.state.form.phone;
      this.tagarr = this.$store.state.form.tagarr;
      if (this.tagarr.length == 0) {
        this.mar = true;
      }
      return;
    }
  },
  onReachBottom() {
    if (this.total == 0) {
      uni.showToast({
        title: "没有更多数据了",
        icon: "none",
      });
      return;
    }
    this.startIndex++;
    this.getlist();
  },
  data() {
    return {
      add: "",
      userImage: "",
      userName: "",
      userSex: "",
      userPhone: "",
      tagarr: [],
      tableData: [],
      startIndex: 1,
      total: 0,
      back: 0, //接收删除跳转
      mar: false,
    };
  },
  methods: {
    // 获取方案列表
    getlist() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        member_id: this.add,
        // this.add,
        // '371b4276-514b-48d2-913d-931526aa6ddc',
        // '65165065-4c42-4701-8aed-96440f50f385',
        // this.add,
        startIndex: this.startIndex,
        pagesize: 5,
      };
      pakTool
        .request(this, "/madyApp/getMemberCarePlan", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":[{"member_id":"b0e964f2-384d-4dc8-91fd-3b45bb7b60de","plan_times":2,"create_time":"2020-07-27 15:03:33","b_content":"2ad39827-5db4-43ae-b597-fcf1764e991c,9f4655bd-f5f0-411d-9a57-2b3fca6d6532","t_content":"以华佗夹脊穴为核心的经络疏通","care_project_id":"8dcc7d25-a0a7-11ea-a951-506b4bc21cca","exc_key":0,"y_content":"","care_num":"000003","plan_amount":null,"finish_time":null,"dr":0,"execute_times":null,"care_project_name":"元化灸","maladys":[{"create_time":"2020-07-27T07:03:33.000+0000","name":"高血脂","id":"c4bc4db0-a0a7-11ea-a951-506b4bc21cca"}],"id":"77987646-211e-43b7-a382-00371f4587de","create_user":null,"p_content":"推拿、按揉背部膀胱经、肩胛部及手少阳三焦经 排出瘀堵的寒湿","status":null},{"member_id":"b0e964f2-384d-4dc8-91fd-3b45bb7b60de","plan_times":4,"create_time":"2020-07-27 14:54:17","b_content":"1028bbdb-555b-4b34-89e3-2fb266ad693e,929398b9-ee66-42e3-af89-f0eb3021bae6,b046f196-f31d-4993-a38c-771485b62b85,f2648e05-1043-4a79-9003-7c88dab29b0a","t_content":"以华佗夹脊穴为核心的经络疏通","care_project_id":"8dcc7d25-a0a7-11ea-a951-506b4bc21cca","exc_key":0,"y_content":"","care_num":"000002","plan_amount":null,"finish_time":null,"dr":0,"execute_times":null,"care_project_name":"元化灸","maladys":[{"create_time":"2020-07-27T06:54:17.000+0000","name":"过敏性鼻炎","id":"65dca4c0-d643-4ec3-9dd5-b4fee231660a"}],"id":"c32a7e3a-e9c3-4b33-b36b-73d0b88a173a","create_user":null,"p_content":"推拿、按揉背部膀胱经、肩胛部及手少阳三焦经 排出瘀堵的寒湿","status":null},{"member_id":"b0e964f2-384d-4dc8-91fd-3b45bb7b60de","plan_times":4,"create_time":"2020-07-27 14:52:57","b_content":"2ad39827-5db4-43ae-b597-fcf1764e991c,9f4655bd-f5f0-411d-9a57-2b3fca6d6532,b33554f9-a0a8-11ea-a951-506b4bc21cca,fcdd1d14-03e1-4f08-acd0-9b5551c5f62d","t_content":"以华佗夹脊穴为核心的经络疏通","care_project_id":"8dcc7d25-a0a7-11ea-a951-506b4bc21cca","exc_key":0,"y_content":"","care_num":"000001","plan_amount":null,"finish_time":null,"dr":0,"execute_times":null,"care_project_name":"元化灸","maladys":[{"create_time":"2020-07-27T06:52:57.000+0000","name":"高血压","id":"cdfba467-a0a7-11ea-a951-506b4bc21cca"},{"create_time":"2020-07-27T06:52:57.000+0000","name":"高血脂","id":"c4bc4db0-a0a7-11ea-a951-506b4bc21cca"}],"id":"f4e04c2d-0614-428a-ac42-e668ae36f173","create_user":null,"p_content":"推拿、按揉背部膀胱经、肩胛部及手少阳三焦经 排出瘀堵的寒湿","status":null}]}
          const { data, code } = res;
          console.log(data);
          this.total = data.length;
          this.tableData = [...this.tableData, ...data];
        });
    },
    // 方案详情
    planDetailed(id) {
      var that = this;
      uni.navigateTo({
        url: "/pages/planDetailed/planDetailed?id=" + id + "&add=" + that.add,
      });
    },
  },
};
</script>

<style lang="less">
.plan {
  min-height: 100%;
  background-color: #f7f7f7;
  font-size: 30rpx;

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

  .tabthree {
    padding: 50rpx 30rpx 10rpx 30rpx;
    font-size: 30rpx;
    .pressure {
      background-color: #ffffff;
      overflow: hidden;
      border-radius: 17rpx;
      padding: 30rpx;
      margin-bottom: 30rpx;
      box-shadow: 0px 2px 12px 6px rgba(133, 133, 133, 0.1);

      .title {
        display: inline-block;
        vertical-align: middle;
        margin-bottom: 30rpx;
      }

      .text {
        margin-right: 15rpx;
      }

      .main {
        border-top: 2rpx solid #eee;
        padding-top: 30rpx;
        // height: 162rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;

        .text {
          color: #696969;
        }

        .arrow {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }

      .main > view {
        width: 90%;
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
</style>
