<template>
	<view class="tabtwo">
		<!-- 血压数据 -->
		<view class="pressure" style="margin-top: 20rpx;" v-if="p_list.length!=0">
			<!-- 竖线 -->
			<view class="line"></view>
			<view class="title">
				血压数据
			</view>
			<view class="main">
				<view class="main_one" v-for="item in press_list" :key='item'>
					<text>{{item.date}}</text>
					<text>{{item.monitoring_time}}</text>
					<text style="margin-left: 30rpx;font-weight: 700;">{{item.content}}</text>
					<text class="unit">mmHg</text>
				</view>
				<!-- 查看更多 -->
				<view class="more" @click="press_watchmore" v-if="p_list.length>3">
					<view class="">
						{{press_open==true?"查看更多":"收起"}}
					</view>
					<view class="">
						<uni-icons :type="press_open==true?'arrowdown':'arrowup'" size="20" color="#C59A76"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<!-- 血氧数据 -->
		<view class="pressure" style="margin-top: 20rpx;" v-if="o_list.length!=0">
			<!-- 竖线 -->
			<view class="line"></view>
			<view class="title">
				血氧数据
			</view>
			<view class="main">
				<view class="main_one" v-for="item in oxygen_list" :key='item'>
					<text>{{item.date}}</text>
					<text>{{item.monitoring_time}}</text>
					<text style="margin-left: 30rpx;font-weight: 700;">{{item.content}}</text>
					<text class="unit">%</text>
				</view>
				<!-- 查看更多 -->
				<view class="more" @click="oxygen_watchmore" v-if="o_list.length>3">
					<view class="">
						{{oxygen_open==true?"查看更多":"收起"}}
					</view>
					<view class="">
						<uni-icons :type="oxygen_open==true?'arrowdown':'arrowup'" size="20" color="#C59A76"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<!-- 血糖数据 -->
		<view class="pressure" style="margin-top: 20rpx;" v-if="s_list.length!=0">
			<!-- 竖线 -->
			<view class="line"></view>
			<view class="title">
				血糖数据
			</view>
			<view class="main">
				<view class="main_one" v-for="item in sugar_list" :key='item'>
					<text>{{item.date}}</text>
					<text>{{item.monitoring_time}}</text>
					<text style="margin-left: 30rpx;font-weight: 700;">{{item.content}}</text>
					<text class="unit">mmol/L</text>
				</view>
				<!-- 查看更多 -->
				<view class="more" @click="sugar_watchmore" v-if="s_list.length>3">
					<view class="">
						{{sugar_open==true?"查看更多":"收起"}}
					</view>
					<view class="">
						<uni-icons :type="sugar_open==true?'arrowdown':'arrowup'" size="20" color="#C59A76"></uni-icons>
					</view>
				</view>
			</view>
		</view>
		<view class="none" v-if="p_list.length==0&&o_list.length==0&&s_list.length==0">
			<view class="img">
				<image src="../../../static/images/none.png" mode=""></image>
			</view>
			<view class="txt">
				暂无数据
			</view>
		</view>
	</view>
</template>
<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	import pakTool from "@/common/utils/utility.js"; // 调用接口
	export default {
		components: {
			uniIcons
		},
		watch: {
			tabtwo() {
				this.tabtwo.xueyaList.map(item=>{
					if(item.content!=''){
						this.p_list.push(item)
					}
				})
				this.press_list = this.p_list.slice(0, 3)
				this.tabtwo.xueyangList.map(item=>{
					if(item.content!=''){
						this.o_list.push(item)
					}
				})
				this.oxygen_list = this.o_list.slice(0, 3)
				this.tabtwo.xuetangList.map(item=>{
					if(item.content!=''){
						this.s_list.push(item)
					}
				})
				this.sugar_list = this.s_list.slice(0, 3)
			}
		},
		props: ["userId", 'tabtwo'],
		data() {
			return {
				press_list: [], //展示的血压数据
				p_list: [], //所有的血压数据
				press_open: true, //血压查看更多
				oxygen_list: [], //展示的血氧的数据
				o_list: [], //所有的血氧数据
				oxygen_open: true, //血氧查看更多
				sugar_list: [], //展示的血糖
				s_list: [], //所有的血糖
				sugar_open: true //血糖查看更多
			};
		},
		methods: {
			//血压查看更多
			press_watchmore() {
				//再次点击收起
				if (this.press_list == this.p_list) {
					this.press_list = this.p_list.slice(0, 3);
					this.press_open = !this.press_open;
					return;
				}
				//首次点击查看更多
				this.press_list = this.p_list;
				this.press_open = !this.press_open;
			},
			//血氧查看更多
			oxygen_watchmore() {
				//再次点击收起
				if (this.oxygen_list == this.o_list) {
					this.oxygen_list = this.o_list.slice(0, 3);
					this.oxygen_open = !this.oxygen_open;
					return;
				}
				//首次点击查看更多
				this.oxygen_list = this.o_list;
				this.oxygen_open = !this.oxygen_open;
			},
			//血糖查看更多
			sugar_watchmore() {
				//再次点击收起
				if (this.sugar_list == this.s_list) {
					this.sugar_list = this.s_list.slice(0, 3);
					this.sugar_open = !this.sugar_open;
					return;
				}
				//首次点击查看更多
				this.sugar_list = this.s_list;
				this.sugar_open = !this.sugar_open;
			}
		}
	};
</script>

<style lang="less" scoped>
	.tabtwo {
		padding: 30rpx;
		font-size: 32rpx;

		.line {
			display: inline-block;
			width: 6rpx;
			height: 65rpx;
			border-radius: 0 6rpx 6rpx 0;
			vertical-align: middle;
			position: relative;
			background-color: #c59a76;
		}

		.title {
			display: inline-block;
			margin-left: 24rpx;
			vertical-align: middle;
			font-weight: 700;
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

				text {
					padding: 20rpx 0;
					display: inline-block;
				}

				.more {
					padding: 10rpx 0 0 0;
					color: #c59a76;
					text-align: center;
				}
			}
		}

		.none {
			padding: 50rpx;
			font-size: 30rpx;
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
