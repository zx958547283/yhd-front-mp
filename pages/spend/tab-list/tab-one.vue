<template>
	<view class="tabone">
		<!-- 理疗数据 -->
		<view class="pressure" v-for="(item,index) in tabone" :key='index'>
			<view style="height: 40rpx; width: 6rpx;border-radius: 0 5rpx 5rpx 0; background-color: #C59A76;position: absolute;left: 0;">
			</view>
			<view class="title">
				<view style="display: inline-block;float: left;">
					<text class="text" style="font-weight: 700;">消费ID:</text>
					<text>{{ item.record_num }}</text>
				</view>
				<view class="surplus">
					<text style="margin-right: 20rpx;color: #696969;">消费次数</text>
					<text style="color: #C59A76;">{{ item.mady_times }}</text>
				</view>
			</view>
			<view class="main">
				<!-- <view>
					<text class="text">理疗编号:</text>
					<text>{{ item.record_num }}</text>
				</view> -->
				<view>
					<text class="text">健康专员:</text>
					<text>{{ item.username }}</text>
				</view>
				<view>
					<text class="text">项目名称:</text>
					<text>{{ item.care_project_name }}</text>
				</view>
				<view>
					<text class="text">消费时间:</text>
					<text>{{ item.record_time }}</text>
				</view>
			</view>
		</view>
		<view class="none" v-if="tabone.length==0">
			<view class="img">
				<image src="../../../static/images/none.png" mode=""></image>
			</view>
			<view class="txt">
				暂无消费记录
			</view>
		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	import pakTool from "@/common/utils/utility.js"; // 调取接口
	export default {
		components: {
			uniIcons
		},
		mounted() {
			this.getData()
		},
		props: ['add', 'one_bottom'],
		watch: {
			one_bottom() {
				if (this.one_total == 0) {
					uni.showToast({
						title: '没有更多数据了',
						icon: 'none'
					})
					return
				}
				this.one_startIndex++;
				this.getData()
			}
		},
		data() {
			return {
				tabone: [],
				one_startIndex: 1,
				one_total: 0
			};
		},
		methods: {
			// 获取消费记录页数据
			getData() {
				let requestPak = pakTool.createRequestPak();
				requestPak.requestBody = {
					member_id: this.add,
					startIndex: this.one_startIndex,
					pagesize: 3
				};
				pakTool.request(this, "/madyApp/getMemberConsume", requestPak).then(res => {
					const {
						data
					} = res
					this.surplus = data.surplusCnt;
					this.consumption = data.totalConsumeCnt;
					this.recharge = data.totalDepositCnt;
					if (data.deopsit) {
						console.log(data.deopsit, 1)
						this.tabone = [...this.tabone, ...data.deopsit]
						console.log(this.tabone, 2)
						this.one_total = data.deopsit.length
					}
				})
			}
		}
	};
</script>

<style lang="less" scoped>
	.tabone {
		padding: 40rpx 30rpx 20rpx;
		font-size: 30rpx;

		.pressure {
			background-color: #ffffff;
			overflow: hidden;
			border-radius: 17rpx;
			padding: 30rpx;
			margin-bottom: 30rpx;
			box-shadow: 0px 2px 12px 6px rgba(133, 133, 133, 0.1);
			position: relative;

			.title {
				display: inline-block;
				vertical-align: middle;
				margin-bottom: 30rpx;
				width: 100%;

				.surplus {
					float: right;
				}
			}

			.text {
				margin-right: 15rpx;
			}

			.main {
				border-top: 2rpx solid #eee;
				padding-top: 30rpx;
				height: 220rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				position: relative;

				.text {
					color: #696969;
				}

				.arrow {
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
				}
			}

			.main>view {
				width: 90%;
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
</style>
