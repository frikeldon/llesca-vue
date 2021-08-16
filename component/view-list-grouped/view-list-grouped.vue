<script>
import FuraDetailsList from 'fura-vue/component/details-list/index.js'
import { odataEquals, odataFilter } from 'odata-tools'

function findLastIndex (array, predicate) {
  for (let index = array.length - 1; index >= 0; index -= 1) {
    if (predicate(array[index], index, array)) {
      return index
    }
  }
  return -1
}

function getInitialState () {
  return {
    rows: [],
    groups: [],
    groupData: [],
    selectedIndices: [],
    currentPage: 0,
    entitesLoaded: 0
  }
}

export default {
  name: 'LlescaViewListGrouped',
  components: { 'fura-details-list': FuraDetailsList },
  props: {
    /** Nombre de la colección en el esquema. */
    entitySet: { type: String, required: true },
    /** Propiedades de la entidad a consultar. */
    requiredProperties: { type: Array, default: () => [] },
    /** Propiedades a agrupar. */
    groupedProperties: { type: Array, required: true },
    /** Propiedades agrupadas con formula. */
    aggregatedProperties: { type: Array, required: true },
    /**
     * Campos a expandir.
     * Si el valor es true, expande automaticamente todos los campos de la vista.
     * Si el valor es false, no expande ningun camp.
     * Si no el valor ha de ser una lista con las propiedades a expandir.
     */
    expand: { type: [Array, Boolean], default: false },
    /** Indica si debe mostrarse una fila con los totales generales. */
    allAggregated: { type: Boolean, default: false },
    /** Indica si las celdas de las columnas agrupadas se tienen que esconder en las filas de detalle. */
    hideGroupedColsInDetails: { type: Boolean, default: false },
    /** Filtro OData a aplicar */
    filter: { type: [String, Object], default: null },
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
    detailsListColumns () {
      const { $llesca, entitySet, groupedProperties, aggregatedProperties } = this
      return [
        ...groupedProperties.map(definition => ({
          key: definition.key,
          title: definition.label || $llesca[entitySet].getProperty(definition.key).label,
          aggregated: true
        })),
        ...aggregatedProperties.map(definition => ({
          key: definition.$count
            ? `${entitySet}_count`
            : definition.key,
          title: definition.label || $llesca[entitySet].getProperty(definition.key).label,
          false: true
        }))
      ]
    },
    orderbyExpression () {
      const { $llesca, entitySet, groupedProperties, expand } = this
      return groupedProperties.map(prop => {
        if (expand === true || (Array.isArray(expand) && expand.includes(prop.key))) {
          const property = $llesca[entitySet].getProperty(prop.key)
          if (property.expand && property.expandText) {
            return `${property.expand}/${property.expandText} ${prop.direction || 'asc'}`
          } else {
            return `${prop.key} ${prop.direction || 'asc'}`
          }
        } else {
          return `${prop.key} ${prop.direction || 'asc'}`
        }
      }).join()
    }
  },
  methods: {
    async loadDetailData () {
      const entity = this.$llesca[this.entitySet]
      const selectKeys = new Set([
        ...entity.properties
          .filter(property => property.primary)
          .map(property => property.key),
        ...this.requiredProperties,
        ...[
          ...this.groupedProperties,
          ...this.aggregatedProperties.filter(aggregated => !aggregated.$count)
        ].map(prop => prop.key)
      ])
      const options = {
        $select: Array.from(selectKeys),
        $filter: this.filter ? odataFilter(this.filter) : undefined,
        $orderby: this.orderbyExpression,
        $expand: this.expand
      }
      const response = await entity.getEntitySet(options)
      this.rows = response.value
    },
    async loadGroupedData () {
      const entity = this.$llesca[this.entitySet]

      const filter = this.filter ? `filter(${odataFilter(this.filter)})/` : ''

      const grouped = this.groupedProperties.map(prop => {
        if (this.expand === true || (Array.isArray(this.expand) && this.expand.includes(prop.key))) {
          const property = entity.getProperty(prop.key)
          if (property.expand && property.expandText) {
            return `${prop.key},${property.expand}/${property.expandText}`
          }
        }
        return `${prop.key}`
      }).join()
      const aggregate = this.aggregatedProperties.map(definition => definition.$count
        ? `$count as ${this.entitySet}_count`
        : `${definition.key} with ${definition.aggregation} as ${definition.key + definition.aggregation}`
      ).join()

      const groupby = aggregate
        ? `groupby((${grouped}), aggregate(${aggregate}))`
        : `groupby((${grouped}))`

      const response = await entity.getEntitySet({
        $apply: filter + groupby,
        $orderby: this.orderbyExpression
      })

      if (this.allAggregated) {
        const $apply = `${filter}aggregate(${aggregate})`
        const responseAggregated = await entity.getEntitySet({ $apply })
        response.value.unshift(responseAggregated.value[0])
      }

      for (const aggregated of this.aggregatedProperties) {
        if (!aggregated.$count && aggregated.aggregation !== 'countdistinct') {
          for (const row of response.value) {
            const name = aggregated.key + aggregated.aggregation
            row[aggregated.key] = row[name]
            delete row[name]
          }
        }
      }

      this.groupData = entity.replaceOdataValues(response.value)

      for (const aggregated of this.aggregatedProperties) {
        if (!aggregated.$count && aggregated.aggregation === 'countdistinct') {
          for (const row of this.groupData) {
            const name = aggregated.key + aggregated.aggregation
            row[aggregated.key] = row[name]
            delete row[name]
          }
        }
      }
    },
    async loadData () {
      this.$emit('loadStart')

      await Promise.all([
        this.loadDetailData(),
        this.loadGroupedData()
      ])

      const groupKeys = this.groupedProperties.map(property => property.key)
      const groups = this.allAggregated
        ? [{
            name: 'allAggregated',
            startIndex: 0,
            count: 0,
            level: 0
          }]
        : []
      const level = this.allAggregated ? 1 : 0
      const groupedData = this.allAggregated ? this.groupData.slice(1) : this.groupData

      for (const data of groupedData) {
        const startIndex = this.rows.findIndex(row => groupKeys.every(key => odataEquals(row[key], data[key])))
        const endIndex = findLastIndex(this.rows, row => groupKeys.every(key => odataEquals(row[key], data[key])))
        groups.push({
          name: data[groupKeys[0]],
          startIndex,
          count: endIndex - (startIndex - 1),
          level
        })
      }

      this.groups = groups

      this.$emit('loadEnd')
    },
    getBodyHeaderContent (props) {
      return this.groupData[props?.groupIndex]?.[props?.column?.key]
    },
    updateSelectedIndices (selectedIndices) {
      if (!(
        this.selectedIndices.length === selectedIndices.length &&
        this.selectedIndices.every((item, index) => item === selectedIndices[index])
      )) {
        this.selectedIndices = selectedIndices
        const items = selectedIndices.map(index => this.rows[index])
        this.$emit('updateSelectedItems', items)
      }
    }
  },
  watch: {
  },
  async mounted () {
    await this.loadData()
  }
}
</script>

<template>
  <fura-details-list
    :class="allAggregated ? 'llesca-totals' : undefined"
    without-group-header
    auto-layout="auto"
    :columns="detailsListColumns"
    :data="rows"
    :groups="groups"
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
        <span v-if="hideGroupedColsInDetails && slotProps.column.aggregated" />
        <div
          v-else
          class="llesca-cell"
          v-odata-content="slotProps.content"
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
          v-odata-content="getBodyHeaderContent(slotProps)"
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
  </fura-details-list>
</template>

<style lang="less" scoped src="./view-list-grouped.less"></style>
