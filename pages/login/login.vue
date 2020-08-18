<template>
	<view class="box">
		<view class="logo">
			<image src="/static/login/login_logo.png" mode="aspectFit"></image>
		</view>
		<view class="info">
			<form>
				<ul>
					<li>
						<view class="area">+86
							<i></i>
						</view>
						<input type="number" placeholder="请输入手机号" class="phone" v-model.lazy="phone" maxlength="13" @focus="phoneIn"
						 @blur="phoneOut" />
						<view class="emptyBg" @click="emptyClick">
							<view class="empty" v-show="empty"></view>
						</view>
					</li>
					<li>
						<input type="number" placeholder="请输入验证码" v-model.number="proving" />
						<view class="proving" @click="check" v-if="checkflag">发送验证码</view>
						<view class="non_proving" v-else>重新发送({{ time + 's' }})</view>
					</li>
				</ul>
				<button @click="sign" :class="phone != '' && proving != ''?'active':''" style="width: 572rpx;">登 录</button>
			</form>
		</view>
		<view class="bg">
			<image src="../../static/login/login_bg.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	import pakTool from '../../common/utils/utility.js'
	export default {
		data() {
			return {
				phone: "",
				proving: "",
				empty: false,
				time: 30,
				checkflag: true
			};
		},
		onShow() {
			wx.hideHomeButton()
		},
		onLoad() {
			var {
				id
			} = uni.getStorageSync('user');
		},
		watch: {
			// 监听phone
			phone(newValue, oldValue) { 
				if (newValue.length > oldValue.length) {
					this.phone = newValue.replace(/\s/g, '').replace(/(\d{3})(\d{0,4})(\d{0,4})/, '$1 $2 $3')
				} else {
					this.phone = this.phone.trim()
				}
			}
		},
		methods: {
			// 手机号获得焦点
			phoneIn: function() {
				this.empty = true;
			},
			// 手机号失去焦点
			phoneOut: function() {
				if (this.phone == "") {
					this.empty = !this.empty;
				}
			},
			// 清空手机号
			emptyClick: function() {
				this.phone = "";
				this.empty = !this.empty;
			},
			// 获取验证码
			check() {
				let phone = this.phone.replace(/\s+/g,"");
				let oldTime = this.time;
				// 手机号正则
				if (!/^1[3456789]\d{9}$/.test(phone)) {
					uni.showToast({
						title: "手机号码有误，请重填",
						icon: "none",
						duration: 2000
					});
					return false;
				}
				let requestPak = pakTool.createRequestPak();
				console.log(requestPak)
				requestPak.requestBody = {
					phone: this.phone.replace(/\s+/g,"")
				}
				pakTool.request(this, '/customerApp/sendIdentifyingCode', requestPak).then(res => {
					const {
						data
					} = res
					this.checkflag = false;
					uni.showToast({
						title: "已发送，请稍等",
						icon: "success",
						duration: 2000
					});
					clearInterval(this.interval);
					let interval = setInterval(() => {
						if (this.time <= 1) {
							clearInterval(this.interval);
							this.checkflag = true;
							this.time = oldTime;
						}
						this.time--;
					}, 1000);
				})

			},
			// 登录
			sign() {
				if (this.phone == "" && this.proving == "") {
					return false;
				}
				var {
					id
				} = uni.getStorageSync('user');
				let requestPak = pakTool.createRequestPak();
				console.log(requestPak)
				requestPak.requestBody = {
					phone: this.phone.replace(/\s+/g,""),
					identifyingCode: this.proving,
					member_id: id
				}
				pakTool.request(this, '/customerApp/loginByPhone', requestPak).then(res => {
					const {
						data,
						code,
						message
					} = res
					if (code == 200) {
						uni.showToast({
							title: '登录成功',
							type: 'success'
						})
						// 将用户类别存入本地
						uni.setStorageSync('admin_user', data)
						uni.setStorageSync('phone', this.phone.replace(/\s+/g,""))
						uni.setStorageSync('plan_time', [])
						// 存入vuex
						this.$store.commit('saveadmin', data)
						uni.reLaunch({
							url: '/pages/home/home'
						})
					} else {
						uni.showToast({
							title: message,
							icon: 'none'
						})
					}
				})

			}
		}
	};
</script>

<style lang="less" scoped>
	.box {
		overflow: hidden;

		// logo
		.logo {
			display: flex;
			justify-content: center;
			margin: 51rpx 80rpx;

			image {
				width: 158rpx;
				height: 228rpx;
			}
		}

		// 表单
		.info {
			display: flex;
			justify-content: center;

			form {
				width: 545rpx;
			}

			ul {
				li {
					display: flex;
					align-items: center;
					justify-content: flex-start;
					border-bottom: 2rpx solid #a4a4a4;

					// 表单input
					input {
						font-size: 34rpx;
						color: #333;
						line-height: 48rpx;
					}

					.area {
						color: #c59a76;
						font-size: 30rpx;
						width: 80rpx;
						display: flex;
						justify-content: space-between;
						align-items: center;

						/* 电话区号 */
						i {
							display: block;
							background: url(../../static/login/login_gt.png) no-repeat;
							background-size: 100%;
							width: 10rpx;
							height: 19rpx;
							margin-top: 6rpx;
						}
					}

					// 手机号
					.phone {
						padding: 0 20rpx;
					}

					// 清空手机号
					.emptyBg {
						width: 21rpx;
						height: 21rpx;

						.empty {
							background: url(../../static/login/login_empty.png) no-repeat;
							background-size: 100%;
							width: 21rpx;
							height: 21rpx;
						}
					}

					// 验证码
					.proving {
						color: #c59a76;
						font-size: 30rpx;
						width: 40%;
					}

					.non_proving {
						color: #999999;
						font-size: 30rpx;
						width: 40%;
					}
				}
			}

			// 登录按钮
			form button {
				background: #cccccc;
				margin-top: 80rpx;
				border-radius: 41rpx;
				color: #fff;
				font-size: 34rpx;
			}

			form button.active {
				background: #c59a76;
			}
		}

		// 背景
		.bg {
			position: absolute;
			bottom: 0;
			left: 0;
		}
	}
</style>
