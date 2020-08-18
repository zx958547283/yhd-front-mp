<template>
	<view class="cell" :style="bor==1?'border-bottom:0;':''">
		<view class="cell_left" v-if="title">
			{{title}}
		</view>
		<view class="cell_right">
			<input type="text" :value="num" :placeholder="pla?'请输入':' '" @input="change" :class="write==100?'long':'short'" :disabled="able" :type="ty"/><text v-if="unit">{{unit}}</text>
		</view>
	</view>
</template>
<script>
	export default{
		props:['title','num','unit','write','able','ty','pla','bor'],
		data(){
			return {
				da:''
			}
		},
		methods:{
			change(e){
				this.$emit('inp',e.detail.value)
			}
		},
		
	}
	
</script>

<style lang="less" scoped>
	.cell{
		font-size: 32rpx;
		 display: -webkit-flex; 
		display: flex;
		margin: 0 30rpx;
		border-bottom: 2rpx solid #EEEEEE;
		.cell_left{
			-webkit-flex: 1;
			flex: 1;
			font-weight: 700;
			height: 80rpx;
			line-height: 80rpx;
		}
		.cell_right{
			-webkit-flex: 3;
			flex: 3;
			.short {
				display: inline-block;
				width: 25%;
				height: 80rpx;
				vertical-align: middle;
			}
			.long {
				display: inline-block;
				width: 100%;
				height: 80rpx;
				vertical-align: middle;
			}
			text{
				height: 80rpx;
				line-height: 80rpx;
				display: inline-block;
				
			}
		}
	}
</style>
