
require("module-alias/register")
const express=require("express")
const http = require("http")
const cors=require("cors")
const connectDB=require("@config/Database")
const {HOST,PORT}=require("@config/index")
const ResponseHandlerMiddleware=require("@middlewares/ResposeHandler")
const ErrorHandlerMiddleware=require("@middlewares/ErrorHandler")
const authorisationMiddleware=require("@middlewares/Authorisation")
const UserRoutes=require("@routes/userRoutes")
const StudentRoutes=require("@routes/studentRoutes/Routes")
const { NotFoundError } = require("@/utility/errors");





const app=express()
connectDB()


app.use(cors())
app.use(express.json());
app.use(ResponseHandlerMiddleware)
app.use(authorisationMiddleware)
// Route handler middlewares
app.use("/user",UserRoutes)
app.use("/students",StudentRoutes)


app.use((req,res,next)=>{
    const error=new NotFoundError("No valid routes present")
    next(error)
})


app.use(ErrorHandlerMiddleware)

app.listen(PORT,()=>{
    console.log(`server is listening at. the port ${PORT} on ${HOST}`)
})




