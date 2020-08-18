import config from "../config/config.js";

export default {
	createRequestPak: function() {
		return {
			platform: "wx",
			requestUser: "1",
			requestBody: {},
			// token: "505d644c-6270-43b4-ab4b-4a56dec8da73",
			token:'aee8fc94-fe02-4f9e-a659-fb37a0fda2ec',
			sign: "aaaa-bbbb-cccc-ddd"
		};
	},
	showLoading: function(title) {
		if (this.isNullOrWhiteSpace(title)) {
			title = '加载中';
		}
		uni.showLoading({
			title: title
		})
	},
	hideLoading: function() {
		uni.hideLoading()
	},
	message: function(message, duration) {
		if (this.isNullOrWhiteSpace(duration)) {
			duration = 2000;
		}
		uni.showToast({
			title: message,
			icon: "none",
			duration: duration
		});
	},
	messageSuccess: function(message) {
		// icon的类型，有效值：success,loading---
		if (this.isNullOrWhiteSpace(message)) {
			message = ' 成功';
		}
		uni.showToast({
			title: message,
			icon: 'success',
			duration: 3000
		})
	},
	requestRest: function(requestPak, url, sn, en, isLogin = false) {
		uni.request({
			method: "post",
			header: {
				'content-type': 'application/json' // 默认值
			},
			url: config.contextPath + url,
			data: requestPak,
			success: function(responsePak) {
				if (responsePak.statusCode == 200) {
					if (responsePak.data.code == 200) {
						//请求成功
						if (sn) {
							let temp_data = {
								resultBody: responsePak.data.data
							}
							if (responsePak.data.ok) {
								//请求成功
								sn(temp_data);
							} else {
								if (en) {
									en(responsePak.data.message);
								}
								//请求失败
							}
						}
					} else {
						if (en) {
							en(responsePak.data.message);
						}
					}
				} else {
					//请求失败
				}

			},
			fail: function(responsePak) {
				if (en) {
					en(responsePak);
				} else {
					console.log("登录失败");
				}
			}
		})
	},
	messageConfirm: function(message) {
		var postpromise = new Promise(function(resolve, reject) {
			uni.showModal({
				title: '提示',
				content: message,
				success(res) {
					if (res.confirm) {
						resolve(true);
					} else if (res.cancel) {
						resolve(false);
					}
				},
				fail(fres) {
					reject(fres);
				}
			})
		})
		return postpromise;
	},
	request: function(that, url, userdata, loading) {
		let self = this;
		let promise = new Promise((resolve, reject) => {
			uni.request({
				method: "POST",
				url: config.contextPath + url,
				data: JSON.stringify(userdata),
				success: function(res) {
					let data = res.data;
					resolve(data);
				},
				fail: (fres) => {
					self.message("网络中断或服务不存在");
					console.log(fres);
					reject(fres);
				},
				complete: () => {
					if (loading !== false) {
						self.hideLoading();
					}
				}
			})
		});
		return promise;
	},
	taskRequest(taskid) {
		console.log("utility中的:", taskid);
		let requestPak = this.createRequestPak()
		requestPak.requestBody = {
			jobId: taskid,
			memberId: uni.getStorageSync("user").id
		}
		this.request(this, '/course/user/completeJob', requestPak, true)
			.then(res => {
				if (res.ok) {
					let tempTask = uni.getStorageSync("task");
					tempTask[taskid] = true;
					uni.setStorageSync("task", tempTask);
				}
			})
	},
	isNullOrWhiteSpace: function(val) {
		if (val === undefined || val === null || val === "" || val.length === 0) {
			return true;
		} else {
			return false;
		}
	},
	//zrm update
	formatDate(add = 0) {
		let date = new Date();
		let year = date.getFullYear() + add;
		let month = (date.getMonth() + 1 + "").padStart(2, '0');
		let day = (date.getDate() + "").padStart(2, '0');
		return year + "-" + month + "-" + day;
	},
	//前一天日期
	formatPreDate() {
		let date = new Date();
		let preDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);
		let year = preDate.getFullYear() + "";
		let month = (preDate.getMonth() + 1 + "").padStart(2, '0');
		let day = (preDate.getDate() + "").padStart(2, '0');
		return year + "-" + month + "-" + day;
	},
	setLastPageData(obj, ceng = 1) {
		let pages = getCurrentPages();
		let page = pages[pages.length - 1 - ceng];
		for (let item in obj) {
			page.$vm[item] = obj[item]
		}
	},
	verifyPhone(mobile) {
		if ((/^1[3456789]\d{9}$/.test(mobile))) {
			return true;
		} else {
			this.message("手机号有误，请重填");
			return false;
		}
	},
	//页面跳转----------------------------------------
	jumpTo(url, param = {}) {
		let keys = Object.keys(param);
		if (keys.length == 0) {
			uni.navigateTo({
				url: url
			})
			return;
		}
		let tempUrl = '';
		for (let item of keys) {
			tempUrl += `${item}=${param[item]}&`
		}
		let endUrl = `${url}?${tempUrl}`.substr(0, `${url}?${tempUrl}`.length - 1);
		uni.navigateTo({
			url: endUrl
		})
	},

	//唤起微信支付
	callWxPay(timeStamp, nonceStr, prepay_id, paySign) {
		return new Promise((resolve, reject) => {
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: timeStamp,
				nonceStr: nonceStr,
				package: 'prepay_id=' + prepay_id,
				signType: 'HMAC-SHA256',
				paySign: paySign,
				success: (res) => {
					console.log("支付成功");
					resolve(res)
				},
				fail: (err) => {
					console.log(err);
					reject(err)
				}
			});
		})
	},
	irRegular(str, type, returnType, message) {
		/*
		 *	str 传入的值 String  
		 *	type 替换类型 String ('Number', 'Letter' ,'Sign', 'Emoji' ,'All')
		 * 	returnType 返回类型 String('Boolean', 'String')
		 *	message 提示类型 String
		 */
		let str_temp;
		//const emojiRegex = require('emoji-regex');
		// const emojiRegex = require('emoji-regex');
		const regex = emojiRegex();
		const match = regex.exec(str);
		switch (type) {
			case 'Number':
				str_temp = str.replace(/\d/g, '');
				break;
			case 'Sign':
				str_temp = str.replace(/[`～*~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '');
				break;
			case 'Letter':
				str_temp = str.replace(/[A-Za-z]/g, '');
				break;
			case 'Emoji':
				str_temp = str.replace(match[0], "")
				break;
			case 'All':
				str_temp = str.replace(match[0], "")
				str_temp = str_temp.replace(/[`～*~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、\w]/g, '');
				break;
		}
		if (str !== str_temp) {
			if (message) {
				this.message(message);
			}
			return returnType === 'Boolean' ? true : str_temp;
		} else {
			return returnType === 'Boolean' ? false : str_temp;
		}
	}
};
