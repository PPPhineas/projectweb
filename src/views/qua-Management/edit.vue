<template>
  <div class="editQua">
    <div class="editQua-header">编辑资质信息</div>
    <div class="editQua-form">
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
import { editQuaInfo } from '@/api/qualification.js';
import {dateFormatter} from '@/libs/util.js';
export default {
  data () {
    return {
      listTypeInfo: {
        flagList: [
          {name: '资格类', value: 0},
          {name: '行业类', value: 1},
          {name: '运维类', value: 2}
        ]
      },
      formInfo: {
        ref: 'editQua',
        labelPosition:'left',
        data: JSON.parse(sessionStorage.getItem('editQua')),
        fieldList : [
          {label: '资质名称', value: 'certificateName', type: 'input', disabled: true, required: true},
          {label: '证书类型', value: 'certificateType', type: 'select', list: 'flagList'},
          {label: '证书编号', value: 'certificateNumber', type: 'input'},
          {label: '获证日期', value: 'certificateDate', type: 'date'},
          {label: '有效截止日期', value: 'effectiveDate', type: 'date'},
          {label: '发证机构', value: 'organization', type: 'input'}
        ],
        rules: {},
        labelWidth: '120px',
        inline: false
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
        id: JSON.parse(sessionStorage.getItem('editQua')).id,
        certificateName: this.formInfo.data.certificateName,
        certificateType: this.formInfo.data.certificateType,
        certificateNumber: this.formInfo.data.certificateNumber,
        certificateDate: this.formInfo.data.certificateDate ? dateFormatter(this.form.certificateDate) : '',
        effectiveDate: this.formInfo.data.effectiveDate ? dateFormatter(this.form.effectiveDate) : '',
        organization: this.formInfo.data.organization,
      }
      let res = await editQuaInfo(params);
      const { success, message } = res;
      if (success) {
        this.$notify({
          title: "成功提示",
          message: '编辑资质信息成功!',
          type: 'success'
        });
        this.$router.push({ name: 'qualification' });
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
.editQua {
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
        width: 530/@vw;
        margin-right: 80/@vw;
        .el-form-item__content{
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

