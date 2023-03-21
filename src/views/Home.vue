<template>
  <div>
    <el-container class="home-container">
      <el-header
        ><h3>电商后台管理系统</h3>
        <el-button @click="logout" type="info">退出登录</el-button></el-header
      >
      <el-container>
        <el-aside :width="collapse ? '64px' : '200px'">
          <div class="toggle-button" @click="collapse = !collapse">|||</div>
          <el-menu
            background-color="#313743"
            text-color="#fff"
            active-text-color="#409eff"
            :unique-opened="true"
            :collapse="collapse"
            :collapse-transition="false"
            router
            :default-active="activePath"
          >
            <!-- default-active指定一个字符串，自动高亮于default-active值相同得二级菜单得index -->
            <!-- el-menu开启router属性就可以把二级菜单改造为路由链接 -->
            <!-- 一级菜单 -->
            <el-sub-menu
              v-for="m in subMenu"
              :key="m.id"
              :index="m.id.toString()"
            >
              <!-- 一级菜单模板区 -->
              <template v-slot:title>
                <!-- 图标 -->
                <el-icon><Eleme></Eleme></el-icon>
                <!-- 文本 -->
                <span>{{ m.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <!-- 二级菜单得index属性为路由链接得跳转地址 -->
              <el-menu-item
                v-for="c in m.children"
                :key="c.id"
                :index="'/home/' + c.path"
                :route="'/home/' + c.path"
                @click="saveHash('/home/' + c.path)"
              >
                <!-- 点击保存当前index对应得hash地址 -->
                <!-- 二级菜单模板 -->
                <template v-slot:title>
                  <!-- 图标 -->
                  <el-icon><Menu></Menu></el-icon>
                  <!-- 文本 -->
                  <span>{{ c.authName }}</span>
                </template>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Eleme, Menu } from '@element-plus/icons-vue'
import { reqGetSubMenu } from '@/api/'
import router from '@/router'

interface Menus {
  authName: string
  id: number
  order: number
  path: string
  children: {
    authName: string
    id: number
    order: number
    path: string
    children: []
  }[]
}
const subMenu = ref<Menus[]>([])
const collapse = ref(false)
const getSubMenu = async () => {
  const { data: res } = await reqGetSubMenu()
  if (res.meta.status === 200) {
    subMenu.value = res.data
  }
}
const saveHash = (hash: string) => {
  localStorage.setItem('hash', hash)
}
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('hash')
  router.replace('/')
}
const activePath = computed(() => localStorage.getItem('hash'))
getSubMenu()
</script>

<style lang="less" scoped>
.home-container {
  height: 100vh;
  .el-header {
    background-color: #363d40;
    line-height: 60px;
    color: #fff;
    font-size: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h3 {
      font-weight: normal;
      font-size: 20px;
    }
  }
  .el-aside {
    background-color: #313743;
    ul {
      border-right: none;
    }
    .toggle-button {
      text-align: center;
      color: #fff;
      background-color: #4a5064;
      font-size: 10px;
      line-height: 24px;
      letter-spacing: 0.2em;
      cursor: pointer;
    }
  }
  .el-main {
    background-color: #e9edf0;
  }
}
</style>
