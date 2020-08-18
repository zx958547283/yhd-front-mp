<template>
  <view class="box">
    <!-- 顶部搜索、tab区域 -->
    <uni-search-bar @ser='ser' placeholder="姓名/电话" :radius="100" :cancelButton="none" @confirm="search"></uni-search-bar>
    <!-- tab内容部分 -->

    <view style="color: #696969; text-align: center; margin-top:30rpx;">
      共 {{ amount }} 名健康专员
    </view>

    <view class="main" v-if="currenttab==0">
      <view class="detail" v-for="(item,index) in clist" :key='item.id' @click="fix(item.id, item.username, item.mobile)">
        <!-- 姓名电话 -->
        <view class="infor">
          <view class="name">姓名:&nbsp;{{ item.username }}</view>
          <view class="number">电话:&nbsp;{{ item.mobile }}</view>
        </view>
        <view class="number_per">
          <view class="number_per01">客户数:{{ item.customerCnt == null ? 0 : item.customerCnt }}</view>
          <view :class="item.status == 'Y' ? 'status_n' : 'status_y'" @click.stop="open(item.id,item.status,index)">
            {{ item.status=='Y' ? '禁用' : '启用'}}</view>
        </view>
      </view>

      <!-- 搜索为空 -->
      <view class="none" v-if="clist.length==0">
        <view class="img">
          <image src="../../static/images/none.png" mode=""></image>
        </view>
        <view class="txt">
          暂无数据
        </view>
      </view>
    </view>
    <uni-popup ref="popup" type="center">
      <view class="pop">
        <view class="sus_txt">
          {{status=='Y'?'禁用':'启用'}}
        </view>
        <view class="con_txt">
          您确定要{{status=='Y'?'禁用':'启用'}}该用户吗？
        </view>
        <view class="btm">
          <view class="yes" @click.stop="change(id,status)">
            确定
          </view>
          <view class="no" @click.stop="close">
            取消
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniSearchBar from "@/components/uni-search-bar/uni-search-bar.vue";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import pakTool from "@/common/utils/utility.js"; // 调用接口
export default {
  components: {
    uniSearchBar,
    uniPopup
  },
  onReady() {
    // 获取所有健康专员信息
    this.getHealthers();
  },
  //下拉刷新
  onPullDownRefresh() {
    console.log(1);
  },
  //上拉加载
  onReachBottom() {
    if (this.clist.length >= this.totalRows) {
      // 没有更多数据了，给一个提示，终止后续的接口调用
      uni.showToast({
        title: "没有更多数据了",
        icon: "none"
      });
      return;
    }
    // 加载下一页数据
    this.pageIndex = this.pageIndex + 1;
    // 页码加一后需要再次调用后台接口
    this.getmanage();
  },
  data() {
    return {
      currenttab: 0, //当前选中的tab
      amount: 0, // 人数
      clist: [
        // {
        //   code: "20002",
        //   company_id: "1",
        //   create_time: "2020-07-08 10:54:27.0",
        //   create_user: "a0732608-e9f8-408c-b20a-fb69c8bee1e4",
        //   customerCnt: null,
        //   depart_id: "a3a92fe5-69b6-4227-a9d4-e9c656c03f40",
        //   dr: "0",
        //   edit_time: "2020-07-16 17:33:03.0",
        //   edit_user: "1",
        //   email: null,
        //   exc_key: "3",
        //   icon: null,
        //   id: "68e54b58-b32a-43a8-9a16-63423afb290c",
        //   is_dealer: "0",
        //   is_healther: "1",
        //   is_server: "1",
        //   isadmin: "N",
        //   isdoctor: "1",
        //   login_time: null,
        //   mobile: "18842358742",
        //   nick_name: null,
        //   note: null,
        //   organization_id: "1",
        //   refresh_token: null,
        //   status: "Y",
        //   tmclound_userid: null,
        //   username: "分店店员"
        // }
      ],
      pageIndex: 0,
      totalRows: 0,
      id: "",
      status: "",
      index: 0
    };
  },
  computed: {},
  methods: {
    //获取用户列表
    getmanage() {
      this.clist = [...this.clist, ...res.data.tableData]; //合并列表页
      this.totalRows = res.data.pageParam.totalRows; //消息的总数量
    },
    // 获取健康专员数据
    getHealthers() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        is_who: "jkzy"
      };
      pakTool
        .request(this, "/madyApp/getEmployeeData", requestPak)
        .then(res => {
          let { data } = res;
          this.clist = data;
          this.amount = data.length;
        });
    },
    // 健康专员账号数据修改
    fix(id, username, mobile) {
      uni.navigateTo({
        // 健康专员id
        url:
          "/pages/mine/change?id=" +
          id +
          "&mobile=" +
          mobile +
          "&username=" +
          username
      });
      console.log(`健康专员id= ${id}, 手机号= ${mobile}, 姓名= ${username}`);
    },
    // 健康专员帐号状态样式更改
    change() {
      if (this.status == "Y") {
        this.clist[this.index].status = "N";
      } else {
        this.clist[this.index].status = "Y";
      }
      this.changeStatus(this.id, this.clist[this.index].status);
    },
    // 修改健康专员状态数据
    changeStatus(id, status) {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        employeeId: id, // 健康专员id
        status: status // 健康专员状态
      };
      pakTool
        .request(this, "/madyApp/saveEmployeeStatus", requestPak)
        .then(res => {
          const { data, code } = res;
          if (code == 200) {
            this.$refs.popup.close();
          }
        });
    },
    // 搜索
    search(e) {
      let value = e.value;
      let newClist = [];
      console.log(value);
      // 如果为空返回所有数据
      if (value == "") {
        this.getHealthers();
      }
      this.clist.map((item, index) => {
        // 根据 姓名 手机号 筛选
        if (
          this.clist[index].username.includes(value) ||
          this.clist[index].mobile.includes(value)
        ) {
          newClist.push(item);
        }
      });
      this.clist = newClist;
    },

    // 取消搜索 返回全部
    ser(val) {
      this.getHealthers();
    },
    close() {
      this.$refs.popup.close();
    },
    open(id, status, index) {
      this.id = id;
      this.status = status;
      this.index = index;
      this.$refs.popup.open();
    }
  }
};
</script>

<style lang="less" scoped>
.box {
  min-height: 100%;
  background-color: #f7f7f7;

  .main {
    padding: 30rpx;

    //列表栏样式
    .detail {
      height: 110rpx;
      background-color: #ffffff;
      padding: 36rpx;
      border-radius: 10rpx;
      margin-bottom: 20rpx;

      //头像样式
      .head_pic {
        width: 20%;
        height: 100rpx;
        border-radius: 50%;
        float: left;
        margin-right: 30rpx;

        image {
          width: 100%;
          height: 100%;
        }
      }

      //姓名、电话
      .infor {
        width: 70%;
        height: 100rpx;
        float: left;
        padding-top: 8rpx;

        .name {
          height: 45rpx;
          line-height: 45rpx;
		  margin-bottom: 15rpx;
        }

        .number {
          height: 45rpx;
          line-height: 45rpx;
        }
      }

      //客户数量 启用状态
      .number_per {
        float: right;
        width: 25%;

        // 启用
        .status_y {
          width: 136rpx;
          height: 50rpx;
          color: #ffffff;
          background-color: #c59a76;
          border-radius: 25rpx;
          margin-top: 17rpx;
          line-height: 50rpx;
          text-align: center;
        }

        // 禁用
        .status_n {
          width: 136rpx;
          height: 50rpx;
          color: #ffffff;
          background-color: #ff3b30;
          border-radius: 25rpx;
          margin-top: 17rpx;
          line-height: 50rpx;
          text-align: center;
        }
      }
    }

    //搜索为空
    .none {
      padding: 50rpx;

      .img {
        width: 550rpx;
        height: 406rpx;
        margin: 0 auto;

        image {
          width: 100%;
          height: 100%;
        }
      }

      .txt {
        text-align: center;
        margin-top: -50rpx;
      }
    }
  }
  //弹窗
  .pop {
    width: 605rpx;
    height: 463rpx;
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 20rpx;

    .sus_txt {
      font-size: 36rpx;
      color: #c59a76;
      margin-bottom: 70rpx;
    }

    .con_txt {
      margin-bottom: 90rpx;
    }

    .btm {
      .yes {
        width: 237rpx;
        height: 82rpx;
        line-height: 82rpx;
        text-align: center;
        background-color: #c59a76;
        color: #ffffff;
        border-radius: 44rpx;
        float: left;
        margin-right: 25rpx;
      }

      .no {
        width: 237rpx;
        height: 82rpx;
        line-height: 82rpx;
        text-align: center;
        background-color: #ffffff;
        color: #c59a76;
        border-radius: 44rpx;
        border: 1rpx solid #c59a76;
        float: left;
      }
    }
  }
}
</style>
