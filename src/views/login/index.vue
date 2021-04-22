<template>
  <div :class="className">

    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="shake-style login-form" auto-complete="on" label-position="left">

      <div class="avatar-container">
        <svg-icon :icon-class="avatarName" style="height:80px;width:80px" />
      </div>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="Username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="Password"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" :type="btnType" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

    </el-form>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能长度不能小于六位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      btnType: 'primary',
      className: 'login-container super-bg-color',
      avatarName: 'Super-Login-Avatar'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:rgb(229,229,229);
$light_gray:#fff;
$cursor: black;

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
      color: black;
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
@keyframes shakeTopx {
  0%,
  100% {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  -webkit-transform-origin: 50% 0;
  transform-origin: 50% 0;
  }
  5% {
  -webkit-transform: rotate(1deg);
  transform: rotate(1deg) translate(0,50%);
  }
  10%,
  20%,
  30% {
  -webkit-transform: rotate(-2deg);
  transform: rotate(-2deg) translate(0,50%);
  }
  15%,
  25%,
  35% {
  -webkit-transform: rotate(2deg);
  transform: rotate(2deg) translate(0,50%);
  }
  40% {
  -webkit-transform: rotate(-1deg);
  transform: rotate(-1deg) translate(0,50%);
  }
  45% {
  -webkit-transform: rotate(1deg);
  transform: rotate(1deg) translate(0,50%);
  }
  50% {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg) translate(0,50%);
  }
  60%,70%,80%,90%,100%{
    transform: translate(0,50%);
  }
  }
.shake-style{
  animation: shakeTopx 2s;
}
$bg:#409EFF;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  padding: 0 20px 0 20px;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
    background: #fff;
    transform: translate(0,50%);
    border-radius: 8px;
    padding: 0 10px 0 10px;
    box-shadow: 2px 2px 5px 0 rgba(0,0,0,.3);
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
    color: black;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .avatar-container {
    text-align: center;
    background: #fff;
    margin-bottom: 15px;
    margin-top: 15px;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: black;
    cursor: pointer;
    user-select: none;
  }
}
.super-bg-color{
  background: linear-gradient(#000046,#0575E6,#43CBFF);
}
.organization-bg-color{
  background: linear-gradient(#159957,#67C23A,#96c93d);
}
</style>
