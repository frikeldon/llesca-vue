<script>
const DATA_TYPE = 'text/llesca-key'

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

export default {
  name: 'LlescaStackDraggable',
  props: {
    name: { type: String, default: () => String(Math.random()) },
    primaryKey: { type: String, required: true },
    modelValue: { type: Array, required: true },
    handlerPosition: {
      type: String,
      default: 'center',
      validate: handlerPosition => !handlerPosition || ['top', 'center', 'bottom'].includes(handlerPosition)
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      refElements: []
    }
  },
  computed: {
    hasHeaderSlots () {
      return this.$slots.header && this.$slots.header().findIndex(o => o.type !== Comment) !== -1
    },
    hasFooterSlots () {
      return this.$slots.footer && this.$slots.footer().findIndex(o => o.type !== Comment) !== -1
    }
  },
  methods: {
    handleDragStart (event, key) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.droptAllowed = 'move'
      event.dataTransfer.setData(DATA_TYPE + this.name, key)
    },
    handleDragOver (event) {
      if (event.dataTransfer.types.includes(DATA_TYPE + this.name)) {
        event.preventDefault()
      }
    },
    handleDrop (event) {
      const identifier = event.dataTransfer.getData(DATA_TYPE + this.name)
      const sourceIndex = this.modelValue.findIndex(item => item[this.primaryKey] === identifier)
      const targetIndex = this.refElements
        .filter(ref => ref.el)
        .reduce((accumaletd, value) => (
          value.el.getBoundingClientRect().bottom > event.pageY && value.index < accumaletd
            ? value.index
            : accumaletd
        ), this.refElements.length)
      this.$emit('update:modelValue', moveItem(this.modelValue, sourceIndex, targetIndex))
    }
  },
  beforeUpdate () {
    this.refElements = []
  }
}
</script>

<template>
  <div
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <div
      v-if="hasHeaderSlots"
      class="llesca-item"
    >
      <fura-icon class="llesca-dragIcon" />
      <div class="llesca-content">
        <slot name="header" />
      </div>
    </div>
    <div
      v-for="(item, index) in modelValue"
      :key="item[primaryKey]"
      :ref="el => refElements.push({ item, index, el })"
      draggable="true"
      class="llesca-item"
      @dragstart.stop="$event => handleDragStart($event, item.key)"
    >
      <div class="llesca-handler">
        <div
          class="llesca-cover"
          :class="{ 'llesca-hide': handlerPosition === 'top' }"
          draggable="true"
          @dragstart.stop.prevent
        />
        <fura-icon
          class="llesca-dragIcon"
          name="GripperDotsVertical"
        />
        <div
          class="llesca-cover"
          :class="{ 'llesca-hide': handlerPosition === 'bottom' }"
          draggable="true"
          @dragstart.stop.prevent
        />
      </div>
      <div
        class="llesca-content"
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
      class="llesca-item"
    >
      <fura-icon class="llesca-dragIcon" />
      <div class="llesca-content">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped src="./stack-draggable.less"></style>
