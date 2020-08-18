<template>
  <view class="box">
    <!-- 客户类型 -->
    <view class="box_one">
      <view class="box_title">
        <image src="../../static/images/huiyuan@2x.png" mode=""></image>客户类型
      </view>
      <view class="all_sel">
        <view class="sel" v-for="(item,index) in list" :key='index' @click="select(item.def_list_id,item)" :class="currentindex==item.def_list_id?'active':'none'">
          {{item.name}}
        </view>
      </view>
    </view>
    <!-- 客户级别 -->
    <view class="box_one">
      <view class="box_title">
        <image src="../../static/images/@2x.png" mode=""></image>客户级别
      </view>
      <view class="all_sel">
        <view class="sel" v-for="(item,index) in level_list" :key='index' @click="select_level(item.def_list_id,item)" :class="levelindex==item.def_list_id?'active_level':'none_level'">
          {{item.name}}
        </view>
      </view>
    </view>
    <!-- 客户状态 -->
    <view class="box_one">
      <view class="box_title">
        <image src="../../static/images/1@2x.png" mode=""></image>客户来源
      </view>
      <view class="all_sel">
        <view class="sel" v-for="(item,index) in state_list" :key='index' @click="select_state(item.def_list_id,item)" :class="stateindex==item.def_list_id?'active_state':'none_state'">
          {{item.name}}
        </view>
      </view>
    </view>
    <!-- 提交按钮 -->
    <button type="primary" class="btn" @click="send">提交</button>
  </view>
</template>

<script>
import pakTool from "../../common/utils/utility.js";
export default {
  onLoad(option) {
    // 如果是新增
    if (option.now) {
      this.gettag();
      this.send_arr = JSON.parse(option.now);
      this.currentindex = this.send_arr[0].def_list_id;
      this.levelindex = this.send_arr[1].def_list_id;
      this.stateindex = this.send_arr[2].def_list_id;
      this.tag1 = this.send_arr[0];
      this.tag2 = this.send_arr[1];
      this.tag3 = this.send_arr[2];
      console.log(this.currentindex);
      return;
    }
    // 如果是修改
    if (option.fix) {
      console.log(JSON.parse(option.fix));
      this.fix = JSON.parse(option.fix);
      // this.tag = option.fix
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {};
      pakTool
        .request(this, "/madyApp/getAllMemberTags", requestPak)
        .then((res) => {
          const { data } = res;
          this.list = data.tag1;
          this.level_list = data.tag2;
          this.state_list = data.tag3;
          this.tag = data;
          data.tag1.map((item) => {
            if (this.fix[0]) {
              if (item.name == this.fix[0].name) {
                this.currentindex = item.def_list_id;
                this.tag1 = item;
              }
            }
          });
          data.tag2.map((item) => {
            if (this.fix[1]) {
              if (item.name == this.fix[1].name) {
                this.levelindex = item.def_list_id;
                this.tag2 = item;
              }
            }
          });
          data.tag3.map((item) => {
            if (this.fix[2]) {
              if (item.name == this.fix[2].name) {
                this.stateindex = item.def_list_id;
                this.tag3 = item;
              }
            }
          });
        });
    }
  },
  mounted() {
    console.log(this.tag);
  },
  components: {},
  data() {
    return {
      currentindex: null, //类型
      levelindex: null, //级别
      stateindex: null, //状态
      list: [], //客户类型标签列表
      level_list: [], //客户等级标签列表
      state_list: [], //客户状态标签列表
      tag1: "", //选中的客户对象
      tag2: "", //选中的等级对象
      tag3: "", //选中的状态对象
      send_arr: [], // 传给前页面的选中的标签对象
      tag: {},
      fix: [],
      tagarr_fix: [],
    };
  },
  computed: {},
  methods: {
    select(id, item) {
      if (this.currentindex == id) {
        this.currentindex = null;
        this.tag1 = "";
      } else {
        this.currentindex = id;
        this.tag1 = item;
      }
    },
    select_level(id, item) {
      if (this.levelindex == id) {
        this.levelindex = null;
        this.tag2 = "";
      } else {
        this.levelindex = id;
        this.tag2 = item;
      }
    },
    select_state(id, item) {
      if (this.stateindex == id) {
        this.stateindex = null;
        this.tag3 = "";
      } else {
        this.stateindex = id;
        this.tag3 = item;
      }
    },
    //提交选项
    send() {
      if (this.tag1 == "" && this.tag2 == "" && this.tag3 == "") {
        // 如果没选 传回空
        this.tagarr_fix = [];
        this.send_arr = [];
      } else {
        // 如果选了 传回对象与id
        this.send_arr = [this.tag1, this.tag2, this.tag3];
        this.tagarr_fix = [
          this.tag1.def_list_id,
          this.tag2.def_list_id,
          this.tag3.def_list_id,
        ];
      }
      console.log(this.tagarr_fix);
      //将选中的标签传给上级页面
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1]; //当前页面
      var prevPage = pages[pages.length - 2]; //上一个页面
      // #ifdef H5
      prevPage.tagarr = this.send_arr;
      prevPage.tagarr_fix = this.tagarr_fix;
      // #endif
      // #ifndef H5
      prevPage.$vm.tagarr = this.send_arr;
      prevPage.$vm.tagarr_fix = this.tagarr_fix;
      // #endif
      uni.navigateBack({ delta: 1 });
    },
    // 获取标签列表
    gettag() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {};
      pakTool
        .request(this, "/madyApp/getAllMemberTags", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":{"tag1":[{"def_list_id":"9953ce44-a090-11ea-a951-506b4bc21cca","code":"bj","name":"白金","value":"白金","memo":null,"fix":null},{"def_list_id":"9f89080b-c59a-46e4-8bea-5ff30e04ece6","code":"cjvip","name":"超级VIP","value":"超级VIP","memo":null,"fix":"N"},{"def_list_id":"add657d4-a48a-4430-b966-a3550ecd7611","code":"zs","name":"钻石","value":"钻石","memo":null,"fix":"N"}],"tag2":[{"def_list_id":"b743c66c-a090-11ea-a951-506b4bc21cca","code":"ql","name":"潜力客户","value":"潜力客户","memo":null,"fix":null}],"tag3":[{"def_list_id":"cf115f03-a090-11ea-a951-506b4bc21cca","code":"cj","name":"线上","value":"线上","memo":null,"fix":"N"}]}}
          const { data } = res;
          this.list = data.tag1;
          this.level_list = data.tag2;
          this.state_list = data.tag3;
          this.tag = data;
        });
    },
  },
};
</script>

<style lang="less" scoped>
.box {
  background-color: #fff;
  min-height: 100%;
  padding: 30rpx;
  box-sizing: border-box;
  position: relative;
  font-size: 32rpx;
  .box_one {
    .box_title {
      margin-bottom: 30rpx;
      image {
        width: 36rpx;
        height: 36rpx;
        margin-right: 30rpx;
        vertical-align: middle;
      }
    }
    .all_sel {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .sel {
        width: 31%;
        height: 64rpx;
        text-align: center;
        border-radius: 40rpx;
        line-height: 64rpx;
        margin: 0 8rpx 30rpx;
        box-sizing: border-box;
      }
      .none {
        color: #c59a76;
        border: 2rpx solid #c59a76;
      }
      .active {
        color: white;
        background-color: #c59a76;
      }
      .none_level {
        color: #f9a94c;
        border: 2rpx solid #f9a94c;
      }
      .active_level {
        color: white;
        background-color: #f9a94c;
      }
      .none_state {
        color: #eb7054;
        border: 2rpx solid #eb7054;
      }
      .active_state {
        color: white;
        background-color: #eb7054;
      }
    }
  }
  .btn {
    width: 85%;
    margin: 0 auto;
    height: 80rpx;
    line-height: 70rpx;
    color: white;
    background-color: #c59a76;
    border-radius: 42rpx;
    position: absolute;
    left: 50%;
    bottom: 120rpx;
    transform: translate(-50%, -50%);
  }
}
</style>
