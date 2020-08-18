<template>
  <view class="appoint">
    <!-- 	<view class="list_box">
			<view class="depts_list clearfix">
				<view class="list_photo">
					<image :src="url" mode=""></image>
				</view>
				<view class="list_text">
					<view style="font-weight: 700;color: #424242;">
						项目名称: 元化灸
					</view>
					<view style="color: rgb(177, 177, 177);">
						时长: 30分钟
					</view>
				</view>
			</view>
		</view> -->
    <view class="appint_mid">
      <view class="" v-if="timeList.length==0">
        <view class="bir">
          <view class="thread" @click="dis(item.name)">
            <view class="" style="height: 130rpx;line-height: 130rpx;text-align: center;">
              暂无预约安排
            </view>
          </view>
        </view>
      </view>
      <view class="" v-for="(item,index) in timeList" :key='index' v-if="timeList.length!=0">
        <view class="bir">
          <view class="thread" @click="dis(item.name)">
            <view class="title">
              预约时间
            </view>
            <view style="width: 70%;float: left;height: 130rpx;line-height: 130rpx;">
              {{item.name}}
            </view>
            <uni-icons :type="nowName==item.name?'arrowup':'arrowdown'" size="36" color="#C59A76" style="position: absolute;right: 60rpx;bottom: 50%;transform: translate(0,50%);"></uni-icons>
          </view>
        </view>

        <view class="card" style="background-color: #FFFFFF;" :class="nowName==item.name?'':'dis'">
          <view style="overflow: hidden;" v-if="item.mo.length!=0">
            <view style="margin:30rpx 30rpx 0;color: #1AAD19;border: 2rpx solid #1AAD19;border-radius: 10rpx;width: 80rpx;height: 40rpx;line-height: 40rpx;font-size: 24rpx;text-align: center;">
              上午
            </view>
            <view class="appo">
              <view class="appoList" :class="Number(i.booked_times)==i.bookable_times?'cant':'sel'" v-for="i in item.mo" :key='i.id' @click="select(i)">
                <view class="red" v-if="i.book_count!=0"></view>
                {{i.start_time+'-'+i.end_time}}
                <text style="margin-left: 10rpx;">{{Number(i.booked_times)==i.bookable_times?'已约满':'未约满'}}</text>
              </view>
            </view>
          </view>
          <view style="overflow: hidden;" v-if="item.af.length!=0">
            <view style="margin:30rpx 30rpx 0;color: #F37B1D;border: 2rpx solid #F37B1D;border-radius: 10rpx;width: 80rpx;height: 40rpx;line-height: 40rpx;font-size: 24rpx;text-align: center;">
              下午
            </view>
            <view class="appo">
              <view class="appoList" :class="Number(i.booked_times)==i.bookable_times?'cant':'sel'" v-for="i in item.af" :key='i.id' @click="select(i)">
                <view class="red" v-if="i.book_count!=0"></view>
                {{i.start_time+'-'+i.end_time}}
                <text style="margin-left: 10rpx;">{{Number(i.booked_times)==i.bookable_times?'已约满':'未约满'}}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import pakTool from "../../common/utils/utility.js";
// import Moc from '../../common/utils/mock.js';
import uniPopup from "../../components/uni-popup/uni-popup.vue";
import uniIcons from "@/components/uni-icons/uni-icons.vue";
export default {
  data() {
    return {
      url:
        "http://xiaode.oos-cn.ctyunapi.cn/20200801/png/yhd/upload/202008011652273541717.png",
      date: "",
      name: uni.getStorageSync("name"),
      times: [],
      goTime: "",
      showTime: "",
      timeIndex: 0,
      timeList: [],
      appointList: [],
      mo_appointList: [],
      af_appointList: [],
      selected: "", //选中的时间
      phone: uni.getStorageSync("phone"), //手机
      other: "", // 备注
      lock: false, //防止重复点击
      orderId: "",
      nowName: "",
      durgingList: [],
      staff_id: "",
    };
  },
  onShow() {
    this.getDate();
    // this.getDeviceInfo()
  },
  watch: {},
  components: {
    uniPopup,
    uniIcons,
  },
  methods: {
    // 收缩
    dis(e) {
      if (this.nowName == e) {
        this.nowName = "";
      } else {
        this.nowName = e;
      }

      // if (this.durgingList.indexOf(e) == -1) {
      //   this.durgingList.push(e);
      // } else {
      //   this.durgingList.splice(this.durgingList.indexOf(e), 1);
      // }
      // console.log(this.durgingList)
    },
    // 获取可预约时间
    getDate() {
      let isAdmin = uni.getStorageSync("isAdmin");
      if (isAdmin == "N") {
        this.staff_id = uni.getStorageSync("admin_user_id");
      }
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        dept_id: uni.getStorageSync("dealerDeptId"),
        staff_id: this.staff_id,
      };
      pakTool.request(this, "ums/getDeptBookings", requestPak).then((res) => {
        // {"ok":true,"message":"","pk":null,"code":"200","data":[{"period":"2","create_time":"2020-08-17T03:37:02.000+0000","edit_time":"2020-08-17T03:37:02.000+0000","edit_user":"a0732608-e9f8-408c-b20a-fb69c8bee1e4","end_time":"14:00","exc_key":0,"book_date":"2020-08-18","dr":0,"start_time":"13:30","book_count":1,"bookable_times":2,"id":"5f24af10-64f5-450a-936f-4787ca560726","create_user":"a0732608-e9f8-408c-b20a-fb69c8bee1e4","dept_id":"5f8a70d1-86e5-444c-b1a9-d1f0a80298fe","booked_times":1,"status":"1"},{"period":"1","create_time":"2020-08-14T09:04:16.000+0000","edit_time":"2020-08-14T09:04:16.000+0000","edit_user":"1","end_time":"09:30","exc_key":0,"book_date":"2020-08-26","dr":0,"start_time":"08:30","book_count":0,"bookable_times":4,"id":"10ad44bd-650c-41c8-896d-4abceb71f745","create_user":"1","dept_id":"5f8a70d1-86e5-444c-b1a9-d1f0a80298fe","booked_times":1,"status":"1"},{"period":"1","create_time":"2020-08-14T03:20:23.000+0000","edit_time":"2020-08-17T02:08:34.000+0000","edit_user":"a0732608-e9f8-408c-b20a-fb69c8bee1e4","end_time":"09:30","exc_key":3,"book_date":"2020-08-30","dr":0,"start_time":"09:00","book_count":1,"bookable_times":9,"id":"286df443-e534-4199-ba00-785edf79fe42","create_user":"a0732608-e9f8-408c-b20a-fb69c8bee1e4","dept_id":"5f8a70d1-86e5-444c-b1a9-d1f0a80298fe","booked_times":9,"status":"1"}]}
        // console.log(res)
        var tempObj = {};
        var tempArr = [];
        this.times = res.data;
        if (this.times.length != 0) {
          // 传入一个数组
          // 按照特定方式格式化
          function sortArr(arr, str) {
            var _arr = [],
              _t = [],
              // 临时的变量
              _tmp;
            // 按照特定的参数将数组排序将具有相同值得排在一起
            arr = arr.sort(function (a, b) {
              var s = a[str],
                t = b[str];
              return s < t ? -1 : 1;
            });
            if (arr.length) {
              _tmp = arr[0][str];
            }
            // 将相同类别的对象添加到统一个数组
            for (var i in arr) {
              console.log(_tmp);
              if (arr[i][str] === _tmp) {
                console.log(_tmp);
                _t.push(arr[i]);
              } else {
                _tmp = arr[i][str];
                _arr.push(_t);
                _t = [arr[i]];
              }
            }
            // 将最后的内容推出新数组
            _arr.push(_t);
            return _arr;
          }
          this.timeList = sortArr(res.data, "book_date");
          console.log(sortArr(res.data, "book_date"), "arr");
          this.timeList.forEach((item, index) => {
            this.timeList[index] = {
              name: item[0].book_date,
              durging: item,
              mo: [],
              af: [],
            };
            console.log(this.timeList[index].durging, "durging");
            this.timeList[index].durging.map((i) => {
              if (i.period == 1) {
                this.timeList[index].mo.push(i);
              } else {
                this.timeList[index].af.push(i);
              }
            });
          });
          console.log(this.timeList, "list");
          // this.durgingList.push(this.timeList[0].name)
          this.nowName = this.timeList[0].name;
        }
      });
    },
    // 选择时间段
    selTime(val) {
      this.mo_appointList = [];
      this.af_appointList = [];
      this.selected = "";
      this.goTime = this.timeList[val.detail.value].value;
      this.showTime = this.timeList[val.detail.value].name;
      // 筛选时间段 获取当日可预约名单
      this.times.map((item) => {
        if (item.book_date == this.timeList[val.detail.value].value) {
          console.log(item);
          if (item.period == 1) {
            this.mo_appointList.push(item);
          } else {
            this.af_appointList.push(item);
          }
        }
      });
    },
    // 选中时间
    select(val) {
      uni.navigateTo({
        url: "/pages/manage/order?booking_id=" + val.id,
      });
      console.log(val);
    },
  },
};
</script>

<style lang="less" scoped>
.dis {
  display: none;
}
.appoint {
  font-size: 30rpx;
  min-height: 100%;
  position: relative;
  // background-color: #f7f7f7;
  // 门店列表
  .list_box {
    // padding: 0 30rpx;
    background-color: #ffffff;
    margin-bottom: 20rpx;
    // box-shadow: 0px 2px 12px 0 rgba(133, 133, 133, 0.1);
    .depts_list {
      // margin-top: 30rpx;
      padding: 30rpx 30rpx;
      box-sizing: border-box;
      .list_photo {
        width: 250rpx;
        height: 200rpx;
        border-radius: 30rpx;
        float: left;
        image {
          width: 100%;
          height: 100%;
        }
      }
      .list_text {
        margin-left: 30rpx;
        padding: 7rpx 25rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        float: left;
        height: 200rpx;
        box-sizing: border-box;
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
  .bir {
    overflow: hidden;
    background-color: #fff;

    .thread {
      // border-bottom: 2rpx solid #f7f7f7;
      height: 130rpx;
      padding: 0 40rpx;
      margin: 20rpx 30rpx;
      position: relative;
      border-radius: 44rpx;
      box-shadow: 0px 2px 12px 3px rgba(133, 133, 133, 0.1);
    }
    .title {
      width: 30%;
      float: left;
      height: 130rpx;
      // padding-left: 30rpx;
      box-sizing: border-box;
      line-height: 130rpx;
      position: relative;
    }
    .date {
      width: 70%;
      float: left;
      height: 100rpx;
      line-height: 100rpx;
      position: relative;
      .point {
        width: 16rpx;
        height: 26rpx;
        position: absolute;
        top: 50%;
        right: 0;
        transform: translate(0, -50%);
      }
    }
  }
  .card {
    margin: 0 30rpx;
    border-radius: 44rpx;
    box-shadow: 0px 2px 12px 3px rgba(133, 133, 133, 0.1);
    margin-bottom: 20rpx;
    overflow: hidden;
  }
  .appo {
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    padding: 30rpx 30rpx 0;
    box-sizing: border-box;
    flex-wrap: wrap;
    position: relative;
    .appoList {
      // height: 100rpx;
      width: 300rpx;
      text-align: center;
      border-radius: 10rpx;
      margin-bottom: 30rpx;
      // line-height: 100rpx;
      padding: 25rpx 0rpx;
      box-sizing: border-box;
      position: relative;
      .red {
        position: absolute;
        right: -4rpx;
        top: -4rpx;
        width: 20rpx;
        height: 20rpx;
        border-radius: 50%;
        background-color: red;
      }
    }
    .can {
      color: #c59a76;
      border: 2rpx solid #c59a76;
      box-sizing: border-box;
    }
    .cant {
      color: rgb(154, 153, 158);
      background-color: rgb(231, 230, 236);
    }
    .sel {
      color: #fff;
      background-color: #c59a76;
    }
  }
  .appint_btm {
    .area_inp {
      background-color: #fff;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      padding: 0 30rpx;
      border-bottom: 2rpx solid #f7f7f7;
      .area_title {
        width: 30%;
        height: 100rpx;
        line-height: 100rpx;
        box-sizing: border-box;
        background-color: #fff;
      }
      .area_father {
        width: 70%;
        background-color: #fff;
        .area {
          width: calc(100% - 30rpx);
          font-size: 28rpx;
        }
      }
    }
    .add_inp {
      overflow: hidden;
      background-color: #fff;
      // border-bottom:2rpx solid #eee;
      .thread {
        border-bottom: 2rpx solid #f7f7f7;
        height: 100rpx;
        margin: 0 30rpx;
      }
      .title {
        width: 30%;
        float: left;
        line-height: 100rpx;
        box-sizing: border-box;
        background-color: #fff;
        height: 100rpx;
        text {
          color: red;
        }
      }
      .uni-input {
        width: 70%;
        float: left;
        line-height: 100rpx;
        background-color: #fff;
        height: 100rpx;
        box-sizing: border-box;
        position: relative;
        font-size: 28rpx;
        .radio {
          image {
            width: 36rpx;
            height: 36rpx;
            vertical-align: middle;
            margin-right: 20rpx;
          }
        }
        .cir {
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
          left: 0;
          top: 50%;
          overflow: hidden;
          transform: translate(0, -50%);
          position: relative;
          background: #f7f7f7;
          .cinema {
            width: 50rpx;
            height: 38rpx;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .head {
            width: 100%;
            height: 100%;
          }
        }
        .point {
          width: 16rpx;
          height: 26rpx;
          position: absolute;
          top: 50%;
          right: 0;
          transform: translate(0, -50%);
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
  .btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    background-color: #c59a76;
    color: #ffffff;
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .pop {
    width: 605rpx;
    height: 580rpx;
    background-color: #ffffff;
    position: relative;
    border-radius: 20rpx;
    display: table;
    image {
      width: 206rpx;
      height: 206rpx;
      border-radius: 50%;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -10%);
    }
    .sus_txt {
      font-size: 36rpx;
      color: #c59a76;
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .con_txt {
      color: #333333;
      margin: 50% auto 0;
      text-align: center;
      font-size: 34rpx;
    }
    .btm {
      display: flex;
      justify-content: space-around;
      padding: 0 30rpx;
      margin-top: 96rpx;
      .yes {
        // padding: 18rpx 60rpx;
        width: 237rpx;
        height: 82rpx;
        line-height: 82rpx;
        text-align: center;
        display: inline-block;
        background-color: #c59a76;
        color: white;
        border-radius: 44rpx;
        font-size: 34rpx;
      }
      .no {
        // padding: 18rpx 60rpx;
        width: 237rpx;
        height: 82rpx;
        line-height: 82rpx;
        text-align: center;
        background-color: #ffffff;
        display: inline-block;
        color: #c59a76;
        border-radius: 44rpx;
        box-sizing: border-box;
        border: 2rpx solid #c59a76;
        font-size: 34rpx;
      }
    }
  }
}
</style>
