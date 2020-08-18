<template>
	<view class="plan">
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
		<!-- 充值 -->
		<view class="rechar">
			<view class="re-box">
				<view class="box-title">
					<view style="line-height: 112rpx;float: left;margin-left: 30rpx;color: #84571A;font-weight: 700;">
						我的充值卡
					</view>
					<view style="line-height: 112rpx;float: right;margin-right: 30rpx;">
						剩余次数<text style="margin-left: 20rpx;font-weight: 700;">{{times}}</text>次
					</view>
				</view>
				<view class="box-main">
					<view style="color: #696969;margin-bottom: 30rpx;">
						本次充值
					</view>
					<view class="clearfix" style="margin-bottom: 30rpx;">
						<view class="main-rechar">
							充值金额
						</view>
						<input type="digit" value="" class="uni-input" v-model="money"  :placeholder="place==true?'':'请输入金额'"/>
					</view>
					<view class="clearfix" style="margin-bottom: 10rpx;">
						<view class="main-rechar">
							充值次数
						</view>
						<input type="digit" value="" class="uni-input" v-model="num"  :placeholder="place==true?'':'请输入次数'"/>
					</view>
				</view>
			</view>
		</view>
		<button type="primary" @click="save" class="save">立即充值</button>
		<uni-popup ref="popup" type="center">
			<view class="pop clearfix">
				<image src="../../static/images/recharge.png" mode=""></image>
				<view class="sus_txt">
					充值
				</view>
				<view class="con_txt">
					是否充值金额{{money}}元 充值次数{{num}}次?
				</view>
				<view class="btm" >
					<button class="yes" @click.stop="jump" hover-class='none'>
						充值
					</button>
					<button class="no" @click.stop="close" hover-class='none'>
						不充值
					</button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="pay" type="center">
			<view class="pay clearfix">
				<image src="../../static/images/succe.png" mode="" class="img_one"></image>
				<view class="sus_txt">
					充值成功
				</view>
				<image src="../../static/images/guanbi.png" mode="" class="img_two" @click="sue"></image>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import pakTool from "../../common/utils/utility.js";
	export default {
		components:{
			uniPopup
		},
		onLoad(option) {
			this.add = option.add
			this.times = option.times
			this.userImage = this.$store.state.form.head
			this.userName = this.$store.state.form.name
			this.userSex = this.$store.state.form.sex
			this.userPhone = this.$store.state.form.phone
			this.tagarr = this.$store.state.form.tagarr
			if(this.tagarr.length==0){
				this.mar = true
			}
		},
		data() {
			return {
				add: '',
				userImage: "",
				userName: "",
				userSex: "",
				userPhone: "",
				tagarr: [],
				money:'',
				num:'',
				place:false,
				amount:12,
				disabled:false,
				times:0,
				mar:false
			};
		},
		methods: {
		// 唤起弹窗
		save(){
			if(this.money==''){
				uni.showToast({
					title:'请输入充值金额',
					icon:'none'
				})
				return
			}
			if(this.num==''){
				uni.showToast({
					title:'请输入充值次数',
					icon:'none'
				})
				return
			}
			this.$refs.popup.open();
		},
		// 不充值弹窗
		close(){
			this.$refs.popup.close()
		},
		// 充值弹窗
		jump(){
			if(this.disabled){
				return
			}
			this.disabled = true
			let requestPak = pakTool.createRequestPak();
			requestPak.requestBody = {
				amount:this.money,
				employee_id:uni.getStorageSync("admin_user_id"),
				mady_times:this.num,
				member_id:this.add
			};
			pakTool.request(this, "/madyApp/saveMemberDeposit", requestPak).then(res => {
				// console.log(res)
			  const { code } = res;
			  if (code == 200) {
			   this.$refs.popup.close()
			   this.$refs.pay.open()
			    }else{
					uni.showToast({
						title:'充值失败',
						icon:'none'
					})
					this.disabled = false
				}
			})
			
		},
		sue(){
			this.$refs.pay.close()
			uni.navigateBack(
				{delta: 1}
			)
		}
		}
	};
</script>

<style lang="less" scoped>
	.plan {
		min-height: 100%;
		background-color: #fff;
		font-size: 30rpx;

		// 用户信息
		.arc_top {
			height: 200rpx;
			background: linear-gradient(#FFFFFF, #F3F3F3);
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
            background-color: #C59A76;
           margin-right: 13rpx;
					}

					.mid {
            background-color: #F9A94C;
           margin-right: 13rpx;
					}

					.las {
            background-color: #EB7054;
           margin-right: 13rpx;
					}
				}
			}
		}
		// 充值
		.rechar{
				
			padding: 40rpx 30rpx;
			.re-box{
				box-shadow:0px 2px 12px 6px rgba(133,133,133,0.1);
				border-radius: 30rpx;
				.box-title{
					height: 112rpx;
					width: 100%;
					background-image: linear-gradient(#FDF1C5,#F1D183);
					border-radius: 30rpx 30rpx 0 0;
				}
				.box-main{
					padding: 40rpx 30rpx;
					.main-rechar{
						width: 30%;
						float: left;
						display: table;
						height: 70rpx;
						line-height: 70rpx;
						font-weight: 700;
					}
					.uni-input{
						float: right;
						width: 65%;
						height: 70rpx;
						border: 2rpx solid #D6D6D6;
						border-radius: 10rpx;
						padding: 0 40rpx;
						box-sizing: border-box;
					}
				}
			}
		}
		.save {
		  width: 90%;
		  height: 80rpx;
		  line-height: 80rpx;
		  border-radius: 40rpx;
		  background-color: #c59a76;
		 position: absolute;
		 bottom: 10%;
		 left: 50%;
		 transform: translate(-50%,-50%);
		 border:none;
		}
		//弹窗
		.pay {
			width: 605rpx;
			height: 580rpx;
			background-color: #ffffff;
			position: relative;
			border-radius: 20rpx;
			font-size: 34rpx;
			.img_one {
			  width: 206rpx;
			  height: 206rpx;
			  border-radius: 50%;
			  position: absolute;
			  top: 35%;
			  left: 50%;
			  transform: translate(-50%, -50%);
			}
			.img_two {
				width: 69rpx;
				height: 69rpx;
				border-radius: 50%;
				position: absolute;
				bottom: -30%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
			.sus_txt {
			  font-size: 36rpx;
			  color: #c59a76;
			  position: absolute;
			  top: 70%;
			  left: 50%;
			  transform: translate(-50%, -50%);
			  font-weight: 700;
			}
		}
		//弹窗
		.pop {
		  width: 605rpx;
		  height: 580rpx;
		  background-color: #ffffff;
		  position: relative;
		  border-radius: 20rpx;
		  display: table;
		  font-size: 34rpx;
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
		    font-size: 34rpx;
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
		      // padding: 18rpx 60rpx;
			  line-height: 82rpx;
			  height: 82rpx;
			  width: 237rpx;
			  text-align: center;
			  font-size: 34rpx;
		      display: inline-block;
		      background-color: #c59a76;
		      color: white;
		      border-radius: 44rpx;
		    }
		    .no {
		      // padding: 18rpx 60rpx;
			  line-height: 82rpx;
			  height: 82rpx;
			  width: 237rpx;
			  text-align: center;
			  font-size: 34rpx;
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
	.clearfix:before,
	.clearfix:after {
		display: block;
		height: 0;
	   line-height: 0;
	   content: "";
	   clear: both;
	}
</style>
