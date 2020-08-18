<template>
  <view class="box" ref="cont">
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
            {{name}}
          </view>
        </view>
      </qb-header>
    </view>
    <!-- 顶部搜索-->
    <view :style="{ top: ser_top + 'rpx;'}" class="ser">
      <uni-search-bar @ser='ser' placeholder="人体的每个穴位你知道吗" :radius="100" :cancelButton="none" @confirm="search"></uni-search-bar>
    </view>

    <!-- 卡片区 -->
    <view class="card_list">
      <view class="card  clearfix" v-for="(item,index) in cardList" :key='index' @click.stop="detail(item)">
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
          <view class="right_bottom" v-if="item.tags">
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
import qbHeader from "@/components/header.vue";
export default {
  components: {
    uniSearchBar,
    uniIcons,
    qbHeader,
  },
  onLoad(option) {
    var that = this;
    uni.getSystemInfo({
      success(res) {
        that.phoneHeight = res.windowHeight;
        // 计算组件的高度
        let view = uni.createSelectorQuery().select(".qh");
        // console.log(view)
        view
          .boundingClientRect((data) => {
            let navHeight = data.height;
            const systemInfo = uni.getSystemInfoSync();
            let pxToRpxScale = 750 / systemInfo.windowWidth;
            // 搜索框距离顶部导航的位置
            that.ser_top =
              (navHeight + systemInfo.statusBarHeight) * pxToRpxScale;
            console.log(that.ser_top);
          })
          .exec();
      },
    });
    this.name = option.name;
    this.def_list_id = option.def_list_id;
    // this.def_id = option.def_id
    this.getlist();
  },
  data() {
    return {
      cardList: [],
      sty: {
        background: "rgb(248, 248, 248)",
        fontColor: "#000000",
        iconColor: "#000000",
        iconText: "查看更多", //导航栏文字
      },
      def_id: "",
      startIndex: 1,
      pagesize: 5,
      searchKey: "",
      total: 0,
      ser_total: 0,
      ser_top: 0, //搜索框距离顶部高度
      def_list_id: "",
      name: "",
    };
  },
  onReachBottom() {
    // 如果是搜索分页
    if (this.isSer == true) {
      if (this.ser_total == 0) {
        uni.showToast({
          title: "没有更多数据了",
          icon: "none",
        });
        return;
      }
      this.startIndex++;
      this.btmSer();
      return;
    }
    // 正常分页
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
  methods: {
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
    // 页面功能
    detail(detail) {
      if (detail.is_link != 1) {
        uni.navigateTo({
          url:
            "/pages/learn/article?detail=" +
            encodeURIComponent(JSON.stringify(detail)),
        });
      } else {
        uni.navigateTo({
          url:
            "/pages/learn/imgArticle?imgUrl=" +
            encodeURIComponent(JSON.stringify(detail.url)),
        });
      }
    },
    // 获取列表
    getlist() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        defListId: this.def_list_id,
        startIndex: this.startIndex,
        pagesize: this.pagesize,
        searchKey: this.searchKey,
      };
      pakTool
        .request(this, "/content/getContentByDefId", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":[{"id":"171ef0c4-49d3-40f7-943f-77c60fbabddf","company_id":"1","depart_id":"1","is_official":"N","is_show_home":"Y","category_id":null,"media_type":"0","fk_defList":"2b2d4b76-29a2-42c3-b222-8bc21f6f831f","title":"敖德萨","content":"","content_desc":null,"tags":" 的","url":null,"content_time":null,"media_path":null,"media_cover_path":null,"is_publish":"1","cover_path":"http://xiaode.oos-cn.ctyunapi.cn/20200716/png/yhd/upload/202007160948314098534.png","publish_user_id":null,"publish_user_name":null,"publish_type":null,"publish_time":null,"publish_location":null,"sort_pos":null,"read_count":"0","create_user":"1","create_time":"2020-07-16 09:48:37.0","edit_user":"1","edit_time":"2020-07-22 11:03:49.0","exc_key":"2","dr":"0","display_time":"2020-07-16 09:48:37","is_link":"0"},{"id":"1a996ab3-5433-432a-ac87-f8a8d07266d3","company_id":"1","depart_id":"1","is_official":"N","is_show_home":"Y","category_id":null,"media_type":"2","fk_defList":"2b2d4b76-29a2-42c3-b222-8bc21f6f831f","title":"测试","content":"","content_desc":"啊嘎达嘎达嘎嘎嘀咕嘀咕爱的嘎达嘎达嘎达给的矮冬瓜啊嘎达嘎达嘎嘎嘀咕嘀咕爱的嘎达嘎达嘎达给的矮冬瓜啊嘎达嘎达嘎嘎嘀咕嘀咕爱的嘎达嘎达嘎达给的矮冬瓜","tags":null,"url":"https://mp.weixin.qq.com/s?__biz=MzU0ODE3NDI1MA==&mid=2247483822&idx=2&sn=0647879bf688713da2d156cf9773fd25&chksm=fb42616bcc35e87d0a61951339f0ce9467932d6738c704a98350f0f80ab7cc7ce648859386e0&token=1863476898&lang=zh_CN#rd","content_time":null,"media_path":"http://xiaode.oos-cn.ctyunapi.cn/20200715/mp4/yhd/upload/202007151104521341494.mp4","media_cover_path":null,"is_publish":"1","cover_path":"http://xiaode.oos-cn.ctyunapi.cn/20200714/png/yhd/upload/202007140321156667079.png","publish_user_id":null,"publish_user_name":null,"publish_type":null,"publish_time":null,"publish_location":null,"sort_pos":null,"read_count":"0","create_user":"1","create_time":"2020-07-13 18:15:27.0","edit_user":"1","edit_time":"2020-07-22 11:03:17.0","exc_key":"23","dr":"0","display_time":"2020-07-13 18:15:27","is_link":"1"},{"id":"65069042-4545-40aa-88fd-4397c78b76ff","company_id":"1","depart_id":"1","is_official":"N","is_show_home":"Y","category_id":null,"media_type":"0","fk_defList":"2b2d4b76-29a2-42c3-b222-8bc21f6f831f","title":"测试资源","content":"","content_desc":"这是测试是否来链接的  内容简介","tags":null,"url":"https://www.csdn.net/","content_time":null,"media_path":null,"media_cover_path":null,"is_publish":"1","cover_path":"http://xiaode.oos-cn.ctyunapi.cn/20200723/jpg/yhd/upload/202007231618056257329.jpg","publish_user_id":null,"publish_user_name":null,"publish_type":null,"publish_time":null,"publish_location":null,"sort_pos":"1","read_count":"0","create_user":"1","create_time":"2020-07-23 16:18:09.0","edit_user":"1","edit_time":"2020-07-23 16:18:09.0","exc_key":"0","dr":"0","display_time":"2020-07-23 16:18:09","is_link":"1"},{"id":"76babb8e-712e-4568-b9d9-325cc1b72c90","company_id":"1","depart_id":"1","is_official":"N","is_show_home":"Y","category_id":null,"media_type":"1","fk_defList":"2b2d4b76-29a2-42c3-b222-8bc21f6f831f","title":"有啊嘎达嘎达嘎嘎嘀咕嘀咕爱的嘎达嘎达嘎达给的矮冬瓜啊嘎达嘎达嘎嘎嘀咕嘀咕爱的嘎达嘎达嘎达给的矮冬瓜啊嘎达嘎达嘎嘎嘀咕嘀咕爱的嘎达嘎达嘎达给的矮冬瓜啊嘎达嘎达嘎嘎嘀咕嘀咕爱的嘎达嘎达嘎达给的矮冬瓜","content":"<p><span class=\"bjh-p\">&nbsp; &nbsp; 中新网7月15日电 据中央气象台网站消息，中央气象台7月15日06时继续发布暴雨蓝色预警。</span></p>\n<p><span class=\"bjh-p\">预计，7月15日08时至16日08时，四川盆地中西部、重庆西部和北部、陕西南部、河南东南部、湖北北部和西南部、安徽中南部、江苏南部、上海、浙江北部等地的部分地区有大到暴雨，四川盆地中部局地有大暴雨(100～120毫米)；上述部分地区伴有短时强降水(最大小时降雨量20～40毫米，局地可超过50毫米)，局地有雷暴大风等强对流天气。</span><span class=\"bjh-p\">中新网7月15日电 据中央气象台网站消息，中央气象台7月15日06时继续发布暴雨蓝色预警。</span><span class=\"bjh-p\">预计，7月15日08时至16日08时，四川盆地中西部、重庆西部和北部、陕西南部、河南东南部、湖北北部和西南部、安徽中南部、江苏南部、上海、浙江北部等地的部分地区有大到暴雨，四川盆地中部局地有大暴雨(100～120毫米)；上述部分地区伴</span></p>\n<p><span class=\"bjh-p\">&nbsp; &nbsp; &nbsp; 有短时强降水(最大小时降雨量20～40毫米，局地可超过50毫米)，局地有雷暴大风等强对流天气。</span><span class=\"bjh-p\">中新网7月15日电 据中央气象台网站消息，中央气象台7月15日06时继续发布暴雨蓝色预警。</span><span class=\"bjh-p\">预计，7月15日08时至16日08时，四川盆地中西部、重庆西部和北部、陕西南部、河南东南部、湖北北部和西南部、安徽中南部、江苏南部、上海、浙江北部等地的部分地区有大到暴雨，四川盆地中部局地有大暴雨(100～120毫米)；上述部分地区伴有短时强降水(最大小时降雨量20～40毫米，局地可超过50毫米)，局地有雷暴大风等强对流天气。</span><span class=\"bjh-p\">中新网7月15日电 据中央气象台网站消息</span></p>\n<p><span class=\"bjh-p\">，中央气象台7月15日06时继续发布暴雨蓝色预警。</span><span class=\"bjh-p\">预计，7月15日08时至16日08时，四川盆地中西部、重庆西部和北部、陕西南部、河南东南部、湖北北部和西南部、安徽中南部、江苏南部、上海、浙江北部等地的部分地区有大到暴雨，四川盆地中部局地有大暴雨(100～120毫米)；上述部分地区伴有短时强降水(最大小时降雨量20～40毫米，局地可超过50毫米)，局地有雷暴大风等强对流天气。</span><span class=\"bjh-p\">中新网7月15日电 据中央气象台网站消息，中央气象台7月15日06时继续发布暴雨蓝色预警。</span><span class=\"bjh-p\">预计，7月15日08时至16日08时，四川盆地中西部、重庆西部和北部、陕西南部、河南东南部、湖北北部和西南部、安徽中南部、江苏南部、上海、浙江北部等地的部分地区有大到暴雨，四川盆地中部局地有大暴雨(100～120毫米)；上述部分地区伴有短时强降水(最大小时降雨量20～40毫米，局地可超过50毫米)，局地有雷暴大风等强对流天气。</span><span class=\"bjh-p\">中新网7月15日电 据中央气象台网站消息，中央气象台7月15日06时继续发布暴雨蓝色预警。</span><span class=\"bjh-p\">预计，7月15日08时至16日08时，四川盆地中西部、重庆西部和北部、陕西南部、河南东南部、湖北北部和西南部、</span></p>\n<p><span class=\"bjh-p\">安徽中南部、江苏南部、上海、浙江北部等地的部分地区有大到暴雨，四川盆地中部局地有大暴雨(100～120毫米)；上述部分地区伴有短时强降水(最大小时降雨量20～40毫米，局地可超过50毫米)，局地有雷暴大风等强对流天气。</span><span class=\"bjh-p\">中新网7月15日电 据中央气象台网站消息，中央气象台7月15日06时继续发布暴雨蓝色预警。</span><span class=\"bjh-p\">预计，7月15日08时至16日08时，四川盆地中西部、重庆西部和北部、陕西南部、河南东南部、湖北北部和西南部、安徽中南部、江苏南部、上海、浙江北部等地的部分地区有大到暴雨，四川盆地</span></p>\n<p><span class=\"bjh-p\">&nbsp; &nbsp; &nbsp; 中部局地有大暴雨(100～120毫米)；上述部分地区伴有短时强降水(最大小时降雨量20～40毫米，局地可超过50毫米)，局地有雷暴大风等强对流天气。</span><span class=\"bjh-p\">中新网7月15日电 据中央气象台网站消息，中央气象台7月15日06时继续发布暴雨蓝色预警。</span><span class=\"bjh-p\">预计，7月15日08时至16日08时，四川盆地中西部、重庆西部和北部、陕西南部、河南东南部、湖北北部和西南部、安徽中南部、江苏南部、上海、浙江北部等地的部分地区有大到暴雨，四川盆地中部局地有大暴雨(100～120毫米)；上述部分地区伴有短时强降水(最大小时降雨量20～40毫米，局地可超过50毫米)，局地有雷暴大风等强对流天气。</span></p>","content_desc":"德法等国大噶似的嘎达嘎达给啊大噶的各位尴尬当个给","tags":"国,国,v","url":null,"content_time":null,"media_path":"http://xiaode.oos-cn.ctyunapi.cn/20200714/mp3/yhd/upload/202007141844518662059.mp3","media_cover_path":null,"is_publish":"1","cover_path":"http://xiaode.oos-cn.ctyunapi.cn/20200714/png/yhd/upload/202007141554263989257.png","publish_user_id":null,"publish_user_name":null,"publish_type":null,"publish_time":null,"publish_location":null,"sort_pos":null,"read_count":"0","create_user":"1","create_time":"2020-07-14 10:54:14.0","edit_user":"1","edit_time":"2020-07-15 11:10:29.0","exc_key":"9","dr":"0","display_time":"2020-07-14 10:54:14","is_link":null},{"id":"a4d34869-f80b-4168-baad-d8c1537b3f59","company_id":"1","depart_id":"1","is_official":"N","is_show_home":"Y","category_id":null,"media_type":"0","fk_defList":"2b2d4b76-29a2-42c3-b222-8bc21f6f831f","title":"3332554","content":"<p><span class=\"bjh-p\">新华社华盛顿7月14日电（记者徐剑梅　邓仙来）美国波士顿联邦地区法院法官伯勒斯14日在开庭审理哈佛大学和麻省理工学院提起的相关诉讼时宣布，美国政府同意撤销此前发布的留学生签证新规。</span></p>\n<p><span class=\"bjh-p\">伯勒斯在庭审开始时表示，据他所知，诉讼双方已达成解决方案。</span></p>\n<p><span class=\"bjh-p\">美国国土安全部下属入境和海关执法局6日发布通报说，2020年秋季学期的留学生如果仅上网课，将无法取得赴美签证或维持当前签证。哈佛大学和麻省理工学院8日就此提起诉讼，以阻止美国政府实施这项针对留学生的签证新规。（完）</span></p>","content_desc":"阿斯顿噶多噶山豆根","tags":"22","url":null,"content_time":null,"media_path":null,"media_cover_path":null,"is_publish":"1","cover_path":null,"publish_user_id":null,"publish_user_name":null,"publish_type":null,"publish_time":null,"publish_location":null,"sort_pos":null,"read_count":"0","create_user":"1","create_time":"2020-07-14 10:53:09.0","edit_user":"1","edit_time":"2020-07-15 10:24:19.0","exc_key":"2","dr":"0","display_time":"2020-07-14 10:53:09","is_link":null}]}
          const { data } = res;
          data.forEach((item) => {
            if (item.tags) {
              return (item.tags = item.tags.split(","));
            }
          });
          this.total = data.length;
          this.cardList = [...this.cardList, ...data];
        });
    },
    // 搜索
    search(e) {
      this.isSer = true;
      this.startIndex = 1;
      this.searchKey = e.value;
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        defListId: this.def_list_id,
        startIndex: this.startIndex,
        pagesize: this.pagesize,
        searchKey: this.searchKey,
      };
      pakTool
        .request(this, "/content/getContentByDefId", requestPak)
        .then((res) => {
          const { data } = res;
          data.forEach((item) => {
            if (item.tags) {
              return (item.tags = item.tags.split(","));
            }
          });
          this.ser_total = data.length;
          this.cardList = [];
          this.cardList = [...this.cardList, ...data];
        });
    },
    // 搜索分页
    btmSer() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        defListId: this.def_list_id,
        startIndex: this.startIndex,
        pagesize: this.pagesize,
        searchKey: this.searchKey,
      };
      pakTool
        .request(this, "/content/getContentByDefId", requestPak)
        .then((res) => {
          const { data } = res;
          data.forEach((item) => {
            if (item.tags) {
              return (item.tags = item.tags.split(","));
            }
          });
          this.ser_total = data.length;
          this.cardList = [...this.cardList, ...data];
        });
    },
    // 取消搜索 返回全部
    ser(val) {
      this.isSer = false;
      this.startIndex = 1;
      this.searchKey = "";
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        defListId: this.def_list_id,
        startIndex: this.startIndex,
        pagesize: this.pagesize,
        searchKey: this.searchKey,
      };
      pakTool
        .request(this, "/content/getContentByDefId", requestPak)
        .then((res) => {
          const { data } = res;
          data.forEach((item) => {
            if (item.tags) {
              return (item.tags = item.tags.split(","));
            }
          });
          this.total = data.length;
          this.cardList = [];
          this.cardList = [...this.cardList, ...data];
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
  .qh {
    position: fixed;
    // position: -webkit-sticky;
    top: 0rpx;
    z-index: 101;
    width: 100%;
  }
  .ser {
    position: fixed;
    width: 100%;
    z-index: 101;
  }
  .card_list {
    margin-top: 290rpx;
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
            margin-bottom: 14rpx;
            font-weight: 700;
          }
          .middle_btm {
            font-size: 30rpx;
            color: #696969;
            width: 400rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-bottom: 15rpx;
          }
        }
        .right_bottom {
          position: absolute;
          left: 0;
          bottom: 0;
          view {
            display: inline-block;
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
