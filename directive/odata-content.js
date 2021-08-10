import { OdataValue } from 'odata-tools'

export default function reigster (app) {
  app.directive('odata-content', (el, binding) => {
    if (binding.value instanceof OdataValue) {
      if (typeof binding.value.htmlify === 'function') {
        el.innerHTML = binding.value.htmlify(binding.value.value)
      } else {
        el.textContent = binding.value.toString()
      }
    } else {
      el.textContent = binding.value?.toString() ?? ''
    }
  })
}
