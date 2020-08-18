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
			  						<view class="date">{{date==null?'':date}} <image src="../../static/images/cher.png" mode="" class="point"></image></view> 
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
					<view class="bir" v-if="isAdmin=='Y'">
						<view class="thread">		  
							<view class="title">	  
								健康专员
							</view>
							<view class="select_date">
								<picker :value="doc"  @change="seldoc" :range="doc_list" :range-key="'name'">
								<view class="date">{{doc_name}} <image src="../../static/images/cher.png" mode="" class="point"></image></view> 
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
export default {
  components: {},
  onLoad(option) {
    this.id = option.id;
    this.isAdmin = uni.getStorageSync("isAdmin");
    // this.isAdmin = 'Y'
    if (this.isAdmin == "Y") {
      this.getdoc();
	  return
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
	  lunar:'',//农历生日
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
      id: "",
      exc_key: "",
      send_tag: [],
      no_change: false,
      isAdmin: false, //是不是店长
      doc_name: "",
      employeeId: "", //健康专员
      doc_code: "",
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
      this.doc_code = this.doc_list[this.doc].value;
      this.doc_name = this.doc_list[this.doc].name;
    },
    getDate(type) {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (type === "start") {
        year = year - 120;
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
        sizeType: ["compressed"],
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
        url: "/pages/customertag/customertag?fix=" + JSON.stringify(this.tagarr)
      });
    },

    // 获取用户数据
    getUser() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        member_id: this.id, // 客户id
        admin_user_id: uni.getStorageSync("admin_user_id") // 登录员工id
      };
      pakTool
        .request(this, "/madyApp/getCustomerCenter", requestPak)
        .then(res => {
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
          // this.doc_list.indexOf()
          this.doc_list.map(item => {
            if (item.name == doct) {
              this.doc = this.doc_list.indexOf(item);
              this.doc_name = this.doc_list[this.doc].name;
              this.doc_code = this.doc_list[this.doc].value;
            }
          });
          console.log(this.doc);
          this.tagarr_fix = data.memberInfo.member_tag;
          this.date = data.memberInfo.birthday;
		  this.lunar = data.memberInfo.lunar;
          data.targs.map(item => {
            this.tagarr.push({ name: item });
          });
        });
    },
    // 获取所有健康专员
    getdoc() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        admin_user_id: uni.getStorageSync("admin_user_id")
      };
      pakTool.request(this, "/madyApp/getAllEmployee", requestPak).then(res => {
        const { data,code } = res;
        // 添加健康专员
        data.map((item, index) => {
          this.doc_list.push({ name: item.username, value: item.id });
        });
		if(code==200){
			this.getUser()
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
      // if(this.doc_code==''){
      // 	this.doc_code = this.$store.state.admin_user_id
      // }
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
		lunar:this.lunar,
        member_tag: this.send_tag,
        comment: this.descirbe,
        employeeId: uni.getStorageSync("admin_user_id"),
        from_employee: this.doc_code
      };
      pakTool.request(this, "/madyApp/saveMember", requestPak).then(res => {
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
            }
          });
        } else {
          uni.showToast({
            title: "保存失败"
          });
        }
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
  }
  //表单中部
  .add_mid {
    margin-top: 20rpx;

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
