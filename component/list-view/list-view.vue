<script>
import BaseListView from '../base-list-view/index.js'
import directiveContent from '../../directive/content.js'
import {
  findLastIndex,
  zipMap,
  subarrayEquals
} from '../../utils/collections.js'
import {
  requestDetail,
  loadAggregatedData,
  createRows,
  getOrderIcon
} from '../../utils/list-view.js'

function getGroupedDirection (property) {
  switch (property.direction) {
    case 'desc':
      return 'desc'
    case 'asc':
    default:
      return 'asc'
  }
}

export default {
  name: 'LlescaListView',
  components: {
    BaseListView
  },
  directives: {
    content: directiveContent
  },
  props: {
    /** Direccion URL del EntitySet a consultar. */
    endPoint: { type: [Array, String], required: true },
    /** Llista de propiedades a agrupar. */
    groupedProperties: { type: Array, default: () => [] },
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
    /**
     * Controla el tipo de selección de filas. Si no está definido, no hay control de selcción.
     * @values multiple, simple, safe
     */
    selection: { type: String, default: '' },
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
      selectedIndices: [],
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
          .filter(property => typeof property.label === 'string')
          .map((property, propertyIndex) => {
            return {
              title: property.label,
              align: property.align,
              icon: getOrderIcon(property, 'asc'),
              type: 'groupedProperties',
              grouped: true,
              property,
              propertyIndex
            }
          }),
        ...properties
          .filter(property => typeof property.label === 'string')
          .map((property, propertyIndex) => {
            const order = orderby?.find(order =>
              order.sentence === property.$select ||
              order.sentence === property.path
            )
            return {
              title: property.label,
              align: property.align,
              icon: getOrderIcon(order),
              type: 'properties',
              grouped: false,
              property,
              propertyIndex
            }
          })
      ]
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
     * Carga los datos de la página actual, y si los datos de los grupos no estan cargados, tambien los carga.
     * @public
     */
    async loadData () {
      this.$emit('loadStart')

      await Promise.all([
        this.loadDetailData(),
        this.groups.length === 0 ? this.loadGroupedData() : undefined
      ])

      const lastLevel = this.groups.reduce((maxLevel, group) => Math.max(maxLevel, group.level || 0), 0)
      const groupedCols = this.groupedProperties.length

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
      const response = await requestDetail({
        endPoint: this.endPoint,

        properties: this.groupedProperties
          .concat(this.properties),

        orderby: this.groupedProperties
          .map(property => ({
            sentence: property.path || property.$select,
            direction: getGroupedDirection(property)
          }))
          .concat(this.orderby),

        filter: this.filter,

        pageSize: this.pageSize,
        currentPage: this.currentPage
      })

      this.data = response.value
      this.rows = createRows(this.columns, response.value)
      this.entitesLoaded = response['@odata.count']
    },
    loadAggregatedData (level) {
      const groupedProperties = this.groupedProperties.slice(0, level)

      return loadAggregatedData({
        endPoint: this.endPoint,
        groupedProperties,
        properties: this.properties,
        orderby: groupedProperties.map(property => ({
          sentence: property.path || property.$select,
          direction: property.direction === 'desc' ? 'desc' : 'asc'
        })),
        filter: this.filter
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

      const lastLevel = this.groupedProperties.length
      if (this.flatGroups) {
        const response = await this.loadAggregatedData(lastLevel)
        const rows = createRows(this.columns, response.value, { aggregate: true })

        this.groups = this.groups.concat(zipMap(response.value, rows, (entity, row) => ({
          startIndex: 0,
          count: 0,
          level: lastLevel,
          entity,
          row
        })))
      } else {
        for (let level = 1; level <= lastLevel; level += 1) {
          const response = await this.loadAggregatedData(level)
          const rows = createRows(this.columns, response.value, { aggregate: true })

          const newGroups = zipMap(response.value, rows, (entity, row) => ({
            startIndex: 0,
            count: 0,
            level,
            entity,
            row
          }))

          while (newGroups.length > 0) {
            const group = newGroups.shift()
            const previousIndex = findLastIndex(this.groups, currentGroup => subarrayEquals(group.row, currentGroup.row, 0, level - 1))
            this.groups.splice(previousIndex + 1, 0, group)
          }
        }
      }
    },
    /**
     * Actualiza la propiedad de pagina actual, y recarga los datos.
     * @param {number} index Número de pagina empezando por la 0.
     * @public
     */
    goToPage (index) {
      this.currentPage = index
      this.updateSelectedIndices([])
      this.loadData()
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
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>

<template>
  <BaseListView
    auto-layout="auto"
    without-group-header
    :columns="columns"
    :groups="groups"
    :rows="rows"
    :compact="compact"
    :selection="selection"
    :selected-indices="selectedIndices"
    :page-size="pageSize"
    :current-page="currentPage"
    :data-count="entitesLoaded"
    :pagination-position="paginationPosition"
    @update:selected-indices="updateSelectedIndices"
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
  </BaseListView>
</template>
