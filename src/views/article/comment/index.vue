<template>
  <div class="app-container">
    <!-- <el-autocomplete
      class="inline-input"
      v-model="state2"
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      :trigger-on-focus="false"
      @select="handleSelect"
    ></el-autocomplete> -->
    <!-- 表格 -->
    <el-table :data="comments.rows" border style="width: 100%">
      <el-table-column label="序号" width="80" align="center">
        <template #default="scope">
          {{ scope.$index + 1 + handledIndex }}
        </template>
      </el-table-column>
      <el-table-column label="头像" width="80" align="center">
        <template #default="scope">
          <img :src="scope.row.avatar" alt="" class="avatar-img" />
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="150" align="center"></el-table-column>
      <el-table-column label="评论文章" width="180" align="center">
        <template #default="scope">
          {{ scope.row.blog.title }}
        </template>
      </el-table-column>
      <el-table-column prop="content" label="评论内容"></el-table-column>
      <el-table-column label="评论日期" width="220" align="center">
        <template #default="scope">
          {{ formatDate(scope.row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120">
        <template #default="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
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
        :total="comments.total"
        background
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/formatDate';
import { getCommentsApi, deleteCommentApi } from '@/api/article';

export default {
  data() {
    return {
      comments: {
        rows: [],
        total: 0,
      },
      config: {
        page: 1,
        limit: 10,
        blogid: -1,
        keyword: '',
      },
      // 让index不变化那么块
      handledIndex: 0,
    };
  },
  computed: {
    indexAdd() {
      return this.config.limit * (this.config.page - 1);
    },
  },
  methods: {
    formatDate,
    async getComments() {
      const { data } = await getCommentsApi(this.config);
      this.comments = data;
    },

    async handleSizeChange(val) {
      this.config.limit = val;
      this.config.page = 1;
      await this.getComments();
      this.handledIndex = this.indexAdd;
    },
    async handleCurrentChange(val) {
      this.config.page = val;
      await this.getComments();
      this.handledIndex = this.indexAdd;
    },
    async handleDelete(commentId) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err);

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除');
      }

      await deleteCommentApi(commentId);
      this.$message.success('删除成功！');
      if (this.comments.rows.length === 1 && this.config.page !== 1) {
        this.config.page--;
      }
      this.getComments();
    },
  },
  created() {
    this.getComments();
  },
};
</script>

<style scoped>
.avatar-img {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
.pager {
  margin-top: 30px;
}
</style>
