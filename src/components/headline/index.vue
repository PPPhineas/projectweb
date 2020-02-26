<template>
  <div class="headline">
    <div class="contain" v-if="location == 'left'">
      <div class="num">{{Num}}</div>
      <div class="title-con">
        <div class="title">{{titleName}}</div>
        <img src="img/icons/装饰线3.png" alt />
        <!-- <img src="../../public/img/icons/装饰圆.png" alt=""> -->
      </div>
    </div>
    <div class="contain" v-else>
      <div class="title-con">
        <div class="title">{{titleName}}</div>
        <img src="img/icons/装饰线2.png" alt />
        <!-- <img src="../../public/img/icons/装饰圆.png" alt=""> -->
      </div>
      <div class="num">{{Num}}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["Num", "titleName",'location'],
  data() {
    return {};
  }
};
</script>
<style lang="less">
@vw: 19.2vw;
.headline {
  .contain {
    display: flex;
    justify-content: space-around;
    align-items: center;
    .num {
      width: 96/@vw;
      height: 78/@vw;
      display: inline-block;
      font-family: MyPuma;
      font-size: 78/@vw;
      line-height: 64/@vw;
      color: #ffffff;
      position: relative;
    }
    .num:after {
      content: "";
      display: inline-block;
      background: #ffffff;
      position: absolute;
      left: 0;
      bottom: 0;
      height: 2/@vw;
      width: 96/@vw;
    }
    .title-con {
      width: 275/@vw;
      height: 78/@vw;
      display: inline-block;
      .title {
        font-family: MicrosoftYaHei-Bold;
        font-size: 42/@vw;
        margin-top: 11/@vw;
        line-height: 45/@vw;
        letter-spacing: 4/@vw;
        color: #ffffff;
        margin-left: 36/@vw;
      }
      img {
        width: 286/@vw;
        height: 24/@vw;
      }
    }
  }
}
</style>
