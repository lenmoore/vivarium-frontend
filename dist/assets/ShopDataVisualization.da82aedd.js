import{y as r,x as i,b7 as c,o as u,a as l,p as _,i as a,t as d,k as p}from"./index.73886189.js";const m=r("dataVis",{state:()=>({productsQuestionnaireResults:[]}),getters:{},actions:{async getQuestionnaireResultsFromCSV(){return await i.get("/products-vis").then(e=>e)}}}),h=a("h1",null,"data vis",-1),g={__name:"ShopDataVisualization",async setup(e){let t,s;const{getQuestionnaireResultsFromCSV:n}=m(),o=([t,s]=c(()=>n()),t=await t,s(),t);return(V,S)=>(u(),l("div",null,[h,_(" hello: "),a("div",null,d(p(o)),1)]))}};export{g as default};
