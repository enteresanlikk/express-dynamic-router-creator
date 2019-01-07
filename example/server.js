const express=require('express');
const app=express();
const path=require('path');

const DynamicRoute=require('../index').default;
new DynamicRoute(
    app,
    {
        Routers: path.join(__dirname,'routers'),
        Middlewares: path.join(__dirname,'middlewares'),
        Controllers: path.join(__dirname,'controllers')
    },
    ['main.js', 'client.js']
);

app.set('port', 8080);
app.listen(app.get('port'), ()=>{
    console.log('Server started at 8080 port.');
});
