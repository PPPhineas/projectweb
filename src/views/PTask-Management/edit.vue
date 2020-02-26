<template>
  <div class="addPtask">
    <div class="addPtask-header">编辑生产任务</div>
    <div class="addPtask-form">
      <!-- form -->
      <data-form
        :ref-obj.sync="formInfo.ref"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :rules="formInfo.rules"
        :label-position="formInfo.labelPosition"
        :label-width="formInfo.labelWidth"
        :list-type-info="listTypeInfo"
      >
      </data-form>
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
import { updateProdTask } from "@/api/prodtask";
import {dateFormatter} from '@/libs/util.js';
export default {
  data() {
    const checkdepartmentCode = (rule, value, callback) => {
      const check = this.$validate({ label: '部门', value, rules: ['notnull']})
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkoutputRatio = (rule, value, callback) => {
      const check = this.$validate({ label: '产值', value, rules: ['notnull']})
      if (!check.result) {
        callback(new Error(check.message))
      } else {
        callback()
      }
    }
    const checkcontractValue = (rule, value, callback) => {

    }
    const checkOutput = (rule, value, callback) => {

    }
    const checktransmitTime = (rule, value, callback) => {

    }
    const checkdeadline = (rule, value, callback) => {

    }
    const checkapprovalTime = (rule, value, callback) => {

    }
    const checkendTime = (rule, value, callback) => {

    }
    const checkmaterial = (rule, value, callback) => {

    }
    const checkdescription = (rule, value, callback) => {

    }
    return {
      projOption: [],
      loading: false,
      // 相关列表
      listTypeInfo: {
        tagTypeList: [],
        statusList: [
          { key: '启用', value: 1 },
          { key: '停用', value: 0 }
        ]
      },
      // 表单相关
      formInfo: {
        ref: 'editptform',
        labelPosition:'left',
        data: JSON.parse(sessionStorage.getItem('editpTask')),
        fieldList: [
          { label: '项目名称', value: 'projectName', type: 'input', disabled: true},
          { label: '部门', value: 'departmentCode', type: 'input', required: true, validator: checkdepartmentCode},
          { label: '产值占比', value: 'outputRatio', type: 'input' , suffix:true, suffixname: '%',  required: true, validator: checkoutputRatio},
          { label: '合同额', value: 'contractValue', type: 'input', suffix:true, suffixname: '元',  required: true, validator: checkcontractValue},
          { label: '产值', value: 'output', type: 'input', required: true, validator: checkOutput},
          { label: '下单时间', value: 'transmitTime', type: 'date', dateType: 'datetime',required: true, validator: checktransmitTime},
          { label: '合同要求完成时间', value: 'deadline', type: 'date', dateType: 'datetime', required: true, validator: checkdeadline},
          { label: '立项会议时间', value: 'approvalTime', type: 'date', dateType: 'datetime', required: true, validator: checkapprovalTime},
          { label: '项目结项时间', value: 'endTime', type: 'date', dateType: 'datetime', required: true, validator: checkendTime},
          { label: '验收资料', value: 'material', type: 'input', required: true, validator: checkmaterial},
          { label: '项目工作内容', value: 'description', type: 'textarea', required: true, validator: checkdescription },
          { label: '备注', value: 'remark', type: 'textarea' },
        ],
        rules: {},
        labelWidth: '135px'
      },
    }
  },
  components: {
    DataForm,
  },
  mounted() {
    this.initRules();
  },
  methods: {
    // 初始化验证
    initRules () {
      const formInfo = this.formInfo
      formInfo.rules = this.$initRules(formInfo.fieldList)
    },
    // 按钮点击
    handleClick (event) {
      const formInfo = this.formInfo;
      let params =  {
        approvalTime: this.formInfo.data.approvalTime ? dateFormatter(this.form.approvalTime) : '',
        contractValue: this.formInfo.data.contractValue,
        deadline: this.formInfo.data.deadline ? dateFormatter(this.form.deadline): '',
        deleted: this.formInfo.data.deleted,
        departmentCode: this.formInfo.data.departmentCode,
        description: this.formInfo.description,
        endTime: this.formInfo.endTime? dateFormatter(this.form.endTime) : '',
        id: this.formInfo.data.id,
        material: this.formInfo.data.material,
        output: this.formInfo.data.output,
        outputRatio: this.formInfo.data.outputRatio,
        projectManager: this.formInfo.data.projectManager,
        projectName: this.formInfo.data.projectName,
        projectNumber: this.formInfo.data.projectNumber,
        publishTime: this.formInfo.data.publishTime ? dateFormatter(this.form.publishTime) : '',
        remark: this.formInfo.data.remark,
        transmitTime: this.formInfo.data.transmitTime ? dateFormatter(this.form.transmitTime) : '',
      };
      let ref = formInfo.ref;
      ref.validate(valid => {
        if (valid) {
          this.$handleAPI('update', updateProdTask, params).then(res => {
            if (res.success) {
              sessionStorage.clear();
              this.$router.push({name:'pTask'});
            }
          }).catch(e => {
          })
        }
      })
    },
    // 初始化表单
    resetForm () {
      this.formInfo.data = {

      }
    }
  }
}
</script>
<style lang="less" scope>
@vw: 19.2vw;
.addPtask {
  background-color: #ffffff;
  &-header {
    height: 59/@vw;
    border-bottom: 1/@vw solid #ebecee;
    display: flex;
    align-items: center;
    font-size: 16/@vw;
    color: #7a7a7a;
    padding-left: 30/@vw;
  }
  &-form {
    padding-left: 150/@vw;
    .el-form {
      margin-top: 46/@vw;
      font-size: 14/@vw;
      .el-form-item{
        // width: 530/@vw;
        margin-right: 80/@vw;
        .el-form-item__content{
          width: 400/@vw;
          .el-input__inner, .el-textarea__inner{
            width: 400/@vw;
            height: 44/@vw;
          }
          .el-button {
            width: 88/@vw;
            height: 36/@vw;
            line-height: 36/@vw;
            border-radius: 18/@vw;
            border: solid 1/@vw #959fbb;
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
        width: 88/@vw;
        height: 36/@vw;
        border-radius: 18/@vw;
        border: solid 1px #959fbb;
        cursor: pointer;
      }
      div:last-child {
        margin-left: 30/@vw;
      }
    }
  }
}
</style>
