<script setup>
import { ref, computed, useSlots, onBeforeUpdate, Comment } from 'vue'

const $props = defineProps({
  name: { type: String, default: () => String(Math.random()).replace('0.', '') },
  primaryKey: { type: String, required: true },
  modelValue: { type: Array, required: true },
  handlerPosition: {
    type: String,
    default: 'center',
    validate: handlerPosition => !handlerPosition || ['top', 'center', 'bottom'].includes(handlerPosition)
  }
})

const $emit = defineEmits(['update:modelValue'])

const DATA_TYPE = 'text/llesca-stack-draggable-key/'

const $slots = useSlots()

const refElements = ref([])

const hasHeaderSlots = computed(() => {
  return $slots.header && $slots.header().findIndex(o => o.type !== Comment) !== -1
})

const hasFooterSlots = computed(() => {
  return $slots.footer && $slots.footer().findIndex(o => o.type !== Comment) !== -1
})

function moveItem (items, source, target) {
  if (source === target) {
    return items
  } else if (source > target) {
    return [
      ...items.slice(0, target),
      items[source],
      ...items.slice(target, source),
      ...items.slice(source + 1)
    ]
  } else {
    return [
      ...items.slice(0, source),
      ...items.slice(source + 1, target + 1),
      items[source],
      ...items.slice(target + 1)
    ]
  }
}

function handleDragStart (event, key) {
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.droptAllowed = 'move'
  event.dataTransfer.setData(DATA_TYPE + $props.name, key)
}

function handleDragOver (event) {
  if (event.dataTransfer.types.includes(DATA_TYPE + $props.name)) {
    event.preventDefault()
  }
}

function handleDrop (event) {
  const identifier = event.dataTransfer.getData(DATA_TYPE + $props.name)
  const sourceIndex = $props.modelValue.findIndex(item => item[$props.primaryKey] === identifier)
  const targetIndex = refElements.value
    .filter(ref => ref.el)
    .reduce((accumaletd, value) => (
      value.el.getBoundingClientRect().bottom > event.pageY && value.index < accumaletd
        ? value.index
        : accumaletd
    ), refElements.value.length)
  $emit('update:modelValue', moveItem($props.modelValue, sourceIndex, targetIndex))
}

onBeforeUpdate(() => { refElements.value = [] })
</script>

<template>
  <div
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <div
      v-if="hasHeaderSlots"
      class="stackDraggable-item"
    >
      <fura-icon class="stackDraggable-dragIcon" />
      <div class="stackDraggable-content">
        <slot name="header" />
      </div>
    </div>
    <div
      v-for="(item, index) in modelValue"
      :key="item[primaryKey]"
      :ref="el => refElements.push({ item, index, el })"
      draggable="true"
      class="stackDraggable-item"
      @dragstart.stop="$event => handleDragStart($event, item[primaryKey])"
    >
      <div class="stackDraggable-handler">
        <div
          class="stackDraggable-cover"
          :class="{ 'stackDraggable-hide': handlerPosition === 'top' }"
          draggable="true"
          @dragstart.stop.prevent
        />
        <fura-icon
          class="stackDraggable-dragIcon"
          name="GripperDotsVertical"
        />
        <div
          class="stackDraggable-cover"
          :class="{ 'stackDraggable-hide': handlerPosition === 'bottom' }"
          draggable="true"
          @dragstart.stop.prevent
        />
      </div>
      <div
        class="stackDraggable-content"
        draggable="true"
        @dragstart.stop.prevent
      >
        <slot
          :item="item"
          :key="index[primaryKey]"
          :index="index"
        />
      </div>
    </div>
    <div
      v-if="hasFooterSlots"
      class="stackDraggable-item"
    >
      <fura-icon class="stackDraggable-dragIcon" />
      <div class="stackDraggable-content">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped src="./stack-draggable.less"></style>
