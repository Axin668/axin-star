<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginData"
      :rules="loginRules"
      class="login-form"
    >
      <div class="flex text-white items-center py4 title-wrap">
        <span class="text-2x1 flex-1 text-center title">Axin-Star管理系统</span>
      </div>

      <el-form-item prop="username">
        <div class="p-2 text-white">
          <svg-icon icon-class="user" />
        </div>
        <el-input
          ref="manager_name"
          v-model="loginData.manager_name"
          class="flex-1"
          size="large"
          placeholder="用户名"
        />
      </el-form-item>

      <el-tooltip
        :disabled="isCapslock === false"
        content="Caps lock is On!"
        placement="right"
      >
        <el-form-item prop="password">
          <span class="p-2 text-white">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            v-model="loginData.password"
            class="flex-1"
            placeholder="密码"
            :type="passwordVisible === false ? 'password' : 'input'"
            size="large"
            name="password"
            @keyup="checkCapslock"
            @keyup.enter="handleLogin"
          />
          <span
            class="p-2"
            @click="passwordVisible = !passwordVisible"
          >
            <svg-icon
              :icon-class="passwordVisible === false ? 'eye-close' : 'eye-open'"
              class="text-white cursor-pointer"
            />
          </span>
        </el-form-item>
      </el-tooltip>

      <!-- 验证码 -->
      <el-form-item prop="verifyCode">
        <span class="p-2 text-white">
          <svg-icon icon-class="verify_code" />
        </span>
        <el-col :span="16">
          <el-input
            v-model="loginData.verifyCode"
            auto-complete="off"
            placeholder="验证码"
            class="w-[60%]"
            @keyup.enter="handleLogin"
          />
        </el-col>
        <div class="captcha">
          <img
            :src="captchaBase64"
            alt="验证码"
            @click="getCaptcha"
          />
        </div>
      </el-form-item>

      <el-button
        size="default"
        :loading="loading"
        type="primary"
        class="w-full"
        @click.prevent="handleLogin"
      >
        登录
      </el-button>

      <!-- 账号密码提示 -->
      <div class="mt-4 text-red text-sm">
        <span>用户名: admin</span>
        <span class="ml-4">密码: 123456</span>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router'
import { useStore } from '@/store'
import { LocationQuery, LocationQueryValue, useRoute } from 'vue-router'
import { getCaptchaApi } from '@/api/auth'
import { LoginData } from '@/api/auth/types'
import { ElForm } from 'element-plus'

const store = useStore()
const route = useRoute()

/**
 * 按钮loading
 */
const loading = ref(false)

/**
 * 是否大写锁定
 */
const isCapslock = ref(false)

/**
 * 密码是否可见
 */
const passwordVisible = ref(false)

/**
 * 验证码图片Base64字符串
 */
const captchaBase64 = ref()

/**
 * 登陆表单引用
 */
const loginFormRef = ref(ElForm)

const loginData = ref<LoginData>({
  manager_name: 'admin',
  password: '123456'
})

const loginRules = {
  manager_name: [{ required: true, trigger: 'blur' }],
  password: [{ required: true, trigger: 'blur', validator: passwordValidator }],
  verifyCode: [{ required: true, trigger: 'blur' }]
}

/**
 * 密码校验器
 */
function passwordValidator(rule: any, value: any, callback: any) {
  if (value.length < 6) {
    callback(new Error('The password can not be less than 6 digits!'))
  } else {
    callback()
  }
}

/**
 * 检查输入大小写状态
 */
function checkCapslock(e: any) {
  const { key } = e
  isCapslock.value = key && key.length === 1 && key >= 'A' && key <= 'Z'
}

/**
 * 获取验证码
 */
function getCaptcha() {
  getCaptchaApi().then((resp) => {
    const { data } = resp
    console.log(resp)
    const { verifyCodeBase64, verifyCodeKey } = data
    loginData.value.verifyCodeKey = verifyCodeKey
    captchaBase64.value = verifyCodeBase64
  })
}

/**
 * 登录
 */
function handleLogin() {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      store
        .dispatch('user/login', loginData.value)
        .then(() => {
          const query: LocationQuery = route.query

          const redirect = (query.redirect as LocationQueryValue) ?? '/'

          //拿到query的所有键, 并对数组元素进行迭代, 生成一个累积值.这里用于遍历查询参数对象的属性
          const otherQueryParms = Object.keys(query).reduce(
            //回调函数acc表示累积值, cur表示当前的键
            (acc: any, cur: string) => {
              if (cur !== 'redirect') {
                acc[cur] = query[cur]
              }
              return acc
            },
            {}
          )
          router.push({ path: redirect, query: otherQueryParms })
        })
        .catch(() => {
          //验证失败, 重新生成验证码
          getCaptcha()
        })
        .finally(() => {
          loading.value = false
        })
    }
  })
}

onMounted(() => {
  getCaptcha()
})
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  background-color: #2d3a4b;

  .title-wrap {
    filter: contrast(30);

    .title {
      letter-spacing: 4px;
      animation: showup 3s forwards;
    }

    @keyframes showup {
      0% {
        letter-spacing: -20px;
      }

      100% {
        letter-spacing: 4px;
      }
    }
  }

  .login-form {
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    .captcha {
      position: absolute;
      top: 0;
      right: 0;

      img {
        width: 120px;
        height: 48px;
        cursor: pointer;
      }
    }
  }
}

.el-form-item {
  background: rgb(0 0 0 / 10%);
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 5px;
}

.el-input {
  background: transparent;

  //子组件scoped无效, 使用 :deep
  //注意是两个下划线
  :deep(.el-input__wrapper) {
    padding: 0;
    background: transparent;
    box-shadow: none;

    .el-input__inner {
      color: #fff;
      background: transparent;
      border: 0;
      border-radius: 0;
      caret-color: #fff;

      &:-webkit-autofill {
        box-shadow: 0 0 0 1000px transparent inset !important;
        -webkit-text-fill-color: #fff !important;
      }

      //设置输入框自动填充的延迟属性
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        transition:
          color 99999s ease-out,
          background-color 99999s ease-out;
        transition-delay: 99999s;
      }
    }
  }
}
</style>

