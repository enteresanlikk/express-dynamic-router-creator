const express=require('express');
const app=express();
const path=require('path');

const DynamicRoute=require("../index");

DynamicRoute.Config({
    app:app,
    folders:{
        routers:path.join(__dirname,'routers'),
        middlewares:path.join(__dirname,'middlewares'),
        controllers:path.join(__dirname,'controllers')
    },
    mainFile:['main.js','root.js','test.js'], //OR 'main.js'
    log:true
});

app.listen(8080, ()=>{
    console.log('Server started at 8080 port.');
});
