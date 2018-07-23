const express=require('express');
const app=express();

const DynamicRoute=require("./module/index");

DynamicRoute.Config({
    app:app,
    folders:{
        routers:'routers',
        middlewares:'middlewares',
        controllers:'controllers'
    },
    mainFile:'main.js',
    log:true
});

app.listen(3000);
