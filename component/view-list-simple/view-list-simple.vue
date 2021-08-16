<script>
import FuraDetailsList from 'fura-vue/component/details-list/index.js'
import FuraSpinNav from 'fura-vue/component/spin-nav/index.js'

function getInitialState () {
  return {
    rows: [],
    selectedIndices: [],
    currentPage: 0,
    entitesLoaded: 0
  }
}

function getOrderIcon (order) {
  if (order) {
    if (order?.direction === 'asc') {
      return 'SortDown'
    }
    if (order?.direction === 'desc') {
      return 'SortUp'
    }
  }
  return null
}

export default {
  name: 'LlescaViewListSimple',
  components: {
    'fura-spin-nav': FuraSpinNav,
    'fura-details-list': FuraDetailsList
  },
  props: {
    /** Nombre de la colección en el esquema. */
    entitySet: { type: String, required: true },
    /** Propiedades de la entidad a consultar. */
    requiredProperties: { type: Array, default: () => [] },
    /** Propiedades de la entidad a mostrar. */
    viewProperties: { type: Array, required: true },
    /**
     * Campos a expandir.
     * Si el valor es true, expande automaticamente todos los campos de la vista.
     * Si el valor es false, no expande ningun camp.
     * Si no el valor ha de ser una lista con las propiedades a expandir.
     */
    expand: { type: [Array, Boolean], default: false },
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
    paginationPosition: {
      type: String,
      default: 'bottomCenter',
      validator: paginationPosition =>
        ['topLeft', 'topCenter', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight', 'none'].includes(paginationPosition)
    }
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
    isPaginated () {
      return typeof this.pageSize === 'number' && this.pageSize > 0
    },
    totalPages () {
      const { pageSize, entitesLoaded } = this
      return Math.ceil(entitesLoaded / pageSize)
    },
    detailsListColumns () {
      const { $llesca, entitySet, viewProperties, orderby } = this
      return viewProperties.map(key => {
        const property = $llesca[entitySet].getProperty(key)
        const order = orderby?.find(order => order.key === key)
        return {
          key,
          title: property?.label,
          icon: getOrderIcon(order)
        }
      })
    },
    selectKeys () {
      const { $llesca, entitySet, requiredProperties, viewProperties } = this
      const entity = $llesca[entitySet]
      const primaryProperties = entity.properties
        .filter(property => property.primary)
        .map(property => property.key)
      const keys = new Set([
        ...primaryProperties,
        ...requiredProperties,
        ...viewProperties
      ])
      return [...keys]
    },
    paginationOnTop () {
      const { isPaginated, paginationPosition } = this
      return isPaginated && ['topLeft', 'topCenter', 'topRight'].includes(paginationPosition)
    },
    paginationOnBottom () {
      const { isPaginated, paginationPosition } = this
      return isPaginated && ['bottomLeft', 'bottomCenter', 'bottomRight'].includes(paginationPosition)
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
      const data = getInitialState()
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
      const entity = this.$llesca[this.entitySet]

      const options = {
        $select: this.selectKeys,
        $expand: this.expand ?? undefined,
        $filter: this.filter ?? undefined,
        $top: this.isPaginated ? this.pageSize : undefined,
        $skip: this.isPaginated ? this.currentPage * this.pageSize : undefined,
        $orderby: this.orderby
          ?.filter(order => ['asc', 'desc'].includes(order.direction))
          .map(order => {
            if (this.expand === true || (Array.isArray(this.expand) && this.expand.includes(order.key))) {
              const property = entity.getProperty(order.key)
              if (property.expand && property.expandText) {
                return `${property.expand}/${property.expandText} ${order.direction}`
              } else {
                return `${order.key} ${order.direction}`
              }
            } else {
              return `${order.key} ${order.direction}`
            }
          })
          .join() ?? undefined,
        $count: true
      }

      const response = await entity.getEntitySet(options)
      this.rows = response.value
      this.entitesLoaded = response['@odata.count']

      this.$emit('loadEnd')
    },
    handleGoTo (page) {
      const value = Number(page)
      if (!isNaN(value) && value >= 0 && value <= this.totalPages) {
        this.currentPage = value - 1
      }
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
    currentPage () {
      this.updateSelectedIndices([])
      this.loadData()
    }
  },
  async mounted () {
    this.loadData()
  }
}
</script>

<template>
  <fura-spin-nav
    v-if="paginationOnTop"
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
    @prev="currentPage -= 1"
    @next="currentPage += 1"
    @start="currentPage = 0"
    @end="currentPage = totalPages - 1"
    @go-to="handleGoTo"
  />

  <fura-details-list
    auto-layout="auto"
    :columns="detailsListColumns"
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
          v-odata-content="slotProps.content"
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

  <fura-spin-nav
    v-if="paginationOnBottom"
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
    @prev="currentPage -= 1"
    @next="currentPage += 1"
    @start="currentPage = 0"
    @end="currentPage = totalPages - 1"
    @go-to="handleGoTo"
  />
</template>

<style lang="less" scoped src="./view-list-simple.less"></style>
