<template>
  <view class="box">
    <!-- 顶部  账户部分-->
    <view class="top_bgc">
      <view class="arc_top">
        <view class="thread">
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
      </view>
      <view class="arc_btm">
        <view class="btm_num">
          <view class="txt">
            {{surplus}}
          </view>
          <view class="num">
            剩余次数
          </view>
        </view>
        <view class="btm_num">
          <view class="txt">
            {{consumption}}
          </view>
          <view class="num">
            消费次数
          </view>
        </view>
        <view class="btm_num">
          <view class="txt">
            {{recharge}}
          </view>
          <view class="num">
            充值次数
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
    <!-- tab内容格部分 -->
    <view class="fa_cell" v-if="currentindex==0">
      <tab-one :add='add' :one_bottom='one_bottom'></tab-one>
    </view>
    <!-- 数据健康 -->
    <view class="fa_cell" v-if="currentindex==1">
      <tab-two :add='add' :two_bottom='two_bottom'></tab-two>
    </view>
  </view>
</template>

<script>
import TabOne from "@/pages/spend/tab-list/tab-one.vue"; //消费记录
import TabTwo from "@/pages/spend/tab-list/tab-two.vue"; //充值记录
import pakTool from "@/common/utils/utility.js"; // 调取接口
export default {
  components: {
    TabOne,
    TabTwo
  },
  data() {
    return {
      userImage: "",
      userName: "",
      userSex: "",
      userPhone: "",
      tagarr: [],
      surplus: 0, // 剩余次数
      consumption: 0, // 消费次数
      recharge: 0, // 充值次数
      tablist: ["消费记录", "充值记录"],
      currentindex: 0,
      add: "", // 用户id
      two_bottom: 0, //监听翻页
      one_bottom: 0,
	  mar:false
    };
  },
  onLoad(option) {
    if (option.add) {
      this.add = option.add;
      this.userImage = this.$store.state.form.head;
      this.userName = this.$store.state.form.name;
      this.userSex = this.$store.state.form.sex;
      this.userPhone = this.$store.state.form.phone;
      this.tagarr = this.$store.state.form.tagarr;
	  if(this.tagarr.length==0){
		  this.mar = true
	  }
      this.getpage();
      return;
    }
  },
  // 到底请求分页
  onReachBottom() {
    if (this.currentindex == 0) {
      this.one_bottom++;
      return;
    }
    if (this.currentindex == 1) {
      this.two_bottom++;
      return;
    }
  },
  methods: {
    sel(index) {
      this.currentindex = index;
    },
    getpage() {
      // 获取消费记录页数据
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        member_id: this.add,
        startIndex: 1,
        pagesize: 3
      };
      pakTool
        .request(this, "/madyApp/getMemberConsume", requestPak)
        .then(res => {
          const { data } = res;
          this.surplus = data.surplusCnt;
          this.consumption = data.totalConsumeCnt;
          this.recharge = data.totalDepositCnt;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.box {
  min-height: 100%;
  font-size: 32rpx;
  background-color: #f7f7f7;

  .top_bgc {
    background-image: url(data:image/png;base64,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);
    padding: 50rpx 30rpx 25rpx;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-size: 100% 280rpx;
    background-color: #f7f7f7;

    // 账户数据
    .arc_top {
      height: 200rpx;
      background: #fff;
      position: relative;
      box-sizing: border-box;
      border-radius: 20rpx 20rpx 0 0;

      .thread {
        margin: 0 20rpx;
        border-bottom: 2rpx solid #eeeeee;
        height: 100%;
      }

      .cir {
        height: 110rpx;
        width: 110rpx;
        border-radius: 50%;
        margin-top: 40rpx;
        float: left;
        overflow: hidden;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .cum {
        float: left;
        margin-top: 40rpx;
        margin-left: 25rpx;

        .row {
          height: 65rpx;

          .name {
            font-size: 36rpx;
            font-weight: 700;
          }

          .sex {
            margin: 0 30rpx;
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

    // 消费次数
    .arc_btm {
      display: flex;
      padding: 30rpx 0 40rpx 0;
      justify-content: space-around;
      background: #ffffff;
      border-radius: 0 0 20rpx 20rpx;

      .btm_num {
        flex: 0 0 25%;

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
  }
}

//tab 导航部分
.tab {
  height: 84rpx;
  padding: 20rpx 0;
  display: flex;
  justify-content: space-around;
  background-color: #fff;

  .tab_one {
    color: #c59a76;

    .line {
      height: 10rpx;
      width: 55rpx;
      margin: 0 auto;
      border-radius: 20rpx;
      background-color: #c59a76;
      margin-top: 20rpx;
    }
  }
}

.fa_cell {
  background-color: #f7f7f7;
}
</style>
