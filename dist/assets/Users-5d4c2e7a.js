import{G as mt,r as $,H as yt,I as T,J as H,K as bt,L as Ce,M as Fe,N as ht,O as pt,P as Pt,Q as Ae,R as Le,S as xt,T as O,U as M,W as Z,X as St,Y as $e,Z as kt,$ as wt,a0 as ie,a1 as Vt,e as S,a2 as Q,a3 as I,a4 as G,j as c,v as L,a5 as C,a6 as Pe,a7 as xe,a8 as Oe,a9 as j,aa as q,ab as ne,ac as It,ad as Dt,ae as N,af as Tt,ag as _t,ah as Ee,ai as re,aj as Y,ak as X,al as Bt,am as Ct,an as Ft,ao as At,F as W,ap as fe,C as ue,n as de,i as Se,x as Re,aq as se,ar as Lt,as as J,at as $t,w as Ot,au as Et,av as Rt,aw as Nt,d as Mt,ax as Gt,o as oe,c as Ht,h as R,k as jt,l as ke,q as qt,ay as zt,a as Ut,g as we}from"./index-1c68082f.js";import{a as Ve}from"./axios-b2dce398.js";function Ie(e,l,a){return Object.keys(e).filter(t=>mt(t)&&t.endsWith(l)).reduce((t,n)=>(t[n.slice(0,-l.length)]=r=>e[n](r,a(r)),t),{})}function Kt(){const e=$([]);yt(()=>e.value=[]);function l(a,t){e.value[t]=a}return{refs:e,updateRef:l}}const Wt=T({activeColor:String,start:{type:[Number,String],default:1},modelValue:{type:Number,default:e=>e.start},disabled:Boolean,length:{type:[Number,String],default:1,validator:e=>e%1===0},totalVisible:[Number,String],firstIcon:{type:H,default:"$first"},prevIcon:{type:H,default:"$prev"},nextIcon:{type:H,default:"$next"},lastIcon:{type:H,default:"$last"},ariaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.root"},pageAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.page"},currentPageAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.currentPage"},firstAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.first"},previousAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.previous"},nextAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.next"},lastAriaLabel:{type:String,default:"$vuetify.pagination.ariaLabel.last"},ellipsis:{type:String,default:"..."},showFirstLastPage:Boolean,...bt(),...Ce(),...Fe(),...ht(),...pt(),...Pt(),...Ae({tag:"nav"}),...Le(),...xt({variant:"text"})},"VPagination"),Qt=O()({name:"VPagination",props:Wt(),emits:{"update:modelValue":e=>!0,first:e=>!0,prev:e=>!0,next:e=>!0,last:e=>!0},setup(e,l){let{slots:a,emit:t}=l;const n=M(e,"modelValue"),{t:r,n:f}=Z(),{isRtl:i}=St(),{themeClasses:s}=$e(e),{width:u}=kt(),o=wt(-1);ie(void 0,{scoped:!0});const{resizeRef:v}=Vt(b=>{if(!b.length)return;const{target:x,contentRect:w}=b[0],D=x.querySelector(".v-pagination__list > *");if(!D)return;const B=w.width,E=D.offsetWidth+parseFloat(getComputedStyle(D).marginRight)*2;o.value=p(B,E)}),d=S(()=>parseInt(e.length,10)),g=S(()=>parseInt(e.start,10)),P=S(()=>e.totalVisible!=null?parseInt(e.totalVisible,10):o.value>=0?o.value:p(u.value,58));function p(b,x){const w=e.showFirstLastPage?5:3;return Math.max(0,Math.floor(+((b-x*w)/x).toFixed(2)))}const m=S(()=>{if(d.value<=0||isNaN(d.value)||d.value>Number.MAX_SAFE_INTEGER)return[];if(P.value<=0)return[];if(P.value===1)return[n.value];if(d.value<=P.value)return Q(d.value,g.value);const b=P.value%2===0,x=b?P.value/2:Math.floor(P.value/2),w=b?x:x+1,D=d.value-x;if(w-n.value>=0)return[...Q(Math.max(1,P.value-1),g.value),e.ellipsis,d.value];if(n.value-D>=(b?1:0)){const B=P.value-1,E=d.value-B+g.value;return[g.value,e.ellipsis,...Q(B,E)]}else{const B=Math.max(1,P.value-3),E=B===1?n.value:n.value-Math.ceil(B/2)+g.value;return[g.value,e.ellipsis,...Q(B,E),e.ellipsis,d.value]}});function y(b,x,w){b.preventDefault(),n.value=x,w&&t(w,x)}const{refs:k,updateRef:V}=Kt();ie({VPaginationBtn:{color:I(e,"color"),border:I(e,"border"),density:I(e,"density"),size:I(e,"size"),variant:I(e,"variant"),rounded:I(e,"rounded"),elevation:I(e,"elevation")}});const h=S(()=>m.value.map((b,x)=>{const w=D=>V(D,x);if(typeof b=="string")return{isActive:!1,key:`ellipsis-${x}`,page:b,props:{ref:w,ellipsis:!0,icon:!0,disabled:!0}};{const D=b===n.value;return{isActive:D,key:b,page:f(b),props:{ref:w,ellipsis:!1,icon:!0,disabled:!!e.disabled||+e.length<2,color:D?e.activeColor:e.color,ariaCurrent:D,ariaLabel:r(D?e.currentPageAriaLabel:e.pageAriaLabel,b),onClick:B=>y(B,b)}}}})),_=S(()=>{const b=!!e.disabled||n.value<=g.value,x=!!e.disabled||n.value>=g.value+d.value-1;return{first:e.showFirstLastPage?{icon:i.value?e.lastIcon:e.firstIcon,onClick:w=>y(w,g.value,"first"),disabled:b,ariaLabel:r(e.firstAriaLabel),ariaDisabled:b}:void 0,prev:{icon:i.value?e.nextIcon:e.prevIcon,onClick:w=>y(w,n.value-1,"prev"),disabled:b,ariaLabel:r(e.previousAriaLabel),ariaDisabled:b},next:{icon:i.value?e.prevIcon:e.nextIcon,onClick:w=>y(w,n.value+1,"next"),disabled:x,ariaLabel:r(e.nextAriaLabel),ariaDisabled:x},last:e.showFirstLastPage?{icon:i.value?e.firstIcon:e.lastIcon,onClick:w=>y(w,g.value+d.value-1,"last"),disabled:x,ariaLabel:r(e.lastAriaLabel),ariaDisabled:x}:void 0}});function A(){var x;const b=n.value-g.value;(x=k.value[b])==null||x.$el.focus()}function z(b){b.key===Pe.left&&!e.disabled&&n.value>+e.start?(n.value=n.value-1,xe(A)):b.key===Pe.right&&!e.disabled&&n.value<g.value+d.value-1&&(n.value=n.value+1,xe(A))}return G(()=>c(e.tag,{ref:v,class:["v-pagination",s.value,e.class],style:e.style,role:"navigation","aria-label":r(e.ariaLabel),onKeydown:z,"data-test":"v-pagination-root"},{default:()=>[c("ul",{class:"v-pagination__list"},[e.showFirstLastPage&&c("li",{key:"first",class:"v-pagination__first","data-test":"v-pagination-first"},[a.first?a.first(_.value.first):c(L,C({_as:"VPaginationBtn"},_.value.first),null)]),c("li",{key:"prev",class:"v-pagination__prev","data-test":"v-pagination-prev"},[a.prev?a.prev(_.value.prev):c(L,C({_as:"VPaginationBtn"},_.value.prev),null)]),h.value.map((b,x)=>c("li",{key:b.key,class:["v-pagination__item",{"v-pagination__item--is-active":b.isActive}],"data-test":"v-pagination-item"},[a.item?a.item(b):c(L,C({_as:"VPaginationBtn"},b.props),{default:()=>[b.page]})])),c("li",{key:"next",class:"v-pagination__next","data-test":"v-pagination-next"},[a.next?a.next(_.value.next):c(L,C({_as:"VPaginationBtn"},_.value.next),null)]),e.showFirstLastPage&&c("li",{key:"last",class:"v-pagination__last","data-test":"v-pagination-last"},[a.last?a.last(_.value.last):c(L,C({_as:"VPaginationBtn"},_.value.last),null)])])]})),{}}}),Xt=T({page:{type:[Number,String],default:1},itemsPerPage:{type:[Number,String],default:10}},"DataTable-paginate"),Ne=Symbol.for("vuetify:data-table-pagination");function Jt(e){const l=M(e,"page",void 0,t=>+(t??1)),a=M(e,"itemsPerPage",void 0,t=>+(t??10));return{page:l,itemsPerPage:a}}function Yt(e){const{page:l,itemsPerPage:a,itemsLength:t}=e,n=S(()=>a.value===-1?0:a.value*(l.value-1)),r=S(()=>a.value===-1?t.value:Math.min(t.value,n.value+a.value)),f=S(()=>a.value===-1||t.value===0?1:Math.ceil(t.value/a.value));Oe(()=>{l.value>f.value&&(l.value=f.value)});function i(d){a.value=d,l.value=1}function s(){l.value=ne(l.value+1,1,f.value)}function u(){l.value=ne(l.value-1,1,f.value)}function o(d){l.value=ne(d,1,f.value)}const v={page:l,itemsPerPage:a,startIndex:n,stopIndex:r,pageCount:f,itemsLength:t,nextPage:s,prevPage:u,setPage:o,setItemsPerPage:i};return j(Ne,v),v}function Zt(){const e=q(Ne);if(!e)throw new Error("Missing pagination!");return e}function ea(e){const{items:l,startIndex:a,stopIndex:t,itemsPerPage:n}=e;return{paginatedItems:S(()=>n.value<=0?l.value:l.value.slice(a.value,t.value))}}const Me=T({prevIcon:{type:String,default:"$prev"},nextIcon:{type:String,default:"$next"},firstIcon:{type:String,default:"$first"},lastIcon:{type:String,default:"$last"},itemsPerPageText:{type:String,default:"$vuetify.dataFooter.itemsPerPageText"},pageText:{type:String,default:"$vuetify.dataFooter.pageText"},firstPageLabel:{type:String,default:"$vuetify.dataFooter.firstPage"},prevPageLabel:{type:String,default:"$vuetify.dataFooter.prevPage"},nextPageLabel:{type:String,default:"$vuetify.dataFooter.nextPage"},lastPageLabel:{type:String,default:"$vuetify.dataFooter.lastPage"},itemsPerPageOptions:{type:Array,default:()=>[{value:10,title:"10"},{value:25,title:"25"},{value:50,title:"50"},{value:100,title:"100"},{value:-1,title:"$vuetify.dataFooter.itemsPerPageAll"}]},showCurrentPage:Boolean},"VDataTableFooter"),De=O()({name:"VDataTableFooter",props:Me(),setup(e,l){let{slots:a}=l;const{t}=Z(),{page:n,pageCount:r,startIndex:f,stopIndex:i,itemsLength:s,itemsPerPage:u,setItemsPerPage:o}=Zt(),v=S(()=>e.itemsPerPageOptions.map(d=>typeof d=="number"?{value:d,title:d===-1?t("$vuetify.dataFooter.itemsPerPageAll"):String(d)}:{...d,title:t(d.title)}));return G(()=>{var d;return c("div",{class:"v-data-table-footer"},[(d=a.prepend)==null?void 0:d.call(a),c("div",{class:"v-data-table-footer__items-per-page"},[c("span",null,[t(e.itemsPerPageText)]),c(It,{items:v.value,modelValue:u.value,"onUpdate:modelValue":g=>o(Number(g)),density:"compact",variant:"outlined","hide-details":!0},null)]),c("div",{class:"v-data-table-footer__info"},[c("div",null,[t(e.pageText,s.value?f.value+1:0,i.value,s.value)])]),c("div",{class:"v-data-table-footer__pagination"},[c(Qt,{modelValue:n.value,"onUpdate:modelValue":g=>n.value=g,density:"comfortable","first-aria-label":e.firstPageLabel,"last-aria-label":e.lastPageLabel,length:r.value,"next-aria-label":e.nextPageLabel,"prev-aria-label":e.prevPageLabel,rounded:!0,"show-first-last-page":!0,"total-visible":e.showCurrentPage?1:0,variant:"plain"},null)])])}),{}}}),ve=Dt({align:{type:String,default:"start"},fixed:Boolean,fixedOffset:[Number,String],height:[Number,String],lastFixed:Boolean,noPadding:Boolean,tag:String,width:[Number,String]},(e,l)=>{let{slots:a}=l;const t=e.tag??"td";return c(t,{class:["v-data-table__td",{"v-data-table-column--fixed":e.fixed,"v-data-table-column--last-fixed":e.lastFixed,"v-data-table-column--no-padding":e.noPadding},`v-data-table-column--align-${e.align}`],style:{height:N(e.height),width:N(e.width),left:N(e.fixedOffset||null)}},{default:()=>{var n;return[(n=a.default)==null?void 0:n.call(a)]}})}),ta=T({headers:Array},"DataTable-header"),Ge=Symbol.for("vuetify:data-table-headers"),He={title:"",sortable:!1},aa={...He,width:48};function la(){const l=(arguments.length>0&&arguments[0]!==void 0?arguments[0]:[]).map(a=>({element:a,priority:0}));return{enqueue:(a,t)=>{let n=!1;for(let r=0;r<l.length;r++)if(l[r].priority>t){l.splice(r,0,{element:a,priority:t}),n=!0;break}n||l.push({element:a,priority:t})},size:()=>l.length,count:()=>{let a=0;if(!l.length)return 0;const t=Math.floor(l[0].priority);for(let n=0;n<l.length;n++)Math.floor(l[n].priority)===t&&(a+=1);return a},dequeue:()=>l.shift()}}function ce(e){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[];if(!e.children)l.push(e);else for(const a of e.children)ce(a,l);return l}function je(e){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:new Set;for(const a of e)a.key&&l.add(a.key),a.children&&je(a.children,l);return l}function na(e){if(e.key){if(e.key==="data-table-group")return He;if(["data-table-expand","data-table-select"].includes(e.key))return aa}}function ge(e){let l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0;return e.children?Math.max(l,...e.children.map(a=>ge(a,l+1))):l}function ra(e){let l=!1;function a(r){let f=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(r)if(f&&(r.fixed=!0),r.fixed)if(r.children)for(let i=r.children.length-1;i>=0;i--)a(r.children[i],!0);else l?isNaN(+r.width)&&_t(`Multiple fixed columns should have a static width (key: ${r.key})`):r.lastFixed=!0,l=!0;else if(r.children)for(let i=r.children.length-1;i>=0;i--)a(r.children[i]);else l=!1}for(let r=e.length-1;r>=0;r--)a(e[r]);function t(r){let f=arguments.length>1&&arguments[1]!==void 0?arguments[1]:0;if(!r)return f;if(r.children){r.fixedOffset=f;for(const i of r.children)f=t(i,f)}else r.fixed&&(r.fixedOffset=f,f+=parseFloat(r.width||"0")||0);return f}let n=0;for(const r of e)n=t(r,n)}function sa(e,l){const a=[];let t=0;const n=la(e);for(;n.size()>0;){let f=n.count();const i=[];let s=1;for(;f>0;){const{element:u,priority:o}=n.dequeue(),v=l-t-ge(u);if(i.push({...u,rowspan:v??1,colspan:u.children?ce(u).length:1}),u.children)for(const d of u.children){const g=o%1+s/Math.pow(10,t+2);n.enqueue(d,t+v+g)}s+=1,f-=1}t+=1,a.push(i)}return{columns:e.map(f=>ce(f)).flat(),headers:a}}function qe(e){const l=[];for(const a of e){const t={...na(a),...a},n=t.key??(typeof t.value=="string"?t.value:null),r=t.value??n??null,f={...t,key:n,value:r,sortable:t.sortable??(t.key!=null||!!t.sort),children:t.children?qe(t.children):void 0};l.push(f)}return l}function oa(e,l){const a=$([]),t=$([]),n=$(),r=$();Oe(()=>{var P,p,m;const s=(e.headers||Object.keys(e.items[0]??{}).map(y=>({key:y,title:Tt(y)}))).slice(),u=je(s);(P=l==null?void 0:l.groupBy)!=null&&P.value.length&&!u.has("data-table-group")&&s.unshift({key:"data-table-group",title:"Group"}),(p=l==null?void 0:l.showSelect)!=null&&p.value&&!u.has("data-table-select")&&s.unshift({key:"data-table-select"}),(m=l==null?void 0:l.showExpand)!=null&&m.value&&!u.has("data-table-expand")&&s.push({key:"data-table-expand"});const o=qe(s);ra(o);const v=Math.max(...o.map(y=>ge(y)))+1,d=sa(o,v);a.value=d.headers,t.value=d.columns;const g=d.headers.flat(1);n.value=g.reduce((y,k)=>(k.sortable&&k.key&&k.sort&&(y[k.key]=k.sort),y),{}),r.value=g.reduce((y,k)=>(k.key&&k.filter&&(y[k.key]=k.filter),y),{})});const f={headers:a,columns:t,sortFunctions:n,filterFunctions:r};return j(Ge,f),f}function ee(){const e=q(Ge);if(!e)throw new Error("Missing headers!");return e}const ia={showSelectAll:!1,allSelected:()=>[],select:e=>{var t;let{items:l,value:a}=e;return new Set(a?[(t=l[0])==null?void 0:t.value]:[])},selectAll:e=>{let{selected:l}=e;return l}},ze={showSelectAll:!0,allSelected:e=>{let{currentPage:l}=e;return l},select:e=>{let{items:l,value:a,selected:t}=e;for(const n of l)a?t.add(n.value):t.delete(n.value);return t},selectAll:e=>{let{value:l,currentPage:a,selected:t}=e;return ze.select({items:a,value:l,selected:t})}},Ue={showSelectAll:!0,allSelected:e=>{let{allItems:l}=e;return l},select:e=>{let{items:l,value:a,selected:t}=e;for(const n of l)a?t.add(n.value):t.delete(n.value);return t},selectAll:e=>{let{value:l,allItems:a,selected:t}=e;return Ue.select({items:a,value:l,selected:t})}},ua=T({showSelect:Boolean,selectStrategy:{type:[String,Object],default:"page"},modelValue:{type:Array,default:()=>[]},valueComparator:{type:Function,default:Ee}},"DataTable-select"),Ke=Symbol.for("vuetify:data-table-selection");function da(e,l){let{allItems:a,currentPage:t}=l;const n=M(e,"modelValue",e.modelValue,m=>new Set(re(m).map(y=>{var k;return((k=a.value.find(V=>e.valueComparator(y,V.value)))==null?void 0:k.value)??y})),m=>[...m.values()]),r=S(()=>a.value.filter(m=>m.selectable)),f=S(()=>t.value.filter(m=>m.selectable)),i=S(()=>{if(typeof e.selectStrategy=="object")return e.selectStrategy;switch(e.selectStrategy){case"single":return ia;case"all":return Ue;case"page":default:return ze}});function s(m){return re(m).every(y=>n.value.has(y.value))}function u(m){return re(m).some(y=>n.value.has(y.value))}function o(m,y){const k=i.value.select({items:m,value:y,selected:new Set(n.value)});n.value=k}function v(m){o([m],!s([m]))}function d(m){const y=i.value.selectAll({value:m,allItems:r.value,currentPage:f.value,selected:new Set(n.value)});n.value=y}const g=S(()=>n.value.size>0),P=S(()=>{const m=i.value.allSelected({allItems:r.value,currentPage:f.value});return!!m.length&&s(m)}),p={toggleSelect:v,select:o,selectAll:d,isSelected:s,isSomeSelected:u,someSelected:g,allSelected:P,showSelectAll:i.value.showSelectAll};return j(Ke,p),p}function te(){const e=q(Ke);if(!e)throw new Error("Missing selection!");return e}const ca=T({sortBy:{type:Array,default:()=>[]},customKeySort:Object,multiSort:Boolean,mustSort:Boolean},"DataTable-sort"),We=Symbol.for("vuetify:data-table-sort");function fa(e){const l=M(e,"sortBy"),a=I(e,"mustSort"),t=I(e,"multiSort");return{sortBy:l,mustSort:a,multiSort:t}}function va(e){const{sortBy:l,mustSort:a,multiSort:t,page:n}=e,r=s=>{if(s.key==null)return;let u=l.value.map(v=>({...v}))??[];const o=u.find(v=>v.key===s.key);o?o.order==="desc"?a.value?o.order="asc":u=u.filter(v=>v.key!==s.key):o.order="desc":t.value?u=[...u,{key:s.key,order:"asc"}]:u=[{key:s.key,order:"asc"}],l.value=u,n&&(n.value=1)};function f(s){return!!l.value.find(u=>u.key===s.key)}const i={sortBy:l,toggleSort:r,isSorted:f};return j(We,i),i}function ga(){const e=q(We);if(!e)throw new Error("Missing sort!");return e}function ma(e,l,a,t){const n=Z();return{sortedItems:S(()=>a.value.length?ya(l.value,a.value,n.current.value,{...e.customKeySort,...t==null?void 0:t.value}):l.value)}}function ya(e,l,a,t){const n=new Intl.Collator(a,{sensitivity:"accent",usage:"sort"});return[...e].sort((r,f)=>{for(let i=0;i<l.length;i++){const s=l[i].key,u=l[i].order??"asc";if(u===!1)continue;let o=Y(r.raw,s),v=Y(f.raw,s);if(u==="desc"&&([o,v]=[v,o]),t!=null&&t[s]){const d=t[s](o,v);if(!d)continue;return d}if(o instanceof Date&&v instanceof Date)return o.getTime()-v.getTime();if([o,v]=[o,v].map(d=>d!=null?d.toString().toLocaleLowerCase():d),o!==v)return X(o)&&X(v)?0:X(o)?-1:X(v)?1:!isNaN(o)&&!isNaN(v)?Number(o)-Number(v):n.compare(o,v)}return 0})}const Qe=T({color:String,sticky:Boolean,multiSort:Boolean,sortAscIcon:{type:H,default:"$sortAsc"},sortDescIcon:{type:H,default:"$sortDesc"},...Bt()},"VDataTableHeaders"),Te=O()({name:"VDataTableHeaders",props:Qe(),setup(e,l){let{slots:a}=l;const{toggleSort:t,sortBy:n,isSorted:r}=ga(),{someSelected:f,allSelected:i,selectAll:s,showSelectAll:u}=te(),{columns:o,headers:v}=ee(),{loaderClasses:d}=Ct(e);function g(V,h){if(!(!e.sticky&&!V.fixed))return{position:"sticky",left:V.fixed?N(V.fixedOffset):void 0,top:e.sticky?`calc(var(--v-table-header-height) * ${h})`:void 0}}function P(V){const h=n.value.find(_=>_.key===V.key);return h?h.order==="asc"?e.sortAscIcon:e.sortDescIcon:e.sortAscIcon}const{backgroundColorClasses:p,backgroundColorStyles:m}=Ft(e,"color"),y=S(()=>({headers:v.value,columns:o.value,toggleSort:t,isSorted:r,sortBy:n.value,someSelected:f.value,allSelected:i.value,selectAll:s,getSortIcon:P})),k=V=>{let{column:h,x:_,y:A}=V;const z=h.key==="data-table-select"||h.key==="data-table-expand";return c(ve,C({tag:"th",align:h.align,class:["v-data-table__th",{"v-data-table__th--sortable":h.sortable,"v-data-table__th--sorted":r(h),"v-data-table__th--fixed":h.fixed},d.value],style:{width:N(h.width),minWidth:N(h.minWidth),...g(h,A)},colspan:h.colspan,rowspan:h.rowspan,onClick:h.sortable?()=>t(h):void 0,fixed:h.fixed,lastFixed:h.lastFixed,noPadding:z},h.headerProps),{default:()=>{var w;const b=`header.${h.key}`,x={column:h,selectAll:s,isSorted:r,toggleSort:t,sortBy:n.value,someSelected:f.value,allSelected:i.value,getSortIcon:P};return a[b]?a[b](x):h.key==="data-table-select"?((w=a["header.data-table-select"])==null?void 0:w.call(a,x))??(u&&c(fe,{modelValue:i.value,indeterminate:f.value&&!i.value,"onUpdate:modelValue":s},null)):c("div",{class:"v-data-table-header__content"},[c("span",null,[h.title]),h.sortable&&c(ue,{key:"icon",class:"v-data-table-header__sort-icon",icon:P(h)},null),e.multiSort&&r(h)&&c("div",{key:"badge",class:["v-data-table-header__sort-badge",...p.value],style:m.value},[n.value.findIndex(D=>D.key===h.key)+1])])}})};G(()=>c(W,null,[a.headers?a.headers(y.value):v.value.map((V,h)=>c("tr",null,[V.map((_,A)=>c(k,{column:_,x:A,y:h},null))])),e.loading&&c("tr",{class:"v-data-table-progress"},[c("th",{colspan:o.value.length},[c(At,{name:"v-data-table-progress",absolute:!0,active:!0,color:typeof e.loading=="boolean"?void 0:e.loading,indeterminate:!0},{default:a.loader})])])]))}}),ba=T({groupBy:{type:Array,default:()=>[]}},"DataTable-group"),Xe=Symbol.for("vuetify:data-table-group");function ha(e){return{groupBy:M(e,"groupBy")}}function pa(e){const{groupBy:l,sortBy:a}=e,t=$(new Set),n=S(()=>l.value.map(u=>({...u,order:u.order??!1})).concat(a.value));function r(u){return t.value.has(u.id)}function f(u){const o=new Set(t.value);r(u)?o.delete(u.id):o.add(u.id),t.value=o}function i(u){function o(v){const d=[];for(const g of v.items)"type"in g&&g.type==="group"?d.push(...o(g)):d.push(g);return d}return o({type:"group",items:u,id:"dummy",key:"dummy",value:"dummy",depth:0})}const s={sortByWithGroups:n,toggleGroup:f,opened:t,groupBy:l,extractRows:i,isGroupOpen:r};return j(Xe,s),s}function Je(){const e=q(Xe);if(!e)throw new Error("Missing group!");return e}function Pa(e,l){if(!e.length)return[];const a=new Map;for(const t of e){const n=Y(t.raw,l);a.has(n)||a.set(n,[]),a.get(n).push(t)}return a}function Ye(e,l){let a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0,t=arguments.length>3&&arguments[3]!==void 0?arguments[3]:"root";if(!l.length)return[];const n=Pa(e,l[0]),r=[],f=l.slice(1);return n.forEach((i,s)=>{const u=l[0],o=`${t}_${u}_${s}`;r.push({depth:a,id:o,key:u,value:s,items:f.length?Ye(i,f,a+1,o):i,type:"group"})}),r}function Ze(e,l){const a=[];for(const t of e)"type"in t&&t.type==="group"?(t.value!=null&&a.push(t),(l.has(t.id)||t.value==null)&&a.push(...Ze(t.items,l))):a.push(t);return a}function xa(e,l,a){return{flatItems:S(()=>{if(!l.value.length)return e.value;const n=Ye(e.value,l.value.map(r=>r.key));return Ze(n,a.value)})}}const Sa=T({item:{type:Object,required:!0}},"VDataTableGroupHeaderRow"),ka=O()({name:"VDataTableGroupHeaderRow",props:Sa(),setup(e,l){let{slots:a}=l;const{isGroupOpen:t,toggleGroup:n,extractRows:r}=Je(),{isSelected:f,isSomeSelected:i,select:s}=te(),{columns:u}=ee(),o=S(()=>r([e.item]));return()=>c("tr",{class:"v-data-table-group-header-row",style:{"--v-data-table-group-header-row-depth":e.item.depth}},[u.value.map(v=>{var d,g;if(v.key==="data-table-group"){const P=t(e.item)?"$expand":"$next",p=()=>n(e.item);return((d=a["data-table-group"])==null?void 0:d.call(a,{item:e.item,count:o.value.length,props:{icon:P,onClick:p}}))??c(ve,{class:"v-data-table-group-header-row__column"},{default:()=>[c(L,{size:"small",variant:"text",icon:P,onClick:p},null),c("span",null,[e.item.value]),c("span",null,[de("("),o.value.length,de(")")])]})}if(v.key==="data-table-select"){const P=f(o.value),p=i(o.value)&&!P,m=y=>s(o.value,y);return((g=a["data-table-select"])==null?void 0:g.call(a,{props:{modelValue:P,indeterminate:p,"onUpdate:modelValue":m}}))??c("td",null,[c(fe,{modelValue:P,indeterminate:p,"onUpdate:modelValue":m},null)])}return c("td",null,null)})])}}),wa=T({expandOnClick:Boolean,showExpand:Boolean,expanded:{type:Array,default:()=>[]}},"DataTable-expand"),et=Symbol.for("vuetify:datatable:expanded");function Va(e){const l=I(e,"expandOnClick"),a=M(e,"expanded",e.expanded,i=>new Set(i),i=>[...i.values()]);function t(i,s){const u=new Set(a.value);s?u.add(i.value):u.delete(i.value),a.value=u}function n(i){return a.value.has(i.value)}function r(i){t(i,!n(i))}const f={expand:t,expanded:a,expandOnClick:l,isExpanded:n,toggleExpand:r};return j(et,f),f}function tt(){const e=q(et);if(!e)throw new Error("foo");return e}const Ia=T({index:Number,item:Object,cellProps:[Object,Function],onClick:se(),onContextmenu:se(),onDblclick:se()},"VDataTableRow"),Da=O()({name:"VDataTableRow",props:Ia(),setup(e,l){let{slots:a}=l;const{isSelected:t,toggleSelect:n}=te(),{isExpanded:r,toggleExpand:f}=tt(),{columns:i}=ee();G(()=>c("tr",{class:["v-data-table__tr",{"v-data-table__tr--clickable":!!(e.onClick||e.onContextmenu||e.onDblclick)}],onClick:e.onClick,onContextmenu:e.onContextmenu,onDblclick:e.onDblclick},[e.item&&i.value.map((s,u)=>{const o=e.item,v=`item.${s.key}`,d={index:e.index,item:o.raw,internalItem:o,value:Y(o.columns,s.key),column:s,isSelected:t,toggleSelect:n,isExpanded:r,toggleExpand:f},g=typeof e.cellProps=="function"?e.cellProps({index:d.index,item:d.item,internalItem:d.internalItem,value:d.value,column:s}):e.cellProps,P=typeof s.cellProps=="function"?s.cellProps({index:d.index,item:d.item,internalItem:d.internalItem,value:d.value}):s.cellProps;return c(ve,C({align:s.align,fixed:s.fixed,fixedOffset:s.fixedOffset,lastFixed:s.lastFixed,noPadding:s.key==="data-table-select"||s.key==="data-table-expand",width:s.width},g,P),{default:()=>{var p,m;return a[v]?a[v](d):s.key==="data-table-select"?((p=a["item.data-table-select"])==null?void 0:p.call(a,d))??c(fe,{disabled:!o.selectable,modelValue:t([o]),onClick:Se(()=>n(o),["stop"])},null):s.key==="data-table-expand"?((m=a["item.data-table-expand"])==null?void 0:m.call(a,d))??c(L,{icon:r(o)?"$collapse":"$expand",size:"small",variant:"text",onClick:Se(()=>f(o),["stop"])},null):Re(d.value)}})})]))}}),at=T({loading:[Boolean,String],loadingText:{type:String,default:"$vuetify.dataIterator.loadingText"},hideNoData:Boolean,items:{type:Array,default:()=>[]},noDataText:{type:String,default:"$vuetify.noDataText"},rowProps:[Object,Function],cellProps:[Object,Function]},"VDataTableRows"),_e=O()({name:"VDataTableRows",inheritAttrs:!1,props:at(),setup(e,l){let{attrs:a,slots:t}=l;const{columns:n}=ee(),{expandOnClick:r,toggleExpand:f,isExpanded:i}=tt(),{isSelected:s,toggleSelect:u}=te(),{toggleGroup:o,isGroupOpen:v}=Je(),{t:d}=Z();return G(()=>{var g,P;return e.loading&&(!e.items.length||t.loading)?c("tr",{class:"v-data-table-rows-loading",key:"loading"},[c("td",{colspan:n.value.length},[((g=t.loading)==null?void 0:g.call(t))??d(e.loadingText)])]):!e.loading&&!e.items.length&&!e.hideNoData?c("tr",{class:"v-data-table-rows-no-data",key:"no-data"},[c("td",{colspan:n.value.length},[((P=t["no-data"])==null?void 0:P.call(t))??d(e.noDataText)])]):c(W,null,[e.items.map((p,m)=>{var V;if(p.type==="group"){const h={index:m,item:p,columns:n.value,isExpanded:i,toggleExpand:f,isSelected:s,toggleSelect:u,toggleGroup:o,isGroupOpen:v};return t["group-header"]?t["group-header"](h):c(ka,C({key:`group-header_${p.id}`,item:p},Ie(a,":group-header",()=>h)),t)}const y={index:m,item:p.raw,internalItem:p,columns:n.value,isExpanded:i,toggleExpand:f,isSelected:s,toggleSelect:u},k={...y,props:C({key:`item_${p.key??p.index}`,onClick:r.value?()=>{f(p)}:void 0,index:m,item:p,cellProps:e.cellProps},Ie(a,":row",()=>y),typeof e.rowProps=="function"?e.rowProps({item:y.item,index:y.index,internalItem:y.internalItem}):e.rowProps)};return c(W,{key:k.props.key},[t.item?t.item(k):c(Da,k.props,t),i(p)&&((V=t["expanded-row"])==null?void 0:V.call(t,y))])})])}),{}}});const lt=T({fixedHeader:Boolean,fixedFooter:Boolean,height:[Number,String],hover:Boolean,...Ce(),...Fe(),...Ae(),...Le()},"VTable"),Be=O()({name:"VTable",props:lt(),setup(e,l){let{slots:a,emit:t}=l;const{themeClasses:n}=$e(e),{densityClasses:r}=Lt(e);return G(()=>c(e.tag,{class:["v-table",{"v-table--fixed-height":!!e.height,"v-table--fixed-header":e.fixedHeader,"v-table--fixed-footer":e.fixedFooter,"v-table--has-top":!!a.top,"v-table--has-bottom":!!a.bottom,"v-table--hover":e.hover},n.value,r.value,e.class],style:e.style},{default:()=>{var f,i,s;return[(f=a.top)==null?void 0:f.call(a),a.default?c("div",{class:"v-table__wrapper",style:{height:N(e.height)}},[c("table",null,[a.default()])]):(i=a.wrapper)==null?void 0:i.call(a),(s=a.bottom)==null?void 0:s.call(a)]}})),{}}}),Ta=T({items:{type:Array,default:()=>[]},itemValue:{type:[String,Array,Function],default:"id"},itemSelectable:{type:[String,Array,Function],default:null},rowProps:[Object,Function],cellProps:[Object,Function],returnObject:Boolean},"DataTable-items");function _a(e,l,a,t){const n=e.returnObject?l:J(l,e.itemValue),r=J(l,e.itemSelectable,!0),f=t.reduce((i,s)=>(s.key!=null&&(i[s.key]=J(l,s.value)),i),{});return{type:"item",key:e.returnObject?J(l,e.itemValue):n,index:a,value:n,selectable:r,columns:f,raw:l}}function Ba(e,l,a){return l.map((t,n)=>_a(e,t,n,a))}function Ca(e,l){return{items:S(()=>Ba(e,e.items,l.value))}}function Fa(e){let{page:l,itemsPerPage:a,sortBy:t,groupBy:n,search:r}=e;const f=$t("VDataTable"),i=S(()=>({page:l.value,itemsPerPage:a.value,sortBy:t.value,groupBy:n.value,search:r.value}));let s=null;Ot(i,()=>{Ee(s,i.value)||((s==null?void 0:s.search)!==i.value.search&&(l.value=1),f.emit("update:options",i.value),s=i.value)},{deep:!0,immediate:!0})}const Aa=T({...at(),width:[String,Number],search:String,...wa(),...ba(),...ta(),...Ta(),...ua(),...ca(),...Qe(),...lt()},"DataTable"),La=T({...Xt(),...Aa(),...Et(),...Me()},"VDataTable"),$a=O()({name:"VDataTable",props:La(),emits:{"update:modelValue":e=>!0,"update:page":e=>!0,"update:itemsPerPage":e=>!0,"update:sortBy":e=>!0,"update:options":e=>!0,"update:groupBy":e=>!0,"update:expanded":e=>!0},setup(e,l){let{attrs:a,slots:t}=l;const{groupBy:n}=ha(e),{sortBy:r,multiSort:f,mustSort:i}=fa(e),{page:s,itemsPerPage:u}=Jt(e),{columns:o,headers:v,sortFunctions:d,filterFunctions:g}=oa(e,{groupBy:n,showSelect:I(e,"showSelect"),showExpand:I(e,"showExpand")}),{items:P}=Ca(e,o),p=I(e,"search"),{filteredItems:m}=Rt(e,P,p,{transform:U=>U.columns,customKeyFilter:g}),{toggleSort:y}=va({sortBy:r,multiSort:f,mustSort:i,page:s}),{sortByWithGroups:k,opened:V,extractRows:h,isGroupOpen:_,toggleGroup:A}=pa({groupBy:n,sortBy:r}),{sortedItems:z}=ma(e,m,k,d),{flatItems:b}=xa(z,n,V),x=S(()=>b.value.length),{startIndex:w,stopIndex:D,pageCount:B,setItemsPerPage:E}=Yt({page:s,itemsPerPage:u,itemsLength:x}),{paginatedItems:ae}=ea({items:b,startIndex:w,stopIndex:D,itemsPerPage:u}),le=S(()=>h(ae.value)),{isSelected:nt,select:rt,selectAll:st,toggleSelect:ot,someSelected:it,allSelected:ut}=da(e,{allItems:P,currentPage:le}),{isExpanded:dt,toggleExpand:ct}=Va(e);Fa({page:s,itemsPerPage:u,sortBy:r,groupBy:n,search:p}),ie({VDataTableRows:{hideNoData:I(e,"hideNoData"),noDataText:I(e,"noDataText"),loading:I(e,"loading"),loadingText:I(e,"loadingText")}});const F=S(()=>({page:s.value,itemsPerPage:u.value,sortBy:r.value,pageCount:B.value,toggleSort:y,setItemsPerPage:E,someSelected:it.value,allSelected:ut.value,isSelected:nt,select:rt,selectAll:st,toggleSelect:ot,isExpanded:dt,toggleExpand:ct,isGroupOpen:_,toggleGroup:A,items:le.value.map(U=>U.raw),internalItems:le.value,groupedItems:ae.value,columns:o.value,headers:v.value}));return G(()=>{const U=De.filterProps(e),ft=Te.filterProps(e),vt=_e.filterProps(e),gt=Be.filterProps(e);return c(Be,C({class:["v-data-table",{"v-data-table--show-select":e.showSelect,"v-data-table--loading":e.loading},e.class],style:e.style},gt),{top:()=>{var K;return(K=t.top)==null?void 0:K.call(t,F.value)},default:()=>{var K,me,ye,be,he,pe;return t.default?t.default(F.value):c(W,null,[(K=t.colgroup)==null?void 0:K.call(t,F.value),c("thead",null,[c(Te,ft,t)]),(me=t.thead)==null?void 0:me.call(t,F.value),c("tbody",null,[(ye=t["body.prepend"])==null?void 0:ye.call(t,F.value),t.body?t.body(F.value):c(_e,C(a,vt,{items:ae.value}),t),(be=t["body.append"])==null?void 0:be.call(t,F.value)]),(he=t.tbody)==null?void 0:he.call(t,F.value),(pe=t.tfoot)==null?void 0:pe.call(t,F.value)])},bottom:()=>t.bottom?t.bottom(F.value):c(W,null,[c(Nt,null,null),c(De,U,{prepend:t["footer.prepend"]})])})}),{}}}),Oa={style:{"min-width":"50px"},class:"text-center"},Na={__name:"Users",setup(e){const l=$({fields:[{type:"email",label:"Email Address",isRequired:!0,value:null},{type:"select",label:"Role",isRequired:!0,options:[{id:"admin",title:"Admin"},{id:"employee",title:"Employee"},{id:"manager",title:"Manager"}],value:null}]}),a=async()=>{var s;l.value.fields=(s=l.value.fields)==null?void 0:s.map(u=>({...u,value:null}))},t=Mt(),n=async({page:s,itemsPerPage:u,sortBy:o})=>{await Ve.get("admin/users",{page:s,itemsPerPage:u,sortBy:o}).then(v=>{var d,g;(d=v==null?void 0:v.data)!=null&&d.length&&(r.value.serverItems=v==null?void 0:v.data,r.value.totalItems=(g=v==null?void 0:v.data)==null?void 0:g.length)})},r=$({loading:!0,search:"",itemsPerPage:10,totalItems:0,page:1,serverItems:[],headers:[{title:"Name",key:"name",align:"start"},{title:"Email",key:"email",align:"start"},{title:"Role",key:"role",align:"center"},{title:"Is Verified",key:"isVerified",align:"center"}],itemsPerPageOption:[{value:10,title:"10"},{value:100,title:"20"},{value:-1,title:"All"}]}),f=async()=>{var u,o,v,d;const s={email:(o=(u=t.dialog.formComponents)==null?void 0:u.fields[0])==null?void 0:o.value,role:(d=(v=t.dialog.formComponents)==null?void 0:v.fields[1])==null?void 0:d.value};await Ve.post("/admin/users",s).then(async g=>{(g==null?void 0:g.status)===200&&(t.showSnackbar("Invitation Link sent Successfully"),await n({page:r.value.page,itemsPerPage:r.value.itemsPerPage,sortBy:"ascending"}),t.closeDialog(),a())})},i=()=>{const s={title:"Add new user with role",content:"",confirmText:"Send Email Verification Link",formComponents:{...l.value},confirmFunction:f};t.showDialog(s)};return Gt(async()=>{await n({page:r.value.page,itemsPerPage:r.value.itemsPerPage,sortBy:"ascending"})}),(s,u)=>(oe(),Ht("div",null,[c(jt,null,{default:R(()=>[c(ke,{cols:"12",md:"8"},{default:R(()=>[c(qt,{modelValue:r.value.search,"onUpdate:modelValue":u[0]||(u[0]=o=>r.value.search=o),placeholder:"Enter search here ..."},null,8,["modelValue"])]),_:1}),c(ke,{cols:"12",md:"4"},{default:R(()=>[c(L,{onClick:i,block:"",color:"primary"},{default:R(()=>[de("+ Add New User")]),_:1})]),_:1})]),_:1}),c($a,{density:"compact","items-per-page":r.value.itemsPerPage,"onUpdate:itemsPerPage":u[1]||(u[1]=o=>r.value.itemsPerPage=o),headers:r.value.headers,"items-length":r.value.totalItems,items:r.value.serverItems,search:r.value.search,"item-value":"name","items-per-page-options":r.value.itemsPerPageOption,page:r.value.page},{"item.role":R(({item:o})=>[c(zt,null,{default:R(()=>[Ut("div",Oa,Re(o==null?void 0:o.role),1)]),_:2},1024)]),"item.isVerified":R(({item:o})=>[o!=null&&o.isVerified?(oe(),we(ue,{key:0,color:"success",icon:"mdi-check-circle"})):(oe(),we(ue,{key:1,color:"error",icon:"mdi-close-circle"}))]),_:1},8,["items-per-page","headers","items-length","items","search","items-per-page-options","page"])]))}};export{Na as default};