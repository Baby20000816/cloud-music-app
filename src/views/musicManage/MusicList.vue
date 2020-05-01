<template>
  <div style="width: 100%">
    <div>
      <!-- 按钮 -->
      <mu-button
        color="secondary"
        class="btn"
        v-for="(item, index) in buttonMenu"
        :key="index"
        @click="Operation(item)"
      >{{
        item.title
      }}</mu-button>
      <mu-text-field
        v-model="keywords"
        placeholder="search"
        @blur.prevent="shows"
      ></mu-text-field>
      <mu-button
        color="secondary"
        @click="search()"
      >点击搜索</mu-button>
    </div>
    <!-- 左边歌单表 -->
    <div style="display:flex;padding: 20px 20px">
      <div
        class="s-l-table"
        v-if="show"
      >
        <mu-data-table
          :columns="columns"
          :data="songList"
          class="s-l-table-content"
        >
          <template slot-scope="scope">
            <td class="is-left">{{ scope.row.songListId }}</td>
            <td class="is-left">{{ scope.row.songListName }}</td>
            <td class="is-right">{{ scope.row.songCount }}</td>
            <td class="is-right">{{ scope.row.createTime.slice(0, 10) }}</td>
          </template>
        </mu-data-table>
        <mu-flex justify-content="center">
          <!-- 每页显示的数量 -->
          <span style="margin-top: 10px">每页显示：</span>
          <mu-select
            style="width:70px"
            v-model="size"
            full-widt
          >
            <mu-option
              v-for="(option, index) in options"
              :key="index"
              :label="option"
              :value="option"
            ></mu-option>
          </mu-select>
          <!-- 分页 -->
          <mu-pagination
            :total="totalPage"
            :current.sync="currentPage"
          ></mu-pagination>
        </mu-flex>
      </div>
      <!-- 右边类型表格 -->
      <div
        class="s-l-tab scroll-hidden"
        v-if="!show"
      >
        <div>
          <!-- tab标签头 -->

          <mu-tabs
            :value.sync="active"
            class="tabs"
            color="pink"
          >
            <mu-tab
              v-for="(type, index1) in types"
              :key="index1"
            >
              {{ type.type }}
            </mu-tab>
          </mu-tabs>
        </div>
        <div>
          <div
            class="demo-text scroll-hidden"
            v-for="(type, index2) in types"
            :key="index2"
            style=" overflow: hidden"
          >
            <!-- 定义表头信息 -->
            <mu-data-table
              :columns="columns"
              :data="type.child"
              class="childTable"
              v-if="active == index2"
            >
              <!-- 定义表格内的数据 -->
              <template slot-scope="scope">
                <td class="is-left">{{ scope.row.song_list_id }}</td>
                <td class="is-left">{{ scope.row.song_list_name }}</td>
                <td class="is-right">{{ scope.row.song_count }}</td>
                <td class="is-right">{{ scope.row.create_time.slice(0, 10) }}</td>
              </template>
            </mu-data-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MusicList',
  data() {
    return {
      sort: {
        name: '',
        order: 'asc'
      },
      options: ['5', '10', '15'],
      columns: [
        { title: 'id', width: 120, name: 'name', align: 'center' },
        { title: '名称', name: 'calories', width: 240, align: 'left', sortable: true },
        { title: '歌曲数', name: 'protein', width: 100, align: 'right', sortable: true },
        { title: '创建时间', name: 'create_time', width: 160, align: 'right', sortable: true }
      ],
      songList: [],
      buttonMenu: [],
      currentPage: 1,
      totalPage: 1000,
      size: 10,
      active: 0,
      types: [],
      typeChildSongList: [],
      keywords: '',
      show: false
    }
  },
  components: {},
  created() {
    this.getSongList()
    console.log('token的值' + this.token)
  },
  mounted() {},
  watch: {
    size: function() {
      this.getSongList()
    },
    currentPage: function() {
      this.getSongList()
    }
  },
  methods: {
    //导出
    Operation(item) {
      this.axios({
        method: 'get',
        url: 'http://localhost:8080' + item.path,
        responseType: 'blob'
      }).then((res) => {
        //指定类型位excel表类型
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
        //创建a标签节点
        const download = document.createElement('a')
        //与获取验证码url方法一样
        const href = window.URL.createObjectURL(blob)
        //给超链接的href属性赋url值
        download.href = href
        //设置下载的文件名
        download.download = '歌单数据表.xls'
        //将a标签放在body中
        document.body.appendChild(download)
        //给a标签生成一个点击事件
        download.click()
        //移除a标签，为了下次点击时创建
        document.body.removeChild(download)
        //移除url
        window.URL.revokeObjectURL(href)
      })
    },

    //获取歌单
    getSongList() {
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/songList/page',
        params: {
          currentPage: this.currentPage,
          size: this.size
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.songList = res.data.data
        this.getButtonMenu()
        this.getSongListType()
      })
    },

    //模糊查询歌单
    search() {
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/songList/blur',
        // 问号带参，表单提交
        params: {
          field: this.keywords
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        this.songList = res.data.data
        this.show = true
      })
    },
    shows() {
      if (this.keywords === '') this.show = false
    },
    // //翻页
    // changePage() {
    //   this.currentPage = this.current
    //   alert(this.current)
    // },
    // //改变每页显示的数据量
    // changeSelection() {
    //   this.size = this.selection
    //   alert(this.selection)
    // },

    getSongListType() {
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/songList/type',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res) => {
        //获取各种类型及属于该类型的歌单数据
        this.types = res.data.data
        console.log(this.types)
        //取出第一种类型的所有歌单，作为默认tab页上显示的数据
        this.typeChildSongList = this.types[0].child
        console.log(this.typeChildSongList)
      })
    },
    //获取歌单中的按钮权限
    getButtonMenu() {
      for (let i = 0; i < this.$store.state.menuList.length; i++) {
        let menu = this.$store.state.menuList[i].subMenus

        if (menu != null) {
          for (let j = 0; j < menu.length; j++) {
            if (menu[j].title === '歌单管理') {
              this.buttonMenu = menu[j].subMenus
            }
          }
        }
      }
    },

    //排序
    handleSortChange({ name, order }) {
      this.list = this.list.sort((a, b) => (order === 'asc' ? a[name] - b[name] : b[name] - a[name]))
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss">
.table {
  background-color: white;
  color: black;
}

.content {
  flex: 0 0 33%;
}

.btn {
  margin: 20px 20px;
}

.s-l-table {
  width: 100%;
  background-color: red;
  margin-right: 60px;
  height: 500px;
  // &-content {
  //   height: 450px;
  //   overflow-y: auto;
  //   overflow-x: hidden;
  //   margin-bottom: 10px;
  // }
}

.tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 120px;
  overflow-y: auto;
}

.s-l-tab {
  background-color: white;
  box-shadow: 2px 2px 2px 2px #ddd;
  height: 500px;
  display: flex;
}

.childTable {
  overflow: auto;
  width: 100%;
  height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
}
.scroll-hidden {
  ::-webkit-scrollbar {
    width: 0 !important;
  }
  ::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
  }
}
</style>
