import Vue from 'vue'
import VueRouter from 'vue-router'

//懒加载
const Home = () => import('../views/home/Home')
const Category = () => import('../views/category/Category')
const Profile = () => import('../views/profile/Profile')
const ShopCart = () => import('../views/shopcart/ShopCart')
const Detail = () => import('../views/detail/Detail')

//安装路由
Vue.use(VueRouter)
//创建router
const routes = [
  {
    path : '',
    redirect : '/home'
  },
  {
    path : '/home',
    component : Home
  },
  {
    path : '/category',
    component : Category
  },
  {
    path : '/profile',
    component : Profile
  },
  {
    path : '/shopcart',
    component : ShopCart
  },
  {
    path: '/detail/:iid',
    component : Detail
  }

]

const router = new VueRouter({
  routes,
  mode : 'history'
})

export default router
