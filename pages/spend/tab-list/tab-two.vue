<template>
  <view class="tabtwo">
    <!-- 理疗数据 -->
    <view class="pressure" v-for="(item,index) in tabtwo" :key='index'>
      <view style="height: 40rpx; width: 6rpx;border-radius: 0 5rpx 5rpx 0; background-color: #C59A76;position: absolute;left: 0;">
      </view>
      <view class="title">
        <view style="display: inline-block;float: left;">
          <text class="text" style="font-weight: 700;">充值ID:</text>
          <text>{{ item.record_num }}</text>
        </view>
        <view class="surplus">
          <text style="margin-right: 20rpx;color: #696969;">剩余次数</text>
          <text style="color: #C59A76;">{{item.now_times}}</text>
        </view>
      </view>
      <view class="main">
        <view>
          <text class="text">充值次数:</text>
          <text>{{ item.mady_times }}</text>
        </view>
        <view>
          <text class="text">操作人员:</text>
          <text>{{ item.username }}</text>
        </view>
        <view>
          <text class="text">充值时间:</text>
          <text>{{ item.record_time }}</text>
        </view>
      </view>
    </view>
    <view class="none" v-if="tabtwo.length==0">
      <view class="img">
        <image src="../../../static/images/none.png" mode=""></image>
      </view>
      <view class="txt">
        暂无充值记录
      </view>
    </view>
  </view>
</template>

<script>
import uniIcons from "@/components/uni-icons/uni-icons.vue";
import pakTool from "@/common/utils/utility.js"; // 调取接口
export default {
  components: {
    uniIcons,
  },
  props: ["add", "two_bottom"],
  mounted() {
    console.log(1);
    this.gethis();
  },
  data() {
    return {
      tabtwo: [],
      two_total: 0,
      two_startIndex: 1,
    };
  },
  watch: {
    two_bottom() {
      if (this.two_total == 0) {
        uni.showToast({
          title: "没有更多数据了",
          icon: "none",
        });
        return;
      }
      this.two_startIndex++;
      this.gethis();
    },
  },
  methods: {
    // 获取充值记录
    gethis() {
      let requestPak = pakTool.createRequestPak();
      console.log(requestPak);
      requestPak.requestBody = {
        member_id: this.add,
        startIndex: this.two_startIndex,
        pagesize: 3,
      };
      pakTool
        .request(this, "/madyApp/getMemberDepositHistory", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":[{"member_id":"b0e964f2-384d-4dc8-91fd-3b45bb7b60de","amount":100.00,"create_time":"2020-07-27T06:53:59.000+0000","end_time":null,"record_num":"20200727145359","exc_key":0,"id":"b1f499cf-6148-4fa9-bfb2-66e675001e4b","mady_times":10,"now_times":6,"record_time":"2020-07-27 14:53:59","dr":0,"username":"店长"}]}
          const { data } = res;
          if (data) {
            this.tabtwo = [...this.tabtwo, ...data];
            this.two_total = data.length;
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.tabtwo {
  padding: 40rpx 30rpx 20rpx;
  font-size: 30rpx;

  .pressure {
    background-color: #ffffff;
    overflow: hidden;
    border-radius: 17rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0px 2px 12px 6px rgba(133, 133, 133, 0.1);
    position: relative;

    .title {
      display: inline-block;
      vertical-align: middle;
      margin-bottom: 30rpx;
      width: 100%;

      .surplus {
        float: right;
      }
    }

    .text {
      margin-right: 15rpx;
    }

    .main {
      border-top: 2rpx solid #eee;
      padding-top: 30rpx;
      height: 162rpx;
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
