<template>
	<view class="yt-txl-container">
		<view class="search">
			<input type="text" @input="inputFunc" class="s-input" :placeholder="plac"/>
		</view>
			<view style="color: #696969;text-align: center;padding-top: 5rpx;">
				共{{total}}名客户
			</view>
		<view class="scroll" :style="index ? '' :'right:25upx'" v-if="datas.length!=0">
			<scroll-view :scroll-into-view="to" scroll-y style="width: 100%;height: 100%;">
				<view :id="o.key" v-for="(o,i) in resource" :key="i">
					<view class="p" >{{o.key}}</view>
					<view @click="clickFunc(item)" v-for="(item,index) in o.data" class="info" :key="index">
						<view class="icon" v-if="item.customer_header">
							<image :src="item.customer_header" mode=""></image>
						</view>
						<view :style="'background:'+color" class="icon" v-else>
							{{item[name].slice(0,1)}}
						</view>
						<view class="item">
							<text class="name">{{item[name]}}</text>
							<text class="post">{{item.departmentName}}</text>
						</view>
						<!-- <view class="per" v-if="!isAdmin">
							<text @click.stop="collect(item.employeeId,item.isTop)">{{item.isTop==1?'取消收藏':'收藏'}}</text>
						</view> -->
						<view class="per" v-if="!isAdmin" @click.stop="collect(item.employeeId,item.isTop)">
							<!-- <text @click.stop="collect(item.employeeId,item.isTop)">{{item.isTop==1?'取消收藏':'收藏'}}</text> -->
							<image style="width: 40rpx;height: 40rpx;" :src="item.isTop==1?'../../static/learn/good.png':'../../static/learn/no_good.png'" mode=""></image>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="flag" v-if="index && datas.length!=0">
			<scroll-view scroll-y="true" :show-scrollbar="false" class="flag-scroll" style="width: 100%;height: 100%;">
				<view @click="toFunc(o.key)" class="flag-key" v-for="(o,i) in resource" :key="i">
					{{o.key}}
				</view>
			</scroll-view>
		</view>
		<view class="none" v-if="no_ser==true || datas.length==0">
			<view class="img">
				<image src="../../static/images/none.png" mode=""></image>
			</view>
			<view class="txt">
				暂无数据
			</view>
		</view>
	</view>
</template>

<script>
	'use strict';

	let pinyin = new(require('./pinyin'))({
		charCase: 0
	});

	export default {
		props: {
			datas: {
				type: Array,
				default () {
					return [];
				}
			},
			name: {
				type: String,
				default () {
					return "name";
				}
			},
			index: {
				type: Boolean,
				default: true
			},
			color: {
				type:String,
				default:"#f44336"
			},
			isAdmin:{
				type:Boolean,
				default:false
			},
			// total:{
			// 	type:Number,
			// 	default:0
			// }
		},
		data() {
			return {
				resource: [],
				chars: [],
				to: "",
				cache:[],
				no_ser:false,
				clas:'s-input',
				plac:'姓名/电话',
				total:0,
				all:0
			};
		},
		watch: {
			datas(r) {
				this.total = r.length;
				this.all = r.length;//存储总数
				if (!(r instanceof Array)) {
					console.log("the props datas type must be array")
					return
				}
				this._parseData(r)
			}
		},
		methods: {
			toFunc(o) {
				this.to = o
			},
			clickFunc(item){
				this.$emit("ev",item)
			},
			inputFunc(r){ //搜索功能
				if(!r.detail.value) {
					this.resource = this.cache
					this.no_ser = false
					this.total = this.all
					console.log(this.resource)
					return
				}
				let temp = []
				console.log(this.cache,'cache')
				this.cache.forEach(o => {
					o.data.forEach(item =>{
						if(item[this.name].indexOf(r.detail.value) > -1 || item.departmentName.indexOf(r.detail.value) > -1){ // 匹配到
							// 确定当前这个元素的key是谁
							let key = o.key
							// 找到temp中的key
							let index = 0 //下标
							let find = false // 数据是否存在
							for(let d in temp){
								if(temp[d].key === o.key){
									index = d
									find = true
								}
							}
							if(find){ // 如果key已经存在，直接插入数据
								temp[index].data.push(item)
							} else { // 不存在初始化一个并存入
								temp.push({
									key:o.key,
									data:[item]
								})
							}
						}
					})
				})
				this.total = 0;
				temp.map(item=>{
					// console.log(item.data.length,'长度的')
					this.total += item.data.length
				})
				// console.log(total)
				// console.log(temp,2)
				if(temp.length==0){
					this.no_ser = true
					
				}else{
					this.no_ser = false
				}
				this.resource = temp
			},
			_type(val){
				return Object.prototype.toString.call(val).slice(8,-1).toLowerCase()
			},
			_parseData(r) {
				// 生成a-z的数组
				let data = [];
				this.chars = []
				for (let i = 65; i <= 90; i++) {
					let key = String.fromCharCode(i)
					data.push({"key":key,data:[]})
					this.chars.push(key)
				}
				if(this._type(r) === "array") {
					
					// 填充数据
					r.forEach(o => {
						// 找到char的位置
						data.forEach( (item,index) => {
							let a = this._parseChar(o[this.name || 'name'])
							if(item.key === a){
								data[index].data.push(o)
							}
						})
					})
				}
				// 组合最后数据并踢出没有匹配到a-z中的任意数据
				let finalData = []
				for (let i in data) {
					if(data[i].data.length > 0){
						finalData.push(data[i])
					}
				}
				this.resource = finalData
				this.cache = finalData
				finalData = null
			},
			_parseChar(name) {
				if (Object.prototype.toString.call(name).slice(8, -1) !== 'String') {
					console.error("name is not string")
					return
				}
				let chars = pinyin.getFullChars(name);
				return chars[0].toUpperCase()
			},
			collect(id,top){
				let son = {
					id:id,
					top:top
				}
				this.$emit('collection',son)
				// console.log(id)
				// console.log(top)
				// this.$parent.settop(top,id)
			}
			// foc(){
			// 	this.plac = ''
			// 	this.clas = 'n-input'
			// },
			// blu(){
			// 	this.plac = '姓名/电话'
			// 	this.clas = 's-input'
			// }
		},
		mounted() {
			this._parseData(this.datas)
		}
	};
</script>

<style lang="less" scoped>
	page {
		background: #f4f4f4;
	}

	.search {
		width: 100%;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.s-input {
		width: 700upx;
		height: 80upx;
		background: url('data:image/png;base64,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') 20upx center no-repeat #fff;
		background-size: 40upx;
		// text-indent: 80upx;
		padding-left: 90rpx;
		box-sizing: border-box;
		border-radius: 30rpx;
	}
	// .n-input {
	// 	width: 700upx;
	// 	height: 80upx;
	// 	background-size: 40upx;
	// 	// text-indent: 80upx;
	// 	background-color: #FFF;
	// 	padding-left: 90rpx;
	// 	box-sizing: border-box;
	// 	border-radius: 30rpx;
	// }

	.scroll {
		position: absolute;
		left: 25upx;
		top: 170upx;
		// right: 100upx;
		right: 25upx;
		bottom: 25upx;
		z-index: -1;
	}

	.p {
		position: sticky;
		top: 0;
		left: 0;
		background: #f7f7f7;
		font-size: 28upx;
		margin-bottom: 10upx;
		text-indent: 40upx;
		z-index: 99998;
		font-weight: bold;
	}

	.info {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 10upx;
		padding: 20upx 25upx;
		background: #fff;
	}
	.per{
		padding: 5rpx 15rpx;
		// color: #c59a76;
		// border: 1rpx solid #c59a76;
		margin-left: 190rpx;
		// font-size: 26rpx;
		// border-radius: 10rpx;
	}
	.icon {
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
		margin-right: 20upx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 30upx;
		font-weight: 700;
		overflow: hidden;
	}

	.item {
		height: 100upx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.flag {
		width: 70upx;
		position: absolute;
		top: 170upx;
		right: 25upx;
		bottom: 25upx;
		z-index: 999;
	}

	.flag-scroll {
		padding-top: 10upx;
		// z-idnex:99999;
	}

	.flag-key {
		padding: 0;
		margin: 0 auto 10upx auto;
		width: 30upx;
		height: 30upx;
		border-radius: 50%;
		color: #000;
		font-weight: bold;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20upx;
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
</style>
