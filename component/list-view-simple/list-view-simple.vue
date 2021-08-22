<script>
import FuraDetailsList from 'fura-vue/component/details-list/index.js'
import FuraSpinNav from 'fura-vue/component/spin-nav/index.js'
import directiveContent from '../../utils/directive-content.js'
import { requestDetail } from '../../utils/list-view.js'
import { getValueFromPath } from '../../utils/properties.js'

function getOrderIcon (order) {
  if (order?.direction === 'asc') {
    return 'SortDown'
  }
  if (order?.direction === 'desc') {
    return 'SortUp'
  }
  return null
}

export default {
  name: 'LlescaListViewSimple',
  components: {
    FuraSpinNav,
    FuraDetailsList
  },
  directives: {
    content: directiveContent
  },
  props: {
    /** Direccion URL del EntitySet a consultar. */
    endPoint: { type: [Array, String], required: true },
    /** Llista de propiedades a consultar. */
    properties: { type: Array, required: true },
    /** Número de elementos por página. */
    pageSize: {
      type: Number,
      default: null,
      validator: pageSize => Number.isInteger(pageSize)
    },
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
    selection: { type: String, default: '' },
    /**
     * Indica la posición en la que mostrar los componentes de navegación, o si deben esconderse.
     * @values topLeft, topCenter, topRight, bottomLeft, bottomCenter, bottomRight, none
     */
    paginationPosition: {
      type: String,
      default: 'bottomCenter',
      validator: paginationPosition =>
        ['topLeft', 'topCenter', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight', 'none'].includes(paginationPosition)
    }
  },
  data () {
    return {
      data: [],
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
    isPaginated () {
      return typeof this.pageSize === 'number' && this.pageSize > 0
    },
    totalPages () {
      const { pageSize, entitesLoaded } = this
      return Math.ceil(entitesLoaded / pageSize)
    },
    columns () {
      const { properties } = this
      return properties
        .filter(property => typeof property.label === 'string')
        .map(property => {
          const order = this.orderby?.find(order =>
            order.sentence === property.$select ||
            order.sentence === property.path
          )
          return {
            title: property.label,
            align: property.align,
            icon: getOrderIcon(order),
            property
          }
        })
    },
    containerClass () {
      switch (this.paginationPosition) {
        case 'topLeft':
        case 'topCenter':
        case 'topRight':
          return 'llesca-navTop'
        case 'bottomLeft':
        case 'bottomCenter':
        case 'bottomRight':
          return 'llesca-navBottom'
        default:
          return undefined
      }
    },
    paginationClass () {
      switch (this.paginationPosition) {
        case 'topLeft':
        case 'bottomLeft':
          return 'llesca-left'
        case 'topCenter':
        case 'bottomCenter':
          return 'llesca-center'
        case 'topRight':
        case 'bottomRight':
          return 'llesca-right'
        default:
          return undefined
      }
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
     * Carga los datos de la pagina actual.
     * @public
     */
    async loadData () {
      this.$emit('loadStart')

      const response = await requestDetail({
        endPoint: this.endPoint,
        properties: this.properties,
        orderby: this.orderby,
        filter: this.filter,
        pageSize: this.pageSize,
        currentPage: this.currentPage
      })

      this.data = response.value
      this.entitesLoaded = response['@odata.count']

      this.$emit('loadEnd')
    },
    /**
     * Actualiza la propiedad de pagina actual, y recarga los datos.
     * @param {number} index Número de pagina empezando por la 0.
     * @public
     */
    goToPage (index) {
      if (this.isPaginated && index >= 0 && index < this.totalPages) {
        this.currentPage = index
        this.updateSelectedIndices([])
        this.loadData()
      }
    },
    handleGoTo (page) {
      const value = Number(page)
      if (!isNaN(value) && value > 0 && value <= this.totalPages) {
        this.goToPage(value - 1)
      }
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
    getCellValue (property, rowIndex) {
      return getValueFromPath(
        property.$expand ? property.path : property.$select,
        this.data[rowIndex]
      )
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>

<template>
  <div :class="containerClass">
    <FuraDetailsList
      auto-layout="auto"
      :columns="columns"
      :data="data"
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
            v-content:[slotProps.column.property]="getCellValue(slotProps.column.property, slotProps.rowIndex)"
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

    <FuraSpinNav
      v-if="isPaginated && containerClass && paginationClass && data.length > 0"
      class="llesca-navigation"
      :class="paginationClass"
      :current="currentPage + 1"
      :total="totalPages"
      end-button
      start-button
      editable
      :disable-prev="currentPage <= 0"
      :disable-next="currentPage + 1 >= totalPages"
      :disable-start="currentPage <= 0"
      :disable-end="currentPage + 1 >= totalPages"
      @prev="goToPage(currentPage - 1)"
      @next="goToPage(currentPage + 1)"
      @start="goToPage(0)"
      @end="goToPage(totalPages - 1)"
      @go-to="handleGoTo"
    />
  </div>
</template>

<style lang="less" scoped src="./list-view-simple.less"></style>
