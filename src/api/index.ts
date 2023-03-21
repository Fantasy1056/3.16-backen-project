import $http from './axios'
interface User {
  username: string
  password: string
  email? :string
  mobile? :string
}
interface CateForm {
  cat_pid: number
  cat_name: string
  cat_level: number
}
interface Category {
  type?: number,
  pagenum?: number
  pagesize?: number
}
interface ReqInfo {
  goods_name: string
  goods_cat: string
  goods_price: number
  goods_number: number
  goods_weight: number
  goods_introduce?: string
  pics?: {
    pic: string
  }[]
  attrs?: {
    attr_id: number
    attr_value: string
  }[]
}
const reqLogin = (username: string, password: string) => $http.post('/login', { username, password })

const reqGetSubMenu = () => $http.get('menus')

const reqGetUserList = (pageNum: number, pageSize: number, query?: string) => $http.get('users', {
  params: {
    pagenum: pageNum,
    pagesize: pageSize,
    query
  }
})

const reqAddNewUser = (user: User) => $http.post('users', user)

const reqChangeState = (uId:number, type: boolean) => $http.put(`users/${uId}/${type}`)

const reqDeleteUser = (uId: number) => $http.delete('users/' + uId)

const reqGetUserById = (uId: number) => $http.get('users/' + uId)

const reqEditUserById = (uId: number, email?: string, mobile?: string) => $http.put('users/' + uId, { email, mobile })

const reqGetRightsList = (type: string) => $http.get('rights/' + type)

const reqGetRoleList = () => $http.get('roles')

const reqGetRoleById = (id: number) => $http.get('roles/' + id)

const reqEditRoleById = (id: number, roleName: string, roleDesc?: string) => $http.put('roles/' + id, { roleName, roleDesc })

const reqDeleteRoleById = (id: number) => $http.delete('roles/' + id)

const reqAddNewRole = (roleName: string, roleDesc: string) => $http.post('roles', { roleName, roleDesc })

const reqDeleteRights = (roleId: number, rightId: number) => $http.delete(`roles/${roleId}/rights/${rightId}`)

const reqEditRoleRights = (roleId: number, rids: string) => $http.post(`roles/${roleId}/rights`, { rids })

const reqGetCategoryList = (category: Category) => $http.get('categories', { params: category })

const reqGetCategoryById = (id: number) => $http.get('categories/' + id)

const reqEditCategoryById = (id: number, catName: string) => $http.put('categories/' + id, { cat_name: catName })

const reqDeleteCategoryById = (id: number) => $http.delete('categories/' + id)

const reqAddNewCategory = (cateForm: CateForm) => $http.post('categories', cateForm)

const reqGetParamsList = (id:number, sel: string) => $http.get(`categories/${id}/attributes`, { params: { sel } })

const reqAddNewAttr = (id:number, attr_id: number, attr_sel: string, attr_name: string, attr_vals?:string) => $http.put(`categories/${id}/attributes/${attr_id}`, { attr_sel, attr_name, attr_vals })

const reqDeleteParams = (id: number, attr_id: number) => $http.delete(`categories/${id}/attributes/${attr_id}`)

const reqAddNewParams = (id: number, attr_name: string, attr_sel: string) => $http.post(`categories/${id}/attributes`, { attr_name, attr_sel })

const reqGetGoodsList = (queryInfo: {
  query?: string
  pagenum: number
  pagesize: number
}) => $http.get('goods', { params: queryInfo })

const addNewGoods = (reqInfo: ReqInfo) => $http.post('goods', reqInfo)

const reqGetGoodsById = (id: number) => $http.get('goods/' + id)

const reqEditGoodsById = (id: number, reqInfo: ReqInfo) => $http.put('goods/' + id, reqInfo)

const reqDeleteGoodsById = (id: number) => $http.delete('goods/' + id)

const reqGetOrderList = (queryInfo: {
  query?: string
  pagenum: number
  pagesize: number
  user_id?: number
  pay_status?: string
  is_send?: string
  order_fapiao_title?: string
  order_fapiao_company?: string
  order_fapiao_content?: string
  consignee_addr?: string

}) => $http.get('orders', { params: queryInfo })

const reqGetReport = () => $http.get('reports/type/1')

export {
  reqLogin,
  reqGetSubMenu,
  reqGetUserList,
  reqAddNewUser,
  reqChangeState,
  reqDeleteUser,
  reqGetUserById,
  reqEditUserById,
  reqGetRightsList,
  reqGetRoleList,
  reqGetRoleById,
  reqEditRoleById,
  reqDeleteRoleById,
  reqAddNewRole,
  reqDeleteRights,
  reqEditRoleRights,
  reqGetCategoryList,
  reqGetCategoryById,
  reqEditCategoryById,
  reqDeleteCategoryById,
  reqAddNewCategory,
  reqGetParamsList,
  reqAddNewAttr,
  reqDeleteParams,
  reqAddNewParams,
  reqGetGoodsList,
  reqDeleteGoodsById,
  reqGetOrderList,
  reqGetReport,
  addNewGoods,
  reqGetGoodsById,
  reqEditGoodsById
}
