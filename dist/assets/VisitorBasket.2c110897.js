import{d as V,h as u,f as j,r as C,o,a as n,i as t,p as _,t as x,k as e,F as S,j as z,m as K,q as N,s as v,v as h}from"./index.73886189.js";import{u as P}from"./humanity-shop.store.daff031c.js";const R={class:"h-100 d-flex flex-column justify-content-between"},E={class:"h-100 d-flex flex-column justify-content-between basket-list"},I={class:"basket-items-wrapper"},L={class:"d-flex align-items-center"},$=["src"],F={key:0,class:"m-2"},M={key:0,class:"d-flex justify-content-end m-2"},T=["onClick"],q={key:1},D=["onClick"],H=t("span",{class:"font-size-xl"},"\u2612",-1),W=t("span",{class:"font-size-xs"},"eemalda",-1),A=[H,W],G={key:0},J={class:"bottom-fixed d-flex flex-column"},O={key:0,class:"align-items-center justify-content-center d-flex w-100"},Q={key:1,class:"text-bg-success p-2"},U={key:2,class:"align-items-center justify-content-center d-flex w-100"},X=t("a",{class:"btn btn-primary",href:"/visitor/humanity-shop/scan"}," Vajuta, et tootekood skaneerida ",-1),Y=[X],se={__name:"VisitorBasket",setup(Z){var p,y;const g=V(),m=P();let s=u(!1),a=u("");j(async()=>{await m.getVisitorBasket(),await m.fetchProducts()});let d=u(g.getVisitor),r=u((y=(p=d==null?void 0:d.value)==null?void 0:p.basket)==null?void 0:y.products);console.log(r);let l=d.value.basket;async function w(f){console.log(f),s.value=!1,console.log(l.products);let c=l.products.filter(k=>k._id!==f._id);console.log("newBasketProducts",c),await m.updateBasket({...l,products:c}),r=c,a="",location.replace("/visitor/humanity-shop/scan")}return(f,c)=>{const k=C("RouterLink");return o(),n("div",R,[t("div",E,[_(" Korvis hetkel "+x(e(r).length||0)+" toodet. ",1),t("div",I,[(o(!0),n(S,null,z(e(r),(i,B)=>(o(),n("div",{key:i._id+B,class:"hover basket-item"},[t("div",L,[t("img",{src:i.image,alt:"",height:"90"},null,8,$),!(e(s)&&e(a)===i._id)||!e(s)?(o(),n("span",F,x(i.title),1)):v("",!0)]),e(s)&&e(a)===i._id?(o(),n("div",M,[_(" Kindel, et eemaldad toote? "),t("button",{class:"btn btn-outline-primary m-1 font-size-xs",onClick:c[0]||(c[0]=b=>{h(s)?s.value=!1:s=!1,h(a)?a.value="":a=""})}," Ei "),t("button",{class:"btn btn-primary m-1 font-size-xs",onClick:b=>w(i)}," Eemalda toode ",8,T)])):(o(),n("div",q,[t("button",{class:"btn d-flex flex-column",onClick:b=>{h(s)?s.value=!0:s=!0,h(a)?a.value=i._id:a=i._id}},A,8,D)]))]))),128))]),e(l)&&e(l).confirmed?(o(),n("div",G,[_(" Su korv on juba kinnitatud. "),K(k,{to:{name:"home"}},{default:N(()=>[_("Vaata")]),_:1})])):v("",!0)]),t("div",J,[e(l).products.length===0?(o(),n("div",O," Su korvis pole veel tooteid. ")):v("",!0),e(l).products.length===9?(o(),n("div",Q," Korvi mahub 9 toodet. Kui tahad veel midagi lisada, pead millestki loobuma. ")):(o(),n("div",U,Y))])])}}};export{se as default};
