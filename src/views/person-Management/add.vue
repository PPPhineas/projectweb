<template>
  <div class="addperson">
    <div class="addperson-header">新增员工</div>
    <div class="addperson-form">
      <el-form ref="form" :model="form" label-width="100px" label-position="left">
        <el-form-item label="用户名">
          <el-input placeholder="请输入用户名" v-model="form.username"/>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" placeholder="请输入员工姓名" v-model="form.password"/>
        </el-form-item>
        <el-form-item label="员工姓名">
          <el-input placeholder="请输入员工姓名" v-model="form.realName"/>
        </el-form-item>
        <el-form-item label="员工手机号">
          <el-input placeholder="请输入员工手机号" v-model="form.phone"/>
        </el-form-item>
        <el-form-item label="岗位">
          <el-select v-model="form.station" placeholder="请选择员工岗位">
            <el-option v-for="(item,index) in personDict.station" :key="index" :value="item.value" :label="item.name">{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工状态">
          <el-select v-model="form.status" placeholder="请选择员工状态">
            <el-option v-for="(item,index) in personDict.status" :key="index" :value="item.value" :label="item.name">{{item.name}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职时间">
          <el-date-picker v-model="form.hireDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择入职时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="离职时间">
          <el-date-picker v-model="form.resignDate" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="请选择离职时间"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset">取消</el-button>
          <el-button @click="addEmployee">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { addEmployee } from '@/api/person'
export default {
  data() {
    return {
      form:{
        username:'',
        password:'',
        realName:'',
        phone:'',
        hireDate:'',
        resignDate:'',
        status:'',
        mail:'',
      }
    }
  },
  computed: {
    personDict() {
      if (this.$store.state.user.personDict) {
        return this.$store.state.user.personDict
      }else {
        return JSON.parse(sessionStorage.getItem('personDict'));
      }
    }
  },
  methods: {
    async addEmployee() {
      let parmas = {
        username: this.form.username,
        password:  this.form.password,
        realName: this.form.realName,
        phone: this.form.phone,
        hireDate: this.form.hireDate,
        resignDate: this.form.resignDate,
        status: this.form.status,
        station: this.form.station,
        mail: this.form.mail
      };
      let res = await addEmployee(parmas);
      const {success,message} = res;
      if (success) {
        this.$notify({
          title: "成功提示",
          message: '添加员工信息成功!',
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
    width: 500/@vw;
    padding-left: 150/@vw;
    .el-form {
      margin-top: 46/@vw;
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
}
</style>
