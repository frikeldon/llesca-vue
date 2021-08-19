<script>
import FuraDetailsList from 'fura-vue/component/details-list/index.js'
import FuraSpinNav from 'fura-vue/component/spin-nav/index.js'
import { requestGet } from '../../utils/odata.js'
import directiveContent from '../../utils/directive-content.js'

function getInitialState () {
  return {
    data: [],
    rows: [],
    selectedIndices: [],
    currentPage: 0,
    entitesLoaded: 0
  }
}

function isPathMultiple (path) {
  return path.split('/').some(step => step[0] === '*')
}

function getValueFromPath (path, entity) {
  if (typeof path === 'string') {
    if (isPathMultiple(path)) {
      const steps = path.split('/')
      const stepMultiple = steps.findIndex(step => step[0] === '*')
      const stepsToArray = steps.splice(0, stepMultiple + 1)
      stepsToArray[stepMultiple] = stepsToArray[stepMultiple].substr(1)

      let level = entity
      while (level && stepsToArray.length > 0) {
        level = level[stepsToArray.shift()]
      }

      if (steps.length === 0) {
        return level
      } else {
        return level.map(root => {
          const localSteps = [...steps]
          let current = root
          while (current && localSteps.length > 0) {
            current = current[localSteps.shift()]
          }
          return current
        })
      }
    } else {
      const steps = path.split('/')
      let level = entity
      while (level && steps.length > 0) {
        level = level[steps.shift()]
      }
      return level
    }
  }
  return undefined
}

function parsePropertiesFromPath (property, entity) {
  if (isPathMultiple(property.path)) {
    const steps = property.path.split('/')
    const stepMultiple = steps.findIndex(step => step[0] === '*')
    const stepsToArray = steps.splice(0, stepMultiple + 1)
    stepsToArray[stepMultiple] = stepsToArray[stepMultiple].substr(1)

    if (steps.length === 0) {
      let level = entity
      while (level && stepsToArray.length > 1) {
        level = level[stepsToArray.shift()]
      }
      const last = steps[0]
      level[last] = level[last].map(item => property.parse(item, property))
    } else {
      let level = entity
      while (level && stepsToArray.length > 0) {
        level = level[stepsToArray.shift()]
      }
      level.forEach(root => {
        const localSteps = [...steps]
        let current = root
        while (current && localSteps.length > 1) {
          current = current[localSteps.shift()]
        }
        const last = localSteps[0]
        current[last] = property.parse(current[last], property)
      })
    }
  } else {
    const steps = property.path.split('/')
    let level = entity
    while (level && steps.length > 1) {
      level = level[steps.shift()]
    }
    const last = steps[0]
    level[last] = property.parse(level[last], property)
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

      const $select = this.properties
        .filter(property => property.$select)
        .map(property => property.$select)
        .join() || undefined

      const $expand = this.properties
        .filter(property => property.$expand)
        .map(property => property.$expand)
        .join() || undefined

      const $orderby = this.orderby
        ?.filter(order => ['asc', 'desc'].includes(order.direction))
        .map(order => `${order.sentence} ${order.direction}`)
        .join() || undefined

      const $top = this.isPaginated ? this.pageSize : undefined
      const $skip = this.isPaginated ? this.currentPage * this.pageSize : undefined
      const $filter = this.filter

      const response = await requestGet(this.endPoint, {
        $select,
        $expand,
        $filter,
        $orderby,
        $top,
        $skip,
        $count: true
      })

      // Parse data
      for (const property of this.properties) {
        if (property.parse) {
          if (property.$select) {
            for (const entity of response.value) {
              const value = entity[property.$select]
              entity[property.$select] = property.parse(value, property)
            }
          }
          if (property.$expand) {
            for (const entity of response.value) {
              parsePropertiesFromPath(property, entity)
            }
          }
        }
      }

      // Create rows
      const rows = []
      for (const entity of response.value) {
        const row = []
        for (const { property } of this.detailsListColumns) {
          if (property.$expand) {
            row.push(getValueFromPath(property.path, entity))
          } else if (property.$select) {
            row.push(entity[property.$select])
          }
        }

        rows.push(row)
      }

      this.data = response.value
      this.rows = rows
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
    }
  },
  async mounted () {
    this.loadData()
  }
}
</script>

<template>
  <div :class="containerClass">
    <FuraDetailsList
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
            v-content:[slotProps.column.property]="slotProps.content"
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

<style lang="less" scoped src="./list-view-simple.less"></style>
