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
          <v-card variant="elevated" elevation="24" hover @click="dialog_selectfile = true">
            <div class="d-flex flex-no-wrap align-center">
              <v-avatar rounded="0" size="90">
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

      <v-file-input v-model="files" label="选择文件" multiple show-size class="ml-2 mr-4" counter>
        <template v-slot:selection="{ fileNames }">
          <template v-for="fileName in fileNames" :key="fileName">
            <v-chip class="me-2" color="primary" size="small" label>
              {{ fileName }}
            </v-chip>
          </template>
        </template>
      </v-file-input>
      <v-card-subtitle class="d-flex justify-center"
        >放置文件在这里.请控制文件大小.
      </v-card-subtitle>

      <v-card-actions class="my-2 d-flex justify-center">
        <v-btn
          prepend-icon="$loading"
          color="primary"
          rounded="xl"
          variant="flat"
          size="x-large"
          @click="dialog_transfile = files.length > 0 ? true : false"
        >
          <template v-slot:default> 转换为png格式</template>
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

      <v-divider class="mb-10"></v-divider>

      <v-list lines="two">
        <v-list-subheader inset color="primary">成功</v-list-subheader>

        <v-list-item v-for="file in files" :key="file" :title="file">
          <template v-slot:prepend>
            <v-avatar color="grey-lighten-1">
              <v-icon color="white">mdi-folder</v-icon>
            </v-avatar>
          </template>

          <template v-slot:append>
            <v-btn color="primary" prepend-icon="mdi-arrow-down" variant="flat" size="small">
              <template v-slot:default>下载</template>
            </v-btn>
          </template>
        </v-list-item>

        <v-divider inset></v-divider>

        <v-list-subheader inset color="error">失败</v-list-subheader>

        <v-list-item v-for="file in files" :key="file" :title="file">
          <template v-slot:prepend>
            <v-avatar color="red">
              <v-icon color="white">mdi-calendar</v-icon>
            </v-avatar>
          </template>

          <template v-slot:append>
            <v-btn color="grey-lighten-1" icon="mdi-information" variant="text"></v-btn>
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
import defaultImage from '@/assets/default.png'

import mhRequest from '@/service'
const tools: any = ref([])
const labels: any = ref([])
const labels_map: any = {
  other: '其他工具',
  image: '图片处理',
  audio: '音频转换',
  video: '视频转换',
}

const dialog_selectfile = ref(false)
const dialog_transfile = ref(false)
const files = ref([])

const getTools = () => {
  mhRequest
    .post({
      url: '/execute',
      headers: { 'api-key': 'a9e9b0a308402178786cd2146788103a493c7118b595015e56ed482bceea0ca4' },
      data: {
        name: 'info_data',
        func: 'post_guess_all',
        args: {
          db: 'msg_relation',
          guess: {},
          origin: true,
        },
      },
    })
    .then((response) => {
      console.log(response.data)
      tools.value = response.data.filter((item: any) => item.publish === true)
      labels.value = Array.from(new Set(tools.value.map((item: any) => item.label)))
    })
    .catch((error) => {
      console.error(error)
    })
}

const filterTools = (label: string) => {
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
