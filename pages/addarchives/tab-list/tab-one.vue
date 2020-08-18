<template>
	<view class="tabone">
		<!-- 顶部表单 -->
		<view class="tabone_top">
			<my-cell-input title="身高" :num='form.height' unit='cm' @inp='hei' ty='digit' pla='true'></my-cell-input>
			<my-cell-input title="体重" :num='form.heavy' unit='kg' @inp='hea' ty='digit' pla='true'></my-cell-input>
			<my-cell-input title="左眼" :num='form.left' @inp='left' ty='digit' pla='true'></my-cell-input>
			<my-cell-input title="右眼" :num='form.right' @inp='right' ty='digit' pla='true'></my-cell-input>
			<my-cell-input title="出生日期" :num='form.date' write='100' able="true"></my-cell-input>
			<my-cell-input title="农历生日" :num='form.lunar' write='100' able="true"></my-cell-input>
			<my-cell-input title="身份证号" :num='form.card' write='100' able='true'></my-cell-input>
			<my-cell-input title="地址" :num='form.address' write='100' able='true'></my-cell-input>
			<my-cell-input title="邮箱" :num='form.mail' write='100' able='true' bor='1'></my-cell-input>
		</view>
		<view class="tabone_mid">
			<!-- 治疗史 -->
			<view style="font-weight: 700;">治疗史</view>
			<view style="display: flex;margin: 30rpx 0;">
				<label class="radio"  @click="treat_radio(0)">
					<image :src="treat_sure==0?active:none" class="radio_man"></image> 无
				</label>
				<label class="radio" @click="treat_radio(1)">
					<image :src="treat_sure==1?active:none"></image> 有
				</label>
			</view>
			<view class="area" v-if="treat_sure==1">
				<textarea placeholder="请输入治疗史" auto-height v-model="treat" />
				</view>
			<!-- 药物使用史 -->
			<view style="font-weight: 700;">药物使用史</view>
			<view style="display: flex;margin: 30rpx 0;">
				<label class="radio" @click="medicinal_radio(0)">
					<image :src="medicinal_sure==0?active:none" class="radio_man" ></image> 无
				</label>
				<label class="radio" @click="medicinal_radio(1)">
					<image :src="medicinal_sure==1?active:none" ></image> 有
				</label>
			</view>
			<view class="area" v-if="medicinal_sure==1">
				<textarea placeholder="请输入药物使用史" auto-height v-model="medicinal" />
				</view>
			<!-- 过敏史 -->
			<view style="font-weight: 700;">过敏史</view>
			<view style="display: flex;margin: 30rpx 0;">
				<label class="radio" @click="allergy_radio(0)">
					<image :src="allergy_sure==0?active:none" class="radio_man" ></image> 无
				</label>
				<label class="radio" @click="allergy_radio(1)">
					<image :src="allergy_sure==1?active:none" ></image> 有
				</label>
			</view>
			<view class="area" v-if="allergy_sure==1">
				<textarea placeholder="请输入过敏史" auto-height v-model="allergy" />
				</view>
			<view style="font-weight: 700;">既往病史</view>
			<view style="margin: 20rpx 0;" class="ill">
				<view class="ill_radio"  v-for="(item,index) in ill_list" :key='index'  @click="ill_radio(item.def_list_id)"><image :src="ill_sure.includes(item.def_list_id)?active:none" ></image>{{item.name}}</view>
			</view>
			<view class="area" v-if="ill_sure.includes(20200609)">
				 <textarea placeholder="请输入既往病史" auto-height v-model="other_ill"/>
			</view>
		</view>
		<view class="tabone_btm">
			<view class="">
				<view class="" style="font-weight: 700;">
					手术史
				</view>
				<view class="quil">
					 <textarea  maxlength=50 @input = "inp_operation" v-model="operation" :placeholder="place==true?'':'请输入您的内容'"/>
					 <view class="num"><span :class="remnant_operation==0?'grey':''">{{remnant_operation}}</span>/50</view>
				</view>
			</view>
			<view style="margin-top: 30rpx;">
				<view class="" style="font-weight: 700;">
					家族史
				</view>
				<view class="quil">
					 <textarea  maxlength=50 @input = "inp_family" v-model="family" :placeholder="place==true?'':'请输入您的内容'"/>
					 <view class="num"><span :class="remnant_family==0?'grey':''">{{remnant_family}}</span>/50</view>
				</view>
			</view>
			<view style="margin-top: 30rpx;">
				<view class="" style="font-weight: 700;">
					备注
				</view>
				<view class="quil">
					 <textarea  maxlength=50 @input = "inp_remarks" v-model="remarks" :placeholder="place==true?'':'请输入您的内容'"/>
					 <view class="num"><span :class="remnant_remarks==0?'grey':''">{{remnant_remarks}}</span>/50</view>
				</view>
			</view>
			<view style="margin-top: 30rpx;">
				<view class="" style="font-weight: 700;">
					其他情况
				</view>
				<view class="quil">
					 <textarea  maxlength=50 @input = "inp_others" v-model="others" :placeholder="place==true?'':'请输入您的内容'"/>
					 <view class="num"><span :class="remnant_others==0?'grey':''">{{remnant_others}}</span>/50</view>
				</view>
			</view>
			<button type="primary" @click="save" :disabled="disabled">保存</button>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="pop" @click="log">
				<image src="../../../static/images/perfect.png" mode=""></image>
				<view class="sus_txt">
					客户添加成功
				</view>
				<view class="con_txt">
					是否需要继续健康数据采集?
				</view>
				<view class="btm">
					<view class="yes" @click.stop="jump">
						去采集
					</view>
					<view class="no" @click.stop="close">
						不需要
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>
<script>
	import MyCellInput from '@/components/cellinput.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import pakTool from '../../../common/utils/utility.js'
	export default{
		components:{
			MyCellInput,
			uniPopup
		},
		props:['add','fix','userId','health_id','exc'],
		onLoad() {
			console.log(15555)
			// console.log(1)
			//  this.getill()
		},
		mounted() {
			this.getill()
			if(this.add&&!this.userId){
				console.log(this.add)
				this.form = this.$store.state.form
				console.log('第一次添加执行')
				return
			}
			if(this.userId){
				this.getill()
				this.getData()
				this.id = this.health_id
				this.execKey = this.exc
				this.add = this.userId
				// this.form = this.$store.state.form
				console.log('编辑执行')
				return
			}
		},

		data(){
			return {
				form:{
					height:'',
					heavy:'',
					left:'',
					right:'',
					// date:'',
					// card:'',
					// address:'',
					// mail:'',
				},
				allergy_sure: null, //过敏史,
				ill_sure: [], //病史 传后台
				treat_sure:null, //治疗史
				medicinal_sure:null,//药物使用史
				none: '../../../static/images/danxuan-2@2x.png',//单选没选中
				active:'../../../static/images/system-complete@2x.png',//单选选中
				ill_list:[],
				allergy:'',//过敏史 有则是文字 无则是空
				treat:'',// 治疗史文字
				medicinal:'',//药物使用史文字
				operation:'',//手术史文字
				remnant_operation:0,//手术史字数限制
				family:'',//家族史文字
				remnant_family:0,//家族史字数限制
				remarks:'',//备注文字
				remnant_remarks:0,//备注文字限制
				others:'',//其他情况文字
				remnant_others:0,//其他情况文字限制
				other_ill:'',//其他病史 有则是文字 没有则是空
				id:'',//修改用
				execKey:'',
				send_ill_sure:'',
				place:false,
				disabled: false // 防抖
			}
		},
		methods:{
			//过敏史选择单选
			allergy_radio(e){
				this.allergy_sure = e
			},
			//治疗史选择单选
			treat_radio(e){
				this.treat_sure = e
			},
			//药物使用史单选
			medicinal_radio(e){
				this.medicinal_sure = e
			},
			//病史checkbox
			ill_radio(item){
				if(this.ill_sure.indexOf(item)==-1){
					this.ill_sure.push(item)
					
				}else{
					this.ill_sure.splice(this.ill_sure.indexOf(item),1)
				}
			},
			//手术史字数限制
			inp_operation(e){
				this.remnant_operation = e.detail.value.length
			},
			//家族史字数限制
			inp_family(e){
				this.remnant_family = e.detail.value.length
			},
			inp_remarks(e){
				this.remnant_remarks = e.detail.value.length
			},
			//其他情况字数限制
			inp_others(e){
				this.remnant_others = e.detail.value.length
			},
			hei(e){
				this.form.height = e
			},
			hea(e){
				this.form.heavy=  e
			},
			left(e){
				this.form.left = e
			},
			right(e){
				this.form.right = e
			},
			//保存
			save(){
				this.send_ill_sure = JSON.parse(JSON.stringify(this.ill_sure)) //复制
				var num = this.send_ill_sure.indexOf(20200609)
				if(num>-1){
					this.send_ill_sure.splice(num,1)
					console.log(this.ill_sure,'ill')
					console.log(this.send_ill_sure,'send')
				}else{
					this.other_ill = ''
				}
				// 过敏史其他判断
				if(this.allergy_sure===0){
					this.allergy=''
				}
				// 治疗史其他判断
				if(this.treat_sure===0){
					this.treat=''
				}
				//药物使用史判断
				if(this.medicinal_sure===0){
					this.medicinal = ''
				}
				console.log(this.ill_sure)
				let requestPak = pakTool.createRequestPak();
					requestPak.requestBody = {
						health_id:this.id,//新增则为空
						member_id:this.add,
						execKey:this.execKey,
						height:this.form.height,
						weight:this.form.heavy,
						left_eye:this.form.left,
						right_eye:this.form.right,
						irritability:this.allergy,//过敏
						medicinal:this.medicinal,//药物使用
						cure:this.treat,//治疗史
						ill: this.send_ill_sure.toString(), //既往病史
						operation:this.operation,//手术史
						family:this.family,//家族史
						comment:this.remarks, //备注
						other_ill:this.other_ill ,//其他病史
						others:this.others//其他情况
					}
					if(this.disabled){
						return
					}
					this.disabled = true;
					pakTool.request(this,'/madyApp/saveMemberHealthRecord',requestPak).then(res=>{
					const {data,code}= res
					if(code==200){
						if(this.id!=''){
							uni.showToast({
								icon:"success",
								title:'修改成功',
								success: () => {
									uni.redirectTo({
										url:'/pages/archives/archives?add='+this.add
									})
								}
							})
							return
						}
						this.place = true
						if(this.place){
							this.family = ''
							this.operation = ''
							this.remarks = ''
							this.medicinal = ''
						}
							this.$refs.popup.open()
					}else{
						uni.showToast({
							icon:"none",
							title:'保存失败'
						})
						this.disabled = false
					}
				})
				
				
			},
			// 获取既往病史
			getill(){
				let requestPak = pakTool.createRequestPak();
					requestPak.requestBody = {
		
					}
				pakTool.request(this,'/madyApp/getAllHistoryIll',requestPak).then(res=>{
					const {data}= res 
					this.ill_list = data
					this.ill_list.push({name:'其他',def_list_id:20200609})
				})
				
			},
			// 保存后跳转健康采集
			jump(){
					uni.redirectTo({
						url:'/pages/collection/collection?add='+this.add
					})
				
			},
			// 获取用户之前数据
			getData() {
			      let requestPak = pakTool.createRequestPak();
			      requestPak.requestBody = {
			        member_id: this.userId
			      };
			      pakTool.request(this,"/madyApp/getMemberHealthRecord",requestPak).then(res=>{
					  const { data } = res
					   // 列表信息
					   var m = data.memberInfo
					   this.form.height = m.height  
					   this.form.heavy = m.weight 
					   this.form.left = m.left_eye 
					   this.form.right = m.right_eye
					   this.form.date = m.birthday
					   this.form.lunar = m.lunar
					   this.form.card = m.id_card
					   this.form.address = m.address
					   this.form.mail = m.email
					  					// 备注信息
					   this.family = data.healthHistory.family;
					   this.operation = data.healthHistory.operation;
					   this.remarks = data.healthHistory.comment;
					   this.others = data.healthHistory.others;
					   this.remnant_family = data.healthHistory.family.length;
					   this.remnant_operation = data.healthHistory.operation.length;
					   this.remnant_remarks = data.healthHistory.comment.length;
					   this.remnant_others = data.healthHistory.others.length;
					   //选择框
					   data.illHistory.map(item=>{
					  					  this.ill_sure.push(item.id)
					   })
					  // 过敏史判定
					  if(data.healthHistory.irritability==''){
					  					 this.allergy_sure = 0
					  }else{
					  					 this.allergy_sure = 1;
					  					 this.allergy = data.healthHistory.irritability
					  }
					  // 治疗史判定
					  if(data.healthHistory.cure==''){
					  					 this.treat_sure = 0
					  }else{
					  					 this.treat_sure = 1;
					  					 this.treat = data.healthHistory.cure
					  }
					  // 药物使用史判定
					  if(data.healthHistory.medicinal==''){
					  					 this.medicinal_sure = 0
					  }else{
					  					 this.medicinal_sure = 1;
					  					 this.medicinal = data.healthHistory.medicinal
					  }
					  
					  //其他病史判断
					  if(data.healthHistory.other_ill!=''){
					  					 this.ill_sure.push(20200609)
					  					 this.other_ill = data.healthHistory.other_ill
					  }
				  })
			     
			    },
				//关闭弹窗
				close(){
					uni.redirectTo({
						url:'/pages/archives/archives?add='+this.add
					})
				}
		}
	}
	
</script>

<style lang="less" scoped>
	.tabone{
		font-size: 32rpx;
		.tabone_top{background-color: #FFFFFF;}
		.tabone_mid{
			padding: 30rpx;
			margin-top: 20rpx;
			background-color: #FFFFFF;
			.radio {
				flex: 0 0 33%;
				image{
					width: 36rpx;
					height: 36rpx;
					vertical-align: middle;
					margin-right: 20rpx;
				}
			}
			.ill {
				display: flex;
				justify-content: space-between;
				width: 100%;
				flex-wrap: wrap;
				.ill_radio {
					flex: 0 0 33%;
					margin: 10rpx 0;
					image{
						width: 36rpx;
						height: 36rpx;
						vertical-align: middle;
						margin-right: 20rpx;
					}
				}
			}
			.area {
				margin-bottom: 30rpx;
				textarea{
						padding: 30rpx;
						width: auto;
						background-color: #F7F7F7;
					}
				}
			}
			.tabone_btm{
				padding: 30rpx;
				margin-top: 20rpx;
				background-color: #FFFFFF;
				.quil{
					margin-top:30rpx;
					height: 210rpx;
					background-color: #F7F7F7;
					box-sizing: border-box;
					padding: 30rpx;
					position: relative;
					border-radius: 10rpx;
					textarea{
						height: 100%;
						width: 100%;
						font-size: 28rpx;
					}
					.num {
						position: absolute;
						right: 3%;
						bottom: 5%;
						font-size: 28rpx;
						.grey{
							color: #C2C2C2;
						}
					}
				}
				} 
				button {
					width: 90%;
					margin: 0 auto;
					height: 80rpx;
					line-height: 80rpx;
					border-radius: 40rpx;
					background-color: #C59A76;
					margin-top: 60rpx;
				}
				//弹窗
				.pop  {
					width: 605rpx;
					height: 580rpx;
					background-color: #FFFFFF;
					position: relative;
					border-radius: 20rpx;
					display: table;
					image {
						width: 206rpx;
						height: 206rpx;
						border-radius: 50%;
						position: absolute;
						top: 0;
						left: 50%;
						transform: translate(-50%,-10%);
					}
					.sus_txt{
						font-size: 36rpx;
						color: #C59A76;
						position: absolute;
						top: 40%;
						left: 50%;
						transform: translate(-50%,-50%);
					}
					.con_txt{	
						color: #333333;
						margin: 50% auto 0;
						text-align: center;
					}
					.btm {
						display: flex;
						justify-content: space-around;
						padding: 0 30rpx;
						margin-top: 96rpx;
						.yes{
							padding: 18rpx 60rpx;
							display: inline-block;
							background-color: #C59A76;
							color: white;
							border-radius: 44rpx;
						}
						.no {
							padding: 18rpx 60rpx;
							background-color: #FFFFFF;
							display: inline-block;
							color: #C59A76;
							border-radius: 44rpx;
							box-sizing: border-box;
							border: 2rpx solid #C59A76;
						}
					}
				}
	}
</style>
