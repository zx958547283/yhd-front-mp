<template>
  <view class="home">
    <view class="depts clearfix">
      <view class="depts_img">
        <image src="../../static/home/mendian.png" mode=""></image>
      </view>
      <view class="depts_text">
        <view class="uni-list-cell">
          <view style="float: left;">
            <picker @change="bindPickerChange" :value="index" :range="depts_array" :disabled='depts.length==0'>
              <view style="float: left;">
                <view class="clearfix">
                  <view style="float: left;font-weight: 700;color: #606060;font-size: 34rpx;">{{depts_array[index]}}</view>
                  <view style="color: #CCA57E;float: left;margin-left:20rpx;margin-right: 32rpx;">
                    {{code}}
                  </view>
                </view>
                <view style="color: #696969;margin-top: 5rpx;" v-if="address">
                  {{address}}
                </view>
              </view>
              <uni-icons type="arrowdown" size="32" color="#C59A76" v-if="depts!=''"></uni-icons>
            </picker>
          </view>
        </view>
      </view>
    </view>
    <view style="background-color: #FFFFFF;padding-bottom: 33rpx;" class="clearfix">
      <swiper indicator-active-color='#C59A76' indicator-color='rgba(255, 255, 255, .6)' :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000" style="border-radius: 20rpx;overflow: hidden;">
        <swiper-item v-for="item in piclist" :key='item'>
          <image :src="item.pic" mode=""></image>
        </swiper-item>
      </swiper>
    </view>
    <!-- <view class="content-top">
			<view class="content-top-left">
				<image src="https://jk.laohaowaner.com/yhdresource/upload/imgs/home_add.png" class="pic" mode=""></image>
				<view class="tianjia">
						添加客户
				</view>
			</view>
			<view class="content-top-right" @click="manage">
				<image src="https://jk.laohaowaner.com/yhdresource/upload/imgs/home_manager.png" class="pic" mode=""></image>
				<view class="guanli">
						客户管理
				</view>
			</view>
		</view> -->

    <view class="home_list">
      <view class="pressure" style="margin-bottom: 34rpx;margin-top: 34rpx">
        <view style='display:inline-block;position:relative;'>
          <view class="line"></view>
        </view>
        <view class="title">
          <text style="font-weight: 700;margin-right: 20rpx;font-size: 30rpx;">学习中心</text>
        </view>
        <view class="main">
          <view class="main_img" @click.stop="basic" v-if="learn[0].name">
            <image src="../../static/home/jczs.png" mode=""></image>
            <view class="main_text">
              {{learn[0].name}}
            </view>
          </view>
          <view class="main_img" @click.stop="share" v-if="learn[1].name">
            <image src="../../static/home/jnpx.png" mode=""></image>
            <view class="main_text">
              {{learn[1].name}}
            </view>
          </view>
          <view class="main_img" @click.stop="skill" v-if="learn[2].name">
            <image src="../../static/home/jyfx.png" mode=""></image>
            <view class="main_text">
              {{learn[2].name}}
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="home_list">
      <view class="pressure" style="margin-bottom: 34rpx;">
        <view style='display:inline-block;position:relative;'>
          <view class="line"></view>
        </view>
        <view class="title">
          <text style="font-weight: 700;margin-right: 20rpx;font-size: 30rpx;">客户管理</text>
        </view>
        <view class="main">
          <view class="main_img" @click.stop="manage">
            <image src="../../static/home/khgl.png" mode=""></image>
            <view class="main_text">
              客户管理
            </view>
          </view>
          <view class="main_img" @click.stop="add">
            <image src="../../static/home/tjkh.png" mode=""></image>
            <view class="main_text">
              添加客户
            </view>
          </view>
          <view class="main_img">

          </view>
        </view>
      </view>
    </view>

    <!-- v-if="isAdmin=='Y'" -->
    <view class="home_list" v-if="false">
      <view class="pressure" style="margin-bottom: 134rpx;">
        <view style='display:inline-block;position:relative;'>
          <view class="line"></view>
        </view>
        <view class="title">
          <text style="font-weight: 700;margin-right: 20rpx;font-size: 30rpx;">门店数据</text>
        </view>
        <view class="main">
          <view class="main_img">
            <image src="../../static/home/jqxf.png" mode=""></image>
            <view class="main_text">
              近期消费
            </view>
          </view>
          <view class="main_img">
            <image src="../../static/home/znbb.png" mode=""></image>
            <view class="main_text">
              智能报表
            </view>
          </view>

        </view>
      </view>
    </view>
    <qb-footer :choose="0"></qb-footer>
  </view>
</template>

<script>
import qbFooter from "@/components/qb-footer.vue";
import config from "../../common/config/config.js";
import pakTool from "../../common/utils/utility.js";
import uniIcons from "@/components/uni-icons/uni-icons.vue";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    qbFooter,
    uniIcons,
  },
  data() {
    return {
      piclist: [],
      depts: "", // 经销商店铺
      // depts_list: uni.getStorageSync('depts')
      depts_array: [],
      index: 0,
      code: "", //编号
      address: "", //地址
      isAdmin: uni.getStorageSync("isAdmin"),
      learn: [],
    };
  },
  computed: {},
  onLoad() {
    // 		uni.getSystemInfo({
    // 		    success: function (res) {

    // 		        console.log(res.screenHeight);
    // 		       this.hei = res.screenHeight - 55
    // 		    }
    // 		});
    uni.hideTabBar();
    this.getdepts();
    this.gethome();
  },
  onShow() {},
  onReady() {},
  methods: {
    add() {
      uni.navigateTo({
        url: "/pages/add/add",
      });
    },
    manage() {
      uni.navigateTo({
        url: "/pages/manage/manage",
      });
    },
    skill() {
      uni.navigateTo({
        url:
          "/pages/learn/skill?def_list_id=" +
          this.learn[2].def_list_id +
          "&name=" +
          this.learn[2].name,
      });
    },
    share() {
      uni.navigateTo({
        url:
          "/pages/learn/share?def_list_id=" +
          this.learn[1].def_list_id +
          "&name=" +
          this.learn[1].name,
      });
    },
    basic() {
      uni.navigateTo({
        url:
          "/pages/learn/basic?def_list_id=" +
          this.learn[0].def_list_id +
          "&name=" +
          this.learn[0].name,
      });
    },
    // 获取首页轮播图/学习中心
    gethome() {
      let requestPak = pakTool.createRequestPak();
      console.log(requestPak);
      requestPak.requestBody = {
        encryptedData: "",
      };
      pakTool
        .request(this, "/madyApp/getHomePageInfo", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":{"contList":[{"def_list_id":"2b2d4b76-29a2-42c3-b222-8bc21f6f831f","company_id":"1","def_id":"644adc93-7481-4009-bd30-5f53796e8e28","code":"TYPE_001","name":"基础知识","value":null,"fix":"N","memo":null,"sort":null,"create_user":"1","create_time":"2020-07-09 16:37:51.0","edit_user":"1","edit_time":"2020-07-09 16:38:08.0","exc_key":"2","dr":"0"},{"def_list_id":"2c2e0bf9-2c4e-4241-87d2-8fd8ab058abf","company_id":"1","def_id":"644adc93-7481-4009-bd30-5f53796e8e28","code":"TYPE_003","name":"经验分享","value":null,"fix":"N","memo":null,"sort":null,"create_user":"1","create_time":"2020-07-09 16:38:33.0","edit_user":"1","edit_time":"2020-07-09 16:38:33.0","exc_key":"0","dr":"0"},{"def_list_id":"7747e167-1913-4f47-9ced-1874f670be71","company_id":"1","def_id":"644adc93-7481-4009-bd30-5f53796e8e28","code":"TYPE_002","name":"技能培训","value":null,"fix":"N","memo":null,"sort":null,"create_user":"1","create_time":"2020-07-09 16:38:21.0","edit_user":"1","edit_time":"2020-07-09 16:38:21.0","exc_key":"0","dr":"0"}],"advertise":[{"id":"2","name":"积分说明","type":"0","pic":"http://xiaode.oos-cn.ctyunapi.cn/20200723/png/yhd/upload/202007231724353321153.png","start_time":"2018-11-13 14:01:37.0","end_time":"2020-02-29 02:01:37.0","status":"1","click_count":"0","order_count":"0","url":"https://www.laohaowaner.com/qbresource/qb_study/score_intro.mp4","note":"前贝学堂介绍","sort":"0","create_user":"1","create_time":null,"edit_user":"1","edit_time":"2020-07-23 17:24:39.0","exc_key":"8","dr":"0"}]}}
          const { data } = res;
          this.piclist = data.advertise;
          this.learn = data.contList;
        });
    },
    // 获取门店列表
    getdepts() {
      this.depts = uni.getStorageSync("depts");
      let depts_id = uni.getStorageSync("dealerDeptId");
      // 如果是经销商 显示门店切换
      if (this.depts != "") {
        this.depts.map((item, index) => {
          this.depts_array.push(item.name);
          // 默认显示为上级选中的门店
          if (item.id == depts_id) {
            this.index = index;
            this.code = item.code;
            this.address = item.address;
          }
        });
      } else {
        // 如果店长或店员 只显示当前门店
        let belongOrg = uni.getStorageSync("belongOrg");
        this.index = 0;
        this.depts_array.push(belongOrg.name);
        this.code = belongOrg.code;
        this.address = belongOrg.address;
      }
    },
    bindPickerChange(e) {
      if (this.depts.length == 0) {
        return;
      }
      console.log(e);
      this.index = e.detail.value;
      let depts = uni.getStorageSync("depts");
      depts.map((item) => {
        if (item.name === this.depts_array[this.index]) {
          uni.setStorageSync("dealerDeptId", item.id);
          this.code = item.code;
          this.address = item.address;
        }
      });
    },
  },
  onPullDownRefresh() {},
};
</script>

<style lang="scss" scoped>
.home {
  min-height: 100%;
  overflow: hidden;
  background-color: #f2f2f2;
  font-size: 28rpx;
  .depts {
    width: 100%;
    padding: 32rpx 30rpx 33rpx 30rpx;
    box-sizing: border-box;
    background-color: #ffffff;
    box-shadow: 0px 2px 12px 6px rgba(133, 133, 133, 0.1);
    .depts_img {
      width: 41rpx;
      height: 37rpx;
      float: left;
      margin-right: 26rpx;
      image {
        width: 100%;
        height: 100%;
        vertical-align: middle;
      }
    }
    .depts_text {
      float: left;
    }
  }
  swiper {
    margin: 0 30rpx;
    // width: 100%;
    height: 300rpx;
    box-sizing: border-box;
    swiper-item {
      width: 100%;
      height: 100%;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .detail {
    width: 400rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    background-color: #cdcdcd;
    position: relative;
    top: 20rpx;
    left: 160rpx;
    border: 2rpx solid yellow;
  }
  .home_list {
    padding: 0 29rpx;
    .pressure {
      background-color: #ffffff;
      overflow: hidden;
      // height: 446rpx;
      border-radius: 17rpx;
      padding: 10rpx 0 10rpx 0;
      .title {
        display: inline-block;
        margin-left: 30rpx;
        vertical-align: middle;
      }
      .line {
        display: inline-block;
        width: 6rpx;
        height: 65rpx;
        border-radius: 0 6rpx 6rpx 0;
        vertical-align: middle;
        position: relative;
        background-color: #c59a76;
      }

      .main {
        // margin: 20rpx 75rpx 20rpx 75rpx;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        .main_img {
          padding: 34rpx 0;
          flex-basis: 33%;
          text-align: center;
          image {
            width: 64rpx;
            height: 64rpx;
          }
          .main_text {
            text-align: center;
          }
        }
      }
    }
  }
  .clearfix:before,
  .clearfix:after {
    display: block;
    height: 0;
    line-height: 0;
    content: "";
    clear: both;
  }
}
</style>
