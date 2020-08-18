<template>
	<view class="tabthree">
		<!-- 理疗数据 -->
		<view class="pressure" style="margin-top: 20rpx;" v-for="(item,index) in tabthree" :key='index'>
			<view class="title">
				<text style="font-weight: 700;margin-right: 20rpx;">理疗编号:</text>{{item.record_no}}
			</view>
			<view class="main">
				<view class="main_left">
					<image :src="item.img_path" mode="" @tap="getlarge(item.img_path)"></image>
				</view>
				<view class="main_right">
					<view class="mess">项目名称:&nbsp;&nbsp;{{item.care_project_name}}</view>
					<view class="mess">健康专员:&nbsp;&nbsp;{{item.username}}</view>
					<view class="mess">理疗时间:&nbsp;&nbsp;{{item.record_time}}</view>
					<view class="arrow">
						<uni-icons type="arrowright" size="20" color="#CCCCCC"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<!-- 为空时 -->
		<view class="none" v-if="tabthree.length==0">
			<view class="img">
				<image src="../../../static/images/none.png" mode=""></image>
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
		watch: {
			tabthree() {
				console.log(this.tabthree, 9999)
			}
		},
		created() {},
		props: ["userId", "tabthree"],
		data() {
			return {
				maskClickflag:'',
				img_enlarge:''
			};
		},
		methods: {
			//预览图片
			getlarge(url) {
				this.maskClickflag = true;
				this.$refs.popup.open();
				this.img_enlarge = url
			},
		}
	};
</script>

<style lang="less" scoped>
	.tabthree {
		padding: 30rpx;
		font-size: 32rpx;

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
				font-size: 36rpx;
				color: #c59a76;
				position: absolute;
				top: 40%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}
</style>
/style>
