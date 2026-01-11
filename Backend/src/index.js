import dotenv from "dotenv";

// const result = dotenv.config({ debug: true });
// console.log("DOTENV RESULT:", result);
// console.log("CWD:", process.cwd());
// console.log("API KEY:", process.env.CLOUDINARY_API_KEY);

import connectDB from "./db/index.js";
import {app} from './app.js'


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,() =>{
        console.log(` Server is running on the port: ${process.env.PORT}`);
    })
})
.catch((err) =>{
    console.log(" MONGODB DATABASE CONNECTION FAILED !!",err);
})
