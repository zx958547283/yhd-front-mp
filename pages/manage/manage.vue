<template>
  <view class="box">
    <!-- 顶部搜索-->
    <!-- <uni-search-bar @ser='ser' placeholder="姓名/电话" :radius="100" :cancelButton="none" @confirm="search"></uni-search-bar> -->
    <view class="tab" :style="isAdmin=='Y'?'padding: 30rpx 100rpx':'padding:30rpx 180rpx'">
      <view :class="currenttab == index?'tab_one':''" v-for="(item,index) in tablist" :key='index' @click="seltab(index)">
        {{ item }}
        <view class="line" v-if="currenttab == index"></view>
      </view>
    </view>
    <swiper :duration="1000" :style="{ height: hei + 'px;'}" @change="swiperChange" :current="currenttab" duration="300">
      <swiper-item v-if="isAdmin==='Y'">
        <!-- 门店客户 -->
        <txl :total="one_total" :isAdmin="true" @ev="evFunc" :datas="tabone" color="#F2F2F2" :index="true" name="employeeName" v-show="currenttab==one"></txl>
      </swiper-item>
      <swiper-item>
        <!-- 我的客户 -->
        <txl :total="two_total" @collection='collection' @ev="evFunc" :datas="tabtwo" color="#F2F2F2" :index="true" name="employeeName" v-show="currenttab==two"></txl>
      </swiper-item>
      <swiper-item>
        <!-- 收藏客户 -->
        <txl :total='three_total' @collection='collection' @ev="evFunc" :datas="tabthree" color="#F2F2F2" :index="true" name="employeeName" v-show="currenttab==three"></txl>
      </swiper-item>
    </swiper>

  </view>
</template>

<script>
import uniSearchBar from "@/components/uni-search-bar/uni-search-bar.vue";
import pakTool from "@/common/utils/utility.js"; // 调取接口
import txl from "@/components/yt-txl/index.vue";
export default {
  components: {
    uniSearchBar,
    txl
  },
  onLoad(option) {
    if(option.index){
		this.currenttab = option.index;
	}
    this.isAdmin = uni.getStorageSync("isAdmin");
    var that = this;
    uni.getSystemInfo({
      success(res) {
        that.phoneHeight = res.windowHeight;
        // console.log();
        // 计算组件的高度
        let view = uni.createSelectorQuery().select(".tab");
        // console.log(view)
        view
          .boundingClientRect(data => {
            let navHeight = data.height;
            // console.log(res.windowHeight)
            console.log(navHeight);
            that.hei = that.phoneHeight - navHeight;
            console.log(that.hei, "hei");
          })
          .exec();
      }
    });
  },
  onShow() {
    if (this.isAdmin == "N") {
      this.tablist = ["我的客户", "收藏客户"];
      this.one = "";
      this.two = 0;
      this.three = 1;
    }
    this.myUser();
    this.colUser();
    if (this.isAdmin == "Y") {
      this.allUser();
    }
  },
  data() {
    return {
      phoneHeight: "",
      hei: "",
      tabone: [],
      tabtwo: [],
      tabthree: [],
      isAdmin: "", //判断是否是店长
      tablist: ["门店客户", "我的客户", "收藏客户"], //导航栏标签
      currenttab: 0, //当前选中的tab
      clist: [],
      pageIndex: 0,
      totalRows: 0,
      amount: 0,
      searchValue: "",
      startIndex: 1,
      pagesize: 10,
      alllist: [], //所有客户
      all_startIndex: 1, //店长的分页
      two_total: 0, //我的客户总量
      one_total: 0, //店长 全部客户总量
      three_total: 0, //收藏客户总量
      one: 0,
      two: 1,
      three: 3
    };
  },
  methods: {
    swiperChange(e) {
      console.log(e);
      this.currenttab = e.detail.current;
    },
    //切换tab栏
    seltab(index) {
      this.currenttab = index;
      console.log(index);
    },
    //跳转详情页
    getdetail(id) {
      uni.navigateTo({
        url: "/pages/detail/detail?add=" + id + "&manage=1"
      });
    },
    // 获取我的客户
    myUser() {
      this.startIndex = 1;
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        admin_user_id: uni.getStorageSync("admin_user_id"), //员工id
        search_key: this.searchValue, // 条件
        startIndex: this.startIndex, // 开始页面
        pagesize: this.pagesize // 每页条数
      };
      // 测试用
      pakTool
        .request(this, "/madyApp/getMineCustomer", requestPak)
        .then(res => {
          const { data } = res;
          this.tabtwo = [];
          data.customerList.map((item, index) => {
            this.tabtwo.push({
              employeeId: item.member_id,
              employeeName: item.customerName,
              departmentName: item.phone,
              isTop: item.is_top,
              customer_header: item.customer_header
            });
          });
          this.two_total = data.customerCnt;
        });
    },
    // 获取收藏数据
    colUser() {
      this.startIndex = 1;
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        admin_user_id: uni.getStorageSync("admin_user_id")
      };
      // 测试用
      pakTool.request(this, "/madyApp/getMineCollect", requestPak).then(res => {
        const { data } = res;
        this.tabthree = [];
        data.customerList.map((item, index) => {
          this.tabthree.push({
            employeeId: item.member_id,
            employeeName: item.customerName,
            departmentName: item.phone,
            isTop: item.is_top,
            customer_header: item.customer_header
          });
        });
        this.three_total = data.customerCnt;
      });
    },

    //获取店长门店数据
    allUser() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        admin_user_id: uni.getStorageSync("admin_user_id"), //员工id
        search_key: this.searchValue, // 条件
        startIndex: this.all_startIndex, // 开始页面
        pagesize: this.pagesize // 每页条数
      };
      // 测试用
      pakTool.request(this, "/madyApp/getAllCustomer", requestPak).then(res => {
        const { data } = res;
        this.tabone = [];
        data.customerList.map((item, index) => {
          this.tabone.push({
            employeeId: item.id,
            employeeName: item.customerName,
            departmentName: item.phone,
            isTop: item.is_top,
            customer_header: item.customer_header
          });
        });
        this.one_total = data.customerCnt;
      });
    },
    evFunc(e) {
      uni.navigateTo({
        url: "/pages/detail/detail?add=" + e.employeeId
      });
    },

    // 置顶/取消置顶
    settop(istop, id) {
      console.log(111);
      // 如果没有置顶 点击则置顶
      var that = this;
      if (istop == 0) {
        let requestPak = pakTool.createRequestPak();
        requestPak.requestBody = {
          isTop: 1,
          member_id: id
        };
        pakTool.request(this, "madyApp/setTop", requestPak).then(res => {
          if (res.code == 200) {
            uni.showToast({
              title: "收藏成功",
              success: function() {
                that.myUser();
                that.colUser();
                if (that.isAdmin == "Y") {
                  that.allUser();
                }
              }
            });
            // this.getShowUser()
            // if(this.isAdmin=='Y'){
            // 	this.getShowAll()
            // }
          }
        });
      } else {
        let requestPak = pakTool.createRequestPak();
        requestPak.requestBody = {
          isTop: 0,
          member_id: id
        };
        pakTool.request(this, "madyApp/setTop", requestPak).then(res => {
          if (res.code == 200) {
            uni.showToast({
              title: "取消收藏成功",
              success: function() {
                that.myUser();
                that.colUser();
                if (that.isAdmin == "Y") {
                  that.allUser();
                }
              }
            });
          }
        });
      }
    },
    collection(val) {
      console.log(val);
      this.settop(val.top, val.id);
    }
  }
};
</script>

<style lang="less" scoped>
.box {
  font-size: 30rpx;
  min-height: 100%;
  // padding: 0 38rpx 38rpx 38rpx;
  background-color: #f7f7f7;
  .hei {
    height: calc(100vh - 64rpx);
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
