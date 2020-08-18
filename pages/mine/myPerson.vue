<template>
	<view class="box">
		<!-- 顶部搜索、tab区域 -->
		<uni-search-bar @ser='ser' placeholder="输入姓名" :radius="100" :cancelButton="none" @confirm="search"></uni-search-bar>
		<!-- tab内容部分 -->
		<view class="main" v-if="currenttab==0">
			<view class="detail" v-for="(item,index) in clist" :key='item.id'>
				<!-- 头像 -->
				<view class="head_pic">
					<image :src="header" mode="" v-if="header==''"></image>
					<image :src="header" mode="" v-if="header!=''"></image>
				</view>
				<!-- 姓名电话 -->
				<view class="infor">
					<view class="name">{{ item.username }}</view>
					<view class="number">{{ item.mobile }}</view>
				</view>
				<view class="number_per">
					<view class="number_per01">客户数:{{ item.customerCnt }}</view>
					<view :class="item.status == 'Y' ? 'status_y' : 'status_n'" @click="change(item.id,item.status,index)">
						{{ item.status=='Y' ? '启用' : '禁用'}}</view>
				</view>
			</view>
			<!-- 搜索为空 -->
			<view class="none" v-if="clist.length==0">
				<view class="img">
					<image src="../../static/images/none.png" mode=""></image>
				</view>
				<view class="txt">
					暂无客户
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSearchBar from "@/components/uni-search-bar/uni-search-bar.vue";
	import pakTool from "@/common/utils/utility.js"; // 调用接口
	export default {
		components: {
			uniSearchBar
		},
		onReady() {
			// 获取所有员工信息
			this.getAllEmployee();
		},
		//下拉刷新
		onPullDownRefresh() {
			console.log(1);
		},
		//上拉加载
		onReachBottom() {
			if (this.clist.length >= this.totalRows) {
				// 没有更多数据了，给一个提示，终止后续的接口调用
				uni.showToast({
					title: "没有更多数据了",
					icon: "none"
				});
				return;
			}
			// 加载下一页数据
			this.pageIndex = this.pageIndex + 1;
			// 页码加一后需要再次调用后台接口
			this.getmanage();
		},
		data() {
			return {
				currenttab: 0, //当前选中的tab
				head: "", //用户头像
				clist: [
				// 	{
				// 	code: "10002",
				// 	company_id: "1",
				// 	create_time: "2020-06-01 17:24:42.0",
				// 	create_user: "1",
				// 	customerCnt: "154",
				// 	depart_id: "33c6b8f2-26b8-47cf-80e1-ff9b919cc532",
				// 	dr: "0",
				// 	edit_time: "2020-06-02 09:54:42.0",
				// 	edit_user: "1",
				// 	email: null,
				// 	exc_key: "2",
				// 	icon: null,
				// 	id: "4848b8d5-f833-49ea-85c6-ecf7d2401869",
				// 	isadmin: "N",
				// 	isdoctor: "1",
				// 	login_time: null,
				// 	mobile: "18842358732",
				// 	nick_name: "健康专员A",
				// 	note: null,
				// 	organization_id: "1",
				// 	refresh_token: null,
				// 	status: "Y",
				// 	tmclound_userid: null,
				// 	username: "健康专员A",
				// 	header: ""
				// },
				],
				pageIndex: 0,
				totalRows: 0
			};
		},
		computed: {},
		methods: {
			//获取用户列表
			getmanage() {
				this.clist = [...this.clist, ...res.data.tableData]; //合并列表页
				this.totalRows = res.data.pageParam.totalRows; //消息的总数量
			},
			//店员帐号状态更改
			change(id, state, index) {
				if (state == "Y") {
					this.clist[index].status = "N";
				} else {
					this.clist[index].status = "Y";
				}
				this.changeStatus(id, this.clist[index].status, index);
			},

			// 获取店员数据
			getAllEmployee() {
				let requestPak = pakTool.createRequestPak();
				requestPak.requestBody = {
					admin_user_id: uni.getStorageSync('admin_user_id') // 登录员工id
				};
				pakTool.request(this,"/madyApp/getAllEmployee",requestPak).then(res=>{
					const {data} =  res 
					this.clist = data;
				})
				
			},

			// 修改店员状态
			changeStatus(id, status, index) {
				let requestPak = pakTool.createRequestPak();
				requestPak.requestBody = {
					employeeId: id, // 员工id
					status: status // 员工状态
				};
				pakTool.request(this,"/madyApp/saveEmployeeStatus",requestPak).then(res=>{
					const {data} = res 
				})
			},
			
		}
	};
</script>

<style lang="less" scoped>
	.box {
		min-height: 100%;
		background-color: #f7f7f7;

		.main {
			padding: 30rpx;

			//列表栏样式
			.detail {
				height: 100rpx;
				background-color: #ffffff;
				padding: 36rpx;
				border-radius: 10rpx;
				margin-bottom: 20rpx;

				//头像样式
				.head_pic {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					float: left;
					margin-right: 30rpx;

					image {
						width: 100%;
						height: 100%;
					}
				}

				//姓名、电话
				.infor {
					width: 196rpx;
					height: 100rpx;
					float: left;
					padding-top: 8rpx;

					.name {
						height: 45rpx;
						line-height: 45rpx;
					}

					.number {
						height: 45rpx;
						line-height: 45rpx;
					}
				}

				//客户数量 启用状态
				.number_per {
					float: right;
					width: 35%;

					// 启用
					.status_y {
						width: 136rpx;
						height: 50rpx;
						color: #ffffff;
						background-color: #c59a76;
						border-radius: 25rpx;
						margin-top: 17rpx;
						line-height: 50rpx;
						text-align: center;
					}

					// 禁用
					.status_n {
						width: 136rpx;
						height: 50rpx;
						color: #ffffff;
						background-color: #ff3b30;
						border-radius: 25rpx;
						margin-top: 17rpx;
						line-height: 50rpx;
						text-align: center;
					}
				}
			}

			//搜索为空
			.none {
				padding: 50rpx;

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
		}
	}
</style>
