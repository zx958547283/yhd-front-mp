<template>
	<web-view :src="url"></web-view>
</template>

<script>
	export default{
		onLoad(option) {
			this.url = JSON.parse(decodeURIComponent(option.imgUrl)) 
			console.log(this.url)
		},
		data(){
			return {
				url:''
			}
		}
	}
</script>

<style>
</style>
