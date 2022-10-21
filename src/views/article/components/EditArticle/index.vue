<template>
  <div class="app-container">
    <el-card shadow="never">
      <div slot="header" id="header-container">
        <h3 class="title">文章信息</h3>
        <el-button type="primary" id="commitBtn" @click="handleCommit">{{ btnText }}</el-button>
      </div>
      <div id="blogInfo-container">
        <el-form label-width="80px" class="blogInfoForm">
          <el-form-item label="文章标题">
            <el-input v-model.trim="blogInfoForm.title"></el-input>
          </el-form-item>
          <el-form-item label="文章分类">
            <el-select placeholder="请选择" v-model="blogInfoForm.categoryId">
              <el-option
                v-for="item in types"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文章描述">
            <el-input type="textarea" v-model.lazy="blogInfoForm.description" :rows="10"></el-input>
          </el-form-item>
        </el-form>
        <div id="setImg-area">
          <h3>文章预览图（可选）</h3>
          <Upload v-model="blogInfoForm.thumb"></Upload>
          <el-button
            type="danger"
            v-if="model === 'edit'"
            style="margin-top: 10px"
            @click="delectImg"
            >删除预览图</el-button
          >
        </div>
      </div>
    </el-card>

    <el-card id="editBlog-container" shadow="never">
      <div slot="header">
        <h3 class="title">编辑文章</h3>
      </div>
      <div>
        <Editor height="800px" ref="markdownEditor" :options="editorOptions"></Editor>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAllBlogTypeApi, reviseBlogApi, getSingleBlogApi, publishBlogApi } from '@/api/article';
import Upload from '@/components/Upload';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/zh-cn';
import { Editor } from '@toast-ui/vue-editor';
export default {
  components: {
    Upload,
    Editor,
  },
  props: {
    model: {
      type: String,
      default: 'add',
    },
  },
  data() {
    return {
      blogInfoForm: {
        title: '',
        description: '',
        categoryId: '',
        thumb: '',
      },
      types: [],
      editorOptions: {
        language: 'zh-CN',
      },
    };
  },
  computed: {
    blogId() {
      return this.$route.params.id;
    },
    btnText() {
      if (this.model === 'add') {
        return '发布文章';
      } else {
        return '确认修改';
      }
    },
  },
  methods: {
    async getAllTypes() {
      const { data } = await getAllBlogTypeApi();
      this.types = data;
    },

    // 一开始获取文章信息回填表单
    async getArticle() {
      const { data } = await getSingleBlogApi(this.blogId);
      // console.log(data);
      if (data.category) this.blogInfoForm.categoryId = data.category.id;
      this.blogInfoForm.description = data.description;
      this.blogInfoForm.title = data.title;
      this.blogInfoForm.thumb = data.thumb;
      this.$refs.markdownEditor.invoke('setHTML', data.htmlContent);
    },

    // 点击了修改文章
    async handleCommit() {
      // console.log(this.$refs.markdownEditor);
      // console.log(this.$refs.markdownEditor.invoke('getHTML'));

      const config = {
        ...this.blogInfoForm,
        htmlContent: this.$refs.markdownEditor.invoke('getHTML'),
        createDate: Date.now(),
        markdownContent: this.$refs.markdownEditor.invoke('getMarkdown'),
        toc: [],
      };
      if (
        config.title &&
        config.description &&
        config.categoryId &&
        config.htmlContent &&
        config.markdownContent
      ) {
        let info = '';
        if (this.model === 'edit') {
          await reviseBlogApi(this.blogId, config);
          info = '文章修改成功';
        } else {
          await publishBlogApi(config);
          info = '文章发布成功';
        }
        this.$message.success(info);
        this.$router.push({ name: 'ArticleList' });
      } else {
        this.$message.warning('请填写完整');
      }
    },

    // 点击删除预览图
    delectImg() {
      this.blogInfoForm.thumb = '';
    },
  },
  async created() {
    await this.getAllTypes();
    if (this.model === 'edit') {
      this.getArticle();
    }
  },
};
</script>

<style scoped>
.title {
  color: #008c8c;
  margin: 0;
}
.blogInfoForm {
  width: 700px;
}

#blogInfo-container {
  display: flex;
}
#setImg-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
#editBlog-container {
  margin-top: 40px;
}
#header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
