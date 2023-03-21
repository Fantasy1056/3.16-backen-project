<template>
  <div class="params">
    <BreadCrumb frist="商品管理" second="分类参数"></BreadCrumb>
    <el-card>
      <el-alert
        title="注意：只允许第三级分类设置相关参数！"
        type="warning"
        show-icon
      />
      <el-row>
        <el-col :span="5">选择商品分类：</el-col>
        <el-col :span="5"
          ><el-cascader
            :options="allCategoryList"
            :props="props"
            v-model="selectedKeys"
            clearble
            @change="handleChange"
          ></el-cascader
        ></el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          label="动态参数"
          name="many"
          :disabled="selectedKeys.length === 0"
        >
          <el-button
            type="primary"
            :disabled="selectedKeys.length === 0"
            @click="showAddDialog = true"
            >添加参数</el-button
          >
          <el-table stripe border :data="paramsList" row-key="cat_id">
            <el-table-column type="expand" width="80">
              <template v-slot="scope">
                <el-tag
                  closable
                  v-for="(tag, index) in scope.row.attr_vals"
                  :key="index"
                  >{{ tag }}</el-tag
                >
                <el-button
                  size="small"
                  @click="showInput(scope.row)"
                  v-if="!scope.row.addNewTagInputVisible"
                  class="button-new-tag"
                  >+New Tag</el-button
                >
                <el-input
                  v-else
                  v-model.trim="scope.row.newTagVals"
                  @keyup.enter="addNewTag(scope.row)"
                  class="input-new-tag"
                  ref="addNewTagInput"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
              wdiht="80"
            ></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
              width="700"
            ></el-table-column>
            <el-table-column label="操作" width="700">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  size="small"
                  :icon="Edit"
                  @click="openEditParamsDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                  @click="deleteParams(scope.row.cat_id, scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="静态属性"
          name="only"
          :disabled="selectedKeys.length === 0"
        >
          <el-button type="primary" :disabled="selectedKeys.length === 0"
            >添加属性</el-button
          >
          <el-table stripe border :data="paramsList" row-key="cat_id">
            <el-table-column type="expand" width="80">
              <template v-slot="scope">
                <el-tag
                  closable
                  v-for="(tag, index) in scope.row.attr_vals"
                  :key="index"
                  >{{ tag }}</el-tag
                >
                <el-button
                  size="small"
                  @click="showInput(scope.row)"
                  v-if="!scope.row.addNewTagInputVisible"
                  class="button-new-tag"
                  >+New Tag</el-button
                >
                <el-input
                  v-else
                  v-model.trim="scope.row.newTagVals"
                  @keyup.enter="addNewTag(scope.row)"
                  class="input-new-tag"
                  ref="addNewTagInput"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              label="#"
              wdiht="80"
            ></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
              width="700"
            ></el-table-column>
            <el-table-column label="操作" width="700">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  size="small"
                  :icon="Edit"
                  @click="openEditParamsDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="small"
                  :icon="Delete"
                  @click="deleteParams(scope.row.cat_id, scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog v-model="showAddDialog" title="添加新属性">
      <el-form label-position="top">
        <el-form-item
          label="属性名称"
          :rules="[
            { required: true, message: '请填写属性名', trigger: 'blur' }
          ]"
        >
          <el-input v-model="attr_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary" @click="addNewParams">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import {
  reqGetCategoryList,
  reqGetParamsList,
  reqAddNewAttr,
  reqDeleteParams,
  reqAddNewParams
} from '@/api'
import { Edit, Delete } from '@element-plus/icons-vue'
interface Category {
  catDeleted: boolean
  catId: number
  catName: string
  catPid: number
  children?: Category[]
}
interface Params {
  attr_id: number
  attr_name: string
  attr_sel: string
  attr_vals: string[] | string
  attr_write: string
  cat_id: number
  addNewTagInputVisible: boolean
  newTagVals: string
}
const allCategoryList = ref<Category[]>([])
const paramsList = ref([])
const selectedKeys = ref([])
const activeName = ref('many')
const addNewTagInput = ref()
const showAddDialog = ref(false)
const currenParamsId = computed(
  () => selectedKeys.value[selectedKeys.value.length - 1]
)
const attr_name = ref('')
const props = {
  expandTrigger: 'hover' as const,
  label: 'cat_name',
  value: 'cat_id',
  children: 'children'
}
const getAllCategoryList = async () => {
  const { data: res } = await reqGetCategoryList()
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)

  ElMessage.success(res.meta.msg)
  allCategoryList.value = res.data
}
const getParamsList = async () => {
  const { data: res } = await reqGetParamsList(
    selectedKeys.value[selectedKeys.value.length - 1],
    activeName.value
  )
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)

  ElMessage.success(res.meta.msg)
  res.data.forEach((item: Params) => {
    item.attr_vals = item.attr_vals === '' ? [] : item.attr_vals.split(',')
    item.addNewTagInputVisible = false
    item.newTagVals = ''
  })
  paramsList.value = res.data
}
const handleChange = () => {
  getParamsList()
}
const handleClick = () => {
  activeName.value = activeName.value === 'many' ? 'only' : 'many'
  getParamsList()
}
const showInput = (row: Params) => {
  row.addNewTagInputVisible = true
}
const addNewTag = async (row: Params) => {
  if (row.newTagVals === '') {
    row.newTagVals = ''
    row.addNewTagInputVisible = false
  } else {
    // paramsData包含添加新标签的所有请求参数
    // 将新标签用push方法添加到被分割后的数组
    row.attr_vals.push(row.newTagVals)
    row.newTagVals = ''
    row.addNewTagInputVisible = false
    // 通过分类id和属性id发起axios添加新标签
    const { data: res } = await reqAddNewAttr(
      row.cat_id,
      row.attr_id,
      row.attr_sel,
      row.attr_name,
      row.attr_vals.toString()
    )
    if (res.meta.status !== 200) {
      return ElMessage.error('添加新tag失败！')
    }

    ElMessage.success('添加成功！')
  }
}
const deleteParams = (id: number, attr_id: number) => {
  ElMessageBox.confirm('确认要删除该属性吗？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const { data: res } = await reqDeleteParams(id, attr_id)

      if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)

      ElMessage.success(res.meta.msg)
      getParamsList()
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
}
const addNewParams = async () => {
  const { data: res } = await reqAddNewParams(
    currenParamsId.value,
    attr_name.value,
    activeName.value
  )

  if (res.meta.status !== 201) return ElMessage.error(res.meta.msg)

  ElMessage.success(res.meta.msg)
  showAddDialog.value = false
  attr_name.value = ''
  getParamsList()
}
getAllCategoryList()
</script>

<style lang="less" scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-row {
  height: 40px;
}
.el-tag {
  margin-right: 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
