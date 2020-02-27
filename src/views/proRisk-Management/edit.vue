<template>
  <div class="ediProRisk">
    <div class="ediProRisk-header">编辑项目风险</div>
    <div class="ediProRisk-form">
      <DataForm 
        :ref-obj.sync="formInfo.ref"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :rules="formInfo.rules"
        :label-position="formInfo.labelPosition"
        :label-width="formInfo.labelWidth"
        :inline="formInfo.inline"
        :list-type-info="listTypeInfo">
      </DataForm>

      <div class="dataform-btn">
        <div @click="resetForm">取消</div>
        <div @click="handleClick('save')">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
import DataForm from "@/components/DataForm";
import { updateProRiskInfo } from '@/api/proRisk.js';
import {dateFormatter} from '@/libs/util.js';
export default {
  data () {
    return {
      listTypeInfo: {
        flagList: [
          {name: '新建', value: 0},
          {name: '处理中', value: 1},
          {name: '关闭', value: 2}
        ],
        degreeList: [
          {name: '轻度', value: 0},
          {name: '中等', value: 1},
          {name: '严重', value: 2}
        ]
      },
      formInfo: {
        ref: 'addproRisk',
        labelPosition:'left',
        data: JSON.parse(sessionStorage.getItem('editProRisk')),
        fieldList : [
          {label: '风险编号', value: 'riskNumber', type: 'input'},
          {label: '项目编号', value: 'projectNumber', type: 'input'},
          {label: '提出人', value: 'exhibitor', type: 'select', person: true, filterable: true},
          {label: '发现时间', value: 'presentation', type: 'date'},
          {label: '风险描述', value: 'descr', type: 'textarea'},
          {label: '风险程度', value: 'lev', type: 'select', list: 'degreeList'},
          {label: '应对方法', value: 'solution', type: 'textarea'},
          {label: '负责人', value: 'principal', type: 'select', person: true, filterable: true},
          {label: '实际执行措施情况', value: 'cond', type: 'textarea'},
          {label: '状态', value: 'state', type: 'select', list: 'flagList'},
        ],
        rules: {},
        labelWidth: '130px',
        inline: false
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.addproRisk.resetFields();
    },
    async handleClick() {
      let params = {
        id: JSON.parse(sessionStorage.getItem('editProRisk')).id,
        riskNumber: this.formInfo.data.riskNumber,
        projectNumber: this.formInfo.data.projectNumber,
        exhibitor: this.formInfo.data.exhibitor,
        presentation: this.formInfo.data.presentation ? dateFormatter(this.formInfo.data.presentation) : '',
        descr: this.formInfo.data.descr,
        lev: this.formInfo.data.lev,
        solution: this.formInfo.data.solution,
        principal: this.formInfo.data.principal,
        cond: this.formInfo.data.cond,
        state: this.formInfo.data.state,
      }
      let res = await updateProRiskInfo(params);
      const { success, message } = res;
      if (success) {
        this.$notify({
          title: "成功提示",
          message: '编辑项目风险成功!',
          type: 'success'
        });
        this.$router.push({ name: 'proRisk' });
      } else {
        this.$notify({
          title: "错误提示",
          message: message,
          type: 'error'
        });
      }
    }
  },
  components: {
    DataForm
  }
}
</script>

<style lang="less">
@vw: 19.2vw;
.ediProRisk {
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
    // width: 500/@vw;
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



