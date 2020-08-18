<template>
  <view class="collection">
    <!-- 用户信息 -->
    <view class="arc_top">
      <view class="cir" v-if="userImage!=''">
        <image :src="userImage"></image>
      </view>
      <view class="cir" v-if="userImage==''" style="font-weight:700;width:130rpx;height:130rpx;margin-bottom: 20rpx;border-radius: 50%;line-height: 130rpx;text-align: center;background-color: #F2F2F2;">
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
    <view class="body-info">
      <!-- 血压 -->
      <view class="box-style">
        <uni-list v-if='pressure_his.length!=0'>
          <uni-list-item title="">
            <view class="point">
              <i></i>
            </view>
            <view class="title">
              <view style="display: inline-block;font-weight: 700;">血压(mmHg)</view>
            </view>
            <view class="title" style="display: flex;">
              {{pressure_his}}
            </view>
          </uni-list-item>
        </uni-list>
        <uni-list>
          <uni-list-item title="" note="" v-for="(item,index) in pressure" :key='index'>
            <view class="point">
              <i :class="{hide:pressure_his!=''||index!=0}"></i>
            </view>
            <view class="title">
              <view :class="{textHide:pressure_his!=''||index!=0}" style="display: inline-block;font-weight: 700;">血压(mmHg)</view>
            </view>
            <view class="write">
              <input type="digit" value="" placeholder="请输入" v-model="item.data" />
              <view class="del" @click.stop="del_y(item)">
                <uni-icons type="closeempty" size="30" class="xx"></uni-icons>
              </view>
            </view>
          </uni-list-item>
          <button @click="addPressure">+添加新数据</button>
        </uni-list>
      </view>
      <!-- 血氧 -->
      <view class="box-style">
        <uni-list v-if='oxygen_his.length!=0'>
          <uni-list-item title="">
            <view class="point">
              <i></i>
            </view>
            <view class="title">
              <view style="display: inline-block;font-weight: 700;">血氧(%)</view>
            </view>
            <view class="title" style="display: flex;">
              {{oxygen_his}}
            </view>
          </uni-list-item>
        </uni-list>
        <uni-list>
          <uni-list-item title="" note="" v-for="(item,index) in oxygen" :key='index'>
            <view class="point">
              <i :class="{hide:oxygen_his!=''||index!=0}"></i>
            </view>
            <view class="title">
              <view :class="{textHide:oxygen_his!=''||index!=0}" style="font-weight: 700;">血氧(%)</view>
            </view>
            <view>
              <input type="digit" value="" placeholder="请输入" v-model="item.data" />
              <view class="del" @click.stop="del_o(item)">
                <uni-icons type="closeempty" size="30" class="xx"></uni-icons>
              </view>
            </view>
          </uni-list-item>
          <button @click="addOxygen">+添加新数据</button>
        </uni-list>
      </view>
      <!-- 血糖 -->
      <view class="box-style">
        <uni-list v-if='sugar_his.length!=0'>
          <uni-list-item title="">
            <view class="point">
              <i></i>
            </view>
            <view class="title">
              <view style="display: inline-block;font-weight: 700;">血糖(mmol/L)</view>
            </view>
            <view class="title" style="display: flex;">
              {{sugar_his}}
            </view>
          </uni-list-item>
        </uni-list>
        <uni-list>
          <uni-list-item title="" note="" v-for="(item,index) in sugar" :key='index'>
            <view class="point">
              <i :class="{hide:sugar_his!=''||index!=0}"></i>
            </view>
            <view class="title">
              <view :class="{textHide:sugar_his!=''||index!=0}" style="font-weight: 700;">血糖(mmol/L)</view>
            </view>
            <view>
              <input type="digit" value="" placeholder="请输入" v-model="item.data" />
              <view class="del" @click.stop="del_s(item)">
                <uni-icons type="closeempty" size="30" class="xx"></uni-icons>
              </view>
            </view>
          </uni-list-item>
          <button @click="addSugar">+添加新数据</button>
        </uni-list>
      </view>
      <!-- <view class="condition">
				<view class="navi" @click="enter">
					健康调理<uni-icons type="arrowright" color="#C59A76" size="32" style="margin-left: 5rpx;"></uni-icons>
				</view>
			</view> -->
      <button type="default" class="save" @click="clickSave" :disabled="disabled">保 存</button>
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
  data() {
    return {
      userImage: "",
      userName: "",
      userSex: 0,
      userPhone: "",
      tagarr: [],
      pressure_his: "",
      pressure_arr: [],
      oxygen_his: "",
      oxygen_arr: [],
      sugar_his: "",
      sugar_arr: [],
      pressure: [
        {
          data: "",
        },
      ],
      oxygen: [
        {
          data: "",
        },
      ],
      sugar: [
        {
          data: "",
        },
      ],
      add: "",
      o_visible: false,
      disabled: false, // 防抖
      det: 0,
      mar: false,
      press: [],
    };
  },
  onLoad(option) {
    // 判断来源
    this.add = option.add;
    this.det = option.detail;
    if (option.add) {
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
      this.gethis(); //获取历史
      return;
    }
  },
  methods: {
    // 添加血压
    addPressure: function () {
      // 如果data值都不为空 返回true 则允许点击添加
      var empty = this.pressure.every((item) => {
        return item.data != "";
      });
      if (empty) {
        this.pressure.push({
          data: "",
        });
      } else {
        uni.showToast({
          title: "请填写血压",
          icon: "none",
          duration: 2000,
        });
      }
    },
    // 添加血氧
    addOxygen: function () {
      var empty = this.oxygen.every((item) => {
        return item.data != "";
      });
      if (empty) {
        this.oxygen.push({
          data: "",
        });
      } else {
        uni.showToast({
          title: "请填写血氧",
          icon: "none",
          duration: 2000,
        });
      }
    },
    // 添加血糖
    addSugar: function () {
      var empty = this.sugar.every((item) => {
        return item.data != "";
      });
      if (empty) {
        this.sugar.push({
          data: "",
        });
      } else {
        uni.showToast({
          title: "请填写血糖",
          icon: "none",
          duration: 2000,
        });
      }
    },
    // 保存按钮
    clickSave() {
      if (this.disabled) {
        return;
      }
      var p = this.pressure.every((item) => {
        return item.data != "";
      });
      var o = this.oxygen.every((item) => {
        return item.data != "";
      });
      var s = this.sugar.every((item) => {
        return item.data != "";
      });
      if (o == false && s == false && p == false) {
        uni.showToast({
          title: "请输入采集数据",
          icon: "none",
        });
        return;
      }
      // if (p == false) {
      // 	uni.showToast({
      // 		title: '请输入所有血压数据',
      // 		icon: 'none'
      // 	})
      // 	return
      // }
      // if (o == false) {
      // 	uni.showToast({
      // 		title: '请输入所有血氧气数据',
      // 		icon: 'none'
      // 	})
      // 	return
      // }
      // if (s == false) {
      // 	uni.showToast({
      // 		title: '请输入所有血糖数据'
      // 	})
      // 	return
      // }
      this.pressure.map((item) => {
        this.pressure_arr.push({
          member_id: this.add,
          content: item.data,
          type: 0,
          file_path: "",
        });
      });
      this.oxygen.map((item) => {
        this.oxygen_arr.push({
          member_id: this.add,
          content: item.data,
          type: 1,
          file_path: "",
        });
      });
      this.sugar.map((item) => {
        this.sugar_arr.push({
          member_id: this.add,
          content: item.data,
          type: 2,
          file_path: "",
        });
      });
      var detail = [
        ...this.pressure_arr,
        ...this.oxygen_arr,
        ...this.sugar_arr,
      ];
      if (detail.length == 0) {
        uni.showToast({
          title: "请添加采集数据",
          icon: "none",
        });
        return;
      }
      this.disabled = true;
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = { detail };
      pakTool
        .request(this, "/madyApp/saveMemberMonitoring", requestPak)
        .then((res) => {
          const { data, code } = res;
          if (code == 200) {
            var that = this;
            uni.showToast({
              title: "数据采集成功",
              success: function () {
                if (that.det == 1) {
                  uni.navigateBack({
                    delta: 1,
                  });
                  return;
                }
                uni.redirectTo({
                  url: "/pages/detail/detail?add=" + that.add,
                });
              },
            });
          } else {
            uni.showToast({
              title: "数据采集失败",
            });
            this.disabled = false;
          }
        });
    },
    // 保存+健康调理
    enter() {
      var p = this.pressure.every((item) => {
        return item.data != "";
      });
      var o = this.oxygen.every((item) => {
        return item.data != "";
      });
      var s = this.sugar.every((item) => {
        return item.data != "";
      });
      if (p == false) {
        uni.showToast({
          icon: "none",
          title: "请输入所有血压数据",
        });
        return;
      }
      if (o == false) {
        uni.showToast({
          icon: "none",
          title: "请输入所有血氧数据",
        });
        return;
      }
      if (s == false) {
        uni.showToast({
          icon: "none",
          title: "请输入所有血糖数据",
        });
        return;
      }
      this.pressure.map((item) => {
        this.pressure_arr.push({
          member_id: this.add,
          content: item.data,
          type: 0,
          file_path: "",
        });
      });
      this.oxygen.map((item) => {
        this.oxygen_arr.push({
          member_id: this.add,
          content: item.data,
          type: 1,
          file_path: "",
        });
      });
      this.sugar.map((item) => {
        this.sugar_arr.push({
          member_id: this.add,
          content: item.data,
          type: 2,
          file_path: "",
        });
      });
      var detail = [
        ...this.pressure_arr,
        ...this.oxygen_arr,
        ...this.sugar_arr,
      ];
      if (detail.length == 0) {
        uni.showToast({
          title: "请添加采集数据或者清空采集数据",
          icon: "none",
        });
        return;
      }
      this.disabled = true;
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = { detail };
      pakTool
        .request(this, "/madyApp/saveMemberMonitoring", requestPak)
        .then((res) => {
          const { data, code } = res;
          if (code == 200) {
            uni.showToast({
              title: "数据采集成功",
              success: () => {
                uni.redirectTo({
                  url: "/pages/condition/condition?add=" + this.add,
                });
              },
            });
          }
        });
    },
    // 获取之前记录
    gethis() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        member_id: this.add,
      };
      pakTool
        .request(this, "/madyApp/getMemberMonitoring", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":{"xuetangList":[{"file_path":"","id":"06737371-6294-44f2-bf58-7fcee021e5ff","monitoring_time":"2020-07-27 14:52:29","content":"12"},{"file_path":"","id":"51190bf9-feab-40e1-9d99-d79015821fa9","monitoring_time":"2020-07-27 14:52:29","content":"23"}],"xueyangList":[{"file_path":"","id":"30c5ebfe-0082-46ce-b32b-127880e7c693","monitoring_time":"2020-07-27 14:52:29","content":"12"},{"file_path":"","id":"f2d03688-b58b-4ca4-b88c-d5000e252364","monitoring_time":"2020-07-27 14:52:29","content":"23"}],"xueyaList":[{"file_path":"","id":"37629ce8-0545-4137-834a-9057e0bd1fef","monitoring_time":"2020-07-27 14:52:29","content":"12"},{"file_path":"","id":"507a9591-88e2-4f23-bc59-f729eb2fe9af","monitoring_time":"2020-07-27 14:52:29","content":"23"}]}}
          const { data } = res;
          // this.pressure_his =
          const press = [];
          const oxy = [];
          const sug = [];
          if (data.xueyaList.length != 0) {
            data.xueyaList.map((item) => {
              if (item.content != "") {
                press.push(item);
              }
            });
            if (press[0]) {
              this.pressure_his = press[0].content;
            }
          }
          if (data.xueyangList.length != 0) {
            data.xueyangList.map((item) => {
              if (item.content != "") {
                oxy.push(item);
              }
            });
            if (oxy[0]) {
              this.oxygen_his = oxy[0].content;
            }
          }
          if (data.xuetangList.length != 0) {
            data.xuetangList.map((item) => {
              if (item.content != "") {
                sug.push(item);
              }
            });
            if (sug[0]) {
              this.sugar_his = sug[0].content;
            }
          }
          // data.xueyangList.forEach(item=>{
          // 	if(item.content!=''){
          // 		this.oxygen_his.push(item)
          // 	}
          // })
          // data.xuetangList.forEach(item=>{
          // 	if(item.content!=''){
          // 		this.sugar_his.push(item)
          // 	}
          // })
        });
    },
    // 删除当前行
    del_o(id) {
      var index = this.oxygen.indexOf(id);
      this.oxygen.splice(index, 1);
    },
    del_s(id) {
      var index = this.sugar.indexOf(id);
      this.sugar.splice(index, 1);
    },
    del_y(id) {
      var index = this.pressure.indexOf(id);
      this.pressure.splice(index, 1);
    },
  },
};
</script>

<style lang="less" scoped>
.collection {
  height: 100%;
  position: relative;

  //顶部个人信息
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
          font-size: 36rpx;
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

  // 身体信息
  .body-info {
    display: flex;
    flex-wrap: wrap;
    font-size: 32rpx;
    padding: 50rpx 30rpx;

    .box-style {
      border-radius: 10rpx;
      box-shadow: 0px 2px 12px 6px rgba(133, 133, 133, 0.1);
      margin-bottom: 20rpx;
      width: 100%;

      .del {
        position: absolute;
        right: 25rpx;
        top: 50%;
        width: 80rpx;
        height: 80rpx;
        transform: translate(0, -50%);
        // background-color: #333;
        border-radius: 50%;
        z-index: 999;
        .xx {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        image {
          width: 100%;
          height: 100%;
          vertical-align: top;
        }
      }

      uni-list {
        uni-list-item {
          border-bottom: 2rpx solid #eeeeee;
          display: flex;
          position: relative;
          margin: 0 30rpx;

          .title {
            height: 100rpx;
            line-height: 100rpx;
            flex: 0 0 50%;
            align-items: center;
            vertical-align: middle;

            .textHide {
              color: transparent;
            }
          }

          .point {
            position: absolute;
            top: 50%;
            transform: translate(0, -50%);
            left: -30rpx;

            i {
              width: 6rpx;
              height: 35rpx;
              background: #c59a76;
              border-radius: 0 4rpx 4rpx 0;
              margin-right: 24rpx;
              vertical-align: middle;
            }

            i.hide {
              background: transparent;
            }
          }

          .write {
            flex: 0 0 50%;
            vertical-align: middle;

            input {
              height: 100%;
            }
          }
        }

        button {
          background: #fff;
          color: #c59a76;
          font-size: 32rpx;
        }
      }
    }

    // 健康调理
    .condition {
      float: right;
      width: 100%;
      margin-top: 20rpx;

      .navi {
        float: right;
        padding: 9rpx 29rpx;
        border: 2rpx solid #c59a76;
        color: #c59a76;
        border-radius: 30rpx;
      }
    }

    // 保存按钮
    .save {
      width: 90%;
      background: #c59a76;
      color: #fff;
      border-radius: 42rpx;
      margin-top: 50rpx;
    }
  }
}
</style>
>
