<template>
  <div class="roles-container">
    <!-- 面包屑 -->
    <BreadCrumb frist="权限管理" second="角色列表"></BreadCrumb>
    <el-card>
      <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>

      <el-table border stripe width="100%" :data="rolesList" row-key="id">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 一级权限和二级三级权限模块 -->
          <template v-slot="scope">
            <RightsDetails :scope="scope"></RightsDetails>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="用户名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scope">
            <el-button
              type="primary"
              size="small"
              :icon="Edit"
              @click="showEditRoleDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="deleteRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="small"
              :icon="Setting"
              @click="setRights(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog id="add" v-model="addRoleDialog" title="添加用户">
      <el-form :model="addRoleData" label-position="top" :rules="formRule">
        <el-form-item label="用户名称" prop="roleName"
          ><el-input v-model="addRoleData.roleName"></el-input
        ></el-form-item>
        <el-form-item label="角色描述" prop="roleDesc"
          ><el-input v-model="addRoleData.roleDesc"></el-input
        ></el-form-item>
      </el-form>
      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary" @click="addNewRole">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog id="edit" v-model="editRoleDialog" title="编辑用户">
      <el-form :model="editRoleData" label-position="top" :rules="formRule">
        <el-form-item label="用户名称" prop="roleName"
          ><el-input v-model="editRoleData.roleName"></el-input
        ></el-form-item>
        <el-form-item label="角色描述" prop="roleDesc"
          ><el-input v-model="editRoleData.roleDesc"></el-input
        ></el-form-item>
      </el-form>
      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary" @click="editRoleById">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog
      id="tree"
      v-model="settingUserVisibleState"
      @close="defKeys = []"
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

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import {
  reqGetRoleList,
  reqGetRoleById,
  reqEditRoleById,
  reqDeleteRoleById,
  reqAddNewRole,
  reqGetRightsList,
  reqEditRoleRights
} from '@/api'
import { Edit, Delete, Setting } from '@element-plus/icons-vue'
import RightsDetails from '@/components/rights/RightsDetails.vue'
const rolesList = ref([])
const addRoleData = ref({
  roleId: 0,
  roleName: '',
  roleDesc: ''
})
const editRoleData = ref({
  roleId: 0,
  roleName: '',
  roleDesc: ''
})
const defaultProps = {
  label: 'authName',
  children: 'children'
}
const editRoleDialog = ref(false)
const addRoleDialog = ref(false)
const settingUserVisibleState = ref(false)
const roleId = ref(0)
const rightTreeList = ref([])
const defKeys = ref([])
const rights = ref()
const formRule = reactive({
  roleName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  roleDesc: [{ required: true, message: '请输入用户描述', trigger: 'blur' }]
})
const getRoleList = async () => {
  const { data: res } = await reqGetRoleList()

  if (res.meta.status === 200) {
    ElMessage.success(res.meta.msg)
    rolesList.value = res.data
  }
}
const showAddRoleDialog = () => {
  addRoleDialog.value = true
}
const addNewRole = async () => {
  const { data: res } = await reqAddNewRole(
    addRoleData.value.roleName,
    addRoleData.value.roleDesc
  )

  if (res.meta.status === 201) {
    ElMessage.success(res.meta.msg)
    getRoleList()
    addRoleDialog.value = false
  }
}
const showEditRoleDialog = async (id: number) => {
  editRoleDialog.value = true
  const { data: res } = await reqGetRoleById(id)

  if (res.meta.status === 200) {
    ElMessage.success(res.meta.msg)
    editRoleData.value = res.data
  }
}
const editRoleById = async () => {
  const { data: res } = await reqEditRoleById(
    editRoleData.value.roleId,
    editRoleData.value.roleName,
    editRoleData.value.roleDesc
  )

  if (res.meta.status === 200) {
    ElMessage.success(res.meta.msg)
    getRoleList()
    editRoleDialog.value = false
  }
}
const deleteRoleById = (id: number) => {
  ElMessageBox.confirm('确定要删除吗？', '删除用户', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const { data: res } = await reqDeleteRoleById(id)
      if (res.meta.status === 200) {
        ElMessage.success(res.meta.msg)
        getRoleList()
      }
    })
    .catch(() => {
      ElMessage.info('删除已取消')
    })
}
const setRights = async (row: any) => {
  settingUserVisibleState.value = true
  roleId.value = row.id
  const { data: res } = await reqGetRightsList('tree')
  if (res.meta.status !== 200) return ElMessage.error('请求数据失败！')

  ElMessage.success('请求数据成功！')
  rightTreeList.value = res.data
  getLeafKeys(row, defKeys.value)
}
const getLeafKeys = (row: any, arr: any) => {
  // 如果row没有children属性,直接push当前属性的id到数组
  if (!row.children) {
    return arr.push(row.id)
  } // 如果row有children属性,循环调用本方法,直到找到第三级
  row.children.forEach((item: any) => {
    getLeafKeys(item, arr)
  })
}
const setRightsSubmit = async () => {
  const keys = [
    ...rights.value.getCheckedKeys(),
    ...rights.value.getHalfCheckedKeys()
  ]
  const idtKeys = keys.join(',')

  const { data: res } = await reqEditRoleRights(roleId.value, idtKeys)
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)

  ElMessage.success('请求数据成功！')
  settingUserVisibleState.value = false
  getRoleList()
}
getRoleList()
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
