<template>
	<view class="depts">
		<!-- 用户信息 -->
			<view class="arc_top">
				<view class="angle clearfix">
					<view class="cir">
						<image src="../../static/home/gir.png"></image>
					</view>
				</view>
				<view class="welcome">
					Hi~欢迎{{jxs_name}}登录 !
				</view>
			</view>
		<view class="list_box">
			<view class="depts_list clearfix" v-for="(item,index) in depts_list" :key='index' @click="enter(item.id)">
				<view class="list_photo">
					<image :src="item.org_image_path" mode=""></image>
				</view>
				<view class="list_text">
					<view style="font-weight: 700;color: #424242;font-size: 34rpx;">
						{{item.name}}
					</view>
					<view style="color: #CCA57E;">
						{{item.code}}
					</view>
					<view style="color: rgb(177, 177, 177);" v-if="item.address">
						{{item.address}}
					</view>
				</view>
				<view class="list_enter">
					进入
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	import pakTool from '../../common/utils/utility.js'
	export default {
		components: {
			
		},
		onShow() {
			wx.hideHomeButton()
		},
		onLoad(option) {
			this.depts_list = uni.getStorageSync('depts')
		},
		onReachBottom() {
			
		},
		data() {
			return {
				userImage:'../../static/mine/bgc.png',
				jxs_name: uni.getStorageSync('belongOrg').name, //经销商名字自
				depts_list:[] // 店铺列表
			};
		},
		methods: {
			enter(deptsid){
				// 存入店铺id
				uni.setStorageSync('dealerDeptId',deptsid)
				// 跳入主页
				uni.switchTab({
					url:'../home/home'
				})
			}
		}
	};
</script>

<style lang="less">
	.depts {
		min-height: 100%;
		font-size: 28rpx;
		// 用户信息
		.arc_top {
			height: 200rpx;
			padding: 0 30rpx;
			position: relative;
			box-sizing: border-box;
			overflow: hidden;
			.angle {
				background-image: url(../../static/home/angle.png);
				margin-top: 40rpx;
				background-size: 124rpx 106rpx;
				// padding: 20rpx;
				width: 124rpx;
				height: 106rpx;
				float: left;
				.cir {
					height: 102rpx;
					width: 102rpx;
					border-radius: 50%;
					margin: 11rpx auto;
					overflow: hidden;
				
					image {
						width: 100%;
						height: 100%;
					}
				}
			}
			.welcome{
				width: 470rpx;
				height: 60rpx;
				margin-top: 63rpx;
				margin-left: 135rpx;
				background-color: #C59A76;
				color: #FFFFFF;
				border-radius: 30rpx;
				padding: 0 30rpx;
				box-sizing: border-box;
				line-height: 60rpx;
			}
		}
		// 门店列表
		.list_box{
			padding: 0 30rpx;
			.depts_list {
				margin-top: 30rpx;
				padding: 18rpx 30rpx 16rpx 25rpx;
				box-sizing: border-box;
				box-shadow:0px 2px 12px 6px rgba(133,133,133,0.1);
				.list_photo{
					width: 145rpx;
					height:145rpx;
					border-radius: 30rpx;
					float: left;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.list_text {
					padding: 7rpx 25rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					float: left;
					height: 130rpx;
				}
				.list_enter{
					width: 166rpx;
					height: 50rpx;
					border-radius: 26rpx;
					background-color: #F8ECE2;
					color: #AB8600;
					line-height: 50rpx;
					text-align: center;
					float: right;
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
}
</style>
