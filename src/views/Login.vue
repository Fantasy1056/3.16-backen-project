<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <div class="input-box">
        <el-form ref="form">
          <el-form-item prop="username">
            <el-input :prefix-icon="User" v-model="username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              v-model="password"
              type="password"
            ></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="checkForm">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { reqLogin } from '@/api/index'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()
const checkForm = async () => {
  const { data: res } = await reqLogin(username.value, password.value)
  if (res.meta.status === 200) {
    localStorage.setItem('token', res.data.token)
    ElMessage.success('登陆成功！')
    localStorage.setItem('hash', '/home/users')
    router.push('/home')
  }
}
const resetForm = () => {
  username.value = ''
  password.value = ''
}
</script>

<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #2b4b6b;

  .login-box {
    position: relative;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 0 10px #ddd;

    .avatar-box {
      position: absolute;
      left: 50%;
      top: -65px;
      transform: translateX(-50%);
      height: 130px;
      width: 130px;
      border-radius: 50%;
      border: 5px solid #eee;
      overflow: hidden;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .input-box {
      width: 100%;
      position: absolute;
      bottom: 0;
      padding: 0 20px;
      .el-form-item {
        height: 40px;
        label {
          text-align: center;
        }
        /deep/ .el-input__wrapper {
          height: 40px;
        }
      }
      .btns {
        display: flex;
        justify-content: flex-end;
        /deep/ .el-form-item__content {
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>
