<template>
	<view v-if="showPopup" class="uni-popup one" @touchmove.stop.prevent="clear" @click="hide">
		<view :show="showTrans" @click.stop="onTap" class="two">
			<slot />
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniPopup',
		props: {
			// maskClick
			maskClick: {
				type: Boolean,
				default: false
			},
			mainClick: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				showPopup: false,
				showTrans: false,
			}
		},
		methods: {
			hide() {
				if (this.maskClick == true) {
					this.showPopup = false;
					console.log(2)
				}
			},
			clear(e) {
				// TODO nvue 取消冒泡
				e.stopPropagation()

			},
			open() {
				this.showPopup = true
				this.showTrans = true
			},
			close(type) {
				this.showTrans = false
				this.showPopup = false
			},
			onTap() {
				if (this.maskClick==true&&this.mainClick==true) {
					return
				}
				this.close()
			}
		}
	}
</script>
<style lang="scss" scoped>
	.uni-popup {
		// backgroundColor: 
		background-color: rgba(0, 0, 0, 0.4);
		position: fixed;
		/* #ifdef H5 */
		top: var(--window-top);
		/* #endif */
		/* #ifndef H5 */
		top: 0;
		/* #endif */
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 99;
		/* #ifndef APP-NVUE */
		z-index: 99;
		/* #endif */
	}
	.two {
		position: absolute;
		left: 50%;
		top: 40%;
		transform: translate(-50%, -50%);
		z-index: 99999;
	}
</style>
