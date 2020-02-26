<template>
  <div class="editDocument">
    <div class="editDocument-header">编辑项目文档</div>
    <div class="editDocument-form">
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
import { updateDocumentInfo } from '@/api/document';
export default {
  data () {
    return {
      listTypeInfo: {
        flagList: [
          {name: '文件', value: 0},
          {name: '图片', value: 1},
          {name: '文档', value: 2}
        ],
      },
      formInfo: {
        ref: 'addDocument',
        labelPosition:'left',
        data: JSON.parse(sessionStorage.getItem('editProDoc')),
        fieldList : [
          {label: '文档编号', value: 'fileNumber', type: 'input'},
          {label: '文档名称', value: 'fileName', type: 'input'},
          // {label: '文档类型', value: 'fileType', type: 'select', list: 'flagList'},
          // {label: '地址', value: 'address', type: 'input'},
          // {label: '上传时间', value: 'uploadTime', type: 'date'},
          {label: '备注', value: 'remark', type: 'textarea'},
          {label: '是否是文件夹', value: 'folder', type: 'switch', activeValue: 0,inactiveValue: 1},
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
      this.$refs.addDocument.resetFields();
    },
    async handleClick() {
      let params = {
        id: JSON.parse(sessionStorage.getItem('proDoc')).id,
        projectNumber: JSON.parse(sessionStorage.getItem('proDoc')).projectNumber,
        fileNumber: this.formInfo.data.fileNumber,
        fileName: this.formInfo.data.fileName,
        // fileType: this.formInfo.data.fileType,
        address: this.formInfo.data.fileName,
        // uploadTime: this.formInfo.data.uploadTime ? (new Date(this.formInfo.data.uploadTime).toISOString()) : '',
        remark: this.formInfo.data.remark,
        folder: this.formInfo.data.folder,
      }
      // formInfo.ref.validate(async valid => {
      //   if(valid) {
          let res = await updateDocumentInfo(params);
          const { success, message } = res;
          if (success) {
            this.$notify({
              title: "成功提示",
              message: '编辑项目文档成功!',
              type: 'success'
            });
            this.$router.push({ name: 'document' });
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
.editDocument {
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
