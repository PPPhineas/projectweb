<template>
  <div class="addPro">
    <div class="addPro-header">编辑项目信息</div>
    <div class="addPro-form">
      <!-- form -->
      <data-form
        :ref-obj.sync="formInfo.ref"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :rules="formInfo.rules"
        :label-position="formInfo.labelPosition"
        :label-width="formInfo.labelWidth"
        :list-type-info="listTypeInfo"
      ></data-form>
      <div class="dataform-btn">
        <div @click="resetForm">取消</div>
        <div @click="handleClick('update')">确定</div>
      </div>
    </div>
  </div>
</template>
<script>
import DataForm from "@/components/DataForm";
import { getProjectlist } from "@/api/project";
import { updateContract } from "@/api/contract";
// import { contractTypelist, contractCategorylist } from "./options";
export default {
  data() {
    const checkdepartmentCode = (rule, value, callback) => {
      callback();
    };
    const checkoutputRatio = (rule, value, callback) => {
      callback();
    };
    const checkcontractValue = (rule, value, callback) => {
      callback();
    };
    const checkOutput = (rule, value, callback) => {
      callback();
    };
    const checktransmitTime = (rule, value, callback) => {
      callback();
    };
    const checkdeadline = (rule, value, callback) => {
      callback();
    };
    const checkapprovalTime = (rule, value, callback) => {
      callback();
    };
    const checkendTime = (rule, value, callback) => {
      callback();
    };
    const checkmaterial = (rule, value, callback) => {
      callback();
    };
    const checkdescription = (rule, value, callback) => {
      callback();
    };
    return {
      projOption: [],
      loading: false,
      // 相关列表
      listTypeInfo: {
        tagTypeList: [],
        cTypelist: [],
        cCategorylist: []
      },
      // 表单相关
      formInfo: {
        ref: "editptform",
        labelPosition: "left",
        data: JSON.parse(sessionStorage.getItem("editPoject")),
        fieldList: [
          {
            label: "项目编号",
            value: "projectNumber",
            type: "input",
            disabled: true
          },
          {
            label: "项目名称",
            value: "projectName",
            type: "input",
            required: true,
            validator: checkdepartmentCode
          },
          {
            label: "项目类型",
            value: "projectType",
            type: "select",
            list: "cTypelist",
            required: true,
            validator: checkoutputRatio
          },
          {
            label: "项目所在部门",
            value: "departmentCode",
            type: "select",
            list: "cCategorylist",
            required: true,
            validator: checkoutputRatio
          },
          {
            label: "项目经理",
            value: "principal",
            type: "input",
            required: true,
            validator: checkcontractValue
          },
          {
            label: "立项时间",
            value: "projectTime",
            type: "date",
            dateType: "datetime",
            required: true,
            validator: checkdeadline
          },
          {
            label: "接收时间",
            value: "receiveTime",
            type: "date",
            dateType: "datetime",
            required: true,
            validator: checkapprovalTime
          },
          {
            label: "项目背景",
            value: "projectDescribe",
            type: "textarea",
            required: true,
            validator: checkmaterial
          },
          {
            label: "项目所处阶段",
            value: "phase",
            type: "input",
            required: true,
            validator: checkdescription
          },
          {
            label: "项目进度偏差",
            value: "phaseprogressBar",
            type: "input",
            required: true,
            validator: checkdescription
          },
          {
            label: "项目整体进度",
            value: "schedule",
            type: "input",
            required: true,
            validator: checkdescription
          },
          {
            label: "项目问题总数",
            value: "issueCount",
            type: "input",
            required: true,
            validator: checkdescription
          },
          {
            label: "项目风险总数",
            value: "riskCount",
            type: "input",
            activevalue: 1,
            inactivevalue: 0,
            required: true,
            validator: checkdescription
          }
        ],
        rules: {},
        labelWidth: "135px"
      }
    };
  },
  components: {
    DataForm
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
        contractNumber: this.formInfo.data.contractNumber,
        contractName: this.formInfo.data.contractName,
        deleted: this.formInfo.data.deleted,
        contractType: this.formInfo.data.contractType,
        contractCategory: this.formInfo.contractCategory,
        unit: this.formInfo.data.unit,
        contractObject: this.formInfo.data.contractObject,
        departmentCode: this.formInfo.data.departmentCode,
        contractAmount: this.formInfo.data.contractAmount,
        isOriginal: this.formInfo.data.isOriginal,
        isCheckFile: this.formInfo.data.isCheckFile,
        isQualityReport: this.formInfo.data.isQualityReport,
        contractCount: this.formInfo.data.contractCount,
        signTime: this.formInfo.data.signTime
          ? new Date(this.formInfo.data.signTime).toISOString()
          : "",
        remark: this.formInfo.data.remark,
        receiveTime: this.formInfo.data.receiveTime
          ? new Date(this.formInfo.data.receiveTime).toISOString()
          : ""
      };
      let ref = formInfo.ref;
      ref.validate(valid => {
        if (valid) {
          this.$handleAPI(event, updateContract, params)
            .then(res => {
              if (res.success) {
                sessionStorage.clear();
                this.$router.push({ name: "project" });
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
.addPro {
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
