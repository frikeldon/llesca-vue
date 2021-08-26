<script>
import ListView from '../list-view/index.js'
import {
  findLastIndex,
  zipMap,
  subarrayEquals
} from '../../utils/collections.js'
import {
  loadAggregatedData,
  aggregatedName,
  createRows,
  getOrderIcon
} from '../../utils/list-view.js'

export default {
  name: 'LlescaListViewAggregated',
  components: {
    ListView
  },
  props: {
    /** Direccion URL del EntitySet a consultar. */
    endPoint: { type: [Array, String], required: true },
    /** Llista de propiedades a agrupar los totales. */
    wrapperProperties: { type: Array, default: () => [] },
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
    /**
     * Indica la posición en la que mostrar los componentes de navegación, o si deben esconderse.
     * @values topLeft, topCenter, topRight, bottomLeft, bottomCenter, bottomRight, none
     */
    /** Número de elementos por página. */
    pageSize: {
      type: Number,
      default: null,
      validator: pageSize => Number.isInteger(pageSize)
    },
    paginationPosition: {
      type: String,
      default: 'bottomCenter',
      validator: paginationPosition =>
        ['topLeft', 'topCenter', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight', 'none'].includes(paginationPosition)
    },
    /** Indica si la tabla debe dibujarse en modo compacto. */
    compact: { type: Boolean, default: false }
  },
  data () {
    return {
      data: [],
      rows: [],
      groups: [],
      currentGroups: [],
      currentPage: 0,
      entitesLoaded: 0
    }
  },
  emits: [
    /** Inicio de la carga de datos. */
    'loadStart',
    /** Fin de la carga de datos. */
    'loadEnd',
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
      const { wrapperProperties, groupedProperties, properties } = this
      return [
        ...wrapperProperties
          .map((property, propertyIndex) => {
            return typeof property.label === 'string'
              ? {
                  title: property.label,
                  align: property.align,
                  icon: getOrderIcon(property, 'asc'),
                  type: 'wrapperProperties',
                  grouped: true,
                  property,
                  propertyIndex
                }
              : undefined
          }),
        ...groupedProperties
          .map((property, propertyIndex) => {
            return typeof property.label === 'string'
              ? {
                  title: property.label,
                  align: property.align,
                  icon: getOrderIcon(property),
                  type: 'groupedProperties',
                  grouped: false,
                  property,
                  propertyIndex
                }
              : undefined
          }),
        ...properties
          .map((property, propertyIndex) => {
            return typeof property.label === 'string'
              ? {
                  title: property.label,
                  align: property.align,
                  icon: getOrderIcon(property),
                  type: 'properties',
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
      const data = this.$.type.data()
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
        this.groups.length === 0 ? this.loadGroupedData() : undefined
      ])

      this.loadCurrentGroups()

      const lastLevel = this.groups.reduce((maxLevel, group) => Math.max(maxLevel, group.level || 0), 0)
      const groupedCols = this.wrapperProperties.length

      for (const group of this.groups) {
        if (group.level === lastLevel) {
          const firstIndex = this.rows.findIndex(row => subarrayEquals(row, group.row, 0, groupedCols))
          const lastIndex = findLastIndex(this.rows, row => subarrayEquals(row, group.row, 0, groupedCols))
          group.startIndex = firstIndex
          group.count = lastIndex + 1 - firstIndex
        }
      }

      this.$emit('loadEnd')
    },
    async loadDetailData () {
      const response = await this.loadAggregatedData(this.wrapperProperties.length, {
        withGroupedProperties: true,
        paginated: true
      })
      this.data = response.value
      this.rows = createRows(this.columns, response.value, { aggregate: true })
      this.entitesLoaded = response['@odata.count']
    },
    loadAggregatedData (level, { withGroupedProperties, paginated } = {}) {
      const wrapperProperties = this.wrapperProperties.slice(0, level)
      const groupedProperties = withGroupedProperties
        ? wrapperProperties.concat(this.groupedProperties)
        : wrapperProperties
      return loadAggregatedData({
        endPoint: this.endPoint,
        groupedProperties,
        properties: this.properties,
        orderby: [
          ...wrapperProperties
            .map(property => ({
              sentence: property.path || property.$select,
              direction: property.direction === 'desc'
                ? 'desc'
                : 'asc'
            })),
          ...(withGroupedProperties ? this.groupedProperties : [])
            .map(property => ({
              sentence: property.path || property.$select,
              direction: property.direction
            })),
          ...this.properties
            .map((property, index) => ({
              sentence: aggregatedName(index),
              direction: property.direction
            }))
        ].filter(order => ['asc', 'desc'].includes(order.direction)),
        filter: this.filter,
        pageSize: paginated && this.pageSize,
        currentPage: this.currentPage
      })
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
        const response = await this.loadAggregatedData(this.wrapperProperties.length)
        const rows = createRows(this.columns, response.value, { aggregate: true })

        this.groups = this.groups.concat(zipMap(response.value, rows, (entity, row) => ({
          startIndex: 0,
          count: 0,
          level: 1,
          entity,
          row
        })))
      } else {
        for (let index = 0; index < this.wrapperProperties.length; index += 1) {
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
            const previousIndex = findLastIndex(this.groups, currentGroup => subarrayEquals(group.row, currentGroup.row, 0, index))
            this.groups.splice(previousIndex + 1, 0, group)
          }
        }
      }
    },
    loadCurrentGroups () {
      if (this.flatGroups) {
        const groupedCols = this.wrapperProperties.length
        this.currentGroups = this.groups.filter(group => {
          if (group.level === 0) {
            return true
          }
          const firstIndex = this.rows.findIndex(row => subarrayEquals(row, group.row, 0, groupedCols))
          return firstIndex >= 0
        })
      } else {
        this.currentGroups = this.groups.filter(group => {
          if (group.level === 0) {
            return true
          }
          const firstIndex = this.rows.findIndex(row => subarrayEquals(row, group.row, 0, group.level))
          return firstIndex >= 0
        })
      }
    },
    /**
     * Actualiza la propiedad de pagina actual, y recarga los datos.
     * @param {number} index Número de pagina empezando por la 0.
     * @public
     */
    goToPage (index) {
      this.currentPage = index
      this.loadData()
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>

<template>
  <ListView
    class="llesca-totals"
    auto-layout="auto"
    without-group-header
    :columns="columns"
    :groups="currentGroups"
    :data="rows"
    :compact="compact"
    :page-size="pageSize"
    :current-page="currentPage"
    :data-count="entitesLoaded"
    :pagination-position="paginationPosition"
    @clickHeader="$emit('clickHeader', $event)"
    @clickCell="$emit('clickCell', $event)"
    @update:currentPage="goToPage"
  >
    <template #default="slotProps">
      <!--
        @slot Contenido de una celda.
        @binding {number} rowIndex Índice de la fila.
        @binding {number} columnIndex Índice de la definición de la columna.
        @binding {string} content Contenido de la celda.
        @binding {object} column Referencia a la definición de la columna.
      -->
      <slot
        :row-index="slotProps.rowIndex"
        :column-index="slotProps.columnIndex"
        :content="slotProps.content"
        :column="slotProps.column"
      />
    </template>
    <template #header="slotProps">
      <!--
        @slot Contenido de una cabecera.
        @binding {object} column Referencia a la definición de la columna.
        @binding {number} index Índice de la definición de la columna.
      -->
      <slot
        name="header"
        :column="slotProps.column"
        :index="slotProps.index"
      />
    </template>
    <template #bodyHeader="slotProps">
      <!--
        @slot Contenido de una celda de un encabezado de cuerpo.
        @binding {number} groupIndex Índice de la definición del grupo.
        @binding {object} group Referencia a la definición del grupo.
        @binding {number} columnIndex Índice de la definición de la columna.
        @binding {object} column Referencia a la definición de la columna.
        @binding {Array} data Datos del grupo.
      -->
      <slot
        name="bodyHeader"
        :group-index="slotProps?.groupIndex"
        :group="slotProps?.group"
        :column-index="slotProps?.columnIndex"
        :column="slotProps?.column"
        :data="slotProps?.data"
      />
    </template>
    <template #bodyFooter="slotProps">
      <!--
        @slot Contenido de una celda de un pie de cuerpo.
        @binding {number} groupIndex Índice de la definición del grupo.
        @binding {object} group Referencia a la definición del grupo.
        @binding {number} columnIndex Índice de la definición de la columna.
        @binding {object} column Referencia a la definición de la columna.
        @binding {Array} data Datos del grupo.
      -->
      <slot
        name="bodyFooter"
        :group-index="slotProps?.groupIndex"
        :group="slotProps?.group"
        :column-index="slotProps?.columnIndex"
        :column="slotProps?.column"
        :data="slotProps?.data"
      />
    </template>
  </ListView>
</template>
