(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{10:function(t,a){},11:function(t,a,e){"use strict";e.r(a);var c=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"character-card",class:{turnOver:t.character.turnOver,unconscious:t.character.unconscious,ignore:t.character.awaitingTarget},attrs:{"data-id":t.character.id}},[e("div",{staticClass:"character-card__open",attrs:{"data-str":t.character.id},on:{click:t.select}},[e("span"),e("span")]),t._v(" "),e("div",{staticClass:"character-card__initiative"},[t._v("\n        "+t._s(t.character.initiative)+"\n    ")]),t._v(" "),e("div",{staticClass:"character-card__name"},[e("p",[t._v(t._s(t.character.name)+" "),t.character.npc?e("span",[t._v("(MOOK)")]):t._e()])]),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.character.npc,expression:"character.npc"}],staticClass:"character-card__hitpoints"},[e("button",{staticClass:"btn btn-hurt",on:{click:function(a){return t.changeHP("hurt")}}},[e("i",{staticClass:"las la-crutch"})]),t._v(" "),t._l(t.character.hp,(function(t){return e("span")})),t._v(" "),e("button",{staticClass:"btn btn-heal",on:{click:function(a){return t.changeHP("heal")}}},[e("i",{staticClass:"las la-band-aid"})])],2),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.character.hpMax,expression:"character.hpMax"}],staticClass:"character-card__hitpoints"},[e("button",{staticClass:"btn btn-hurt",on:{click:function(a){return t.toggle(".hurt")}}},[e("i",{staticClass:"las la-crutch"})]),t._v(" "),e("div",[t._v(t._s(t.character.hp)+" / "+t._s(t.character.hpMax))]),t._v(" "),e("button",{staticClass:"btn btn-heal",on:{click:function(a){return t.toggle(".heal")}}},[e("i",{staticClass:"las la-band-aid"})]),t._v(" "),e("div",{staticClass:"hurt"},[e("button",{staticClass:"closeButton",on:{click:function(a){return t.toggle(".hurt")}}},[t._v("X")]),t._v(" "),e("label",[t._v("Damage "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.amount,expression:"amount"}],attrs:{type:"text"},domProps:{value:t.amount},on:{input:function(a){a.target.composing||(t.amount=a.target.value)}}})]),t._v(" "),e("button",{staticClass:"btn btn--x-small",on:{click:function(a){return t.changeHP("hurt")}}},[t._v("Hurt")])]),t._v(" "),e("div",{staticClass:"heal"},[e("button",{staticClass:"closeButton",on:{click:function(a){return t.toggle(".heal")}}},[t._v("X")]),t._v(" "),e("label",[t._v("Healing "),e("input",{directives:[{name:"model",rawName:"v-model",value:t.amount,expression:"amount"}],attrs:{type:"text"},domProps:{value:t.amount},on:{input:function(a){a.target.composing||(t.amount=a.target.value)}}})]),t._v(" "),e("button",{staticClass:"btn btn--x-small",on:{click:function(a){return t.changeHP("heal")}}},[t._v("Heal")])])]),t._v(" "),t.character.hpMax||t.character.npc?t._e():e("div",{staticClass:"character-card__empty",staticStyle:{"--span":"2"}}),t._v(" "),e("div",{staticClass:"character-card__notes"},[e("textarea",{attrs:{placeholder:"Notes on location, descriptive attributes"},on:{change:t.updateNotes}})]),t._v(" "),e("div",{staticClass:"character-card__conditions"},t._l(t.character.conditions,(function(a){return e("p",t._g({staticClass:"condition-marker",class:a.type.toLowerCase(),attrs:{"data-target":a.turnTarget,"data-type":a.type,"data-save":a.canSave?"(DC "+a.saveDC+a.saveType+")":null},on:{click:function(e){return t.removeCondition(a,e)}}},a.turnTarget?{mouseover:function(){return t.focusTarget(a.turnTarget)},mouseout:t.removeFocus}:{}),[t._v("\n            "+t._s(a.type)+"\n            "),a.damage?e("span",[t._v(": "+t._s(a.damage))]):"Burning"===a.type?e("span",[t._v(": 2d4")]):t._e(),t._v(" "),a.canSave?e("span",[t._v("(DC"+t._s(a.saveDC)+" "+t._s(a.saveType)+")")]):t._e(),t._v(" "),"Injured"===a.type?e("span",[t._v("("+t._s(a.injury)+")")]):t._e()])})),0),t._v(" "),e("div",{staticClass:"character-card__utility"},[e("button",{on:{click:function(a){return t.toggle(".conditions")}}},[t._v("+")]),t._v(" "),e("conditionsMenu",{ref:"conditionsMenu",attrs:{character:t.character.id}})],1),t._v(" "),t.character.removable?e("button",{staticClass:"btn remove-character btn--x-small",on:{click:t.removeCharacter}},[e("span",[t._v("X")])]):t._e()])};c._withStripped=!0;var n,r=e(1),s=e(5),i=e(10),o=function(t,a,e,c){var n,r=arguments.length,s=r<3?a:null===c?c=Object.getOwnPropertyDescriptor(a,e):c;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(t,a,e,c);else for(var i=t.length-1;i>=0;i--)(n=t[i])&&(s=(r<3?n(s):r>3?n(a,e,s):n(a,e))||s);return r>3&&s&&Object.defineProperty(a,e,s),s},l=function(t,a){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,a)};let u=class extends r.c{constructor(){super(),this.conditionMenu=null,this.healing=0,this.damage=0,this.amount=0}mounted(){this.conditionMenu=this.$el.querySelector(".conditions")}select(){this.character&&!this.character.awaitingTarget&&s.default.$emit("selectCharacter",this.character.id)}openCondition(){this.conditionMenu&&this.conditionMenu.classList.add("open")}closeCondition(){this.conditionMenu&&this.conditionMenu.classList.remove("open")}removeCondition(t){let a;this.character&&this.character.id&&(a={target:this.character.id,condition:t}),s.default.$emit("removeCondition",a)}focusTarget(t){t&&s.default.$emit("focusTarget",t)}removeFocus(){s.default.$emit("removeFocus")}changeHP(t){let a;this.character&&this.character.id&&this.amount&&(a={target:this.character.id,amount:this.amount,type:t}),s.default.$emit("changeHP",a),this.character&&!this.character.npc&&this.toggle(`.${t}`),this.amount=0}toggle(t){let a=this.$el.querySelector(t);if(a)return a.classList.contains("open")?a.classList.remove("open"):void a.classList.add("open")}updateNotes(t){let a;t&&t.target&&this.character&&(a={notes:t.target.value,target:this.character.id}),s.default.$emit("updateNotes",a)}removeCharacter(){this.character&&s.default.$emit("removeCharacter",this.character.id)}};o([Object(r.b)(),l("design:type","function"==typeof(n=void 0!==i.Agent&&i.Agent)?n:Object)],u.prototype,"character",void 0),u=o([Object(r.a)({components:{conditionsMenu:()=>"./conditionsMenu.vue"}}),l("design:paramtypes",[])],u);var h=u,d=e(3),v=Object(d.a)(h,c,[],!1,null,null,null);v.options.__file="src/js/components/character.vue";a.default=v.exports}}]);