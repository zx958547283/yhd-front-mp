<template>
	<view class="mine">
		<!-- 顶部信息栏 -->
		<view class="header" @click="mrevise">
			<image :src="head" mode="" class="pic01"></image>
			<view class="pic02">
				<view class="userName">{{ userName }}</view>
				<view class="userPhone">{{userPhone}}</view>
			</view>
		</view>
		<!-- 页面功能区 -->
		<view class="page">
			<view class="myPerson page01" @click="mycus">
				<image src="https://jk.laohaowaner.com/yhdresource/upload/imgs/mine_customer.png" mode="" class="pic04"></image>
				<view class="font01">我的客户</view>
				<view class="jiantou"></view>
			</view>
			<view class="myPerson" @click="myPerson" v-if="isAdmin=='Y'">
				<image src="https://jk.laohaowaner.com/yhdresource/upload/imgs/mine_employee.png" mode="" class="pic04"></image>
				<view class="font01">我的店员</view>
				<view class="jiantou"></view>
			</view>
			<view class="myPerson page03" @click="logout">
				<image src="https://jk.laohaowaner.com/yhdresource/upload/imgs/mine_logout.png" mode="" class="pic04"></image>
				<view class="font01">退出登录</view>
				<view class="jiantou"></view>
			</view>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="pop">
				<view class="sus_txt">
					退出
				</view>
				<view class="con_txt">
					确定要退出登陆吗?
				</view>
				<view class="btm">
					<view class="yes" @click.stop="jump">
						确定
					</view>
					<view class="no" @click.stop="close">
						取消
					</view>
				</view>
			</view>
		</uni-popup>
		<qb-footer :choose="1"></qb-footer>
	</view>
</template>

<script>
	import qbFooter from "@/components/qb-footer.vue"
	import {
		mapState
	} from 'vuex';
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import pakTool from '@/common/utils/utility.js'
	export default {
		data() {
			return {
				isAdmin: "", //判断是否是店长
				userName: "",
				userPhone: '',
				head: '',
				erweima: ''
			}
		},
		components: {
			uniPopup,
			qbFooter
		},
		computed: { ...mapState(["avatar_url", "user_name", "level_type"])
		},
		onLoad(options) {
			this.isAdmin = uni.getStorageSync('isAdmin')
			this.tableData = uni.getStorageSync('user')
			this.userPhone = uni.getStorageSync('phone')
			console.log(this.tableData)
			this.userName = this.tableData.nickname
			this.head = this.tableData.icon
		},
		onReady() {},
		methods: {
			// 我的店员		
			myPerson() {
				uni.navigateTo({
					url: "/pages/mine/myPerson"
				})
			},
			mrevise() {
				uni.navigateTo({
					url: "/pages/mine/mrevise"
				})
			},
			//跳转我的客户
			mycus() {
				uni.navigateTo({
					url: '/pages/manage/manage?index=1'
				})
			},
			//注销
			logout() {
				this.$refs.popup.open()
			},
			//取消返回当前页面
			close() {
				this.$refs.popup.close()
			},
			//确定退出登录回到登陆页面
			jump() {
				// 清除缓存
				uni.clearStorageSync();
				uni.reLaunch({
					url: "/pages/empower/empower"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mine {
		min-height: 100%;
		background-color: #F7F7F7;

		// 顶部信息栏 
		.header {
			// width: 100%;
			height: 320rpx;
			box-sizing: border-box;
			background-image: url(../../static/mine/bgc.png);
			padding: 45rpx 30rpx;
			display: flex;
			align-items: center;
			position: relative;

			.pic01 {
				width: 130rpx;
				height: 130rpx;
				background-color: #FFFFFF;
				border-radius: 50%;
				margin-right: 20rpx;
			}

			.pic02 {
				// width: 45%;
				height: 130rpx;
				position: relative;
				top: 15rpx;

				.userName {
					font-size: 34rpx;
					color: #84571A;
					font-weight: bold;
					padding-bottom: 10rpx;
					letter-spacing: 0.72rpx;
					margin: 0 20rpx;
				}

				.userPhone {
					font-size: 32rpx;
					color: #84571A;
					padding-bottom: 10rpx;
					margin: 0 20rpx;
				}
			}

			.pic03 {
				width: 130rpx;
				height: 130rpx;
				background-color: #FFFFFF;
			}
		}

		//页面功能区
		.page {
			margin: 72rpx 30rpx 0;
			border-radius: 30rpx;
			background-color: #FFFFFF;
			box-shadow: 0px 2px 12px 6px rgba(133, 133, 133, 0.1);
			box-sizing: border-box;

			>view:nth-child(3) {
				border-bottom: 0;
			}

			.myPerson {
				width: 100%;
				height: 110rpx;
				background-color: #FFFFFF;
				padding: 0 34rpx 0 30rpx;
				border-bottom: 2rpx solid #EEEEEE;
				box-sizing: border-box;

				.font01 {
					font-size: 32rpx;
					font-weight: bold;
					line-height: 110rpx;
					color: #333333;
					float: left;
				}

				.pic04 {
					width: 40rpx;
					height: 44rpx;
					float: left;
					position: relative;
					top: 34rpx;
					padding-right: 20rpx;
				}

				.jiantou {
					float: right;
					position: relative;
					top: 40rpx;
				}
			}

			.page01 {
				border-radius: 30rpx 30rpx 0 0;
			}

			.page03 {
				border-radius: 0 0 30rpx 30rpx;
			}
		}

		.jiantou {
			width: 20rpx;
			height: 20rpx;
			border-top: 4rpx solid #CCCCCC;
			border-right: 4rpx solid #CCCCCC;
			transform: rotate(45deg);
		}

		//弹窗
		.pop {
			width: 605rpx;
			height: 463rpx;
			background-color: white;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			border-radius: 20rpx;

			.sus_txt {
				font-size: 36rpx;
				color: #C59A76;
				margin-bottom: 70rpx;
			}

			.con_txt {
				margin-bottom: 90rpx;
			}

			.btm {
				.yes {
					width: 237rpx;
					height: 82rpx;
					line-height: 82rpx;
					text-align: center;
					background-color: #C59A76;
					color: #FFFFFF;
					border-radius: 44rpx;
					float: left;
					margin-right: 25rpx;
				}

				.no {
					width: 237rpx;
					height: 82rpx;
					line-height: 82rpx;
					text-align: center;
					background-color: #FFFFFF;
					color: #C59A76;
					border-radius: 44rpx;
					border: 1rpx solid #C59A76;
					float: left;
				}
			}
		}
	}
</style>
