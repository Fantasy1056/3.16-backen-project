<template>
  <div>
    <el-row
      v-for="(f, index) in scope.row.children"
      :key="f.id"
      :class="[index === 0 ? 'bdtop' : '', 'bdbottom', 'vcenter']"
    >
      <!-- 渲染一级权限 -->
      <!-- 源数据的每一项渲染一级权限 -->
      <el-col :span="5">
        <el-tag closable @close="removeRightById(scope.row, f.id)">{{
          f.authName
        }}</el-tag>
        <i class="el-icon-caret-right"></i>
      </el-col>
      <!-- 渲染二级和三级权限 -->
      <!-- 源数据的children属性渲染二级权限 -->
      <!-- 源数据的children属性的children属性渲染三级权限 -->
      <el-col :span="19">
        <el-row
          v-for="(s, index) in f.children"
          :key="s.id"
          :class="[index === 0 ? '' : 'bdtop', 'vcenter']"
        >
          <el-col :span="6">
            <el-tag
              type="success"
              closable
              @close="removeRightById(scope.row, s.id)"
              >{{ s.authName }}</el-tag
            >
            <i class="el-icon-caret-right"></i>
          </el-col>
          <el-col :span="18">
            <el-tag
              v-for="t in s.children"
              :key="t.id"
              type="warning"
              closable
              @close="removeRightById(scope.row, t.id)"
              >{{ t.authName }}</el-tag
            >
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { reqDeleteRights } from '@/api'
defineProps(['scope'])

const removeRightById = (row: any, id: number) => {
  ElMessageBox.confirm('是否要移除这个权限？', '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const { data: res } = await reqDeleteRights(row.id, id)
      if (res.meta.status !== 200) {
        return ElMessage.error('移除权限失败！')
      }

      ElMessage.success('移除权限成功！')
      // 将ajax请求回来的响应体赋值给传进来的数据，做到不刷新页面更新权限区域
      // scope传进来的数据是源数据的浅拷贝,所以直接赋值可以改变源数据
      row.children = res.data
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '移除取消！'
      })
    })
}
</script>

<style lang="less" scoped>
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
