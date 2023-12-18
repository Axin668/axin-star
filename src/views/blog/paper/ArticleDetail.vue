<template>
  <div class="createPost-container">
    <el-form
      ref="postFormRef"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <sticky
        :z-index="10"
        :class-name="
          'sub-navbar ' + (postForm.publish === true ? 'published' : 'draft')
        "
      >
        <el-button
          :loading="loading"
          style="margin-left: 10px"
          type="success"
          @click="handleAddUpdateAndPublish"
        >
          发布文章
        </el-button>
        <el-button
          :loading="draftLoading"
          type="warning"
          @click="handleUpdateArticle(false)"
        >
          保存草稿
          <el-icon style="margin-left: 5px;"><CoffeeCup /></el-icon>
        </el-button>
        <el-button
          v-if="postForm.id !== undefined"
          :loading="loading"
          type="info"
          @click="handleCancelPublish"
        >
          取消发布
        </el-button>

        <div class="lark-editor-header-crumb-status">
          <div class="lark-editor-save-tip">
            <svg-icon icon-class="published" class-name="card-panel-icon" />
            &nbsp
          </div>
          <div id="syncTimeDiv" class="lark-editor-save-tip"></div>
          <div style="line-height: 50px; margin-left: 30px;">
            <el-button type="primary"> 浏览作者 </el-button>
          </div>
        </div>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item class="postInfo-title" prop="title" >
              <MDinput
                v-model="postForm.title"
                :maxlength="100"
                name="name"
                required
                @title-change="handleTitleChange"
                @title-blur="handleTitleBlur"
              >
                标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="10">
                  <el-form-item
                    label-width="45px"
                    label="分类:"
                    class="postInfo-container-item"
                  >
                    <el-select
                      v-model="postForm.categories"
                      style="width: 320px"
                      placeholder="请选择文章分类"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                    >
                      <el-option
                        v-for="item in categoryOptions"
                        :key="item"
                        :value="item"
                        :label="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item
                    label-width="80px"
                    label="标签:"
                    class="postInfo-container-item"
                  >
                    <el-select
                      v-model="postForm.tags"
                      style="width: 320px"
                      placeholder="请选择文章标签"
                      multiple
                      filterable
                      allow-create
                      default-first-option
                    >
                      <el-option
                        v-for="item in tagOptions"
                        :key="item"
                        :value="item"
                        :label="item"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <div class="editor-container">
          <div id="vditor" />
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { addUpdateAndPublish, cancelPublish, fetchArticleAsync, fetchInfo, updateArticle } from '@/api/blog/article';
import Sticky from '@/components/Sticky/index.vue' // 粘性header组件
import { TabsMenuProps } from '@/stores/interface';
import { useTabsStore } from '@/stores/modules/tabs';
import { formatTime } from '@/utils';
import { uploadImgObject } from '@/utils/oss';
import { ElForm, ElMessage, ElNotification } from 'element-plus'
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { computed, getCurrentInstance, reactive, ref } from 'vue'
import { RouteLocationNormalized } from 'vue-router';
import { useRoute } from 'vue-router';

defineOptions({
  name: 'Post',
  inheritAttrs: false
})

const emit = defineEmits(['el.form.change', 'el.form.blur']);

const currentInstance = getCurrentInstance();

interface PostForm {
  title: string
  publishedTitle?: string
  content: string
  categories: string[]
  tags: string[]
  id: number | undefined
  publish?: boolean | string
  createTime?: Date
  updateTime?: Date
  display_time?: string | number | Date
}

const postForm = reactive<PostForm>({
  title: '',
  content: '',
  categories: [],
  tags: [],
  id: undefined, // undefined 即可表示不存在
  publish: '',
  display_time: ''
})

const validateRequire = (rule: any, value: any, callback : any) => {
  if (value === '') {
    ElMessage({
      message: rule.field + '为必传项',
      type: 'error'
    })
    callback(new Error(rule.field + '为必传项'))
  } else {
    callback()
  }
}

const postFormRef = ref(ElForm)

const rules = reactive({
  title: [{ validator: validateRequire }],
  content: [{ validator: validateRequire }]
})

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  }
})

var timer = {
  sto: [] as number[],
  siv: [] as number[]
}

let toolbar = ref<any>()
if (window.innerWidth < 768) {
  toolbar.value = [
    'emoji',
    'headings',
    'bold',
    'italic',
    'strike',
    'link',
    '|',
    'list',
    'ordered-list',
    'check',
    'outdent',
    'indent',
    '|',
    'quote',
    'line',
    'code',
    'inline-code',
    'insert-before',
    'insert-after',
    '|',
    'upload',
    'record',
    'table',
    '|',
    'undo',
    'redo',
    '|',
    'edit-mode',
    'content-theme',
    'code-theme',
    'export',
    {
      name: 'more',
      toolbar: ['fullscreen', 'both', 'preview', 'info', 'help']
    }
  ]
}

// store
// const managerStore = useManagerStore()
const tagsStore = useTabsStore()

// data
const editPrepared = ref<number>(1); // 为2是可以执行赋值 为3时方可执行定时任务（1-> 获取文章内容->2->赋值到编辑器->3）
const contentEditor = ref<Vditor | undefined>(undefined)
const loading = ref(false)
const draftLoading = ref(false)
const categoryOptions = ref<string[]>([]);
const tagOptions = ref<string[]>([]);
const route = useRoute();
const tmpRoute = ref<RouteLocationNormalized>(route)

const displayTime = computed({
  get: () => {
    // 后端一般是返回字符串, 这里转为timestamp
    return +new Date(postForm.display_time!)
  },
  set: (val) => {
    postForm.display_time = new Date(val)
  }
})

// methods
// 草稿自动保存
const autoSaveArticle = () => {
  timer.siv.push(window.setInterval(() => {
    handleUpdateArticle()
  }, 30000))
}

// 异步请求某id文章的信息
const fetchData = (id : any) => {
  var response = fetchArticleAsync(id)
  const respData = JSON.parse(response.response).data
  Object.assign(postForm, respData)
  editPrepared.value += 1
  setTagsViewTitle()
  setPageTitle();
}

// 获取所有文章概览信息
const fetchInfos = () => {
  fetchInfo()
    .then((response) => {
      tagOptions.value = response.data.tag
      categoryOptions.value = response.data.category
    })
    .catch((error) => {
      console.log(error)
    })
}

// 设置tags标题
const setTagsViewTitle = () => {
  const title = '编辑文章'
  const route = Object.assign({}, tmpRoute.value, {
    title: `${title}-${postForm.title}`
  })
  const view : TabsMenuProps = {
    icon: route.meta.icon!,
    title: route.title,
    path: route.path,
    name: route.name?.toString()!,
    close: route.meta.hidden!,
    isKeepAlive: route.meta.isKeepAlive!
  }
  tagsStore.updateVisitedView(view)
}

// 设置网站标题
const setPageTitle = () => {
  const title = 'Edit Article'
  document.title = `${title} - ${postForm.id}`
}

// 处理文章更新与发布
const handleAddUpdateAndPublish = () => {
  postFormRef.value!.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage({
        message: "Error Submit!!!",
        type: 'error'
      })
      return
    }
    try {
      loading.value = true
      postForm.publish = true
      addUpdateAndPublish(postForm)
        .then((response) => {
          ElNotification({
            title: "发布文章成功",
            type: 'success',
            duration: 2000
          })
          postForm.id = response.data.id
          postForm.content = response.data.content
          var syncTimeElm = document.getElementById('syncTimeDiv')
          console.log(syncTimeElm)
          syncTimeElm!.innerHTML = 
            '<span style="cursor: pointer">' + 
            '<span>最后更改于<span id="syncTime">' + 
            formatTime(new Date()) + 
            '</span>' +
            '</span>' +
            '</span>'
          loading.value = false
        })
        .catch((error) => {
          console.log(error)
          postForm.publish = false
          loading.value = false
        })
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false;
    }
  })
}

// 处理文章更新(草稿保存 or 文章更新)
const handleUpdateArticle = (auto?: any) => {
  // 更新同步标签
  // debugger
  if (props.isEdit && editPrepared.value !== 3) {
    return
  }
  postForm.content = contentEditor.value!.getValue();
  if (postForm.content.length === 0 || postForm.title.length === 0) {
    if (auto === false) {
      ElMessage({
        message: '请填写必要的标题和内容',
        type: 'warning'
      })
    }
  }
  draftLoading.value = true
  var form = Object.assign({}, postForm, {})
  form.publish = undefined
  updateArticle(form)
    .then((response) => {
      if (auto === false) {
        ElNotification({
          title: '保存草稿成功',
          type: 'success',
          duration: 1000
        })
      }
      postForm.id = response.data.id
      var syncTimeElm = document.getElementById('syncTimeDiv')
      syncTimeElm!.innerHTML = 
        '<span style="cursor: pointer">' + 
        '<span>最后更改于<span id="syncTime">' + 
        formatTime(new Date()) + 
        '</span>' + 
        '</span>' +
        '</span>'
      draftLoading.value = false
    })
    .catch((err) => {
      console.log(err)
      draftLoading.value = false
    })
}

// 处理文章取消发布
const handleCancelPublish = () => {
  cancelPublish(postForm.id!)
    .then(() => {
      ElMessage({
        message: '取消发布',
        type: 'success'
      })
      postForm.publish = false
    })
}

// 处理文件上传
const handleImageUpload = async (file: any, callback: any): Promise<string> => {
  let res = await uploadImgObject(file,(url: string)=>{
    callback(url)
  }, postForm.title)
  console.log("callback host: ", res);
  return res;
}

// 输入框title输入同步
const handleTitleChange = (value: any) => {
  postForm.title = value.join('')
}

// 输入框失去焦点, title同步
const handleTitleBlur = (value: any) => {
  postForm.title = value.join('')
}

// 生命周期
onMounted(() => {
  window.vue = currentInstance
  contentEditor.value = new Vditor('vditor', {
    // cdn: 'http://localhost:9000',
    toolbar: toolbar.value,
    lang: 'zh_CN',
    mode: 'ir', // wysiwyg
    height: window.innerHeight + 100,
    outline: {
      enable: true,
      position: 'left'
    },
    debugger: false,  // 是否显示日志
    typewriterMode: true,
    placeholder: '开始记录你的生活吧!',
    preview: {
      hljs: {
        "enable": true,  // 开启高亮
        "lineNumber": true,  // 代码行号
      },
      markdown: {
        toc: true,
        mark: true,
        footnotes: true,
        autoSpace: true
      },
      math: {
        engine: 'KaTeX'
      }
    },
    toolbarConfig: {
      pin: true
    },
    counter: {
      enable: true,
      type: 'text'
    },
    hint: {
      emojiPath:
        'https://cdn.jsdelivr.net/npm/vditor@1.8.3/dist/images/emoji',
      emojiTail:
        '<a href="https://ld246.com/settings/function" target="_blank">设置常用表情</a>',
      emoji: {
        sd: '💔',
        j: 'https://unpkg.com/vditor@1.3.1/dist/images/emoji/j.png'
      },
      parse: false,
      extend: [
        {
          key: '@',
          hint: (key) => {
            console.log(key)
              if ('vanessa'.indexOf(key.toLocaleLowerCase()) > -1) {
              return [
                {
                  value: '@Vanessa',
                  html: '<img src="https://avatars0.githubusercontent.com/u/970828?s=60&v=4"/> Vanessa'
                }
              ]
            }
            return []
          }
        },
        {
          key: '#',
          hint: (key) => {
            console.log(key)
            if ('vditor'.indexOf(key.toLocaleLowerCase()) > -1) {
              return [
                {
                  value: '#Vditor',
                  html: '<span style="color: #999;">#Vditor</span> ♏ 一款浏览器端的 Markdown 编辑器，支持所见即所得（富文本）、即时渲染（类似 Typora）和分屏预览模式。'
                }
              ]
            }
            return []
          }
        }
      ]
    },
    tab: '\t',

    upload: {
      accept: 'image/*,.mp3, .wav, .rar',
      multiple: false,
      filename(name) {
        return name
          .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '')
          .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '')
          .replace('/\\s/g', '')
      },
      token: 'test',
      url: '/blog-api/upload/editor',
      linkToImgUrl: '/blog-api/upload/fetch',
      handler(files) {
          // 回调将图片url嵌入编辑器
          function callback(path: any) {
            let name = files[0] && files[0].name;
            let succFileText = "";
            succFileText += `\n <img alt=${name} src="${path}">`;
            document.execCommand('insertHTML', false, succFileText);
          }
          // 返回文章名称(随便定义的)
          let ossStaticHost = ''
          handleImageUpload(files, callback).then(res => {
            ossStaticHost = res
          })
          this.url = ossStaticHost
          return ossStaticHost
      },
    },
    after: () => {
      if (props.isEdit) {
        contentEditor.value!.disabled()
        // while (this.editPrepared != 2) {
        //   debugger
        // }
        editPrepared.value += 1
        contentEditor.value!.setValue(postForm.content)
        contentEditor.value!.enable()
        // 绑定标题到编辑器
        // contentEditor.value!.setTitle(postForm.title)
      } else {
        // 新文章预先设定值
        // this.contentEditor.setValue('# hello world! ')
      }
      // this.contentEditor.setTheme('dark', 'dark',  'native');
      // document.querySelector('body').style.backgroundColor='#2f363d';
    },
    // changeTileFun: function () {
    //   console.log('覆盖了~')
    //   window.vue!.postForm.title = window.vditor.vditor.contentData.title
    //   console.log(window.vditor.vditor.contentData.title)
    // }
  })
  // window.vditor = contentEditor.value
})

onUnmounted(() => {
  // 清除定时保存文章任务
  timer.siv.forEach(function (siv) {
    clearInterval(siv);
  })
})

// created
if (props.isEdit) {
  const id = tmpRoute.value.params && tmpRoute.value.params.id
  fetchData(id);
}
fetchInfos()
autoSaveArticle()
tmpRoute.value = Object.assign({}, useRoute())
</script>

<style lang="scss">
@import '@/styles/mixin.scss';

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px auto;

    .postInfo-title {
      position: relative;
      margin-bottom: 0px; // 覆盖一下默认属性
      padding: 0px 20px 0px 10px;
    }

    .postInfo-container {
      position: relative;
      padding: 10px 20px 0px 10px;
      @include clearfix;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}

.vditor-title .ne-editor-extra-box {
  max-width: 830px;
  padding: 0 40px;
  margin: 0 auto;
  position: relative;
}

.vditor-title .lake-title-editor {
  font-family:
    Chinese Quote,
    Segoe UI,
    Roboto,
    PingFang SC,
    Hiragino Sans GB,
    Microsoft YaHei,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif,
    Apple Color Emoji;
  position: relative;
  padding-bottom: 4px;
}

.vditor-title .lake-title-editor .ant-input,
.vditor-title .lake-title-editor .ant-input:focus {
  border: none !important;
  outline: none;
  box-shadow: none;
  padding: 0;
}

.vditor-title textarea.ant-input {
  max-width: 100%;
  min-height: 32px;
  line-height: 1.389;
  vertical-align: bottom;
  transition:
    all 0.3s,
    height 0s;
}

.vditor-title .ant-input {
  margin: 0;
  font-variant: tabular-nums;
  list-style: none;
  font-feature-settings: 'tnum';
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 0;
  background-image: none;
  border-radius: 4px;
}

.vditor-title .lake-title {
  color: #262626;
  font-weight: 700 !important;
  font-size: 36px !important;
}

.vditor-title textarea {
  font-family: inherit;
  overflow: auto;
  overflow-x: auto;
  overflow-y: auto;
  font-size: 36px !important;
}

// textarea placeholder color
.vditor-title textarea::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #e6e6e6;
}

.vditor-title textarea:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #e6e6e6;
}

.vditor-title textarea::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #e6e6e6;
}

.vditor-title textarea::-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #e6e6e6;
}
.vditor {
  border: none;
  border-top: 1px;
}

// 更新时间同步
.lark-editor-save-tip {
  font-size: 18px;
  color: #555e87;
  -webkit-box-align: center;
  height: 40px;
  line-height: 50px;
}

.lark-editor-header-crumb-status {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  height: 100%;
  line-height: 50px;
  float: left;
  margin-right: 10px;
}
</style>

