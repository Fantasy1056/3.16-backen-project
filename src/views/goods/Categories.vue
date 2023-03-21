<template>
  <div class="categories">
    <BreadCrumb frist="商品管理" second="商品分类"></BreadCrumb>
    <el-card>
      <el-button type="primary" size="large" @click="openAddDialog"
        >添加分类</el-button
      >
      <el-table stripe border :data="categoryList" row-key="cat_id">
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column label="是否有效" prop="cat_deleted">
          <template v-slot="scope">
            <el-icon v-if="!scope.row.cat_deleted" color="lightgreen">
              <CircleCheckFilled></CircleCheckFilled
            ></el-icon>
            <el-icon v-else color="red"
              ><CircleCloseFilled></CircleCloseFilled
            ></el-icon>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="cat_level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.cat_level === 1">
              二级
            </el-tag>
            <el-tag type="warning" v-else>三极</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              :icon="Edit"
              size="small"
              @click="openEditDialog(scope.row.cat_id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              :icon="Delete"
              size="small"
              @click="deleteCategoryById(scope.row.cat_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :page-sizes="[100, 200, 300, 400]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <el-dialog title="添加分类" v-model="showAddDialog">
      <el-form label-position="top">
        <el-form-item
          label="分类名称"
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]"
        >
          <el-input v-model="cateName"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            :options="allCategoryList"
            :props="props"
            v-model="selectedKeys"
            clearble
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="addNewCategory">确认</el-button>
      </template>
    </el-dialog>

    <el-dialog title="修改分类" v-model="showEditDialog">
      <el-form label-position="top">
        <el-form-item
          label="分类名称"
          :rules="[{ required: true, message: '请输入名称', trigger: 'blur' }]"
        >
          <el-input v-model="cateName"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="editCategoryById">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import {
  reqGetCategoryList,
  reqGetCategoryById,
  reqEditCategoryById,
  reqDeleteCategoryById,
  reqAddNewCategory
} from '@/api'
import {
  CircleCheckFilled,
  CircleCloseFilled,
  Edit,
  Delete
} from '@element-plus/icons-vue'

interface Category {
  catDeleted: boolean
  catId: number
  catName: string
  catPid: number
  children?: Category[]
}

const categoryList = ref<Category[]>([])
const allCategoryList = ref<Category[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showEditDialog = ref(false)
const cateId = ref(0)
const cateName = ref('')
const showAddDialog = ref(false)
const selectedKeys = ref([])
const props = {
  expandTrigger: 'hover' as const,
  label: 'cat_name',
  value: 'cat_id',
  children: 'children',
  checkStrictly: true
}
const cateForm = reactive({
  // 分类名称
  cat_name: '',
  // 父级
  cat_pid: 0,
  cat_level: 0
})
const getCategoryList = async () => {
  const { data: res } = await reqGetCategoryList({
    pagenum: pageNum.value,
    pagesize: pageSize.value
  })
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)

  ElMessage.success(res.meta.msg)
  categoryList.value = res.data.result
  total.value = res.data.total
}
const getAllCategoryList = async () => {
  const { data: res } = await reqGetCategoryList({ type: 2 })
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)

  ElMessage.success(res.meta.msg)
  allCategoryList.value = res.data
}

const handleCurrentChange = (newPage: number) => {
  pageNum.value = newPage
  getCategoryList()
}
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
  getCategoryList()
}
const openAddDialog = () => {
  showAddDialog.value = true
  getAllCategoryList()
}
const openEditDialog = async (id: number) => {
  showEditDialog.value = true
  const { data: res } = await reqGetCategoryById(id)
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  cateId.value = res.data.cat_id
  cateName.value = res.data.cat_name
}
const editCategoryById = async () => {
  const { data: res } = await reqEditCategoryById(cateId.value, cateName.value)
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  ElMessage.success(res.meta.msg)
  getCategoryList()
  showEditDialog.value = false
  cateId.value = 0
  cateName.value = ''
}
const deleteCategoryById = async (id: number) => {
  const { data: res } = await reqDeleteCategoryById(id)
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)
  ElMessage.success(res.meta.msg)
  getCategoryList()
}
const handleChange = () => {
  // 如果selectedKeys的长度大于0，则选择了父级分类，反之没有
  if (selectedKeys.value.length > 0) {
    // 父级分类的id永远是联级选择器选择后的数组的最后一个id
    cateForm.cat_pid = selectedKeys.value[selectedKeys.value.length - 1]
    // 当前分类层级永远为联级选择器选择后的数组的长度
    cateForm.cat_level = selectedKeys.value.length
  } else {
    // 没有选择分类则添加的是一级分类
    cateForm.cat_pid = 0
    cateForm.cat_level = 0
  }
}
const addNewCategory = async () => {
  cateForm.cat_name = cateName.value
  const { data: res } = await reqAddNewCategory(cateForm)
  if (res.meta.status !== 201) return ElMessage.error(res.meta.msg)
  ElMessage.success(res.meta.msg)
  showAddDialog.value = false
  getCategoryList()
}
getCategoryList()
</script>

<style lang="less" scoped></style>
