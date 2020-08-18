<template>
  <view class="box">
    <view class="logo">
      <image src="/static/login/login_logo.png" mode="aspectFit"></image>
    </view>
    <view class="info">
      <form>
        <ul>
          <li>
            <view class="area">+86
              <i></i>
            </view>
            <input type="number" placeholder="请输入手机号" class="phone" v-model.lazy="phone" maxlength="13" @focus="phoneIn" @blur="phoneOut" />
            <view class="emptyBg" @click="emptyClick">
              <view class="empty" v-show="empty"></view>
            </view>
          </li>
          <li>
            <input type="number" placeholder="请输入验证码" v-model.number="proving" maxlength="6" />
            <view class="proving" @click="check" v-if="checkflag">发送验证码</view>
            <view class="non_proving" v-else>重新发送({{ time + 's' }})</view>
          </li>
        </ul>
        <button @click="sign" :class="phone != '' && proving != ''?'active':''" style="width: 572rpx;">登 录</button>
      </form>
    </view>
    <view class="bg">
      <image src="../../static/login/login_bg.png" mode=""></image>
    </view>
  </view>
</template>

<script>
import pakTool from "../../common/utils/utility.js";
export default {
  data() {
    return {
      phone: "",
      proving: "", // 验证码
      empty: false,
      time: 30,
      checkflag: true,
      // 门店数据
      // depts:[{"id":"5f8a70d1-86e5-444c-b1a9-d1f0a80298fe","parent_id":"fbe89abb-bae8-4b4c-a3e7-351697cd425a","company_id":"1","rgt":"71","lft":"70","depth":"3","code":"B102","name":"B1分店","org_type":"3","org_image_path":"http://xiaode.oos-cn.ctyunapi.cn/20200714/png/yhd/upload/202007141042301256524.png","province_id":null,"city_id":null,"district_id":null,"address":null,"manager_name":"侯飞","manager_tel":null,"manager_mobile":"13770564938","sms_num":null,"sms_used_num":null,"memo":null,"wx_openid":null,"user_num":null,"exp_date":null,"create_user":"89c22367-1c6a-489d-90ee-c9a0467109aa","create_time":"2020-07-27 11:33:48.0","edit_user":"89c22367-1c6a-489d-90ee-c9a0467109aa","edit_time":"2020-07-27 14:01:18.0","exc_key":"1","dr":"0"},{"id":"aecd71f8-94de-4b55-b0ac-d961965293ee","parent_id":"fbe89abb-bae8-4b4c-a3e7-351697cd425a","company_id":"1","rgt":"73","lft":"72","depth":"3","code":"B103","name":"B2分店","org_type":"3","org_image_path":"http://xiaode.oos-cn.ctyunapi.cn/20200714/png/yhd/upload/202007141042301256524.png","province_id":null,"city_id":null,"district_id":null,"address":null,"manager_name":"侯飞","manager_tel":null,"manager_mobile":"13770564938","sms_num":null,"sms_used_num":null,"memo":null,"wx_openid":null,"user_num":null,"exp_date":null,"create_user":"89c22367-1c6a-489d-90ee-c9a0467109aa","create_time":"2020-07-27 14:01:47.0","edit_user":"89c22367-1c6a-489d-90ee-c9a0467109aa","edit_time":"2020-07-27 14:01:47.0","exc_key":"0","dr":"0"}]
    };
  },
  onShow() {
    wx.hideHomeButton();
  },
  onLoad() {
    var { id } = uni.getStorageSync("user");
  },
  watch: {
    // 监听phone
    phone(newValue, oldValue) {
      if (newValue.length > oldValue.length) {
        this.phone = newValue
          .replace(/\s/g, "")
          .replace(/(\d{3})(\d{0,4})(\d{0,4})/, "$1 $2 $3");
      } else {
        this.phone = this.phone.trim();
      }
    },
  },
  methods: {
    // 手机号获得焦点
    phoneIn: function () {
      this.empty = true;
    },
    // 手机号失去焦点
    phoneOut: function () {
      if (this.phone == "") {
        this.empty = !this.empty;
      }
    },
    // 清空手机号
    emptyClick: function () {
      this.phone = "";
      this.empty = !this.empty;
    },
    // 获取验证码
    check() {
      this.proving = ""; // 清空验证码
      let phone = this.phone.replace(/\s+/g, "");
      let oldTime = this.time;
      // 手机号正则
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        uni.showToast({
          title: "手机号码有误，请重填",
          icon: "none",
          duration: 2000,
        });
        return false;
      }
      let requestPak = pakTool.createRequestPak();
      console.log(requestPak);
      requestPak.requestBody = {
        phone: this.phone.replace(/\s+/g, ""),
      };
      pakTool
        .request(this, "/customerApp/sendIdentifyingCode", requestPak)
        .then((res) => {
          const { data } = res;
          this.checkflag = false;
          uni.showToast({
            title: "已发送，请稍等",
            icon: "success",
            duration: 2000,
          });
          clearInterval(this.interval);
          let interval = setInterval(() => {
            if (this.time <= 1) {
              clearInterval(this.interval);
              this.checkflag = true;
              this.time = oldTime;
            }
            this.time--;
          }, 1000);
        });
    },
    // 登录
    sign() {
      if (this.phone == "") {
        uni.showToast({
          title: "请输入手机号",
          icon: "none",
        });
        return;
      }
      if (this.proving == "") {
        uni.showToast({
          title: "请输入验证码",
          icon: "none",
        });
        return;
      }
      if (this.phone == "" || this.proving == "") {
        return false;
      }
      var { id } = uni.getStorageSync("user");
      let requestPak = pakTool.createRequestPak();
      console.log(requestPak);
      requestPak.requestBody = {
        phone: this.phone.replace(/\s+/g, ""),
        identifyingCode: this.proving,
        member_id: id,
      };
      pakTool
        .request(this, "/customerApp/loginByPhone", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":{"admin_user_id":"89c22367-1c6a-489d-90ee-c9a0467109aa","belongOrg":{"id":"fbe89abb-bae8-4b4c-a3e7-351697cd425a","parent_id":"e3812bf7-4c2d-4629-922c-055e13246c9b","company_id":"1","rgt":"72","lft":"69","depth":"3","code":"B0101","name":"B总店","org_type":"3","org_image_path":"http://xiaode.oos-cn.ctyunapi.cn/20200714/png/yhd/upload/202007141042301256524.png","province_id":null,"city_id":null,"district_id":null,"address":null,"manager_name":"张天昊","manager_tel":null,"manager_mobile":"18842358732","sms_num":null,"sms_used_num":null,"memo":null,"wx_openid":null,"user_num":null,"exp_date":null,"create_user":"1","create_time":"2020-07-20 09:37:37.0","edit_user":"1","edit_time":"2020-07-20 11:03:56.0","exc_key":"1","dr":"0"},"wx_memberId":"75c60048-d448-47f1-b7f2-767b26bf2e92","isAdmin":"Y","depts":[{"id":"5f8a70d1-86e5-444c-b1a9-d1f0a80298fe","parent_id":"fbe89abb-bae8-4b4c-a3e7-351697cd425a","company_id":"1","rgt":"71","lft":"70","depth":"3","code":"B102","name":"B分店","org_type":"3","org_image_path":"http://xiaode.oos-cn.ctyunapi.cn/20200714/png/yhd/upload/202007141042301256524.png","province_id":null,"city_id":null,"district_id":null,"address":null,"manager_name":"侯飞","manager_tel":null,"manager_mobile":"13770564938","sms_num":null,"sms_used_num":null,"memo":null,"wx_openid":null,"user_num":null,"exp_date":null,"create_user":"89c22367-1c6a-489d-90ee-c9a0467109aa","create_time":"2020-07-27 11:33:48.0","edit_user":"89c22367-1c6a-489d-90ee-c9a0467109aa","edit_time":"2020-07-27 11:33:48.0","exc_key":"0","dr":"0"}]}}
          const { data, code, message } = res;
          if (code == 200) {
            uni.showToast({
              title: "登录成功",
              type: "success",
            });
            // 将用户类别存入本地
            uni.setStorageSync("admin_user", data);
            uni.setStorageSync("phone", this.phone.replace(/\s+/g, ""));
            uni.setStorageSync("plan_time", []);
            this.$store.commit("saveadmin", data);
            // 如果是经销商则返回一个门店数组  如果数组为空直接跳入主页 否则进行门店筛选
            uni.setStorageSync("depts", data.depts);
            const distributor = uni.getStorageSync("depts");
            // 存入门店id
            if (data.belongOrg.id) {
              uni.setStorageSync("dealerDeptId", data.belongOrg.id);
              uni.setStorageSync("belongOrg", data.belongOrg);
            }
            if (distributor.length != 0) {
              uni.setStorageSync("isAdmin", "Y");
              uni.redirectTo({
                url: "/pages/jxs_depts/jxs_depts",
              });
            } else {
              uni.switchTab({
                url: "/pages/home/home",
              });
            }
          } else {
            uni.showToast({
              title: message,
              icon: "none",
            });
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  overflow: hidden;

  // logo
  .logo {
    display: flex;
    justify-content: center;
    margin: 51rpx 80rpx;

    image {
      width: 158rpx;
      height: 228rpx;
    }
  }

  // 表单
  .info {
    display: flex;
    justify-content: center;

    form {
      width: 545rpx;
    }

    ul {
      li {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border-bottom: 2rpx solid #a4a4a4;

        // 表单input
        input {
          font-size: 34rpx;
          color: #333;
          line-height: 48rpx;
        }

        .area {
          color: #c59a76;
          font-size: 30rpx;
          width: 80rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;

          /* 电话区号 */
          i {
            display: block;
            background: url(../../static/login/login_gt.png) no-repeat;
            background-size: 100%;
            width: 10rpx;
            height: 19rpx;
            margin-top: 6rpx;
          }
        }

        // 手机号
        .phone {
          padding: 0 20rpx;
        }

        // 清空手机号
        .emptyBg {
          width: 21rpx;
          height: 21rpx;

          .empty {
            background: url(../../static/login/login_empty.png) no-repeat;
            background-size: 100%;
            width: 21rpx;
            height: 21rpx;
          }
        }

        // 验证码
        .proving {
          color: #c59a76;
          font-size: 30rpx;
          width: 40%;
        }

        .non_proving {
          color: #999999;
          font-size: 30rpx;
          width: 40%;
        }
      }
    }

    // 登录按钮
    form button {
      background: #cccccc;
      margin-top: 80rpx;
      border-radius: 41rpx;
      color: #fff;
      font-size: 34rpx;
    }

    form button.active {
      background: #c59a76;
    }
  }

  // 背景
  .bg {
    position: absolute;
    bottom: 0;
    left: 0;
  }
}
</style>
