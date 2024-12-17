<template>
  <div class="notfound">
    <v-empty-state
      headline="Whoops, 404"
      title="Page not found"
      text="The page you were looking for does not exist"
      icon="mdi-magnify"
      action-text="返回首页"
      @click:action="goToTools()"
    ></v-empty-state>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToTools = () => {
  router.push({ name: 'tools' })
}
</script>

<style scoped lang="scss">
.notfound {
  color: orange;
}
</style>
