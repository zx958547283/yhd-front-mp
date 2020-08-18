<template>
  <view class="condition">
    <!-- 用户信息 -->
    <view class="arc_top">
      <view class="cir" v-if="userImage!=''">
        <image :src="userImage"></image>
      </view>
      <view class="cir" v-if="userImage==''" style="font-weight:700;width:130rpx;height:130rpx;margin-bottom: 20rpx;border-radius: 50%;line-height: 130rpx;text-align: center;background-color: #F2F2F2;">
        {{userName.substr(0,1)}}
      </view>
      <view class="cum">
        <view class="row" :style="mar==true?'margin-top:30rpx;':''">
          <text class="name">{{userName}}</text>
          <text class="sex">{{userSex==1?'男':(userSex==2?'女':'')}}</text>
          <text>{{userPhone}}</text>
        </view>
        <view class="squ" v-if="tagarr.length!=0">
          <view class="fir" v-if="tagarr[0].name!=null&&tagarr[0]">
            {{tagarr[0].name}}
          </view>
          <view class="mid" v-if="tagarr[1].name!=null&&tagarr[1]">
            {{tagarr[1].name}}
          </view>
          <view class="las" v-if="tagarr[2].name!=null&&tagarr[2]">
            {{tagarr[2].name}}
          </view>
        </view>
      </view>
    </view>
    <view class="body-info">
      <!-- 项目类型 -->
      <view class="box-style">
        <uni-list>
          <uni-list-item title="" note="">
            <view class="flex" @click="projectChange" style="border-bottom: 0;">
              <i></i>
              <view style="font-weight: 700;">项目类型<text class="required">*</text></view>
              <view class="text">
                <!-- {{ project_list[0].name }} -->
                元化灸
              </view>
              <!-- <uni-icons type="arrowright" color="#858585" size="30"></uni-icons> -->
            </view>
          </uni-list-item>
        </uni-list>
      </view>
      <!-- 症状 -->
      <view class="box-style">
        <uni-list>
          <uni-list-item title="" note="">
            <view class="flex" @click="symptomChange" style="border-bottom: 0;">
              <i></i>
              <view style="font-weight: 700;">症状<text class="required">*</text></view>
              <view class="text">
              </view>
              <uni-icons type="arrowright" color="#858585" size="30"></uni-icons>
            </view>
          </uni-list-item>
          <view v-if="target.symptom.length != 0 ? true : false" style="padding: 0 30rpx;margin-top: 10rpx;">
            <view class="symptom" style="border-top:1rpx solid #eeeeee;">
              <text v-for="(item,index) in target.symptom" :key='index' :style="item.length>10?'width:100%':''">
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
      <view class="box-style" v-if="target.symptom.length != 0 ? true : false">
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
              <view class="head" style="margin: 30rpx 0 20rpx 0;">通</view>
              <text>以华佗夹脊穴为核心的经络疏通</text>
            </view>
          </uni-list-item>
          <uni-list-item>
            <view style="width:100%; padding-bottom:30rpx; border-bottom: 1rpx solid #eeeeee;">
              <view class="head">排</view>
              <text>推拿、按揉背部膀胱经、肩胛部及手少阳三焦经排出瘀堵的寒湿</text>
            </view>
          </uni-list-item>
          <uni-list-item>
            <view style="width:100%; padding-bottom:30rpx; border-bottom: 1rpx solid #eeeeee;">
              <view class="head">调</view>
              <view class="choice">
                <view class="choice_radio" v-for="(item) in acupoint_list" :key='item'>
                  <view class="" @click="acupointChange(item.id)" style="display: inline-block;">
                    <image :src="acupoint_sure.includes(item.id)?active:none">
                    </image>
                    <text>{{ item.acupoint_name }}</text>
                  </view>
                  <view @click="acu(item.img)" class="acu_img">查 看</view>
                </view>
              </view>
            </view>
          </uni-list-item>
          <uni-list-item>
            <view style="width:100%; padding-bottom:30rpx; border-bottom: 1rpx solid #eeeeee;">
              <view class="head">补</view>
              <uni-list title="" note="">
                <view style="color: #333333; font-size: 30rpx;margin-bottom: 8rpx;font-weight: 700;">贴敷部位</view>
              </uni-list>
              <view class="choice">
                <view class="all_sel">
                  <view class="sel" v-for="(item,index) in parts_list" :key='index' @click="partsChange(item.def_list_id)" :class="parts_sure.includes(item.def_list_id)?'active':'none'">
                    <text>{{ item.name }}</text>
                  </view>
                </view>
              </view>
            </view>
          </uni-list-item>
          <uni-list-item v-if='product_list.length!=0'>
            <view style="width:100%; padding-bottom:20rpx;">
              <view class="head" v-if="target.symptom.length != 0 ? true : false">养</view>
              <uni-list title="" note="">
                <view style="color: #333333; font-size: 30rpx;margin-bottom: 8rpx;font-weight: 700;">调理产品</view>
              </uni-list>
              <view style="width:100%;">
                <view class="choice">
                  <view class="choice_radio" v-for="(item,index) in product_list" :key='index' @click="productChange(item.id)">
                    <image :src="product_sure.includes(item.id)?active:none">
                    </image>
                    {{ item.name }}
                  </view>
                </view>
              </view>
            </view>
          </uni-list-item>
        </uni-list>
      </view>
      <!-- 生成方案 -->
      <button class="save" @click="save" :disabled="disabled">{{revise==true?'保存':'生成方案'}}</button>
    </view>
    <!-- 弹窗 -->
    <uni-popup ref="popup" type="center" maskClick="true" mainClick="true">
      <view class="pop">
        <!-- <image :src="img_path" mode=""></image> -->
        <movable-area scale-area>
          <movable-view direction="all" @scale="onScale" scale="true" scale-min="1" scale-max="4" :scale-value="scale">
            <image :src="img_path" mode="widthFix"></image>
          </movable-view>
        </movable-area>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import uniIcons from "@/components/uni-icons/uni-icons.vue";
import utility from "@/common/utils/utility.js";
import uniPopup from "@/components/uni-popup/uni-popup.vue";
import pakTool from "../../common/utils/utility.js";
export default {
  components: {
    uniIcons,
    uniPopup,
  },
  onLoad(option) {
    console.log(option);
    this.add = option.add;
    this.getlist();
    // 修改
    if (option.his || option.revise) {
      console.log("执行了修改");
      this.userImage = this.$store.state.form.head;
      this.userName = this.$store.state.form.name;
      this.userSex = this.$store.state.form.sex;
      this.userPhone = this.$store.state.form.phone;
      this.tagarr = this.$store.state.form.tagarr;
      if (this.tagarr.length == 0) {
        this.mar = true;
      }
      this.care_plan_id = option.his;
      this.exc_key = "exc_key";
      this.revise = true;
      console.log(this.revise);
      this.getedit();
      return;
    }
    // 新增
    if (option.add) {
      console.log("执行了新增");
      this.userImage = this.$store.state.form.head;
      this.userName = this.$store.state.form.name;
      this.userSex = this.$store.state.form.sex;
      this.userPhone = this.$store.state.form.phone;
      this.tagarr = this.$store.state.form.tagarr;
      if (this.tagarr.length == 0) {
        this.mar = true;
      }
      return;
    }
  },
  onShow() {
    console.log("onshow");
    console.log(this.target.symptom);
    // 判断有没有选择症状 如果选择症状之后 回来之后马上调用接口 展示穴位
    if (this.target.symptom.length != 0 && this.target.symptom_id.length != 0) {
      this.getpoint();
      console.log(this.back);
      // 清空之前数据
      if (this.back == 1) {
        //如果上一页点击的是保存 则清空数据
        this.acupoint_sure.length = 0;
        this.product_sure.length = 0;
        this.parts_sure.length = 0;
        this.back = 0;
      }
    }
  },
  data() {
    return {
      fix: "", // 修改时传来的数据
      add: "",
      userImage: "",
      userName: "",
      userSex: "",
      userPhone: "",
      tagarr: [],
      project_list: [], //护理名称
      // 没选中
      none: "../../static/images/danxuan-2@2x.png",
      // 选中
      active: "../../static/images/system-complete@2x.png",
      // 产品
      product_sure: [], // 产品id 传后台用
      product_list: [], // 产品名称
      // 穴位
      acupoint_sure: [], //调 穴位id 传后台用
      acupoint_list: [], // 穴位名称
      // 部位
      parts_sure: [], // 部位id 传后台用
      parts_list: [], // 部位名称
      // 接收病症选择数据
      target: {
        symptom: [], //传回的名字 展示时用
        symptom_id: [], //传回的id 提交时用
        remarks: "",
      },
      // 检测是否是修改
      revise: false,
      care_plan_id: "",
      exc_key: "", // 修改时用
      disabled: false, // 防抖
      img_path: "",
      back: 0, //确认是否由保存跳转
      mar: false,
    };
  },
  methods: {
    // 切换项目
    projectChange() {
      console.log("点击切换项目");
    },
    // 症状
    symptomChange() {
      console.log(this.target.symptom_id, "选择症状");
      uni.navigateTo({
        url:
          "/pages/symptom/symptom?mady=" +
          this.target.symptom_id +
          "&name=" +
          this.target.symptom,
      });
    },
    // 选择产品
    productChange(e) {
      if (this.product_sure.indexOf(e) == -1) {
        this.product_sure.push(e);
      } else {
        this.product_sure.splice(this.product_sure.indexOf(e), 1);
      }
    },
    // 选择穴位
    acupointChange(e) {
      if (this.acupoint_sure.indexOf(e) == -1) {
        this.acupoint_sure.push(e);
      } else {
        this.acupoint_sure.splice(this.acupoint_sure.indexOf(e), 1);
      }
    },
    // 选择部位
    partsChange(e) {
      if (this.parts_sure.indexOf(e) == -1) {
        this.parts_sure.push(e);
      } else {
        this.parts_sure.splice(this.parts_sure.indexOf(e), 1);
      }
    },
    // 点击查看图片
    acu(img) {
      this.img_path = img;
      this.$refs.popup.open();
    },
    // 生成方案/修改
    save() {
      if (this.target.symptom_id.length == 0) {
        uni.showToast({
          icon: "none",
          title: "请选择症状",
        });
        return false;
      }
      if (this.parts_sure.length == 0) {
        uni.showToast({
          icon: "none",
          title: "请选择贴敷部位",
        });
        return false;
      }
      if (this.disabled) {
        return;
      }
      this.disabled = true;
      //生成
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        care_project_id: this.project_list[0].def_list_id, //护理项目id
        care_project_name: this.project_list[0].name, //理疗项目名称
        member_id: this.add,
        plan_times: this.parts_sure.length, //疗程
        malady: this.target.symptom_id.toString(), //病状id
        t_content: "以华佗夹脊穴为核心的经络疏通", //通
        p_content: "推拿、按揉背部膀胱经、肩胛部及手少阳三焦经 排出瘀堵的寒湿", //排
        b_content: this.parts_sure.toString(), //补
        y_content: this.product_sure.toString(), //养
        points: this.acupoint_sure.toString(), //调
        care_plan_id: this.care_plan_id,
        exc_key: this.exc_key,
      };
      pakTool
        .request(this, "/madyApp/saveMemberCarePlan", requestPak)
        .then((res) => {
          const { data, code, message } = res;
          // 生成
          if (code == 200) {
            //  如果新增
            if (this.exc_key == "") {
              var that = this;
              uni.showToast({
                title: "数据上传成功",
                success: function () {
                  uni.redirectTo({
                    url: "/pages/plan/plan?add=" + that.add,
                  });
                },
              });
              return;
            }
            // 如果修改跳回上级
            if (this.exc_key != "") {
              const { data, code } = res;
              var pages = getCurrentPages();
              var currPage = pages[pages.length - 1]; //当前页面
              var prevPage = pages[pages.length - 2]; //上一个页面
              // #ifdef H5
              prevPage.back = 1;
              // #endif
              // #ifndef H5
              prevPage.$vm.back = 1;
              // #endif
              uni.navigateBack({
                delta: 1,
              });
              return;
            }
          } else {
            uni.showToast({
              title: "数据上传失败",
              icon: "none",
            });
            this.disabled = false;
          }
        });
    },
    // 获取症状
    getlist() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        member_id: this.add,
      };
      pakTool
        .request(this, "/madyApp/getStartCarePlan", requestPak)
        .then((res) => {
          const { data } = res;
          this.parts_list = data.bodyCare;
          this.product_list = data.goodsLis;
          this.project_list = data.careProjects;
        });
    },
    // 获取穴位
    getpoint() {
      var list = [];
      this.target.symptom.map((item) => {
        list.push(item);
      });
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        selectedMalady: list.toString(),
      };
      pakTool
        .request(this, "/madyApp/getMaladyPoint", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":[{"img":"http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201521268735435.png","acupoint_name":"曲池","id":"0dd6b171-477f-4452-9169-0c7359704932","cure_content":"点按9次","content":"属手阳明大肠经。位于手肘关节弯曲凹陷处。主治：肩痛、腹痛腹泻、头痛眩晕、牙齿痛、目赤痛。"},{"img":"http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201519335713395.png","acupoint_name":"百会","id":"3","cure_content":"按揉9次","content":"属督脉。位于头顶正中线与两耳尖连线的交叉处。主治：头痛、耳鸣、中风、脱肛"},{"img":"http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201559318174680.png","acupoint_name":"涌泉","id":"353536b7-381d-4671-b5ab-5cca34b00018","cure_content":"按揉9次","content":"属足少阴肾经。位于足底前1/3的正中凹陷处。主治：头痛头晕、神志病患、便秘、小便不利"},{"img":"http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201529143463759.png","acupoint_name":"足三里","id":"4","cure_content":"点按9次","content":"属足阳明胃经。位于腿膝盖骨外侧下方凹陷（外膝眼）往下约4指（三寸）宽处。主治：胃肠病症、心悸气短、头晕、虚劳诸症"},{"img":"http://xiaode.oos-cn.ctyunapi.cn/20200720/png/yhd/upload/202007201520355421966.png","acupoint_name":"推桥弓","id":"892bba7d-7e81-45a8-b9d5-812ce57a567a","cure_content":"手掌推桥弓3次","content":"是指颈部翳风（耳垂后下缘的凹陷）至缺盆（锁骨上窝中央）的连线。"}]}
          const { data } = res;
          this.acupoint_list = data;
        });
    },
    // 获取编辑之前的数据
    getedit() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        care_plan_id: this.care_plan_id,
      };
      pakTool
        .request(this, "/madyApp/getCarePlanDetail", requestPak)
        .then((res) => {
          console.log(res, 555);
          var maarr = [];
          res.data.maladys.map((item) => {
            maarr.push(item.name);
          });
          this.target.symptom = maarr; //将症状名放入数组
          res.data.maladys.map((item) => {
            this.target.symptom_id.push(item.id); //添加症状id
          });
          res.data.points.map((item) => {
            this.acupoint_sure.push(item.id); //添加穴位id
          });
          res.data.selectBuList.map((item) => {
            this.parts_sure.push(item.id); // 添加部位
          });
          res.data.products.map((item) => {
            // 添加产品
            this.product_sure.push(item.id);
          });
          // 请求穴位
          // var arr = []
          let requestPak = pakTool.createRequestPak();
          requestPak.requestBody = {
            selectedMalady: maarr.toString(),
          };
          pakTool
            .request(this, "/madyApp/getMaladyPoint", requestPak)
            .then((res) => {
              console.log(res.data, 88888888); //所有穴位
              res.data.map((item) => {
                this.acupoint_list.push(item);
              });
            });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.condition {
  font-size: 30rpx;
  min-height: 100%;

  // 用户信息
  .arc_top {
    height: 200rpx;
    background: linear-gradient(#ffffff, #f3f3f3);
    padding: 0 40rpx;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;

    .cir {
      height: 110rpx;
      width: 110rpx;
      border-radius: 50%;
      margin-top: 40rpx;
      float: left;
      overflow: hidden;
      font-size: 34rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }

    .cum {
      float: left;
      margin-top: 40rpx;
      margin-left: 30rpx;

      .row {
        height: 65rpx;

        .name {
          font-size: 34rpx;
          font-weight: 700;
          margin-right: 30rpx;
        }

        .sex {
          margin-right: 30rpx;
        }
      }

      .squ {
        view {
          display: inline-block;
          padding: 2rpx 15rpx;
          border-radius: 10rpx;
          color: white;
          font-size: 28rpx;
          // border: 1px solid #333;
        }

        .fir {
          background-color: #c59a76;
          margin-right: 13rpx;
        }

        .mid {
          background-color: #f9a94c;
          margin-right: 13rpx;
        }

        .las {
          background-color: #eb7054;
          margin-right: 13rpx;
        }
      }
    }
  }

  // 信息
  .body-info {
    display: flex;
    flex-wrap: wrap;
    padding: 50rpx 30rpx;

    .box-style {
      border-radius: 10rpx;
      box-shadow: 0px 2px 12px 6px rgba(133, 133, 133, 0.1);
      margin-bottom: 20rpx;
      width: 100%;
      position: relative;

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
              margin: 20rpx 0;

              image {
                width: 36rpx;
                height: 36rpx;
                vertical-align: middle;
                margin-right: 20rpx;
              }

              .acu_img {
                padding: 3rpx 10rpx;
                display: inline-block;
                border: 2rpx solid #c59a76;
                border-radius: 10rpx;
                font-size: 24rpx;
                color: #c59a76;
                margin-left: 30rpx;
              }
            }

            // 选择部位
            .all_sel {
              display: flex;
              justify-content: flex-start;
              flex-wrap: wrap;

              .sel {
                width: 30%;
                height: 64rpx;
                text-align: center;
                border-radius: 40rpx;
                line-height: 64rpx;
                // margin: 0 8rpx 30rpx;
                margin: 40rpx 20rpx 0 0;
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
            }
          }
        }

        // 详细病症
        .symptom {
          display: flex;
          flex-wrap: wrap;
          padding-bottom: 10rpx;
          padding-top: 10rpx;

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

    // 保存按钮
    .save {
      width: 100%;
      background: #c59a76;
      color: #fff;
      border-radius: 42rpx;
      margin: 20rpx;
    }
  }

  //弹窗
  .pop {
    width: 600rpx;
    height: 700rpx;
    background-color: #ffffff;
    border-radius: 20rpx;

    image {
      width: 100% !important;
      height: 100% !important;
    }

    .sus_txt {
      font-size: 34rpx;
      color: #c59a76;
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .bo_y {
    border-bottom: 1rpx solid #eeeeee !important;
  }

  .bo_n {
    border-bottom: 0 !important;
  }

  movable-view {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  movable-area {
    height: 100%;
    width: 100%;
    position: fixed;
    overflow: hidden;
    border-radius: 10rpx;
  }

  movable-view image {
    width: 100%;
  }
}
</style>
