!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t(require("Vue")):"function"==typeof define&&define.amd?define(["Vue"],t):"object"==typeof exports?exports.llescaVue=t(require("Vue")):e.llescaVue=t(e.Vue)}(self,(e=>(()=>{"use strict";var t={407:(e,t)=>{t.Z=(e,t)=>{const l=e.__vccOpts||e;for(const[e,a]of t)l[e]=a;return l}},740:t=>{t.exports=e}},l={};function a(e){var i=l[e];if(void 0!==i)return i.exports;var o=l[e]={exports:{}};return t[e](o,o.exports,a),o.exports}a.d=(e,t)=>{for(var l in t)a.o(t,l)&&!a.o(e,l)&&Object.defineProperty(e,l,{enumerable:!0,get:t[l]})},a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);var i={};return(()=>{a.d(i,{default:()=>q});var e=a(740);function t(e,t,l){let a;return t?(...i)=>{clearTimeout(a),a=setTimeout((()=>{a=null,e.apply(l,i)}),t)}:e}const l={props:{label:{type:String,default:void 0},description:{type:String,default:void 0},invalid:{type:Boolean,default:void 0},borderless:{type:Boolean,default:void 0},underlined:{type:Boolean,default:void 0},options:{type:Array,required:!0},readonly:{type:Boolean,default:void 0},multiple:{type:Boolean,default:void 0},allowFreeform:{type:Boolean,default:void 0},autoComplete:{type:Boolean,default:void 0},accentInsensitive:{type:Boolean,default:void 0},placeholder:{type:String,default:void 0},immediateScroll:{type:Boolean,default:void 0},maxSelectedOptions:{type:Number,default:void 0},createField:{type:Function,default:null},name:{type:[String,Symbol],default:()=>Symbol("fieldText")},modelValue:{type:void 0,default:void 0},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},rules:{type:Array,default:null},autoValidate:{type:String,default:null,validator:e=>!e||["update","blur"].includes(e)},autoValidateWait:{type:Number,default:0},clearValueOnDisabled:{type:Boolean,default:!1}},emits:["update:modelValue","focus","blur"],setup(l,{expose:a,emit:i}){const o=l,r=(0,e.computed)((()=>[o.required&&(e=>(o.multiple&&!e?.length||!o.multiple&&!e)&&"Aquest camp es requerit."),...o.rules||[]].filter((e=>e)))),{errorMessage:d,validate:n,clear:u,destroy:s}=o.createField?o.createField(o.name,(0,e.toRef)(o,"modelValue"),{rules:r,skip:(0,e.toRef)(o,"disabled")}):{errorMessage:(0,e.ref)(null),validate:()=>!0,clear:()=>{},destroy:()=>{}};a({validate:n,clear:u});const p=(0,e.computed)((()=>t(n,o.autoValidateWait)));function c(t){i("update:modelValue",t),"update"===o.autoValidate&&(0,e.nextTick)((()=>p.value()))}function m(e){i("blur",e),"blur"===o.autoValidate&&n()}return(0,e.watch)((()=>o.disabled),(e=>{e&&o.clearValueOnDisabled&&i("update:modelValue",o.multiple?[]:null)})),(0,e.watch)((()=>o.options),(e=>{if(o.multiple){const t=o.modelValue.filter((t=>e.some((e=>e.value===t))));t.length!==o.modelValue.length&&i("update:modelValue",t)}else e.some((e=>e.value===o.modelValue))||i("update:modelValue",null)})),(0,e.onBeforeUnmount)(s),(t,a)=>{const o=(0,e.resolveComponent)("fura-combo-box");return(0,e.openBlock)(),(0,e.createBlock)(o,{label:l.label,description:l.description,invalid:l.invalid,borderless:l.borderless,underlined:l.underlined,options:l.options,readonly:l.readonly,multiple:l.multiple,"allow-freeform":l.allowFreeform,"auto-complete":l.autoComplete,"accent-insensitive":l.accentInsensitive,placeholder:l.placeholder,"immediate-scroll":l.immediateScroll,"max-selected-options":l.maxSelectedOptions,"error-message":(0,e.unref)(d),"model-value":l.modelValue,required:l.required,disabled:l.disabled,"onUpdate:modelValue":c,onFocus:a[0]||(a[0]=e=>i("focus",e)),onBlur:m},null,8,["label","description","invalid","borderless","underlined","options","readonly","multiple","allow-freeform","auto-complete","accent-insensitive","placeholder","immediate-scroll","max-selected-options","error-message","model-value","required","disabled"])}}},o={props:{label:{type:String,default:void 0},description:{type:String,default:void 0},invalid:{type:Boolean,default:!1},borderless:{type:Boolean,default:void 0},underlined:{type:Boolean,default:void 0},getOptions:{type:Function,required:!0},getOptionsWait:{type:Number,default:void 0},filterOptions:{type:Boolean,default:void 0},readonly:{type:Boolean,default:void 0},multiple:{type:Boolean,default:void 0},autoComplete:{type:Boolean,default:void 0},accentInsensitive:{type:Boolean,default:void 0},placeholder:{type:String,default:void 0},immediateScroll:{type:Boolean,default:void 0},maxSelectedOptions:{type:Number,default:void 0},createField:{type:Function,default:null},name:{type:[String,Symbol],default:()=>Symbol("fieldText")},modelValue:{type:void 0,default:void 0},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},rules:{type:Array,default:null},autoValidate:{type:String,default:null,validator:e=>!e||["update","blur"].includes(e)},autoValidateWait:{type:Number,default:0},clearValueOnDisabled:{type:Boolean,default:!1}},emits:["update:modelValue","focus","blur"],setup(l,{expose:a,emit:i}){const o=l,r=(0,e.computed)((()=>[o.required&&(e=>(o.multiple&&!e?.length||!o.multiple&&!e)&&"Aquest camp es requerit."),...o.rules||[]].filter((e=>e)))),{errorMessage:d,validate:n,clear:u,destroy:s}=o.createField?o.createField(o.name,(0,e.toRef)(o,"modelValue"),{rules:r,skip:(0,e.toRef)(o,"disabled")}):{errorMessage:(0,e.ref)(null),validate:()=>!0,clear:()=>{},destroy:()=>{}};a({validate:n,clear:u});const p=(0,e.computed)((()=>t(n,o.autoValidateWait)));function c(t){i("update:modelValue",t),"update"===o.autoValidate&&(0,e.nextTick)((()=>p.value()))}function m(e){i("blur",e),"blur"===o.autoValidate&&n()}return(0,e.watch)((()=>o.disabled),(e=>{e&&o.clearValueOnDisabled&&i("update:modelValue",o.multiple?[]:null)})),(0,e.onBeforeUnmount)(s),(t,a)=>{const o=(0,e.resolveComponent)("fura-combo-box-async");return(0,e.openBlock)(),(0,e.createBlock)(o,{label:l.label,description:l.description,borderless:l.borderless,underlined:l.underlined,"get-options":l.getOptions,"get-options-wait":l.getOptionsWait,"filter-options":l.filterOptions,readonly:l.readonly,multiple:l.multiple,"auto-complete":l.autoComplete,"accent-insensitive":l.accentInsensitive,placeholder:l.placeholder,"immediate-scroll":l.immediateScroll,"max-selected-options":l.maxSelectedOptions,"error-message":(0,e.unref)(d),"model-value":l.modelValue,required:l.required,disabled:l.disabled,"onUpdate:modelValue":c,onFocus:a[0]||(a[0]=e=>i("focus",e)),onBlur:m},null,8,["label","description","borderless","underlined","get-options","get-options-wait","filter-options","readonly","multiple","auto-complete","accent-insensitive","placeholder","immediate-scroll","max-selected-options","error-message","model-value","required","disabled"])}}},r={props:{label:{type:String,default:void 0},description:{type:String,default:void 0},invalid:{type:Boolean,default:void 0},borderless:{type:Boolean,default:void 0},underlined:{type:Boolean,default:void 0},readonly:{type:Boolean,default:void 0},placeholder:{type:String,default:void 0},notWritable:{type:Boolean,default:void 0},days:{type:Array,default:void 0},months:{type:Array,default:void 0},goToday:{type:String,default:void 0},firstDayOfTheWeek:{type:Number,default:void 0},today:{type:Date,default:void 0},parse:{type:Function,default:void 0},stringifyFocus:{type:Function,default:void 0},createField:{type:Function,default:null},name:{type:[String,Symbol],default:()=>Symbol("fieldText")},stringify:{type:Function,default:e=>{const t=(e,t=2)=>e.toString().padStart(t,"0");return`${t(e.getDate())}/${t(e.getMonth()+1)}/${t(e.getFullYear(),4)}`}},modelValue:{type:Date,default:null},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},min:{type:Date,default:null},max:{type:Date,default:null},rules:{type:Array,default:null},autoValidate:{type:String,default:null,validator:e=>!e||["update","blur"].includes(e)},autoValidateWait:{type:Number,default:0},clearValueOnDisabled:{type:Boolean,default:!1}},emits:["update:modelValue","focus","blur"],setup(l,{expose:a,emit:i}){const o=l,r=(0,e.computed)((()=>[o.required&&(e=>!e&&"Aquest camp es requerit."),null!==o.min&&(e=>e instanceof Date&&e.getTime()<o.min.getTime()&&`El valor mínim es ${o.stringify(o.min)}.`),null!==o.max&&(e=>e instanceof Date&&e.getTime()>o.max.getTime()&&`El valor màxim es ${o.stringify(o.max)}.`),...o.rules||[]].filter((e=>e)))),{errorMessage:d,validate:n,clear:u,destroy:s}=o.createField?o.createField(o.name,(0,e.toRef)(o,"modelValue"),{rules:r,skip:(0,e.toRef)(o,"disabled")}):{errorMessage:(0,e.ref)(null),validate:()=>!0,clear:()=>{},destroy:()=>{}};a({validate:n,clear:u});const p=(0,e.computed)((()=>t(n,o.autoValidateWait)));function c(t){i("update:modelValue",t),"update"===o.autoValidate&&(0,e.nextTick)((()=>p.value()))}function m(e){i("blur",e),"blur"===o.autoValidate&&n()}return(0,e.watch)((()=>o.disabled),(e=>{e&&o.clearValueOnDisabled&&i("update:modelValue",null)})),(0,e.onBeforeUnmount)(s),(t,a)=>{const o=(0,e.resolveComponent)("fura-date-picker");return(0,e.openBlock)(),(0,e.createBlock)(o,{label:l.label,description:l.description,invalid:l.invalid,borderless:l.borderless,underlined:l.underlined,readonly:l.readonly,placeholder:l.placeholder,"not-writable":l.notWritable,days:l.days,months:l.months,"go-today":l.goToday,"first-day-of-the-week":l.firstDayOfTheWeek,today:l.today,parse:l.parse,stringify:l.stringify,"stringify-focus":l.stringifyFocus,"error-message":(0,e.unref)(d),"model-value":l.modelValue,required:l.required,disabled:l.disabled,"onUpdate:modelValue":c,onFocus:a[0]||(a[0]=e=>i("focus",e)),onBlur:m},null,8,["label","description","invalid","borderless","underlined","readonly","placeholder","not-writable","days","months","go-today","first-day-of-the-week","today","parse","stringify","stringify-focus","error-message","model-value","required","disabled"])}}},d={props:{label:{type:String,default:void 0},description:{type:String,default:void 0},invalid:{type:Boolean,default:void 0},borderless:{type:Boolean,default:void 0},underlined:{type:Boolean,default:void 0},options:{type:Array,required:!0},placeholder:{type:String,default:void 0},readonly:{type:Boolean,default:void 0},multiple:{type:Boolean,default:void 0},immediateScroll:{type:Boolean,default:void 0},maxSelectedOptions:{type:Number,default:void 0},createField:{type:Function,default:null},name:{type:[String,Symbol],default:()=>Symbol("fieldText")},modelValue:{type:void 0,default:void 0},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},rules:{type:Array,default:null},autoValidate:{type:String,default:null,validator:e=>!e||["update","blur"].includes(e)},autoValidateWait:{type:Number,default:0},clearValueOnDisabled:{type:Boolean,default:!1}},emits:["update:modelValue","focus","blur"],setup(l,{expose:a,emit:i}){const o=l,r=(0,e.computed)((()=>[o.required&&(e=>(o.multiple&&!e?.length||!o.multiple&&!e)&&"Aquest camp es requerit."),...o.rules||[]].filter((e=>e)))),{errorMessage:d,validate:n,clear:u,destroy:s}=o.createField?o.createField(o.name,(0,e.toRef)(o,"modelValue"),{rules:r,skip:(0,e.toRef)(o,"disabled")}):{errorMessage:(0,e.ref)(null),validate:()=>!0,clear:()=>{},destroy:()=>{}};a({validate:n,clear:u});const p=(0,e.computed)((()=>t(n,o.autoValidateWait)));function c(t){i("update:modelValue",t),"update"===o.autoValidate&&(0,e.nextTick)((()=>p.value()))}function m(e){i("blur",e),"blur"===o.autoValidate&&n()}return(0,e.watch)((()=>o.disabled),(e=>{e&&o.clearValueOnDisabled&&i("update:modelValue",o.multiple?[]:null)})),(0,e.watch)((()=>o.options),(e=>{if(o.multiple){const t=o.modelValue.filter((t=>e.some((e=>e.value===t))));t.length!==o.modelValue.length&&i("update:modelValue",t)}else e.some((e=>e.value===o.modelValue))||i("update:modelValue",null)})),(0,e.onBeforeUnmount)(s),(t,a)=>{const o=(0,e.resolveComponent)("fura-dropdown");return(0,e.openBlock)(),(0,e.createBlock)(o,{label:l.label,description:l.description,invalid:l.invalid,borderless:l.borderless,underlined:l.underlined,options:l.options,placeholder:l.placeholder,readonly:l.readonly,multiple:l.multiple,"immediate-scroll":l.immediateScroll,"max-selected-options":l.maxSelectedOptions,"error-message":(0,e.unref)(d),"model-value":l.modelValue,required:l.required,disabled:l.disabled,"onUpdate:modelValue":c,onFocus:a[0]||(a[0]=e=>i("focus",e)),onBlur:m},null,8,["label","description","invalid","borderless","underlined","options","placeholder","readonly","multiple","immediate-scroll","max-selected-options","error-message","model-value","required","disabled"])}}},n={props:{label:{type:String,default:void 0},description:{type:String,default:void 0},invalid:{type:Boolean,default:void 0},borderless:{type:Boolean,default:void 0},underlined:{type:Boolean,default:void 0},placeholder:{type:String,default:void 0},prefix:{type:String,default:void 0},suffix:{type:String,default:void 0},multiline:{type:Boolean,default:void 0},icon:{type:String,default:void 0},readonly:{type:Boolean,default:void 0},maxlength:{type:Number,default:void 0},unresizable:{type:Boolean,default:void 0},autoAdjustHeight:{type:Boolean,default:void 0},formatStyle:{type:String,default:void 0},useGrouping:{type:Boolean,default:void 0},minimumIntegerDigits:{type:Number,default:void 0},minimumFractionDigits:{type:Number,default:void 0},maximumFractionDigits:{type:Number,default:void 0},minimumSignificantDigits:{type:Number,default:void 0},maximumSignificantDigits:{type:Number,default:void 0},parse:{type:Function,default:void 0},stringify:{type:Function,default:void 0},stringifyFocus:{type:Function,default:void 0},align:{type:String,default:void 0},alignFocus:{type:String,default:void 0},createField:{type:Function,default:null},name:{type:[String,Symbol],default:()=>Symbol("fieldText")},modelValue:{type:Number,default:null},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},min:{type:Number,default:null},max:{type:Number,default:null},rules:{type:Array,default:null},autoValidate:{type:String,default:null,validator:e=>!e||["update","blur"].includes(e)},autoValidateWait:{type:Number,default:0},clearValueOnDisabled:{type:Boolean,default:!1}},emits:["update:modelValue","click","focus","blur"],setup(l,{expose:a,emit:i}){const o=l,r=(0,e.computed)((()=>[o.required&&(e=>"number"!=typeof e&&"Aquest camp es requerit."),null!==o.min&&(e=>"number"==typeof e&&e<o.min&&`El valor mínim es ${o.min}.`),null!==o.max&&(e=>"number"==typeof e&&e>o.max&&`El valor màxim es ${o.max}.`),...o.rules||[]].filter((e=>e)))),{errorMessage:d,validate:n,clear:u,destroy:s}=o.createField?o.createField(o.name,(0,e.toRef)(o,"modelValue"),{rules:r,skip:(0,e.toRef)(o,"disabled")}):{errorMessage:(0,e.ref)(null),validate:()=>!0,clear:()=>{},destroy:()=>{}};a({validate:n,clear:u});const p=(0,e.computed)((()=>t(n,o.autoValidateWait)));function c(t){i("update:modelValue",t),"update"===o.autoValidate&&(0,e.nextTick)((()=>p.value()))}function m(e){i("blur",e),"blur"===o.autoValidate&&n()}return(0,e.watch)((()=>o.disabled),(e=>{e&&o.clearValueOnDisabled&&i("update:modelValue",null)})),(0,e.onBeforeUnmount)(s),(t,a)=>{const o=(0,e.resolveComponent)("fura-number-field");return(0,e.openBlock)(),(0,e.createBlock)(o,{label:l.label,invalid:l.invalid,borderless:l.borderless,underlined:l.underlined,placeholder:l.placeholder,suffix:l.suffix,multiline:l.multiline,icon:l.icon,readonly:l.readonly,maxlength:l.maxlength,unresizable:l.unresizable,"auto-adjust-height":l.autoAdjustHeight,"format-style":l.formatStyle,"use-grouping":l.useGrouping,"minimum-integer-digits":l.minimumIntegerDigits,"minimum-fraction-digits":l.minimumFractionDigits,"maximum-fraction-digits":l.maximumFractionDigits,"minimum-significant-digits":l.minimumSignificantDigits,"maximum-significant-digits":l.maximumSignificantDigits,parse:l.parse,stringify:l.stringify,"stringify-focus":l.stringifyFocus,align:l.align,"align-focus":l.alignFocus,"error-message":(0,e.unref)(d),"model-value":l.modelValue,required:l.required,disabled:l.disabled,"onUpdate:modelValue":c,onClick:a[0]||(a[0]=e=>i("click",e)),onFocus:a[1]||(a[1]=e=>i("focus",e)),onBlur:m},null,8,["label","invalid","borderless","underlined","placeholder","suffix","multiline","icon","readonly","maxlength","unresizable","auto-adjust-height","format-style","use-grouping","minimum-integer-digits","minimum-fraction-digits","maximum-fraction-digits","minimum-significant-digits","maximum-significant-digits","parse","stringify","stringify-focus","align","align-focus","error-message","model-value","required","disabled"])}}},u={props:{label:{type:String,default:void 0},description:{type:String,default:void 0},invalid:{type:Boolean,default:void 0},borderless:{type:Boolean,default:void 0},underlined:{type:Boolean,default:void 0},step:{type:Number,default:void 0},inc:{type:Function,default:void 0},dec:{type:Function,default:void 0},parse:{type:Function,default:void 0},stringify:{type:Function,default:void 0},createField:{type:Function,default:null},name:{type:[String,Symbol],default:()=>Symbol("fieldText")},modelValue:{type:Number,default:null},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},min:{type:Number,default:null},max:{type:Number,default:null},rules:{type:Array,default:null},autoValidate:{type:String,default:null,validator:e=>!e||["update","blur"].includes(e)},autoValidateWait:{type:Number,default:0},clearValueOnDisabled:{type:Boolean,default:!1}},emits:["update:modelValue","focus","blur"],setup(l,{expose:a,emit:i}){const o=l,r=(0,e.computed)((()=>[o.required&&(e=>"number"!=typeof e&&"Aquest camp es requerit."),null!==o.min&&(e=>"number"==typeof e&&e<o.min&&`El valor mínim es ${o.min}.`),null!==o.max&&(e=>"number"==typeof e&&e>o.max&&`El valor màxim es ${o.max}.`),...o.rules||[]].filter((e=>e)))),{errorMessage:d,validate:n,clear:u,destroy:s}=o.createField?o.createField(o.name,(0,e.toRef)(o,"modelValue"),{rules:r,skip:(0,e.toRef)(o,"disabled")}):{errorMessage:(0,e.ref)(null),validate:()=>!0,clear:()=>{},destroy:()=>{}};a({validate:n,clear:u});const p=(0,e.computed)((()=>t(n,o.autoValidateWait)));function c(t){i("update:modelValue",t),"update"===o.autoValidate&&(0,e.nextTick)((()=>p.value()))}function m(e){i("blur",e),"blur"===o.autoValidate&&n()}return(0,e.watch)((()=>o.disabled),(e=>{e&&o.clearValueOnDisabled&&i("update:modelValue",null)})),(0,e.onBeforeUnmount)(s),(t,a)=>{const o=(0,e.resolveComponent)("fura-spin-button");return(0,e.openBlock)(),(0,e.createBlock)(o,{label:l.label,description:l.description,invalid:l.invalid,borderless:l.borderless,underlined:l.underlined,step:l.step,inc:l.inc,dec:l.dec,parse:l.parse,stringify:l.stringify,"error-message":(0,e.unref)(d),"model-value":l.modelValue,required:l.required,disabled:l.disabled,"onUpdate:modelValue":c,onFocus:a[0]||(a[0]=e=>i("focus",e)),onBlur:m},null,8,["label","description","invalid","borderless","underlined","step","inc","dec","parse","stringify","error-message","model-value","required","disabled"])}}},s={props:{label:{type:String,default:void 0},description:{type:String,default:void 0},invalid:{type:Boolean,default:void 0},borderless:{type:Boolean,default:void 0},underlined:{type:Boolean,default:void 0},readonly:{type:Boolean,default:void 0},getItems:{type:Function,required:!0},getItemsWait:{type:Number,default:void 0},filterItems:{type:Boolean,default:void 0},autoComplete:{type:Boolean,default:void 0},accentInsensitive:{type:Boolean,default:void 0},maxSelectedItems:{type:Number,default:void 0},placeholder:{type:String,default:void 0},loadingText:{type:String,default:void 0},immediateScroll:{type:Boolean,default:void 0},createField:{type:Function,default:null},name:{type:[String,Symbol],default:()=>Symbol("fieldText")},modelValue:{type:Array,default:()=>[]},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},rules:{type:Array,default:null},autoValidate:{type:String,default:null,validator:e=>!e||["update","blur"].includes(e)},autoValidateWait:{type:Number,default:0},clearValueOnDisabled:{type:Boolean,default:!1}},emits:["update:modelValue","focus","blur"],setup(l,{expose:a,emit:i}){const o=l,r=(0,e.computed)((()=>[o.required&&(e=>!e?.length&&"Aquest camp es requerit."),...o.rules||[]].filter((e=>e)))),{errorMessage:d,validate:n,clear:u,destroy:s}=o.createField?o.createField(o.name,(0,e.toRef)(o,"modelValue"),{rules:r,skip:(0,e.toRef)(o,"disabled")}):{errorMessage:(0,e.ref)(null),validate:()=>!0,clear:()=>{},destroy:()=>{}};a({validate:n,clear:u});const p=(0,e.computed)((()=>t(n,o.autoValidateWait)));function c(t){i("update:modelValue",t),"update"===o.autoValidate&&(0,e.nextTick)((()=>p.value()))}function m(e){i("blur",e),"blur"===o.autoValidate&&n()}return(0,e.watch)((()=>o.disabled),(e=>{e&&o.clearValueOnDisabled&&i("update:modelValue",[])})),(0,e.onBeforeUnmount)(s),(t,a)=>{const o=(0,e.resolveComponent)("fura-tag-picker");return(0,e.openBlock)(),(0,e.createBlock)(o,{label:l.label,description:l.description,invalid:l.invalid,borderless:l.borderless,underlined:l.underlined,readonly:l.readonly,"get-items":l.getItems,"get-items-wait":l.getItemsWait,"filter-items":l.filterItems,"auto-complete":l.autoComplete,"accent-insensitive":l.accentInsensitive,"max-selected-items":l.maxSelectedItems,placeholder:l.placeholder,"loading-text":l.loadingText,"immediate-scroll":l.immediateScroll,"error-message":(0,e.unref)(d),"model-value":l.modelValue,required:l.required,disabled:l.disabled,"onUpdate:modelValue":c,onFocus:a[0]||(a[0]=e=>i("focus",e)),onBlur:m},null,8,["label","description","invalid","borderless","underlined","readonly","get-items","get-items-wait","filter-items","auto-complete","accent-insensitive","max-selected-items","placeholder","loading-text","immediate-scroll","error-message","model-value","required","disabled"])}}},p={props:{label:{type:String,default:void 0},description:{type:String,default:void 0},invalid:{type:Boolean,default:void 0},borderless:{type:Boolean,default:void 0},underlined:{type:Boolean,default:void 0},placeholder:{type:String,default:void 0},prefix:{type:String,default:void 0},suffix:{type:String,default:void 0},multiline:{type:Boolean,default:void 0},icon:{type:String,default:void 0},readonly:{type:Boolean,default:void 0},unresizable:{type:Boolean,default:void 0},autoAdjustHeight:{type:Boolean,default:void 0},password:{type:Boolean,default:void 0},createField:{type:Function,default:null},name:{type:[String,Symbol],default:()=>Symbol("fieldText")},modelValue:{type:String,default:null},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},maxlength:{type:Number,default:null},pattern:{type:RegExp,default:null},rules:{type:Array,default:null},autoValidate:{type:String,default:null,validator:e=>!e||["update","blur"].includes(e)},autoValidateWait:{type:Number,default:0},clearValueOnDisabled:{type:Boolean,default:!1}},emits:["update:modelValue","click","focus","blur","keydown"],setup(l,{expose:a,emit:i}){const o=l,r=(0,e.computed)((()=>[o.required&&(e=>!e&&"Aquest camp es requerit."),null!==o.maxlength&&(e=>e?.length>o.maxlength&&`La longitud màxima es de ${o.maxlength} caracters.`),null!==o.pattern&&(e=>!!e&&!e?.match(o.pattern)&&"El valor del text no compleix el patró especificat."),...o.rules||[]].filter((e=>e)))),{errorMessage:d,validate:n,clear:u,destroy:s}=o.createField?o.createField(o.name,(0,e.toRef)(o,"modelValue"),{rules:r,skip:(0,e.toRef)(o,"disabled")}):{errorMessage:(0,e.ref)(null),validate:()=>!0,clear:()=>{},destroy:()=>{}};a({validate:n,clear:u});const p=(0,e.computed)((()=>t(n,o.autoValidateWait)));function c(t){i("update:modelValue",t),"update"===o.autoValidate&&(0,e.nextTick)((()=>p.value()))}function m(e){i("blur",e),"blur"===o.autoValidate&&n()}return(0,e.watch)((()=>o.disabled),(e=>{e&&o.clearValueOnDisabled&&i("update:modelValue",null)})),(0,e.onBeforeUnmount)(s),(t,a)=>{const o=(0,e.resolveComponent)("fura-text-field");return(0,e.openBlock)(),(0,e.createBlock)(o,{label:l.label,description:l.description,invalid:l.invalid,borderless:l.borderless,underlined:l.underlined,placeholder:l.placeholder,prefix:l.prefix,suffix:l.suffix,multiline:l.multiline,icon:l.icon,readonly:l.readonly,maxlength:l.maxlength,unresizable:l.unresizable,"auto-adjust-height":l.autoAdjustHeight,password:l.password,"error-message":(0,e.unref)(d),"model-value":l.modelValue,required:l.required,disabled:l.disabled,"onUpdate:modelValue":c,onClick:a[0]||(a[0]=e=>i("click",e)),onFocus:a[1]||(a[1]=e=>i("focus",e)),onBlur:m,onKeydown:a[2]||(a[2]=e=>i("keydown",e))},null,8,["label","description","invalid","borderless","underlined","placeholder","prefix","suffix","multiline","icon","readonly","maxlength","unresizable","auto-adjust-height","password","error-message","model-value","required","disabled"])}}},c={key:0,class:"stackDraggable-item"},m={class:"stackDraggable-content"},f=["onDragstart"],y={class:"stackDraggable-handler"},v={key:1,class:"stackDraggable-item"},g={class:"stackDraggable-content"},b={props:{name:{type:String,default:()=>String(Math.random()).replace("0.","")},primaryKey:{type:String,required:!0},modelValue:{type:Array,required:!0},handlerPosition:{type:String,default:"center",validate:e=>!e||["top","center","bottom"].includes(e)}},emits:["update:modelValue"],setup(t,{emit:l}){const a=t,i="text/llesca-stack-draggable-key/",o=(0,e.useSlots)(),r=(0,e.ref)([]),d=(0,e.computed)((()=>o.header&&-1!==o.header().findIndex((t=>t.type!==e.Comment)))),n=(0,e.computed)((()=>o.footer&&-1!==o.footer().findIndex((t=>t.type!==e.Comment))));function u(e){e.dataTransfer.types.includes(i+a.name)&&e.preventDefault()}function s(e){const t=e.dataTransfer.getData(i+a.name),o=a.modelValue.findIndex((e=>e[a.primaryKey]===t)),d=r.value.filter((e=>e.el)).reduce(((t,l)=>l.el.getBoundingClientRect().bottom>e.pageY&&l.index<t?l.index:t),r.value.length);var n,u,s;l("update:modelValue",(n=a.modelValue,(u=o)===(s=d)?n:u>s?[...n.slice(0,s),n[u],...n.slice(s,u),...n.slice(u+1)]:[...n.slice(0,u),...n.slice(u+1,s+1),n[u],...n.slice(s+1)]))}return(0,e.onBeforeUpdate)((()=>{r.value=[]})),(l,o)=>{const p=(0,e.resolveComponent)("fura-icon");return(0,e.openBlock)(),(0,e.createElementBlock)("div",{onDragover:u,onDrop:s},[(0,e.unref)(d)?((0,e.openBlock)(),(0,e.createElementBlock)("div",c,[(0,e.createVNode)(p,{class:"stackDraggable-dragIcon"}),(0,e.createElementVNode)("div",m,[(0,e.renderSlot)(l.$slots,"header")])])):(0,e.createCommentVNode)("v-if",!0),((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(t.modelValue,((d,n)=>((0,e.openBlock)(),(0,e.createElementBlock)("div",{key:d[t.primaryKey],ref_for:!0,ref:e=>r.value.push({item:d,index:n,el:e}),draggable:"true",class:"stackDraggable-item",onDragstart:(0,e.withModifiers)((e=>{return l=e,o=d[t.primaryKey],l.dataTransfer.effectAllowed="move",l.dataTransfer.droptAllowed="move",void l.dataTransfer.setData(i+a.name,o);var l,o}),["stop"])},[(0,e.createElementVNode)("div",y,[(0,e.createElementVNode)("div",{class:(0,e.normalizeClass)(["stackDraggable-cover",{"stackDraggable-hide":"top"===t.handlerPosition}]),draggable:"true",onDragstart:o[0]||(o[0]=(0,e.withModifiers)((()=>{}),["stop","prevent"]))},null,34),(0,e.createVNode)(p,{class:"stackDraggable-dragIcon",name:"GripperDotsVertical"}),(0,e.createElementVNode)("div",{class:(0,e.normalizeClass)(["stackDraggable-cover",{"stackDraggable-hide":"bottom"===t.handlerPosition}]),draggable:"true",onDragstart:o[1]||(o[1]=(0,e.withModifiers)((()=>{}),["stop","prevent"]))},null,34)]),(0,e.createElementVNode)("div",{class:"stackDraggable-content",draggable:"true",onDragstart:o[2]||(o[2]=(0,e.withModifiers)((()=>{}),["stop","prevent"]))},[(0,e.renderSlot)(l.$slots,"default",{item:d,key:n[t.primaryKey],index:n})],32)],40,f)))),128)),(0,e.unref)(n)?((0,e.openBlock)(),(0,e.createElementBlock)("div",v,[(0,e.createVNode)(p,{class:"stackDraggable-dragIcon"}),(0,e.createElementVNode)("div",g,[(0,e.renderSlot)(l.$slots,"footer")])])):(0,e.createCommentVNode)("v-if",!0)],32)}}},h=(0,a(407).Z)(b,[["__scopeId","data-v-3d8db5ed"]]),V=Symbol("internalState");function x(e,t){const l=e[V];if(e instanceof w){for(const t in e)e[t]=void 0;if("object"==typeof t)for(const l in t)e[l]=t[l];return!0}if(e instanceof B){const a=l.newEntities.splice(0,l.newEntities.length);for(const e of a)e[V].scope.stop();l.deletedIndices.clear();for(let e=0;e<l.storedEntities.length;e+=1)l.deletedIndices.add(e);if(Array.isArray(t)){const{primaryKey:a}=l.definition,i=Array.from(t);for(let e=0;e<l.storedEntities.length;e+=1){const t=l.storedEntities.value[e],o=t[a],r=i.findIndex((e=>e[a]===o));if(r>-1){const[a]=i.splice(r,1);x(t,a),l.deletedIndices.delete(e)}}for(const t of i)e.add(t)}return!0}return!1}function B(t,{scope:l=(0,e.getCurrentScope)(),root:a,parent:i}={}){const o=new Proxy(l.run((()=>{const r=(0,e.reactive)([]),d=(0,e.reactive)([]),n=(0,e.reactive)(new Set),u=(0,e.computed)((()=>r.filter(((e,t)=>!n.has(t))))),s=(0,e.computed)((()=>u.value.concat(d)));return{scope:l,definition:t,storedEntities:r,newEntities:d,deletedIndices:n,remainingEntities:u,entities:s,root:a??o,parent:i}})),S);return o}const S={get(e,t,l){if("string"==typeof t){if(t in e.entities.value)return e.entities.value[t];if(t in k)return k[t].bind(null,e,l)}return t===V?e:"__v_skip"===t||void 0},set:(e,t,l,a)=>"object"==typeof l&&"length"!==t&&t in e.entities.value&&x(e.entities.value[t],l),has:(e,t)=>Reflect.has(e.entities.value,t),ownKeys:e=>Reflect.ownKeys(e.entities.value),getOwnPropertyDescriptor:(e,t)=>Reflect.getOwnPropertyDescriptor(e.entities.value,t),getPrototypeOf:e=>B.prototype},k={create:(e,t)=>w(e.definition,{scope:e.scope,root:e.root,parent:t}),add(e,t,l){if(l instanceof w&&l[V].root===e.root)return e.newEntities.push(l),l;const a=w(e.definition,{scope:e.scope,root:e.root,parent:t});return x(a,l),e.newEntities.push(a),a},delete(e,t,l){if("length"!==l&&l in e.entities.value){const t=Number(l);if(t<e.remainingEntities.value.length){const l=e.remainingEntities.value[t],a=e.storedEntities.indexOf(l);e.deletedIndices.add(a)}else{const l=t-e.remainingEntities.value.length,[a]=e.newEntities.splice(l,1);a[V].scope.stop()}}},[Symbol.species]:(e,t)=>Array,[Symbol.iterator]:(e,t)=>e.entities.value.value(),at:(e,t,l)=>e.entities.value.at(l),concat:(e,t,...l)=>e.entities.value.concat(...l),copyWithin(){throw new Error("'copyWithin' method is not available.")},entries:(e,t)=>e.entities.value.entries(),every:(e,t,l,a)=>e.entities.value.every(l,a),fill(){throw new Error("'copyWithin' method is not available.")},filter:(e,t,l,a)=>e.entities.value.filter(l,a),find:(e,t,l,a)=>e.entities.value.find(l,a),findIndex:(e,t,l,a)=>e.entities.value.findIndex(l,a),findLast:(e,t,l,a)=>e.entities.value.findLast(l,a),findLastIndex:(e,t,l,a)=>e.entities.value.findLastIndex(l,a),flat(e,t,l=1){throw new Error("'flat' method is not implemented yet.")},flatMap(e,t,l,a){throw new Error("'flatMap' method is not implemented yet.")},forEach:(e,t,l,a)=>e.entities.value.forEach(l,a),includes:(e,t,l,a)=>e.entities.value.includes(l,a),indexOf:(e,t,l,a)=>e.entities.value.indexOf(l,a),join(e,t,l=","){throw new Error("'join' method is not implemented yet.")},keys:(e,t)=>e.entities.value.keys(),lastIndexOf:(e,t,l,a)=>e.entities.value.lastIndexOf(l,a),map:(e,t,l,a)=>e.entities.value.map(l,a),pop(e,t){throw new Error("'pop' method is not implemented yet.")},push(e,t,...l){throw new Error("'push' method is not implemented yet.")},reduce:(e,t,l,a)=>e.entities.value.reduce(l,a),reduceRight:(e,t,l,a)=>e.entities.value.reduceRight(l,a),reverse(){throw new Error("'reverse' method is not available.")},shift(){throw new Error("'shift' method is not available.")},slice:(e,t,l,a)=>e.entities.value.slice(l,a),some:(e,t,l,a)=>e.entities.value.some(l,a),sort(){throw new Error("'sort' method is not available.")},splice(){throw new Error("'splice' method is not available.")},toLocaleString(){throw new Error("'toLocaleString' method is not implemented yet.")},toString(){throw new Error("'toString' method is not implemented yet.")},unshift(){throw new Error("'unshift' method is not implemented yet.")},values:(e,t)=>e.entities.value.values()};function w(t,{scope:l=(0,e.getCurrentScope)(),root:a,parent:i,base:o}={}){const r=(0,e.effectScope)(),d=new Proxy(l.run((()=>r.run((()=>({scope:r,definition:t,storedProperties:(0,e.reactive)({}),changedProperties:(0,e.reactive)({}),properties:{},details:Object.fromEntries((t.details||[]).map((t=>[t.navigationKey||t.entityName,(0,e.ref)()]))),children:null,root:a,parent:i,base:o}))))),F);return d[V].root=a??d,d[V].children=Object.fromEntries((t.children||[]).map((e=>[e.navigationKey||e.entityName,B(e,{scope:r,root:a??d,parent:d})]))),d}const F={get(e,t,l){if("string"==typeof t){if(t in e.properties)return e.properties[t].value;if(t in e.details)return e.details[t].value;if(t in e.children)return e.children[t]}return t===V?e:"__v_skip"===t||void 0},set:(e,t,l,a)=>t in e.details?(e.details[t].value=l,!0):t in e.children?x(e.children[t],l):(e.storedProperties[t]===l?delete e.changedProperties[t]:e.changedProperties[t]=l,t in e.properties||F.defineProperty(e,t,{value:l})),defineProperty:(t,l,a)=>!(l in t.properties||l in t.details||l in t.children||(t.properties[l]=t.scope.run((()=>(0,e.computed)({get:()=>t.changedProperties[l]??t.storedProperties[l],set(e){t.storedProperties[l]===e?delete t.changedProperties[l]:t.changedProperties[l]=e}}))),t.properties[l].value=a.value,0)),has:(e,t)=>t in e.properties||t in e.details||t in e.children,ownKeys:e=>Object.keys(e.properties).concat(Object.keys(e.details)).concat(Object.keys(e.children)),getOwnPropertyDescriptor(e,t){if(t in e.properties||t in e.details||t in e.children)return{configurable:!0,enumerable:!0}},getPrototypeOf:e=>w.prototype};Error,Error;const D={FieldCombo:l,FieldComboAsync:o,FieldDate:r,FieldDropdown:d,FieldNumber:n,FieldNumberSpin:u,FieldTag:s,FieldText:p,StackDraggable:h},q={install:function(e,{prefix:t="llesca"}={}){for(const t in D){const l=t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase();e.component("llesca-"+l,D[t])}},Llesca:D,version:"0.3.1"}})(),i.default})()));