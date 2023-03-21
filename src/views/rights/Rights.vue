<template>
  <div class="rights-container">
    <!-- 面包屑 -->
    <BreadCrumb frist="权限管理" second="权限列表"></BreadCrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-table style="width: 100%" border stripe :data="rightsList">
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'"
              >二级</el-tag
            >
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { reqGetRightsList } from '@/api/'

const rightsList = ref([])

const getRightList = async () => {
  const { data: res } = await reqGetRightsList('list')

  if (res.meta.status === 200) {
    ElMessage.success(res.meta.msg)
    rightsList.value = res.data
  }
}
getRightList()
</script>

<style lang="less" scoped></style>
