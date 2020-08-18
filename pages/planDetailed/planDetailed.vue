<template>
	<view class="planDetailed">
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

	export default {
		components: {
			Detailed,
			History
		},
		onShow() {
			if(this.currentindex==0){
				this.one++
			}
		},
		onLoad(option) {
			// this.getlist()
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
				mar:false
			}
		},
		onReachBottom() {
			// 到达底部
			if (this.currentindex == 1) {
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
					if(data.length==0&&this.currentindex==1){
						uni.showToast({
							title:'没有更多数据了',
							icon:'none'
						})
						return
					}
					this.sendhis = [...this.sendhis,...data]
					console.log(data,'我是历史记录')
				})
				
			}
		}
	}
</script>

<style lang="less" scoped>
	.planDetailed {
		height: 100%;
		background-color: #F7F7F7;

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
			padding: 20rpx 0;
			display: flex;
			justify-content: space-around;
			background-color: #FFFFFF;

			.tab_one {
				color: #C59A76;

				.line {
					height: 10rpx;
					width: 55rpx;
					margin: 0 auto;
					border-radius: 20rpx;
					background-color: #C59A76;
					margin-top: 20rpx;
				}
			}
		}

		.fa_cell {
			background-color: #F7F7F7;
		}

	}
</style>
