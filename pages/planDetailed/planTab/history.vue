<template>
	<view class="history">
		<!-- 历史记录 -->
		<view class="pressure" style="margin-bottom: 20rpx;" v-for="(item,index) in sendhis" :key='index' @click="clickHistory(item.id,item.care_plan_id,item.member_id)">
			<view class="title">
				<text style="font-weight: 700;margin-right: 20rpx;">理疗编号:</text>{{item.record_no}}
			</view>
			<view class="main">
				<view class="main_left">
					<image :src="item.img_path" mode="" @click.stop="getlarge(item.img_path)"></image>
				</view>
				<view class="main_right">
					<view>
						<text class="text">项目名称:</text>
						<text>{{item.care_project_name}}</text>
					</view>
					<view>
						<text class="text">健康专员:</text>
						<text>{{item.username}}</text>
					</view>
					<view>
						<text class="text">理疗时间:</text>
						<text>{{ item.record_time }}</text>
					</view>
					<view class="arrow">
						<uni-icons type="arrowright" color="#CCCCCC" size="32"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<!-- 为空时 -->
		<view class="none" v-if="sendhis.length==0">
			<view class="img">
				<image src="../../../static/images/none.png" mode=""></image>
			</view>
			<view class="txt">
				暂无数据
			</view>
		</view>
		<uni-popup ref="popup" :maskClick="maskClickflag">
			<view class="pop">
				<image :src="img_enlarge" mode=""></image>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	export default {
		components: {
			uniIcons,
			uniPopup
		},
		props:['sendhis'],
		onShow() {
			console.log(1)
		},
		data() {
			return {
				historyData: [],
				ur: [],
				maskClickflag: "",
				img_enlarge:  ""
			}
		},
		methods: {
			getlarge(url) {
				this.maskClickflag = true;
				this.$refs.popup.open();
				this.img_enlarge = url
				console.log(this.img_enlarge);
			},
			clickHistory(id,care_plan_id,member_id) {
			uni.navigateTo({
				url: '/pages/planShow/planShow?id='+id+'&care_plan_id='+care_plan_id+'&add='+member_id,
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
			}
		}
	}
</script>

<style lang="less" scoped>
	.history {
		padding: 30rpx;
		font-size: 30rpx;

		.title {
			display: inline-block;
			margin-left: 30rpx;
			vertical-align: middle;
		}
	}

	.pressure {
		background-color: #FFFFFF;
		overflow: hidden;
		// height: 446rpx;
		border-radius: 17rpx;
		padding: 30rpx 0 10rpx 0;
		 box-shadow: 0px 2px 12px 6px rgba(133, 133, 133, 0.1);

		.main {
			margin: 20rpx 30rpx 20rpx 30rpx;
			border-top: 2rpx solid #D8D8D8;
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

				.text {
					margin-right: 15rpx;
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
			font-size: 34rpx;
			color: #c59a76;
			position: absolute;
			top: 40%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
</style>
