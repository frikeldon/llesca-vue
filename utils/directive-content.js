export default (el, binding) => {
  if (binding.arg.htmlify) {
    el.innerHTML = binding.arg.htmlify(binding.value)
  } else if (binding.arg.stringify) {
    el.textContent = binding.arg.stringify(binding.value)
  } else if (Array.isArray(binding.value)) {
    el.textContent = binding.value.join(', ')
  } else {
    el.textContent = binding.value
  }
}
