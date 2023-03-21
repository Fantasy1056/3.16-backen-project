<template>
  <div>
    <el-dialog
      v-model="settingUserVisibleState"
      @close="defKeys = []"
      @open="setRights(row)"
    >
      <el-tree
        :data="rightTreeList"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        ref="rights"
      ></el-tree>
      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary" @click="setRightsSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped></style>
