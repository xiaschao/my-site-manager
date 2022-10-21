<template>
  <div class="app-container">
    <h2 class="title">
      <span>网站全局设置</span>
      <el-button type="primary" @click="handleEdit">编辑</el-button>
    </h2>
    <el-descriptions direction="vertical" :column="3" border>
      <el-descriptions-item label="网站标题">{{ globalSetting.siteTitle }}</el-descriptions-item
      ><el-descriptions-item label="邮箱">{{ globalSetting.mail }}</el-descriptions-item>
      <el-descriptions-item label="网站备案号">{{ globalSetting.icp }}</el-descriptions-item>
      <el-descriptions-item label="github名称">{{ globalSetting.githubName }}</el-descriptions-item>
      <el-descriptions-item label="github主页" :span="2">
        {{ globalSetting.github }}
      </el-descriptions-item>
      <el-descriptions-item label="头像预览">
        <el-image
          style="width: 70px; height: 70px"
          :src="globalSetting.avatar"
          fit="cover"
        ></el-image>
      </el-descriptions-item>
      <el-descriptions-item label="网站图标预览">
        <el-image
          style="width: 70px; height: 70px"
          :src="globalSetting.favicon"
          fit="cover"
        ></el-image>
      </el-descriptions-item>
      <el-descriptions-item label="图标地址">{{ globalSetting.favicon }}</el-descriptions-item>
      <el-descriptions-item label="微信号">{{ globalSetting.weixin }}</el-descriptions-item>
      <el-descriptions-item label="微信二维码" :span="2">
        <el-image
          style="width: 70px; height: 70px"
          :src="globalSetting.weixinQrCode"
          fit="cover"
        ></el-image>
      </el-descriptions-item>
      <el-descriptions-item label="QQ号">{{ globalSetting.qq }}</el-descriptions-item>
      <el-descriptions-item label="QQ二维码" :span="2">
        <el-image
          style="width: 70px; height: 70px"
          :src="globalSetting.qqQrCode"
          fit="cover"
        ></el-image>
      </el-descriptions-item>
    </el-descriptions>

    <el-drawer
      title="编辑网站全局设置"
      :before-close="handleClose"
      :visible.sync="dialog"
      direction="rtl"
      custom-class="demo-drawer"
    >
      <div class="demo-drawer__content">
        <el-form label-position="top">
          <el-form-item label="网站标题">
            <el-input v-model="form.siteTitle"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.mail"></el-input>
          </el-form-item>
          <el-form-item label="网站备案号">
            <el-input v-model="form.icp"></el-input>
          </el-form-item>
          <el-form-item label="博主github主页">
            <el-input v-model="form.github"></el-input>
          </el-form-item>
          <el-form-item label="博主github名称">
            <el-input v-model="form.githubName"></el-input>
          </el-form-item>
          <el-form-item label="博主头像">
            <Upload v-model="form.avatar" :width="100" :height="100"></Upload>
          </el-form-item>
          <el-form-item label="网站图标地址">
            <el-input v-model="form.favicon"></el-input>
          </el-form-item>
          <!-- <el-form-item label="网站图标，只能上传ico格式">
            <Upload v-model="form.favicon" :width="100" :height="100" :trueExtnames="['ico']">
            </Upload>
          </el-form-item> -->
          <el-form-item label="博主qq号">
            <el-input v-model="form.qq"></el-input>
          </el-form-item>
          <el-form-item label="博主微信号">
            <el-input v-model="form.weixin"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="qq二维码">
                <Upload v-model="form.qqQrCode" :width="100" :height="100"></Upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="微信二维码">
                <Upload v-model="form.weixinQrCode" :width="100" :height="100"></Upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="loading">{{
            loading ? '提交中 ...' : '提 交'
          }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getGlobalSettingApi, setGlobalSettingApi } from '@/api/setting';
import Upload from '@/components/Upload';
export default {
  components: {
    Upload,
  },
  data() {
    return {
      globalSetting: {
        avatar: '', // 博主照片
        siteTitle: '', // 网站标题
        github: '', // 博主github主页
        qq: '', // 博主 qq
        qqQrCode: '', // 博主qq二维码
        weixin: '', // 博主微信号
        weixinQrCode: '', // 博主微信二维码
        mail: '', // 博主邮箱
        icp: '', // 网站备案号
        githubName: '', // 博主github名称
        favicon: '', // 网站图标
      },

      form: {},
      dialog: false,
      loading: false,
    };
  },
  methods: {
    async getGlobalSetting() {
      const { data } = await getGlobalSettingApi();
      this.globalSetting = data;
    },
    // 点击了编辑按钮
    handleEdit() {
      this.dialog = true;
      this.form = {
        ...this.globalSetting,
      };
    },

    handleClose(done) {
      if (this.loading) {
        return;
      }
      this.$confirm('表单填写信息未保存，确认关闭？')
        .then(() => {
          done();
        })
        .catch(() => {});
    },

    cancelForm() {
      this.loading = false;
      this.dialog = false;
    },

    async handleSubmit() {
      this.loading = true;
      const { data } = await setGlobalSettingApi(this.form);
      this.globalSetting = data;
      this.$message.success('修改成功');
      this.cancelForm();
    },
  },
  created() {
    this.getGlobalSetting();
  },
};
</script>

<style scoped>
.form {
  width: 700px;
}
.title {
  margin-top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.demo-drawer__content {
  padding: 0 20px;
}
.demo-drawer__footer {
  text-align: right;
  margin-bottom: 30px;
}
</style>
