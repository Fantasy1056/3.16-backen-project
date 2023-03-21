<template>
  <div>
    <el-result icon="success" title="成功" subTitle="点击返回">
      <template #extra>
        <el-button type="primary" @click="goToList">返回</el-button>
      </template>
    </el-result>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToList = () => {
  router.push('/home/goods')
}
</script>

<style></style>
