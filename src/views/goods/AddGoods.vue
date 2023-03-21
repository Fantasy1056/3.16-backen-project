<template>
  <div class="add-goods">
    <BreadCrumb frist="商品管理" second="商品添加"></BreadCrumb>

    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <el-steps
        :active="parseInt(activeName)"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="reqInfo"
        width="50%"
        :rules="goodsFormRules"
        label-position="top"
        ref="addGoodsForm"
      >
        <el-tabs
          tab-position="left"
          v-model="activeName"
          :before-leave="tabsNameChange"
        >
          <el-tab-pane label="基本信息">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="reqInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="reqInfo.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="reqInfo.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="reqInfo.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="selectedKeys"
                :options="categoriesList"
                :props="{
                  expandTrigger: 'hover',
                  ...categoriesListProps
                }"
                :show-all-levels="false"
                clearable
                @change="cascaderChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
            <el-form-item
              :label="p.attr_name + ':'"
              v-for="p in cateManyList"
              :key="p.attr_id"
            >
              <el-checkbox-group v-model="p.attr_vals">
                <el-checkbox
                  v-for="(val, index) in p.attr_vals"
                  :key="index"
                  :label="val"
                  border
                >
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
            <el-form-item
              v-for="p in cateOnlyList"
              :label="p.attr_name"
              :key="p.attr_id"
            >
              <el-input v-model="p.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="getFile"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
            <el-input
              type="textarea"
              v-model="reqInfo.goods_introduce"
            ></el-input>
            <el-button type="primary" @click="addGoods" style="margin-top: 20px"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog id="preview" v-model="preview">
      <img :src="previewUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { reqGetCategoryList, reqGetParamsList, addNewGoods } from '@/api'
import { useRouter } from 'vue-router'

interface Params {
  attr_id: number
  attr_name: string
  attr_sel: string
  attr_vals: string | string[]
  attr_write: string
  cat_id: number
}
interface ReqInfo {
  goods_name: string
  goods_cat: string
  goods_price: number
  goods_number: number
  goods_weight: number
  goods_introduce?: string
  pics: {
    pic: string
  }[]
  attrs: {
    attr_id: number
    attr_value: string
  }[]
}

const reqInfo = reactive<ReqInfo>({
  goods_name: '',
  goods_cat: '',
  goods_price: 0,
  goods_number: 0,
  goods_weight: 0,
  goods_introduce: '',
  pics: [],
  attrs: []
})

const router = useRouter()

const preview = ref(false)

const previewUrl = ref('')

const goodsFormRules = {
  goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  goods_cat: [{ required: true, message: '请输入商品描述', trigger: 'blur' }],
  goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
  goods_number: [
    { required: true, message: '请输入商品数量', trigger: 'blur' }
  ],
  goods_weight: [
    { required: true, message: '请输入商品重量', trigger: 'blur' }
  ],
  goods_introduce: [
    { required: true, message: '请输入商品介绍', trigger: 'blur' }
  ]
}
const activeName = ref('0')

const addGoodsForm = ref()

const categoriesListProps = {
  label: 'cat_name',
  value: 'cat_id',
  children: 'children'
}
const selectedKeys = ref([])

const categoriesList = ref([])

const cateManyList = ref<Params[]>([])
const cateOnlyList = ref<Params[]>([])

const headersObj = {
  Authorization: localStorage.getItem('token')
}

const getCategoryList = async () => {
  const { data: res } = await reqGetCategoryList()

  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)

  ElMessage.success(res.meta.msg)

  categoriesList.value = res.data
}

const cascaderChange = () => {
  if (selectedKeys.value.length !== 3) return (selectedKeys.value = [])
  // 级联选择器选择后将存放id的数组分割成逗号分隔的字符串保存到reqInfo.goods_cat
  reqInfo.goods_cat = selectedKeys.value.join(',')
}

const getCateParams = async (sel: string) => {
  const { data: res } = await reqGetParamsList(goodsId.value, sel)

  if (res.meta.status !== 200) return ElMessage.error('获取商品参数失败！')

  if (sel === 'many') {
    // 将每一个分类下的参数以逗号分割为数组
    res.data.forEach((item: Params) => {
      item.attr_vals =
        item.attr_vals.length === 0 ? [] : (item.attr_vals as string).split(',')
    })
    ElMessage.success('获取商品参数成功！')
    cateManyList.value = res.data
  } else {
    ElMessage.success('获取商品属性成功！')
    cateOnlyList.value = res.data
  }
}

const tabsNameChange = (newName: string, oldName: string) => {
  // 没选中分类则数组长度不为3，并且即将离开的tabs名字为0时
  if (selectedKeys.value.length !== 3 && oldName === '0') {
    ElMessage.error('请选择商品分类！')
    return false
  } else if (newName === '1') {
    // 即将进入的tabs名字为1时，代表进入的时商品参数面版
    // 进入商品参数面板之前，发起请求获取商品参数
    getCateParams('many')
  } else if (newName === '2') {
    // 即将进入的tabs名字为2时，代表进入的时商品属性面版
    // 进入商品参数面板之前，发起请求获取商品属性
    getCateParams('only')
  }
}

const getFile = (file: any) => {
  reqInfo.pics.push({ pic: file.data.tmp_path })
}

const handleRemove = (file: any) => {
  reqInfo.pics.forEach((item, index) => {
    if (item.pic === file.response.data.tmp_path) {
      reqInfo.pics.splice(index, 1)
    }
  })
}

const handlePreview = (file: any) => {
  preview.value = true
  previewUrl.value = file.response.data.url
}

const addGoods = () => {
  addGoodsForm.value.validate(async (valid: any) => {
    if (!valid) return ElMessage.error('请填写表单必要项')

    const attrArray: {
      attr_id: number
      attr_value: string
    }[] = []

    cateManyList.value.forEach((item) => {
      attrArray.push({
        attr_id: item.attr_id,
        attr_value: item.attr_vals.join(',')
      })
    })

    cateOnlyList.value.forEach((item) =>
      attrArray.push({ attr_id: item.attr_id, attr_value: item.attr_vals })
    )

    reqInfo.attrs = attrArray

    const { data: res } = await addNewGoods(reqInfo)

    if (res.meta.status !== 201) return ElMessage.error('添加商品失败!')

    router.push({
      name: 'addsuccess',
      query: { title: '添加成功', message: '点击返回' }
    })
  })
}

const goodsId = computed(() => {
  return selectedKeys.value[selectedKeys.value.length - 1]
})
getCategoryList()
</script>

<style lang="less" scoped>
.el-alert {
  margin-bottom: 20px;
}
#preview {
  img {
    width: 100%;
  }
}
</style>
