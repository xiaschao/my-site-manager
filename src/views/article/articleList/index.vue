<template>
  <div class="app-container">
    <!-- 表格 -->
    <el-table :data="blogs.rows" border style="width: 100%">
      <el-table-column label="序号" width="80" align="center">
        <template #default="scope">
          {{ scope.$index + 1 + handleIndex }}
        </template>
      </el-table-column>
      <el-table-column label="文章名称" width="230">
        <template #default="scope">
          <el-popover
            placement="right"
            title="博客预览图"
            width="200"
            trigger="hover"
            :disabled="!scope.row.thumb"
          >
            <el-image
              style="width: 170px"
              :src="scope.row.thumb"
              fit="cover"
              :preview-src-list="srcList"
            ></el-image>
            <a
              class="farLink"
              slot="reference"
              :href="baseUrl + '/article/detail/' + scope.row.id"
              target="_blank"
              rel="noopener noreferrer"
              >{{ scope.row.title }}</a
            >
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="description" label="文章描述"></el-table-column>
      <el-table-column prop="scanNumber" label="浏览数" width="80" align="center"></el-table-column>
      <el-table-column
        prop="commentNumber"
        label="评论量"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column label="所属分类" width="80" align="center">
        <template #default="scope">{{
          scope.row.category ? scope.row.category.name : '未分类'
        }}</template>
      </el-table-column>
      <el-table-column label="创建日期" width="230" align="center">
        <template #default="scope">
          {{ formatDate(scope.row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template #default="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="handleEditBtn(scope.row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleDelete(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pager">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="config.page"
        :page-sizes="[5, 10, 20]"
        :page-size="config.limit"
        layout="prev, pager, next, total , ->, sizes, jumper"
        :total="blogs.total"
        background
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getBlogApi, deleteBlogApi } from '@/api/article';
import { formatDate } from '@/utils/formatDate';
import { FRONT_DEST_URL } from '@/urlConfig';
export default {
  data() {
    return {
      blogs: {
        rows: [],
        total: 0,
      },
      config: {
        page: 1,
        limit: 5,
        keyword: '',
        categoryId: -1,
      },
      // 让index不变化那么块
      handleIndex: 0,
      baseUrl: FRONT_DEST_URL,

      srcList: [], // 大图预览
    };
  },
  computed: {
    indexAdd() {
      return this.config.limit * (this.config.page - 1);
    },
    // 总页码数
    // totalPages() {
    //   return Math.ceil(this.blogs.total / this.config.limit);
    // },
  },
  methods: {
    async getBlogs() {
      const { data } = await getBlogApi(this.config);
      this.blogs = data;
      // console.log(data);
      for (const item of this.blogs.rows) {
        item.thumb && this.srcList.push(item.thumb);
      }
    },
    formatDate,
    async handleSizeChange(val) {
      this.config.limit = val;
      this.config.page = 1;
      await this.getBlogs();
      this.handleIndex = this.indexAdd;
    },
    async handleCurrentChange(val) {
      this.config.page = val;
      await this.getBlogs();
      this.handleIndex = this.indexAdd;
    },
    async handleDelete(blogId) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文章且文章下所有评论也会删除, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err);

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除');
      }

      await deleteBlogApi(blogId);
      this.$message.success('删除成功！');
      if (this.blogs.rows.length === 1 && this.config.page !== 1) {
        this.config.page--;
      }
      this.getBlogs();
    },

    // 点击了编辑按钮
    handleEditBtn(blogId) {
      // console.log(blogId);
      this.$router.push({
        name: 'EditArticle',
        params: {
          id: blogId,
        },
      });
    },
  },
  created() {
    this.getBlogs();
  },
};
</script>

<style scoped>
.pager {
  margin-top: 30px;
}
.farLink:hover {
  color: #f40;
}
</style>
