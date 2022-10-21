<template>
  <div class="app-container">
    <el-form id="formAbout" :disabled="!isEditing">
      <el-form-item label="关于我页面url" style="font-size: 20px">
        <el-input v-model.trim="form.url"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="handleClick">{{ isEditing ? '提交' : '编辑' }}</el-button>
  </div>
</template>

<script>
import { getAboutUrlApi, setAboutUrlApi } from '@/api/about';
export default {
  data() {
    return {
      form: {
        url: '',
      },
      // 一开始不可编辑
      isEditing: false,
    };
  },
  methods: {
    async getAboutUrl() {
      const { data } = await getAboutUrlApi();
      // console.log(resp);
      this.form.url = data;
    },
    async handleClick() {
      if (!this.isEditing) {
        this.isEditing = true;
      } else {
        await setAboutUrlApi(this.form.url);
        await this.getAboutUrl();
        this.$message.success('修改成功');
        this.isEditing = false;
      }
    },
  },
  created() {
    this.getAboutUrl();
  },
};
</script>

<style scoped>
#formAbout {
  width: 800px;
}
#formAbout label {
  font-size: 24px;
  margin: 14px 0;
}
</style>
