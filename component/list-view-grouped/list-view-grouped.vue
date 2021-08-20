<script>
import FuraDetailsList from 'fura-vue/component/details-list/index.js'
import directiveContent from '../../utils/directive-content.js'
import { requestGet } from '../../utils/odata.js'
import { parseDataProperties, createRows, aggregatedName } from '../../utils/properties.js'
import { findLastIndex, zipMap } from '../../utils/collections.js'

function getInitialState () {
  return {
    data: [],
    rows: [],
    groups: [],
    selectedIndices: []
  }
}

function getOrderIcon (order) {
  if (order?.direction === 'asc') {
    return 'SortDown'
  }
  if (order?.direction === 'desc') {
    return 'SortUp'
  }
  return null
}

function getOrderDirection (property) {
  return property.direction === 'desc'
    ? 'desc'
    : 'asc'
}

function compareRowPrefix (row, group, numCols) {
  for (let index = 0; index < numCols; index += 1) {
    if (row[index] !== group.row[index]) {
      return false
    }
  }
  return true
}

export default {
  name: 'LlescaListViewGrouped',
  components: {
    FuraDetailsList
  },
  directives: {
    content: directiveContent
  },
  props: {
    /** Direccion URL del EntitySet a consultar. */
    endPoint: { type: [Array, String], required: true },
    /** Llista de propiedades a agrupar. */
    groupedProperties: { type: Array, required: true },
    /** Llista de propiedades a consultar. */
    properties: { type: Array, required: true },
    /** Indica si todas las agrupaciones se muestran en el primer nivel. */
    flatGroups: { type: Boolean, default: false },
    /** Indica si se muestra una linea con las agrupaciones totales. */
    allAggregatedRow: { type: Boolean, default: false },
    /** Filtro OData a aplicar */
    filter: { type: [String, Object], default: null },
    /** Filtro OData a aplicar */
    orderby: { type: Array, default: null },
    /** Indica si la tabla debe dibujarse en modo compacto. */
    compact: { type: Boolean, default: false },
    /**
     * Controla el tipo de selección de filas. Si no está definido, no hay control de selcción.
     * @values multiple, simple, safe
     */
    selection: { type: String, default: '' }
  },
  data: getInitialState,
  emits: [
    /** Inicio de la carga de datos. */
    'loadStart',
    /** Fin de la carga de datos. */
    'loadEnd',
    /**
     * Cambio en la seleccion de elementos.
     * @property {Array} selectedItems Los elementos seleccionados.
     */
    'updateSelectedItems',
    /**
     * Se genera cuando el usuario hace clic sobre una celda de la cabecera.
     * @property {number} index Índice de la columna pulsada.
     */
    'clickHeader',
    /**
     * Se genera cuando el usuario hace clic sobre una celda.
     * @property {object} coords Objeto ({ row, column }) con el número de fila y columna pulsada.
     */
    'clickCell'
  ],
  computed: {
    columns () {
      const { groupedProperties, properties, orderby } = this
      return [
        ...groupedProperties
          .map((property, propertyIndex) => {
            return typeof property.label === 'string'
              ? {
                  title: property.label,
                  align: property.align,
                  icon: getOrderIcon({ direction: getOrderDirection(property) }),
                  grouped: true,
                  property,
                  propertyIndex
                }
              : undefined
          }),
        ...properties
          .map((property, propertyIndex) => {
            const order = orderby?.find(order =>
              order.sentence === property.$select ||
              order.sentence === property.path
            )
            return typeof property.label === 'string'
              ? {
                  title: property.label,
                  align: property.align,
                  icon: getOrderIcon(order),
                  grouped: false,
                  property,
                  propertyIndex
                }
              : undefined
          })
      ]
        .filter(property => property)
    }
  },
  methods: {
    /**
     * Reinicia el estado interno del componetne.
     * @public
     */
    resetState () {
      const data = getInitialState()
      for (const key in data) {
        this[key] = data[key]
      }
    },
    /**
     * Carga los datos.
     * @public
     */
    async loadData () {
      this.$emit('loadStart')

      await Promise.all([
        this.loadDetailData(),
        this.loadGroupedData()
      ])

      const lastLevel = this.groups.reduce((maxLevel, group) => Math.max(maxLevel, group.level || 0), 0)
      const groupedCols = this.groupedProperties.length

      for (const group of this.groups) {
        if (group.level === lastLevel) {
          const firstIndex = this.rows.findIndex(row => compareRowPrefix(row, group, groupedCols))
          const lastIndex = findLastIndex(this.rows, row => compareRowPrefix(row, group, groupedCols))
          group.startIndex = firstIndex
          group.count = lastIndex + 1 - firstIndex
        }
      }

      this.$emit('loadEnd')
    },
    async loadDetailData () {
      const allProperties = [
        ...this.groupedProperties,
        ...this.properties
      ]

      const $select = allProperties
        .filter(property => property.$select)
        .map(property => property.$select)
        .join() || undefined

      const $expand = allProperties
        .filter(property => property.$expand)
        .map(property => property.$expand)
        .join() || undefined

      const $orderby = [
        this.getGroupOrderbyExpression(),
        this.orderby
          ?.filter(order => ['asc', 'desc'].includes(order.direction))
          .map(order => `${order.sentence} ${order.direction}`)
          .join()
      ]
        .filter(part => part)
        .join() || undefined

      const $filter = this.filter

      const response = await requestGet(this.endPoint, {
        $select,
        $expand,
        $filter,
        $orderby
      })

      parseDataProperties(allProperties, response.value)

      this.data = response.value
      this.rows = createRows(this.columns, response.value)
    },
    async loadAggregatedData (level) {
      const groupedProperties = this.groupedProperties.slice(0, level)
      const groupby = groupedProperties
        .map(property => property.path || property.$select)
        .join()

      const aggregate = this.properties
        .map((property, index) => {
          switch (typeof property.aggregate) {
            case 'string':
              return `${property.aggregate} as ${aggregatedName(index)}`
            case 'object':
              return `${property.aggregate.expression} as ${aggregatedName(index)}`
            default:
              return undefined
          }
        })
        .filter(item => item)
        .join()

      const apply = groupby
        ? aggregate
          ? `groupby((${groupby}), aggregate(${aggregate}))`
          : `groupby((${groupby}))`
        : aggregate
          ? `aggregate(${aggregate})`
          : ''

      const $apply = this.filter
        ? apply
          ? `filter(${this.filter})/${apply}`
          : `filter(${this.filter})`
        : apply || undefined

      const $orderby = this.getGroupOrderbyExpression(level) || undefined

      const response = await requestGet(this.endPoint, {
        $apply,
        $orderby
      })

      parseDataProperties(groupedProperties, response.value)

      // parse aggregated properties
      for (let index = 0; index < this.properties.length; index += 1) {
        const property = this.properties[index]
        if (typeof property.aggregate === 'string') {
          if (property.parse) {
            const name = aggregatedName(index)
            for (const entity of response.value) {
              const value = entity[name]
              entity[name] = property.parse(value, property)
            }
          }
        } else if (typeof property.aggregate === 'object') {
          if (property.aggregate.parse) {
            const name = aggregatedName(index)
            for (const entity of response.value) {
              const value = entity[name]
              entity[name] = property.aggregate.parse(value, property)
            }
          }
        }
      }

      return response
    },
    async loadGroupedData () {
      this.groups = []

      if (this.allAggregatedRow) {
        const response = await this.loadAggregatedData(0)
        const rows = createRows(this.columns, response.value, { aggregate: true })
        this.groups.push({
          startIndex: 0,
          count: 0,
          level: 0,
          entity: response.value[0],
          row: rows[0]
        })
      }

      if (this.flatGroups) {
        const response = await this.loadAggregatedData(this.groupedProperties.length)
        const rows = createRows(this.columns, response.value, { aggregate: true })

        this.groups = this.groups.concat(zipMap(response.value, rows, (entity, row) => ({
          startIndex: 0,
          count: 0,
          level: 1,
          entity,
          row
        })))
      } else {
        for (let index = 0; index < this.groupedProperties.length; index += 1) {
          const response = await this.loadAggregatedData(index + 1)
          const rows = createRows(this.columns, response.value, { aggregate: true })

          const newGroups = zipMap(response.value, rows, (entity, row) => ({
            startIndex: 0,
            count: 0,
            level: index + 1,
            entity,
            row
          }))

          while (newGroups.length > 0) {
            const group = newGroups.shift()
            const previousIndex = findLastIndex(this.groups, currentGroup => compareRowPrefix(group.row, currentGroup, index))
            this.groups.splice(previousIndex + 1, 0, group)
          }
        }
      }
    },
    getGroupOrderbyExpression (maxLevel) {
      const parts = []
      const length = typeof maxLevel === 'number'
        ? Math.min(maxLevel, this.groupedProperties.length)
        : this.groupedProperties.length
      for (let index = 0; index < length; index += 1) {
        const property = this.groupedProperties[index]
        const direction = getOrderDirection(property)
        parts.push(`${property.path || property.$select} ${direction}`)
      }
      return parts.join()
    },
    updateSelectedIndices (selectedIndices) {
      if (!(
        this.selectedIndices.length === selectedIndices.length &&
        this.selectedIndices.every((item, index) => item === selectedIndices[index])
      )) {
        this.selectedIndices = selectedIndices
        const items = selectedIndices.map(index => this.data[index])
        this.$emit('updateSelectedItems', items)
      }
    },
    getAggregateTransformations (property) {
      return typeof property?.aggregate === 'object' ? property.aggregate : property
    }
  },
  async mounted () {
    this.loadData()
  }
}
</script>

<template>
  <FuraDetailsList
    class="llesca-totals"
    auto-layout="auto"
    without-group-header
    :columns="columns"
    :groups="groups"
    :data="rows"
    :compact="compact"
    :selection="selection"
    :selected-indices="selectedIndices"
    @update:selected-indices="updateSelectedIndices"
    @clickHeader="$emit('clickHeader', $event)"
    @clickCell="$emit('clickCell', $event)"
  >
    <template #default="slotProps">
      <slot
        :row-index="slotProps.rowIndex"
        :column-index="slotProps.columnIndex"
        :content="slotProps.content"
        :column="slotProps.column"
      >
        <div
          class="llesca-cell"
          v-content:[slotProps.column.property]="slotProps.content"
        />
      </slot>
    </template>
    <template #bodyHeader="slotProps">
      <slot
        name="bodyHeader"
        :group-index="slotProps?.groupIndex"
        :group="slotProps?.group"
        :column-index="slotProps?.columnIndex"
        :column="slotProps?.column"
        :data="slotProps?.data"
      >
        <b
          class="llesca-cell"
          v-content:[getAggregateTransformations(slotProps?.column?.property)]="slotProps?.group?.row[slotProps.columnIndex]"
        />
      </slot>
    </template>
    <template #header="slotProps">
      <!--
        @slot Contenido de una cabecera
        @binding {object} column Referencia a la definición de la columna.
        @binding {number} index Índice de la definición de la columna.
      -->
      <slot
        name="header"
        :column="slotProps.column"
        :index="slotProps.index"
      />
    </template>
  </FuraDetailsList>
</template>

<style lang="less" scoped src="./list-view-grouped.less"></style>
