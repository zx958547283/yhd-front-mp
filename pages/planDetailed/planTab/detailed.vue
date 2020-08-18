<template>
	<view class="detailed">
		<view class="body-info">
			<view class="option" v-if="first">
				<view class="edit" @click="clickEdit">
					<image src="/static/images/edit.png" mode="aspectFit" style="width:22rpx; height:22rpx;"></image>
					<text>编辑</text>
				</view>
				<view class="delete" @click="clickDelete">
					<uni-icons type="trash" color="#C59A76" size="32"></uni-icons>
					<text>删除</text>
				</view>
			</view>
			<!-- 项目类型 -->
			<view class="box-style">
				<uni-list>
					<uni-list-item title="" note="">
						<view class="flex" @click="projectChange" style="border-bottom: 0;">
							<i></i>
							<view style="font-weight: 700;">项目类型<text class="required">*</text></view>
							<view class="text">
								{{ projectType }}
							</view>
							<uni-icons type="arrowright" color="#858585" size="32"></uni-icons>
						</view>
					</uni-list-item>
				</uni-list>
			</view>
			<!-- 症状 -->
			<view class="box-style">
				<uni-list>
					<uni-list-item title="" note="">
						<view class="flex" style="margin-bottom: 10rpx;">
							<i></i>
							<view style="font-weight: 700;">症状<text class="required">*</text></view>
							<view class="text">
							</view>
							<uni-icons type="arrowright" color="#858585" size="32"></uni-icons>
						</view>
					</uni-list-item>
					<view>
						<view class="symptom">
							<text v-for="(item,index) in target.symptom" :key='index' :style="item.length>10?'width:100%;':''">
								{{ item }}
							</text>
							<text v-if="target.remarks != '' ? true : false">
								{{ target.remarks }}
							</text>
						</view>
					</view>
				</uni-list>
			</view>
			<!-- 理疗流程 -->
			<view class="box-style">
				<uni-list>
					<uni-list-item title="" note="">
						<view class="flex">
							<i></i>
							<view style="font-weight: 700;">理疗流程</view>
							<view class="text">
							</view>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view style="width:100%; padding-bottom:30rpx; border-bottom: 1rpx solid #eeeeee;">
							<view class="head">通</view>
							<text>以华佗夹脊穴为核心的经络疏通</text>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view style="width:100%; padding-bottom:30rpx; border-bottom: 1rpx solid #eeeeee;">
							<view class="head">排</view>
							<text>推拿、按揉背部膀胱经、肩胛部及手少阳三焦经排出瘀堵的寒湿</text>
						</view>
					</uni-list-item>
					<uni-list-item v-if='acupoint_list.length!=0'>
						<view style="width:100%; padding-bottom:30rpx; border-bottom: 1rpx solid #eeeeee;">
							<view class="head" style="margin: 30rpx 0 20rpx 0;">调</view>
							<view class="choice">
								<view class="choice_radio" v-for="(item,index) in acupoint_list" :key='index'>
									{{ item }}
								</view>
							</view>
						</view>
					</uni-list-item>
					<uni-list-item v-if='parts_list.length!=0'>
						<view style="width:100%; padding-bottom:30rpx; border-bottom: 1rpx solid #eeeeee;">
							<view class="head">补</view>
							<uni-list title="" note="" >
								<view style="color: #333333; font-size: 30rpx; font-weight: 700;">贴敷部位</view>
							</uni-list>
							<view class="choice">
								<view class="choice_radio" v-for="(item,index) in parts_list" :key='index'>
									{{ item }}
								</view>
							</view>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view style="width:100%;">
							<view class="head" v-if="target.symptom.length != 0 ? true : false">养</view>
							<uni-list title="" note="" v-if='product_list.length!=0'>
								<view style="color: #333333; font-size: 30rpx; font-weight: 700;">调理产品</view>
							</uni-list>
							<view style="width:100%;">
								<view class="choice">
									<view class="choice_radio" v-for="(item,index) in product_list" :key='index' style="padding:10rpx 0;">
										{{ item }}
									</view>
								</view>
							</view>
						</view>
					</uni-list-item>
					<!-- 理疗建议 -->
					<uni-list-item>
						<view style="width:100%; padding-bottom:30rpx;">
							<uni-list title="" note="">
								<view style="color: #333333; font-size: 30rpx; font-weight: 700;">理疗建议<text style="color: #ff3b30;">*</text></view>
							</uni-list>
							<view style="width:100%;">
								<view class="quil">
									<textarea maxlength=200 @input="inp_remarks" v-model="remarks" :placeholder="pla==true?'':'请输入理疗建议~'" />
									<view class="num">
										<span :class="remnant_remarks==0?'grey':''">{{remnant_remarks}}</span>/200
									</view>
								</view>
							</view>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view style="width:100%; padding-bottom:30rpx;">
							<uni-list title="" note="">
								<view style="color: #333333; font-size: 30rpx; font-weight: 700;margin-bottom: 20rpx;">开始时间</text></view>
							</uni-list>
							<view style="display: inline-block;width: 45%;float: left;text-align: center;">
									  <view class="">
									  	<!-- <view class="title">	  
									  		日期
									  	</view> -->
									  	<view class="select_date">
									  		<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
									  			<view class="date" style="padding: 5rpx;border: 2rpx solid #c59a76;color: #c59a76;border-radius: 10rpx;">{{date}}</view> 
									  		</picker>
									  	</view>
									  </view>      	   
							</view>
							<view style="display: inline-block;width: 45%;float: right;text-align: center;">
									  <view class="">
									  	<!-- <view class="title">	  
									  		时间
									  	</view> -->
									  	<view class="select_date">
											<picker mode="time" :value="time" @change="bindTimeChange">
											    <view class="uni-input" style="padding: 5rpx;border: 2rpx solid #c59a76;color: #c59a76;border-radius: 10rpx;">{{time}}</view>
											</picker>
									  	</view>
								</view>     	   
							</view>
						</view>
					</uni-list-item>
				</uni-list>
			</view>
			<!-- 上传照片 -->
			<view class="box-style">
				<uni-list>
					<uni-list-item title="" note="">
						<view class="flex">
							<i></i>
							<view style="font-weight: 700;">上传照片<text class="required">*</text></view>
						</view>
					</uni-list-item>
					<uni-list-item>
						<view class="photo" @click="upload">
						       <image :src="photo" mode="" v-if="photo!=''" style="width: 100%;height: 100%;"></image>
						       <view class="squ" v-if="photo==''">
						        <image src="../../../static/images/camera.png" mode="" class="ppp"></image>
						        <view class=" tianjia">添加照片</view>
						       </view>
						      </view>
					</uni-list-item>
				</uni-list>
			</view>
			<!-- 提交记录 -->
			<button class="save" @click="save" v-if="first" :disabled="disabled">提交记录</button>
			<button class="save" @click="save" v-else :disabled="disabled">添加新记录</button>
		</view>
		<!-- 弹窗 -->
		<uni-popup ref="popdel" type="center">
			<view class="pop" >
				<image src="../../../static/images/delete.png" mode=""></image>
				<view class="sus_txt">
					删 除
				</view>
				<view class="con_txt">
					确定要对此方案进行删除吗？
				</view>
				<view class="btm">
					<view class="yes" @click.stop="del_sure">
						确定
					</view>
					<view class="no" @click.stop="close">
						取消
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 消费展示弹窗 -->
		<uni-popup ref="popup" type="center">
			<view class="pop">
				<image src="../../../static/images/perfect.png" mode=""></image>
				<view class="sus_txt">
					提交成功
				</view>
				<view class="con_txt">
					{{msg}}
				</view>
				<view class="btm">
					<view class="yes" @click.stop="jump">
						确定
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import uniIcons from "@/components/uni-icons/uni-icons.vue";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import pakTool from "../../../common/utils/utility.js";
export default {
  components: {
    uniIcons,
    uniPopup
  },
  props: ["send", "add", "care_plan_id","one"], // 接收父传来的数据
  watch: {
    send() {
      if (this.send.isNew == true) {
        this.first = true;
      } else {
        this.first = false;
      }
      console.log(this.send, 8888);
      this.send.maladys.map(item => {
		this.target.symptom.push(item.name);
      }); //症状
      this.send.points.map(item => {
        this.acupoint_list.push(item.acupoint_name);
      }); //调
      // this.parts_list = this.send.selectBuList //养
      this.send.selectBuList.map(item => {
        this.parts_list.push(item.name);
      }); // 养
      this.send.products.map(item => {
        this.product_list.push(item.name);
      });
    },
	one(){
		const now = uni.getStorageSync('plan_time')
		now.map(item=>{
			if(item.id==this.care_plan_id){
				this.date = item.date
				this.time = item.time
			}
		})
	}
  },
  data() {
	  const currentDate = this.getDate({
	              format: true
	          })
    return {
      userImage: "",
      userName: "",
      userSex: "",
      userPhone: "",
      projectType: "元化灸",
      // 没选中
      none: "../../../static/images/danxuan-2@2x.png",
      // 选中
      active: "../../../static/images/system-complete@2x.png",
      // 产品
      product_sure: [],
      product_list: [],
      // 穴位
      acupoint_sure: [],
      acupoint_list: [],
      // 部位
      parts_sure: [],
      parts_list: [],
      // 接收病症选择数据
      target: {
        symptom: [], //传回的名字 展示时用
        symptom_id: [], //传回的id 提交时用
        remarks: ""
      },
      // 备注文字
      remarks: "",
      // 备注文字限制
      remnant_remarks: 0,
      // 检测是否是第一次进入页面
      first: true,
	  uploadUrl:this.config.contextPath + '/common/uploadFile',
	  img_path:'',//传后台用 图片
	  msg:'',
	  photo:'',
	  pla:false,
	  disabled:false, //提交锁定
	   showPicker: false,
	   date: currentDate,
	   time:'选择开始时间',
	   dati:'',
		select:false
    };
  },
  computed: {
    startDate() {
      return this.getDate("start");
    },
    endDate() {
      return this.getDate("end");
    }
  },
  methods: {
    // 切换项目
    projectChange() {
      if (this.first) {
        console.log("点击切换项目");
      }
    },
    // 症状
    symptomChange() {
      if (this.first) {
        console.log("选择症状");
        uni.navigateTo({
          url: "/pages/symptom/symptom"
        });
      }
    },
    // 选择产品
    productChange(e) {
      if (this.first) {
        if (this.product_sure.indexOf(e) == -1) {
          this.product_sure.push(e);
        } else {
          this.product_sure.splice(this.product_sure.indexOf(e), 1);
        }
      }
    },
    // 选择穴位
    acupointChange(e) {
      if (this.first) {
        if (this.acupoint_sure.indexOf(e) == -1) {
          this.acupoint_sure.push(e);
        } else {
          this.acupoint_sure.splice(this.acupoint_sure.indexOf(e), 1);
        }
      }
    },
    // 选择部位
    partsChange(e) {
      if (this.first) {
        if (this.parts_sure.indexOf(e) == -1) {
          this.parts_sure.push(e);
        } else {
          this.parts_sure.splice(this.parts_sure.indexOf(e), 1);
        }
      }
    },
    // 编辑
    clickEdit() {
      console.log("编辑");
      uni.redirectTo({
        url:
          "/pages/condition/condition?revise=true&his=" +
          this.care_plan_id +
          "&add=" +
          this.add
        // this.care_plan_id
      });
    },
    // 删除
    clickDelete() {
      this.$refs.popdel.open();
    },
    // 确定删除
    del_sure() {
      // console.log("删除了");
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        care_plan_id: this.care_plan_id
      };
      pakTool
        .request(this, "/madyApp/saveDelCarePlan", requestPak)
        .then(res => {
          const { data,code } = res;
          console.log(data);
		  if(code==200){
			  const del_time = uni.getStorageSync('plan_time')
			  for(let i =0;i< del_time.length;i++){
			  	if(del_time[i].id==this.care_plan_id){
			  		 del_time.splice(i,1);
			  	}
			  }
			  uni.setStorageSync('plan_time',del_time)
			  var pages = getCurrentPages();
			  var currPage = pages[pages.length - 1]; //当前页面
			  var prevPage = pages[pages.length - 2]; //上一个页面
			  // #ifdef H5
			  prevPage.back = 1;
			  // #endif
			  // #ifndef H5
			  prevPage.$vm.back = 1;
			  // #endif
			  uni.navigateBack({ delta: 1 });
		  }
        });
    },
    // 取消删除
    close() {
      this.$refs.popdel.close();
    },
    // 备注
    inp_remarks(e) {
      this.remnant_remarks = e.detail.value.length;
    },
	// 提交
	save(){
		if(this.disabled){
			return
		}
		if(this.photo==''){
			uni.showToast({
				title:'请上传图片',
				icon:'none'
			})
			return
		}
			if(this.remarks==''){
				uni.showToast({
					title:'请填写理疗建议',
					icon:'none'
				})
				return
			} 
			this.disabled = true
			if(this.date=='选择开始时期'&&this.time=='选择开始时间'){
				this.dati=''
			}else{
				this.dati = this.date+' '+this.time+":00"
			}
			
					  let requestPak = pakTool.createRequestPak();
					  	requestPak.requestBody = {
					  		member_id: this.add,
					  		care_plan_id: this.care_plan_id,
					  		comment:this.remarks,
					  		img_path: this.img_path,
							start_time: this.dati
					  	}
					 pakTool.request(this,'/madyApp/saveMemberCareRecord',requestPak).then(res=>{
						  const {data,code}= res 
						  console.log(data)
						  	if(code==200){
								this.msg = data.msg
								this.remarks = ''
								this.pla = true
								const all = uni.getStorageSync('plan_time')
								for(let i =0;i< all.length;i++){
									if(all[i].id==this.care_plan_id){
										 all.splice(i,1);
									}
								}
								uni.setStorageSync('plan_time',all)
						  		this.$refs.popup.open()
						  	}else{
								uni.showToast({
									title:'数据提交失败',
									icon:'none'
								})
								this.disabled = false
							}
					 })
					 
	},
	jump(){
		uni.redirectTo({
		      url: "/pages/planDetailed/planDetailed?add="+this.add+'&index=1' +'&his='+this.care_plan_id
		 });
	},
	// 上传图片
	upload(){
		var that = this
		uni.chooseImage({
		     count: 1,
		     sizeType: ['compressed','camera'],
		     success: (chooseImageRes) => {
			that.photo = chooseImageRes.tempFilePaths[0];
		      const tempFilePaths = chooseImageRes.tempFilePaths;
			  console.log(that.photo)
		      uni.uploadFile({
		       url: that.config.contextPath + '/common/uploadFile', 
		       filePath: tempFilePaths[0],
		       name: 'file',
		       success: (uploadFileRes) => {
		        let temp = JSON.parse(uploadFileRes.data)
		        that.img_path = temp.data.fileURL
		       }
		      });
		     }
		    });
	},
	// 时间选择
	bindDateChange(e) {
	  this.date = e.target.value;
	  if(this.time!='选择开始时间'){
		  this.start_time()
	  }else{
		  uni.showToast({
		  	title:'选择开始时间',
			icon:'none'
		  })
	  }
	},
	seldoc(e) {
	  this.doc = e.target.value;
	  this.doc_code = this.doc_list[e.target.value].value;
	},
	getDate(type) {
	  const date = new Date();
	  let year = date.getFullYear();
	  let month = date.getMonth() + 1;
	  let day = date.getDate();
	  if (type === "start") {
	    year = year - 60;
	  } else if (type === "end") {
	    year = year + 2;
	  }
	  month = month > 9 ? month : "0" + month;
	  day = day > 9 ? day : "0" + day;
	  return `${year}-${month}-${day}`;
	},
	bindTimeChange(e){
		this.time = e.target.value
		this.start_time()
	},
	// 开始计时
	start_time(){
		const start_time = {id:this.care_plan_id,date:this.date,time:this.time}
		const plan = uni.getStorageSync('plan_time')
				if(plan.length==0){
					plan.push(start_time)
				}else{
					for(let i = 0;i<plan.length;i++){
						if(plan[i].id==this.care_plan_id){
							plan[i] = start_time
							this.select = false
							break
						}else{
							this.select = true
						}
					}
					if(this.select==true){
						plan.push(start_time)
					}
					
				}
				
		uni.setStorageSync('plan_time',plan)
		uni.showToast({
			title:'计时开始'
		})
	}
	    }
	
  }
</script>

<style lang="less" scoped>
.detailed {
  min-height: 100%;
  // 信息
  .body-info {
    display: flex;
    flex-wrap: wrap;
    padding: 0 30rpx 30rpx;
    background: #fff;
	font-size: 32rpx;
    // 添加/删除
    .option {
      display: flex;
      margin-bottom: 30rpx;
      width: 100%;
      justify-content: flex-end;

      .edit,
      .delete {
        border-radius: 25rpx;
        padding: 0 20rpx;
        text-align: center;
        margin: 0 8rpx;

        text {
          margin-left: 10rpx;
        }
      }

      // 编辑
      .edit {
        background: #c59a76;
        color: #fff;
      }

      // 删除
      .delete {
        color: #c59a76;
        border: 1rpx solid #c59a76;
      }
    }

    .box-style {
      border-radius: 10rpx;
      box-shadow: 0px 2px 12px 6px rgba(133, 133, 133, 0.1);
      margin-bottom: 20rpx;
      width: 100%;
      position: relative;

      // 图片上传
      .photo {
        width: 210rpx;
        height: 210rpx;
        border: 2rpx dashed #d9d9d9;
        margin: 30rpx 0;

        .xx {
          z-index: 999;
          width: 30rpx;
          height: 30rpx;
          position: absolute;
          top: 0;
          right: 0;
          vertical-align: top;
          transform: translate(50%, -50%);

          image {
            width: 100%;
            height: 100%;
            vertical-align: top;
          }
        }

        .squ {
          width: 210rpx;
          height: 210rpx;
          display: flex;
          flex-direction: column;
          align-items: center;

          .ppp {
            width: 62rpx;
            height: 50rpx;
            margin: 45rpx 0 40rpx;
          }

          .tianjia {
            font-size: 28rpx;
            color: #c2c2c2;
            text-align: center;
          }
        }
      }

      uni-list {
        uni-list-item {
          display: flex;
          align-items: flex-start;
          position: relative;
          padding: 0 30rpx;

          .flex {
            height: 104rpx;
            line-height: 104rpx;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
			border-bottom: 1rpx solid #eeeeee;

            i {
              width: 6rpx;
              height: 35rpx;
              background: #c59a76;
              border-radius: 0 4rpx 4rpx 0;
              position: absolute;
              left: 0;
            }
			.bt{
				padding: 3rpx 10rpx;
				display: inline-block;
				border: 2rpx solid #C59A76;
				border-radius: 10rpx;
				font-size: 24rpx;
				color: #C59A76;
				margin-left: 30rpx;
			}
			 .test{
			        text-align: center;
			        padding: 10px 0;
			    }
			    button{
			        margin: 20upx;
			        font-size: 28upx;
			    }
            .required {
              color: #ff3b30;
            }

            .text {
              width: 50%;
              margin-left: 60rpx;
              font-size: 30rpx;
            }

            uni-icons {
              position: absolute;
              right: 30rpx;
            }
          }

          .head {
            background: #c59a76;
            width: 100rpx;
            height: 44rpx;
            line-height: 44rpx;
            text-align: center;
            border-radius: 22rpx;
            color: #fff;
            margin: 30rpx 0;
          }

          .choice {
            display: flex;
            flex-wrap: wrap;
            width: 100%;

            .choice_radio {
              flex-basis: 50%;
              margin: 10rpx 0;

              image {
                width: 36rpx;
                height: 36rpx;
                vertical-align: middle;
                margin-right: 20rpx;
              }
            }
          }

          // 理疗建议
          .quil {
            height: 300rpx;
            width: 100%;
            background: #f7f7f7;
            box-sizing: border-box;
            padding: 30rpx;
            position: relative;
            border-radius: 10rpx;
            margin: 20rpx 0 30rpx 0;

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
        }

        // 详细病症
        .symptom {
          display: flex;
          flex-wrap: wrap;
		  // padding-bottom: 10rpx;
		  padding: 0 30rpx 10rpx 30rpx;
          text {
            box-sizing: border-box;
            padding: 15rpx 0;
            width: 50%;
          }
        }

        button {
          background: #fff;
          color: #c59a76;
          font-size: 30rpx;
        }
      }
    }
  }

  // 保存按钮
  .save {
    width: 100%;
    background: #c59a76;
    color: #fff;
    border-radius: 42rpx;
    margin: 20rpx;
  }

  //弹窗
  .pop {
    width: 605rpx;
    height: 580rpx;
    background-color: #ffffff;
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
      transform: translate(-50%, -10%);
    }

    .sus_txt {
      font-size: 36rpx;
      color: #c59a76;
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .con_txt {
      color: #333333;
      margin: 50% auto 0;
      text-align: center;
    }

    .btm {
      display: flex;
      justify-content: space-around;
      padding: 0 30rpx;
      margin-top: 96rpx;

      .yes {
        padding: 18rpx 60rpx;
        display: inline-block;
        background-color: #c59a76;
        color: white;
        border-radius: 44rpx;
      }

      .no {
        padding: 18rpx 60rpx;
        background-color: #ffffff;
        display: inline-block;
        color: #c59a76;
        border-radius: 44rpx;
        box-sizing: border-box;
        border: 2rpx solid #c59a76;
      }
    }
  }

}
</style>
