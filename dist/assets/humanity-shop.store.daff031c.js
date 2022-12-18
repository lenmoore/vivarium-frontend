import{x as r,y as c,d as o}from"./index.73886189.js";class i{async fetchProducts(){return await r.get("/products").then(({data:t})=>t)}async fetchBaskets(){return await r.get("/baskets").then(({data:t})=>t)}async fetchProductById(t){return await r.get(`/products/${t}`).then(({data:s})=>s)}}const n=new i;class d{async getBasketByVisitorId(t){return await r.get(`/baskets/visitor/${t}`).then(({data:s})=>s)}async updateBasket(t){return await r.put(`/baskets/${t.basketId}`,t).then(({data:s})=>s)}async updateProduct(t){return console.log(t),await r.put(`/products/${t.productId}`,t).then(({data:s})=>s)}async updateProductFuchsia(t,s){return console.log(s),await r.put(`/products/${s.productId}`,{...s,humanity_values:{...s.humanity_values,fuchsia:t}}).then(({data:u})=>u)}}const a=new d,y=c({id:"humanity-shop",state:()=>({products:[],baskets:[]}),getters:{getProducts:e=>e.products,getBaskets:e=>e.baskets},actions:{async getProductById(e){return await n.fetchProductById(e)},async fetchProducts(){this.products=await n.fetchProducts()},async fetchBaskets(){this.baskets=await n.fetchBaskets()},async getVisitorBasket(){const e=o();return console.log("visitorStore.getVisitor._id",e.getVisitor._id),await a.getBasketByVisitorId(e.getVisitor._id).then(t=>(e.visitor.basket=t,t))},async updateBasket(e){return await a.updateBasket(e)},async updateProduct(e){return console.log(e),await a.updateProduct(e)},async updateProductFuchsia(e,t){return console.log(t),await a.updateProductFuchsia(e,t)}},persist:!0});export{y as u};
