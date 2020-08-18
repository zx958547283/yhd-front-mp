<template>
	<view class="home">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" style="border-radius: 20rpx;overflow: hidden;">
				<swiper-item v-for="item in piclist" :key='item'>
					<image :src="item.pic" mode=""></image>
				</swiper-item>
			</swiper>
		<view class="content-top">
			<view class="content-top-left" @click="add">
				<image src="https://jk.laohaowaner.com/yhdresource/upload/imgs/home_add.png" class="pic" mode=""></image>
				<view class="tianjia">
						添加客户
				</view>
			</view>
			<view class="content-top-right" @click="manage">
				<image src="https://jk.laohaowaner.com/yhdresource/upload/imgs/home_manager.png" class="pic" mode=""></image>
				<view class="guanli">
						客户管理
				</view>
			</view>
		</view>
		<qb-footer :choose="0"></qb-footer>
	</view>
</template>

<script>
	import qbFooter from "@/components/qb-footer.vue"
	import config from '../../common/config/config.js'
	import pakTool from '../../common/utils/utility.js'
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components: {
			qbFooter,	
		},
		data() {
			return {
				piclist:[]
			}
		},
		computed: {
		},
		onLoad() {
			uni.hideTabBar()
			this.gethome()
		},
		onShow() {
			
		},
		onReady() {
			
		},
		methods: {
			add(){
				uni.navigateTo({
					url:"/pages/add/add"
				})
			},
			manage(){
				uni.navigateTo({
					url:'/pages/manage/manage'
				})
			},
			// 获取首页轮播图
			gethome(){
			    let requestPak = pakTool.createRequestPak();
			    console.log(requestPak)
			    requestPak.requestBody = {
			     encryptedData: ""
			    }
			    pakTool.request(this,'/madyApp/getHomePageInfo',requestPak).then(res=>{
					const {data}= res 
					this.piclist=  data
				})
				
			   },
		},
		onPullDownRefresh() {
			
		}
		
	}
</script>

<style lang="scss" scoped>
	.home {
		min-height: 100%;
		overflow: hidden;
		swiper {
			margin: 46rpx 30rpx;
			// width: 100%;
			height: 300rpx;
			box-sizing: border-box;
			swiper-item{
				width: 100%;
				height: 100%;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		.detail{
			width: 400rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background-color: #cdcdcd;
			position: relative;
			top: 20rpx;
			left: 160rpx;
			border: 2rpx solid yellow;
		}
		.content-top{
			display: flex;
			justify-content: space-between;
			padding-left: 30rpx;
			padding-right: 30rpx;
			.content-top-left{
				flex: 0 0 47.5%;
				height: 210rpx;
				background-color: #FFE5DF;
				border-radius: 20rpx !important;
				//padding-top: 71px;
				// float: left;
				.pic{
					width: 86rpx;
					height: 86rpx;
					position: relative;
					top: 32rpx;
					left: 116rpx;
				}
				.tianjia{
					width: 100%;
					height: 68rpx;
					background-color: #FFF4F1;
					border-radius: 0 0 20rpx 20rpx;
					text-align: center;
					line-height: 68rpx;
					position: relative;
					top: 56rpx;
					
				}
			}
			.content-top-right{
				flex: 0 0 47%;
				height: 210rpx;
				background-color: #FFEBD4;
				border-radius: 20rpx !important;
				.pic{
					width: 86rpx;
					height: 86rpx;
					position: relative;
					top: 32rpx;
					left: 116rpx;
				}
				.guanli{
					width: 100%;
					height: 68rpx;
					background-color: #FFF4E7;
					border-radius: 0 0 20rpx 20rpx;
					text-align: center;
					line-height: 68rpx;
					position: relative;
					top: 56rpx;
					
				}
			}
			
		}
	}
	
</style>
