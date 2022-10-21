<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="form"
      hide-required-asterisk
    >
      <el-form-item label="账户Id" prop="loginId">
        <el-input v-model.trim="form.loginId"></el-input>
      </el-form-item>
      <el-form-item label="账户名称" prop="name">
        <el-input v-model.trim="form.name"></el-input>
      </el-form-item>
      <el-form-item label="旧密码" prop="oldLoginPwd">
        <el-input v-model.trim="form.oldLoginPwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="loginPwd">
        <el-input v-model.trim="form.loginPwd" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPwd">
        <el-input v-model.trim="form.confirmPwd" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="btn-container">
          <el-button type="primary" @click="onSubmit" class="btn">立即修改</el-button>
          <el-button class="btn" @click="resetForm()">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getInfoApi, reviseAccountApi } from '@/api/user.js';
export default {
  methods: {
    async getAccount() {
      const { data } = await getInfoApi();
      // console.log(resp);
      this.form.loginId = data.loginId;
      this.form.name = data.name;
    },
    onSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        // loginForm全部校验正确 valid为 true,否则为 false
        if (valid) {
          const submitData = {
            name: this.form.name,
            loginId: this.form.loginId,
            loginPwd: this.form.loginPwd,
            oldLoginPwd: this.form.oldLoginPwd,
          };
          const resp = await reviseAccountApi(submitData);
          // console.log(typeof resp);
          if (typeof resp === 'string') {
            const res = JSON.parse(resp);
            this.$message.error(res.msg);
            this.resetForm();
            return;
          }
          if (!resp.data) {
            return this.$message.error(resp.msg);
          }

          this.$message.success('修改账户信息成功，请重新登录');
          await this.$store.dispatch('user/logout');
          this.$router.push('/login');
        } else {
          this.$message.error('请按照要求填写表单');
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
  },
  data() {
    // 账户ID验证
    const validLoginId = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入账户ID'));
      } else if (/[\u4E00-\u9FA5]/g.test(value)) {
        callback(new Error('不能输入汉字'));
      } else {
        // 验证通过
        callback();
      }
    };

    // 密码校验
    const validatePwd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'));
      } else {
        if (this.form.confirmPwd !== '') {
          this.$refs.ruleForm.validateField('confirmPwd');
        }
        if (value === this.form.oldLoginPwd) {
          callback(new Error('新密码不可与旧密码一致'));
        }
        callback();
      }
    };

    // 确认密码验证
    const validateConfirmPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.loginPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      form: {
        name: '',
        loginId: '',
        oldLoginPwd: '',
        loginPwd: '',
        confirmPwd: '',
      },

      rules: {
        name: [{ required: true, message: '请输入账户名称', trigger: 'blur' }],
        loginId: [{ validator: validLoginId, trigger: 'blur' }],
        oldLoginPwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        loginPwd: [{ validator: validatePwd, trigger: 'blur' }],
        confirmPwd: [{ validator: validateConfirmPwd, trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getAccount();
  },
};
</script>

<style scoped>
.form {
  width: 500px;
  margin: 80px auto;
}
.btn-container {
  display: flex;
  justify-content: space-around;
}
.btn-container .btn {
  display: block;
  width: 40%;
}
</style>
