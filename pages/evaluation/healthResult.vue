<template>
	<view class="healthresult">
		<view class="content">
			<view v-if="questionRecord !== undefined">
				<view class="createTime">上次评测时间：{{ createTime }}</view>
				<h3>您的体质测试结果</h3>
				<view class="qiun-charts">
					<canvas canvas-id="canvasRadar" id="canvasRadar" class="charts"></canvas>
				</view>
				<view v-for="(item,index) in intervenePlan" :key="index" class="health_content">
					<view class="health_tip health_tip_special" v-if="index === 0">
						<span v-show="IS.length !== 0">属于
							<text v-for="(i,index) in IS" :key="index">{{ i }} </text>
						</span>
					</view>
					<view class="health_tip_content">{{ item.bodyName === null?'无推荐':item.bodyName }} {{ item.score }}</view>
					<view class="gethealthy">
						<p>养生方案</p>
						<p class="more">
							<span @click="btnAll(index)" v-if="ifShowAll !== index">展开</span>
							<span @click="btnAll(-1)" v-else>收起</span>
						</p>
						<view class="cards">
							<span>{{item.planName === null?'无推荐':item.planName}}：</span>
							<view :class="ifShowAll === index ? 'normailheight':'specialheight'">{{item.planDetail === null?'无详情':item.planDetail}}</view>
						</view>
					</view>
				</view>
				<!-- <view class="back_of_next">
					<p v-show="backInfo !== ''" @click="evaluationInfo(-1)">上一次评测 {{backInfo}}</p>
					<p v-show="nextInfo !== ''" @click="evaluationInfo(1)">下一次评测 {{nextInfo}}</p>
				</view> -->
				<view class="health_tip health_tip_special" @click="retest">
					<span>重新测试</span>
				</view>
			</view>
			<view v-else class="noneMessage">无测评结果信息,请去填写！</view>
			<!-- <view class="health_code">
				<view class="content">
					<view class="code_left">
						<span>打开手机扫描右侧二维码</span>
						<view class="tip">
							扫码关注微信公众号。
						</view>
					</view>
					<view class="code_right">
						<img :src="codeImgUrl" alt="">
					</view>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
	import pakTool from "@/common/utils/utility.js"; // 调用接口
	import uCharts from "@/components/u-charts/u-charts.js"; // Ucharts雷达图插件
	var _self;
	var canvaRadar = null;

	export default {
		onLoad(option) {
			console.log(option);
			this.fk_customer = option.id; // 用户id
			this.pk_question = option.pk_question; // 答题数据id
		},
		onReady() {
			// 获取数据
			this.getData();
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.getServerData();
		},
		name: "health-result",
		data() {
			return {
				fk_customer: "", // 用户id
				pk_question: "", // 答题数据id
				createTime: "", // 创建时间
				ifShowAll: -1,
				IS: [], // 体质类型
				// IS: ['阳虚质', '气虚质'], // 体质类型
				questionRecord: {},
				intervenePlan: [],
				// intervenePlan: [{
				// 	bodyMemo: "平和体质",
				// 	bodyName: "平和质",
				// 	planDetail: "1. 平和质是什么意思平和体质的人，阴阳平衡，经络通畅，脏腑功能处于一种最佳的状态，最大的优势就是可以使人长寿2.我的体质是如何养成的平和质是什么意思平和体质的人，阴阳平衡，经络通畅，脏腑功能处于一种最佳的状态，最大的优势就是可以使人长寿2.我的体质是如何养成的",
				// 	planName: "平和体质调理方案",
				// 	result: "1",
				// 	score: "18",
				// 	type: "GENTLE"
				// }],
				index: 0,

				// 雷达图
				cWidth: "",
				cHeight: "",
				pixelRatio: 1,
				chartData: {
					categories: [
						"阳虚质",
						"气虚质",
						"平和质",
						"特禀质",
						"气郁质",
						"血瘀质",
						"湿热质",
						"痰湿质",
						"阴虚质"
					],
					series: [{
						// name: '',
						data: [10, 10, 10, 10, 10, 10, 10, 10, 10]
					}]
				}
			};
		},
		methods: {
			// 获得数据
			getData() {
				let requestPak = pakTool.createRequestPak();
				requestPak.requestBody = {
					// fk_customer: "3b2b2893-25c9-477d-b658-49d8c185466e",
					// pk_question_record: "794a91f8-6c5b-4873-929f-572dfa8fcb09"
					fk_customer: this.fk_customer, // 用户id
					pk_question_record: this.pk_question // 答题数据id
				};
				pakTool.request(this, "/tcm/getReportDetail", requestPak).then(res => {
					if (res.code == 200) {
						this.createTime = res.data.questionRecord.displayTime; // 创建时间
						this.intervenePlan = res.data.intervenePlan; // 诊断信息
						for (let index in res.data.intervenePlan) {
							this.IS.push(this.intervenePlan[index].bodyName);
							let i = this.chartData.categories.indexOf(this.IS[index]);
							this.chartData.series[0].data.splice(i, 1, 20);
							console.log(this.IS);
							console.log(i);
						}
					} else {
						uni.showToast({
							icon: "none",
							title: res.message
						});
					}
				});
			},

			// 雷达图
			getServerData() {
				let Radar = {
					categories: [],
					series: []
				};
				Radar.categories = _self.chartData.categories;
				Radar.series = _self.chartData.series;
				_self.showRadar("canvasRadar", Radar);
			},
			showRadar(canvasId, chartData) {
				canvaRadar = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: "radar",
					fontSize: 11,
					legend: {
						show: false // 是否显示图例标识
					},
					colors: ["#54E4A8"],
					background: "#F3F7F8",
					pixelRatio: _self.pixelRatio,
					animation: true,
					dataLabel: true,
					categories: chartData.categories,
					series: chartData.series,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					dataPointShape: false,
					extra: {
						radar: {
							max: 20, // 雷达数值的最大值
							opacity: 0.5 // 透明度
						}
					}
				});
			},
			// 展开/收起 按钮
			btnAll(index) {
				this.ifShowAll = index;
				console.log(`index: ${index}, this.ifShowAll: ${this.ifShowAll}`);
			},
			// 重新测试
			retest() {
				console.log(
					`用户id: ${this.fk_customer}, 答题数据id: ${this.pk_question}`
				);
				uni.redirectTo({
					url: "/pages/evaluation/evaluation?id=" +
						this.fk_customer + // 用户id
						"&pk_question=" +
						this.pk_question // 答题数据id
				});
			}
			// 动态生成二维码
			// compoileCode() {
			// 	let that = this
			// 	let fk = ''
			// 	let requestPak = this.public.createRequestPak()
			// 	// 通过微信菜单带openid直接进入
			// 	if (that.$route.query.pk_customer === undefined) {
			// 		requestPak.requestBody = {
			// 			openId: that.$route.query.openid
			// 		}
			// 		that.public.tcmAjax(requestPak, 'customer/getCustomerGuidFromWx', function(responseBody) {
			// 			// 请求pk_customer失败
			// 			if (responseBody.isSuccess === '1') {
			// 				// that.$vux.alert.show({
			// 				//   title: '提示',
			// 				//   content: responseBody.msg
			// 				// })
			// 			} else {
			// 				// success
			// 				// console.log('pk_Customer:' + responseBody.customer.pk_Customer)
			// 				fk = responseBody.customer.pk_Customer
			// 				that.public.qrAjax(fk, function(res) {
			// 					QRCode.toDataURL(`${res.qrURL}`)
			// 						.then(url => {
			// 							that.codeImgUrl = url
			// 							// console.log(that.codeImgUrl)
			// 						})
			// 						.catch(err => {
			// 							console.error(err)
			// 						})
			// 				})
			// 			}
			// 		})
			// 	} else {
			// 		// 通过app和体质监测和带pk_customer进入
			// 		requestPak.requestBody = {
			// 			openId: that.$route.query.pk_customer
			// 		}
			// 		that.public.qrAjax(that.$route.query.pk_customer, function(res) {
			// 			console.log(`ljz ${res.qrURL}`)
			// 			QRCode.toDataURL(`${res.qrURL}`)
			// 				.then(url => {
			// 					that.codeImgUrl = url
			// 				})
			// 				.catch(err => {
			// 					console.error(err)
			// 				})
			// 		})
			// 	}
			// },

			// 上一题 下一题
			// evaluationInfo(num) {
			// 	let that = this
			// 	this.index = num > 0 ? ++this.index : --this.index
			// 	let lists = JSON.parse(window.localStorage.getItem('listResult'))
			// 	lists['index'] = this.index
			// 	window.localStorage.setItem('listResult', JSON.stringify(lists))
			// 	console.log('zzl:' + lists['body'][this.index].pk_question_record)
			// 	this.$nextTick(function() {
			// 		that.getIndex()
			// 		that.IS = []
			// 		that.JB = []
			// 		that.QX = []
			// 		that.getData(lists['body'][that.index].pk_question_record)
			// 		console.log('healthResult nextTick' + this.pk_customer)
			// 	})
			// },
			// getIndex() {
			// 	setTimeout(() => {
			// 		let lists = JSON.parse(window.localStorage.getItem('listResult'))
			// 		if ((lists == null) || (lists['body'].length === 0) || (lists['body'][0].pk_Customer !== this.pk_customer)) {
			// 			this.backInfo = ''
			// 			this.nextInfo = ''
			// 		} else {
			// 			this.index = parseInt(lists['index'])
			// 			// 修改上一个记录时间
			// 			if (this.index === 0) {
			// 				this.backInfo = ''
			// 			} else {
			// 				this.backInfo = lists['body'][this.index].identification_time.substr(0, 10)
			// 			}
			// 			// 修改下一个记录时间
			// 			if (this.index === lists['body'].length - 1) {
			// 				this.nextInfo = ''
			// 			} else {
			// 				this.nextInfo = lists['body'][this.index].identification_time.substr(0, 10)
			// 			}
			// 		}
			// 	})
			// },
		}
	};
</script>

<style lang="scss">
	$healthResultFont: 30rpx;
	$customerlistFont: 15rpx;

	page {
		background-color: #f3f7f8;
	}

	.healthresult {
		.normailheight {
			height: initial;
			overflow: initial;
		}

		.specialheight {
			overflow: hidden;
			height: 180rpx;
		}

		.noneMessage {
			font-size: $healthResultFont;
			text-align: center;
			height: 150rpx;
			line-height: 150rpx;
			letter-spacing: 4rpx;
		}

		#canvas {
			transform: rotate(-10deg);
			position: absolute;
			left: -50rpx;
			top: -30rpx;
		}

		#bg_canvas {
			position: relative;
			// background-image: url("../assets/images/healthResult/bg_canvas.png");
			background-repeat: no-repeat;
			background-size: 100% 100%;
		}

		.canvas {
			text-align: center;
			margin-bottom: 100rpx;
		}

		.head_new {
			position: fixed;
			z-index: 1;
			width: 100%;
		}

		.content {

			// 评测时间
			.createTime {
				color: #000;
				text-align: center;
			}

			.health_content {
				margin-top: 50rpx;
			}

			.health_introduce {
				display: block;
				margin-top: -30rpx;
				margin-bottom: 50rpx;
				color: #4a4a4a;
				width: 100%;
				text-align: center;
				font-size: 23rpx;
			}

			h3 {
				font-size: 40rpx;
				color: #242424;
				text-align: center;
				font-weight: initial;
				margin: 0;
				padding-top: 30rpx;
			}

			.health_tip {
				width: 210rpx;
				height: 60rpx;
				margin: 0 auto;
				margin-top: 60rpx;
				margin-bottom: 30rpx;
				background-image: linear-gradient(-90deg, #e4c98f 0%, #c59a76 100%);
				// box-shadow: 2rpx 4rpx 6rpx 0 rgba(87, 223, 185, 0.49);
				color: #fff;
				font-size: 27rpx;
				border-radius: 27rpx;
				text-align: center;
				line-height: 60rpx;

				span {
					text {
						margin: 0 4rpx;
					}
				}
			}

			.health_tip_special {
				max-width: 80%;
				width: initial;
				height: initial;
			}

			.health_tip_content {
				margin-right: 55rpx;
				margin-left: 55rpx;
				margin-top: 20rpx;
				margin-bottom: 20rpx;
				font-size: 27rpx;
				line-height: 28rpx;
				color: #989797;
			}

			.gethealthy {
				width: 90%;
				background: rgba(255, 255, 255, 0.7);
				box-shadow: 4rpx 4rpx 6rpx 0 rgba(175, 175, 175, 0.3);
				border-radius: 10rpx;
				margin: 0 auto;
				margin-top: 34rpx;
				font-size: 27rpx;
				padding: 27rpx;

				p {
					width: 141rpx;
					height: 40rpx;
					margin-top: -10rpx;
					margin-left: 20rpx;
					font-size: 27rpx;
					color: #fff;
					text-align: center;
					line-height: 40rpx;
					background: #c59a76;
					border-radius: 78rpx;
					display: inline-block;
				}

				.more {
					float: right;
					background: transparent;
					color: #c59a76;
					border: 2rpx solid #c59a76;
				}

				.cards {
					padding: 0 20rpx;
					margin-bottom: 10rpx;

					span {
						font-weight: 600;
						color: #4a4a4a;
						display: block;
						margin: 10rpx 0;
					}

					view {
						color: #919191;
						line-height: 44rpx;
						text-align: justify;
					}
				}
			}

			.back_of_next {
				margin-top: 0 1.5rpx;
				margin-bottom: 1.5rpx;
				height: 0.8rpx;
				width: 100%;

				p:first-child {
					float: left;
					margin-left: 10rpx;
					width: 30%;
					height: 70rpx;
					line-height: 70rpx;
					text-align: center;
					border-radius: 35rpx;
					background-image: linear-gradient(-90deg, #63d0f4 0%, #54e4a8 100%);
					box-shadow: 6rpx 8rpx 14rpx 0 rgba(87, 223, 185, 0.5);
					color: #fff;
					font-size: $customerlistFont;
				}

				p:last-child {
					float: right;
					margin-right: 50rpx;
					width: 30%;
					height: 70rpx;
					line-height: 70rpx;
					text-align: center;
					border-radius: 35rpx;
					background-image: linear-gradient(-90deg, #63d0f4 0%, #54e4a8 100%);
					box-shadow: 6rpx 8rpx 14rpx 0 rgba(87, 223, 185, 0.5);
					color: #fff;
					font-size: $customerlistFont;
				}

				p {
					font-size: 25rpx !important;
					width: 40% !important;
				}
			}

			.health_code {
				padding: 30rpx 0;
				background-color: #ffffff;
				margin-top: 30rpx;

				.content {
					background-color: #f3f7f8;
					position: relative;
					background-clip: padding-box;
					padding: 20rpx;
					width: 92%;
					height: 180rpx;
					margin: 0 auto;
					// background-image: url("../assets/images/healthResult/bg_border.png");
					background-repeat: no-repeat;
					background-size: 100% 100%;
					/*border: 6px solid transparent;*/
					/*border-image: -webkit-linear-gradient(#63D0F4, #54E4A8) 30 30;*/
					/*border-image: -moz-linear-gradient(#63D0F4, #54E4A8) 30 30;*/
					/*border-image: linear-gradient(#63D0F4, #54E4A8) 30 30;*/
					border-radius: 8rpx;
					overflow: hidden;

					.code_left {
						float: left;
						margin-top: 8rpx;
						margin-left: 24rpx;
						font-size: 20rpx;

						span {
							display: inline-block;
							font-weight: 600;
							color: #4a4a4a;
							margin-bottom: 12rpx;
						}

						.tip {
							width: 390rpx;
							line-height: 28rpx;
							color: #4a4a4a;
						}
					}

					.code_right {
						width: 130rpx;
						height: 130rpx;
						float: right;
						border: 2rpx solid #000;
						margin-top: 20rpx;
						margin-right: 30rpx;

						img {
							width: 100%;
						}
					}
				}
			}
		}

		/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
		.qiun-charts {
			width: 750upx;
			height: 500upx;
		}

		.charts {
			width: 750upx;
			height: 500upx;
		}
	}
</style>
