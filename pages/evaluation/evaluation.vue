<template>
	<div class="evaluation">
		<div class="content">
			<div class="question">
				<p>{{curQuestion}}.{{listQuestion[curQuestion - 1].question_content}}</p>
				<button :style="{backgroundColor:answer === 1 ? '#c59a76':'white', color:answer === 1 ? '#ffffff':'#000000'}"
				 @click.native="changeQuestion(1)">{{answerNow[0]}}</button>
				<button :style="{backgroundColor:answer === 2 ? '#c59a76':'white', color:answer === 2 ? '#ffffff':'#000000'}"
				 @click.native="changeQuestion(2)">{{answerNow[1]}}</button>
				<button :style="{backgroundColor:answer === 3 ? '#c59a76':'white', color:answer === 3 ? '#ffffff':'#000000' }"
				 @click.native="changeQuestion(3)">{{answerNow[2]}}</button>
				<button :style="{backgroundColor:answer === 4 ? '#c59a76':'white', color:answer === 4 ? '#ffffff':'#000000' }"
				 @click.native="changeQuestion(4)">{{answerNow[3]}}</button>
				<button :style="{backgroundColor:answer === 5 ? '#c59a76':'white', color:answer === 5 ? '#ffffff':'#000000' }"
				 @click.native="changeQuestion(5)">{{answerNow[4]}}</button>
			</div>
			<div class="changeQuestion">
				<button class="pre" @click.native="changeQuestion(-1)">上一题</button>
				<button class="next" @click.native="changeQuestion(0)">{{next}}</button>
			</div>
			<!-- <div class="progressBottom">
				<span class="startNum">1</span>
				<div>
					<div class="progressChild" v-for="(i,index) of maxQuestion" :key="index"></div>
					<p @touchstart="touchDown" @touchmove="touchMove" @touchend="touchUp" :style="{left: distance +'px'}">
						<span class="cur">{{curQuestion}}</span>
					</p>
				</div>
				<span class="endNum">{{maxQuestion}}</span>
			</div> -->
		</div>

	</div>
</template>

<script>
	import pakTool from "@/common/utils/utility.js"; // 调用接口
	export default {
		data() {
			return {
				pk_customer: "", // 用户id
				pk_question: "", // 答题数据id
				customer_code: "",
				sex: 0,
				tipMessage: "",
				curQuestion: 1,
				maxQuestion: 33,
				answer: 0, // 本道题目答案
				lock: false,
				distance: 0,
				startPos: 0,
				endPos: 0,
				maxWidth: 0,
				answerNow: [
					"根本不/从来没有",
					"有一点/偶尔",
					"有些/少数时间",
					"相当/多数时间",
					"非常/每天"
				], // 当前题目的答案
				answerArr: [], // 我的答案序列//[1,1,2,2]
				score: [0, 0, 0, 0, 0, 0, 0, 0, 0], // 雷达图分数
				questionNum: [0, 0, 0, 0, 0, 0, 0, 0, 0], // 每种题目有几道
				next: "下一题",
				showLoading: false,
				noNeedIndex: -1,
				modify: false,
				excKey: 0,
				listQuestion: [{
						question_content: "您精力充沛吗？（指精神头足，乐于做事）",
						question_type: "10,0,0,0,0,0,0,0,0"
					},
					{
						question_content: "您容易疲乏吗？（指体力如何，是否稍微活动一下或做一点家务劳动就感到累）",
						question_type: "-10,20,0,0,0,0,0,0,0"
					},
					{
						question_content: "您容易气短，呼吸短促，接不上气吗？",
						question_type: "0,20,0,0,0,0,0,0,0"
					},
					{
						question_content: "您说话声音低弱无力吗?（指说话没有力气）",
						question_type: "-10,20,0,0,0,0,0,0,0"
					},
					{
						question_content: "您感到闷闷不乐、情绪低沉吗?（指心情不愉快，情绪低落）",
						question_type: "-10,0,0,0,0,0,0,80,0"
					},
					{
						question_content: "您容易精神紧张、焦虑不安吗?（指遇事是否心情紧张）",
						question_type: "0,0,0,0,0,0,0,80,0"
					},
					{
						question_content: "您因为生活状态改变而感到孤独、失落吗？",
						question_type: "0,0,0,0,0,0,0,80,0"
					},
					{
						question_content: "您容易感到害怕或受到惊吓吗?",
						question_type: "0,0,0,0,0,0,0,80,0"
					},
					{
						question_content: "您感到身体超重不轻松吗?(感觉身体沉重)",
						question_type: "0,0,0,0,50,0,0,0,0"
					},
					{
						question_content: "您眼睛干涩吗?",
						question_type: "0,0,0,40,0,0,0,0,0"
					},
					{
						question_content: "您手脚发凉吗?（不包含因周围温度低或穿的少导致的手脚发冷）",
						question_type: "0,0,30,0,0,0,0,0,0"
					},
					{
						question_content: "您胃脘部、背部或腰膝部怕冷吗？（指上腹部、背部、腰部或膝关节等，有一处或多处怕冷）",
						question_type: "0,0,30,0,0,0,0,0,0"
					},
					{
						question_content: "您比一般人耐受不了寒冷吗？（指比别人容易害怕冬天或是夏天的冷空调、电扇等）",
						question_type: "-10,0,30,0,0,0,0,0,0"
					},
					{
						question_content: "您容易患感冒吗?（指每年感冒的次数）",
						question_type: "0,20,0,0,0,0,0,0,0"
					},
					{
						question_content: "您没有感冒时也会鼻塞、流鼻涕吗?",
						question_type: "0,0,0,0,0,0,0,0,90"
					},
					{
						question_content: "您有口粘口腻，或睡眠打鼾吗？",
						question_type: "0,0,0,0,50,0,0,0,0"
					},
					{
						question_content: "您容易过敏(对药物、食物、气味、花粉或在季节交替、气候变化时)吗?",
						question_type: "0,0,0,0,0,0,0,0,90"
					},
					{
						question_content: "您的皮肤容易起荨麻疹吗? (包括风团、风疹块、风疙瘩)",
						question_type: "0,0,0,0,0,0,0,0,90"
					},
					{
						question_content: "您的皮肤在不知不觉中会出现青紫瘀斑、皮下出血吗?（指皮肤在没有外伤的情况下出现青一块紫一块的情况）",
						question_type: "0,0,0,0,0,0,70,0,0"
					},
					{
						question_content: "您的皮肤一抓就红，并出现抓痕吗?（指被指甲或钝物划过后皮肤的反应）",
						question_type: "0,0,0,0,0,0,0,0,90"
					},
					{
						question_content: "您皮肤或口唇干吗?",
						question_type: "0,0,0,40,0,0,0,0,0"
					},
					{
						question_content: "您有肢体麻木或固定部位疼痛的感觉吗？",
						question_type: "0,0,0,0,0,0,70,0,0"
					},
					{
						question_content: "您面部或鼻部有油腻感或者油亮发光吗?（指脸上或鼻子）",
						question_type: "0,0,0,0,0,60,0,0,0"
					},
					{
						question_content: "您面色或目眶晦黯，或出现褐色斑块/斑点吗?",
						question_type: "0,0,0,0,0,0,70,0,0"
					},
					{
						question_content: "您有皮肤湿疹、疮疖吗？",
						question_type: "0,0,0,0,0,60,0,0,0"
					},
					{
						question_content: "您感到口干咽燥、总想喝水吗？",
						question_type: "0,0,0,40,0,0,0,0,0"
					},
					{
						question_content: "您感到口苦或嘴里有异味吗?（指口苦或口臭）",
						question_type: "0,0,0,0,0,60,0,0,0"
					},
					{
						question_content: "您腹部肥大吗?（指腹部脂肪肥厚）",
						question_type: "0,0,0,0,50,0,0,0,0"
					},
					{
						question_content: "您吃(喝)凉的东西会感到不舒服或者怕吃(喝)凉的东西吗？（指不喜欢吃凉的食物，或吃了凉的食物后会不舒服）",
						question_type: "0,0,30,0,0,0,0,0,0"
					},
					{
						question_content: "您有大便黏滞不爽、解不尽的感觉吗?(大便容易粘在马桶或便坑壁上)",
						question_type: "0,0,0,0,0,60,0,0,0"
					},
					{
						question_content: "您容易大便干燥吗?",
						question_type: "0,0,0,40,0,0,0,0,0"
					},
					{
						question_content: "您舌苔厚腻或有舌苔厚厚的感觉吗?（如果自我感觉不清楚可由调查员观察后填写）",
						question_type: "0,0,0,0,50,0,0,0,0"
					},
					{
						question_content: "您舌下静脉瘀紫或增粗吗？（可由调查员辅助观察后填写）",
						question_type: "0,0,0,0,0,0,70,0,0"
					}
				]
			};
		},
		onLoad(option) {
			this.pk_customer = option.id; // 用户id
			this.pk_question = option.pk_question; // 答题数据id
			this.maxWidth = 100 * 0.84;
			// 发送请求获取题目
			let that = this;
			// if (this.$route.query.pk_customer !== undefined) {
			//   this.pk_customer = this.$route.query.pk_customer
			//   this.customer_code = this.$route.query.customer_code
			//   this.sex = this.$route.query.sex
			//   this.modify = this.$route.query.modify
			//   this.excKey = this.$route.query.excKey
			// }
			that.answerArr = new Array(that.maxQuestion);
			for (let i = 0; i < that.maxQuestion; i++) {
				that.answerArr[i] = 0;
			}
			let custInfos = uni.getStorageSync("custInfos") || {};
			let key = uni.getStorageSync("admin_user_id") + "@" + that.pk_customer;
			if (custInfos[key] != null) {
				that.answerArr = custInfos[key];
			} else {
				custInfos[key] = new Array(that.maxQuestion);
				for (let i = 0; i < that.maxQuestion; i++) {
					custInfos[key][i] = 0;
				}
				console.log("new Answer");
			}
			console.log(that.answerArr);
			console.log(that.answerArr instanceof Array);
			that.curQuestion = that.answerArr.indexOf(0) + 1;
			console.log("created is " + that.curQuestion);
			if (that.curQuestion === that.maxQuestion) {
				// 修复全部打完但是返回上一层的情况
				// that.curQuestion = that.maxQuestion;
				that.next = "提交";
			}
			that.endPos = that.distance = Math.ceil(
				((that.curQuestion - 1) / that.maxQuestion) * that.maxWidth
			);
			// setTimeout(() => {
			// 	// let block = document.getElementsByClassName('progressChild')
			// 	for (let i = 0; i < that.maxQuestion; i++) {
			// 		// block[i].style.width = that.maxWidth / that.maxQuestion + 'px'
			// 		// if (custInfos[key][i] === 0) {
			// 		// 	block[i].style.backgroundColor = '#ff5555'
			// 		// }
			// 	}
			// 	// block[0].style.borderRadius = '0.1rem 0 0 0.1rem'
			// 	// block[that.maxQuestion - 1].style.borderRadius = '0 0.1rem 0.1rem 0'
			// }, 500);
		},
		onReady() {
			console.log(this.pk_customer);
		},
		methods: {
			touchDown(e) {
				this.startPos = e.touches[0].clientX;
				this.lock = true;
			},
			touchMove(e) {
				if (!this.lock) return;
				let mymove = e.touches[0].clientX - this.startPos;
				let dis = this.endPos + mymove;
				this.distance = dis < 0 ? 1 : dis > this.maxWidth ? this.maxWidth : dis;
				this.curQuestion = Math.ceil(
					(this.distance / this.maxWidth) * this.maxQuestion
				);
				this.answer = this.answerArr[this.curQuestion - 1];
				this.distance = Math.ceil(
					((this.curQuestion - 1) / this.maxQuestion) * this.maxWidth
				);
				this.answerNow = this.answers[this.curQuestion - 1];
				if (this.curQuestion === this.maxQuestion) {
					// 修复全部打完但是返回上一层的情况
					this.next = "提交";
				} else {
					this.next = "下一题";
				}
			},
			touchUp(e) {
				this.lock = false;
				this.endPos = this.distance;
			},
			changeQuestion(num) {
				let that = this;
				if (num < 0) {
					// 点击上一题重置answer
					if (this.curQuestion > 1) {
						this.answerArr[this.curQuestion - 1] = this.answer;
						let custInfos = uni.getStorageSync("custInfos") || {};
						let key =
							uni.getStorageSync("admin_user_id") + "@" + this.pk_customer;
						custInfos[key] = this.answerArr;
						uni.setStorageSync("custInfos", custInfos);
						this.curQuestion--;
						this.next = "下一题";
						this.answer = this.answerArr[this.curQuestion - 1];
						console.log(this.answer);
					}
				} else {
					if (num !== 0) {
						this.answer = num;
					}
					if (this.curQuestion < this.maxQuestion) {
						// 点击下一题重置answer
						this.answerArr[this.curQuestion - 1] = this.answer;
						let custInfos = uni.getStorageSync("custInfos") || {};
						let key =
							uni.getStorageSync("admin_user_id") + "@" + this.pk_customer;
						custInfos[key] = this.answerArr;
						uni.setStorageSync("custInfos", custInfos);
						setTimeout(() => {
							that.curQuestion = that.answerArr.indexOf(0) + 1;
							if (that.curQuestion === 0) {
								// 修复全部打完但是返回上一层的情况
								that.curQuestion = that.maxQuestion;
								that.next = "提交";
							}
							that.answer = that.answerArr[that.curQuestion - 1];
							that.endPos = that.distance = Math.ceil(
								((this.curQuestion - 1) / this.maxQuestion) * this.maxWidth
							);
						}, 300);
					} else {
						// 当前题目数 == 总题目数
						// 保存最后一题
						this.answerArr[this.curQuestion - 1] = this.answer;
						this.next = "提交";
						// 判断是不是所有题目都答完
						if (this.answerArr.indexOf(0) === -1 && num === 0) {
							this.submitAnswer(1);
						}
						// else {
						// 	this.tipMessage =
						// 		"第" + (this.answerArr.indexOf(0) + 1) + "题还未作答";
						// 	setTimeout(function() {
						// 		that.tipMessage = "";
						// 	}, 800);
						// 	setTimeout(() => {
						// 		that.curQuestion = that.answerArr.indexOf(0) + 1;
						// 		if (that.curQuestion === 0) {
						// 			// 修复全部打完但是返回上一层的情况
						// 			that.next = "下一题";
						// 		}
						// 		that.answer = that.answerArr[that.curQuestion - 1];
						// 		that.endPos = that.distance = Math.ceil(
						// 			((this.curQuestion - 1) / this.maxQuestion) * this.maxWidth
						// 		);
						// 	}, 1000);
						// }
					}
				}
			},
			// 计算分数
			calcScore() {
				for (let i = 0; i < this.answerArr.length; i++) {
					if (this.answerArr[i] !== 0) {
						for (let index of this.listQuestion[i].question_type.split(",")) {
							if (index !== "0") {
								let absIndex = Math.abs(index);
								let exScore =
									index > 0 ? this.answerArr[i] - 0 : 6 - this.answerArr[i];
								this.score[absIndex / 10 - 1] += exScore;
								this.questionNum[absIndex / 10 - 1]++;
							}
						}
					}
				}
				let max = 0;
				for (let i = 0; i < this.score.length; i++) {
					if (this.score[i] > this.score[max]) {
						max = i;
					}
				}
				return {
					value1: max <= 1 ? max + 1 : max + 10,
					value2: this.score[max]
				};
			},
			// 提交答案
			submitAnswer(num) {
				console.log(
					`用户id: ${this.fk_customer}, 答题数据id: ${this.pk_question}`
				);
				let scoreResult = this.calcScore();
				let requestPak = pakTool.createRequestPak();
				let that = this;
				// let userInfo = uni.getStorageSync("userInfo");
				requestPak.requestBody = {
					fk_employee: uni.getStorageSync("admin_user_id"), // 用户id
					pk_questionScore: this.pk_question, // 答题数据id
					fk_customer: this.pk_customer,
					item1: this.answerNow[this.answerArr[0] - 1],
					item2: this.answerNow[this.answerArr[1] - 1],
					item3: this.answerNow[this.answerArr[2] - 1],
					item4: this.answerNow[this.answerArr[3] - 1],
					item5: this.answerNow[this.answerArr[4] - 1],
					item6: this.answerNow[this.answerArr[5] - 1],
					item7: this.answerNow[this.answerArr[6] - 1],
					item8: this.answerNow[this.answerArr[7] - 1],
					item9: this.answerNow[this.answerArr[8] - 1],
					item10: this.answerNow[this.answerArr[9] - 1],
					item11: this.answerNow[this.answerArr[10] - 1],
					item12: this.answerNow[this.answerArr[11] - 1],
					item13: this.answerNow[this.answerArr[12] - 1],
					item14: this.answerNow[this.answerArr[13] - 1],
					item15: this.answerNow[this.answerArr[14] - 1],
					item16: this.answerNow[this.answerArr[15] - 1],
					item17: this.answerNow[this.answerArr[16] - 1],
					item18: this.answerNow[this.answerArr[17] - 1],
					item19: this.answerNow[this.answerArr[18] - 1],
					item20: this.answerNow[this.answerArr[19] - 1],
					item21: this.answerNow[this.answerArr[20] - 1],
					item22: this.answerNow[this.answerArr[21] - 1],
					item23: this.answerNow[this.answerArr[22] - 1],
					item24: this.answerNow[this.answerArr[23] - 1],
					item25: this.answerNow[this.answerArr[24] - 1],
					item26: this.answerNow[this.answerArr[25] - 1],
					item27: this.answerNow[this.answerArr[26] - 1],
					item28: this.answerNow[this.answerArr[27] - 1],
					item29: this.answerNow[this.answerArr[28] - 1],
					item30: this.answerNow[this.answerArr[29] - 1],
					item31: this.answerNow[this.answerArr[30] - 1],
					item32: this.answerNow[this.answerArr[31] - 1],
					item33: this.answerNow[this.answerArr[32] - 1],
					score1: this.score[0],
					score2: this.score[1],
					score3: this.score[2],
					score4: this.score[3],
					score5: this.score[4],
					score6: this.score[5],
					score7: this.score[6],
					score8: this.score[7],
					score9: this.score[8]
				};
				console.log(requestPak.requestBody);
				pakTool.request(this, "/tcm/saveAnswerRecord", requestPak).then(res => {
					this.pk_question = res.data;
					uni.redirectTo({
						url: "/pages/evaluation/healthResult?id=" +
							this.pk_customer +
							"&pk_question=" +
							this.pk_question
					});
				});
				this.showLoading = true;
				// this.public.tcmAjax(requestPak, "tcm/saveAnswerRecord", function(
				// 	responseBody
				// 	) {
				// 		if (responseBody.isSuccess === "1") {
				// 			that.tipMessage = responseBody.msg;
				// 			setTimeout(function() {
				// 				that.tipMessage = "";
				// 				that.showLoading = false;
				// 			}, 1000);
				// 		} else {
				// 			// 清除该pk_customer缓存
				if (num === 1) {
					let custInfos = uni.getStorageSync("custInfos") || {};
					let key = uni.getStorageSync("admin_user_id") + "@" + that.pk_customer;
					custInfos[key] = null;
					delete custInfos[key];
					uni.setStorageSync("custInfos", custInfos);
				}
				// 			let scores = [
				// 				["平和质", parseInt(that.score[0])],
				// 				["气虚质", parseInt(that.score[1])],
				// 				["阳虚质", parseInt(that.score[2])],
				// 				["阴虚质", parseInt(that.score[3])],
				// 				["痰湿质", parseInt(that.score[4])],
				// 				["湿热质", parseInt(that.score[5])],
				// 				["血瘀质", parseInt(that.score[6])],
				// 				["气郁质", parseInt(that.score[7])],
				// 				["特禀质", parseInt(that.score[8])]
				// 			];
				// 			console.log("pk_question_record" + responseBody.data);
				// 			// that.$router.replace({name: 'userOtherInfo', query: {pk_customer: that.pk_customer, scores: scores, pk_question_record: responseBody.data, customer_code: that.customer_code, sex: that.sex, modify: that.modify, excKey: that.excKey}})
				// 		}
				// 	});
			}
		}
	};
</script>

<style lang="scss">
	$normal_font: 24.4rpx;
	$mobile_font: 30rpx;

	.evaluation {
		overflow: hidden;
		height: 100%;
		font-size: $normal_font;
		background: #f3f7f8;

		.content {
			padding: 28rpx 54rpx 0 54rpx;

			.progress {
				p {
					text-align: center;
					color: #485165;
				}

				div {
					background-color: #ebebeb;
					height: 15rpx;
					width: 100%;
					border-radius: 7rpx;

					div {
						height: 100%;
						width: 214.8rpx;
						border-radius: 7rpx;
						background: -webkit-linear-gradient(left, #63d0f4, #54e4a8);
						/* Safari 5.1 - 6.0 */
						background: -o-linear-gradient(right, #63d0f4, #54e4a8);
						/* Opera 11.1 - 12.0 */
						background: -moz-linear-gradient(right, #63d0f4, #54e4a8);
						/* Firefox 3.6 - 15 */
						background: linear-gradient(to right, #63d0f4, #54e4a8);
					}
				}
			}

			.question {
				p {
					height: 150rpx;
					overflow-y: auto;
				}

				button {
					box-shadow: 1.5rpx 2.4rpx 2rpx 0 rgba(189, 188, 188, 0.36);
					font-weight: 600;
					font-size: 22.5rpx;
					text-align: left;
					padding-left: 32.2rpx;
					height: 73.2rpx;
					margin-top: 45rpx;
				}
			}

			.changeQuestion {
				margin-top: 51.8rpx;

				button {
					box-shadow: 1.5rpx 2.4rpx 2rpx 0 rgba(189, 188, 188, 0.36);
					float: left;
					width: 294rpx;
					// height: 73rpx;
				}

				.pre {
					background-color: #ededed;
					color: #8b8b8b;
				}

				.next {
					float: right;
					background-color: #c59a76;
					color: #fffcfc;
				}
			}

			.progressBottom {
				position: absolute;
				bottom: 0;
				background-color: #ffffff;
				margin-left: 54.7rpx;
				width: 100%;
				height: 104rpx;

				.startNum {
					position: absolute;
					margin-left: 20rpx;
					margin-top: 35rpx;
				}

				.endNum {
					float: right;
					margin-right: 10rpx;
					margin-top: 0;
				}

				div {
					width: 84%;
					display: block;
					position: relative;
					left: 7%;
					top: 22rpx;
					background-color: #ebebeb;
					height: 14.6rpx;
					border-radius: 7rpx;

					.progressChild {
						top: 0;
						left: 0;
						float: left;
						height: 100%;
						width: 0;
						background-color: #ebebeb;
						border-radius: 0;
					}

					p {
						position: relative;
						top: -82rpx;
						width: 46.4rpx;
						height: 107rpx;
						// background: url("../assets/images/evaluation/symbols.png") no-repeat;
						background-size: 100% 100%;

						.cur {
							position: relative;
							top: -5rpx;
							left: 13rpx;
							color: #000000;
						}
					}
				}
			}
		}

		.tips {
			transition: all 0.3s;
			position: absolute;
			width: 100%;
			margin-top: -230rpx;

			p {
				margin: 0 auto;
				background-color: #313232;
				font-size: 19.5rpx;
				color: #fff;
				border-radius: 50px;
				text-align: center;
				width: 3rpx;
				height: 43.9rpx;
				line-height: 43.9rpx;
			}
		}
	}

	@media screen and (max-width: 730px) {

		.evaluation .content .question p,
		.evaluation .content .question button {
			font-size: $mobile_font;
		}
	}
</style>
