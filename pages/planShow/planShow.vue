<template>
  <view class="planShow">
    <!-- 重写微信顶部栏 -->
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
            方案详情
          </view>
        </view>
      </qb-header>
    </view>
    <!-- 用户信息 -->
    <view class="arc_top" :style="{ margin: ser_top + 'rpx 0 0 0;'}">
      <view class="cir" v-if="userImage!=''">
        <image :src="userImage"></image>
      </view>
      <view class="cir" v-if="userImage==''" style="font-weight:700;width:130rpx;height:130rpx;margin-bottom: 20rpx;border-radius: 50%;line-height: 130rpx;text-align: center; background-color: #F2F2F2;">
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
      <!-- 项目类型 -->
      <view class="box-style">
        <uni-list>
          <uni-list-item title="" note="">
            <view class="flex" style="border-bottom: 0;">
              <i></i>
              <view style="font-weight: 700;">项目类型</view>
              <view class="text">
                {{ projectType }}
              </view>
              <uni-icons type="arrowright" color="#858585"></uni-icons>
            </view>
          </uni-list-item>
        </uni-list>
      </view>
      <!-- 症状 -->
      <view class="box-style">
        <uni-list>
          <uni-list-item title="" note="">
            <view class="flex" style="margin-bottom: 10rpx;">
              <i></i>
              <view style="font-weight: 700;">症状</view>
              <view class="text">
              </view>
              <uni-icons type="arrowright" color="#858585"></uni-icons>
            </view>
          </uni-list-item>
          <view>
            <view class="symptom">
              <text v-for="item in symptom" :key='item' :style="item.name.length>10?'width:100%':''">
                {{ item.name }}
              </text>
            </view>
          </view>
        </uni-list>
      </view>
      <!-- 理疗流程 -->
      <view class="box-style">
        <uni-list>
          <uni-list-item title="" note="">
            <view class="flex">
              <i></i>
              <view style="font-weight: 700;">理疗流程</view>
              <view class="text">
              </view>
            </view>
          </uni-list-item>
          <uni-list-item>
            <view style="width:100%; padding-bottom:30rpx; border-bottom: 1rpx solid #eeeeee;">
              <view class="head">通</view>
              <text>以华佗夹脊穴为核心的经络疏通</text>
            </view>
          </uni-list-item>
          <uni-list-item>
            <view style="width:100%; padding-bottom:30rpx; border-bottom: 1rpx solid #eeeeee;">
              <view class="head">排</view>
              <text>推拿、按揉背部膀胱经、肩胛部及手少阳三焦经排出瘀堵的寒湿</text>
            </view>
          </uni-list-item>
          <uni-list-item v-if='acupoint_list.length!=0'>
            <view style="width:100%; padding-bottom:30rpx; border-bottom: 1rpx solid #eeeeee;">
              <view class="head" style="margin: 30rpx 0 20rpx 0;">调</view>
              <view class="choice">
                <view class="choice_radio" v-for="item in acupoint_list" :key='item'>
                  {{ item.acupoint_name }}
                </view>
              </view>
            </view>
          </uni-list-item>
          <uni-list-item v-if='parts_list.length!=0'>
            <view style="width:100%; padding-bottom:30rpx; border-bottom: 1rpx solid #eeeeee;">
              <view class="head">补</view>
              <uni-list title="" note="">
                <view style="color: #333333; font-size: 30rpx;margin-bottom: 8rpx;font-weight: 700;">贴敷部位</view>
              </uni-list>
              <view class="choice">
                <view class="choice_radio" v-for="item in parts_list" :key='item'>
                  {{ item.name }}
                </view>
              </view>
            </view>
          </uni-list-item>
          <uni-list-item>
            <view style="width:100%;">
              <view class="head" v-if="target.symptom.length != 0 ? true : false">养</view>
              <uni-list title="" note="" style="margin-bottom:30rpx 0;" v-if='product_list.length!=0'>
                <view style="color: #333333;font-weight: 700;font-size: 30rpx;">调理产品</view>
              </uni-list>
              <view style="width:100%;" v-if='product_list.length!=0'>
                <view class="choice">
                  <view class="choice_radio" v-for="item in product_list" :key='item' style="padding: 10rpx 0;">
                    {{ item.name }}
                  </view>
                </view>
              </view>
            </view>
          </uni-list-item>
          <uni-list-item style="border:0;">
            <uni-list style="width:100%;">
              <uni-list title="" note="">
                <view style="color: #333333;font-weight: 700;font-size: 30rpx;">理疗建议</view>
              </uni-list>
              <view class="quil">
                <textarea maxlength=200 @input="inp_remarks" v-model="remarks" placeholder="请输入其他症状~" disabled />
                </view>
						</uni-list>
					</uni-list-item>
					<uni-list-item style="border:0;" v-if="start_time!=null">
						<uni-list style="width:100%;">
							<uni-list title="" note="">
								<view style="color: #333333;font-weight: 700;margin-bottom: 20rpx;font-size: 30rpx;">开始时间</view>
							</uni-list>
							<view class="" style="margin-bottom: 30rpx;">
									{{start_time}}
							</view>
						</uni-list>
					</uni-list-item>
				</uni-list>
			</view>
			<!-- 照片 -->
			<view class="box-style">
				<uni-list>
					<uni-list-item title="" note="">
						<view class="flex" style="border-bottom:0;">
							<i></i>
							<view style="font-weight: 700;">上传照片</view>
							<view class="editImg" @click.stop="edit">
								 重新上传
							</view>
						</view>
					</uni-list-item>
					<uni-list-item style="border:0;margin-bottom: 30rpx;">
						<view>
							<image :src="img_path"  mode='' style="width: 640rpx;height:640rpx;" v-if="pho_img"></image>
							<view style="width: 640rpx;height: 640rpx;display: inline-block;position: relative;" v-if="cir_img">
								<image src="../../static/images/load.gif" mode="" style="width: 120rpx;height: 120rpx;position: absolute;left: 50%;top: 50%;transform: translate(-50%,-50%);" ></image>
							</view>
							
						</view>
					</uni-list-item>
				</uni-list>
			</view>			
		</view>
	</view>
</template>

<script>
import pakTool from "../../common/utils/utility.js";
import qbHeader from "@/components/header.vue";
export default {
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
    this.id = option.id;
    this.member_id = option.add;
    this.care_plan_id = option.care_plan_id;
    if (this.id || this.care_plan_id) {
      this.userImage = this.$store.state.form.head;
      this.userName = this.$store.state.form.name;
      this.userSex = this.$store.state.form.sex;
      this.userPhone = this.$store.state.form.phone;
      this.tagarr = this.$store.state.form.tagarr;
      if (this.tagarr.length == 0) {
        this.mar = true;
      }
      // 获取时间
      // const time = uni.getStorageSync('plan_time')
      // for(let i =0;i< time.length;i++){
      // 	if(time[i].id==this.care_plan_id){
      // 		 this.time = time[i].time
      // 		 this.date = time[i].date
      // 	}
      // }
      this.getdetail();
      this.getlist();
    }
  },
  components: {
    qbHeader,
  },
  data() {
    return {
      id: "",
      care_plan_id: "",
      member_id: "",
      userImage: "",
      userName: "",
      userSex: "",
      userPhone: "",
      projectType: "元化灸",
      img_path: "",
      tagarr: [],
      // 产品
      product_list: [],
      // 穴位
      acupoint_list: [],
      // 部位
      parts_list: [],
      // 症状
      symptom: [],
      // 备注文字
      remarks: "",
      // 开始时间
      time: "",
      date: "",
      mar: false,
      start_time: "",
      sty: {
        background: "rgb(248, 248, 248)",
        fontColor: "",
        iconColor: "",
        iconText: "", //导航栏文字
      },
      ser_top: 0,
      exc_key: 0,
      record_no: "",
      record_time: "",
      already: false,
      pho_img: true,
      cir_img: false,
    };
  },
  methods: {
    // 获取详情
    getdetail() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        id: this.id,
      };
      pakTool
        .request(this, "/madyApp/getCareRecordDetail", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":{"id":"6f6ae151-f9f5-455f-aa9c-4bf124589d90","care_plan_id":"c32a7e3a-e9c3-4b33-b36b-73d0b88a173a","member_id":"b0e964f2-384d-4dc8-91fd-3b45bb7b60de","comment":"46","img_path":"http://xiaode.oos-cn.ctyunapi.cn/20200727/png/yhd/upload/202007271509124277602.png","record_time":"2020-07-27 15:09:15.0","create_user":null,"create_time":"2020-07-27 15:09:15.0","edit_user":null,"edit_time":null,"exc_key":"0","dr":"0","record_no":"000001","start_time":"2020-07-27 15:09:00"}}
          const { data, code } = res;
          this.img_path = data.img_path;
          this.remarks = data.comment;
          this.start_time = data.start_time;
          this.exc_key = data.exc_key;
          this.record_no = data.record_no;
          this.record_time = data.record_time;
          console.log(data, "详情");
        });
    },
    //获取方案
    getlist() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        care_plan_id: this.care_plan_id,
      };
      pakTool
        .request(this, "/madyApp/getCarePlanDetail", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":{"selectBuList":[{"name":"左脚","id":"1028bbdb-555b-4b34-89e3-2fb266ad693e"},{"name":"中焦","id":"929398b9-ee66-42e3-af89-f0eb3021bae6"},{"name":"下焦","id":"b046f196-f31d-4993-a38c-771485b62b85"},{"name":"左臂","id":"f2648e05-1043-4a79-9003-7c88dab29b0a"}],"memberCarePlan":{"id":"c32a7e3a-e9c3-4b33-b36b-73d0b88a173a","care_project_id":"8dcc7d25-a0a7-11ea-a951-506b4bc21cca","care_project_name":"元化灸","member_id":"b0e964f2-384d-4dc8-91fd-3b45bb7b60de","plan_times":"4","execute_times":null,"plan_amount":null,"status":null,"finish_time":null,"t_content":"以华佗夹脊穴为核心的经络疏通","p_content":"推拿、按揉背部膀胱经、肩胛部及手少阳三焦经 排出瘀堵的寒湿","b_content":"1028bbdb-555b-4b34-89e3-2fb266ad693e,929398b9-ee66-42e3-af89-f0eb3021bae6,b046f196-f31d-4993-a38c-771485b62b85,f2648e05-1043-4a79-9003-7c88dab29b0a","y_content":"","create_user":null,"create_time":"2020-07-27 14:54:17.0","edit_user":null,"edit_time":null,"exc_key":"0","dr":"0","care_num":"000002"},"maladys":[{"create_time":"2020-07-27T06:54:17.000+0000","name":"过敏性鼻炎","id":"65dca4c0-d643-4ec3-9dd5-b4fee231660a"}],"isNew":false,"points":[{"create_time":"2020-06-22T03:23:30.000+0000","acupoint_name":"足三里","id":"d9ef71d4-af7b-4ff5-a10b-8f8bbaa8639d"},{"create_time":"2020-06-22T03:19:52.000+0000","acupoint_name":"印堂","id":"0daf0c46-9f31-405d-a92b-c285133df49c"}],"products":[]}}
          const { data } = res;
          this.send = data;
          this.symptom = data.maladys; //症状
          this.acupoint_list = data.points; //调
          this.parts_list = data.selectBuList; //补
          this.product_list = data.products; //产品
          // console.log(data,7777777)
        });
    },
    // 重新上传照片
    // 上传图片
    edit() {
      var that = this;
      uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (chooseImageRes) => {
          that.cir_img = true;
          that.pho_img = false;
          that.img_path = "";
          const tempFilePaths = chooseImageRes.tempFilePaths;
          const uploadTask = uni.uploadFile({
            url: that.config.contextPath + "/common/uploadFile",
            filePath: tempFilePaths[0],
            name: "file",
            success: (uploadFileRes) => {
              let temp = JSON.parse(uploadFileRes.data);
              that.img_path = temp.data.fileURL;
              console.log(that.img_path);
              that.editImg();
            },
            fail: () => {
              uni.showToast({
                title: "图片上传失败",
                icon: "none",
              });
              if (that.img_path) {
                return;
              } else {
                that.uploadImg = false;
              }
            },
          });
          uploadTask.onProgressUpdate(function (res) {
            console.log(res);
            if (res.progress == 100) {
              // this.$forceUpdate()
              that.cir_img = false;
              that.pho_img = true;
              // uni.showToast({
              // title:'图片上传成功',
              // icon:'success'
              // })
            }
          });
        },
      });
    },
    // 编辑接口
    editImg() {
      if (this.img_path == "") {
        uni.showToast({
          title: "请上传图片",
          icon: "none",
        });
        return;
      }
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        exc_key: this.exc_key,
        care_plan_id: this.care_plan_id,
        member_id: this.member_id,
        id: this.id,
        care_plan_id: this.care_plan_id,
        img_path: this.img_path,
        comment: this.remarks,
        start_time: this.start_time,
        record_no: this.record_no,
        record_time: this.record_time,
      };
      pakTool.request(this, "mady/saveCareRecord", requestPak).then((res) => {
        if (res.code == 200) {
          var pages = getCurrentPages();
          var currPage = pages[pages.length - 1]; //当前页面
          var prevPage = pages[pages.length - 2]; //上一个页面
          // #ifdef H5
          prevPage.fixImg = true;
          // #endif
          // #ifndef H5
          prevPage.$vm.fixImg = true;
          // #endif
          uni.showToast({
            title: "图片修改成功",
          });
        }
      });
    },
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
  },
};
</script>

<style lang="less" scoped>
.qh {
  position: fixed;
  // position: -webkit-sticky;
  top: 0rpx;
  z-index: 101;
  width: 100%;
}
.planShow {
  font-size: 30rpx;
  min-height: 100%;
  // 用户信息
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
      font-size: 36rpx;
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

  // 信息
  .body-info {
    display: flex;
    flex-wrap: wrap;
    padding: 50rpx 30rpx 10rpx 30rpx;
    background: #fff;
    .box-style {
      border-radius: 10rpx;
      box-shadow: 0px 2px 12px 6px rgba(133, 133, 133, 0.1);
      margin-bottom: 20rpx;
      width: 100%;
      position: relative;
      .editImg {
        position: absolute;
        top: 50%;
        right: 30rpx;
        width: 180rpx;
        height: 40rpx;
        border-radius: 40rpx;
        line-height: 40rpx;
        text-align: center;
        transform: translate(0, -50%);
        color: #c59a76;
        border: 2rpx solid #c59a76;
        font-size: 28rpx;
      }

      uni-list {
        uni-list-item {
          display: flex;
          align-items: flex-start;
          position: relative;
          padding: 0 30rpx;

          .flex {
            height: 104rpx;
            line-height: 104rpx;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
            border-bottom: 1rpx solid #eeeeee;

            i {
              width: 6rpx;
              height: 35rpx;
              background: #c59a76;
              border-radius: 0 4rpx 4rpx 0;
              position: absolute;
              left: 0;
            }

            .required {
              color: #ff3b30;
            }

            .text {
              width: 50%;
              margin-left: 60rpx;
            }

            uni-icons {
              position: absolute;
              right: 30rpx;
            }
          }

          .head {
            background: #c59a76;
            width: 100rpx;
            height: 44rpx;
            line-height: 44rpx;
            text-align: center;
            border-radius: 22rpx;
            color: #fff;
            margin: 30rpx 0;
          }

          .choice {
            display: flex;
            flex-wrap: wrap;
            width: 100%;

            .choice_radio {
              flex-basis: 50%;
              margin: 15rpx 0;

              image {
                width: 36rpx;
                height: 36rpx;
                vertical-align: middle;
                margin-right: 20rpx;
              }
            }
          }

          // 理疗建议
          .quil {
            height: 300rpx;
            width: 100%;
            background: #f7f7f7;
            box-sizing: border-box;
            padding: 30rpx;
            position: relative;
            border-radius: 10rpx;
            margin: 20rpx 0 30rpx 0;

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

        // 详细病症
        .symptom {
          display: flex;
          flex-wrap: wrap;
          padding: 0 30rpx 10rpx 30rpx;
          text {
            box-sizing: border-box;
            padding: 15rpx 0;
            width: 50%;
          }
        }

        button {
          background: #fff;
          color: #c59a76;
          font-size: 30rpx;
        }
      }
    }
  }

  // 保存按钮
  .save {
    width: 100%;
    background: #c59a76;
    color: #fff;
    border-radius: 42rpx;
    margin: 20rpx;
  }
}
</style>
