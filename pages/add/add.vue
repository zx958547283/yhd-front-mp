<template>
	<view class="box">
		<!-- 表单上部 -->
		<view class="add_top">
			<view class="add_inp">
				<view class="thread" style="height: 150rpx;line-height: 150rpx;">
					<text view class="title"  style="height: 150rpx;line-height: 150rpx;">头像</text>
					<view class="uni-input" @click="upload"  style="height: 150rpx;line-height: 150rpx;">
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
						<label class="radio" style="margin-right: 140rpx;" @click="radio(1)">
							<image :src="sex==1?active:none" class="radio_man"></image> 男
						</label>
						<label class="radio" @click="radio(2)">
							<image :src="sex==2?active:none"></image> 女
						</label>
					</view>
				</view>
			</view>
			<view class="add_inp">
				<view class="thread">
					<text view class="title">联系电话<text>*</text></text>
					<input class="uni-input" type="number" :placeholder="place==true?'':'请输入'" v-model="phone" />
				</view>
			</view>
			<view class="add_inp">
				<view class="thread">
					<text view class="title">身份证号</text>
					<input class="uni-input" type="idcard" :placeholder="place==true?'':'请输入'" v-model="card" />
				</view>
			</view>
			<view class="add_inp">
				<view class="thread">
					<text view class="title">邮箱</text>
					<input class="uni-input" :placeholder="place==true?'':'请输入'" v-model="mail" />
				</view>
			</view>
			<view class="add_inp">
				<view class="thread">
					<text view class="title">农历生日</text>
					<input class="uni-input" :placeholder="place==true?'':'请输入'" v-model="lunar" />
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
			<view class="bir">			  
				<view class="thread">
					<view class="title">	  
						出生日期
					</view>
					<view class="select_date">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="date">{{date}} <image src="../../static/images/cher.png" mode="" class="point"></image></view> 
						</picker>
					</view>
				</view>
			</view>
      <view class="tag">
        <view class="thread">
        <view class="title" @click="addtag">
					客户标签
					<image src="../../static/images/cher.png" mode="" class="point" @click="addtag"></image>
				</view>
				<view class="tag_sel" v-if="tagarr.length!=0">
					<view class="tag_one" v-if="tagarr[0]">
						{{tagarr[0].name}}
					</view>
					<view class="tag_two" v-if="tagarr[1]">
						{{tagarr[1].name}}
					</view>
					<view class="tag_three" v-if="tagarr[2]">
						{{tagarr[2].name}}
					</view>
					</view>
				</view>
			</view>
			<view class="bir" v-if="isAdmin=='Y'">
				<view class="thread" >		  
					<view class="title">	  
						健康专员
					</view>
					<view class="select_date">
						<picker :value="doc"  @change="seldoc" :range="doc_list" :range-key="'name'">
							<view class="date">{{doc==''?'':doc_list[doc].name}} <image src="../../static/images/cher.png" mode="" class="point"></image></view> 
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
				 <textarea  maxlength=50 @input = "descInput" v-model="descirbe" :placeholder="place==true?'':'请输入您的内容~'"/>
				 <view class="num"><span :class="remnant==0?'grey':''">{{remnant}}</span>/50</view>
			</view>
			<button type="primary" @click="save" :disabled="disabled">保存</button>
		</view> -->
		<uni-popup ref="popup" type="center">
			<view class="pop">
				<image src="../../static/images/perfect.png" mode=""></image>
				<view class="sus_txt">
					客户添加成功
				</view>
				<view class="con_txt">
					是否需要继续对人员信息完善?
				</view>
				<view class="btm" >
					<view class="yes" @click.stop="jump">
						去完善
					</view>
					<view class="no" @click.stop="close">
						不需要
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import pakTool from "../../common/utils/utility.js";
export default {
  components: {
    uniPopup
    // uniPopupMessage,
    // uniPopupDialog
  },
  onLoad() {
    // 判断登录身份
    this.isAdmin = uni.getStorageSync("isAdmin");
    // this.isAdmin ='Y'
    this.getdoc();
  },
  onShow() {},
  data() {
    return {
      isAdmin: "", //是否是店长
      display: false, //是否显示缓存数据
      title: "picker",
      index: 0,
      remnant: 0,
      date: "", //生日
	  lunar:'',//农历生日
      head: "", //头像 展示用
      head_url: "", // 头像 服务器返回地址 传后台
      sex: "", //性别
      name: "", //名字
      phone: "", //电话
      card: "", //身份证
      mail: "", //邮箱
      address: "", //地址
      descirbe: "", //备注
      tagarr: [], //传过来的tag
      none: "../../static/images/danxuan-2@2x.png", //单选选中
      active: "../../static/images/danxuan@2x.png", //单选没选中
      form: {}, // 用户信息表单
      doc: "", // 健康专员index
      doc_code: "", //健康专员code 传送后台
      doc_list: [], // 健康专员名单
      employeeId: "", //登录员工id
      from_employee: "",
      tag: "",
      tagarr_fix: "", //传后台
      add: "", //id
      place: false, //隐藏place holder
      disabled: false // 防抖
    };
  },
  computed: {
    startDate() {
      return this.getDate("start");
    },
    endDate() {
      return this.getDate("end");
    }
  },
  methods: {
    bindDateChange(e) {
      this.date = e.target.value;
    },
    seldoc(e) {
      this.doc = e.target.value;
      this.doc_code = this.doc_list[e.target.value].value;
    },
    getDate(type) {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (type === "start") {
        year = year - 100;
      } else if (type === "end") {
        year = year + 2;
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
        sizeType: ["compressed", "camera"],
        success: chooseImageRes => {
          const tempFilePaths = chooseImageRes.tempFilePaths;
          this.head = tempFilePaths[0];
          console.log(this.head);
          uni.uploadFile({
            url: that.config.contextPath + "common/uploadFile",
            filePath: tempFilePaths[0],
            name: "file",
            success: uploadFileRes => {
              let temp = JSON.parse(uploadFileRes.data);
              this.head_url = temp.data.fileURL;
            }
          });
        }
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
          duration: 2000
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
            duration: 2000
          });
          return false;
        }
      }
      //必填名字
      if (this.name == "") {
        uni.showToast({
          title: "请填写姓名",
          icon: "none",
          duration: 2000
        });
        return false;
      }
      // 上传
      // 如果选择了tag标签
      if (this.tagarr.length != 0) {
        this.tag =
          "tag1&&" +
          this.tagarr[0].def_list_id +
          "," +
          "tag2&&" +
          this.tagarr[1].def_list_id +
          "," +
          "tag3&&" +
          this.tagarr[2].def_list_id;
        if (
          this.tagarr[0].def_list_id == null &&
          (this.tagarr[1].def_list_id == null) &
            (this.tagarr[2].def_list_id == null)
        ) {
          this.tag = "";
        }
      }
      // 防抖
      if (this.disabled) {
        return;
      }
      this.disabled = true;
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        exec_key: "",
        id: "",
        member_header: this.head_url,
        member_name: this.name,
        member_sex: this.sex,
        phone: this.phone,
        idCard: this.card,
        address: this.address,
        email: this.mail,
        birthday: this.date,
		lunar:this.lunar,
        member_tag: this.tag,
        comment: this.descirbe,
        employeeId: uni.getStorageSync("admin_user_id"),
        from_employee: this.doc_code
      };
      pakTool.request(this, "/madyApp/saveMember", requestPak).then(res => {
        const { data, code, message } = res;
        if (code == 200) {
          //vuex 记录需要传递的信息
          this.add = data.id;
          this.form = {
            name: this.name,
            head: this.head,
            sex: this.sex,
            phone: this.phone,
            card: this.card,
            mail: this.mail,
            address: this.address,
            describe: this.descirbe,
            date: this.date,
			lunar:this.lunar,
            remnant: this.remnant,
            tagarr: this.tagarr
          };
          this.$store.commit("savecustomer", this.form);
          this.place = true;
          if (this.place == true) {
            this.phone = "";
            this.card = "";
            this.address = "";
            this.mail = "";
			this.lunar = "";
          }
          this.$refs.popup.open();
        } else {
          this.disabled = false;
          uni.showToast({
            title: message,
            icon: "none"
          });
        }
      });
    },
    //跳转添加客户标签
    addtag() {
      uni.navigateTo({
        url: "/pages/customertag/customertag?now=" + JSON.stringify(this.tagarr)
      });
    },
    close() {
      // 如果选择了tag标签
      uni.redirectTo({
        url: "/pages/manage/manage"
      });
    },
    // 获取所有健康专员
    getdoc() {
      if (this.isAdmin == "Y") {
        let requestPak = pakTool.createRequestPak();
        requestPak.requestBody = {
          admin_user_id: uni.getStorageSync("admin_user_id")
        };
        pakTool
          .request(this, "/madyApp/getAllEmployee", requestPak)
          .then(res => {
            const { data } = res;
            // 添加健康专员
            console.log(data);
            data.map((item, index) => {
              this.doc_list.push({ name: item.username, value: item.id });
            });
          });
      }
    },
    // 保存数据+跳转
    jump() {
      uni.redirectTo({
        url: "/pages/addarchives/addarchives?add=" + this.add
      });
    }
  }
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
  //表单中部
  .add_mid {
    margin-top: 20rpx;

    .bir {
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
        height: 100rpx;
        // padding-left: 30rpx;
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
  //弹窗
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
    }
    .btm {
      display: flex;
      justify-content: space-around;
      padding: 0 30rpx;
      margin-top: 96rpx;
      .yes {
        padding: 18rpx 60rpx;
        display: inline-block;
        background-color: #c59a76;
        color: white;
        border-radius: 44rpx;
      }
      .no {
        padding: 18rpx 60rpx;
        background-color: #ffffff;
        display: inline-block;
        color: #c59a76;
        border-radius: 44rpx;
        box-sizing: border-box;
        border: 2rpx solid #c59a76;
      }
    }
  }
}
</style>
