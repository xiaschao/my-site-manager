<template>
  <div class="edit-project-container">
    <el-form label-width="100px" id="form">
      <el-form-item label="项目名称" class="edit-project-item">
        <el-input v-model.trim="form.name"></el-input>
      </el-form-item>
      <el-form-item label="项目排序" style="width: 300px">
        <el-input v-model.number="form.order" placeholder="请输入排序阿拉伯数字"></el-input>
      </el-form-item>
      <el-form-item label="项目链接" class="edit-project-item">
        <el-input v-model.trim="form.url"></el-input>
      </el-form-item>
      <el-form-item label="GitHub地址" class="edit-project-item">
        <el-input v-model.trim="form.github"></el-input>
      </el-form-item>
      <el-form-item label="项目描述">
        <el-input
          v-model.lazy="form.description"
          type="textarea"
          placeholder="请输入项目描述，每段以英文分号;间隔"
          :rows="15"
        ></el-input>
      </el-form-item>
      <el-form-item label="项目预览图">
        <Upload v-model="form.thumb"></Upload>
      </el-form-item>
      <div class="submit-btn">
        <el-button type="primary" @click="onSubmit">{{
          rowData ? '立即修改' : '立即添加'
        }}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import Upload from '@/components/Upload';
import { reviseProjectApi, addProjectApi } from '@/api/project';
export default {
  components: {
    Upload,
  },
  props: {
    rowData: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      form: {
        description: '', // 项目描述段落
        name: '', // 项目名称
        url: '', // 项目效果请求地址
        github: '', // 项目github地址
        thumb: '', // 缩略图，项目截图
        order: '', // 排序
      },
      submitLoading: false,
    };
  },

  methods: {
    async onSubmit() {
      const des = this.form.description.split(';');
      for (let i = 0; i < des.length; i++) {
        des[i] = des[i].trim();
        if (!des[i]) {
          des.splice(i, 1);
          i--;
        }
      }
      const obj = {
        ...this.form,
        description: des,
      };
      this.submitLoading = true;
      if (this.rowData) {
        await reviseProjectApi(this.rowData.id, obj);
        this.submitLoading = false;
        this.$emit('submitSuccess');
      } else {
        await addProjectApi(obj);
        this.submitLoading = false;
        this.$message.success('添加成功');
        this.$router.push({ name: 'ProjectList' });
      }
    },

    // 填充数据
    fillingRowData() {
      if (!this.rowData) return;
      this.form = {
        ...this.rowData,
        description: this.rowData.description.join(';'),
      };
    },
  },

  created() {
    this.fillingRowData();
  },

  watch: {
    rowData(n, o) {
      //n为新值,o为旧值;
      this.fillingRowData();
    },
  },
};
</script>

<style scoped>
#form {
  width: 700px;
}
.submit-btn {
  text-align: right;
}
</style>
