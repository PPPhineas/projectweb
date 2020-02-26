<template>
  <div class="addperson">
    <div class="addperson-header">新增生产任务</div>
    <div class="addperson-form">
      <el-form ref="form" :model="form" label-width="130px" label-position="left" :inline="true">
        <el-form-item label="项目名称">
          <el-select  v-model="form.projInfo" filterable remote :remote-method="projremoteMethod" :loading="loading">
            <el-option v-for="item in projOption" :key="item.id" :label="item.projectName" :value="item" >{{item.projectName}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-input  placeholder="请输入部门" v-model="form.departmentCode"/>
        </el-form-item>
        <el-form-item label="产值占比">
          <el-input placeholder="请输入产值占比" v-model="form.outputRatio">
            <i slot="suffix">%</i>
          </el-input>
        </el-form-item>
        <el-form-item label="合同额">
          <el-input placeholder="请输入合同额" v-model.number="form.contractValue">
            <i slot="suffix">元</i>
          </el-input>
        </el-form-item>
        <el-form-item label="产值">
          <el-input placeholder="请输入产值" v-model="form.output"/>
        </el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker v-model="form.transmitTime" type="datetime" placeholder="请选择下单时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="合同要求完成时间">
          <el-date-picker v-model="form.deadline"  type="datetime" placeholder="请选择合同要求完成时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="立项会议时间">
          <el-date-picker v-model="form.approvalTime"  type="datetime" placeholder="请选择立项会议时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="立项发布时间">
          <el-date-picker v-model="form.publishTime"  type="datetime" placeholder="请选择立项发布时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="项目结项时间">
          <el-date-picker v-model="form.endTime"  type="datetime" placeholder="请选择项目结项时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="项目工作内容">
          <el-input type="textarea" placeholder="请输入项目工作内容" v-model="form.description"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" placeholder="请输入备注" v-model="form.remark"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">取消</el-button>
          <el-button @click="submitData">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getProjectlist } from "@/api/project";
import { addProdTask } from "@/api/prodtask";
import {dateFormatter} from '@/libs/util.js';
export default {
  data() {
    return {
      projOption: [],
      loading: false,
      form:{
        approvalTime:'',
        contractValue:'',
      }
    }
  },
  computed: {

  },
  methods: {
    async submitData() {
      let parmas = {
        departmentCode: this.form.departmentCode,
        transmitTime:  this.form.transmitTime ? dateFormatter(this.form.transmitTime) : '',
        outputRatio: this.form.outputRatio,
        contractValue: this.form.contractValue,
        output: this.form.output,
        deadline: this.form.deadline ? dateFormatter(this.form.deadline) : '',
        description: this.form.description,
        approvalTime: this.form.approvalTime ? dateFormatter(this.form.approvalTime) : '',
        publishTime: this.form.publishTime ? dateFormatter(this.form.publishTime) : '',
        material: this.form.material,
        endTime: this.form.endTime ? dateFormatter(this.form.endTime) : '',
        remark: this.form.remark,
        projectName: this.form.projInfo.projectName,
        projectNumber: this.form.projInfo.projectNumber,
        projectManager: this.form.projInfo.projectManager
      };
      let res = await addProdTask(parmas);
      const {success,message} = res;
      if (success) {
        this.$notify({
          title: "成功提示",
          message: '添加生产任务成功!',
          type:'success'
        });
        this.$router.push({name:'person'});
      }else {
        this.$notify({
          title: "错误提示",
          message: message,
          type:'error'
        });
      }
    },
    projremoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(async () => {
          this.loading = false;
          let parmas = {
            projectName: query
          }
          let res = await getProjectlist(parmas);
          const { success, body } = res;
          if (success) {
            this.projOption = body.records;
          }else {
            this.projOption = [];
          }
        },200)
      }else {
        this.projOption = [];
      }
    },
    proNameSelect(value) {
      console.log(value)
    },
    reset() {
      this.$refs.form.resetFields();
    }
  }
}
</script>
<style lang="less" scope>
@vw: 19.2vw;
.addperson {
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

  }
}
</style>
