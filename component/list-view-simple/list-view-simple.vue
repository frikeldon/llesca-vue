<script>
import BaseListView from '../base-list-view/index.js'
import {
  requestDetail,
  createRows,
  getOrderIcon
} from '../../utils/list-view.js'

export default {
  name: 'LlescaListViewSimple',
  components: {
    BaseListView
  },
  props: {
    /** Direccion URL del EntitySet a consultar. */
    endPoint: { type: [Array, String], required: true },
    /** Llista de propiedades a consultar. */
    properties: { type: Array, required: true },
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
      this.rows = createRows(this.columns, response.value)
      this.entitesLoaded = response['@odata.count']

      this.$emit('loadEnd')
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
    :columns="columns"
    :data="rows"
    :selection="selection"
    :selected-indices="selectedIndices"
    :current-page="currentPage"
    :data-count="entitesLoaded"
    :page-size="pageSize"
    :pagination-position="paginationPosition"
    :compact="compact"
    @clickHeader="$emit('clickHeader', $event)"
    @clickCell="$emit('clickCell', $event)"
    @update:selected-indices="updateSelectedIndices"
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
