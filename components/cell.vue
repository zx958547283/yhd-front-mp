<template>
	<view class="cell" :style="bor==1?'border-bottom:0;':''">
		<view class="cell_left" v-if="title">
			{{title}}
		</view>
		<view class="cell_right" v-if="num">
			{{num}}<text style="margin-left: 30rpx;" v-if="unit">{{unit}}</text>
		</view>
	</view>
</template>
<script>
	export default{
		props:['title','num','unit','bor']
	}
	
</script>

<style lang="less" scoped>
	.cell{
		padding: 30rpx 0;
		display: flex;
		margin: 0 30rpx;
		border-bottom: 2rpx solid #EEEEEE;
		.cell_left{
			flex: 1;
			font-weight: 700;
		}
		.cell_right{
			flex: 3;
		}
	}
</style>
