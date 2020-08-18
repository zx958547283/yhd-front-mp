<template>
	<view class="tabthree">
		<!-- 理疗数据 -->
		<view class=""  v-for="(item,index) in listArr" :key='index' >
			<!-- <view @click="show(item.care_num)">
				{{item.care_num}}{{item.username}}{{item.care_project_name}}
			</view> -->
			
			<view class="pressure" style="margin-top: 20rpx;" @click="show(item.care_num)">
				<view style='display:inline-block;position:relative;'><view class="line"></view></view>
				<view class="title">
					<text style="font-weight: 700;margin-right: 20rpx;">方案编号:</text>{{item.care_num}}
					
						<uni-icons style="margin-left: 325rpx;" :type="item.care_num==showlist?'arrowup':'arrowdown'" size="36" color="#C59A76"></uni-icons>
					
				</view>
				<view class="main">
					<view style="display: flex;">
						<view class="mess" style="margin-right: 50rpx;">项目名称:&nbsp;&nbsp;{{item.care_project_name}}</view>
						<view class="mess">健康专员:&nbsp;&nbsp;{{item.username}}</view>
					</view>
				</view>
			</view>
			
			
			
			
			
			<view class="pressure" style="margin-top: 10rpx;" v-for="(i,ind) in item.listInfo" :key='ind' v-if="showlist==item.care_num">
				<view class="title">
					<text style="font-weight: 700;margin-right: 20rpx;">理疗编号:</text>{{i.record_no}}
				</view>
				<view class="main">
					<view class="main_left">
						<image :src="i.img_path" mode="" @tap="getlarge(i.img_path)"></image>
					</view>
					<view class="main_right" @click="enter(i.id,i.care_plan_id,i.member_id)">
						<view class="mess">项目名称:&nbsp;&nbsp;{{i.care_project_name}}</view>
						<view class="mess">健康专员:&nbsp;&nbsp;{{i.username}}</view>
						<view class="mess">理疗时间:&nbsp;&nbsp;{{i.record_time}}</view>
						<view class="arrow">
							<uni-icons type="arrowright" size="32" color="#CCCCCC"></uni-icons>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <view class="pressure" style="margin-top: 20rpx;" v-for="(item,index) in tabthree" :key='index'>
			<view class="title">
				<text style="font-weight: 700;margin-right: 20rpx;">理疗编号:</text>P-{{item.care_num}}&nbsp;&nbsp;{{item.record_no}}
			</view>
			<view class="main">
				<view class="main_left">
					<image :src="item.img_path" mode="" @tap="getlarge(item.img_path)"></image>
				</view>
				<view class="main_right" @click="enter(item.id,item.care_plan_id)">
					<view class="mess">项目名称:&nbsp;&nbsp;{{item.care_project_name}}</view>
					<view class="mess">健康专员:&nbsp;&nbsp;{{item.username}}</view>
					<view class="mess">理疗时间:&nbsp;&nbsp;{{item.record_time}}</view>
					<view class="arrow">
						<uni-icons type="arrowright" size="32" color="#CCCCCC"></uni-icons>
					</view>
				</view>
			</view>
		</view> -->
		<!-- 为空时 -->
		<view class="none" v-if="tabthree.length==0">
			<view class="img">
				<image src="../../../static/images/none.png" mode="aspectFit"></image>
			</view>
			<view class="txt">
				暂无数据
			</view>
		</view>
		<!-- 弹窗 -->
		<uni-popup ref="popup" :maskClick="maskClickflag">
			<view class="pop">
				<image :src="img_enlarge" mode=""></image>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	import pakTool from "@/common/utils/utility.js"; // 调用接口
	export default {
		components: {
			uniIcons,
			uniPopup
		},
		props: ["add",'btm','fix'],
		data() {
			return {
				tabthree: [],
				maskClickflag: "",
				img_enlarge:"",
				startIndex:1,
				listArr:[],
				showlist:''
			};
		},
		mounted() {
			this.getmessage();
		},
		watch:{
			fix(){
				this.getmessage()
			}
		},
		methods: {
			//预览图片
			getlarge(url) {
				this.maskClickflag = true;
				this.$refs.popup.open();
				this.img_enlarge = url
				console.log(this.img_enlarge);
			},
			enter(id, care_plan_id,member_id) {
				uni.navigateTo({
					url: "/pages/planShow/planShow?id=" + id + "&care_plan_id=" + care_plan_id +'&add=' +member_id
				});
			},
			// 获取调理记录列表信息
			getmessage() {
				this.tabthree = []
				let requestPak = pakTool.createRequestPak();
				requestPak.requestBody = {
					member_id: this.add
				};
				pakTool
					.request(this, "/madyApp/getMemberCareRecordByMember", requestPak)
					.then(res => {
						const {
							data
						} = res;
						this.total = data.length
						this.tabthree = [...this.tabthree,...data]
						//方案归类
						var listArr = [];
							this.tabthree.forEach(function(item,index){
								for(var i=0;i<listArr.length;i++){
									// 对比相同的字段key，相同放入对应的数组
									if(listArr[i].care_num == item.care_num){
										listArr[i].listInfo.push({
											care_plan_id: item.care_plan_id,
											care_project_name: item.care_project_name,
											care_num:item.care_num,
											comment:item.comment,
											id:item.id,
											img_path:item.img_path,
											member_id:item.member_id,
											record_no:item.record_no,
											record_time:item.record_time,
											username:item.username
										});
										return;
									}
								}
								// 第一次对比没有参照，放入参照
								listArr.push({
									care_num: item.care_num,
									care_project_name: item.care_project_name,
									username:item.username,
									listInfo: [{
										care_plan_id: item.care_plan_id,
										care_project_name: item.care_project_name,
										care_num:item.care_num,
										comment:item.comment,
										id:item.id,
										img_path:item.img_path,
										member_id:item.member_id,
										record_no:item.record_no,
										record_time:item.record_time,
										username:item.username
									}]
								});	
							});
							this.listArr = listArr
							console.log(listArr)
							console.log(data)
			
					});
			},
			show(id){
				if(this.showlist==id){
					this.showlist = ''
				}else{
					this.showlist = id
				}
				
				console.log(id)
			}
		}
		
	};
</script>

<style lang="less" scoped>
	.tabthree {
		padding: 10rpx 30rpx 30rpx 30rpx;
		font-size: 30rpx;

		.title {
			display: inline-block;
			margin-left: 30rpx;
			vertical-align: middle;
		}

		.pressure {
			background-color: #ffffff;
			overflow: hidden;
			// height: 446rpx;
			border-radius: 17rpx;
			padding: 30rpx 0 10rpx 0;
			
			.line {
				display: inline-block;
				width: 6rpx;
				height: 65rpx;
				border-radius: 0 6rpx 6rpx 0;
				vertical-align: middle;
				position: relative;
				background-color: #c59a76;
			}

			.main {
				margin: 20rpx 30rpx 20rpx 30rpx;
				border-top: 2rpx solid #d8d8d8;
				overflow: hidden;
				padding: 30rpx 0 10rpx 0;

				.main_left {
					float: left;
					width: 162rpx;
					height: 162rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				.main_right {
					width: 65%;
					height: 162rpx;
					float: right;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					position: relative;

					.mess {
						display: table;
					}

					.arrow {
						position: absolute;
						right: 0;
						top: 50%;
						transform: translate(0, -50%);
					}
				}
			}
		}

		.none {
			padding: 70rpx 50rpx 50rpx 50rpx;

			.img {
				width: 550rpx;
				height: 406rpx;
				margin: 0 auto;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.txt {
				text-align: center;
				margin-top: -50rpx;
			}
		}

		//弹窗
		.pop {
			width: 605rpx;
			height: 580rpx;
			background-color: #ffffff;
			border-radius: 20rpx;

			image {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
			}

			.sus_txt {
				font-size: 34rpx;
				color: #c59a76;
				position: absolute;
				top: 40%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}
</style>
