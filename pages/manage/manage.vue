<template>
	<view class="box">
		<!-- 顶部搜索-->
		<uni-search-bar @ser='ser' placeholder="姓名/电话" :radius="100" :cancelButton="none" @confirm="search"></uni-search-bar>

		<!-- 店长展示 -->
		<view class="owner" v-if="isAdmin=='Y'">
			<!-- tab选项区域 -->
			<view class="tab">
				<view :class="currenttab===index?'tab_one':''" v-for="(item,index) in tablist" :key='index' @click="seltab(index)">
					{{ item }}
				</view>
			</view>
			<!-- tab内容部分 -->
			<view class="tab_main" v-show="currenttab==0">
				<view class="amount" v-if="alllist.length!=0">
					共{{ two_total }}个客户
				</view>
				<view class="main_one" v-for="item in alllist" :key='item.id' @click="getdetail(item.id)">
					<view class="cir">
						<image :src="item.customer_header" mode="" v-if="item.customer_header!=''"></image>
						<view v-if="item.customer_header==''" style="line-height: 100rpx;text-align: center; background:#F2F2F2; font-weight:700;">
							{{item.customerName.substr(0,1)}}
						</view>
					</view>
					<view class="name">
						<view>
							{{ item.customerName }}
						</view>
						<view style="font-weight: 400;">
							{{ item.phone }}
						</view>
					</view>
					<view class="doc_name">
						<text style="display: inline-block; width: 240rpx;">健康专员：{{item.employeeName}}</text>
					</view>
					<view class="point">
						<image src="../../static/images/cher.png" mode=""></image>
					</view>
				</view>
				<view class="none" v-if="alllist.length==0">
					<view class="img">
						<image src="../../static/images/none.png" mode=""></image>
					</view>
					<view class="txt">
						暂无客户
					</view>
				</view>
			</view>
			<view class="tab_main" v-show="currenttab==1">
				<view class="amount" v-if="clist.length!=0">
					共{{ one_total }}个客户
				</view>
				<view class="main_one" v-for="item in clist" :key='item.member_id' v-if="clist.length!=0" @click="getdetail(item.member_id)">
					<view class="cir">
						<image :src="item.customer_header" mode="" v-if="item.customer_header!=''"></image>
						<view v-if="item.customer_header==''" style="line-height: 100rpx;text-align: center; background:#F2F2F2; font-weight:700;">
							{{item.customerName.substr(0,1)}}
						</view>
					</view>
					<view class="name">
						{{ item.customerName }}
					</view>
					<view class="phone">
						<text>{{ item.phone }}</text>
					</view>
					<view class="point">
						<image src="../../static/images/cher.png" mode=""></image>
					</view>
				</view>
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

		<!-- 店员展示 -->
		<!--  -->
		<view class="tab_main"  v-if="isAdmin=='N'">
			<view class="amount" v-if="clist.length!=0">
				共{{ one_total }}个客户
			</view>
			<view class="main_one" v-for="(item,index) in clist" :key='index' v-if="clist.length!=0" @click="getdetail(item.member_id)">
				<view class="cir">
					<image :src="item.customer_header" mode="" v-if="item.customer_header!=''" ></image>
					<view v-if="item.customer_header==''" style="line-height: 100rpx;text-align: center; background:#F2F2F2; font-weight:700;">
						{{item.customerName.substr(0,1)}}
					</view>
				</view>
				<view class="name">
					{{ item.customerName }}
				</view>
				<view class="phone">
					<text>{{ item.phone }}</text>
				</view>
				<view class="point">
					<image src="../../static/images/cher.png" mode=""></image>
				</view>
			</view>
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
	import pakTool from "@/common/utils/utility.js"; // 调取接口
	export default {
		components: {
			uniSearchBar
		},
		onLoad(option) {
			// 判断是否是店长
			this.isAdmin = uni.getStorageSync('isAdmin');
			// this.isAdmin = 'Y'
			if (option.index) {
				this.currenttab = Number(option.index);
			}
			
		},
		onShow() {
			this.getShowUser()
			if(this.isAdmin=='Y'){
				this.getShowAll()
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			if(this.isAdmin=='N'){
				// this.getShowUser()
				this.getShowUser_down()
			}else if(this.isAdmin=='Y'&&this.currenttab==1){
				// this.getShowUser()
				this.getShowUser_down()
			}else{
				// this.getShowAll()
				this.getShowAll_down()
				}
		},
		//上拉加载
		onReachBottom() {
			// 如果是店员 下拉直接加载
			if(this.isAdmin=='N'){
				// 如果总数等于已加载的数量
				if(this.one_total==this.clist.length){
					uni.showToast({
						title:'没有更多客户了',
						icon:'none'
					})
					return
				}
				this.startIndex++;
				this.getUser();
			}
			// 如果是店长 并且在我的客户页
			if(this.isAdmin=='Y'&&this.currenttab==1){
				if(this.one_total==this.clist.length){
					uni.showToast({
						title:'没有更多客户了',
						icon:'none'
					})
					return
				}
				this.startIndex++;
				this.getUser();
			}
			// 如果是店长 并且在首页
			if(this.isAdmin=='Y'&&this.currenttab==0){
				if(this.two_total==this.alllist.length){
					uni.showToast({
						title:'没有更多客户了',
						icon:'none'
					})
					return
				}
				this.all_startIndex++
				this.getAll()
			}
		},
		data() {
			return {
				isAdmin: "", //判断是否是店长
				tablist: ["全部", "我的客户"], //导航栏标签
				currenttab: 0, //当前选中的tab
				clist: [],
				pageIndex: 0,
				totalRows: 0,
				amount: 0,
				searchValue: "",
				startIndex:1,
				pagesize:10,
				tabtwo:[],//店长的我的客户
				alllist:[],//所有客户
				all_startIndex:1,//店长的分页
				one_total:'',//我的客户总量
				two_total:''//店长 全部客户总量
			};
		},
		methods: {
			search(e) {
				//搜索 0如果为空则显示空的背景图
				if(this.isAdmin=='N'){
					if (e.value) {
						this.searchValue = e.value;
					} else {
						this.searchValue = "";
					}
					this.getShowUser()
				}
				if(this.isAdmin=='Y'&&this.currenttab==0){
					this.searchValue = e.value;
					this.getShowAll()
				}
				if(this.isAdmin=='Y'&&this.currenttab==1){
					this.searchValue = e.value;
					this.getShowUser()
				}
				
			},
			//
			ser(e){
				if(e){
					if(this.isAdmin=='N'){
						this.searchValue = "";
						this.getShowUser()
					}
					if(this.isAdmin=='Y'&&this.currenttab==0){
						this.searchValue = "";
						this.getShowAll()
					}
					if(this.isAdmin=='Y'&&this.currenttab==1){
						this.searchValue = "";
						this.getShowUser()
					}
				}
			},
			//切换tab栏
			seltab(index) {
				this.currenttab = index;
			},
			//跳转详情页
			getdetail(id) {
				uni.navigateTo({
					url: "/pages/detail/detail?add=" + id + '&manage=1'
				});
			},
			// 获取用户数据
			getUser() {
				let requestPak = pakTool.createRequestPak();
				requestPak.requestBody = {
					admin_user_id: uni.getStorageSync('admin_user_id'), //员工id
					search_key: this.searchValue, // 条件
					startIndex: this.startIndex, // 开始页面
					pagesize: this.pagesize // 每页条数
				};
				// 测试用
				pakTool.request(this,"/madyApp/getMineCustomer",requestPak).then(res=>{
					const { data } = res
					 this.clist = [...this.clist,...data.customerList];
					 this.one_total = data.customerCnt;
				})
			},
			getShowUser(){
				this.startIndex=1
				let requestPak = pakTool.createRequestPak();
				requestPak.requestBody = {
					admin_user_id: uni.getStorageSync('admin_user_id'), //员工id
					search_key: this.searchValue, // 条件
					startIndex: this.startIndex, // 开始页面
					pagesize: this.pagesize // 每页条数
				};
				// 测试用
				pakTool.request(this,"/madyApp/getMineCustomer",requestPak).then(res=>{
					const { data } = res
					this.clist = []
					 this.clist = [...this.clist,...data.customerList];
					 this.one_total = data.customerCnt;
				})
			},
			//获取店长数据
			getAll() {
				let requestPak = pakTool.createRequestPak();
				requestPak.requestBody = {
					admin_user_id: uni.getStorageSync('admin_user_id'), //员工id
					search_key: this.searchValue, // 条件
					startIndex: this.all_startIndex, // 开始页面
					pagesize: this.pagesize // 每页条数
				};
				// 测试用
				pakTool.request(this,"/madyApp/getAllCustomer",requestPak).then(res=>{
					const { data } = res
					// 所有店员
					this.alllist = [...this.alllist,...data.customerList]
					this.two_total = data.customerCnt
				})
				
			},
			getShowAll(){
				this.all_startIndex=1
				let requestPak = pakTool.createRequestPak();
				requestPak.requestBody = {
					admin_user_id: uni.getStorageSync('admin_user_id'), //员工id
					search_key: this.searchValue, // 条件
					startIndex: this.all_startIndex, // 开始页面
					pagesize: this.pagesize // 每页条数
				};
				// 测试用
				pakTool.request(this,"/madyApp/getAllCustomer",requestPak).then(res=>{
					const { data } = res
					// 所有店员
					this.alllist= []
					this.alllist = [...this.alllist,...data.customerList]
					this.two_total = data.customerCnt
				})
			},
			// 下拉刷新
			getShowAll_down(){
				this.all_startIndex=1
				let requestPak = pakTool.createRequestPak();
				requestPak.requestBody = {
					admin_user_id: uni.getStorageSync('admin_user_id'), //员工id
					search_key: this.searchValue, // 条件
					startIndex: this.all_startIndex, // 开始页面
					pagesize: this.pagesize // 每页条数
				};
				// 测试用
				pakTool.request(this,"/madyApp/getAllCustomer",requestPak).then(res=>{
					const { data,code } = res
					// 所有店员
					this.alllist= []
					this.alllist = [...this.alllist,...data.customerList]
					this.two_total = data.customerCnt
					if(code==200){
						wx.stopPullDownRefresh();
					}
				})
			},
			getShowUser_down(){
				this.startIndex=1
				let requestPak = pakTool.createRequestPak();
				requestPak.requestBody = {
					admin_user_id: uni.getStorageSync('admin_user_id'), //员工id
					search_key: this.searchValue, // 条件
					startIndex: this.startIndex, // 开始页面
					pagesize: this.pagesize // 每页条数
				};
				// 测试用
				pakTool.request(this,"/madyApp/getMineCustomer",requestPak).then(res=>{
					const { data,code } = res
					this.clist = []
					 this.clist = [...this.clist,...data.customerList];
					 this.one_total = data.customerCnt;
					 if(code==200){
					 	wx.stopPullDownRefresh();
					 }
				})
			},
		}
	};
</script>

<style lang="less" scoped>
	.box {
		font-size: 32rpx;
		min-height: 100%;
		// padding: 0 38rpx 38rpx 38rpx;
		background-color: #f7f7f7;

		.tab {
			padding: 30rpx 180rpx;
			display: flex;
			justify-content: space-between;
			background-color: white;

			.tab_one {
				padding-bottom: 20rpx;
				color: #c59a76;
				border-bottom: 5rpx solid #c59a76;
			}
		}

		.tab_main {
			padding: 30rpx;

			.amount {
				color: #696969;
				text-align: center;
				padding-bottom: 30rpx;
			}

			.main_one {
				box-sizing: border-box;
				height: 140rpx;
				background-color: #ffffff;
				padding: 20rpx;
				position: relative;
				margin-bottom: 20rpx;
				border-radius: 10rpx;

				.cir {
					width: 100rpx;
					height: 100rpx;
					border-radius: 50%;
					position: absolute;
					top: 50%;
					transform: translate(0, -50%);
					overflow: hidden;
					image {
						width: 100%;
						height: 100%;
					}
				}

				.name {
					position: absolute;
					top: 50%;
					transform: translate(0, -50%);
					left: 150rpx;
					font-weight: 700;
				}

				.doc_name {
					position: absolute;
					top: 50%;
					transform: translate(0, -50%);
					right: 65rpx;
					font-weight: 700;
					font-size: 30rpx;
				}

				.phone {
					position: absolute;
					top: 50%;
					transform: translate(0, -50%);
					left: 330rpx;
				}

				.point {
					width: 16rpx;
					height: 26rpx;
					position: absolute;
					top: 50%;
					transform: translate(0, -50%);
					right: 30rpx;
					vertical-align: top;

					image {
						width: 100%;
						height: 100%;
						vertical-align: top;
					}
				}
			}

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
