<script setup>
import { onMounted, unref } from 'vue'
import { initViewer, run } from '@/core'
import { useStorage } from '@vueuse/core'

// Viewer options
const options = {
  id: 'preview-content',
  zoomPerScroll: 1.01,
  zoomPerClick: 1.01,
  zoomPerSecond: 3.05,
  tileSources: {
    Image: {
      xmlns: "http://schemas.microsoft.com/deepzoom/2009",
      Url: "https://artlibraryspimg.oss-cn-beijing.aliyuncs.com/1%2fAntibes+Seen+from+La+Salis-70KAHG7PA0_files%2f",
      Overlap: "1",
      TileSize: "512",
      Format: "jpg",
      Size: {
        Height: "34935",
        Width: "44409"
      }
    }
  }
}

const lists = useStorage('lists')

onMounted(() => {
  initViewer(options)
  run(JSON.parse(unref(lists)))
})
</script>

<template>
  <div class="preview-container">
    <div id="preview-content"></div>
  </div>
</template>

<style>
.preview-container {
  height: 100vh;
  width: 100%;
  background: #000000;
}

#preview-content {
  width: 100%;
  height: 100%;
}
</style>