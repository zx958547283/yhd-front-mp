<template>
  <view class="watch">
    <view style="background-color: #FFFFFF;">
      <!-- <my-cell title="预约人员信息"></my-cell> -->
      <my-cell title="预约时间" :num='time'></my-cell>
      <my-cell title="订单状态" :num='sta_text' :sta='sta'></my-cell>
      <my-cell title="联系方式" :num='phone'></my-cell>
      <my-cell title="姓名" :num='name'></my-cell>
      <my-cell title="备注" :num='memo'></my-cell>
    </view>
    <view style="margin-top: 20rpx;background-color: #FFFFFF;" v-if="sta==1">
      <!-- <my-cell title="操作" bor='1'></my-cell> -->
      <view class="do">
        <view class="doNo" @click.stop="no">
          拒 单
        </view>
        <view class="doYes" @click.stop="yes">
          接 单
        </view>
      </view>
    </view>
    <view style="margin-top: 20rpx;background-color: #FFFFFF;" v-if="sta==2">
      <!-- <my-cell title="操作" bor='1'></my-cell> -->
      <view class="do">
        <view class="doYes" @click.stop="succ">
          完 成
        </view>
        <!-- <view class="doNo">
					
				</view> -->
      </view>
    </view>
    <uni-popup ref="popup" type="center">
      <view class="pop clearfix">
        <view class="sus_txt">
          拒单
        </view>
        <view class="con_txt">
          您确定要拒单吗?
        </view>
        <view class="btm">
          <view class="yes" @click.stop="sure">
            确定
          </view>
          <view class="no" @click.stop="close">
            取消
          </view>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="popup_rei" type="center">
      <view class="pop clearfix">
        <view class="sus_txt">
          接单
        </view>
        <view class="con_txt">
          您确定要接单吗?
        </view>
        <view class="btm">
          <view class="yes" @click.stop="sure_rei">
            确定
          </view>
          <view class="no" @click.stop="close_rei">
            取消
          </view>
        </view>
      </view>
    </uni-popup>
    <uni-popup ref="popup_sus" type="center">
      <view class="pop clearfix">
        <view class="sus_txt">
          完成
        </view>
        <view class="con_txt">
          订单是否完成?
        </view>
        <view class="btm">
          <view class="yes" @click.stop="sure_sus">
            是
          </view>
          <view class="no" @click.stop="close_sus">
            否
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import MyCell from "@/components/cell.vue";
import uniPopup from "../../components/uni-popup/uni-popup.vue";
import pakTool from "../../common/utils/utility.js";
export default {
  onLoad(option) {
    console.log(option);
    var obj = JSON.parse(option.item);
    console.log(obj);
    this.memberId = obj.member_id;
    this.phone = obj.contact_mobile;
    this.id = obj.id;
    this.sta = obj.status;
    if (this.sta == 1) {
      this.sta_text = "待接单";
    } else if (this.sta == 2) {
      this.sta_text = "已接单";
    } else if (this.sta == 3) {
      this.sta_text = "已完成";
    } else if (this.sta == 4) {
      this.sta_text = "员工已取消";
    } else if (this.sta == 5) {
      this.sta_text = "客户已取消";
    }
    this.booking_id = obj.booking_id;
    this.memo = obj.memo;
    this.getUser();
    this.getOder();
    // this.phone = option.phone;
    // this.name = optio
  },
  components: {
    MyCell,
    uniPopup,
  },
  // onPullDownRefresh() {
  // this.getNew()
  // this.getOder()
  // setTimeout(() => {
  // 	uni.stopPullDownRefresh();
  // }, 1000);
  // },
  data() {
    return {
      name: "",
      phone: "",
      url:
        "http://xiaode.oos-cn.ctyunapi.cn/20200801/png/yhd/upload/202008011652273541717.png",
      bgc: "", //背景色
      time: "",
      id: "",
      sta: "",
      sta_text: "",
      memberId: "",
      booking_id: "",
      memo: "",
    };
  },
  computed: {},
  methods: {
    getOder() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        pk: this.booking_id,
      };
      pakTool.request(this, "ums/getDeptBook", requestPak).then((res) => {
        // {"ok":true,"message":"","pk":null,"code":"200","data":{"id":"5f24af10-64f5-450a-936f-4787ca560726","dept_id":"5f8a70d1-86e5-444c-b1a9-d1f0a80298fe","period":"2","book_date":"2020-08-18","start_time":"13:30","end_time":"14:00","bookable_times":"2","booked_times":"0","status":"1","create_user":"a0732608-e9f8-408c-b20a-fb69c8bee1e4","create_time":"2020-08-17 11:37:02.0","edit_user":"a0732608-e9f8-408c-b20a-fb69c8bee1e4","edit_time":"2020-08-17 11:37:02.0","exc_key":"0","dr":"0"}}
        const { data } = res;
        this.time =
          data.book_date + " " + data.start_time + "-" + data.end_time;
      });
    },
    getUser() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        member_id: this.memberId, // 客户id
        admin_user_id: uni.getStorageSync("admin_user_id"), // 登录员工id
      };
      pakTool
        .request(this, "/madyApp/getCustomerCenter", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":{"doctor":"张","targs":[],"server":"张","memberInfo":{"id":"985be3eb-67df-484d-8bac-a096601b54ca","organization_id":"1","company_id":null,"depart_id":"5f8a70d1-86e5-444c-b1a9-d1f0a80298fe","parent_id":null,"depth":null,"rgt":null,"lft":null,"team_id":null,"member_level_id":null,"username":null,"password":null,"nickname":"马大力","real_name":"马大力","phone":"13382018111","status":null,"icon":"","gender":"1","birthday":null,"province":null,"city":null,"area":null,"job":null,"personalized_signature":null,"source_type":null,"integration":null,"growth":null,"luckey_count":null,"history_integration":null,"wx_openId":null,"wx_union_id":null,"employee_flg":"0","employee_id":null,"qr_code":null,"id_card":"","email":"","create_user":"a1d8dc02-ca53-4f1b-b3c8-aa5590129eab","create_time":"2020-07-01 17:40:43.0","edit_user":"1","edit_time":"2020-08-14 17:43:42.0","exc_key":"13","dr":"0","address":"","height":"","weight":"","left_eye":"","right_eye":"","member_tag":"","surplus_amount":"0.00","comment":"","store_name":null,"from_employee":"a1d8dc02-ca53-4f1b-b3c8-aa5590129eab","surplus_times":"-2","lunar":"","is_top":1,"service_admin_id":"a1d8dc02-ca53-4f1b-b3c8-aa5590129eab"},"totalConsumeCnt":2,"surplusCnt":-2,"totalDepositCnt":0}}
          const data = res.data;
          this.name = data.memberInfo.real_name;
        });
    },
    // 接单
    yes() {
      this.$refs.popup_rei.open();
      // var that = this;
      // let requestPak = pakTool.createRequestPak();
      // requestPak.requestBody = {
      //  id: this.id,
      //  status: 2
      // };
      // pakTool
      //   .request(this, "ums/dealBooking", requestPak)
      //   .then(res => {
      // 	  var pages = getCurrentPages();
      // 	  var currPage = pages[pages.length - 1];   //当前页面
      // 	  var prevPage = pages[pages.length - 2];  //上一个页面
      // 	  // #ifdef H5
      // 	  prevPage.currenttab = 2
      // 	  // #endif
      // 	  // #ifndef H5
      // 	  prevPage.$vm.currenttab = 2
      // 	  // #endif
      // 	  uni.showToast({
      // 	  	title:'接单成功',
      // 	  	success:function(){
      // 	  		setTimeout(()=>{
      // 				uni.navigateBack({
      // 					delta:1
      // 				})
      // 			},500)
      // 	  	}
      // 	  })

      //   });
    },
    // 确认接单
    sure_rei() {
      var that = this;
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        id: this.id,
        status: 2,
      };
      pakTool.request(this, "ums/dealBooking", requestPak).then((res) => {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面
        var prevPage = pages[pages.length - 2]; //上一个页面
        // #ifdef H5
        prevPage.currenttab = 1;
        // #endif
        // #ifndef H5
        prevPage.$vm.currenttab = 1;
        // #endif
        uni.showToast({
          title: "接单成功",
          success: function () {
            setTimeout(() => {
              uni.navigateBack({
                delta: 1,
              });
            }, 500);
          },
        });
      });
    },
    // 取消
    close_rei() {
      this.$refs.popup_rei.close();
    },
    // 拒单
    no() {
      this.$refs.popup.open();
    },
    //
    close() {
      this.$refs.popup.close();
    },
    // 确认拒单
    sure() {
      var that = this;
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        id: this.id,
        is_who: 2,
      };
      pakTool.request(this, "ums/cancelBooking", requestPak).then((res) => {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面
        var prevPage = pages[pages.length - 2]; //上一个页面
        // #ifdef H5
        prevPage.currenttab = 3;
        // #endif
        // #ifndef H5
        prevPage.$vm.currenttab = 3;
        // #endif
        uni.showToast({
          title: "拒单成功",
          success: function () {
            that.$refs.popup.close();
            setTimeout(() => {
              uni.navigateBack({
                delta: 1,
              });
            }, 500);
          },
        });
      });
    },
    // 完成
    succ() {
      this.$refs.popup_sus.open();
      // var that = this;
      // let requestPak = pakTool.createRequestPak();
      // requestPak.requestBody = {
      //  id: this.id,
      //  status: 3
      // };
      // pakTool
      //   .request(this, "ums/dealBooking", requestPak)
      //   .then(res => {
      // 	  var pages = getCurrentPages();
      // 	  var currPage = pages[pages.length - 1];   //当前页面
      // 	  var prevPage = pages[pages.length - 2];  //上一个页面
      // 	  // #ifdef H5
      // 	  prevPage.currenttab = 3
      // 	  // #endif
      // 	  // #ifndef H5
      // 	  prevPage.$vm.currenttab = 3
      // 	  // #endif
      // 	  uni.showToast({
      // 	  	title:'操作成功',
      // 	  	success:function(){
      // 	  		setTimeout(()=>{
      // 				uni.navigateBack({
      // 					delta:1
      // 				})
      // 			},500)
      // 	  	}
      // 	  })

      //   });
    },
    sure_sus() {
      var that = this;
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        id: this.id,
        status: 3,
      };
      pakTool.request(this, "ums/dealBooking", requestPak).then((res) => {
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1]; //当前页面
        var prevPage = pages[pages.length - 2]; //上一个页面
        // #ifdef H5
        prevPage.currenttab = 2;
        // #endif
        // #ifndef H5
        prevPage.$vm.currenttab = 2;
        // #endif
        uni.showToast({
          title: "操作成功",
          success: function () {
            setTimeout(() => {
              uni.navigateBack({
                delta: 1,
              });
            }, 500);
          },
        });
      });
    },
    close_sus() {
      this.$refs.popup_sus.close();
    },
  },
};
</script>

<style lang="less" scoped>
@m: #c59a76;
.watch {
  font-size: 30rpx;
  // background-color: #f7f7f7;
  // height: 100%;
  .order {
    width: 100%;
    background-color: @m;
    color: #ffffff;
    padding-bottom: 20rpx;
  }
  .list_box {
    // padding: 0 30rpx;
    // margin-top: 20rpx;
    background-color: #ffffff;
    margin-bottom: 20rpx;
    // box-shadow: 0px 2px 12px 0 rgba(133, 133, 133, 0.1);
    .depts_list {
      // margin-top: 30rpx;
      padding: 30rpx 30rpx;
      box-sizing: border-box;
      .list_photo {
        width: 180rpx;
        height: 150rpx;
        border-radius: 30rpx;
        float: left;
        image {
          width: 100%;
          height: 100%;
        }
      }
      .list_text {
        padding: 0rpx 25rpx 0rpx 60rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        float: left;
        height: 150rpx;
      }
      .list_enter {
        width: 166rpx;
        height: 50rpx;
        border-radius: 26rpx;
        background-color: #f8ece2;
        color: #ab8600;
        line-height: 50rpx;
        text-align: center;
        float: right;
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
  .btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    background-color: #ff464c;
    color: #ffffff;
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .pop {
    width: 605rpx;
    height: 463rpx;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 20rpx;
    input {
      border: 2rpx solid @m;
      width: 500rpx;
      height: 60rpx;
      margin-bottom: 60rpx;
      padding-left: 20rpx;
      padding-right: 20rpx;
      box-sizing: border-box;
    }

    .sus_txt {
      font-size: 36rpx;
      color: #c59a76;
      margin-bottom: 70rpx;
    }

    .con_txt {
      margin-bottom: 40rpx;
    }

    .btm {
      .yes {
        width: 237rpx;
        height: 82rpx;
        line-height: 82rpx;
        text-align: center;
        background-color: #c59a76;
        color: #ffffff;
        border-radius: 44rpx;
        float: left;
        margin-right: 25rpx;
      }

      .no {
        width: 237rpx;
        height: 82rpx;
        line-height: 82rpx;
        text-align: center;
        background-color: #ffffff;
        color: #c59a76;
        border-radius: 44rpx;
        border: 1rpx solid #c59a76;
        float: left;
      }
    }
  }
  .do {
    padding: 80rpx 30rpx 45rpx 30rpx;
    display: flex;
    justify-content: space-between;
    .doYes {
      display: inline-block;
      width: 280rpx;
      height: 82rpx;
      line-height: 82rpx;
      text-align: center;
      background-color: #c59a76;
      color: #ffffff;
      border-radius: 10rpx;
    }
    .doNo {
      display: inline-block;
      width: 280rpx;
      height: 82rpx;
      line-height: 82rpx;
      text-align: center;
      background-color: #c59a76;
      color: #ffffff;
      border-radius: 10rpx;
    }
  }
  //弹窗
  .pop {
    width: 605rpx;
    height: 463rpx;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 20rpx;

    .sus_txt {
      font-size: 36rpx;
      color: #c59a76;
      margin-bottom: 70rpx;
    }

    .con_txt {
      margin-bottom: 90rpx;
    }

    .btm {
      .yes {
        width: 237rpx;
        height: 82rpx;
        line-height: 82rpx;
        text-align: center;
        background-color: #c59a76;
        color: #ffffff;
        border-radius: 44rpx;
        float: left;
        margin-right: 25rpx;
      }

      .no {
        width: 237rpx;
        height: 82rpx;
        line-height: 82rpx;
        text-align: center;
        background-color: #ffffff;
        color: #c59a76;
        border-radius: 44rpx;
        border: 1rpx solid #c59a76;
        float: left;
      }
    }
  }
}
</style>
