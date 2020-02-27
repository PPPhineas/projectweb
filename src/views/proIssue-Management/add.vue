<template>
  <div class="addproIssue">
    <div class="addproIssue-header">新增项目问题</div>
    <div class="addproIssue-form">
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
import { addProIssueInfo } from '@/api/proIssue';
import { checkProNum } from '@/api/project.js';
import {dateFormatter} from '@/libs/util.js';
export default {
  data () {
    const checkProNum = (rule, value, callback) => {
      // const check = this.$validate({ label: '项目编号', value, rules: ['notnull']});
      
      if(!value) {
        callback(new Error('请输入项目编号'))
      } else {
        // debugger
        // setTimeout(async() => {
        //   let res = await checkProNum(value);
        //   let {success} = res;
        //   if(success) {
        //     callback();
        //     console.log('1111111')
        //   } else {
        //     callback(new Error('未查到该项目，请重新输入'));
        //   }
        // }, 100)
        checkProNum(value).then(res => {
          if(res.success) {
            // callback();
            // console.log('1111111')
          } else {
            // callback(new Error('未查到该项目，请重新输入'));
            console.log('22222')
          }
        })
        // callback(new Error());
        
      } 
      // else {
      //   callback(new Error('11111'));
      // }
    }
    return {
      listTypeInfo: {
        flagList: [
          {name: '新建', value: 0},
          {name: '处理中', value: 1},
          {name: '关闭', value: 2}
        ],
      },
      formInfo: {
        ref: 'addproIssue',
        labelPosition:'left',
        data: {
          projectNumber: '',
          exhibitor: '',
          descr: '',
          presentation: '',
          solutionTime: '',
          solution: '',
          principal: '',
          identifier: '',
          state: 0,
        },
        fieldList : [
          {label: '项目编号', value: 'projectNumber', type: 'input', validator: checkProNum},
          {label: '提出人', value: 'exhibitor', type: 'select', person: true, filterable: true},
          {label: '发现日期', value: 'presentation', type: 'date'},
          {label: '问题描述', value: 'descr', type: 'textarea'},
          {label: '解决方案', value: 'solution', type: 'textarea'},
          {label: '解决时间', value: 'solutionTime', type: 'date'},
          {label: '负责人', value: 'principal', type: 'select', person: true, filterable: true},
          {label: '验证人', value: 'identifier', type: 'select', person: true, filterable: true},
          {label: '状态', value: 'state', type: 'select', list: 'flagList'},
        ],
        rules: {
          
        },
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
      this.$refs.addproIssue.resetFields();
    },
    async handleClick() {
      let params = {
        projectNumber: this.formInfo.data.projectNumber,
        exhibitor: this.formInfo.data.exhibitor,
        descr: this.formInfo.data.descr,
        presentation: this.formInfo.data.presentation ? dateFormatter(this.formInfo.data.presentation) : '',
        solutionTime: this.formInfo.data.solutionTime ? dateFormatter(this.formInfo.data.solutionTime) : '',
        solution: this.formInfo.data.solution,
        principal: this.formInfo.data.principal,
        identifier: this.formInfo.data.identifier,
        state: this.formInfo.data.state,
      }
      formInfo.ref.validate(async valid => {
        if(valid) {
          let res = await addProIssueInfo(params);
      const { success, message } = res;
      if (success) {
        this.$notify({
          title: "成功提示",
          message: '新增项目问题成功!',
          type: 'success'
        });
        this.$router.push({ name: 'projectIssue' });
      } else {
        this.$notify({
          title: "错误提示",
          message: message,
          type: 'error'
        });
      }
        }
      })
      
    }
  },
  components: {
    DataForm
  }
}
</script>

<style lang="less">
@vw: 19.2vw;
.addproIssue {
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
