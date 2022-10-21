<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">个人空间管理系统</h3>
      </div>

      <el-form-item prop="loginId">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="loginId"
          v-model.trim="loginForm.loginId"
          placeholder="请填写管理员账号"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="loginPwd">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="loginPwd"
          v-model.trim="loginForm.loginPwd"
          :type="passwordType"
          placeholder="请输入密码"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <div class="captcha-container">
        <el-form-item prop="captcha" id="captcha">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="captcha"
            v-model.trim="loginForm.captcha"
            placeholder="请填写验证码"
            type="text"
            tabindex="3"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>
        <div id="captchaImg" @click="getCaptchaFn" v-html="captchaSvg"></div>
      </div>

      <div prop="checked" style="margin-bottom: 10px">
        <el-checkbox v-model="loginForm.checked">7天内免登录</el-checkbox>
      </div>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
import getCaptcha from '@/api/getCaptcha';

export default {
  name: 'Login',
  data() {
    return {
      // 表单数据
      loginForm: {
        loginId: '',
        loginPwd: '',
        captcha: '',
        checked: true,
      },
      loginRules: {
        loginId: [{ required: true, trigger: 'blur', message: '账号不能为空' }],
        loginPwd: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
        captcha: [{ required: true, trigger: 'blur', message: '请填写验证码' }],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      captchaSvg: '',
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.loginPwd.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        // loginForm全部校验正确 valid为 true,否则为 false
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch('user/login', {
              loginId: this.loginForm.loginId,
              loginPwd: this.loginForm.loginPwd,
              captcha: this.loginForm.captcha,
              remember: this.loginForm.checked ? 7 : 1,
            })
            .then(() => {
              // console.log('登录成功');
              this.$router.push({ path: this.redirect || '/' });
              this.loading = false;
            })
            .catch((msg) => {
              this.$message.error(msg);
              this.getCaptchaFn().then(() => {
                this.loginForm.captcha = '';
                this.loading = false;
              });
            });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },

    //  获取验证码
    async getCaptchaFn() {
      this.captchaSvg = await getCaptcha();
    },
  },
  created() {
    this.getCaptchaFn();
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .captcha-container {
    display: flex;
    justify-content: space-between;
    #captcha {
      width: 65%;
    }
    #captchaImg {
      width: 150px;
      height: 50px;
    }
  }
}
</style>
