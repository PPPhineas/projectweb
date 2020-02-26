<template>
  <div class="header">
    <div class="header-left">
      <img src="img/logo-white2.png" alt="">
      <span>资料信息化管理系统</span>
    </div>
    <div class="header-right">
      <div>
        <img src="img/avatar.png" alt="">
        <span>admin</span>
      </div>
      <div>
        <img src="img/icon-退出.png" alt="">
        <span>退出</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="less">
@vw: 19.2vw;
.header {
	background-image: linear-gradient(-90deg,
		#00bac6 0%,
		#0090e3 100%),
	linear-gradient(
		#292c36,
		#292c36);
	background-blend-mode: normal,
    normal;
  height: 54/@vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-left {
    display: flex;
    align-items: center;
    img {
      margin: 0 4/@vw 0 17/@vw;
    }
    span{
      font-size: 22/@vw;
      font-weight: bold;
      color: #ffffff;
    }
  }
  .header-right {
    margin-right: 22/@vw;
    display: flex;
    div{
      display: flex;
      align-items: center;
      color: #ffffff;
    }
    div:nth-child(1) {
      margin-right: 28/@vw;
      img {
        margin-right: 9/@vw;
      }
      span {
        font-size: 14/@vw;
      }
    }
    div:nth-child(2) {
      img {
        margin-right: 5/@vw;
      }
      span {
        font-size: 12/@vw;
      }
    }
  }
}
</style>
