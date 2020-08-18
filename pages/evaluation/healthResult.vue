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
          "阴虚质",
        ],
        series: [
          {
            // name: '',
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10],
          },
        ],
      },
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
        pk_question_record: this.pk_question, // 答题数据id
      };
      pakTool.request(this, "/tcm/getReportDetail", requestPak).then((res) => {
        // {"ok":true,"message":"","pk":null,"code":"200","data":{"questionRecord":{"pk_questionScore":"d46c957b-cabf-4ea2-a084-1b423b89ef77","fk_customer":"b0e964f2-384d-4dc8-91fd-3b45bb7b60de","fk_employee":"89c22367-1c6a-489d-90ee-c9a0467109aa","billdate":"2020-07-27T07:01:12.000+0000","item1":"非常/每天","item2":"非常/每天","item3":"非常/每天","item4":"非常/每天","item5":"非常/每天","item6":"非常/每天","item7":"非常/每天","item8":"非常/每天","item9":"非常/每天","item10":"非常/每天","item11":"非常/每天","item12":"非常/每天","item13":"非常/每天","item14":"非常/每天","item15":"非常/每天","item16":"非常/每天","item17":"非常/每天","item18":"非常/每天","item19":"非常/每天","item20":"非常/每天","item21":"非常/每天","item22":"非常/每天","item23":"非常/每天","item24":"非常/每天","item25":"非常/每天","item26":"非常/每天","item27":"非常/每天","item28":"非常/每天","item29":"非常/每天","item30":"非常/每天","item31":"非常/每天","item32":"非常/每天","item33":"非常/每天","score1":"9","score2":"20","score3":"20","score4":"20","score5":"20","score6":"20","score7":"20","score8":"20","score9":"20","constitution_type":"偏颇质","constitution_score":null,"description":"是气虚体质 阳虚体质 阴虚体质 痰湿体质 血瘀体质 气郁体质 特禀体质 湿热体质  ","createUser":null,"createTime":"2020-07-27T06:52:40.000+0000","editUser":null,"editTime":"2020-07-27T07:01:12.000+0000","excKey":0,"ts":"2020-07-27T06:52:40.000+0000","dr":0,"displayTime":"2020-07-27 15:01:12"},"intervenePlan":[{"type":"DEFICIENCY_ENERGY","score":"20","result":"0","bodyName":"气虚质","bodyMemo":"气虚体质","planDetail":"该怎么调理\r\n（1）情志养生：心平气和，不要考虑过多，学会感受直觉，有爱好的可以绘画，书法，养花，垂钓等，多交朋友，多交流。多听流畅舒缓的音乐，多做运动，少用电脑。\r\n（2）运动养生：锻炼方法当以增强体内之气为主，健身法如太极拳、太极剑、八段锦、五禽戏、形意拳以及养肾功等亦有同样作用。有氧代谢运动：步行、慢跑、缓步登山、滑冰、游泳、骑自行车、健身舞等。\r\n（3）起居养生 ：\r\n  注意季节转换、气候变化，预防呼吸道疾病、过敏性疾病，防止身体及精神的过度疲劳。\r\n  注意保暖双脚，尤其是春、秋与冬季的夜晚睡觉时应穿上袜子，保暖双脚。或晚上睡觉前用温热水（40～50℃）泡脚15～20分钟，泡脚时水量要没过脚面，泡后双脚要微微发红，能促进血液循环，提高身体的耐寒及抗病能力。\r\n（4）饮食养生：补气时可酌加杞子、桑椹子、蜂蜜等益肾填精之品。少吃具有耗气作用的食物。饮食宜忌：不宜食过于滋腻、难消化、加工食物（含化学添加物）或生冷饮品及苦寒、辛辣燥热等寒热偏性明显的食物。忌寒湿、油腻、厚味食物。可常食粳米、糯米、小米、黄米、大麦、山药、籼米、莜麦、马铃薯、大枣、胡萝卜、香菇、豆腐、鸡肉、鹅肉、兔肉、鹌鹑、牛肉、狗肉、青鱼、鲢鱼。若气虚甚，当选用“人参莲肉汤”等补养。\r\n（5）经络养生：可握拳轻叩头顶百会穴以醒脑提神，或反覆重力揉按风池、涌泉穴以强身健体。穴位一紧一松且有节奏地按压，一般2秒一次，每次5～10分钟。每日早晚各1次。按后感觉要有酸、麻、胀才好。\r\n","planName":"气虚质调理方案"},{"type":"DEFICIENCY_YANG","score":"20","result":"0","bodyName":"阳虚质","bodyMemo":"阳虚体质","planDetail":"该怎么调理\r\n（１）情志养生：应多参加社交或群体活动，加强沟通使性格渐趋活跃，注意不要让低沉的心境影响很多人生应有的愉悦\r\n（2）环境养生：对于年老及体弱之人，夏季不要在外露宿，不要让电扇直吹，亦不要在树阴下停留过久。夏季暑热多汗，汗多则伤津耗气，使阳气虚于内，因此要尽量避免强力劳作，也不可恣意贪凉饮冷。不可在阴暗潮湿寒冷的环境下长期工作和生活，因为寒湿易伤人阳气，应多在阳光充足的情况下适当进行户外活动。\r\n（3）运动养生：氧气能充分酵解体内的糖分，还可消耗体内脂肪，增强和改善心肺功能，调节心理的精神状态。常见的有氧运动项目有：步行、慢跑、滑冰、游泳、骑自行车、打太极拳、五禽戏、八段锦、健身舞、养生功法等。\r\n（4）饮食养生：适当多吃一些易消化、富有营养、性质温热、具有补益肾阳、温暖脾阳作用的食物：黄牛肉、羊肉、鹿肉、猪肚、鸡肉、带鱼、刀豆、韭菜、大蒜、辣椒、生姜、荔枝、桂圆、栗子等。也可多吃些含碘较多的食物，如海带、海蜇、海水鱼、虾皮、淡莱等。少吃生冷瓜果类的食物及冷饮；限制浓茶、酒类和辛辣食物，产气食物（萝卜、山芋）也应减少食用。阳虚便秘者更宜食既温补又通便的食物，如核桃仁、薤白、海参、海虾等；需忌食收涩加重便秘的食物，如石榴、乌梅、糯米、河虾等。阳虚泄泻者更宜食既温补又止泻的食物，如糯米、鲢鱼、河虾、干姜、花椒等；需忌食具有润下通便作用的食物，如芝麻、银耳、海参、海虾、牛奶、兔肉、龙眼、桃子、萝卜等。\r\n（5）起居养生：注意季节转换、气候变化，身体虚弱，过度疲劳，睡眠不足，紧张持久的脑力劳动，都可能成为发病的诱因，可遵照“春夏养阳”的原则，在春夏季节，借自然界阳气之助培补阳气，可适当洗桑拿、温泉浴，或多晒太阳，每次约20分钟，时间勿过长过久。\r\n夏季避免直接吹空调电扇，而秋冬注意保暖，尤其是足下、背部及下腹部丹田部位的防寒保暖。 此种体质多形寒肢冷，喜暖怕凉，耐春夏不耐秋冬，故阳虚体质者尤应重环境调摄，提高人体抵抗力。\r\n","planName":"阳虚质调理方案"}],"isSuccess":"0"}}
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
            title: res.message,
          });
        }
      });
    },

    // 雷达图
    getServerData() {
      let Radar = {
        categories: [],
        series: [],
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
          show: false, // 是否显示图例标识
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
            opacity: 0.5, // 透明度
          },
        },
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
        url:
          "/pages/evaluation/evaluation?id=" +
          this.fk_customer + // 用户id
          "&pk_question=" +
          this.pk_question, // 答题数据id
      });
    },
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
  },
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
