<template>
  <view class="box">
    <!-- 顶部搜索-->

    <!-- <uni-search-bar @ser='ser' placeholder="人体的每个穴位你知道吗" :radius="100" :cancelButton="none" @confirm="search"></uni-search-bar> -->

    <!-- banner -->
    <view style="background-color: #FFFFFF;padding: 30rpx 0 0 0;" class="clearfix">
      <swiper indicator-active-color='#C59A76' indicator-color='rgba(255, 255, 255, .6)' :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000" style="border-radius: 20rpx;overflow: hidden;">
        <!-- 	<swiper-item >
					<image src="http://xiaode.oos-cn.ctyunapi.cn/20200716/png/yhd/upload/202007160951233467203.png" mode=""></image>
				</swiper-item> -->
        <swiper-item>
          <image src="http://xiaode.oos-cn.ctyunapi.cn/20200716/png/yhd/upload/202007160948314098534.png" mode=""></image>
        </swiper-item>
        <!-- <swiper-item >
					<image src="http://xiaode.oos-cn.ctyunapi.cn/20200716/png/yhd/upload/202007160951056293789.png" mode=""></image>
				</swiper-item> -->
      </swiper>
    </view>
    <view class="mid_title clearfix">
      <view style="float: left;">
        <image src="../../static/learn/wnjx.png" mode=""></image>
        <text style="font-weight: 700;font-size: 34rpx;">为你精选</text>
      </view>
      <view style="float: right;font-size: 28rpx;color: #C59A76;" @click="more">
        <text style="margin-right: 15rpx;">查看更多</text>
        <uni-icons type="arrowright" class="arrow" size="28" color="#C59A76"></uni-icons>
      </view>
    </view>
    <!-- 卡片区 -->
    <view class="card_list">
      <view class="card  clearfix" v-for="(item,index) in cardList" :key='index' @click="enter(item)">
        <view class="card_left clearfix">
          <image :src="item.cover_path" mode=""></image>
          <view class="img_type">
            {{item.media_type==0?'图文':item.media_type==1?'音频':'视频'}}
          </view>
        </view>
        <view class="card_right">
          <view class="right_top clearfix">
            <view style="color: #8F620C;font-size: 20rpx;float: left;">
              #为你推荐
            </view>
            <!-- <view class="good">
							<text>赞</text>
							<image src="../../static/learn/good.png" mode="" style="width: 20rpx;height: 19rpx;margin-left: 9rpx;"></image>
						</view> -->
          </view>
          <view class="right_middle">
            <view class="middle_top">
              {{item.title}}
            </view>
            <view class="middle_btm" v-if="item.content_desc">
              {{item.content_desc}}
            </view>
          </view>
          <view class="right_bottom">
            <view class="" v-for="(i,ind) in item.tags" :key='ind'>
              {{i}}
            </view>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import uniSearchBar from "@/components/uni-search-bar/uni-search-bar.vue";
import pakTool from "@/common/utils/utility.js"; // 调取接口
import uniIcons from "@/components/uni-icons/uni-icons.vue";
export default {
  components: {
    uniSearchBar,
    uniIcons,
  },
  onLoad(option) {
    this.def_list_id = option.def_list_id;
    this.name = option.name;
    this.getlist();
  },
  onShow() {},
  data() {
    return {
      cardList: [],
      labList: [],
      def_list_id: "",
      name: "",
    };
  },
  methods: {
    more() {
      uni.navigateTo({
        url:
          "/pages/learn/basicMore?def_list_id=" +
          this.def_list_id +
          "&name=" +
          this.name,
      });
    },
    enter(item) {
      uni.navigateTo({
        url:
          "/pages/learn/article?detail=" +
          encodeURIComponent(JSON.stringify(item)),
      });
    },
    // 获取列表数据
    getlist() {
      let requestPak = pakTool.createRequestPak();
      console.log(requestPak);
      requestPak.requestBody = {
        defListId: this.def_list_id,
      };
      pakTool
        .request(this, "/content/getContentRemByDefListId", requestPak)
        .then((res) => {
          // 
          const { data } = res;
          data.forEach((item) => {
            if (item.tags) {
              return (item.tags = item.tags.split(","));
            }
          });
          this.cardList = data;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  font-size: 32rpx;
  min-height: 100%;
  overflow: hidden;
  // padding: 0 38rpx 38rpx 38rpx;
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
  .mid_title {
    width: 100%;
    height: 114rpx;
    line-height: 114rpx;
    padding: 0 30rpx;
    box-sizing: border-box;
    image {
      width: 35rpx;
      height: 32rpx;
      vertical-align: middle;
      margin-right: 17rpx;
    }
  }
  .card_list {
    .card {
      padding: 30rpx 30rpx 30rpx 30rpx;
      margin: 0 30rpx 32rpx 30rpx;
      box-shadow: 0px 2px 12px 6px rgba(133, 133, 133, 0.1);
      border-radius: 30rpx;
      .card_left {
        float: left;
        margin-right: 25rpx;
        position: relative;
        image {
          width: 194rpx;
          height: 268rpx;
        }
        .img_type {
          position: absolute;
          background-color: rgba(0, 0, 0, 1);
          text-align: center;
          color: #ffffff;
          width: 47rpx;
          height: 28rpx;
          line-height: 28rpx;
          font-size: 20rpx;
          border-radius: 5rpx;
          opacity: 0.4;
          right: 8rpx;
          bottom: 8rpx;
        }
      }
      .card_right {
        float: left;
        height: 268rpx;
        position: relative;
        .right_top {
          width: 400rpx;
          margin-bottom: 14rpx;
          .good {
            float: right;
            color: #999999;
            font-size: 20rpx;
          }
        }
        .right_middle {
          width: 400rpx;
          .middle_top {
            font-size: 30rpx;
            color: #333333;
            width: 400rpx;
            overflow: hidden;
            -webkit-line-clamp: 2;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            margin-bottom: 10rpx;
            font-weight: 700;
          }
          .middle_btm {
            font-size: 28rpx;
            color: #696969;
            width: 400rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-bottom: 10rpx;
          }
        }
        .right_bottom {
          position: absolute;
          left: 0;
          bottom: 0;
          view {
            display: inline-block;
            // padding: 6rpx 16rpx;
            width: 127rpx;
            height: 44rpx;
            text-align: center;
            line-height: 44rpx;
            box-sizing: border-box;
            color: #8f620c;
            background-color: #f8ece2;
            border-radius: 21rpx;
            font-size: 24rpx;
            float: left;
            margin-right: 10rpx;
          }
          view:last-child {
            margin-right: 0;
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
