<template>
  <div class="upload-container">
    <el-upload
      class="avatar-uploader"
      action="/api/upload"
      :headers="auth"
      :show-file-list="false"
      :on-success="handleSuccess"
      :before-upload="beforeImgUpload"
      :style="{ width: width + 'px', height: height + 'px' }"
    >
      <img
        v-if="value"
        :src="value"
        class="avatar"
        :style="{ width: width + 'px', height: height + 'px' }"
      />
      <i
        v-else
        class="el-icon-plus avatar-uploader-icon"
        :style="{ width: width + 'px', height: height + 'px', lineHeight: height + 'px' }"
      ></i>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth';
export default {
  props: {
    value: {
      type: String,
      require: true,
    },
    width: {
      type: Number,
      default: 250,
    },
    height: {
      type: Number,
      default: 200,
    },

    // 正确的格式数组 如['jpg', 'gif', 'bmp', 'webp', 'png'];
    trueExtnames: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleSuccess(resp) {
      if (resp.code === 0 && resp.data) {
        this.$emit('input', resp.data);
      } else {
        this.$message.error(resp.msg || '出错了，上传图片失败');
      }
    },
    beforeImgUpload(file) {
      if (this.trueExtnames.length === 0) {
        return true;
      }
      // console.log(file);
      const filename = file.name;
      const extname = filename.substring(filename.lastIndexOf('.') + 1);
      const res = this.trueExtnames.includes(extname);
      if (res) {
        return true;
      } else {
        this.$message.error(`上传图片只能是 ${this.trueExtnames.toString()} 格式！`);
        return false;
      }
    },
  },
  computed: {
    auth() {
      return {
        Authorization: 'Bearer ' + getToken(),
      };
    },
  },
};
</script>

<style scoped>
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
.avatar {
  display: block;
  object-fit: cover;
}
</style>
