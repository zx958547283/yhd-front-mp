<template>
	<view class="box" ref="cont">
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
					{{name}}
				</view>
			</view>
		</qb-header>
		</view>
		<!-- 顶部搜索-->
		<view :style="{ top: ser_top + 'rpx;'}" class="ser">
			<uni-search-bar @ser='ser' placeholder="人体的每个穴位你知道吗" :radius="100" :cancelButton="none" @confirm="search"></uni-search-bar>
		</view>

		<!-- 卡片区 -->
		<view class="card_list" >
			<view class="card  clearfix"  v-for="(item,index) in cardList" :key='index' @click.stop="detail(item)"  >
				<view class="card_left clearfix">
					<image :src="item.cover_path" mode=""></image>
					<view class="img_type">
						{{item.media_type==0?'图文':item.media_type==1?'音频':'视频'}}
					</view>
				</view>
				<view class="card_right">
					<view class="right_top clearfix">
						<view style="color: #8F620C;font-size: 20rpx;float: left;">
							#为你推荐
						</view>
						<!-- <view class="good">
							<text>赞</text>
							<image src="../../static/learn/good.png" mode="" style="width: 20rpx;height: 19rpx;margin-left: 9rpx;"></image>
						</view> -->
					</view>
					<view class="right_middle">
						<view class="middle_top">
							{{item.title}}
						</view>
						<view class="middle_btm"  v-if="item.content_desc">
							{{item.content_desc}}
						</view>
					</view>
					<view class="right_bottom" v-if="item.tags">
						<view class="" v-for="(i,ind) in item.tags" :key='ind'>
							{{i}}
						</view>
					</view>
				</view>
			</view>
		</view>
		

	</view>
</template>

<script>
	import uniSearchBar from "@/components/uni-search-bar/uni-search-bar.vue";
	import pakTool from "@/common/utils/utility.js"; // 调取接口
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	import qbHeader from '@/components/header.vue'
	export default {
		components: {
			uniSearchBar,
			uniIcons,
			qbHeader
		},
		onLoad(option) {
			var that =this
		uni.getSystemInfo({
			           success(res) {
			               that.phoneHeight = res.windowHeight;
			               // 计算组件的高度
			               let view = uni.createSelectorQuery().select('.qh');
										// console.log(view)
			               view.boundingClientRect(data => {
			                    let navHeight = data.height;
							   const systemInfo = uni.getSystemInfoSync();
							   let pxToRpxScale = 750 / systemInfo.windowWidth;
							   // 搜索框距离顶部导航的位置
							    that.ser_top = (navHeight + systemInfo.statusBarHeight) * pxToRpxScale
								console.log(that.ser_top)		
			               }).exec();		
			           }
			       }); 
			this.name = option.name
			this.def_list_id = option.def_list_id 
			// this.def_id = option.def_id
			this.getlist()
		},
		data() {
			return {
				cardList:[],
				sty:{
					background: 'rgb(248, 248, 248)',
					fontColor: '#000000',
					iconColor: '#000000',
					iconText: '查看更多' //导航栏文字
				},
				def_id:'',
				startIndex:1,
				pagesize:5,
				searchKey:'',
				total:0,
				ser_total:0	,
				ser_top:0,//搜索框距离顶部高度
				def_list_id:'',
				name:''
			};
		},
		onReachBottom() {
			// 如果是搜索分页
			if(this.isSer==true){
				if(this.ser_total==0){
					uni.showToast({
						title: '没有更多数据了',
						icon: 'none'
					})
					return
				}
				this.startIndex++
				this.btmSer()
				return
			}
			// 正常分页
			if (this.total == 0) {
				uni.showToast({
					title: '没有更多数据了',
					icon: 'none'
				})
				return
			}
			this.startIndex++
			this.getlist()
			
		},
		methods: {
			// 顶部导航栏功能
			back(){
				uni.navigateBack({
					delta:"1"
				})
			},
			gohome(){
				uni.switchTab({
					url:'/pages/home/home'
				})
			},
			// 页面功能
			detail(detail){
				if(detail.is_link!=1){
					uni.navigateTo({
						url:'/pages/learn/article?detail='+ encodeURIComponent(JSON.stringify(detail))
					})
				}else{
					uni.navigateTo({
						url:'/pages/learn/imgArticle?imgUrl='+encodeURIComponent(JSON.stringify(detail.url))})
				}
			},
			getlist(){	   
				let requestPak = pakTool.createRequestPak();
				requestPak.requestBody = {
				 defListId:this.def_list_id,
				startIndex:this.startIndex,
				pagesize:this.pagesize,
				searchKey:this.searchKey
				}
				pakTool.request(this,'/content/getContentByDefId',requestPak).then(res=>{
					const {data}= res 
					data.forEach(item=>{
						if(item.tags){
							return item.tags = item.tags.split(',')
						}
					})
					this.total = data.length
					this.cardList = [...this.cardList,...data]
				})
			},
			// 搜索
			search(e){
				this.isSer = true;
				this.startIndex = 1
				this.searchKey = e.value
				let requestPak = pakTool.createRequestPak();
				requestPak.requestBody = {
				 defListId:this.def_list_id,
				startIndex:this.startIndex,
				pagesize:this.pagesize,
				searchKey:this.searchKey
				}
				pakTool.request(this,'/content/getContentByDefId',requestPak).then(res=>{
					const {data}= res 
					data.forEach(item=>{
						if(item.tags){
							return item.tags = item.tags.split(',')
						}
					})
					this.ser_total = data.length
					this.cardList = []
					this.cardList = [...this.cardList,...data]
				})
			},
			// 搜索分页
			btmSer(){
				let requestPak = pakTool.createRequestPak();
				requestPak.requestBody = {
				 defListId:this.def_list_id,
				startIndex:this.startIndex,
				pagesize:this.pagesize,
				searchKey:this.searchKey
				}
				pakTool.request(this,'/content/getContentByDefId',requestPak).then(res=>{
					const {data}= res 
					data.forEach(item=>{
						if(item.tags){
							return item.tags = item.tags.split(',')
						}
					})
					this.ser_total = data.length
					this.cardList = [...this.cardList,...data]
				})
			},
			// 取消搜索 返回全部
			ser(val){
				this.isSer = false
				this.startIndex = 1;
				this.searchKey = ''
				let requestPak = pakTool.createRequestPak();
				requestPak.requestBody = {
				 defListId:this.def_list_id,
				startIndex:this.startIndex,
				pagesize:this.pagesize,
				searchKey:this.searchKey
				}
				pakTool.request(this,'/content/getContentByDefId',requestPak).then(res=>{
					const {data}= res 
					data.forEach(item=>{
						if(item.tags){
							return item.tags = item.tags.split(',')
						}
					})
					this.total = data.length
					this.cardList = []
					this.cardList = [...this.cardList,...data]
				})
			}
		}
	};
</script>

<style lang="less" scoped>
	.box {
		font-size: 32rpx;
		min-height: 100%;
		overflow: hidden;
		// padding: 0 38rpx 38rpx 38rpx;
		.qh{
			position: fixed;
			  // position: -webkit-sticky;
			  top: 0rpx; 
			  z-index: 101;
			  width: 100%;
		}
		.ser{
			position: fixed;
			width: 100%;
			z-index: 101;
		}
		.card_list{
			margin-top: 290rpx;
			.card{
				padding: 30rpx 30rpx 30rpx 30rpx;
				margin: 0 30rpx 32rpx 30rpx;
				box-shadow:0px 2px 12px 6px rgba(133,133,133,0.1);
				border-radius: 30rpx;
				.card_left{
					float: left;
					margin-right: 25rpx;
					position: relative;
					image{
						width: 194rpx;
						height: 268rpx;
					}
					.img_type {
						position: absolute;
						background-color: rgba(0,0,0,1);
						text-align: center;
						color: #FFFFFF;
						width: 47rpx;
						height: 28rpx;
						line-height: 28rpx;
						font-size: 20rpx;
						border-radius:5rpx;
						opacity:0.4;
						right: 8rpx;
						bottom: 8rpx;
					}
				}
				.card_right{
					float: left;
					height: 268rpx;
					position: relative;
					.right_top{
						width: 400rpx;
						margin-bottom: 14rpx;
						.good{
							float:right;
							color: #999999;
							font-size: 20rpx;
						}
					}
					.right_middle{
						width: 400rpx;
						.middle_top{
							font-size: 30rpx;
							color: #333333;
							width:400rpx;
							  overflow: hidden;
							    -webkit-line-clamp: 2;
							    text-overflow: ellipsis;
							    display: -webkit-box;
							    -webkit-box-orient: vertical;					
								margin-bottom: 14rpx;
								font-weight: 700;
							
						}
						.middle_btm{
							font-size: 30rpx;
							color: #696969;
							width:400rpx;
							 overflow: hidden;
							 text-overflow: ellipsis;
							  display: -webkit-box;
						      -webkit-line-clamp: 2;
							  -webkit-box-orient: vertical;						
							margin-bottom: 15rpx;
						}
					}
					.right_bottom{
						position: absolute;
						left: 0;
						bottom: 0;
						view{
							display: inline-block;
							width: 127rpx;
							height: 44rpx;
							text-align: center;
							line-height: 44rpx;
							box-sizing: border-box;
							color: #8F620C;
							background-color: #F8ECE2;
							border-radius: 21rpx;
							font-size: 24rpx;
							float: left;
							margin-right: 10rpx;
						}
						view:last-child{
							margin-right:0;
						} 
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
	}
</style>
