<template>
  <div>
    <Header />
    <div class="mms-content">
      <div class="mms-left">
        <LeftNav
          accordion
          ref="sideMenu"
          mode="horizontal"
          :active-name="$route.name"
          @on-select="turnToPage"
        />
      </div>
      <div class="mms-right">
        <div class="main-layout-tag-nav-wrapper">
          <TagNav />
        </div>
        <div class="right-content">
          <transition :name="transitionName" mode="in-out">
            <keep-alive :include="cacheList">
              <router-view />
            </keep-alive>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Header from "@/components/header";
import LeftNav from "@/components/leftNav/index";
import TagNav from "@/components/tagsNav/index.vue";
import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      transitionName: "transitionName"
    };
  },
  components: {
    Header,
    LeftNav,
    TagNav
  },
  computed: {
    tagNavList() {
      return this.$store.state.app.tagNavList;
    },
    tagRouter() {
      return this.$store.state.app.tagRouter;
    },
    cacheList() {
      return this.tagNavList.length
        ? this.tagNavList
            .filter(item => !(item.meta && item.meta.notCache))
            .map(item => item.name)
        : [];
    }
  },
  methods: {
    ...mapMutations(["setBreadCrumb", "setTagNavList", "addTag", "setLocal"]),
    turnToPage(route) {
      debugger;
      let { name, params, query } = {};
      if (typeof route === "string") name = route;
      else {
        name = route.name;
        params = route.params;
        query = route.query;
      }
      if (name.indexOf("isTurnByHref_") > -1) {
        window.open(name.split("_")[1]);
        return;
      }
      // if (sessionStorage.getItem("defalutActiveUrl") === route) {
      //   sessionStorage.setItem("defalutActiveUrl", route);
      //   this.$router.replace({
      //     path: "/redirect",
      //     query: {
      //       name: encodeURI(route)
      //     }
      //   });
      // } else {
      //   sessionStorage.setItem("defalutActiveUrl", route);
      this.$router.push({
        name,
        params,
        query
      });
      // }
    },
    handleClick(item) {
      this.turnToPage(item);
    },
    handleCloseTag(res, type, route) {
      if (type === "all") {
        this.turnToPage(this.$config.homeName);
      } else if (routeEqual(this.$route, route)) {
        if (type !== "others") {
          const nextRoute = getNextRoute(this.tagNavList, route);
          this.$router.push(nextRoute);
        }
      }
      this.setTagNavList(res);
    }
  },
  watch: {
    screenWidth(val) {
      const that = this;
      if (val < 768) {
        // 小于768强制折叠
        that.handleCollapsedChange(true);
      } else {
        that.handleCollapsedChange(false);
      }
    },
    $route(newRoute) {
      const { name, query, params, meta } = newRoute;
      console.log(newRoute);
      this.addTag({
        route: { name, query, params, meta },
        type: "push"
      });
      this.setBreadCrumb(newRoute);
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
      this.$refs["sideMenu"].updateOpenName(newRoute.name);
      this.transitionName = 'slider-left';
    }
  }
};
</script>
<style lang="less">
@vw: 19.2vw;
.mms-content {
  height: calc(100% - 54px);
  display: flex;
  justify-content: space-between;
  .mms-left {
    width: 210 / @vw;
  }
  .mms-right {
    width: 87vw;
    margin: 0 20 / @vw 0 16 / @vw;
    background-color: #ecf1f8;
  }
}
</style>
