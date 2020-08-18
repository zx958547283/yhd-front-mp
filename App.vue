<script>
	export default {
		onLaunch: function() {
				// debugger
				 const updateManager = uni.getUpdateManager()
				    updateManager.onCheckForUpdate(function (res) {
				      // 请求完新版本信息的回调
				        console.log(res.hasUpdate)
				    })
				    // 下载新版本
				    updateManager.onUpdateReady(function () {
				        uni.showModal({
				            title: '更新提示',
				            content: '新版本已经准备好，是否重启应用？',
				            success(res) {
				                if (res.confirm) {
				                    // 重启应用
				                    updateManager.applyUpdate()
				                }
				            }
				        })
				    })
				    // 新版本下载失败
				    updateManager.onUpdateFailed(function (res) {
						// 新的版本下载失败
						      uni.showModal({
						        title: '已经有新版本了哟~',
						        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
						      })
				     
				    })
			},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
	console.log(process.env.NODE_ENV,'process.env.NODE_ENV')
</script>

<style>
	/*每个页面公共css */
	@import url("resources/css/common.css");
	
	/*公共字体 */
	/* @font-face {
		font-family: Alternate_Becker_3;
		src: url(resources/font/alternate_becker.ttf);
	}
	@font-face {
		font-family: Avenir;
		src: url(resources/font/AvenirLTStd-Heavy.otf);
	} */
</style>
