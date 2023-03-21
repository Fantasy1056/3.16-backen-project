import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { ElLoading } from 'element-plus'
const $http = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/'
})
let loadingInstance: any = null
$http.interceptors.request.use((config) => {
  // 除了登录组件以外其他的数据都需要携带Authorization的token才能访问
  config.headers.Authorization = localStorage.getItem('token')
  // 发起请求前加载进度条
  NProgress.start()
  // 发起请求前展示loading节目
  loadingInstance = ElLoading.service({
    target: 'fullscreen',
    fullscreen: true,
    text: '加载中.....'
  })
  return config
})
// axios后置拦截器
$http.interceptors.response.use((config) => {
  // 请求结束后关闭loading界面
  loadingInstance.close()
  // 请求结束后关闭拦截器
  NProgress.done()
  return config
})

export default $http
