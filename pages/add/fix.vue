<template>
  <view class="box">
    <!-- 表单上部 -->
    <view class="add_top">
      <view class="add_inp">
        <view class="thread" style="height: 150rpx;line-height: 150rpx;">
          <text view class="title" style="height: 150rpx;line-height: 150rpx;">头像</text>
          <view class="uni-input" @click="upload" style="height: 150rpx;line-height: 150rpx;">
            <view class="cir">
              <image :src="head" mode="" v-if="head!=''" class="head"></image>
              <image src="../../static/images/camera.png" mode="" v-if="head==''" class="cinema"></image>
            </view>
            <image src="../../static/images/cher.png" mode="" class="point"></image>
          </view>
        </view>
      </view>
      <view class="add_inp">
        <view class="thread">
          <text view class="title">姓名<text>*</text></text>
          <input class="uni-input" :placeholder="place==true?'':'请输入'" v-model="name" />
        </view>
      </view>
      <view class="add_inp">
        <view class="thread">
          <text view class="title">性别</text>
          <view class="uni-input">
            <label class="radio" style="margin-right: 30rpx;width: 130rpx;display: inline-block;" @click="radio(1)">
              <image :src="sex==1?active:none" class="radio_man"></image> 男
            </label>
            <label class="radio" @click="radio(2)" style="width: 130rpx;display: inline-block;">
              <image :src="sex==2?active:none"></image> 女
            </label>
          </view>
        </view>
      </view>
      <view class="add_inp">
        <view class="thread">
          <text view class="title">联系电话<text>*</text></text>
          <input class="uni-input" type="number" :placeholder="place==true?'':'请输入'" v-model="phone" maxlength="11" />
        </view>
      </view>
      <view class="add_inp">
        <view class="thread">
          <text view class="title">身份证号</text>
          <input class="uni-input" type="idcard" :placeholder="place==true?'':'请输入'" v-model="card" />
        </view>
      </view>
      <view class="bir">
        <view class="thread">
          <view class="title">
            出生日期
          </view>
          <view class="select_date">
            <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
              <view class="date">{{date==null?'':date}} <image src="../../static/images/cher.png" mode="" class="point"></image>
              </view>
            </picker>
          </view>
        </view>
      </view>
      <view class="add_inp">
        <view class="thread">
          <text view class="title">农历生日</text>
          <input class="uni-input" :placeholder="place==true?'':'请输入'" v-model="lunar" />
        </view>
      </view>
      <view class="add_inp">
        <view class="thread">
          <text view class="title">邮箱</text>
          <input class="uni-input" :placeholder="place==true?'':'请输入'" v-model="mail" />
        </view>
      </view>
      <view class="area_inp">
        <text view class="area_title">家庭住址</text>
        <!--  <input class="uni-input" focus :placeholder="place==true?'':'请输入'" v-model="address"/> -->
        <view class="area_father" style="padding: 30rpx 0;">
          <textarea :placeholder="place==true?'':'请输入'" auto-height class="area" v-model="address" />
          </view>
				<view class="" style="clear: both;"></view>
				</view>
			</view>
		<!-- 表单中部 -->
		<view class="add_mid">
			  		
					<view class="tag">
						<view class="thread">
							<view class="title" @click="addtag">
								客户标签
								<image src="../../static/images/cher.png" mode="" class="point" @click="addtag"></image>
							</view>
							<view class="tag_sel" v-if="tagarr.length!=0">
								<view class="tag_one" v-if="tagarr[0].name!=null&&tagarr[0]">
									{{tagarr[0].name}}
								</view>
								<view class="tag_two" v-if="tagarr[1].name!=null&&tagarr[1]">
									{{tagarr[1].name}}
								</view>
								<view class="tag_three" v-if="tagarr[2].name!=null&&tagarr[2]">
									{{tagarr[2].name}}
								</view>
							</view>
						</view>
					</view>
					<view class="bir" v-if="dpts_list.length!=0">
						<view class="thread" >		  
							<view class="title">	  
								选择门店
							</view>
							<view class="select_date">
								<picker :value="dpts"  @change="seldpts" :range="dpts_list" :range-key="'name'">
									<view class="date">{{dpts_name}} <image src="../../static/images/cher.png" mode="" class="point"></image></view> 
								</picker>
							</view>
						</view>
					</view>
					<view class="bir" v-if="dpts_list.length!=0">
						<view class="thread" >		  
							<view class="title">	  
								维护专员
							</view>
							<view class="select_date">
								<picker :value="tai"  @change="seltai" :range="tai_list" :range-key="'name'">
									<view class="date">{{taiName}} <image src="../../static/images/cher.png" mode="" class="point"></image></view> 
								</picker>
							</view>
						</view>
					</view>
					<view class="bir" v-if="isAdmin=='Y'">
						<view class="thread">		  
							<view class="title">	  
								健康专员<text style="color: red;">*</text>
							</view>
							<view class="select_date">
								<picker :value="doc"  @change="seldoc" :range="doc_list" :range-key="'name'">
								<view class="date">{{doc_name}} <image src="../../static/images/cher.png" mode="" class="point"></image></view> 
								</picker>
							</view>
						</view>
					</view>
					<view class="bir" v-if="isAdmin=='Y'">
						<view class="thread">		  
							<view class="title">	  
								服务专员
							</view>
							<view class="select_date">
								<picker :value="ser"  @change="selser" :range="ser_list" :range-key="'name'">
								<view class="date">{{ser_name}} <image src="../../static/images/cher.png" mode="" class="point"></image></view> 
								</picker>
							</view>
						</view>
					</view>
					<view style=" background-color: #fff;overflow: hidden;">
						<button type="primary" @click="save" :disabled="disabled">保存</button>
					</view>
		</view>
		<!-- 表单底部 -->
		<!-- <view class="add_btm">
			<view class="title">
				备注
			</view>
			<view class="quil">
				 <textarea  maxlength=50 @input = "descInput" v-model="descirbe" placeholder="请输入您的内容~"/>
				 <view class="num"><span :class="remnant==0?'grey':''">{{remnant}}</span>/50</view>
			</view>
			<button type="primary" @click="setUser" :disabled="disabled">保存</button>
		</view> -->
	</view>
</template>

<script>
import pakTool from "@/common/utils/utility.js";
import config from "../../common/config/config.js";
import { Lunar } from "./lunar.js";
export default {
  components: {},
  onLoad(option) {
    this.id = option.id;
    this.isAdmin = uni.getStorageSync("isAdmin");
    // this.isAdmin = 'Y'
    if (this.isAdmin == "Y") {
      this.getdoc();
      return;
    }
    this.getUser();
  },
  onShow() {},
  data() {
    return {
      display: false, //是否显示缓存数据
      title: "picker",
      index: 0,
      remnant: 0,
      date: "", //生日
      lunar: "", //农历生日
      head: "", //头像 展示
      head_url: "", // 服务器返回的地址
      sex: "", //性别
      name: "", //名字
      phone: "", //电话
      card: "", //身份证
      mail: "", //邮箱
      address: "", //地址
      descirbe: "", //备注
      tagarr: [], //传过来的tag
      tagarr_back: [],
      tagarr_fix: [], //传后台
      none: "../../static/images/danxuan-2@2x.png", //单选选中
      active: "../../static/images/danxuan@2x.png", //单选没选中
      form: {}, //用户信息表单
      doc: "", // 健康专员index
      doc_list: [], // 健康专员名单
      ser: "", // 服务专员index
      ser_list: [], //服务专员名单
      ser_name: "", //服务专员名字
      ser_code: "", //服务专员id
      dpts: "", //部门index
      dpts_name: "", //部门名称
      dpts_code: "", //部门id
      dpts_list: uni.getStorageSync("depts"), //部门列表
      tai: "", //维护专员index
      taiName: "", //维护专员名
      tai_code: "", //维护专员id
      tai_list: "", //维护专员列表
      id: "",
      exc_key: "",
      send_tag: [],
      no_change: false,
      isAdmin: false, //是不是店长
      doc_name: "",
      employeeId: "", //健康专员
      doc_code: "",
      disabled: false, // 防抖
    };
  },
  computed: {
    startDate() {
      return this.getDate("start");
    },
    endDate() {
      return this.getDate("end");
    },
  },
  watch: {
    card() {
      if (this.card.length == 18) {
        var lun = this.getBirth(this.card);
        var lunArr = lun.split(",");
        var IMonthCn = Lunar.solar2lunar(lunArr[0], lunArr[1], lunArr[2])
          .IMonthCn;
        var IDayCn = Lunar.solar2lunar(lunArr[0], lunArr[1], lunArr[2]).IDayCn;
        this.lunar = IMonthCn + IDayCn;
        this.date = `${lunArr[0]}-${lunArr[1]}-${lunArr[2]}`;
      }
    },
  },
  methods: {
    //身份证提取生日
    getBirth(idCard) {
      var birthday = "";
      if (idCard != null && idCard != "") {
        if (idCard.length == 15) {
          birthday = "19" + idCard.slice(6, 12);
        } else if (idCard.length == 18) {
          birthday = idCard.slice(6, 14);
        }
        birthday = birthday.replace(/(.{4})(.{2})/, "$1,$2,");
        //通过正则表达式来指定输出格式为:1990,01,01
      }
      return birthday;
    },
    bindDateChange(e) {
      this.date = e.target.value;
      //公历转农历
      var lunArr = this.date.split("-");
      var IMonthCn = Lunar.solar2lunar(lunArr[0], lunArr[1], lunArr[2])
        .IMonthCn;
      var IDayCn = Lunar.solar2lunar(lunArr[0], lunArr[1], lunArr[2]).IDayCn;
      this.lunar = IMonthCn + IDayCn;
    },
    // 选择健康专员
    seldoc(e) {
      this.doc = e.target.value;
      if (this.doc_list[e.target.value] == undefined) {
        this.doc_name = "";
        return;
      }
      this.doc_code = this.doc_list[this.doc].value;
      this.doc_name = this.doc_list[this.doc].name;
    },
    // 选择服务专员
    selser(e) {
      this.ser = e.target.value;
      if (this.ser_list[this.ser] == undefined) {
        this.ser_name = "";
        return;
      }
      this.ser_code = this.ser_list[this.ser].value;
      this.ser_name = this.ser_list[this.ser].name;
    },
    // 选择门店
    seldpts(e) {
      this.dpts = e.target.value;
      this.dpts_name = this.dpts_list[this.dpts].name;
      this.dpts_code = this.dpts_list[this.dpts].id;
      this.ser_name = "";
      this.doc_name = "";
      this.taiName = "";
      this.tai_code = "";
      this.ser_code = "";
      this.doc_code = "";
      var that = this;
      // 切换门店后获取对应的健康/服务专员
      uni.request({
        url: config.contextPath + "/ums/getAllEmployee",
        method: "post",
        data: {
          platform: "wx",
          requestUser: "1",
          requestBody: {},
          // token: "505d644c-6270-43b4-ab4b-4a56dec8da73",
          token: "aee8fc94-fe02-4f9e-a659-fb37a0fda2ec",
          sign: "aaaa-bbbb-cccc-ddd",
          dealerDeptId: that.dpts_code,
          requestBody: {
            admin_user_id: uni.getStorageSync("admin_user_id"),
          },
        },
        success: (res) => {
          console.log(res);
          this.doc_list = [];
          this.ser_list = [];
          const {
            data: { data },
          } = res;
          if (data.healthers.length != 0) {
            data.healthers.map((item, index) => {
              this.doc_list.push({ name: item.username, value: item.id });
            });
          }
          if (data.servers.length != 0) {
            data.servers.map((item, index) => {
              this.ser_list.push({ name: item.username, value: item.id });
            });
          }
        },
      });
      // 获取对应维护专员
      this.getTai(this.dpts_code);
    },
    //选择维护专员
    seltai(val) {
      this.tai = val.detail.value;
      if (this.tai_list[this.tai] == undefined) {
        this.tai = "";
        return;
      }
      this.tai_code = this.tai_list[this.tai].value;
      this.employeeId = this.tai_list[this.tai].value;
      this.taiName = this.tai_list[this.tai].name;
      for (var i = 0; i < this.doc_list.length; i++) {
        if (this.doc_list[i].value == this.tai_code) {
          this.doc_name = this.doc_list[i].name;
          this.doc_code = this.doc_list[i].value;
          console.log("存在");
          break;
        } else {
          this.doc_name = "";
          this.doc_code = "";
        }
      }
      for (var j = 0; j < this.ser_list.length; j++) {
        if (this.ser_list[j].value == this.tai_code) {
          this.ser_name = this.ser_list[j].name;
          this.ser_code = this.ser_list[j].value;
          break;
        } else {
          this.ser_name = "";
          this.ser_code = "";
        }
      }
    },
    getDate(type) {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (type === "start") {
        year = year - 120;
      } else if (type === "end") {
        year = year;
      }
      month = month > 9 ? month : "0" + month;
      day = day > 9 ? day : "0" + day;
      return `${year}-${month}-${day}`;
    },
    //监听textarea字数
    descInput(e) {
      this.remnant = e.detail.value.length;
    },
    //头像上传
    upload() {
      var that = this;
      uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          this.head = tempFilePaths[0];
          console.log(this.head);
          uni.uploadFile({
            url: that.config.contextPath + "common/uploadFile",
            filePath: tempFilePaths[0],
            name: "file",
            success: (uploadFileRes) => {
              let temp = JSON.parse(uploadFileRes.data);
              this.head_url = temp.data.fileURL;
            },
          });
        },
      });
    },
    //性别选择单选
    radio(e) {
      this.sex = e;
      console.log(this.sex);
    },

    //保存上传
    save() {
      //手机正则
      if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        uni.showToast({
          title: "手机号码有误，请重填",
          icon: "none",
          duration: 2000,
        });
        return false;
      }
      //邮箱验证
      if (this.mail != "") {
        if (
          !/^(([^()[\]\\.,;:\s@\"]+(\.[^()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            this.mail
          )
        ) {
          uni.showToast({
            title: "邮箱有误，请重填",
            icon: "none",
            duration: 2000,
          });
          return false;
        }
      }
      if (!/(^([a-zA-Z]+\s)*[a-zA-Z]+$)|(^[\u4e00-\u9fa5]+$)/.test(this.name)) {
        uni.showToast({
          title: "请输入中文或英文名字",
          icon: "none",
          duration: 2000,
        });
        return false;
      }
      //必填名字
      if (this.name == "") {
        uni.showToast({
          title: "请填写姓名",
          icon: "none",
          duration: 2000,
        });
        return false;
      }
      //身份证校验
      var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (this.card && !regIdNo.test(this.card)) {
        uni.showToast({
          title: "身份证号有误，请重填",
          icon: "none",
          duration: 2000,
        });
        return false;
      }
      if (this.isAdmin == "Y" && this.doc_code == "") {
        uni.showToast({
          title: "请选择健康专员",
          icon: "none",
        });
        return;
      }
      if (this.disabled) {
        return;
      }
      this.disabled = true;
      // 修改用户数据
      this.setUser();
    },

    // 跳转添加客户标签
    addtag() {
      // 将之前所有信息存入vuex中
      uni.navigateTo({
        url:
          "/pages/customertag/customertag?fix=" + JSON.stringify(this.tagarr),
      });
    },

    // 获取用户数据
    getUser() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        member_id: this.id, // 客户id
        admin_user_id: uni.getStorageSync("admin_user_id"), // 登录员工id
      };
      pakTool
        .request(this, "/madyApp/getCustomerCenter", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":{"doctor":"张","targs":[],"server":"张","memberInfo":{"id":"985be3eb-67df-484d-8bac-a096601b54ca","organization_id":"1","company_id":null,"depart_id":"5f8a70d1-86e5-444c-b1a9-d1f0a80298fe","parent_id":null,"depth":null,"rgt":null,"lft":null,"team_id":null,"member_level_id":null,"username":null,"password":null,"nickname":"马大力","real_name":"马大力","phone":"13382018111","status":null,"icon":"","gender":"1","birthday":null,"province":null,"city":null,"area":null,"job":null,"personalized_signature":null,"source_type":null,"integration":null,"growth":null,"luckey_count":null,"history_integration":null,"wx_openId":null,"wx_union_id":null,"employee_flg":"0","employee_id":null,"qr_code":null,"id_card":"","email":"","create_user":"a1d8dc02-ca53-4f1b-b3c8-aa5590129eab","create_time":"2020-07-01 17:40:43.0","edit_user":"1","edit_time":"2020-08-14 17:43:42.0","exc_key":"13","dr":"0","address":"","height":"","weight":"","left_eye":"","right_eye":"","member_tag":"","surplus_amount":"0.00","comment":"","store_name":null,"from_employee":"a1d8dc02-ca53-4f1b-b3c8-aa5590129eab","surplus_times":"-2","lunar":"","is_top":1,"service_admin_id":"a1d8dc02-ca53-4f1b-b3c8-aa5590129eab"},"totalConsumeCnt":2,"surplusCnt":-2,"totalDepositCnt":0}}
          const { data } = res;
          console.log(data);
          this.head = data.memberInfo.icon;
          this.head_url = data.memberInfo.icon;
          this.sex = data.memberInfo.gender;
          this.name = data.memberInfo.real_name;
          this.phone = data.memberInfo.phone;
          this.card = data.memberInfo.id_card;
          this.mail = data.memberInfo.email;
          this.address = data.memberInfo.address;
          this.descirbe = data.memberInfo.comment;
          this.remnant = data.memberInfo.comment.length;
          this.tagarr_back = data.targs;
          this.exc_key = data.memberInfo.exc_key;
          this.id = data.memberInfo.id;
          var doct = data.doctor;
          var service = data.memberInfo.service_admin_id;
          if (this.dpts_list.length != 0) {
            var deptid = data.memberInfo.depart_id;
            const sel_dept = this.dpts_list.find((num) => num.id == deptid);
            this.dpts_name = sel_dept.name;
            this.dpts_code = sel_dept.id;
            this.getTaiUsed(this.dpts_code, data.memberInfo.create_user);
          }
          if (this.isAdmin == "N") {
            this.doc_code = data.memberInfo.from_employee;
            this.ser_code = data.memberInfo.service_admin_id;
          }
          if (this.doc_list.length != 0) {
            this.doc_list.map((item) => {
              if (item.name == doct) {
                this.doc = this.doc_list.indexOf(item);
                this.doc_name = this.doc_list[this.doc].name;
                this.doc_code = this.doc_list[this.doc].value;
              }
            });
          }
          if (this.ser_list.length != 0) {
            this.ser_list.map((item) => {
              if (item.value == service) {
                const sel_ser = this.ser_list.find(
                  (num) => num.value === item.value
                );
                this.ser_name = sel_ser.name;
                this.ser_code = sel_ser.value;
              }
            });
          }
          this.tagarr_fix = data.memberInfo.member_tag;
          this.date = data.memberInfo.birthday;
          this.lunar = data.memberInfo.lunar;
          data.targs.map((item) => {
            this.tagarr.push({ name: item });
          });
        });
    },
    // 获取维护专员
    getTai(dptCode) {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        chooseDept_id: dptCode,
      };
      pakTool
        .request(this, "madyApp/getDeptEmployee", requestPak)
        .then((res) => {
          const { data } = res;
          this.tai_list = [];
          console.log(res);
          if (data.length != 0) {
            data.map((item, index) => {
              this.tai_list.push({ name: item.username, value: item.id });
            });
          }
          this.tai_list.push({
            name: uni.getStorageSync("belongOrg").name,
            value: uni.getStorageSync("admin_user_id"),
          });
        });
    },
    // 获取历史维护专员
    getTaiUsed(dptCode, taiCode) {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        chooseDept_id: dptCode,
      };
      pakTool
        .request(this, "madyApp/getDeptEmployee", requestPak)
        .then((res) => {
          const { data } = res;
          this.tai_list = [];
          console.log(res);
          if (data.length != 0) {
            data.map((item, index) => {
              this.tai_list.push({ name: item.username, value: item.id });
            });
          }
          this.tai_list.push({
            name: uni.getStorageSync("belongOrg").name,
            value: uni.getStorageSync("admin_user_id"),
          });
          this.tai_list.map((item) => {
            if (item.value == taiCode) {
              const sel_tai = this.tai_list.find(
                (num) => num.value === item.value
              );
              this.taiName = sel_tai.name;
              this.tai_code = sel_tai.value;
            }
          });
        });
    },
    // 获取所有健康专员
    getdoc() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        admin_user_id: uni.getStorageSync("admin_user_id"),
      };
      pakTool.request(this, "/ums/getAllEmployee", requestPak).then((res) => {
        const { data, code } = res;
        // 添加健康专员/服务专员
        if (data.healthers.length != 0) {
          data.healthers.map((item, index) => {
            this.doc_list.push({ name: item.username, value: item.id });
          });
        }
        if (data.servers.length != 0) {
          data.servers.map((item, index) => {
            this.ser_list.push({ name: item.username, value: item.id });
          });
        }
        if (code == 200) {
          this.getUser();
        }
      });
    },
    // 修改用户数据
    setUser() {
      if (typeof this.tagarr_fix == "string") {
        this.send_tag = this.tagarr_fix;
      } else if (this.tagarr.length == 0) {
        this.send_tag = "";
      } else {
        this.send_tag =
          "tag1&&" +
          this.tagarr[0].def_list_id +
          "," +
          "tag2&&" +
          this.tagarr[1].def_list_id +
          "," +
          "tag3&&" +
          this.tagarr[2].def_list_id;
      }
      // uni.getStorageSync("admin_user_id")
      if (this.tai_code == "") {
        this.tai_code = uni.getStorageSync("admin_user_id");
      }
      if (this.doc_code == "" && this.isAdmin == "N") {
        this.doc_code = uni.getStorageSync("admin_user_id");
      }
      if (this.ser_code == "" && this.isAdmin == "N") {
        this.ser_code = uni.getStorageSync("admin_user_id");
      }
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        exc_key: this.exc_key,
        id: this.id, // 客户id
        member_header: this.head_url,
        member_name: this.name,
        member_sex: this.sex,
        phone: this.phone,
        idCard: this.card,
        address: this.address,
        email: this.mail,
        birthday: this.date,
        lunar: this.lunar,
        member_tag: this.send_tag,
        comment: this.descirbe,
        employeeId: this.tai_code,
        from_employee: this.doc_code,
        chooseDeptId: this.dpts_code,
        service_admin_id: this.ser_code,
      };
      pakTool.request(this, "/madyApp/saveMember", requestPak).then((res) => {
        const { data, code } = res;
        if (code == 200) {
          uni.showToast({
            title: "修改成功",
            success: () => {
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2]; //上一个页面
              // #ifdef H5
              prevPage.re = 1;
              // #endif
              // #ifndef H5
              prevPage.$vm.re = 1;
              // #endif
              uni.navigateBack({ delta: 1 });
            },
          });
        } else {
          uni.showToast({
            title: "保存失败",
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  font-size: 32rpx;
  background-color: #f7f7f7;
  //表单上部
  .add_top {
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
          right: 30rpx;
          transform: translate(0, -50%);
        }
      }
    }
    .bir {
      overflow: hidden;
      background-color: #fff;
      // position: relative;
      .thread {
        border-bottom: 2rpx solid #f7f7f7;
        height: 100rpx;
        margin: 0 30rpx;
      }
      .title {
        width: 30%;
        float: left;
        height: 100rpx;
        box-sizing: border-box;
        line-height: 100rpx;
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
  }
  //表单中部
  .add_mid {
    // margin-top: 20rpx;

    .bir {
      overflow: hidden;
      background-color: #fff;
      // position: relative;
      .thread {
        border-bottom: 2rpx solid #f7f7f7;
        height: 100rpx;
        margin: 0 30rpx;
      }
      .title {
        width: 30%;
        float: left;
        height: 100rpx;
        box-sizing: border-box;
        line-height: 100rpx;
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
    .tag {
      background-color: #fff;
      .thread {
        border-bottom: 2rpx solid #f7f7f7;
        margin: 0 30rpx;
      }
      .title {
        padding: 30rpx 0;
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
      .tag_sel {
        width: 100%;
        box-sizing: border-box;
        padding-bottom: 30rpx;
        display: flex;
        view {
          padding: 18rpx 0;
          width: 218rpx;
          height: 30rpx;
          border-radius: 40rpx;
          background-color: red;
          color: white;
          text-align: center;
          line-height: 30rpx;
        }
        .tag_one {
          background-color: #c59a76;
          margin: 0 10rpx;
        }
        .tag_two {
          background-color: #f9a94c;
          margin: 0 10rpx;
        }
        .tag_three {
          background-color: #eb7054;
          margin: 0 10rpx;
        }
      }
    }
  }
  // 表单底部
  // .add_btm {
  //   margin-top: 20rpx;
  //   padding: 0 30rpx 30rpx 30rpx;
  //   background-color: #fff;
  //   .title {
  //     padding: 30rpx 0;
  //   }
  //   .quil {
  //     height: 210rpx;
  //     background-color: #f7f7f7;
  //     box-sizing: border-box;
  //     padding: 30rpx;
  //     position: relative;
  //     border-radius: 10rpx;
  //     textarea {
  //       height: 100%;
  //       width: 100%;
  //       font-size: 28rpx;
  //     }
  //     .num {
  //       position: absolute;
  //       right: 3%;
  //       bottom: 5%;
  //       font-size: 28rpx;
  //       .grey {
  //         color: #c2c2c2;
  //       }
  //     }
  //   }

  // }
  button {
    width: 90%;
    margin: 80rpx auto;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    background-color: #c59a76;
    // margin-top: 60rpx;
  }
}
</style>
