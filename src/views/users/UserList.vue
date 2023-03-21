<template>
  <div class="userlist">
    <BreadCrumb frist="用户管理" second="用户列表"></BreadCrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="query">
            <template #append>
              <el-button :icon="Search" @click="getUserList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="showDialog = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <el-table stripe border :data="userList">
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="号码"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeState(scope.row.uId, scope.row.mg_state)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot="scope">
            <el-tooltip content="编辑" placement="top-start" :enterable="false">
              <el-button
                @click="openEditDialog(scope.row.id)"
                type="primary"
                :icon="Edit"
                size="small"
              ></el-button>
            </el-tooltip>

            <el-tooltip content="删除" placement="top-start" :enterable="false">
              <el-button
                type="danger"
                :icon="Delete"
                size="small"
                @click="deleteUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                :icon="Setting"
                size="small"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[1, 2, 4, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      v-model="showDialog"
      title="添加用户"
      @closed="closeDialog(form)"
    >
      <el-form
        label-position="top"
        :model="addUserForm"
        :rules="formRules"
        ref="form"
      >
        <el-form-item label="用户名" prop="username"
          ><el-input v-model="addUserForm.username"></el-input
        ></el-form-item>
        <el-form-item label="密码" prop="password"
          ><el-input v-model="addUserForm.password"></el-input
        ></el-form-item>
        <el-form-item label="邮箱" prop="email"
          ><el-input v-model="addUserForm.email"></el-input
        ></el-form-item>
        <el-form-item label="手机" prop="mobile"
          ><el-input v-model="addUserForm.mobile"></el-input
        ></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button
        ><el-button type="primary" @click="addNewUser">添加</el-button>
      </template>
    </el-dialog>

    <el-dialog title="编辑用户" v-model="isEditUser">
      <el-form :model="editUserForm" :rules="formRules" label-position="top">
        <el-form-item label="用户名" prop="username"
          ><el-input v-model="editUserForm.username" :disabled="true"></el-input
        ></el-form-item>
        <el-form-item label="邮箱" prop="email"
          ><el-input v-model="editUserForm.email"></el-input
        ></el-form-item>
        <el-form-item label="手机" prop="mobile"
          ><el-input v-model="editUserForm.mobile"></el-input
        ></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="isEditUser = false">取消</el-button
        ><el-button type="primary" @click="editUserById(editUserForm.id)"
          >编辑</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import {
  reqGetUserList,
  reqAddNewUser,
  reqChangeState,
  reqDeleteUser,
  reqGetUserById,
  reqEditUserById
} from '@/api/index'
import { Search, Edit, Delete, Setting } from '@element-plus/icons-vue'
import type { FormRules, FormInstance } from 'element-plus'
const userList = ref([])
const query = ref('')
const pageSize = ref(10)
const pageNum = ref(1)
const total = ref(0)
const showDialog = ref(false)
const isEditUser = ref(false)
const form = ref<FormInstance>()
const emailzz = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
const numberzz =
  /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
const checkEmail = (rule: any, value: any, cb: any) => {
  if (value === '') return cb(new Error('邮箱不能为空!'))
  if (emailzz.test(value)) {
    cb()
  } else {
    cb(new Error('邮箱格式不正确!'))
  }
}
const checkNumber = (rule: any, value: any, cb: any) => {
  if (value === '') return cb(new Error('手机号码不能为空!'))
  if (numberzz.test(value)) {
    cb()
  } else {
    cb(new Error('号码格式不正确!'))
  }
}
const addUserForm = reactive({
  username: '',
  password: '',
  email: '',
  mobile: ''
})
const editUserForm = reactive({
  id: 0,
  username: '',
  email: '',
  mobile: ''
})
const formRules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '长度在6到16个字符', trigger: 'blur' }
  ],
  mobile: [{ validator: checkNumber, trigger: 'blur', required: true }],
  email: [{ validator: checkEmail, trigger: 'blur', required: true }]
})
const getUserList = async () => {
  const { data: res } = await reqGetUserList(
    pageNum.value,
    pageSize.value,
    query.value
  )

  if (res.meta.status === 200) {
    userList.value = res.data.users
    total.value = res.data.total
    pageNum.value = res.data.pagenum
  }
}
const addNewUser = async () => {
  const { data: res } = await reqAddNewUser(addUserForm)
  if (res.meta.status === 201) {
    ElMessage.success('添加用户成功')
    showDialog.value = false
    getUserList()
  }
}
const changeState = async (uId: number, type: boolean) => {
  const { data: res } = await reqChangeState(uId, type)
  if (res.meta.status === 201) {
    ElMessage.success('修改用户状态成功')
    getUserList()
  }
}
const deleteUser = async (uId: number) => {
  const { data: res } = await reqDeleteUser(uId)
  if (res.meta.status === 200) {
    ElMessage.success(res.meta.msg)
    getUserList()
  }
}
const handleCurrentChange = (newPage: number) => {
  pageNum.value = newPage
  getUserList()
}
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
  getUserList()
}
const openEditDialog = async (uId: number) => {
  isEditUser.value = true
  const { data: res } = await reqGetUserById(uId)

  if (res.meta.status === 200) {
    ElMessage.success(res.meta.msg)
    editUserForm.id = res.data.id
    editUserForm.username = res.data.username
    editUserForm.email = res.data.email
    editUserForm.mobile = res.data.mobile
  }
}
const closeDialog = (form: FormInstance | undefined) => {
  isEditUser.value = false
  form.resetFields()
}
const editUserById = async (uId: number) => {
  const { data: res } = await reqEditUserById(
    uId,
    editUserForm.email,
    editUserForm.mobile
  )
  if (res.meta.status === 200) {
    ElMessage.success(res.meta.msg)
    getUserList()
    isEditUser.value = false
  }
}
getUserList()
</script>

<style lang="less" scoped></style>
