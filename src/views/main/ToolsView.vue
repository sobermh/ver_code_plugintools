<template>
  <div class="tools mx-10 my-5">
    <div class="mb-10" v-for="label in labels" :key="label">
      <div class="mb-4">{{ labels_map[label] ?? label }}</div>
      <v-row>
        <v-col
          v-for="tool in filterTools(label)"
          :key="tool.uuid"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
        >
          <v-card variant="elevated" elevation="24" hover @click="selectFile(tool)">
            <div class="d-flex flex-no-wrap align-center">
              <v-avatar rounded="0" size="80">
                <v-img
                  :src="
                    tool.thumbnail
                      ? `https://ai.hezi.com:16520${tool.thumbnail.replace('image', 'thumbnail')}`
                      : defaultImage
                  "
                ></v-img>
              </v-avatar>
              <div class="tool-info">
                <v-card-title class="tool-info-title"> {{ tool.name }} </v-card-title>
                <v-card-subtitle class="tool-info-desc">{{ tool.desc }}</v-card-subtitle>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>

  <v-dialog v-model="dialog_selectfile" width="800" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">选择转换文件</div>

        <v-btn icon="mdi-close" variant="text" @click="dialog_selectfile = false"></v-btn>
      </v-card-title>

      <v-divider class="mb-10"></v-divider>

      <v-file-input
        v-model="files"
        label="选择文件"
        multiple
        show-size
        class="ml-2 mr-4"
        :accept="selectFileType"
        counter
      >
        <template v-slot:selection="{ fileNames }">
          <template v-for="fileName in fileNames" :key="fileName">
            <v-chip class="me-2" color="deep-purple-accent-1" size="medium" label>
              {{ fileName }}
            </v-chip>
          </template>
        </template>
      </v-file-input>
      <!-- <v-file-upload v-model="files" clearable multiple show-size counter>
        <template v-slot:item="{ props: itemProps }">
          <v-file-upload-item v-bind="itemProps" lines="one" nav>
            <template v-slot:prepend>
              <v-avatar size="32" rounded></v-avatar>
            </template>

            <template v-slot:clear="{ props: clearProps }">
              <v-btn color="primary" v-bind="clearProps"></v-btn>
            </template>
          </v-file-upload-item>
        </template>
      </v-file-upload> -->

      <v-card-subtitle class="d-flex justify-center"
        >放置文件在这里.请控制文件大小.
      </v-card-subtitle>

      <v-card-actions class="my-2 d-flex justify-center">
        <v-btn
          prepend-icon="$loading"
          color="primary"
          rounded="lg"
          variant="flat"
          size="x-large"
          elevation="24"
          @click="uploadATransFiles()"
        >
          <template v-slot:default>转换</template>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="dialog_transfile" width="800" persistent>
    <v-card rounded="lg">
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-h5 text-medium-emphasis ps-2">文件转换结果</div>

        <v-btn icon="mdi-close" variant="text" @click="dialog_transfile = false"></v-btn>
      </v-card-title>

      <v-divider class="mb-2"></v-divider>

      <v-list lines="two">
        <div class="d-flex flex-row-reverse mx-4 mb-3">
          <v-btn
            color="primary"
            prepend-icon="mdi-arrow-down"
            variant="flat"
            size="small"
            @click="downloadAllFiles()"
          >
            <template v-slot:default>下载全部成功文件 (zip)</template>
          </v-btn>
        </div>
        <v-list-item v-for="(file, index) in files" :key="index" :title="file.name">
          <template v-slot:prepend>
            <v-avatar color="grey-lighten-1">
              <v-icon color="white">mdi-folder</v-icon>
            </v-avatar>
          </template>

          <template v-slot:append>
            <v-tooltip :text="file.message" location="top" v-if="file.status === 'failure'">
              <template v-slot:activator="{ props }">
                <v-btn
                  color="grey-lighten-1"
                  icon="mdi-information"
                  variant="text"
                  v-bind="props"
                ></v-btn>
              </template>
            </v-tooltip>
            <v-btn
              :loading="file.status === 'success' ? false : true"
              color="primary"
              prepend-icon="mdi-arrow-down"
              variant="flat"
              size="small"
              v-else
              @click="downloadFile(file)"
            >
              <template v-slot:default>下载</template>
            </v-btn>
          </template>
        </v-list-item>
      </v-list>

      <v-card-actions class="my-2 d-flex justify-end">
        <v-btn
          class="text-none"
          color="grey-lighten-3"
          rounded="xl"
          variant="flat"
          @click="dialog_transfile = false"
        >
          <template v-slot:default>退出</template>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

import defaultImage from '@/assets/default.png'
import * as apitools from '@/service/modules/tools'

interface FileExtend extends File {
  remote_path?: string
  status?: string
  message?: string
  remote_tar_path?: string
}

interface Tool {
  uuid: string
  name: string
  desc: string
  thumbnail?: string
  publish: boolean
  label: string
  api: (...args: any[]) => Promise<any>
}

const tools = ref<Tool[]>([])
const cur_tool = ref<Tool>()
const labels = ref<string[]>([''])
const labels_map: { [key: string]: string } = {
  other: '其他工具',
  image: '图片处理',
  audio: '音频转换',
  video: '视频转换',
}
const dialog_selectfile = ref<boolean>(false)
const selectFileType = ref<string>('*')
const selectFileType_map: { [key: string]: string } = {
  image: 'image/*',
  audio: 'audio/*',
  video: 'video/*',
}
const dialog_transfile = ref<boolean>(false)
const files = ref<FileExtend[]>([])

const getApiByLabel = (label: string, name: string) => {
  const map: any = {
    image转换: apitools.apiTransi2i,
    image移除: apitools.apiRemoveBgi,
    video转换: apitools.apiTransv2v,
    audio转换: apitools.apiTransa2a,
  }
  for (const key in map) {
    if ((label + name).includes(key)) {
      return map[key]
    }
  }
  return null
}
const getTools = async (): Promise<void> => {
  const res = await apitools.apiGetTools()
  if (res.code === 200) {
    tools.value = res.data
      .filter((tool: Tool) => tool.publish === true)
      .map((tool: Tool) => {
        tool.api = getApiByLabel(tool.label, tool.name)
        return tool
      })
    labels.value = Array.from(new Set(tools.value.map((item: any) => item.label)))
  } else {
    console.log('获取工具列表失败')
  }
}

const selectFile = (tool: Tool): void => {
  files.value = []
  dialog_selectfile.value = true
  selectFileType.value = selectFileType_map[tool.label] || '*'
  cur_tool.value = tool
}

const uploadATransFiles = async () => {
  dialog_transfile.value = files.value.length > 0 ? true : false
  if (dialog_transfile.value) {
    for (let i = 0; i < files.value.length; i++) {
      const file = files.value[i]
      const reader = new FileReader()
      reader.onload = async (event) => {
        const base64Content = (event?.target?.result as string).split(',')[1]
        const res = await apitools.apiUploadBinary(base64Content, file.name)
        if (res.code === 200) {
          file.remote_path = 'cache/file_upload/Sharing_Storage/mobile' + '/' + res.data
          file.status = 'pending'
          transFiles(file)
        } else {
          file.status = 'failure'
          file.message = res.message || '上传失败'
        }
      }
      reader.readAsDataURL(file)
    }
  }
}

const transFiles = async (file: FileExtend) => {
  const res = await cur_tool.value?.api(
    file.remote_path,
    '.' + cur_tool.value.name.match(/[a-z0-9]+/gi)?.join(''),
  )
  if (res.code === 200) {
    file.status = 'success'
    file.remote_tar_path = res.data
    files.value = [...files.value]
  } else {
    file.status = 'failure'
    file.message = res.message || '转换失败'
    files.value = [...files.value]
  }
}

const downloadFile = async (file: FileExtend) => {
  const remote_tar_name =
    file.remote_tar_path?.split('/')[file.remote_tar_path?.split('/').length - 1]
  console.log(remote_tar_name, file.name)
  const res = await apitools.apiDownloadBinary(remote_tar_name || '')
  if (res.code === 200) {
    const binaryString = window.atob(res.data)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const url = URL.createObjectURL(new Blob([bytes.buffer]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      file.name.replace(/\.[^\.]+$/, '.' + cur_tool.value?.name.match(/[a-z0-9]+/gi)?.join('')),
    )
    document.body.appendChild(link)
    link.click()
  } else {
    console.log('下载失败')
  }
}

const downloadAllFiles = async () => {
  const zip = new JSZip()
  const successfulFiles = files.value.filter((file) => file.status === 'success')

  const filePromises = successfulFiles.map(async (file) => {
    const remote_tar_name =
      file.remote_tar_path?.split('/')[file.remote_tar_path?.split('/').length - 1]
    console.log(remote_tar_name, file.name)
    const res = await apitools.apiDownloadBinary(remote_tar_name || '')
    if (res.code === 200) {
      const binaryString = window.atob(res.data)
      const len = binaryString.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      zip.file(
        file.name.replace(/\.[^\.]+$/, '.' + cur_tool.value?.name.match(/[a-z0-9]+/gi)?.join('')),
        bytes.buffer,
      )
    } else {
      console.log('下载失败')
    }
  })

  await Promise.all(filePromises)

  zip.generateAsync({ type: 'blob' }).then(function (content) {
    saveAs(content, 'tools.zip')
  })
}

const filterTools = (label: string): Tool[] => {
  return tools.value.filter((tool: any) => tool.label === label)
}

onMounted(getTools)
</script>

<style scoped lang="scss">
.tools {
  font-size: $text-size-title;
  .tool-info {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .tool-info-title {
      font-size: $text-size-card-title;
    }
    .tool-info-desc {
      font-size: $text-size-card-text;
    }
  }
}
</style>
