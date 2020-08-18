<template>
	<view class="symptom">
		<view class="tabone_mid">
			<view class="symptom">
				<view class="symptom_radio" v-for="item in symptom_list" :key="item.id" @click="symptom_radio(item.id, item.name)">
					<image :src="symptom_sure.includes(item.id) ? active : none"></image>
					<text class="cal_width">{{ item.name }}</text>
				</view>
			</view>
			<!-- <view class="quil">
				<textarea maxlength="50" @input="inp_remarks" v-model="remarks" placeholder="请输入其他症状~" />
				<view class="num">
					<span :class="remnant_remarks == 0 ? 'grey' : ''">{{ remnant_remarks }}</span>
					/50
				</view>
			</view> -->
			<button type="primary" @click="save">保存</button>
		</view>
	</view>
</template>
<script>
import pakTool from '../../common/utils/utility.js';
import Pinyin from '../../common/utils/index.js'
export default {
	onLoad(option) {
		this.getlist();
		console.log(option);
		if (option.mady.length != 0) {
			this.symptom_sure = option.mady.split(',');
			this.symptom_name = option.name.split(',');
			console.log(this.symptom_sure, '传过来的');
		}
	},
	data() {
		return {
			symptom_sure: [], //病史
			none: '../../static/images/danxuan-2@2x.png', //单选没选中
			active: '../../static/images/system-complete@2x.png', //单选选中
			symptom_list: [],
			symptom_name: [], //名称
			remarks: '', // 备注文字
			remnant_remarks: 0 // 备注文字限制
		};
	},
	methods: {
		// 病史checkbox
		symptom_radio(index, name) {
			if (this.symptom_sure.indexOf(index) == -1) {
				this.symptom_sure.push(index);
				this.symptom_name.push(name);
			} else {
				this.symptom_sure.splice(this.symptom_sure.indexOf(index), 1);
				this.symptom_name.splice(this.symptom_name.indexOf(name), 1);
			}
		},

		// 备注
		inp_remarks(e) {
			this.remnant_remarks = e.detail.value.length;
		},

		// 保存
		save(e) {
			console.log('保存', this.symptom_name);
			var obj = {
				symptom: this.symptom_name, // 传回的名字
				symptom_id: this.symptom_sure, //传回的id
				remarks: this.remarks
			};
			console.log(obj);
			//将选中的标签传给上级页面
			var pages = getCurrentPages();
			var currPage = pages[pages.length - 1]; //当前页面
			var prevPage = pages[pages.length - 2]; //上一个页面
			// #ifdef H5
			prevPage.target = obj;
			prevPage.back = 1;
			// #endif
			// #ifndef H5 
			prevPage.$vm.target = obj;
			prevPage.$vm.back = 1;
			// #endif
			uni.navigateBack({ delta: 1 });
		},
		// 获取症状
		getlist() {
			let requestPak = pakTool.createRequestPak();
			requestPak.requestBody = {
				member_id: this.$store.state.wx_memberId
			};
			pakTool.request(this, '/madyApp/getStartCarePlan', requestPak).then(res => {
				res.data.maladyList.map((item, index) => {
					this.symptom_list.push({ name: item.name, id: item.id });
				});
				// a~z 排序
				// this.symptom_list.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
				// console.log(this.symptom_list )
				this.pinyinSort(this.symptom_list)
			});
		},
		pinyinSort(name) {
		  var pinyinArray = new Array()
		  for (let bukn = 0; bukn < name.length; bukn++) {
		    var o = new Object()
		    var ken = Pinyin.getSpell(name[bukn].name, function (charactor, spell) {
		      // console.log(charactor,spell);
			  if(charactor=='尿'||charactor=='咳'){
				  return spell[1];
				  }
		      return spell[0];
		    });
		    o.name = name[bukn].name
			o.id = name[bukn].id
		    o.pinyin = ken.split(',').join('')
		    pinyinArray.push(o)
		  }
			for(let i=0;i<pinyinArray.length-1;i++){
			        for(let j=0;j<pinyinArray.length-1-i;j++){
			            if(pinyinArray[j].pinyin > pinyinArray[j+1].pinyin){
			                var temp=pinyinArray[j];
			                pinyinArray[j]=pinyinArray[j+1];
			                pinyinArray[j+1]=temp;
			            }
			        }
			    }
			// console.log(pinyinArray)
			this.symptom_list = pinyinArray
		}
	}
};
</script>

<style lang="less" scoped>
.symptom {
	font-size: 30rpx;
	.tabone_mid {
		padding: 30rpx;
		background-color: #ffffff;
		.radio {
			flex: 0 0 33%;
			image {
				width: 50rpx;
				height: 50rpx;
				vertical-align: middle;
				margin-right: 20rpx;
			}
		}
		.symptom {
			display: flex;
			justify-content: space-between;
			width: 100%;
			flex-wrap: wrap;
			font-size: 30rpx;
			.symptom_radio {
				flex-basis: 50%;
				margin: 20rpx 0;
				image {
					width: 50rpx;
					height: 50rpx;
					vertical-align: middle;
					margin-right: 20rpx;
				}
			}
		}
		.area {
			margin-bottom: 30rpx;
			textarea {
				padding: 30rpx;
				background-color: #f7f7f7;
			}
		}
		.cal_width {
			width: calc(100% - 100rpx);
			display: inline-block;
			vertical-align: middle;
			font-size: 32rpx;
		}
		.quil {
			margin-top: 30rpx;
			height: 210rpx;
			background-color: #f7f7f7;
			box-sizing: border-box;
			padding: 30rpx;
			position: relative;
			border-radius: 10rpx;
			textarea {
				height: 100%;
				width: 100%;
				font-size: 28rpx;
			}
			.num {
				position: absolute;
				right: 3%;
				bottom: 5%;
				font-size: 28rpx;
				.grey {
					color: #c2c2c2;
				}
			}
		}
		button {
			width: 90%;
			margin: 0 auto;
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 40rpx;
			background-color: #c59a76;
			margin-top: 60rpx;
		}
	}
}
</style>
