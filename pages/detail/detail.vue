<template>
	<view class="main">
		<view class="top_pic" :style="isAdmin=='Y'?'height:485rpx':''">
			<view class="fix" @click="fix">
				点击修改
			</view>
			<view>
				<image :src="userImg" v-if="userImg!=''" mode="" class="head_pic"></image>
				<view v-if="userImg==''" style="font-weight:700;width:130rpx;height:130rpx;margin-bottom: 20rpx;border-radius: 50%;line-height: 130rpx;text-align: center;background-color: #F2F2F2; font-size:36rpx;">
					{{userName.substr(0,1)}}
				</view>
			</view>
			<view class="name">
				{{ userName }}
			</view>
			<view class="phone">
				{{ userPhone }}
			</view>
			<view class="tag" v-if="tagarr.length!=0">
				<view class="tag_sel">
					<view class="tag_one"  v-if="tagarr[0].name!=null&&tagarr[0]">
						{{tagarr[0].name}}
					</view>
					<view class="tag_two"  v-if="tagarr[1].name!=null&&tagarr[1]">
						{{tagarr[1].name}}
					</view>
					<view class="tag_three"  v-if="tagarr[2].name!=null&&tagarr[2]">
						{{tagarr[2].name}}
					</view>
				</view>
			</view>
			<view class="font_one" v-if="isAdmin=='Y'" style="margin-bottom: 10rpx;">
				健康专员:{{ userShi }}
			</view>
			<view class="font_one" style="font-size: 30rpx;">
				剩余{{amount}}次
			</view>
		</view>
		<view class="tip">
			<view class="tip_one">
				<navigator :url="'/pages/collection/collection?add='+id+'&detail=1'">
					<image src="https://jk.laohaowaner.com/yhdresource/upload/imgs/mine_cj.png" mode="" class="tip_pic"></image>
					<view class="font">
						健康采集
					</view>
				</navigator>
			</view>
			<view class="tip_one">
				<navigator :url="'/pages/condition/condition?add='+id">
					<image src="https://jk.laohaowaner.com/yhdresource/upload/imgs/mine_tl.png" mode="" class="tip_pic"></image>
					<view class="font">
						健康调理
					</view>
				</navigator>
			</view>
			<view class="tip_one">
				<navigator :url="'/pages/archives/archives?add='+id">
					<image src="https://jk.laohaowaner.com/yhdresource/upload/imgs/mine_da.png" mode="" class="tip_pic"></image>
					<view class="font">
						健康档案
					</view>
				</navigator>
			</view>
			<view class="tip_one">
				<navigator :url="'/pages/plan/plan?add='+id">
					<image src="https://jk.laohaowaner.com/yhdresource/upload/imgs/mine_fa.png" mode="" class="tip_pic"></image>
					<view class="font">
						方案管理
					</view>
				</navigator>
			</view>
			<view class="tip_one">
				<navigator :url="'/pages/spend/spend?add='+id">
					<image src="https://jk.laohaowaner.com/yhdresource/upload/imgs/mine_xf.png" mode="" class="tip_pic"></image>
					<view class="font">
						消费记录
					</view>
				</navigator>
			</view>
			<view class="tip_one" v-if="isAdmin=='Y'">
				<navigator :url="'/pages/recharge/recharge?add='+id+'&times='+amount">
					<image src="https://jk.laohaowaner.com/yhdresource/upload/imgs/mine_cz.png" mode="" class="tip_pic"></image>
					<view class="font">
						充值
					</view>
				</navigator>
			</view>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="pop">
				<image src="../../static/images/perfect.png" mode=""></image>
				<view class="con_txt">
					剩余还有{{amount}}次
				</view>
				<view class="btm" >
					<view class="yes" @click.stop="jump">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	// 调取接口
	import pakTool from "@/common/utils/utility.js";
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		data() {
			return {
				isAdmin: "", //判断是否是店长
				userImg: "",
				userName: "姓名",
				userPhone: "手机号",
				userShi: "健康专员",
				tagarr: [],
				id: "", // 用户id
				userSex:'',//性别
				userDate:'',//生日
				userCard:'',//身份证
				userAddress:'',//地址
				userMail:'',//邮箱
				amount:0,
				manage:0
			};
		},
		components:{
			uniPopup
		},
		onLoad(option) {
			// 将登客户信息缓存
			this.isAdmin = uni.getStorageSync('isAdmin')
			// this.isAdmin = 'Y'
			// 用户id
			this.id = option.add;
			this.manage = option.manage
		},
		onShow() {
			// this.tagarr = []
			// this.tagarr.length = 0						
			// this.$forceUpdate()
			this.getUser()
		},
		methods: {
			//修改资料
			fix() {
				uni.navigateTo({
					url: "/pages/add/fix?id=" + this.id
				});
			},
			jump(){
				this.$refs.popup.close()
			},
			// 获取用户数据
			getUser() {
				let requestPak = pakTool.createRequestPak();
				requestPak.requestBody = {
					member_id: this.id, // 客户id
					admin_user_id: uni.getStorageSync('admin_user_id') // 登录员工id
				};
				pakTool.request(this,"/madyApp/getCustomerCenter",requestPak).then(res=>{
						const data = res.data
						console.log(data,'data')
						this.userImg = data.memberInfo.icon;
						this.userName = data.memberInfo.real_name;
						this.userPhone = data.memberInfo.phone;
						this.userSex = data.memberInfo.gender;
						this.userDate = data.memberInfo.birthday;
						this.userMail = data.memberInfo.email;
						this.userCard = data.memberInfo.id_card;
						this.userAddress = data.memberInfo.address
						this.amount = Number(data.memberInfo.surplus_times) //剩余次数
						if(this.amount<=3&&this.manage==1){
							this.$refs.popup.open()
							this.manage = 0
						}
						this.tagarr = []
						data.targs.map(item=>{
							this.tagarr.push({name:item})
						}); //更改tag数据格式
						this.userShi = data.doctor;
						console.log(this.tagarr,'tagarr')
						this.form = {name:this.userName,head:this.userImg,sex:this.userSex,phone:this.userPhone,tagarr:this.tagarr,date:this.userDate,mail:this.userMail,address:this.userAddress,card:this.userCard}
						this.$store.commit('savecustomer',this.form)
					console.log(this.tagarr)
				});
				// card:this.card,mail:this.mail,address:this.address,describe:this.descirbe,date:this.date,remnant:this.remnant,tagarr:this.tagarr
			}
		}
	};
</script>

<style lang="less" scoped>
	.main {
		width: 100%;
		height: 100%;
		background-color: #fff;
		font-size: 32rpx;

		.top_pic {
			width: 100%;
			padding: 42rpx 0 42rpx 0;
			// border-radius: 0 0 160rpx 160rpx;
			background: url(data:image/png;base64,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);
			background-size: 100% 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 72rpx;
			box-sizing: border-box;
			height: 437rpx;
			.fix {
				position: absolute;
				top: 42rpx;
				right: 42rpx;
				padding: 5rpx 27rpx;
				border-radius: 30rpx;
				border: 2rpx solid #84571a;
				color: #84571a;
			}

			.font_one {
				font-size: 30rpx;
				color: #84571a;
			}

			.head_pic {
				width: 130rpx;
				height: 130rpx;
				margin-bottom: 20rpx;
				border-radius: 50%;
				font-size: 30rpx;
			}

			.name {
				font-size: 100%;
				color: #84571a;
				margin-bottom: 10rpx;
				font-weight: bold;
				font-size: 34rpx;
			}

			.phone {
				color: #84571a;
				margin-bottom: 10rpx;
				font-size: 30rpx;
			}

			.tag {
				font-size: 28rpx;
				.tag_sel {
					width: 100%;
					padding: 0 0 20rpx 0;
					display: flex;
					justify-content: space-between;

					view {
						padding: 2rpx 14rpx;
						//width: 218rpx;
						height: 40rpx;
						border-radius: 5px;
						color: #ffffff;
						text-align: center;
						line-height: 40rpx;
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

		.tip {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			padding: 0 60rpx;

			.tip_one {
				flex: 0 0 45%;
				height: 160rpx;
				background-color: #ffffff;
				margin-bottom: 30rpx;
				border-radius: 20rpx;
				box-shadow:0px 2px 12px 6px rgba(133,133,133,0.1);
				overflow: hidden;

				navigator {
					width: 100%;
					height: 100%;
					overflow: hidden;

					.font {
						font-size: 32rpx;
						text-align: center;
					}

					image {
						width: 64rpx;
						height: 64rpx;
						display: block;
						margin: 0 auto;
						margin-top: 20rpx;
						margin-bottom: 9rpx;
					}
				}
			}
		}
		//弹窗
		.pop  {
			width: 605rpx;
			height: 580rpx;
			background-color: #FFFFFF;
			position: relative;
			border-radius: 20rpx;
			// display: table;
			image {
				width: 206rpx;
				height: 206rpx;
				border-radius: 50%;
				position: absolute;
				top: 0;
				left: 50%;
				transform: translate(-50%,-10%);
			}
			.con_txt{
				font-size: 36rpx;
				color: #C59A76;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
			}
			.yes{
				position: absolute;
				padding: 18rpx 60rpx;
				bottom: 15%;
				left: 50%;
				transform: translate(-50%,0);
				background-color: #c59a76;
				color: white;
				border-radius: 44rpx;
			}
		}
	}
</style>
