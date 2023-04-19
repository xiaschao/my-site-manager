<template>
  <view class="article-list-container">
    <swiper class="swiper" :current="currentIndex" @change="handleChange">
      <swiper-item v-for="item in tabMenu" :id="item.id" class="swiper-item">
        <scroll-view
          scroll-y="true"
          class="list-scroll"
          @scrolltolower="handleToLower"
          :lower-threshold="5"
        >
          <TitleCard v-for="list in articleData[item.id]" :key="list.id" :cardData="list">
          </TitleCard>
          <uni-load-more
            :status="loadStatus"
            v-if="articleData[item.id] && articleData[item.id].length > limit - 1"
          ></uni-load-more>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { getArticleListApi } from "@/api/article.js";
export default {
  name: "ArticleList",
  props: {
    tabMenu: {
      type: Array,
      default: () => [],
    },
    currentIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      articleData: {}, // 总数据
      otherInfo: {}, // 文章的其他信息，页码, 文章总数
      limit: 10, // 每页多少条
      loadStatus: "more",
      currentTabMenuId: "", // 当前分类Id
    };
  },
  watch: {
    tabMenu(newVal, oldVal) {
      if (newVal.length !== 0) {
        // console.log("运行了")
        this.currentTabMenuId = newVal[this.currentIndex].id;
        this.getArticleList(this.currentIndex);
      }
    },
  },
  methods: {
    handleChange(e) {
      const currentIndex = e.detail.current;
      this.$emit("currentChange", currentIndex);
      this.currentTabMenuId = this.tabMenu[currentIndex].id;
      if (
        this.articleData[this.currentTabMenuId] &&
        this.articleData[this.currentTabMenuId].length > 0
      ) {
        return;
      }
      this.getArticleList(currentIndex);
    },
    async getArticleList(currentIndex) {
      const classifyId = this.tabMenu[currentIndex].id;
      this.otherInfo[classifyId] = {
        page: 1,
        total: 0,
      };
      const { data: articleList, total } = await getArticleListApi({
        typeId: +classifyId,
        page: this.otherInfo[classifyId].page,
        limit: this.limit,
      });
      this.$set(this.articleData, classifyId, articleList);
      this.otherInfo[classifyId].total = total;
    },
    async handleToLower() {
      const hasMore =
        this.articleData[this.currentTabMenuId].length <
        this.otherInfo[this.currentTabMenuId].total;
      // console.log(hasMore)
      if (!hasMore) {
        this.loadStatus = "no-more";
        return;
      }
      this.otherInfo[this.currentTabMenuId].page++;
      this.loadStatus = "loading";
      const { articleList } = await getArticleListApi({
        typeId: +this.currentTabMenuId,
        page: this.otherInfo[this.currentTabMenuId].page,
        limit: this.limit,
      });
      // console.log(articleList)
      this.articleData[this.currentTabMenuId] =
        this.articleData[this.currentTabMenuId].concat(articleList);
      this.loadStatus = "more";
    },
  },
};
</script>

<style lang="scss" scoped>
.article-list-container {
  height: 100%;

  .swiper {
    height: 100%;

    .swiper-item {
      height: 100%;

      .list-scroll {
        height: 100%;
        overflow: hidden;
      }
    }
  }
}
</style>
