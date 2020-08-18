<template>
  <view class="symptom">
    <view class="tabone_mid">
      <view class="symptom">
        <view class="symptom_radio" v-for="item in symptom_list" :key="item.id" @click="symptom_radio(item.id, item.name)">
          <image :src="symptom_sure.includes(item.id) ? active : none"></image>
          <text class="cal_width">{{ item.name }}</text>
        </view>
      </view>
      <!-- <view class="quil">
				<textarea maxlength="50" @input="inp_remarks" v-model="remarks" placeholder="请输入其他症状~" />
				<view class="num">
					<span :class="remnant_remarks == 0 ? 'grey' : ''">{{ remnant_remarks }}</span>
					/50
				</view>
			</view> -->
      <button type="primary" @click="save">保存</button>
    </view>
  </view>
</template>
<script>
import pakTool from "../../common/utils/utility.js";
import Pinyin from "../../common/utils/index.js";
export default {
  onLoad(option) {
    this.getlist();
    console.log(option);
    if (option.mady.length != 0) {
      this.symptom_sure = option.mady.split(",");
      this.symptom_name = option.name.split(",");
      console.log(this.symptom_sure, "传过来的");
    }
  },
  data() {
    return {
      symptom_sure: [], //病史
      none: "../../static/images/danxuan-2@2x.png", //单选没选中
      active: "../../static/images/system-complete@2x.png", //单选选中
      symptom_list: [],
      symptom_name: [], //名称
      remarks: "", // 备注文字
      remnant_remarks: 0, // 备注文字限制
    };
  },
  methods: {
    // 病史checkbox
    symptom_radio(index, name) {
      if (this.symptom_sure.indexOf(index) == -1) {
        this.symptom_sure.push(index);
        this.symptom_name.push(name);
      } else {
        this.symptom_sure.splice(this.symptom_sure.indexOf(index), 1);
        this.symptom_name.splice(this.symptom_name.indexOf(name), 1);
      }
    },

    // 备注
    inp_remarks(e) {
      this.remnant_remarks = e.detail.value.length;
    },

    // 保存
    save(e) {
      console.log("保存", this.symptom_name);
      var obj = {
        symptom: this.symptom_name, // 传回的名字
        symptom_id: this.symptom_sure, //传回的id
        remarks: this.remarks,
      };
      console.log(obj);
      //将选中的标签传给上级页面
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1]; //当前页面
      var prevPage = pages[pages.length - 2]; //上一个页面
      // #ifdef H5
      prevPage.target = obj;
      prevPage.back = 1;
      // #endif
      // #ifndef H5
      prevPage.$vm.target = obj;
      prevPage.$vm.back = 1;
      // #endif
      uni.navigateBack({ delta: 1 });
    },
    // 获取症状
    getlist() {
      let requestPak = pakTool.createRequestPak();
      requestPak.requestBody = {
        member_id: this.$store.state.wx_memberId,
      };
      pakTool
        .request(this, "/madyApp/getStartCarePlan", requestPak)
        .then((res) => {
          // {"ok":true,"message":"","pk":null,"code":"200","data":{"bodyCare":[{"def_list_id":"1028bbdb-555b-4b34-89e3-2fb266ad693e","code":"ll-body6","name":"左脚","value":"左脚","memo":null,"fix":"N"},{"def_list_id":"2ad39827-5db4-43ae-b597-fcf1764e991c","code":"ll-body12","name":"腰部","value":"腰部","memo":null,"fix":"N"},{"def_list_id":"750967a2-f8b8-4477-8d8c-1b00aadc9150","code":"ll-body10","name":"右臂","value":"右臂","memo":null,"fix":"N"},{"def_list_id":"929398b9-ee66-42e3-af89-f0eb3021bae6","code":"ll-body8","name":"中焦","value":"中焦","memo":null,"fix":"N"},{"def_list_id":"9f4655bd-f5f0-411d-9a57-2b3fca6d6532","code":"ll-body3","name":"右大腿","value":"右大腿","memo":null,"fix":"N"},{"def_list_id":"aba5504a-a0a8-11ea-a951-506b4bc21cca","code":"ll-body1","name":"胸部","value":"胸部","memo":null,"fix":"N"},{"def_list_id":"b046f196-f31d-4993-a38c-771485b62b85","code":"ll-body9","name":"下焦","value":"下焦","memo":null,"fix":"N"},{"def_list_id":"b33554f9-a0a8-11ea-a951-506b4bc21cca","code":"ll-body2","name":"腹部","value":"腹部","memo":null,"fix":"N"},{"def_list_id":"cdc047e4-6300-4d04-8aff-ea4daafa6426","code":"ll-body5","name":"右脚","value":"右脚","memo":null,"fix":"N"},{"def_list_id":"f2648e05-1043-4a79-9003-7c88dab29b0a","code":"ll-body11","name":"左臂","value":"左臂","memo":null,"fix":"N"},{"def_list_id":"fcdd1d14-03e1-4f08-acd0-9b5551c5f62d","code":"ll-body7","name":"上焦","value":"上焦","memo":null,"fix":"N"},{"def_list_id":"fd7c6e5f-59fc-4577-a615-2930b4fe5349","code":"ll-body4","name":"左大腿","value":"左大腿","memo":null,"fix":"N"}],"careProjects":[{"def_list_id":"8dcc7d25-a0a7-11ea-a951-506b4bc21cca","code":"ll-1","name":"元化灸","value":"元化灸","memo":null,"fix":null}],"maladyList":[{"id":"08ac28eb-1632-4198-aa36-ce9b65406fe9","name":"牙疼（上牙）","content":"6","sort":"6","create_user":"1","create_time":"2020-06-22 09:50:44.0","edit_user":"1","edit_time":"2020-06-22 09:50:44.0","exc_key":"0","dr":"0"},{"id":"0b83de5c-b833-41ef-b8ed-3d22b83b2f2b","name":"痛经","content":"12","sort":"12","create_user":"1","create_time":"2020-06-22 10:41:51.0","edit_user":"1","edit_time":"2020-06-22 10:41:51.0","exc_key":"0","dr":"0"},{"id":"1295a37a-b27d-4ea2-8d44-265fdd771eaa","name":"便秘 ","content":"33","sort":"33","create_user":"1","create_time":"2020-06-23 16:20:10.0","edit_user":"1","edit_time":"2020-06-23 16:20:10.0","exc_key":"0","dr":"0"},{"id":"1a9f1e78-d120-4a09-b81d-c38d6e618ecd","name":"月经不调","content":"13","sort":"13","create_user":"1","create_time":"2020-06-22 10:44:34.0","edit_user":"1","edit_time":"2020-06-22 10:44:34.0","exc_key":"0","dr":"0"},{"id":"1db70dc2-1153-4c2e-86dd-d26555583500","name":"腰痛","content":"27","sort":"27","create_user":"1","create_time":"2020-06-23 15:02:44.0","edit_user":"1","edit_time":"2020-06-23 15:25:08.0","exc_key":"1","dr":"0"},{"id":"26f51c1c-d2a2-4fda-ba11-a405ed31dc93","name":"头痛（阳明-额头痛）","content":"18","sort":"18","create_user":"1","create_time":"2020-06-22 11:04:58.0","edit_user":"1","edit_time":"2020-06-22 11:04:58.0","exc_key":"0","dr":"0"},{"id":"271be934-054b-490f-b5db-7608e11f9e9b","name":"前列腺疾病","content":"10","sort":"10","create_user":"1","create_time":"2020-06-22 10:38:23.0","edit_user":"1","edit_time":"2020-06-22 10:38:23.0","exc_key":"0","dr":"0"},{"id":"3245027c-a0ff-465c-813f-b61063b700d6","name":"颈椎病（伴有头晕头痛）","content":"24","sort":"24","create_user":"1","create_time":"2020-06-22 11:24:50.0","edit_user":"1","edit_time":"2020-06-22 11:24:50.0","exc_key":"0","dr":"0"},{"id":"42c3b058-a8c5-4f6d-a9be-2ce52dfbff3d","name":"颈椎病（伴有手麻）","content":"25","sort":"25","create_user":"1","create_time":"2020-06-23 14:22:50.0","edit_user":"1","edit_time":"2020-06-23 14:22:50.0","exc_key":"0","dr":"0"},{"id":"4d963173-fb19-4d09-a51c-49fec4957fea","name":"盆腔炎","content":"11","sort":"11","create_user":"1","create_time":"2020-06-22 10:40:31.0","edit_user":"1","edit_time":"2020-06-22 10:40:31.0","exc_key":"0","dr":"0"},{"id":"53a4a4da-1f2d-4731-be3c-248ca3283668","name":"面瘫","content":"4","sort":"4","create_user":"1","create_time":"2020-06-21 09:21:02.0","edit_user":"1","edit_time":"2020-06-21 09:21:02.0","exc_key":"0","dr":"0"},{"id":"596c882a-28b2-425d-a9ae-8525e0227f21","name":"胆囊炎","content":"31","sort":"31","create_user":"1","create_time":"2020-06-23 16:09:05.0","edit_user":"1","edit_time":"2020-06-23 16:09:05.0","exc_key":"0","dr":"0"},{"id":"5a2f177c-9aac-43ab-bc17-f9a7ff7e05a0","name":"脂肪肝","content":"32","sort":"32","create_user":"1","create_time":"2020-06-23 16:13:59.0","edit_user":"1","edit_time":"2020-06-23 16:14:25.0","exc_key":"1","dr":"0"},{"id":"5e3eff47-b4f2-4393-ba6f-cc8800167429","name":"头痛（厥阴-头顶）","content":"21","sort":"21","create_user":"1","create_time":"2020-06-22 11:09:51.0","edit_user":"1","edit_time":"2020-06-22 11:09:51.0","exc_key":"0","dr":"0"},{"id":"612d0c20-b7de-49bf-a2cd-89c1bff15353","name":"膝痛","content":"28","sort":"28","create_user":"1","create_time":"2020-06-23 15:25:17.0","edit_user":"1","edit_time":"2020-06-23 15:25:17.0","exc_key":"0","dr":"0"},{"id":"62e21a2a-c5bc-46fa-a061-f572aac3ca57","name":"大便溏稀","content":"34","sort":"34","create_user":"1","create_time":"2020-06-23 16:51:50.0","edit_user":"1","edit_time":"2020-06-23 16:51:50.0","exc_key":"0","dr":"0"},{"id":"6456ada3-db22-40d9-b4ec-5bd19aa4e883","name":"牙疼（下牙）","content":"7","sort":"7","create_user":"1","create_time":"2020-06-22 10:02:32.0","edit_user":"1","edit_time":"2020-06-22 10:02:32.0","exc_key":"0","dr":"0"},{"id":"65dca4c0-d643-4ec3-9dd5-b4fee231660a","name":"过敏性鼻炎","content":"23","sort":"23","create_user":"1","create_time":"2020-06-22 11:19:33.0","edit_user":"1","edit_time":"2020-06-22 11:19:33.0","exc_key":"0","dr":"0"},{"id":"6ff859a5-22d4-45e7-bbca-d6fdb4ab72cd","name":"高血糖","content":"1","sort":"3","create_user":"1","create_time":"2020-06-20 15:56:51.0","edit_user":"1","edit_time":"2020-06-21 09:18:41.0","exc_key":"1","dr":"0"},{"id":"714218b0-7fcc-4496-b0f9-6b7c2a48d0bf","name":"中风后遗症","content":"5","sort":"5","create_user":"1","create_time":"2020-06-21 09:25:11.0","edit_user":"1","edit_time":"2020-06-21 09:25:11.0","exc_key":"0","dr":"0"},{"id":"7150a421-1fad-41b1-bd4a-192cbe48185c","name":"漏尿","content":"9","sort":"9","create_user":"1","create_time":"2020-06-22 10:10:46.0","edit_user":"1","edit_time":"2020-06-22 10:10:46.0","exc_key":"0","dr":"0"},{"id":"7724b857-e6d8-4007-9060-2c326e3bb00c","name":"失眠","content":"35","sort":"35","create_user":"1","create_time":"2020-06-23 16:55:49.0","edit_user":"1","edit_time":"2020-06-23 16:55:49.0","exc_key":"0","dr":"0"},{"id":"816485d0-7f3b-4db9-9755-17e4f698ac19","name":"头痛（少阳-偏头痛）","content":"19","sort":"19","create_user":"1","create_time":"2020-06-22 11:06:46.0","edit_user":"1","edit_time":"2020-06-22 11:06:46.0","exc_key":"0","dr":"0"},{"id":"9f080f5d-0407-4ee5-a7ae-a3d8ce7e0f90","name":"更年期综合症","content":"36","sort":"36","create_user":"1","create_time":"2020-06-23 16:59:25.0","edit_user":"1","edit_time":"2020-06-23 16:59:25.0","exc_key":"0","dr":"0"},{"id":"ad7d7688-a973-4d8a-be0b-7e43071d9989","name":"咳嗽","content":"17","sort":"17","create_user":"1","create_time":"2020-06-22 11:00:09.0","edit_user":"1","edit_time":"2020-06-22 11:00:09.0","exc_key":"0","dr":"0"},{"id":"b38bcf4e-141b-46e9-9073-2d854919276c","name":"胃炎","content":"29","sort":"29","create_user":"1","create_time":"2020-06-23 15:37:23.0","edit_user":"1","edit_time":"2020-06-23 15:37:23.0","exc_key":"0","dr":"0"},{"id":"b6a9402b-eecb-4eaa-b2bd-efe7f4573476","name":"感冒（风寒）","content":"14","sort":"14","create_user":"1","create_time":"2020-06-22 10:48:05.0","edit_user":"1","edit_time":"2020-06-22 10:48:05.0","exc_key":"0","dr":"0"},{"id":"c4bc4db0-a0a7-11ea-a951-506b4bc21cca","name":"高血脂","content":"属足太阴脾经。位于小腿内侧，胫骨内侧下缘与胫骨内侧缘之间的凹陷中。主治：腹痛、痛经、小便不利、膝肿","sort":"0","create_user":null,"create_time":null,"edit_user":null,"edit_time":null,"exc_key":"0","dr":"0"},{"id":"c918f07e-84db-4b91-a092-044c1b52414b","name":"感冒（风热）","content":"15","sort":"15","create_user":"1","create_time":"2020-06-22 10:51:23.0","edit_user":"1","edit_time":"2020-06-22 10:51:23.0","exc_key":"0","dr":"0"},{"id":"caa32418-bc14-4272-8180-2bcb92998912","name":"疲劳综合症","content":"37","sort":"37","create_user":"1","create_time":"2020-06-23 17:03:09.0","edit_user":"1","edit_time":"2020-06-23 17:03:09.0","exc_key":"0","dr":"0"},{"id":"cdfba467-a0a7-11ea-a951-506b4bc21cca","name":"高血压","content":"其实，高血压有时候会有一些不太特异的症状，比如头部胀痛、阵发性眩晕、胸闷不适、四肢麻木等，这时患者及接诊医生都要警惕是不是早期高血压的信号。","sort":"2","create_user":null,"create_time":null,"edit_user":"1","edit_time":"2020-06-21 09:17:48.0","exc_key":"1","dr":"0"},{"id":"d55e4b5e-028e-479e-81c7-967f81dfe3cc","name":"尿路感染","content":"8","sort":"8","create_user":"1","create_time":"2020-06-22 10:09:02.0","edit_user":"1","edit_time":"2020-06-22 10:09:02.0","exc_key":"0","dr":"0"},{"id":"e18ac9a8-ffda-408d-8d1d-6bad9d850e7b","name":"视力模糊","content":"22","sort":"22","create_user":"1","create_time":"2020-06-22 11:12:56.0","edit_user":"1","edit_time":"2020-06-22 11:12:56.0","exc_key":"0","dr":"0"},{"id":"e794fdab-2c41-4712-9bb6-c1173ad9e1ed","name":"感冒（暑湿）","content":"16","sort":"16","create_user":"1","create_time":"2020-06-22 10:54:28.0","edit_user":"1","edit_time":"2020-06-22 10:54:28.0","exc_key":"0","dr":"0"},{"id":"f58bc0ec-4f73-4b1c-b627-caa2b13e6f99","name":"头痛（太阳-后脑勺）","content":"20","sort":"20","create_user":"1","create_time":"2020-06-22 11:08:18.0","edit_user":"1","edit_time":"2020-06-22 11:08:18.0","exc_key":"0","dr":"0"},{"id":"f92534d9-b7fe-49bf-a275-a722e6689152","name":"痔疮","content":"30","sort":"30","create_user":"1","create_time":"2020-06-23 16:06:11.0","edit_user":"1","edit_time":"2020-06-23 16:06:11.0","exc_key":"0","dr":"0"},{"id":"fdea1ef4-18b1-4326-aeee-b863f126ba7b","name":"肩周炎","content":"26","sort":"26","create_user":"1","create_time":"2020-06-23 14:53:06.0","edit_user":"1","edit_time":"2020-06-23 14:53:06.0","exc_key":"0","dr":"0"}],"goodsLis":[]}}
          res.data.maladyList.map((item, index) => {
            this.symptom_list.push({ name: item.name, id: item.id });
          });
          // a~z 排序
          // this.symptom_list.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
          // console.log(this.symptom_list )
          this.pinyinSort(this.symptom_list);
        });
    },
    pinyinSort(name) {
      var pinyinArray = new Array();
      for (let bukn = 0; bukn < name.length; bukn++) {
        var o = new Object();
        var ken = Pinyin.getSpell(name[bukn].name, function (charactor, spell) {
          // console.log(charactor,spell);
          if (charactor == "尿" || charactor == "咳") {
            return spell[1];
          }
          return spell[0];
        });
        o.name = name[bukn].name;
        o.id = name[bukn].id;
        o.pinyin = ken.split(",").join("");
        pinyinArray.push(o);
      }
      for (let i = 0; i < pinyinArray.length - 1; i++) {
        for (let j = 0; j < pinyinArray.length - 1 - i; j++) {
          if (pinyinArray[j].pinyin > pinyinArray[j + 1].pinyin) {
            var temp = pinyinArray[j];
            pinyinArray[j] = pinyinArray[j + 1];
            pinyinArray[j + 1] = temp;
          }
        }
      }
      // console.log(pinyinArray)
      this.symptom_list = pinyinArray;
    },
  },
};
</script>

<style lang="less" scoped>
.symptom {
  font-size: 30rpx;
  .tabone_mid {
    padding: 30rpx;
    background-color: #ffffff;
    .radio {
      flex: 0 0 33%;
      image {
        width: 50rpx;
        height: 50rpx;
        vertical-align: middle;
        margin-right: 20rpx;
      }
    }
    .symptom {
      display: flex;
      justify-content: space-between;
      width: 100%;
      flex-wrap: wrap;
      font-size: 30rpx;
      .symptom_radio {
        flex-basis: 50%;
        margin: 20rpx 0;
        image {
          width: 50rpx;
          height: 50rpx;
          vertical-align: middle;
          margin-right: 20rpx;
        }
      }
    }
    .area {
      margin-bottom: 30rpx;
      textarea {
        padding: 30rpx;
        background-color: #f7f7f7;
      }
    }
    .cal_width {
      width: calc(100% - 100rpx);
      display: inline-block;
      vertical-align: middle;
      font-size: 32rpx;
    }
    .quil {
      margin-top: 30rpx;
      height: 210rpx;
      background-color: #f7f7f7;
      box-sizing: border-box;
      padding: 30rpx;
      position: relative;
      border-radius: 10rpx;
      textarea {
        height: 100%;
        width: 100%;
        font-size: 28rpx;
      }
      .num {
        position: absolute;
        right: 3%;
        bottom: 5%;
        font-size: 28rpx;
        .grey {
          color: #c2c2c2;
        }
      }
    }
    button {
      width: 90%;
      margin: 0 auto;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 40rpx;
      background-color: #c59a76;
      margin-top: 60rpx;
    }
  }
}
</style>
