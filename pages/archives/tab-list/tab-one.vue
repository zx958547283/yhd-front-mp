<template>
  <view class="tabone">
    <!-- 顶部表单 -->
    <view class="tabone_top">
      <my-cell title="身高" :num='form.height' unit='cm'></my-cell>
      <my-cell title="体重" :num='form.weight' unit='kg'></my-cell>
      <my-cell title="左眼" :num='form.left_eye'></my-cell>
      <my-cell title="右眼" :num='form.right_eye'></my-cell>
      <my-cell title="出生日期" :num='form.birthday'></my-cell>
      <my-cell title="农历生日" :num='form.lunar'></my-cell>
      <my-cell title="身份证号" :num='form.id_card'></my-cell>
      <my-cell title="地址" :num='form.address'></my-cell>
      <my-cell title="邮箱" :num='form.email' bor='1'></my-cell>
    </view>
    <view class="tabone_mid">
      <view style="font-weight: 700;">治疗史</view>
      <view style="display: flex;background:#f7f7f7;word-wrap:break-word; word-break:break-all;overflow: hidden;border-radius: 10rpx; padding: 24rpx 30rpx;margin: 20rpx 0;">
        <!-- <label class="radio"> -->
        {{ treat_sure }}
        <!-- </label> -->
      </view>
      <view style="font-weight: 700;">药物使用史</view>
      <view style="display: flex;background:#f7f7f7;word-wrap:break-word; word-break:break-all;overflow: hidden;border-radius: 10rpx; padding: 24rpx 30rpx;margin: 20rpx 0;">
        <!-- <label class="radio"> -->
        {{ medicinal_sure }}
        <!-- </label> -->
      </view>

      <view style="font-weight: 700;">过敏史</view>
      <view style="display: flex;background:#f7f7f7;word-wrap:break-word; word-break:break-all;overflow: hidden;border-radius: 10rpx; padding: 24rpx 30rpx;margin: 20rpx 0;">
        <!-- <label class="radio"> -->
        {{ allergy_sure }}
        <!-- </label> -->
      </view>
      <view style="font-weight: 700;">既往病史</view>
      <view style="padding: 24rpx 30rpx;box-sizing: border-box;margin: 20rpx 0;border-radius: 10rpx;" class="ill">
        <view class="ill_radio" v-for="(item) in ill_list" :key='item.def_list_id'>
          {{item.name}}
        </view>
        <view class="ill_radio">
          {{other_ill}}
        </view>
      </view>
    </view>
    <view class="tabone_btm">
      <view class="">
        <view class="" style="font-weight: 700;">
          手术史
        </view>
        <view class="quil">
          <textarea maxlength=50 @input="inp_operation" v-model="operation" placeholder="请输入您的内容~" disabled />
          </view>
			</view>
			<view style="margin-top: 30rpx;">
				<view class="" style="font-weight: 700;">
					家族史
				</view>
				<view class="quil">
					 <textarea  maxlength=50 @input = "inp_family" v-model="family" placeholder="请输入您的内容~" disabled/>
				</view>
			</view>
			<view style="margin-top: 30rpx;">
				<view class="" style="font-weight: 700;">
					备注
				</view>
				<view class="quil">
					 <textarea  maxlength=50 @input = "inp_remarks" v-model="remarks" placeholder="请输入您的内容~" disabled/>
				</view>
			</view>
			<view style="margin-top: 30rpx;">
				<view class="" style="font-weight: 700;">
					其他情况
				</view>
				<view class="quil">
					 <textarea  maxlength=50 @input = "inp_others" v-model="others" placeholder="请输入您的内容~" disabled/>
				</view>
			</view>
			<button type="primary" @click="save">重新编辑</button>
		</view>
	</view>
</template>
<script>
import MyCell from "@/components/cell.vue";
import pakTool from "@/common/utils/utility.js"; // 调用接口
export default {
  components: {
    MyCell,
  },
  mounted() {
    this.getData();
  },
  props: ["add"],
  data() {
    return {
      form: {
        height: "",
        weight: "",
        left_eye: "",
        right_eye: "",
        birthday: "",
        lunar: "",
        id_card: "",
        address: "",
        email: "",
      },
      allergy_sure: "", //过敏史,
      medicinal_sure: "", //药物使用史
      treat_sure: "", //治疗史
      ill_sure: [], //病史
      ill_list: [],
      operation: "", //手术史文字
      family: "", //家族史文字
      remarks: "", //备注文字
      other_ill: "", //其他病史
      others: "", //其他情况文字
    };
  },
  methods: {
    // 编辑
    save() {
      // 如果第一次没有添加 则进入重新添加
      if (this.tabone == null) {
        console.log("第一次添加");
        uni.redirectTo({
          url: "/pages/addarchives/addarchives?add=" + this.add,
        });
        return;
      }
      uni.redirectTo({
        url:
          "/pages/addarchives/addarchives?userId=" +
          this.add +
          "&id=" +
          this.id +
          "&exc_key=" +
          this.tabone.memberInfo.exc_key,
      });
    },
    // 获取表单信息
    getData() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        member_id: this.add,
      };
      pakTool
        .request(this, "/madyApp/getMemberHealthRecord", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":{"targs":["超级VIP","潜力客户","线上"],"healthHistory":{"id":"42badaf4-de09-4fc9-a678-fa2e88a376b2","member_id":"b0e964f2-384d-4dc8-91fd-3b45bb7b60de","irritability":"过敏史","ill":"1dfd1c87-a095-11ea-a951-506b4bc21cca,31a6445f-a095-11ea-a951-506b4bc21cca,4202bd7f-a095-11ea-a951-506b4bc21cca","operation":"手术史","family":"家族史","comment":"备注","create_user":null,"create_time":"2020-07-27 14:52:15.0","edit_user":null,"edit_time":null,"exc_key":"0","dr":"0","other_ill":"螨虫过敏","cure":"治疗史","medicinal":"药物使用史","others":"其他情况"},"memberInfo":{"id":"b0e964f2-384d-4dc8-91fd-3b45bb7b60de","organization_id":null,"company_id":null,"depart_id":"5f8a70d1-86e5-444c-b1a9-d1f0a80298fe","parent_id":null,"depth":null,"rgt":null,"lft":null,"team_id":null,"member_level_id":null,"username":null,"password":null,"nickname":null,"real_name":"完整数据","phone":"13777777985","status":null,"icon":"","gender":"1","birthday":"1999-01-01","province":null,"city":null,"area":null,"job":null,"personalized_signature":null,"source_type":null,"integration":null,"growth":null,"luckey_count":null,"history_integration":null,"wx_openId":null,"wx_union_id":null,"employee_flg":"0","employee_id":null,"qr_code":null,"id_card":"32010019990101456X","email":"9@qq.com","create_user":"89c22367-1c6a-489d-90ee-c9a0467109aa","create_time":"2020-07-27 14:47:12.0","edit_user":null,"edit_time":"2020-07-27 14:56:51.0","exc_key":"4","dr":"0","address":"家庭住址","height":"123","weight":"23","left_eye":"123","right_eye":"123","member_tag":"tag1&&9f89080b-c59a-46e4-8bea-5ff30e04ece6,tag2&&b743c66c-a090-11ea-a951-506b4bc21cca,tag3&&cf115f03-a090-11ea-a951-506b4bc21cca","surplus_amount":"100.00","comment":"","store_name":null,"from_employee":"d139f4dc-6961-4b71-b653-eacd66996e2c","surplus_times":"2","lunar":"冬月十四","is_top":1,"service_admin_id":"260c23c4-2a79-4a27-bdc7-0d2a10324295"},"illHistory":[{"name":"感冒","id":"1dfd1c87-a095-11ea-a951-506b4bc21cca"},{"name":"高血压","id":"31a6445f-a095-11ea-a951-506b4bc21cca"},{"name":"高血糖","id":"4202bd7f-a095-11ea-a951-506b4bc21cca"}],"historyIll":[{"def_list_id":"1dfd1c87-a095-11ea-a951-506b4bc21cca","code":"ill-1","name":"感冒","value":"感冒","memo":null,"fix":null},{"def_list_id":"31a6445f-a095-11ea-a951-506b4bc21cca","code":"ill-2","name":"高血压","value":"高血压","memo":null,"fix":null},{"def_list_id":"4202bd7f-a095-11ea-a951-506b4bc21cca","code":"ill-3","name":"高血糖","value":"高血糖","memo":null,"fix":null}]}}
          const { data } = res;
          this.tabone = data;
          console.log(data, "列表记录");
          if (this.tabone == null) {
            this.form.birthday = this.$store.state.form.date;
            this.form.id_card = this.$store.state.form.card;
            this.form.address = this.$store.state.form.address;
            this.form.email = this.$store.state.form.mail;
            this.form.lunar = this.$store.state.form.lunar;
          } else {
            this.form = this.tabone.memberInfo;
            this.ill_list = this.tabone.illHistory;
            if (this.tabone.healthHistory) {
              this.allergy_sure =
                this.tabone.healthHistory.irritability || "无";
              this.treat_sure = this.tabone.healthHistory.cure || "无";
              this.medicinal_sure = this.tabone.healthHistory.medicinal || "无";
              if (
                this.tabone.illHistory.length == 0 &&
                this.tabone.healthHistory.other_ill == ""
              ) {
                this.other_ill = "无";
              } else {
                this.other_ill = this.tabone.healthHistory.other_ill;
              }
              this.family = this.tabone.healthHistory.family || "无";
              this.operation = this.tabone.healthHistory.operation || "无";
              this.remarks = this.tabone.healthHistory.comment || "无";
              this.others = this.tabone.healthHistory.others || "无";
              this.id = this.tabone.healthHistory.id;
            } else {
              this.allergy_sure = "无";
              this.treat_sure = "无";
              this.medicinal_sure = "无";
              this.other_ill = "无";
              this.family = "无";
              this.operation = "无";
              this.remarks = "无";
              this.others = "无";
              this.id = "";
            }
          }
        });
    },
  },
};
</script>

<style lang="less" scoped>
.tabone {
  font-size: 30rpx;
  .tabone_top {
    background-color: #ffffff;
  }
  .tabone_mid {
    padding: 30rpx;
    margin-top: 20rpx;
    background-color: #ffffff;
    .radio {
      flex: 0 0 33%;
      image {
        width: 36rpx;
        height: 36rpx;
        vertical-align: middle;
        margin-right: 20rpx;
      }
    }
    .ill {
      display: flex;
      justify-content: space-between;
      width: 100%;
      flex-wrap: wrap;
      background: #f7f7f7;
      .ill_radio {
        flex: 0 0 33%;
        image {
          width: 36rpx;
          height: 36rpx;
          vertical-align: middle;
          margin-right: 20rpx;
        }
      }
    }
    .area {
      margin-bottom: 30rpx;
      textarea {
        padding: 30rpx;
        background-color: #f7f7f7;
      }
    }
  }
  .tabone_btm {
    padding: 30rpx;
    margin-top: 20rpx;
    background-color: #ffffff;
    .quil {
      margin-top: 30rpx;
      height: 210rpx;
      background-color: #f7f7f7;
      box-sizing: border-box;
      padding: 30rpx;
      position: relative;
      border-radius: 10rpx;
      textarea {
        height: 100%;
        width: 100%;
        font-size: 28rpx;
      }
      .num {
        position: absolute;
        right: 3%;
        bottom: 5%;
        font-size: 28rpx;
        .grey {
          color: #c2c2c2;
        }
      }
    }
  }
  button {
    width: 90%;
    margin: 0 auto;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    background-color: #c59a76;
    margin-top: 60rpx;
  }
}
</style>
