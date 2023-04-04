<script setup>
import { ref, computed, unref, reactive, nextTick, watch } from 'vue'
import Table from '@/components/table.vue'
import { eventNames, timeUnits, zoomTypes, directions } from '@/core/utils'
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { initViewer, mouseWatcher } from '@/core'

const lists = useStorage('lists')

const tips = [
  { label: '使用模板', value: 0 },
  { label: '自定义配置', value: 1 }
]

const animateTips = [
  { label: '不使用', value: true },
  { label: '使用', value: false}
]

const isEdit = ref(false)
const visible = ref(false) 
const formRef = ref()
const dialogName = computed(() => unref(isEdit) ? '编辑动画步骤' : '新增动画步骤')
const form = reactive({
  event: '',
  delay: '',
  delayUnit: '',
  timeout: '',
  timeoutUnit: '',
  type: '',
  value: '',
  isConfig: 0,
  animate: false,
  point: null,
  pointText: '',
  direction: '',
  x: '',
  y: ''
})

const rules = reactive({
  event: [
    { required: true, message: '请选择动画类型', trigger: 'blur' }
  ],
  isConfig: [
    { required: true, message: '请选择是否使用模板', trigger: 'blur' }
  ],
  timeout: [
    { required: true, message: '请输入动画耗时', trigger: 'blur' }
  ],
  timeoutUnit: [
    { required: true, message: '请选择动画耗时单位', trigger: 'blur' }
  ],
  delay: [
    { required: true, message: '请输入动画延时', trigger: 'blur' }
  ],
  delayUnit: [
    { required: true, message: '请选择动画延时单位', trigger: 'blur' }
  ],
  animate: [
    { required: true, message: '请选择是否使用动画', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择缩放类型', trigger: 'blur' }
  ],
  value: [
    { required: true, message: '请输入缩放数值', trigger: 'blur' }
  ],
  pointText: [
    { required: true, message: '请选择中心点', trigger: 'blur'}
  ],
  direction: [
    { required: true, message: '请选择移动方向', trigger: 'blur'}
  ],
  x: [
    { required: true, message: '请输入x位移数值', trigger: 'blur'}
  ],
  y: [
    { required: true, message: '请输入y位移数值', trigger: 'blur'}
  ]
})

const handleSave = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const {
        event,
        delay,
        delayUnit,
        timeout,
        timeoutUnit,
        type,
        value,
        isConfig,
        animate,
        direction,
        x,
        y
      } = unref(form)
      const obj = {
        event,
        isConfig
      }
      if (obj.isConfig !== 0) {
        obj['timeout'] = timeout
        obj['timeoutUnit'] = timeoutUnit
        obj['delay'] = delay
        obj['delayUnit'] = delayUnit
        obj['animate'] = animate
        if (event === 'zoom') {
          obj['value'] = value
        } else {
          obj['x'] = x
          obj['y'] = y
        }
      } else {
        if (event === 'move') {
          obj['direction'] = direction
        } else if (event === 'zoom') {
          obj['type'] = type
        }
      }
      console.log(obj)
      if (!lists.value || lists.value == 'undefined') {
        lists.value = JSON.stringify([obj])
      } else {
        lists.value = JSON.stringify([...JSON.parse(unref(lists)), obj])
      }

      visible.value = false
    }
  })
}


const handleDialog = () => {
  visible.value = true
  nextTick(() => {
    formRef.value.resetFields()
  })
}

const router = useRouter()
const handlePreview = () => {
  router.push('/preview')
}
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
const innerVisible = ref(false)
const handleChoise = () => {
  innerVisible.value = true
  nextTick(() => {
    initChoise()
  })
}

const initChoise = () => {
  initViewer(options)
  mouseWatcher(point => {
    form.point = {
      x: point.x,
      y: point.y
    }
    form.pointText = `x: ${point.x},y: ${point.y}`
    innerVisible.value = false
  })
}


</script>

<template>
  <div>
    <div class="filter-container">
      <el-button @click="handleDialog">新增</el-button>
      <el-button type="primary" @click="handlePreview">预览</el-button>
    </div>
    <Table />

    <el-dialog
      v-model="visible"
      :title="dialogName"
    >
      <template #default>
        <el-form
          ref="formRef"
          :model="form"
          label-width="120px"
          size="large"
          :rules="rules"
        >
          <el-form-item label="动画类型" prop="event">
            <el-select v-model="form.event" placeholder="请选择动画类型">
              <el-option
                v-for="item in eventNames"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否配置" prop="isConfig">
            <el-select v-model="form.isConfig" placeholder="请选择是否使用默认模板">
              <el-option
                v-for="item in tips"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <template v-if="form.isConfig === 0">
            <el-form-item v-if="form.event === 'move'" label="位移方向" prop="direction">
              <el-select v-model="form.direction" placeholder="请选择位移方向">
                <el-option
                  v-for="item in directions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-else-if="form.event === 'zoom'" label="缩放类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择缩放类型">
                <el-option
                  v-for="item in zoomTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="动画耗时" prop="timeout">
              <el-input
                v-model="form.timeout"
                placeholder="请输入动画耗时"
              >
                <template #append>
                  <el-form-item prop="timeoutUnit">
                    <el-select v-model="form.timeoutUnit" placeholder="选择动画耗时单位" style="width: 170px">
                      <el-option
                        v-for="item in timeUnits"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </template>
              </el-input>
            </el-form-item>
            <template v-if="form.event !== 'wait'">
              <el-form-item label="动画延时" prop="delay">
                <el-input
                  v-model="form.delay"
                  placeholder="请输入动画延时"
                >
                  <template #append>
                    <el-form-item prop="delayUnit">
                      <el-select v-model="form.delayUnit" placeholder="选择动画延时单位" style="width: 170px">
                        <el-option
                          v-for="item in timeUnits"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="使用动画" prop="animate">
                <el-select v-model="form.animate" placeholder="请选择是否使用动画">
                  <el-option
                    v-for="item in animateTips"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <template v-if="form.event === 'zoom'">
                <el-form-item label="缩放数值" prop="value">
                  <el-input v-model="form.value" placeholder="请输入缩放数值" />
                </el-form-item>
              </template>
              <template v-else>
                <!-- <el-form-item label="选择中心点" prop="pointText"  @click="handleChoise">
                  <el-input v-model="form.pointText" disabled placeholder="请选择中心点" />
                </el-form-item> -->
                <el-form-item label="x" prop="x">
                  <el-input v-model="form.x" placeholder="请输入x位移数值" />
                </el-form-item>
                <el-form-item label="y" prop="y">
                  <el-input v-model="form.y" placeholder="请输入x位移数值" />
                </el-form-item>
              </template>
            </template>
          </template>
        </el-form>
        <el-dialog
          v-model="innerVisible"
          class="custom"
          fullscreen
          append-to-body
        >
          <div id="preview-content"></div>
        </el-dialog>
      </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="handleSave(formRef)">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style>
.custom {
  background: #000000;
}
.custom .el-dialog__body {
  height: 90vh;
}

.custom .el-dialog__headerbtn .el-dialog__close {
  color: #FFFFFF;
}

</style>