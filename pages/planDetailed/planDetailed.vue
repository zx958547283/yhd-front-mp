<template>
	<view class="planDetailed">
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
		<!-- tab导航部分 -->
		<view class="tab">
			<view :class="currentindex==index?'tab_one':''" v-for="(item,index) in tablist" :key='index' @click="sel(index)">
				{{item}}
				<view class="line" v-if="currentindex==index"></view>
			</view>
		</view>
		<!-- 内容表格部分 -->

		<!-- 方案详情 -->
		<view class="fa_cell" v-show="currentindex==0">
			<detailed :send='send' :care_plan_id='care_plan_id' :add='add' :one='one'></detailed>
		</view>
		<!-- 历史记录 -->
		<view class="fa_cell" v-show="currentindex==1">
			<history :sendhis='sendhis'></history>
		</view>

	</view>
</template>

<script>
	// 方案详情
	import Detailed from "@/pages/planDetailed/planTab/detailed.vue"
	// 历史记录
	import History from "@/pages/planDetailed/planTab/history.vue"
	import pakTool from '../../common/utils/utility.js'
	import qbHeader from '@/components/header.vue'
	export default {
		components: {
			Detailed,
			History,
			qbHeader
		},
		onShow() {
			if(this.currentindex==0){
				this.one++
			}
			if(this.currentindex==1&&this.fixImg==true){
				this.getFixHis()
			}
		},
		onLoad(option) {
			// this.getlist()
			var that =this
			uni.getSystemInfo({
				           success(res) {
				               that.phoneHeight = res.windowHeight;
				               // 计算组件的高度
				               let view = uni.createSelectorQuery().select('.qh'); 
				               view.boundingClientRect(data => {
				                    let navHeight = data.height;
								   const systemInfo = uni.getSystemInfoSync();
								  let pxToRpxScale = 750 / systemInfo.windowWidth;
								  // 搜索框距离顶部导航的位置
								   that.ser_top = (navHeight + systemInfo.statusBarHeight) * pxToRpxScale		
				               }).exec();		
				           }
				       }); 
			this.add = option.add
			// 提交记录之后跳转的历史记录
			if (option.index) {
				console.log('执行了提交跳转')
				this.userImage = this.$store.state.form.head
				this.userName = this.$store.state.form.name
				this.userSex = this.$store.state.form.sex
				this.userPhone = this.$store.state.form.phone
				this.tagarr = this.$store.state.form.tagarr
				if(this.tagarr.length==0){
					this.mar = true
				}
				this.currentindex = option.index
				this.care_plan_id = option.his
				this.getlist()
				this.gethis()
				return
			}
			// this.add = option.add
			// this.gethis()
			if (option.id || option.add) {
				//首次添加
				console.log('执行了首次添加')
				this.care_plan_id = option.id
				this.add = option.add
				this.userImage = this.$store.state.form.head
				this.userName = this.$store.state.form.name
				this.userSex = this.$store.state.form.sex
				this.userPhone = this.$store.state.form.phone
				this.tagarr = this.$store.state.form.tagarr
				if(this.tagarr.length==0){
					this.mar = true
				}
				this.getlist()
				this.gethis()
				return
			}
		},
		data() {
			return {
				add: '', // 客户id
				care_plan_id: '', // 获取详情id
				userImage: "",
				userName: "",
				userSex: "",
				userPhone: "",
				tablist: ['方案详情', '历史记录'],
				currentindex: 0,
				send: '', // 给表单信息子组件
				sendhis: '', //发送历史给子组件
				startIndex: 1, //起始页
				pagesize: 3, //每页数量
				tagarr: [],
				one:0, //tabone显示
				mar:false,
				sty:{
					background: 'rgb(248, 248, 248)',
					fontColor: '',
					iconColor: '',
					iconText: '' //导航栏文字
				},
				ser_top:0,
				total:0,
				fixImg:false
			}
		},
		onReachBottom() {
			// 到达底部
			if (this.currentindex == 1) {
				if(this.total==0){
					uni.showToast({
						title:'没有更多数据了',
						icon:'none'
					})
					return
				}
				this.startIndex++
				this.gethis()
			}
		},
		methods: {
			sel(index) {
				this.currentindex = index
			},
			getlist(){
					let requestPak = pakTool.createRequestPak();		
					requestPak.requestBody = {
						// care_plan_id: '9d3b3298-7363-4371-a7ba-f0a0004fcf13'
						care_plan_id:this.care_plan_id
					}
				pakTool.request(this,'/madyApp/getCarePlanDetail',requestPak).then(res=>{
					const {data}= res
					this.send = data
				})
				
			},
			//获取历史
			gethis(){
					let requestPak = pakTool.createRequestPak();		
					requestPak.requestBody = {
						plan_id:this.care_plan_id,
						startIndex:this.startIndex,
						pagesize:this.pagesize
					}
				pakTool.request(this,'/madyApp/getMemberCareRecord',requestPak).then(res=>{
					const {data}= res
					// this.sendhis = data
					this.total = data.length
					this.sendhis = [...this.sendhis,...data]
					console.log(data,'我是历史记录')
				})
				
			},
			//获取修改后的历史
			getFixHis(){
					this.startIndex = 1;
					this.total = 0;
					let requestPak = pakTool.createRequestPak();		
					requestPak.requestBody = {
						plan_id:this.care_plan_id,
						startIndex:this.startIndex,
						pagesize:this.pagesize
					}
				pakTool.request(this,'/madyApp/getMemberCareRecord',requestPak).then(res=>{
					const {data}= res
					// this.sendhis = data
					this.total = data.length
					this.sendhis = []
					this.sendhis = [...this.sendhis,...data]
					// console.log(data,'我是历史记录')
				})
				
			},
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
			}
		}
	}
</script>

<style lang="less" scoped>
	
	.qh{
		position: fixed;
		  // position: -webkit-sticky;
		  top: 0rpx; 
		  z-index: 101;
		  width: 100%;
	}
	.planDetailed {
		// height: 100%;
		// background-color: #F7F7F7;
		font-size: 30rpx;
		overflow: hidden;
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
						font-size: 34rpx;
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

		//tab 导航部分
		.tab {
			height: 84rpx;
			padding: 20rpx 0 0 0;
			margin-bottom: 20rpx;
			display: flex;
			justify-content: space-around;
			background-color: #FFFFFF;
			font-size: 32rpx;
			box-shadow: 0px 2px 12px 0 rgba(133, 133, 133, 0.1);
			.tab_one {
				color: #C59A76;

				.line {
					height: 10rpx;
					width: 55rpx;
					margin: 0 auto;
					border-radius: 20rpx;
					background-color: #C59A76;
					margin-top: 15rpx;
				}
			}
		}

		.fa_cell {
			// background-color: #F7F7F7;
			
		}

	}
</style>
