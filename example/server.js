const express=require('express');
const app=express();

const DynamicRoute=require("express-dynamic-router-creator");

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
