<template>
  <div class="order-container">
    <BreadCrumb frist="订单管理" second="订单列表"></BreadCrumb>

    <el-card>
      <el-row>
        <el-col :span="12">
          <el-input placeholder="请输入内容">
            <template append>
              <el-button :icon="Search"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-table stripe border :data="orderList">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          width="100"
        ></el-table-column>
        <el-table-column label="是否付款" prop="order_pay" width="100">
          <template v-slot="scope">
            <el-icon v-if="scope.row.cat_deleted" color="lightgreen">
              <CircleCheckFilled></CircleCheckFilled
            ></el-icon>
            <el-icon v-else color="red"
              ><CircleCloseFilled></CircleCloseFilled
            ></el-icon>
          </template>
        </el-table-column>
        <el-table-column
          label="是否发货"
          prop="is_send"
          width="100"
        ></el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">
            {{ dateFormat(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="" width="200">
          <template v-slot="scope">
            <el-button
              size="small"
              type="primary"
              :icon="Edit"
              @click="editLocation(scope.row.order_id)"
            ></el-button>
            <el-button
              size="small"
              type="success"
              :icon="Location"
              @click="showProgressDialog(scope.row.order_id)"
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

    <el-dialog id="edit" title="修改地址" v-model="locationCascaderState">
      <el-form
        label-position="top"
        :rules="cityFormRules"
        :model="addressForm"
        ref="addressFormRef"
      >
        <el-form-item label="省市区/县" prop="city">
          <el-cascader
            :options="cityData"
            :props="{
              expandTrigger: 'hover',
              label: 'label',
              value: 'value',
              children: 'children'
            }"
            v-model="addressForm.selectedCity"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model.trim="addressForm.address"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button>取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </el-dialog>
    <el-dialog id="progress" title="物流进度" v-model="progressDialogState">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressList"
          :key="index"
          :timestamp="activity.time"
          >{{ activity.context }}</el-timeline-item
        >
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue'
import { reqGetOrderList } from '@/api'
import cityData from '@/city_data2017_element.js'
import {
  Search,
  Edit,
  Location,
  CircleCheckFilled,
  CircleCloseFilled
} from '@element-plus/icons-vue'
const orderList = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const locationCascaderState = ref(false)
const progressDialogState = ref(false)
const queryId = ref(0)
const addressForm = reactive({
  selectedCity: [] as string[],
  address: ''
})
const progressList = ref([
  {
    time: '2018-05-10 09:39:00',
    ftime: '2018-05-10 09:39:00',
    context: '已签收,感谢使用顺丰,期待再次为您服务',
    location: ''
  },
  {
    time: '2018-05-10 08:23:00',
    ftime: '2018-05-10 08:23:00',
    context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
    location: ''
  },
  {
    time: '2018-05-10 07:32:00',
    ftime: '2018-05-10 07:32:00',
    context: '快件到达 [北京海淀育新小区营业点]',
    location: ''
  },
  {
    time: '2018-05-10 02:03:00',
    ftime: '2018-05-10 02:03:00',
    context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
    location: ''
  },
  {
    time: '2018-05-09 23:05:00',
    ftime: '2018-05-09 23:05:00',
    context: '快件到达 [北京顺义集散中心]',
    location: ''
  },
  {
    time: '2018-05-09 21:21:00',
    ftime: '2018-05-09 21:21:00',
    context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
    location: ''
  },
  {
    time: '2018-05-09 13:07:00',
    ftime: '2018-05-09 13:07:00',
    context: '顺丰速运 已收取快件',
    location: ''
  },
  {
    time: '2018-05-09 12:25:03',
    ftime: '2018-05-09 12:25:03',
    context: '卖家发货',
    location: ''
  },
  {
    time: '2018-05-09 12:22:24',
    ftime: '2018-05-09 12:22:24',
    context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
    location: ''
  },
  {
    time: '2018-05-08 21:36:04',
    ftime: '2018-05-08 21:36:04',
    context: '商品已经下单',
    location: ''
  }
])

const checkCity = (rule: any, val: any, cb: any) => {
  if (addressForm.selectedCity.length === 0) {
    return cb(new Error('请选择城市！'))
  }
  cb()
}
const cityFormRules = {
  city: [{ validator: checkCity, trigger: 'blur' }],
  address: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
}
const getOrderList = async () => {
  const { data: res } = await reqGetOrderList({
    pagenum: pageNum.value,
    pagesize: pageSize.value
  })
  if (res.meta.status !== 200) return ElMessage.error(res.meta.msg)

  orderList.value = res.data.goods
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
const editLocation = (id: number) => {
  queryId.value = id
  locationCascaderState.value = true
}
const showProgressDialog = (id: number) => {
  queryId.value = id
  progressDialogState.value = true
}
const handleSizeChange = (newSize: number) => {
  pageSize.value = newSize
  getOrderList()
}
const handleCurrentChange = (newPage: number) => {
  pageNum.value = newPage
  getOrderList()
}
getOrderList()
</script>

<style lang="less" scoped></style>
