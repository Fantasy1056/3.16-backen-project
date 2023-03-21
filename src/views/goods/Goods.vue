<template>
  <div class="goods">
    <BreadCrumb frist="商品管理" second="商品列表"></BreadCrumb>
    <el-card>
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input v-model="queryWords">
            <template #append>
              <el-button @click="getGoodsList">搜索</el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="router.push('/home/goods/add')"
            >添加商品</el-button
          >
        </el-col>
      </el-row>

      <el-table stripe border :data="goodsList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="120"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="100"
        ></el-table-column>
        <el-table-column label="创建时间" width="180">
          <template v-slot="scope">
            {{ dateFormat(scope.row.add_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template v-slot="scope">
            <el-button
              type="primary"
              :icon="Edit"
              size="small"
              @click="editGoods(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              :icon="Delete"
              size="small"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { reqGetGoodsList, reqDeleteGoodsById } from '@/api'
import { Edit, Delete } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const goodsList = ref([])
const queryWords = ref('')
const router = useRouter()
const getGoodsList = async () => {
  const { data: res } = await reqGetGoodsList({
    query: queryWords.value,
    pagenum: pageNum.value,
    pagesize: pageSize.value
  })

  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)

  goodsList.value = res.data.goods
  total.value = res.data.total
  ElMessage.success(res.meta.msg)
}
const dateFormat = computed(() => (originVal: number) => {
  const dt = new Date(originVal * 1000)
  const year = dt.getFullYear()
  const month = (dt.getMonth() + 1 + '').padStart(2, 0)
  const date = (dt.getDate() + 1 + '').padStart(2, 0)

  const hour = (dt.getHours() + '').padStart(2, 0)
  const minute = (dt.getMinutes() + '').padStart(2, 0)
  const second = (dt.getSeconds() + '').padStart(2, 0)

  return `${year}-${month}-${date} ${hour}:${minute}:${second}`
})
const deleteGoods = (id: number) => {
  ElMessageBox.confirm('确认要删除该商品吗?', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const { data: res } = await reqDeleteGoodsById(id)

      if (res.meta.status !== 200) ElMessage.error(res.meta.msg)

      ElMessage.success(res.meta.msg)
      getGoodsList()
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
}
const editGoods = (id: number) => {
  router.push('/home/goods/edit/' + id)
}
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
  getGoodsList()
}
const handleCurrentChange = (newPage: number) => {
  pageNum.value = newPage
  getGoodsList()
}
getGoodsList()
</script>

<style lang="less" scoped></style>
