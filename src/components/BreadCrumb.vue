<template>
  <el-breadcrumb>
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ frist }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ second }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
defineProps(['frist', 'second'])
</script>

<style lang="less" scoped></style>
