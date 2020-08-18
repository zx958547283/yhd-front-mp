<template>
	<view class="box">
		<!-- 顶部  账户部分-->
		<view class="arc_top">
			<view class="cir" v-if="imgurl!=''">
				<image :src="imgurl"  mode=""></image>
			</view>
			<view class="cir" v-if="imgurl==''" style="font-weight:700;width:130rpx;height:130rpx;margin-bottom: 20rpx;border-radius: 50%;line-height: 130rpx;text-align: center; background-color:#F2F2F2;">		
					{{name.substr(0,1)}}
			</view>
			<view class="cum">
				<view class="row" :style="mar==true?'margin-top:30rpx;':''">
					<text class="name">{{name}}</text>
					<text class="sex">{{sex==1?'男':(sex==2?'女':'')}}</text>
					<text>{{phone}}</text>
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
		<!-- 档案信息 -->
		<view class="fa_cell" v-show="currentindex==0">
			<tab-one :add='add' :fix='fix' :userId='userId' :health_id = 'health_id' :exc = 'exc'></tab-one>
		</view>
		<!-- 数据健康 -->
		<view class="fa_cell" v-show="currentindex==1">
			<tab-two :tabtwo='tabtwo'></tab-two>
		</view>
		<!-- 理疗记录 -->
		<view class="fa_cell" v-show="currentindex==2">
			<tab-three :tabthree='tabthree'></tab-three>
		</view>
	</view>
</template>

<script>
import TabOne from "@/pages/addarchives/tab-list/tab-one.vue" //档案信息
import TabTwo from "@/pages/addarchives/tab-list/tab-two.vue" //健康数据
import TabThree from "@/pages/addarchives/tab-list/tab-three.vue"//理疗记录
import pakTool from "@/common/utils/utility.js";
export default {
    components: {
		TabOne,
		TabTwo,
		TabThree
	},
	data(){
		return {
			tablist:['档案信息','数据健康','理疗记录'],
			currentindex:0,
			imgurl:'',
			name:'',
			aeg:'',
			sex:'',
			phone:'',
			tagarr:[],
			add:0,
			fix:{},
			userId:'', //修改时的id
			health_id:'',
			exc:'',
			tabtwo:{},
			tabthree:[],
			startIndex:1,
			total:0,
			mar:false
		}
	},
	onLoad(option) {
		// 从新增跳转过来
		if(option.add){
			// console.log('新增')
			this.add = option.add
			this.imgurl = this.$store.state.form.head
			this.name = this.$store.state.form.name
			this.age = this.$store.state.form.age
			this.sex = this.$store.state.form.sex
			this.phone = this.$store.state.form.phone
			this.tagarr = this.$store.state.form.tagarr
			if(this.tagarr.length==0){
				this.mar = true
			}
			// console.log(this.tagarr.length,5)
			this.getData()
			this.gethis()
			return
		}
		// console.log(option.userId)
		//从修改跳转过来
		if(option.userId){
			console.log('修改')
			this.userId = option.userId
			this.add = option.userId
			this.health_id = option.id
			this.exc = option.exc_key
			this.imgurl = this.$store.state.form.head
			this.name = this.$store.state.form.name
			this.age = this.$store.state.form.age
			this.sex = this.$store.state.form.sex
			this.phone = this.$store.state.form.phone
			this.tagarr = this.$store.state.form.tagarr
			if(this.tagarr.length==0){
				this.mar = true
			}
			this.getData()
			this.gethis()
			return
		}
	},
	created() {
	},
	onReachBottom() {
		if(this.currentindex==2){
				if (this.total == 0) {
						uni.showToast({
							title: '没有更多数据了',
							icon: 'none'
						})
						return
					}
					this.startIndex++
					this.gethis()()
		}
	},
	methods:{
		sel(index){
			this.currentindex = index
		},
		// 获取设备测量数据
		getData() {
			let requestPak = pakTool.createRequestPak();
			requestPak.requestBody = {
				member_id: this.add
			};
			pakTool.request(this,"/madyApp/getMemberMonitoring",requestPak).then(res=>{
				const {data} = res 
				this.tabtwo = data
			})
		},
		// 获取调理记录列表信息
		gethis() {
			let requestPak = pakTool.createRequestPak();
			requestPak.requestBody = {
				member_id: this.add,
				startIndex:this.startIndex,
				pagesize:5
			};
			pakTool.request(this,"/madyApp/getMemberCareRecordByMember",requestPak).then(res=>{
				const {data} = res
				this.total = data.length
				this.tabthree = [...this.tabthree,...data]
			})
			
		}
	}
}
</script>

<style lang="less" scoped>
	.box {
		min-height: 100%;
		background-color: #F7F7F7;
		font-size: 32rpx;
		//账户信息部分
		.arc_top{
			height: 200rpx;
			background: linear-gradient(#FFFFFF,#F3F3F3);
			padding: 0 40rpx;
			position: relative;
			box-sizing: border-box;
			overflow: hidden;
			.cir{
				height:110rpx;
				width: 110rpx;
				 border-radius: 50%;
				margin-top: 40rpx;
				float: left;
				 overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.cum {
				float: left;
				margin-top: 40rpx;
				margin-left: 30rpx;
				.row{
					height: 65rpx;
					.name {
						font-size: 36rpx;
						font-weight: 700;
					}
					.sex{
						margin: 0 30rpx;
					}
				}
				.squ{
					view{
						display: inline-block;
						padding: 2rpx 15rpx;
						border-radius: 10rpx;
						color: white;
						font-size: 28rpx;
						// border: 1px solid #333;
					}
					.fir{
					background-color: #C59A76;
					margin-right: 13rpx;
					}
					.mid{
            background-color: #F9A94C;
          margin-right: 13rpx;
					}
					.las{
            background-color: #EB7054;
            margin-right: 13rpx;
					}
				}
			}
		}
		//tab 导航部分
		.tab{
			height: 84rpx;
			padding: 20rpx 0;
			display: flex;
			justify-content: space-around;
			background-color: #FFFFFF;
			.tab_one{
				color: #C59A76;
				.line{
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
