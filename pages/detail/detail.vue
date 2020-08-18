<template>
  <view class="main">
    <!-- 顶部  账户部分-->
    <view class="top_bgc">
      <view class="fix" @click="fix">
        点击修改
      </view>
      <view class="arc_top">
        <view class="thread">
          <view class="cir" v-if="userImg!=''">
            <image :src="userImg"></image>
          </view>
          <view class="cir" v-if="userImg==''" style="font-weight:700;width:130rpx;height:130rpx;margin-bottom: 20rpx;border-radius: 50%;line-height: 130rpx;text-align: center; background-color: #F2F2F2;font-size: 36rpx;">
            {{ userName.substr(0,1) }}
          </view>
          <view class="cum">
            <view class="row" :style="mar==true?'margin-top:30rpx;':''">
              <text class="name">{{ userName }}</text>
              <text class="sex">{{ userSex==1?'男':(userSex==2?'女':'') }}</text>
              <text>{{ userPhone }}</text>
            </view>
            <view class="squ" v-if="tagarr.length!=0">
              <view class="fir" v-if="tagarr[0].name!=null&&tagarr[0]">
                {{ tagarr[0].name }}
              </view>
              <view class="mid" v-if="tagarr[1].name!=null&&tagarr[1]">
                {{ tagarr[1].name }}
              </view>
              <view class="las" v-if="tagarr[2].name!=null&&tagarr[2]">
                {{ tagarr[2].name }}
              </view>
            </view>
            <view class="clerk">
              <view style="margin-right:40rpx;" v-if="userDoctor !=''">健康专员:<text>{{ userDoctor }}</text></view>
              <view v-if="userServer !=''">服务专员:<text>{{ userServer }}</text></view>
            </view>
          </view>
        </view>
      </view>
      <view class="arc_btm">
        <view class="btm_num">
          <view class="txt">
            {{ surplusCnt }}
          </view>
          <view class="num">
            剩余次数
          </view>
        </view>
        <view class="btm_num">
          <view class="txt">
            {{ totalConsumeCnt }}
          </view>
          <view class="num">
            消费次数
          </view>
        </view>
        <view class="btm_num">
          <view class="txt">
            {{ totalDepositCnt }}
          </view>
          <view class="num">
            充值次数
          </view>
        </view>
      </view>
    </view>

    <!-- 主体 -->
    <view class="tip">
      <view class="tip_one" @click="choice">
        <navigator url="">
          <image src="http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201430463579192.png" mode="" class="tip_pic"></image>
          <view class="font">
            <text v-if="result">评测结果</text>
            <text v-else>健康测评</text>
          </view>
        </navigator>
      </view>
      <view class="tip_one">
        <navigator :url="'/pages/condition/condition?add='+id">
          <image src="http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201429553883961.png" mode="" class="tip_pic"></image>
          <view class="font">
            健康调理
          </view>
        </navigator>
      </view>
      <view class="tip_one">
        <navigator :url="'/pages/archives/archives?add='+id">
          <image src="http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201430463579192.png" mode="" class="tip_pic"></image>
          <view class="font">
            健康档案
          </view>
        </navigator>
      </view>
      <view class="tip_one">
        <navigator :url="'/pages/plan/plan?add='+id">
          <image src="http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201431570744659.png" mode="" class="tip_pic"></image>
          <view class="font">
            方案管理
          </view>
        </navigator>
      </view>
      <view class="tip_one">
        <navigator :url="'/pages/collection/collection?add='+id+'&detail=1'">
          <image src="http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201428490903751.png" mode="" class="tip_pic"></image>
          <view class="font">
            健康采集
          </view>
        </navigator>
      </view>
      <view class="tip_one">
        <navigator :url="'/pages/spend/spend?add='+id">
          <image src="http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201432413454688.png" mode="" class="tip_pic"></image>
          <view class="font">
            消费记录
          </view>
        </navigator>
      </view>
      <view class="tip_one" v-if="isAdmin=='Y'">
        <navigator :url="'/pages/recharge/recharge?add='+id+'&times='+amount">
          <image src="http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201433473662302.png" mode="" class="tip_pic"></image>
          <view class="font">
            充值
          </view>
        </navigator>
      </view>
    </view>
    <uni-popup ref="popup" type="center">
      <view class="pop">
        <image src="../../static/images/perfect.png" mode=""></image>
        <view class="con_txt">
          剩余还有{{ surplusCnt }}次
        </view>
        <view class="btm">
          <view class="yes" @click.stop="jump">
            确定
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
// 调取接口
import pakTool from "@/common/utils/utility.js";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
export default {
  data() {
    return {
      isAdmin: "", //判断是否是店长
      userImg: "",
      userName: "姓名",
      userPhone: "手机号",
      userDoctor: "",
      userServer: "",
      tagarr: [],
      id: "", // 用户id
      userSex: "", // 性别
      userDate: "", // 生日
      userCard: "", // 身份证
      userAddress: "", // 地址
      userMail: "", // 邮箱
      amount: 0,
      manage: 0,
      result: "", // 是否体检过
      pk_question: "", // 答题数据id
      surplusCnt: 0, // 剩余次数
      totalConsumeCnt: 0, // 消费次数
      totalDepositCnt: 0 // 充值次数
    };
  },
  components: {
    uniPopup
  },
  onLoad(option) {
    // 将登客户信息缓存
    this.isAdmin = uni.getStorageSync("isAdmin");
    // this.isAdmin = 'Y'
    this.id = option.add; // 用户id
    this.manage = option.manage;
    setTimeout(() => {
      if (this.surplusCnt <= 3) {
        this.$refs.popup.open();
      }
    }, 1000);
  },
  onShow() {
    // this.tagarr = []
    // this.tagarr.length = 0
    // this.$forceUpdate()
    this.getUser();
  },
  methods: {
    //修改资料
    fix() {
      uni.navigateTo({
        url: "/pages/add/fix?id=" + this.id
      });
    },
    // 健康测评
    choice() {
      if (this.result) {
        // 体检过
        console.log(`用户id：${this.id}, 题目id:${this.pk_question}`);
        uni.navigateTo({
          url:
            "/pages/evaluation/healthResult?id=" +
            this.id +
            "&pk_question=" +
            this.pk_question
        });
      } else {
        // 未体检过
        uni.navigateTo({
          url: "/pages/evaluation/evaluation?id=" + this.id
        });
      }
    },
    jump() {
      this.$refs.popup.close();
    },
    // 获取用户数据
    getUser() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        member_id: this.id, // 客户id
        admin_user_id: uni.getStorageSync("admin_user_id") // 登录员工id
      };
      pakTool
        .request(this, "/madyApp/getCustomerCenter", requestPak)
        .then(res => {
          const data = res.data;

          if (data) {
            this.userImg = data.memberInfo.icon;
            this.userName = data.memberInfo.real_name;
            this.userPhone = data.memberInfo.phone;
            this.userSex = data.memberInfo.gender;
            this.userDate = data.memberInfo.birthday;
            this.userMail = data.memberInfo.email;
            this.userCard = data.memberInfo.id_card;
            this.userAddress = data.memberInfo.address;
            this.amount = Number(data.memberInfo.surplus_times); // 剩余次数
            if (this.amount <= 3 && this.manage == 1) {
              this.$refs.popup.open();
              this.manage = 0;
            }
            this.tagarr = [];
            data.targs.map(item => {
              this.tagarr.push({
                name: item
              });
            }); // 更改tag数据格式
            console.log(this.tagarr, "tagarr");
            this.form = {
              name: this.userName,
              head: this.userImg,
              sex: this.userSex,
              phone: this.userPhone,
              tagarr: this.tagarr,
              date: this.userDate,
              mail: this.userMail,
              address: this.userAddress,
              card: this.userCard
            };
            this.$store.commit("savecustomer", this.form);
            // 判断是否健康测评过
            if (data.questionScore) {
              this.result = true;
              this.pk_question = data.questionScore.pk_questionScore;
            } else {
              this.result = false;
            }
            this.userDoctor = data.doctor;
            this.userServer = data.server;
            this.surplusCnt = data.surplusCnt; // 剩余次数
            this.totalConsumeCnt = data.totalConsumeCnt; // 消费次数
            this.totalDepositCnt = data.totalDepositCnt; // 充值次数
          } else {
            console.log("getCustomerCenter()接口数据为空。");
          }
        });
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  background-color: #fff;
  font-size: 30rpx;

  // 头部
  .top_bgc {
    background-image: url(../../static/images/details.png);
    padding: 50rpx 30rpx 25rpx;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-size: 100% 440rpx;

    .fix {
      position: absolute;
      top: 42rpx;
      right: 42rpx;
      padding: 5rpx 27rpx;
      border-radius: 30rpx;
      border: 2rpx solid #84571a;
      color: #84571a;
      font-size: 30rpx;
      box-sizing: border-box;
    }

    // 账户数据
    .arc_top {
      height: 200rpx;
      position: relative;
      box-sizing: border-box;
      border-radius: 20rpx 20rpx 0 0;
      margin-top: 34rpx;

      .thread {
        // margin: 0 20rpx;
        // border-bottom: 2rpx solid #eeeeee;
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

        // 服务专员
        .clerk {
          display: flex;
          font-size: 30rpx;
          margin-top: 15rpx;

          view {
            color: #c59a76;
            text {
              color: #84571a;
            }
          }
        }
      }
    }

    // 消费次数
    .arc_btm {
      display: flex;
      padding: 50rpx 0;
      justify-content: space-around;
      background: #ffffff;
      border-radius: 30rpx;
      width: 100%;
      box-shadow: 0 4rpx 24rpx 12rpx rgba(133, 133, 133, 0.1);
      margin-top: 20rpx;

      .btm_num {
        flex: 0 0 25%;

        .txt {
          text-align: center;
          color: #c59a76;
          font-size: 38rpx;
        }

        .num {
          text-align: center;
          font-size: 30rpx;
        }
      }
    }
  }

  // 功能
  .tip {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 60rpx;

    .tip_one {
      flex: 0 0 48%;
      height: 160rpx;
      background-color: #ffffff;
      margin-bottom: 30rpx;
      border-radius: 20rpx;
      box-shadow: 0px 2px 12px 6px rgba(133, 133, 133, 0.1);
      overflow: hidden;

      navigator {
        width: 100%;
        height: 100%;
        overflow: hidden;

        .font {
          font-size: 30rpx;
          text-align: center;
        }

        image {
          width: 64rpx;
          height: 64rpx;
          display: block;
          margin: 0 auto;
          margin-top: 20rpx;
          margin-bottom: 9rpx;
        }
      }
    }
  }

  //弹窗
  .pop {
    width: 605rpx;
    height: 580rpx;
    background-color: #ffffff;
    position: relative;
    border-radius: 20rpx;

    // display: table;
    image {
      width: 206rpx;
      height: 206rpx;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -10%);
    }

    .con_txt {
      font-size: 34rpx;
      color: #c59a76;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .yes {
      position: absolute;
	  width: 237rpx;
	  height: 82rpx;
	  line-height: 82rpx;
	  text-align: center;
	  font-size: 34rpx;
      // padding: 18rpx 60rpx;
      bottom: 15%;
      left: 50%;
      transform: translate(-50%, 0);
      background-color: #c59a76;
      color: white;
      border-radius: 44rpx;
    }
  }
}
</style>
