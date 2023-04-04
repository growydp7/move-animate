<script setup>
import { onMounted, ref, unref } from 'vue'
import { useStorage } from '@vueuse/core'
import { directions } from '@/core/utils'

const lists = useStorage('lists')
const tableData = ref([])
const initData = () => {
  if (lists.value == 'undefined') return
  tableData.value = JSON.parse(unref(lists)).map(item => ({
    ...item,
    configText: (item.isConfig == 0) ? '是' : '否',
    directionText: item.direction && directions.filter(dir => dir.value == item.direction)[0].label
  }))
}

const handleClick = () => {

}

onMounted(() => {
  initData()
})
</script>

<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="event" align="center" label="动画类型" />
    <el-table-column prop="configText" align="center" label="是否使用模板" />
    <el-table-column prop="directionText" align="center" label="移动方向" />
    <el-table-column label="动画延时">
      <template #default="scope">
        <div>{{ scope.row?.delay }}{{ scope.row?.delayUnit }}</div>
      </template>
    </el-table-column>
    <el-table-column label="动画耗时">
      <template #default="scope">
        <div>{{ scope.row?.timeout }}{{ scope.row?.timeoutUnit }}</div>
      </template>
    </el-table-column>
    <!-- <el-table-column fixed="right" label="操作" width="120">
      <template #default>
        <el-button link type="primary" size="small" @click="handleClick"
          >Detail</el-button
        >
        <el-button link type="primary" size="small">Edit</el-button>
      </template>
    </el-table-column> -->
  </el-table>
</template>