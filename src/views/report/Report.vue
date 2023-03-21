<template>
  <div class="report">
    <BreadCrumb frist="数据统计" second="数据报表"></BreadCrumb>
    <el-card>
      <!-- echarts指定的dom元素必须要有宽高 -->
      <div id="main" style="width: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import * as echarts from 'echarts'
import _ from 'lodash'
import { reqGetReport } from '@/api'

const option = {
  title: {
    text: '用户来源'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#E9EEF3'
      }
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      boundaryGap: false
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ]
}
onMounted(async () => {
  const myChart = echarts.init(document.getElementById('main') as HTMLElement)
  // 数据和配置项
  const { data: res } = await reqGetReport()
  // 合并后的新对象作为echarts折线图选项
  myChart.setOption(_.merge(option, res.data))
})
</script>

<style lang="less" scoped></style>
