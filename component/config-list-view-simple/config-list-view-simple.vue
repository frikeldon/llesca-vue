<script>
import FuraDropdown from 'fura-vue/component/dropdown/index.js'
import LlescaStackDraggable from '../stack-draggable/index.js'

export default {
  name: 'LlescaConfigListViewSimple',
  components: {
    'llesca-stack-draggable': LlescaStackDraggable,
    'fura-dropdown': FuraDropdown
  },
  props: {
    fields: { type: Array, required: true },
    modelValue: { type: Array, default: () => [] }
  },
  emits: ['update:modelValue'],
  computed: {
    fieldOptions () {
      const { modelValue, fields } = this
      const options = fields.map(field => ({
        value: field.key,
        text: field.label,
        disabled: modelValue.some(item => item.key === field.key)
      }))
      return [
        {
          value: null,
          text: '',
          disabeld: false
        },
        ...options
      ]
    }
  },
  methods: {
    addNewItem (key) {
      if (key) {
        this.$emit('update:modelValue', [
          ...this.modelValue,
          { key, direction: null }
        ])
      }
    },
    updateKey (index, key) {
      const newValue = [...this.modelValue]
      if (key) {
        newValue[index] = { key, direction: newValue[index].direction }
      } else {
        newValue.splice(index, 1)
      }
      this.$emit('update:modelValue', newValue)
    },
    updateDirection (index, direction) {
      const newValue = [...this.modelValue]
      newValue[index] = { key: newValue[index].key, direction }
      this.$emit('update:modelValue', newValue)
    },
    getOrderByOptions (key) {
      const field = this.fields.find(field => field.key === key)
      if (field && field.orderby) {
        return field.orderby
      } else {
        return [
          { value: 'asc', text: 'A -> Z' },
          { value: 'desc', text: 'Z -> A' }
        ]
      }
    }
  }
}
</script>

<template>
  <llesca-stack-draggable
    primary-key="key"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #default="slotProps">
      <div class="list-view-fields">
        <fura-dropdown
          class="list-view-field"
          :options="fieldOptions"
          :model-value="slotProps.item.key"
          @update:modelValue="updateKey(slotProps.index, $event)"
        />
        <fura-dropdown
          class="list-view-orderBy"
          :options="getOrderByOptions(slotProps.item.key)"
          :model-value="slotProps.item.direction"
          @update:modelValue="updateDirection(slotProps.index, $event)"
        />
        <div />
      </div>
    </template>
    <template #footer>
      <div class="list-view-fields">
        <fura-dropdown
          class="list-view-field"
          :options="fieldOptions"
          @update:modelValue="addNewItem"
        />
        <div class="list-view-orderBy" />
      </div>
    </template>
  </llesca-stack-draggable>
</template>

<style lang="less" scoped src="./config-list-view-simple.less"></style>
