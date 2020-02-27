<template>
  <div class="editBid">
    <div class="editBid-header">编辑投标任务</div>
    <div class="editBid-form">
      <DataForm 
        :ref-obj.sync="formInfo.ref"
        :data="formInfo.data"
        :field-list="formInfo.fieldList"
        :rules="formInfo.rules"
        :label-position="formInfo.labelPosition"
        :label-width="formInfo.labelWidth">
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
import { updateBidInfo } from '@/api/bid.js';
import {dateFormatter} from '@/libs/util.js';
export default {
  data () {
    return {
      formInfo: {
        ref: 'editBid',
        labelPosition:'left',
        data: JSON.parse(sessionStorage.getItem('editBid')),
        fieldList : [
          {label: '投标负责部门编号', value: 'departmentCode', type: 'input', disabled: true, required: true},
          {label: '名称', value: 'bidName', type: 'input'},
          {label: '标段', value: 'section', type: 'input'},
          {label: '预算金额', value: 'budget', type: 'input', suffix: true, suffixname: '万元'},
          {label: '采购单位', value: 'procurementUnit', type: 'input'},
          {label: '投标性质', value: 'sign', type: 'input'},
          {label: '申请人', value: 'proposer', type: 'select', person: true, filterable: true},
          {label: '协调人', value: 'coordinator', type: 'select', person: true, filterable: true},
          {label: '项目报名人', value: 'projectApply', type: 'select', person: true, filterable: true},
          {label: '标书编制人', value: 'bidEditor', type: 'select',  person: true, filterable: true},
          {label: '现场投标人', value: 'bidor', type: 'select',  person: true, filterable: true},
          {label: '合作单位', value: 'cooperator', type: 'input'},
          {label: '保证金额', value: 'cashDeposit', type: 'input', suffix: true, suffixname: '万元'},
          {label: '开标时间', value: 'bidOpeningTime', type: 'date'},
          {label: '中标单位', value: 'bidUnit', type: 'input'},
          {label: '中标金额', value: 'bidPrice', type: 'input'},
          {label: '投标申请单是否提交', value: 'taskSubmit', type: 'switch', activevalue: 1, inactivevalue: 0},
          {label: '投标申请单编号', value: 'taskNumber', type: 'input'},
          {label: '备注', value: 'remark', type: 'textarea'}
        ],
        rules: {},
        labelWidth: '140px'
      }
    }
  },
  methods: {
    resetForm() {
      this.formInfo.data = {

      }
    },
    async handleClick() {
      let params = {
        id: JSON.parse(sessionStorage.getItem('editBid')).id,
        departmentCode: this.formInfo.data.departmentCode,
        bidName: this.formInfo.data.bidName,
        section: this.formInfo.data.section,
        budget: this.formInfo.data.budget,
        procurementUnit: this.formInfo.data.procurementUnit,
        sign: this.formInfo.data.sign,
        proposer: this.formInfo.data.proposer,
        coordinator: this.formInfo.data.coordinator,
        projectApply: this.formInfo.data.projectApply,
        bidEditor: this.formInfo.data.bidEditor,
        bidor: this.formInfo.data.bidor,
        cooperator: this.formInfo.data.cooperator,
        cashDeposit: this.formInfo.data.cashDeposit,
        bidOpeningTime: this.formInfo.data.bidOpeningTime ? dateFormatter(this.formInfo.data.bidOpeningTime) : '',
        bidUnit: this.formInfo.data.bidUnit,
        bidPrice: this.formInfo.data.bidPrice,
        remark: this.formInfo.data.remark,
        taskSubmit: this.formInfo.data.taskSubmit,
        taskNumber: this.formInfo.data.taskNumber
      }
      let res = await updateBidInfo(params);
      const { success, message } = res;
      if (success) {
        this.$notify({
          title: "成功提示",
          message: '编辑投标信息成功!',
          type: 'success'
        });
        this.$router.push({ name: 'Bid' });
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
.editBid {
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
