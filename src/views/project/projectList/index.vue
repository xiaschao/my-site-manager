<template>
  <div class="app-container">
    <!-- 表格区域 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column label="序号" width="80" align="center">
        <template #default="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" width="200">
        <template #default="scope">
          <a :href="scope.row.url" target="_blank" rel="noopener noreferrer" class="farLink">
            {{ scope.row.name }}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="order" label="排序" width="60" align="center"></el-table-column>
      <el-table-column label="项目描述">
        <template #default="scope">{{ scope.row.description[0] }}......</template>
      </el-table-column>
      <el-table-column label="预览图" width="180" align="center">
        <template #default="scope">
          <el-image style="width: 100px" :src="scope.row.thumb" fit="fit"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="项目地址" width="100" align="center">
        <template #default="scope">
          <a :href="scope.row.github" target="_blank" rel="noopener noreferrer">
            <el-button type="info" class="iconfont icon-github-fill" circle></el-button>
          </a>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            @click="handleEdit(scope.row)"
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

    <!-- 弹出层 -->
    <el-drawer
      title="修改此项目信息"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      :size="740"
    >
      <div class="demo-drawer__content">
        <EditProject
          ref="editProjectThis"
          :rowData="rowData"
          @submitSuccess="handleSubmitSuccess"
        ></EditProject>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getAllProjectsApi, deleteProjectApi } from '@/api/project';
import EditProject from '../components/EditProject.vue';
export default {
  components: {
    EditProject,
  },
  data() {
    return {
      tableData: [],
      // 点击编辑，该行的数据
      rowData: null,
      table: false,
      dialog: false,
    };
  },
  methods: {
    async getProjects() {
      const { data } = await getAllProjectsApi();
      this.tableData = data;
      console.log(data);
    },

    async handleDelete(projectId) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将删除该项目展示, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch((err) => err);

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除');
      }
      await deleteProjectApi(projectId);
      this.$message.success('删除成功！');
      this.getProjects();
    },

    // 直接关闭前的询问
    handleClose(done) {
      if (this.$refs.editProjectThis.submitLoading) {
        return;
      }
      this.$confirm('表单填写信息未保存，确定关闭吗？')
        .then(() => done())
        .catch(() => {});
    },

    // 点击了表格中的编辑按钮
    handleEdit(row) {
      this.rowData = row;
      this.dialog = true;
    },

    handleSubmitSuccess() {
      this.$message.success('修改成功');
      this.dialog = false;
      this.getProjects();
    },
  },
  created() {
    this.getProjects();
  },
};
</script>

<style scoped>
.demo-drawer__footer {
  text-align: right;
  padding-right: 40px;
}
.farLink:hover {
  color: #f40;
}
</style>
