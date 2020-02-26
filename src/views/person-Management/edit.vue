<template>
  <div class="addperson">
    <div class="addperson-header">编辑生产任务</div>
    <div class="addperson-form">
      <!-- form -->
      <data-form
        :ref-obj.sync="formInfo.ref"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :rules="formInfo.rules"
        :label-position="formInfo.labelPosition"
        :label-width="formInfo.labelWidth"
        :inline="formInfo.inline"
        :list-type-info="listTypeInfo"
      ></data-form>
      <div class="dataform-btn">
        <div @click="resetForm">取消</div>
        <div @click="handleClick('save')">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
import DataForm from "@/components/DataForm";
import { getProjectlist } from "@/api/project";
import { updateEmployee } from "@/api/person";
export default {
  data() {
    const checkdepartmentCode = (rule, value, callback) => {
      const check = this.$validate({
        label: "部门",
        value,
        rules: ["notnull"]
      });
      if (!check.result) {
        callback(new Error(check.message));
      } else {
        callback();
      }
    };
    const checkoutputRatio = (rule, value, callback) => {
      const check = this.$validate({
        label: "产值",
        value,
        rules: ["notnull"]
      });
      if (!check.result) {
        callback(new Error(check.message));
      } else {
        callback();
      }
    };
    const checkcontractValue = (rule, value, callback) => {callback()};
    const checkOutput = (rule, value, callback) => {callback()};
    const checktransmitTime = (rule, value, callback) => {callback()};
    const checkdeadline = (rule, value, callback) => {callback()};
    const checkapprovalTime = (rule, value, callback) => {callback()};
    const checkendTime = (rule, value, callback) => {callback()};
    const checkmaterial = (rule, value, callback) => {callback()};
    const checkdescription = (rule, value, callback) => {callback()};
    return {
      projOption: [],
      loading: false,
      // 相关列表
      listTypeInfo: {
        tagTypeList: [],
        stationlist: JSON.parse(sessionStorage.getItem('personDict')).station,
        statuslist: JSON.parse(sessionStorage.getItem('personDict')).status
      },
      // 表单相关
      formInfo: {
        ref: "editptform",
        labelPosition: "left",
        data: JSON.parse(sessionStorage.getItem("editperson")),
        fieldList: [
          {
            label: "用户名",
            value: "username",
            type: "input",
            disabled: true
          },
          {
            label: "密码",
            value: "password",
            type: "input",
            required: true,
            validator: checkdepartmentCode
          },
          {
            label: "员工姓名",
            value: "realName",
            type: "input",
            required: true,
            validator: checkoutputRatio
          },
          {
            label: "手机号码",
            value: "phone",
            type: "input",
            required: true,
            validator: checkcontractValue
          },
          {
            label: "岗位",
            value: "station",
            type: "select",
            list: 'stationlist',
            required: true,
            validator: checkOutput
          },
          {
            label: "员工状态",
            value: "status",
            type: "select",
            list: 'statuslist',
            required: true,
            validator: checkOutput
          },
          {
            label: "入职时间",
            value: "hireDate",
            type: "date",
            dateType: "datetime",
            format:'yyyy-MM-dd HH:mm:ss',
            required: true,
            validator: checktransmitTime
          },
          {
            label: "离职时间",
            value: "resignDate",
            type: "date",
            format:'yyyy-MM-dd HH:mm:ss',
            dateType: "datetime",
            required: true,
            validator: checkdeadline
          }
        ],
        rules: {},
        labelWidth: "135px",
        inline: false
      }
    };
  },
  components: {
    DataForm
  },
  computed: {
    personDict() {
      if (this.$store.state.user.personDict) {
        return this.$store.state.user.personDict
      }else {
        return JSON.parse(sessionStorage.getItem('personDict'));
      }
    }
  },
  mounted() {
    this.initRules();
  },
  methods: {
    // 初始化验证
    initRules() {
      const formInfo = this.formInfo;
      formInfo.rules = this.$initRules(formInfo.fieldList);
    },
    // 按钮点击
    handleClick(event) {
      const formInfo = this.formInfo;
      let params = {
        id: this.formInfo.data.id,
        username: this.formInfo.data.username,
        password:  this.formInfo.data.password,
        realName: this.formInfo.data.realName,
        phone: this.formInfo.data.phone,
        hireDate: this.formInfo.data.hireDate,
        resignDate: this.formInfo.data.resignDate,
        status: this.formInfo.data.status,
        station: this.formInfo.data.station,
        mail: this.formInfo.data.mail
      };
      let ref = formInfo.ref;
      ref.validate(valid => {
        if (valid) {
          this.$handleAPI("update", updateEmployee, params)
            .then(res => {
              if (res.success) {
                sessionStorage.clear();
                this.$router.push({ name: "person" });
              }
            })
            .catch(e => {});
        }
      });
    },
    // 初始化表单
    resetForm() {
      this.formInfo.data = {};
    }
  }
};
</script>
<style lang="less" scope>
@vw: 19.2vw;
.addperson {
  background-color: #ffffff;
  &-header {
    height: 59 / @vw;
    border-bottom: 1 / @vw solid #ebecee;
    display: flex;
    align-items: center;
    font-size: 16 / @vw;
    color: #7a7a7a;
    padding-left: 30 / @vw;
  }
  &-form {
    padding-left: 150 / @vw;
    .el-form {
      margin-top: 46 / @vw;
      font-size: 14 / @vw;
      .el-form-item {
        // width: 530 / @vw;
        margin-right: 80 / @vw;
        .el-form-item__content {
           width: 400 / @vw;
          .el-input__inner,
          .el-textarea__inner {
            width: 400 / @vw;
            height: 44 / @vw;
          }
          .el-button {
            width: 88 / @vw;
            height: 36 / @vw;
            line-height: 36 / @vw;
            border-radius: 18 / @vw;
            border: solid 1 / @vw #959fbb;
            padding: 0;
          }
          .el-input__suffix {
            color: #606266;
          }
        }
      }
    }
    .dataform-btn {
      display: flex;
      justify-content: flex-start;
      div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 88 / @vw;
        height: 36 / @vw;
        border-radius: 18 / @vw;
        border: solid 1px #959fbb;
        cursor: pointer;
      }
      div:last-child {
        margin-left: 30 / @vw;
      }
    }
  }
}
</style>
