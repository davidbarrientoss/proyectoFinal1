const express=require("express")
const app=express()

let PORT=process.env.PORT||8080

const server=app.listen(PORT,()=>console.log("listening"))

let productRouter=require("./routes/products")
app.use("/api/productos",productRouter)

let cartRouter=require("./routes/shoppingCart")
app.use("/api/carrito",cartRouter)
