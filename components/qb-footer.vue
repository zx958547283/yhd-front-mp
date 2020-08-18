<template>
	<view class="footer">
		<block v-for="(item, index) of items" :key="index" v-if="item.meta">
			<view class="footer_item" @tap.stop="jump(item.url)" hover-class="none">
				<view class='footer_item_icon' :class="choose == index ? 'is_select_icon_' + index: 'un_select_icon_' + index"></view>
				<text class='footer_item_text' :class="choose == index ? 'is_select_text': 'un_select_text'">{{item.name}}</text>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			const jxs = uni.getStorageSync('depts')
			return {
				items: [{
					name: "首页",
					url: '../home/home',
					meta:true
				},
				{
					name:'数据中心',
					url:'../jxs/jxs',
					// meta: jxs.length==0?false:true,
					meta: false
				},
				{
					name: "我的",
					url: '../mine/mine',
					meta:true
				}
				]
			}
		},
		props:{
			choose: {
				type: Number,
				default: -1
			}
		},
		onLoad(options) {},
		methods: {
			jump(url) {
				console.log(url)
				uni.switchTab({
				 		url: url
				 	});
				// if(this.$store.state.user_id) {
				// 	uni.switchTab({
				// 		url: url
				// 	});
				// } else {
				// 	if(url != '../home/home') {
				// 		uni.navigateTo({
				// 			url: '../blank'
				// 		})
				// 	}
				// }
			}
		}
	}
</script>

<style lang="scss">
	.gray_border {
		box-shadow: 0px -1px 0px 0px rgba(229,229,229,1);
	}
	.footer {
		position: fixed;
		bottom: 0;
		padding-bottom: env(safe-area-inset-bottom);
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		display: flex;
		justify-content: space-around;
		background-color: white;
		box-shadow: 0px -1rpx 1rpx 0px rgba(229,229,229,0.5);
		
		.footer_item {
			width: 212rpx;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.footer_item_icon {
				width: 46rpx;
				height: 46rpx;
			}
			.footer_item_text {
				font-size: 22rpx;
				line-height: 28rpx;
			}
		}
		.is_select_icon_0 {
			background: url("../static/tabbar/home_active.png") no-repeat;
			background-size: 100% 100%;
		}
		.un_select_icon_0 {
			background: url("../static/tabbar/home.png") no-repeat;
			background-size: 100% 100%;
		}
		.is_select_icon_1 {
			background: url("../static/tabbar/sj.png") no-repeat;
			background-size: 100% 100%;
		}
		.un_select_icon_1 {
			background: url("../static/tabbar/sj.png") no-repeat;
			background-size: 100% 100%;
		}
		.is_select_icon_2 {
			background: url("../static/tabbar/my_active.png") no-repeat;
			background-size: 100% 100%;
		}
		.un_select_icon_2 {
			background: url("../static/tabbar/mine.png") no-repeat;
			background-size: 100% 100%;
		}
		.is_select_text {
			color: #C59A76;
		}
		.un_select_text {
			color: #373434;
		}
	}
</style>
