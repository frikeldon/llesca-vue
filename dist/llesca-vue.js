!function(e,l){"object"==typeof exports&&"object"==typeof module?module.exports=l(require("Vue")):"function"==typeof define&&define.amd?define(["Vue"],l):"object"==typeof exports?exports.llescaVue=l(require("Vue")):e.llescaVue=l(e.Vue)}(self,(e=>(()=>{"use strict";var l={407:(e,l)=>{l.Z=(e,l)=>{const t=e.__vccOpts||e;for(const[e,a]of l)t[e]=a;return t}},740:l=>{l.exports=e}},t={};function a(e){var o=t[e];if(void 0!==o)return o.exports;var i=t[e]={exports:{}};return l[e](i,i.exports,a),i.exports}a.d=(e,l)=>{for(var t in l)a.o(l,t)&&!a.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:l[t]})},a.o=(e,l)=>Object.prototype.hasOwnProperty.call(e,l);var o={};return(()=>{a.d(o,{default:()=>x});var e=a(740);function l(e,l,t){let a;return l?(...o)=>{clearTimeout(a),a=setTimeout((()=>{a=null,e.apply(t,o)}),l)}:e}const t={props:{label:{type:String,default:void 0},description:{type:String,default:void 0},invalid:{type:Boolean,default:void 0},borderless:{type:Boolean,default:void 0},underlined:{type:Boolean,default:void 0},options:{type:Array,required:!0},readonly:{type:Boolean,default:void 0},multiple:{type:Boolean,default:void 0},allowFreeform:{type:Boolean,default:void 0},autoComplete:{type:Boolean,default:void 0},accentInsensitive:{type:Boolean,default:void 0},placeholder:{type:String,default:void 0},immediateScroll:{type:Boolean,default:void 0},maxSelectedOptions:{type:Number,default:void 0},createField:{type:Function,default:null},name:{type:[String,Symbol],default:()=>Symbol("fieldText")},modelValue:{type:void 0,default:void 0},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},rules:{type:Array,default:null},autoValidate:{type:String,default:null,validator:e=>!e||["update","blur"].includes(e)},autoValidateWait:{type:Number,default:0},clearValueOnDisabled:{type:Boolean,default:!1}},emits:["update:modelValue","focus","blur"],setup(t,{expose:a,emit:o}){const i=t,d=(0,e.computed)((()=>[i.required&&(e=>(i.multiple&&!e?.length||!i.multiple&&!e)&&"Aquest camp es requerit."),...i.rules||[]].filter((e=>e)))),{errorMessage:r,validate:n,clear:u,destroy:s}=i.createField?i.createField(i.name,(0,e.toRef)(i,"modelValue"),{rules:d,skip:(0,e.toRef)(i,"disabled")}):{errorMessage:(0,e.ref)(null),validate:()=>!0,clear:()=>{},destroy:()=>{}};a({validate:n,clear:u});const p=(0,e.computed)((()=>l(n,i.autoValidateWait)));function m(l){o("update:modelValue",l),"update"===i.autoValidate&&(0,e.nextTick)((()=>p.value()))}function c(e){o("blur",e),"blur"===i.autoValidate&&n()}return(0,e.watch)((()=>i.disabled),(e=>{e&&i.clearValueOnDisabled&&o("update:modelValue",i.multiple?[]:null)})),(0,e.watch)((()=>i.options),(e=>{if(i.multiple){const l=i.modelValue.filter((l=>e.some((e=>e.value===l))));l.length!==i.modelValue.length&&o("update:modelValue",l)}else e.some((e=>e.value===i.modelValue))||o("update:modelValue",null)})),(0,e.onBeforeUnmount)(s),(l,a)=>{const i=(0,e.resolveComponent)("fura-combo-box");return(0,e.openBlock)(),(0,e.createBlock)(i,{label:t.label,description:t.description,invalid:t.invalid,borderless:t.borderless,underlined:t.underlined,options:t.options,readonly:t.readonly,multiple:t.multiple,"allow-freeform":t.allowFreeform,"auto-complete":t.autoComplete,"accent-insensitive":t.accentInsensitive,placeholder:t.placeholder,"immediate-scroll":t.immediateScroll,"max-selected-options":t.maxSelectedOptions,"error-message":(0,e.unref)(r),"model-value":t.modelValue,required:t.required,disabled:t.disabled,"onUpdate:modelValue":m,onFocus:a[0]||(a[0]=e=>o("focus",e)),onBlur:c},null,8,["label","description","invalid","borderless","underlined","options","readonly","multiple","allow-freeform","auto-complete","accent-insensitive","placeholder","immediate-scroll","max-selected-options","error-message","model-value","required","disabled"])}}},i={props:{label:{type:String,default:void 0},description:{type:String,default:void 0},invalid:{type:Boolean,default:!1},borderless:{type:Boolean,default:void 0},underlined:{type:Boolean,default:void 0},getOptions:{type:Function,required:!0},getOptionsWait:{type:Number,default:void 0},filterOptions:{type:Boolean,default:void 0},readonly:{type:Boolean,default:void 0},multiple:{type:Boolean,default:void 0},autoComplete:{type:Boolean,default:void 0},accentInsensitive:{type:Boolean,default:void 0},placeholder:{type:String,default:void 0},immediateScroll:{type:Boolean,default:void 0},maxSelectedOptions:{type:Number,default:void 0},createField:{type:Function,default:null},name:{type:[String,Symbol],default:()=>Symbol("fieldText")},modelValue:{type:void 0,default:void 0},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},rules:{type:Array,default:null},autoValidate:{type:String,default:null,validator:e=>!e||["update","blur"].includes(e)},autoValidateWait:{type:Number,default:0},clearValueOnDisabled:{type:Boolean,default:!1}},emits:["update:modelValue","focus","blur"],setup(t,{expose:a,emit:o}){const i=t,d=(0,e.computed)((()=>[i.required&&(e=>(i.multiple&&!e?.length||!i.multiple&&!e)&&"Aquest camp es requerit."),...i.rules||[]].filter((e=>e)))),{errorMessage:r,validate:n,clear:u,destroy:s}=i.createField?i.createField(i.name,(0,e.toRef)(i,"modelValue"),{rules:d,skip:(0,e.toRef)(i,"disabled")}):{errorMessage:(0,e.ref)(null),validate:()=>!0,clear:()=>{},destroy:()=>{}};a({validate:n,clear:u});const p=(0,e.computed)((()=>l(n,i.autoValidateWait)));function m(l){o("update:modelValue",l),"update"===i.autoValidate&&(0,e.nextTick)((()=>p.value()))}function c(e){o("blur",e),"blur"===i.autoValidate&&n()}return(0,e.watch)((()=>i.disabled),(e=>{e&&i.clearValueOnDisabled&&o("update:modelValue",i.multiple?[]:null)})),(0,e.onBeforeUnmount)(s),(l,a)=>{const i=(0,e.resolveComponent)("fura-combo-box-async");return(0,e.openBlock)(),(0,e.createBlock)(i,{label:t.label,description:t.description,borderless:t.borderless,underlined:t.underlined,"get-options":t.getOptions,"get-options-wait":t.getOptionsWait,"filter-options":t.filterOptions,readonly:t.readonly,multiple:t.multiple,"auto-complete":t.autoComplete,"accent-insensitive":t.accentInsensitive,placeholder:t.placeholder,"immediate-scroll":t.immediateScroll,"max-selected-options":t.maxSelectedOptions,"error-message":(0,e.unref)(r),"model-value":t.modelValue,required:t.required,disabled:t.disabled,"onUpdate:modelValue":m,onFocus:a[0]||(a[0]=e=>o("focus",e)),onBlur:c},null,8,["label","description","borderless","underlined","get-options","get-options-wait","filter-options","readonly","multiple","auto-complete","accent-insensitive","placeholder","immediate-scroll","max-selected-options","error-message","model-value","required","disabled"])}}},d={props:{label:{type:String,default:void 0},description:{type:String,default:void 0},invalid:{type:Boolean,default:void 0},borderless:{type:Boolean,default:void 0},underlined:{type:Boolean,default:void 0},readonly:{type:Boolean,default:void 0},placeholder:{type:String,default:void 0},notWritable:{type:Boolean,default:void 0},days:{type:Array,default:void 0},months:{type:Array,default:void 0},goToday:{type:String,default:void 0},firstDayOfTheWeek:{type:Number,default:void 0},today:{type:Date,default:void 0},parse:{type:Function,default:void 0},stringifyFocus:{type:Function,default:void 0},createField:{type:Function,default:null},name:{type:[String,Symbol],default:()=>Symbol("fieldText")},stringify:{type:Function,default:e=>{const l=(e,l=2)=>e.toString().padStart(l,"0");return`${l(e.getDate())}/${l(e.getMonth()+1)}/${l(e.getFullYear(),4)}`}},modelValue:{type:Date,default:null},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},min:{type:Date,default:null},max:{type:Date,default:null},rules:{type:Array,default:null},autoValidate:{type:String,default:null,validator:e=>!e||["update","blur"].includes(e)},autoValidateWait:{type:Number,default:0},clearValueOnDisabled:{type:Boolean,default:!1}},emits:["update:modelValue","focus","blur"],setup(t,{expose:a,emit:o}){const i=t,d=(0,e.computed)((()=>[i.required&&(e=>!e&&"Aquest camp es requerit."),null!==i.min&&(e=>e instanceof Date&&e.getTime()<i.min.getTime()&&`El valor mínim es ${i.stringify(i.min)}.`),null!==i.max&&(e=>e instanceof Date&&e.getTime()>i.max.getTime()&&`El valor màxim es ${i.stringify(i.max)}.`),...i.rules||[]].filter((e=>e)))),{errorMessage:r,validate:n,clear:u,destroy:s}=i.createField?i.createField(i.name,(0,e.toRef)(i,"modelValue"),{rules:d,skip:(0,e.toRef)(i,"disabled")}):{errorMessage:(0,e.ref)(null),validate:()=>!0,clear:()=>{},destroy:()=>{}};a({validate:n,clear:u});const p=(0,e.computed)((()=>l(n,i.autoValidateWait)));function m(l){o("update:modelValue",l),"update"===i.autoValidate&&(0,e.nextTick)((()=>p.value()))}function c(e){o("blur",e),"blur"===i.autoValidate&&n()}return(0,e.watch)((()=>i.disabled),(e=>{e&&i.clearValueOnDisabled&&o("update:modelValue",null)})),(0,e.onBeforeUnmount)(s),(l,a)=>{const i=(0,e.resolveComponent)("fura-date-picker");return(0,e.openBlock)(),(0,e.createBlock)(i,{label:t.label,description:t.description,invalid:t.invalid,borderless:t.borderless,underlined:t.underlined,readonly:t.readonly,placeholder:t.placeholder,"not-writable":t.notWritable,days:t.days,months:t.months,"go-today":t.goToday,"first-day-of-the-week":t.firstDayOfTheWeek,today:t.today,parse:t.parse,stringify:t.stringify,"stringify-focus":t.stringifyFocus,"error-message":(0,e.unref)(r),"model-value":t.modelValue,required:t.required,disabled:t.disabled,"onUpdate:modelValue":m,onFocus:a[0]||(a[0]=e=>o("focus",e)),onBlur:c},null,8,["label","description","invalid","borderless","underlined","readonly","placeholder","not-writable","days","months","go-today","first-day-of-the-week","today","parse","stringify","stringify-focus","error-message","model-value","required","disabled"])}}},r={props:{label:{type:String,default:void 0},description:{type:String,default:void 0},invalid:{type:Boolean,default:void 0},borderless:{type:Boolean,default:void 0},underlined:{type:Boolean,default:void 0},options:{type:Array,required:!0},placeholder:{type:String,default:void 0},readonly:{type:Boolean,default:void 0},multiple:{type:Boolean,default:void 0},immediateScroll:{type:Boolean,default:void 0},maxSelectedOptions:{type:Number,default:void 0},createField:{type:Function,default:null},name:{type:[String,Symbol],default:()=>Symbol("fieldText")},modelValue:{type:void 0,default:void 0},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},rules:{type:Array,default:null},autoValidate:{type:String,default:null,validator:e=>!e||["update","blur"].includes(e)},autoValidateWait:{type:Number,default:0},clearValueOnDisabled:{type:Boolean,default:!1}},emits:["update:modelValue","focus","blur"],setup(t,{expose:a,emit:o}){const i=t,d=(0,e.computed)((()=>[i.required&&(e=>(i.multiple&&!e?.length||!i.multiple&&!e)&&"Aquest camp es requerit."),...i.rules||[]].filter((e=>e)))),{errorMessage:r,validate:n,clear:u,destroy:s}=i.createField?i.createField(i.name,(0,e.toRef)(i,"modelValue"),{rules:d,skip:(0,e.toRef)(i,"disabled")}):{errorMessage:(0,e.ref)(null),validate:()=>!0,clear:()=>{},destroy:()=>{}};a({validate:n,clear:u});const p=(0,e.computed)((()=>l(n,i.autoValidateWait)));function m(l){o("update:modelValue",l),"update"===i.autoValidate&&(0,e.nextTick)((()=>p.value()))}function c(e){o("blur",e),"blur"===i.autoValidate&&n()}return(0,e.watch)((()=>i.disabled),(e=>{e&&i.clearValueOnDisabled&&o("update:modelValue",i.multiple?[]:null)})),(0,e.watch)((()=>i.options),(e=>{if(i.multiple){const l=i.modelValue.filter((l=>e.some((e=>e.value===l))));l.length!==i.modelValue.length&&o("update:modelValue",l)}else e.some((e=>e.value===i.modelValue))||o("update:modelValue",null)})),(0,e.onBeforeUnmount)(s),(l,a)=>{const i=(0,e.resolveComponent)("fura-dropdown");return(0,e.openBlock)(),(0,e.createBlock)(i,{label:t.label,description:t.description,invalid:t.invalid,borderless:t.borderless,underlined:t.underlined,options:t.options,placeholder:t.placeholder,readonly:t.readonly,multiple:t.multiple,"immediate-scroll":t.immediateScroll,"max-selected-options":t.maxSelectedOptions,"error-message":(0,e.unref)(r),"model-value":t.modelValue,required:t.required,disabled:t.disabled,"onUpdate:modelValue":m,onFocus:a[0]||(a[0]=e=>o("focus",e)),onBlur:c},null,8,["label","description","invalid","borderless","underlined","options","placeholder","readonly","multiple","immediate-scroll","max-selected-options","error-message","model-value","required","disabled"])}}},n={props:{label:{type:String,default:void 0},description:{type:String,default:void 0},invalid:{type:Boolean,default:void 0},borderless:{type:Boolean,default:void 0},underlined:{type:Boolean,default:void 0},placeholder:{type:String,default:void 0},prefix:{type:String,default:void 0},suffix:{type:String,default:void 0},multiline:{type:Boolean,default:void 0},icon:{type:String,default:void 0},readonly:{type:Boolean,default:void 0},maxlength:{type:Number,default:void 0},unresizable:{type:Boolean,default:void 0},autoAdjustHeight:{type:Boolean,default:void 0},formatStyle:{type:String,default:void 0},useGrouping:{type:Boolean,default:void 0},minimumIntegerDigits:{type:Number,default:void 0},minimumFractionDigits:{type:Number,default:void 0},maximumFractionDigits:{type:Number,default:void 0},minimumSignificantDigits:{type:Number,default:void 0},maximumSignificantDigits:{type:Number,default:void 0},parse:{type:Function,default:void 0},stringify:{type:Function,default:void 0},stringifyFocus:{type:Function,default:void 0},align:{type:String,default:void 0},alignFocus:{type:String,default:void 0},createField:{type:Function,default:null},name:{type:[String,Symbol],default:()=>Symbol("fieldText")},modelValue:{type:Number,default:null},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},min:{type:Number,default:null},max:{type:Number,default:null},rules:{type:Array,default:null},autoValidate:{type:String,default:null,validator:e=>!e||["update","blur"].includes(e)},autoValidateWait:{type:Number,default:0},clearValueOnDisabled:{type:Boolean,default:!1}},emits:["update:modelValue","click","focus","blur"],setup(t,{expose:a,emit:o}){const i=t,d=(0,e.computed)((()=>[i.required&&(e=>"number"!=typeof e&&"Aquest camp es requerit."),null!==i.min&&(e=>"number"==typeof e&&e<i.min&&`El valor mínim es ${i.min}.`),null!==i.max&&(e=>"number"==typeof e&&e>i.max&&`El valor màxim es ${i.max}.`),...i.rules||[]].filter((e=>e)))),{errorMessage:r,validate:n,clear:u,destroy:s}=i.createField?i.createField(i.name,(0,e.toRef)(i,"modelValue"),{rules:d,skip:(0,e.toRef)(i,"disabled")}):{errorMessage:(0,e.ref)(null),validate:()=>!0,clear:()=>{},destroy:()=>{}};a({validate:n,clear:u});const p=(0,e.computed)((()=>l(n,i.autoValidateWait)));function m(l){o("update:modelValue",l),"update"===i.autoValidate&&(0,e.nextTick)((()=>p.value()))}function c(e){o("blur",e),"blur"===i.autoValidate&&n()}return(0,e.watch)((()=>i.disabled),(e=>{e&&i.clearValueOnDisabled&&o("update:modelValue",null)})),(0,e.onBeforeUnmount)(s),(l,a)=>{const i=(0,e.resolveComponent)("fura-number-field");return(0,e.openBlock)(),(0,e.createBlock)(i,{label:t.label,invalid:t.invalid,borderless:t.borderless,underlined:t.underlined,placeholder:t.placeholder,suffix:t.suffix,multiline:t.multiline,icon:t.icon,readonly:t.readonly,maxlength:t.maxlength,unresizable:t.unresizable,"auto-adjust-height":t.autoAdjustHeight,"format-style":t.formatStyle,"use-grouping":t.useGrouping,"minimum-integer-digits":t.minimumIntegerDigits,"minimum-fraction-digits":t.minimumFractionDigits,"maximum-fraction-digits":t.maximumFractionDigits,"minimum-significant-digits":t.minimumSignificantDigits,"maximum-significant-digits":t.maximumSignificantDigits,parse:t.parse,stringify:t.stringify,"stringify-focus":t.stringifyFocus,align:t.align,"align-focus":t.alignFocus,"error-message":(0,e.unref)(r),"model-value":t.modelValue,required:t.required,disabled:t.disabled,"onUpdate:modelValue":m,onClick:a[0]||(a[0]=e=>o("click",e)),onFocus:a[1]||(a[1]=e=>o("focus",e)),onBlur:c},null,8,["label","invalid","borderless","underlined","placeholder","suffix","multiline","icon","readonly","maxlength","unresizable","auto-adjust-height","format-style","use-grouping","minimum-integer-digits","minimum-fraction-digits","maximum-fraction-digits","minimum-significant-digits","maximum-significant-digits","parse","stringify","stringify-focus","align","align-focus","error-message","model-value","required","disabled"])}}},u={props:{label:{type:String,default:void 0},description:{type:String,default:void 0},invalid:{type:Boolean,default:void 0},borderless:{type:Boolean,default:void 0},underlined:{type:Boolean,default:void 0},step:{type:Number,default:void 0},inc:{type:Function,default:void 0},dec:{type:Function,default:void 0},parse:{type:Function,default:void 0},stringify:{type:Function,default:void 0},createField:{type:Function,default:null},name:{type:[String,Symbol],default:()=>Symbol("fieldText")},modelValue:{type:Number,default:null},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},min:{type:Number,default:null},max:{type:Number,default:null},rules:{type:Array,default:null},autoValidate:{type:String,default:null,validator:e=>!e||["update","blur"].includes(e)},autoValidateWait:{type:Number,default:0},clearValueOnDisabled:{type:Boolean,default:!1}},emits:["update:modelValue","focus","blur"],setup(t,{expose:a,emit:o}){const i=t,d=(0,e.computed)((()=>[i.required&&(e=>"number"!=typeof e&&"Aquest camp es requerit."),null!==i.min&&(e=>"number"==typeof e&&e<i.min&&`El valor mínim es ${i.min}.`),null!==i.max&&(e=>"number"==typeof e&&e>i.max&&`El valor màxim es ${i.max}.`),...i.rules||[]].filter((e=>e)))),{errorMessage:r,validate:n,clear:u,destroy:s}=i.createField?i.createField(i.name,(0,e.toRef)(i,"modelValue"),{rules:d,skip:(0,e.toRef)(i,"disabled")}):{errorMessage:(0,e.ref)(null),validate:()=>!0,clear:()=>{},destroy:()=>{}};a({validate:n,clear:u});const p=(0,e.computed)((()=>l(n,i.autoValidateWait)));function m(l){o("update:modelValue",l),"update"===i.autoValidate&&(0,e.nextTick)((()=>p.value()))}function c(e){o("blur",e),"blur"===i.autoValidate&&n()}return(0,e.watch)((()=>i.disabled),(e=>{e&&i.clearValueOnDisabled&&o("update:modelValue",null)})),(0,e.onBeforeUnmount)(s),(l,a)=>{const i=(0,e.resolveComponent)("fura-spin-button");return(0,e.openBlock)(),(0,e.createBlock)(i,{label:t.label,description:t.description,invalid:t.invalid,borderless:t.borderless,underlined:t.underlined,step:t.step,inc:t.inc,dec:t.dec,parse:t.parse,stringify:t.stringify,"error-message":(0,e.unref)(r),"model-value":t.modelValue,required:t.required,disabled:t.disabled,"onUpdate:modelValue":m,onFocus:a[0]||(a[0]=e=>o("focus",e)),onBlur:c},null,8,["label","description","invalid","borderless","underlined","step","inc","dec","parse","stringify","error-message","model-value","required","disabled"])}}},s={props:{label:{type:String,default:void 0},description:{type:String,default:void 0},invalid:{type:Boolean,default:void 0},borderless:{type:Boolean,default:void 0},underlined:{type:Boolean,default:void 0},readonly:{type:Boolean,default:void 0},getItems:{type:Function,required:!0},getItemsWait:{type:Number,default:void 0},filterItems:{type:Boolean,default:void 0},autoComplete:{type:Boolean,default:void 0},accentInsensitive:{type:Boolean,default:void 0},maxSelectedItems:{type:Number,default:void 0},placeholder:{type:String,default:void 0},loadingText:{type:String,default:void 0},immediateScroll:{type:Boolean,default:void 0},createField:{type:Function,default:null},name:{type:[String,Symbol],default:()=>Symbol("fieldText")},modelValue:{type:Array,default:()=>[]},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},rules:{type:Array,default:null},autoValidate:{type:String,default:null,validator:e=>!e||["update","blur"].includes(e)},autoValidateWait:{type:Number,default:0},clearValueOnDisabled:{type:Boolean,default:!1}},emits:["update:modelValue","focus","blur"],setup(t,{expose:a,emit:o}){const i=t,d=(0,e.computed)((()=>[i.required&&(e=>!e?.length&&"Aquest camp es requerit."),...i.rules||[]].filter((e=>e)))),{errorMessage:r,validate:n,clear:u,destroy:s}=i.createField?i.createField(i.name,(0,e.toRef)(i,"modelValue"),{rules:d,skip:(0,e.toRef)(i,"disabled")}):{errorMessage:(0,e.ref)(null),validate:()=>!0,clear:()=>{},destroy:()=>{}};a({validate:n,clear:u});const p=(0,e.computed)((()=>l(n,i.autoValidateWait)));function m(l){o("update:modelValue",l),"update"===i.autoValidate&&(0,e.nextTick)((()=>p.value()))}function c(e){o("blur",e),"blur"===i.autoValidate&&n()}return(0,e.watch)((()=>i.disabled),(e=>{e&&i.clearValueOnDisabled&&o("update:modelValue",[])})),(0,e.onBeforeUnmount)(s),(l,a)=>{const i=(0,e.resolveComponent)("fura-tag-picker");return(0,e.openBlock)(),(0,e.createBlock)(i,{label:t.label,description:t.description,invalid:t.invalid,borderless:t.borderless,underlined:t.underlined,readonly:t.readonly,"get-items":t.getItems,"get-items-wait":t.getItemsWait,"filter-items":t.filterItems,"auto-complete":t.autoComplete,"accent-insensitive":t.accentInsensitive,"max-selected-items":t.maxSelectedItems,placeholder:t.placeholder,"loading-text":t.loadingText,"immediate-scroll":t.immediateScroll,"error-message":(0,e.unref)(r),"model-value":t.modelValue,required:t.required,disabled:t.disabled,"onUpdate:modelValue":m,onFocus:a[0]||(a[0]=e=>o("focus",e)),onBlur:c},null,8,["label","description","invalid","borderless","underlined","readonly","get-items","get-items-wait","filter-items","auto-complete","accent-insensitive","max-selected-items","placeholder","loading-text","immediate-scroll","error-message","model-value","required","disabled"])}}},p={props:{label:{type:String,default:void 0},description:{type:String,default:void 0},invalid:{type:Boolean,default:void 0},borderless:{type:Boolean,default:void 0},underlined:{type:Boolean,default:void 0},placeholder:{type:String,default:void 0},prefix:{type:String,default:void 0},suffix:{type:String,default:void 0},multiline:{type:Boolean,default:void 0},icon:{type:String,default:void 0},readonly:{type:Boolean,default:void 0},unresizable:{type:Boolean,default:void 0},autoAdjustHeight:{type:Boolean,default:void 0},password:{type:Boolean,default:void 0},createField:{type:Function,default:null},name:{type:[String,Symbol],default:()=>Symbol("fieldText")},modelValue:{type:String,default:null},required:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},maxlength:{type:Number,default:null},pattern:{type:RegExp,default:null},rules:{type:Array,default:null},autoValidate:{type:String,default:null,validator:e=>!e||["update","blur"].includes(e)},autoValidateWait:{type:Number,default:0},clearValueOnDisabled:{type:Boolean,default:!1}},emits:["update:modelValue","click","focus","blur","keydown"],setup(t,{expose:a,emit:o}){const i=t,d=(0,e.computed)((()=>[i.required&&(e=>!e&&"Aquest camp es requerit."),!!i.maxlength>0&&(e=>e?.length>i.maxlength&&`La longitud màxima es de ${i.maxlength} caracters.`),!!i.pattern&&(e=>!e?.match(i.pattern)&&"El valor del text no compleix el patró especificat."),...i.rules||[]].filter((e=>e)))),{errorMessage:r,validate:n,clear:u,destroy:s}=i.createField?i.createField(i.name,(0,e.toRef)(i,"modelValue"),{rules:d,skip:(0,e.toRef)(i,"disabled")}):{errorMessage:(0,e.ref)(null),validate:()=>!0,clear:()=>{},destroy:()=>{}};a({validate:n,clear:u});const p=(0,e.computed)((()=>l(n,i.autoValidateWait)));function m(l){o("update:modelValue",l),"update"===i.autoValidate&&(0,e.nextTick)((()=>p.value()))}function c(e){o("blur",e),"blur"===i.autoValidate&&n()}return(0,e.watch)((()=>i.disabled),(e=>{e&&i.clearValueOnDisabled&&o("update:modelValue",null)})),(0,e.onBeforeUnmount)(s),(l,a)=>{const i=(0,e.resolveComponent)("fura-text-field");return(0,e.openBlock)(),(0,e.createBlock)(i,{label:t.label,description:t.description,invalid:t.invalid,borderless:t.borderless,underlined:t.underlined,placeholder:t.placeholder,prefix:t.prefix,suffix:t.suffix,multiline:t.multiline,icon:t.icon,readonly:t.readonly,maxlength:t.maxlength,unresizable:t.unresizable,"auto-adjust-height":t.autoAdjustHeight,password:t.password,"error-message":(0,e.unref)(r),"model-value":t.modelValue,required:t.required,disabled:t.disabled,"onUpdate:modelValue":m,onClick:a[0]||(a[0]=e=>o("click",e)),onFocus:a[1]||(a[1]=e=>o("focus",e)),onBlur:c,onKeydown:a[2]||(a[2]=e=>o("keydown",e))},null,8,["label","description","invalid","borderless","underlined","placeholder","prefix","suffix","multiline","icon","readonly","maxlength","unresizable","auto-adjust-height","password","error-message","model-value","required","disabled"])}}},m={key:0,class:"stackDraggable-item"},c={class:"stackDraggable-content"},f=["onDragstart"],y={class:"stackDraggable-handler"},v={key:1,class:"stackDraggable-item"},g={class:"stackDraggable-content"},b={props:{name:{type:String,default:()=>String(Math.random()).replace("0.","")},primaryKey:{type:String,required:!0},modelValue:{type:Array,required:!0},handlerPosition:{type:String,default:"center",validate:e=>!e||["top","center","bottom"].includes(e)}},emits:["update:modelValue"],setup(l,{emit:t}){const a=l,o="text/llesca-stack-draggable-key/",i=(0,e.useSlots)(),d=(0,e.ref)([]),r=(0,e.computed)((()=>i.header&&-1!==i.header().findIndex((l=>l.type!==e.Comment)))),n=(0,e.computed)((()=>i.footer&&-1!==i.footer().findIndex((l=>l.type!==e.Comment))));function u(e){e.dataTransfer.types.includes(o+a.name)&&e.preventDefault()}function s(e){const l=e.dataTransfer.getData(o+a.name),i=a.modelValue.findIndex((e=>e[a.primaryKey]===l)),r=d.value.filter((e=>e.el)).reduce(((l,t)=>t.el.getBoundingClientRect().bottom>e.pageY&&t.index<l?t.index:l),d.value.length);var n,u,s;t("update:modelValue",(n=a.modelValue,(u=i)===(s=r)?n:u>s?[...n.slice(0,s),n[u],...n.slice(s,u),...n.slice(u+1)]:[...n.slice(0,u),...n.slice(u+1,s+1),n[u],...n.slice(s+1)]))}return(0,e.onBeforeUpdate)((()=>{d.value=[]})),(t,i)=>{const p=(0,e.resolveComponent)("fura-icon");return(0,e.openBlock)(),(0,e.createElementBlock)("div",{onDragover:u,onDrop:s},[(0,e.unref)(r)?((0,e.openBlock)(),(0,e.createElementBlock)("div",m,[(0,e.createVNode)(p,{class:"stackDraggable-dragIcon"}),(0,e.createElementVNode)("div",c,[(0,e.renderSlot)(t.$slots,"header")])])):(0,e.createCommentVNode)("v-if",!0),((0,e.openBlock)(!0),(0,e.createElementBlock)(e.Fragment,null,(0,e.renderList)(l.modelValue,((r,n)=>((0,e.openBlock)(),(0,e.createElementBlock)("div",{key:r[l.primaryKey],ref_for:!0,ref:e=>d.value.push({item:r,index:n,el:e}),draggable:"true",class:"stackDraggable-item",onDragstart:(0,e.withModifiers)((e=>{return t=e,i=r[l.primaryKey],t.dataTransfer.effectAllowed="move",t.dataTransfer.droptAllowed="move",void t.dataTransfer.setData(o+a.name,i);var t,i}),["stop"])},[(0,e.createElementVNode)("div",y,[(0,e.createElementVNode)("div",{class:(0,e.normalizeClass)(["stackDraggable-cover",{"stackDraggable-hide":"top"===l.handlerPosition}]),draggable:"true",onDragstart:i[0]||(i[0]=(0,e.withModifiers)((()=>{}),["stop","prevent"]))},null,34),(0,e.createVNode)(p,{class:"stackDraggable-dragIcon",name:"GripperDotsVertical"}),(0,e.createElementVNode)("div",{class:(0,e.normalizeClass)(["stackDraggable-cover",{"stackDraggable-hide":"bottom"===l.handlerPosition}]),draggable:"true",onDragstart:i[1]||(i[1]=(0,e.withModifiers)((()=>{}),["stop","prevent"]))},null,34)]),(0,e.createElementVNode)("div",{class:"stackDraggable-content",draggable:"true",onDragstart:i[2]||(i[2]=(0,e.withModifiers)((()=>{}),["stop","prevent"]))},[(0,e.renderSlot)(t.$slots,"default",{item:r,key:n[l.primaryKey],index:n})],32)],40,f)))),128)),(0,e.unref)(n)?((0,e.openBlock)(),(0,e.createElementBlock)("div",v,[(0,e.createVNode)(p,{class:"stackDraggable-dragIcon"}),(0,e.createElementVNode)("div",g,[(0,e.renderSlot)(t.$slots,"footer")])])):(0,e.createCommentVNode)("v-if",!0)],32)}}},V=(0,a(407).Z)(b,[["__scopeId","data-v-3d8db5ed"]]);Error,Symbol("state");const B={FieldCombo:t,FieldComboAsync:i,FieldDate:d,FieldDropdown:r,FieldNumber:n,FieldNumberSpin:u,FieldTag:s,FieldText:p,StackDraggable:V},x={install:function(e,{prefix:l="llesca"}={}){for(const l in B){const t=l.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase();e.component("llesca-"+t,B[l])}},Llesca:B,version:"0.2.0"}})(),o.default})()));