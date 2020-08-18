<template>
	<view class="planShow">
		<!-- 用户信息 -->
		<view class="arc_top">
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
					<uni-list-item >
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
					<uni-list-item style="border:0;" v-if="start_time!=''">
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
						</view>
					</uni-list-item>
					<uni-list-item style="border:0;margin-bottom: 30rpx;">
						<view>
							<image :src="img_path" mode="" style="width: 640rpx;height:640rpx;"></image>
						</view>
					</uni-list-item>
				</uni-list>
			</view>			
		</view>
	</view>
</template>

<script>
import pakTool from "../../common/utils/utility.js";
export default {
  onLoad(option) {
    this.id = option.id;
    this.care_plan_id = option.care_plan_id;
    if (this.id || this.care_plan_id) {
      this.userImage = this.$store.state.form.head;
      this.userName = this.$store.state.form.name;
      this.userSex = this.$store.state.form.sex;
      this.userPhone = this.$store.state.form.phone;
      this.tagarr = this.$store.state.form.tagarr;
	  if(this.tagarr.length==0){
		  this.mar = true
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
  data() {
    return {
      id: "",
      care_plan_id: "",
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
	  time:'',
	  date:'',
	  mar:false,
	  start_time:''
    };
  },
  methods: {
	  // 获取详情
	  getdetail() {
	  	let requestPak = pakTool.createRequestPak();
	  		requestPak.requestBody = {
	  			id:this.id
	  		}
	  	pakTool.request(this,'/madyApp/getCareRecordDetail',requestPak).then(res=>{
			const {data,code}= res
			this.img_path = data.img_path
			this.remarks  = data.comment
			this.start_time = data.start_time
			console.log(data,'详情')
		})
		
	  },
	  //获取方案
	  getlist(){
	  		let requestPak = pakTool.createRequestPak();		
	  		requestPak.requestBody = {
	  			care_plan_id: this.care_plan_id
	  		}
	  	pakTool.request(this,'/madyApp/getCarePlanDetail',requestPak).then(res=>{
			const {data}= res 
			this.send = data
			this.symptom = data.maladys //症状
			this.acupoint_list = data.points //调
			this.parts_list = data.selectBuList //补
			this.product_list = data.products //产品
			// console.log(data,7777777)
		})
	  	
	  },
  }
};
</script>

<style lang="less" scoped>
.planShow {
  font-size: 32rpx;
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
        }

        .sex {
          margin: 0 30rpx;
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
      box-shadow:0px 2px 12px 6px rgba(133,133,133,0.1);
      margin-bottom: 20rpx;
      width: 100%;
      position: relative;

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
              margin: 10rpx 0;

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
