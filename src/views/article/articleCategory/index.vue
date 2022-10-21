<template>
  <div class="app-container">
    <!-- 输入框 -->
    <div class="inputAddType">
      <el-input
        placeholder="请输入要添加的分类，左边选择该分类的等级"
        v-model.trim="input"
        class="input-with-select"
      >
        <el-select v-model="select" placeholder="请选择" slot="prepend">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-input>
      <el-button type="primary" @click="handleAddBtn">添加</el-button>
    </div>

    <!-- 表格 -->
    <el-table :data="tableData" border style="width: 70%">
      <el-table-column label="序号" width="100" align="center">
        <template #default="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="文章分类" width="180" align="center"></el-table-column>
      <el-table-column
        prop="articleCount"
        label="文章数量"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column prop="order" label="分类层级" width="180" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="handleEditBtn(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.id)"
            size="small"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出框 -->
    <el-dialog title="编辑该分类" :visible.sync="dialogFormVisible" width="35%">
      <el-form :model="form">
        <el-form-item label="分类名称">
          <el-input v-model.trim="form.name"></el-input>
        </el-form-item>
        <el-form-item label="分类层级">
          <el-select v-model="form.order" placeholder="请选择分类层级">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addBlogTypeApi,
  deleteBlogTypeApi,
  reviseBlogTypeApi,
  getAllBlogTypeApi,
} from '@/api/article';

export default {
  data() {
    return {
      input: '',
      tableData: [],
      dialogFormVisible: false,
      form: {
        typeId: '',
        name: '',
        order: 1,
      },
      options: [
        { value: 1, label: '层级一' },
        { value: 2, label: '层级二' },
        { value: 3, label: '层级三' },
      ],
      select: 1,
    };
  },
  methods: {
    async getAllBlogType() {
      const { data } = await getAllBlogTypeApi();
      this.tableData = data;
    },

    // 点击了添加按钮
    async handleAddBtn() {
      if (!this.input) {
        return this.$message.warning('分类不能为空');
      }
      await addBlogTypeApi({
        name: this.input,
        order: this.select,
      });
      this.$message.success('添加成功');
      this.input = '';
      this.select = 1;
      this.getAllBlogType();
    },
    // 点击了表格中编辑按钮
    handleEditBtn(rowData) {
      this.dialogFormVisible = true;
      // console.log(rowData);
      this.form.name = rowData.name;
      this.form.order = rowData.order;
      this.form.typeId = rowData.id;
    },
    // 点击了表格中删除按钮
    async handleDelete(typeId) {
      const confirmRes = await this.$confirm(
        '此操作将永久删除该分类，该分类下的文章都将处于未分类状态， 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err);

      // 点击了取消
      if (confirmRes !== 'confirm') {
        return this.$message.info('取消了该操作');
      }
      await deleteBlogTypeApi(typeId);
      this.$message.success('删除成功！');
      this.getAllBlogType();
    },
    // 点击了确认编辑按钮
    async confirmEdit() {
      await reviseBlogTypeApi(this.form);
      this.$message.success('修改成功');
      this.dialogFormVisible = false;
      this.getAllBlogType();
    },
  },
  created() {
    this.getAllBlogType();
  },
};
</script>

<style scoped>
.el-input .el-select {
  width: 100px;
}
.input-with-select {
  width: 420px;
  margin-right: 20px;
  background-color: #fff;
}
.inputAddType {
  margin-bottom: 40px;
}
</style>
