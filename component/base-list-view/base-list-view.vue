<script>
import FuraDetailsList from 'fura-vue/component/details-list/index.js'
import FuraSpinNav from 'fura-vue/component/spin-nav/index.js'
import directiveContent from '../../directive/content.js'
import { subarrayEquals } from '../../utils/collections.js'

export default {
  name: 'LlescaBaseListView',
  components: {
    FuraSpinNav,
    FuraDetailsList
  },
  directives: {
    content: directiveContent
  },
  props: {
    /** Definición de las columnas. */
    columns: { type: Array, required: true },
    /** Datos a mostrar en la tabla. */
    rows: { type: Array, required: true },
    /** Definición de las agrupaciones de datos. */
    groups: { type: Array, default: () => [] },
    /** Lista con los índices seleccionados. */
    selectedIndices: { type: Array, default: () => [] },
    /**
     * Indica si el ancho de las columnas debe calcularse automáticamente.
     * - auto: El ancho de las columnas se calcula automáticamente.
     * - fullAuto: El ancho de las columnas y el de la tabla se calculan automáticamente.
     * @values auto, fullAuto
     */
    autoLayout: { type: String, default: null },
    /** Indica si la tabla debe dibujarse en modo compacto. */
    compact: { type: Boolean, default: false },
    /**
     * Controla el tipo de selección de filas. Si no está definido, no hay control de selcción.
     * @values multiple, simple, safe
     */
    selection: { type: String, default: '' },
    /** Número de elementos por página. */
    pageSize: {
      type: Number,
      default: null,
      validator: pageSize => pageSize === null ||
        (Number.isInteger(pageSize) && pageSize > 0)
    },
    /** Número de página actual. */
    currentPage: {
      type: Number,
      default: 0,
      validator: currentPage => currentPage === null ||
        (Number.isInteger(currentPage) && currentPage >= 0)
    },
    /** Número total de registros de datos. */
    dataCount: {
      type: Number,
      default: null,
      validator: dataCount => dataCount === null ||
        (Number.isInteger(dataCount) && dataCount >= 0)
    },
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
  emits: [
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
    'clickCell',
    /**
     * Se genera cuando el usuario cambia de página.
     * @property {number} index Página de destino.
     */
    'update:currentPage'
  ],
  computed: {
    isPaginated () {
      return typeof this.pageSize === 'number' && typeof this.dataCount === 'number'
    },
    totalPages () {
      const { pageSize, dataCount } = this
      return Math.ceil(dataCount / pageSize)
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
    },
    currentGroups () {
      const { groups, rows } = this
      return groups.filter(group =>
        group.level === 0 ||
        rows.findIndex(row => subarrayEquals(row, group.row, 0, group.level)) >= 0
      )
    }
  },
  methods: {
    goToPage (index) {
      if (this.isPaginated && index >= 0 && index < this.totalPages) {
        this.$emit('update:currentPage', index)
      }
    },
    handleGoTo (page) {
      const value = Number(page)
      if (!isNaN(value) && value > 0 && value <= this.totalPages) {
        this.goToPage(value - 1)
      }
    },
    getAggregateTransformations (property) {
      return typeof property?.aggregate === 'object' ? property.aggregate : property
    }
  }
}
</script>

<template>
  <div :class="containerClass">
    <FuraDetailsList
      class="llesca-listView"
      without-group-header
      :columns="columns"
      :data="rows"
      :groups="currentGroups"
      :selected-indices="selectedIndices"
      :auto-layout="autoLayout"
      :compact="compact"
      :selection="selection"
      @update-selected-items="$emit('updateSelectedItems', $event)"
      @click-header="$emit('clickHeader', $event)"
      @click-cell="$emit('clickCell', $event)"
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
        >
          <div
            class="llesca-cell"
            :class="{'llesca-grouped': slotProps.column.grouped }"
            v-content:[slotProps.column.property]="slotProps.content"
          />
        </slot>
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
        >
          <div
            v-if="groups.length > 0"
            class="llesca-cell llesca-header"
            v-content:[getAggregateTransformations(slotProps?.column?.property)]="slotProps?.group?.row[slotProps.columnIndex]"
          />
        </slot>
      </template>
    </FuraDetailsList>

    <FuraSpinNav
      v-if="isPaginated && containerClass && paginationClass && rows.length > 0"
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

<style lang="less" scoped src="./base-list-view.less"></style>
