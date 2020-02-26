<template>
  <div class="editDep">
    <div class="editDep-header">编辑机构信息</div>
    <div class="editDep-form">
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
import { updateDepInfo } from '@/api/department';
export default {
  data () {
    return {
      listTypeInfo: {
        flagList: [
          {name: '启用', value: 0},
          {name: '禁用', value: 1},
        ],
      },
      formInfo: {
        ref: 'editDep',
        labelPosition:'left',
        data: JSON.parse(sessionStorage.getItem('editDep')),
        fieldList : [
          {label: '部门名称', value: 'departmentName', type: 'input'},
          {label: '部门编码', value: 'departmentCode', type: 'input', disabled: true},
        ],
        rules: {},
        labelWidth: '120px',
        inline: false
      }
    }
  },
  mounted() {
    this.initRules();
  },
  methods: {
    initRules () {
      const formInfo = this.formInfo
      formInfo.rules = this.$initRules(formInfo.fieldList)
    },
    resetForm() {
      this.$refs.editDep.resetFields();
    },
    async handleClick() {
      let params = {
        parentId: JSON.parse(sessionStorage.getItem('editDep')).parentId,
        id: JSON.parse(sessionStorage.getItem('editDep')).id,
        departmentName: this.formInfo.data.departmentName,
        departmentCode: this.formInfo.data.departmentCode,
      }
      // formInfo.ref.validate(async valid => {
      //   if(valid) {
          let res = await updateDepInfo(params);
          const { success, message } = res;
          if (success) {
            this.$notify({
              title: "成功提示",
              message: '编辑机构信息成功!',
              type: 'success'
            });
            this.$router.push({ name: 'department' });
          } else {
            this.$notify({
              title: "错误提示",
              message: message,
              type: 'error'
            });
          }
      //   }
      // })
      
    }
  },
  components: {
    DataForm
  }
}
</script>

<style lang="less">
@vw: 19.2vw;
.editDep {
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
