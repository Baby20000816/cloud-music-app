<template>
  <div class="con">
    <div
      v-for="(item, index) in admins"
      :key="index"
    >
      <div v-if="item.id === user.userId">
        <div class="card">
          <div class="hearder">
            <img
              :src="item.avatar"
              alt=""
              style="height:100px"
              @click="changeAvatar()"
              v-bind="admin.avatar=item.avatar"
            />
          </div>
          <div class="container">
            <p
              style="font-size:32px"
              v-bind="(admin.name = item.name)"
            >{{ item.name }}</p>
          </div>
          <button @click="show = !show">修改资料</button>
        </div>

        <div
          class="card"
          v-if="show"
          style="margin:50px 0px 0px 0px ;"
        >
          <div class="header">
            <p>用户名:<input
                type="text"
                v-model="item.name"
                @input="change(item.name)"
                v-bind="(admin.status = item.status)"
              /></p>
            <p>修改头像:
              <input
                type="file"
                ref="file"
                class="file"
                @change="uploadAvatar($event)"
              /></p>
          </div>
          <div class="container"><button @click="changeAdmin(key)">修改</button></div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
const toLower = (text) => {
  return text.toString().toLowerCase()
}

const searchByName = (items, term) => {
  if (term) {
    return items.filter((item) => toLower(item.name).includes(toLower(term)))
  }

  return items
}
export default {
  name: 'User',
  data() {
    return {
      search: null,
      searched: [],
      permission: [],
      current: 1,
      admins: [],
      roles: [],
      user: JSON.parse(localStorage.getItem('user')),
      admin: {
        name: '',
        status: '',
        avatar: ''
      },
      show: false
    }
  },
  components: {},
  created() {
    this.getAdmin()
    this.permission = this.$store.state.menuList1[1].subMenus[0].permissions
  },
  mounted() {},
  methods: {
    newUser() {
      window.alert('Noop')
    },
    searchOnTable() {
      this.searched = searchByName(this.admins, this.search)
    },
    change(name) {
      this.admin.name = name
    },
    getAdmin() {
      this.axios({
        method: 'get',
        url: 'http://localhost:8080/sysAdmin/list'
      }).then((res) => {
        this.admins = res.data.data.admin
        this.roles = res.data.data.roles
        console.log(this.admins)
        this.searched = this.admins
      })
    },
    uploadAvatar(event) {
      const OSS = require('ali-oss')
      let client = new OSS({
        region: 'oss-cn-hangzhou',
        accessKeyId: 'LTAI4FcUiGZb75XGwiCC7Yzu',
        accessKeySecret: 'ZX0hbGsO2aOAWUfGJlrL48Tkp0bfFQ',
        bucket: 'student-m'
      })
      let timestamp = Date.parse(new Date())
      let imgUrl = 'img/' + timestamp
      var file = event.target.files[0] //获取文件流
      // var url = ''
      var _this = this
      client.multipartUpload(imgUrl, file).then(function(result) {
        _this.admin.avatar = result.res.requestUrls[0]
        _this.updateAdminInfo(_this.admin.avatar)
      })
    },
    changeAvatar() {
      console.log(this.$refs.file)
      this.$refs.file.click()
    },
    changeAdmin() {
      alert(this.admin.name)
      alert(this.admin.avatar)
      alert(this.admin.status)
      this.axios({
        method: 'put',
        url: 'http://localhost:8080/sysAdmin/update',
        data: {
          name: this.admin.name,
          avatar: this.admin.avatar,
          status: this.admin.status
        }
      }).then((res) => {
        console.log(res)
      })
    }
  },
  computed: {}
}
</script>

<style scoped lang="scss">
.card {
  width: 250px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); //设置两层阴影
  text-align: left;
  padding: 10px 0px 0px 10px;
}

.card-header {
  background-color: #4caf50;
  color: white;
  padding: 10px;
  font-size: 40px;
}

.card-container {
  padding: 10px;
}
</style>
