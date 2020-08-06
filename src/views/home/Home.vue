<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control class="tab-control2" :titles="titles"
                 @tabClick="tabClick"
                 ref="tabControl1" v-show="isTabFixed"></tab-control>
    <scroll class="content" ref="scroll"
            :probe-type="3" @scroll="contentScroll"
            :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners" @SwiperImageLoad="swiperImageLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control class="tab-control" :titles="titles"
                   @tabClick="tabClick"
                   ref="tabControl2"></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowTop"></back-top>
  </div>

</template>

<script>

  import NavBar from 'components/common/navbar/NavBar';
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'

  import {getHomeMultidata,getHomeGoods} from "network/home";
  import {debounce} from "common/utils";

  export default {
    name: "home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data(){
      return{
        result: null,
        banners: [],
        recommends: [],
        titles: ['流行','新款','精选'],
        goods:{
          pop: {page: 0 , list: []},
          new: {page: 0 , list: []},
          sell:{page: 0 , list: []}
        },
        currentType: 'pop',
        isShowTop: false,
        tabOffsetTop: 0,
        isTabFixed:false,
        saveY:0
      }
    },
    created() {
      this.getHomeMultidata()
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    activated(){
      this.$refs.scroll.refresh()
      this.$refs.scroll.scroll.scrollTo(0,this.saveY,0)

    },
    deactivated(){
      this.saveY = this.$refs.scroll.scroll.y
    },
    mounted(){
      const refresh = debounce(this.$refs.scroll.refresh , 200)
      this.$bus.$on('itemImageLoad' , ()=>{
        refresh()
    })
    },
    methods:{
      /*
      * 监听事件相关方法
      * */
      tabClick(index){
        switch (index){
          case 0: this.currentType = 'pop'
            break
          case 1: this.currentType = 'new'
            break
          case 2: this.currentType = 'sell'
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index

      },
      backClick(){
        this.$refs.scroll.scrollTo(0,0,666)
      },
      contentScroll(position){
        //判断backTop是否显示
          this.isShowTop = (-position.y)>1000
        // console.log(position);
        //判断tabControl是否到达指定位置
        this.isTabFixed = (-position.y)>this.tabOffsetTop

      },
      loadMore(){
        this.getHomeGoods(this.currentType)
        this.$refs.scroll.scroll.refresh()
      },
      swiperImageLoad(){
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
        // console.log(this.tabOffsetTop);
      },

      /*
      * 网络请求事件的相关方法
      * */
      getHomeMultidata(){
        getHomeMultidata().then(res =>{
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type){
        const page = this.goods[type].page+1
        getHomeGoods(type,page).then(res =>{
          // for(let n of res.data.list){
          //   this.goods[type].list.push(n)
          // this.goods[type].page+=1
          // }
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page+=1

          this.$refs.scroll.finishPullUp()
        })
      }
    },
    computed:{
      showGoods(){
         return this.goods[this.currentType].list
      }
    }
  }
</script>

<style scoped>
  #home{
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }
  /*.tab-control {*/
  /*  position: relative;*/
  /*  z-index: 9;*/
  /*  background-color: #ffffff;*/
  /*}*/
  .tab-control2{
    position: relative;
    z-index: 9;
    background-color: #ffffff;
  }
  .content{
    /*height: calc(100% - 44px);*/
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  /*.fixed{*/
  /*  position: fixed;*/
  /*  left: 0;*/
  /*  right: 0;*/
  /*  top: 44px;*/
  /*}*/

</style>
