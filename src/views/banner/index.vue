<template>
  <div class="app-container">
    <!-- 表格区域 -->
    <el-table :data="bannerData" border style="width: 100%">
      <el-table-column label="序号" width="60" align="center">
        <template #default="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="180" align="center"></el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column label="中图" width="180" align="center">
        <template #default="scope">
          <el-image style="width: 100px" :src="scope.row.midImg" fit="fit"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="大图" width="180" align="center">
        <template #default="scope">
          <el-image style="width: 100px" :src="scope.row.bigImg" fit="fit"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template #default="scope">
          <el-tooltip effect="dark" content="编辑" placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="editBanner(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑区域 -->
    <el-dialog title="编辑首页" :visible.sync="dialogFormVisible" top="5vh">
      <el-form :model="editForm">
        <el-form-item label="标题">
          <el-input v-model="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
        <div class="upload-item-container">
          <el-form-item label="中图" class="img-item">
            <Upload v-model="editForm.midImg"></Upload>
          </el-form-item>
          <el-form-item label="大图" class="img-item">
            <Upload v-model="editForm.bigImg"></Upload>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirmBanners">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBannersApi, editBannersApi } from '@/api/banner';
import Upload from '@/components/Upload';
export default {
  components: {
    Upload,
  },
  data() {
    return {
      bannerData: [],
      editForm: {
        id: '',
        title: '',
        description: '',
        midImg: '',
        bigImg: '',
      },
      dialogFormVisible: false,
    };
  },
  methods: {
    async getBanners() {
      const { data } = await getBannersApi();
      this.bannerData = data;
      // console.log(this.bannerData);
    },
    // 点击了编辑按钮，把表格当前行的数据赋值给editForm
    editBanner(rowData) {
      // 注意这里要创建一个新的对象，进行深拷贝
      this.dialogFormVisible = true;
      this.editForm = {
        ...rowData,
      };
    },
    // 点击了确认按钮
    async editConfirmBanners() {
      const bannerArr = [...this.bannerData];
      for (let i = 0; i < bannerArr.length; i++) {
        if (bannerArr[i].id === this.editForm.id) {
          bannerArr[i] = this.editForm;
        }
      }
      await editBannersApi(bannerArr);
      this.dialogFormVisible = false;
      await this.getBanners();
      this.$message.success('数据跟新成功');
    },
  },
  created() {
    this.getBanners();
  },
};
</script>

<style scoped>
.upload-item-container {
  display: flex;
}
.img-item {
  flex: 1;
}
</style>
