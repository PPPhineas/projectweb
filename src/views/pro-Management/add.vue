<template>
  <div class="addperson">
    <div class="addperson-header">新增项目</div>
    <div class="addperson-form">
      <div class="form">
        <el-form ref="form" :model="form" label-width="100px" label-position="left">
          <el-form-item label="项目编号">
            <el-input placeholder="请输入项目编号" v-model="form.projectNumber"/>
          </el-form-item>
          <el-form-item label="项目名称">
            <el-input placeholder="请输入项目名称" v-model="form.projectName"/>
          </el-form-item>
          <el-form-item label="项目类型">
            <el-input placeholder="请输入项目类型" v-model="form.projectType"/>
          </el-form-item>
          <el-form-item label="项目所在部门">
            <el-input placeholder="请输入项目所在部门" v-model="form.departmentCode"/>
          </el-form-item>
          <el-form-item label="项目经理">
            <el-input placeholder="请输入项目经理" v-model="form.principal"/>
          </el-form-item>
          <el-form-item label="立项时间">
            <el-date-picker v-model="form.projectTime" placeholder="请选择立项时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="项目背景">
            <el-input type="textarea" placeholder="请输入项目背景" v-model="form.projectDescribe"/>
          </el-form-item>
          <el-form-item label="项目所处阶段">
            <el-input placeholder="请输入项目所处阶段" v-model="form.phase"/>
          </el-form-item>
          <el-form-item label="项目进度偏差">
            <el-input placeholder="请输入项目进度偏差" v-model="form.progressBar"/>
          </el-form-item>
          <el-form-item label="项目整体进度">
            <el-input placeholder="请输入项目整体进度" v-model="form.schedule"/>
          </el-form-item>
          <el-form-item label="项目问题总数">
            <el-input placeholder="请输入项目问题总数" v-model.number="form.issueCount"/>
          </el-form-item>
          <el-form-item label="项目风险总数">
            <el-input placeholder="请输入项目风险总数" v-model.number="form.riskCount"/>
          </el-form-item>
          <el-form-item>
            <el-button @click="reset">取消</el-button>
            <el-button @click="addEmployee">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="select-person">
        <div>
          <div>请选择项目经理</div>
          <div>
            <el-select v-model="form.principal" filterable remote :remote-method="palremoteMethod" :loading="loading">
              <el-option v-for="item in palOption" :key="item.id" :label="item.username" :value="item.id" ></el-option>
            </el-select>
          </div>
        </div>
        <div>
          <div>请选择项目参与人</div>
          <div>
            <el-select v-model="form.projectEmployees" filterable remote :remote-method="palremoteMethod" :loading="loading">
              <el-option v-for="item in palOption" :key="item.id" :label="item.username" :value="item.id" ></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { addProject, getProjPersonlist } from '@/api/project';
import { getPersonlist } from "@/api/person";
import { setTimeout } from 'timers';
import {dateFormatter} from '@/libs/util.js';
export default {
  data() {
    return {
      form:{

      },
      loading: false,
      palOption:[],
    }
  },
  methods: {
    async addEmployee() {
      let parmas = {
        project: {
          projectNumber: this.form.projectNumber,
          projectName: this.form.projectName,
          projectType: this.form.projectType,
          departmentCode:this.form.departmentCode,
          principal: this.form.principal,
          projectTime: this.form.projectTime ? dateFormatter(this.form.projectTime) : '',
          projectDescribe: this.form.projectDescribe,
          phase: this.form.phase,
          progressBar: this.form.progressBar,
          schedule: this.form.schedule,
          issueCount: this.form.issueCount,
          riskCount: this.form.riskCount
          },
        projectEmployees:[],
        
      };
      console.log(dateFormatter(this.form.projectTime));
      // let res = await addProject(parmas);
      // let {success} = res;
      // if(success) {
      //   this,$router.push({name: 'project'});
      // }
    },
    reset() {
      this.$refs.form.resetFields();
    },
    palremoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(async () => {
          this.loading = false;
          let parmas = {
            username: query
          }
          let res = await getPersonlist(parmas);
          const { success, body } = res;
          if (success) {
            this.palOption = body.records;
          }else {
            this.palOption = [];
          }
        },200)
      }else {
        this.palOption = [];
      }
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
    margin-top: 46/@vw;
    display: flex;
    .form {
      .el-form {
        font-size: 14/@vw;
        .el-form-item{
          .el-form-item__content{
            .el-input__inner{
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
          }
        }
      }
    }
    .select-person {
      margin-left: 50/@vw;
    }

  }
}
</style>
