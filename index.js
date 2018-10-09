//Variables
const fs=require('fs');
const colors = require('colors');

let Routes=[];

let newRootUrl='';
let newVersionText='';
let newVersionNumber;
let newVersion='';
let newRootMiddleware='';
let newRouteFile='';

let newRoutes =[];

let ApiUrl='';

let OldGroupUrl=[],
    NewGroupUrl='',
    Dir='';

let newApp, newMiddlewares='', newControllers='', newLog=false;

let thisIsLogin=false;

ImportFile=(options)=>{
    const {
        mainFile,
        folders:{
            routers
        }
    } = options;

    if(typeof mainFile==='object'){
        mainFile.map(file=>{
            Routes=require(routers+'\/'+file);
            setVariables(options,Routes,file);
            List(Routes.routes);
            thisIsLogin=false;
        });
    }else{
        Routes=require(routers+'\/'+mainFile);
        setVariables(options,Routes,mainFile);
        thisIsLogin=true;
        List(Routes.routes);
    }
}

setVariables=({app,folders:{middlewares,controllers},log}, Routes, RouteFile)=>{
    newVersionText='';
    newVersionNumber='';
    newVersion='';
    let {rootUrl, version, routes, middleware, optionsMiddleware} = Routes;

    newApp=app;

    newRootMiddleware=middleware;

    newRootUrl=rootUrl ? '/'+rootUrl : '';

    if(version){
        newVersionText=version.text ? version.text : '';
        newVersionNumber=version.number ? version.number : '';
        newVersion= (newVersionText || newVersionNumber) ? '/'+newVersionText+newVersionNumber : '' ;
    }

    newRoutes=routes ? routes : [];
    ApiUrl=newRootUrl+newVersion;

    newMiddlewares=middlewares;
    newControllers=controllers;
    newLog=log;
    //Set Opitons Middleware
    if(optionsMiddleware && typeof optionsMiddleware !== 'undefined'){
        const optionsMiddlewareType=typeof optionsMiddleware;
        switch(optionsMiddlewareType){
            case 'string':
            case 'object':
                const MiddlewareFolder=newMiddlewares && newMiddlewares!='' ? newMiddlewares+'/' : '';
                if(MiddlewareFolder!=''){
                    newApp.use(`${ApiUrl}*`
                                ,(typeof optionsMiddleware==='object')
                                    ?  optionsMiddleware.map(mid=>{
                                        if(typeof mid !== 'undefined'){
                                            if(typeof mid === 'function'){
                                                return mid
                                            }else{
                                                return require(MiddlewareFolder+mid)
                                            }
                                        }
                                    })
                                    : require(MiddlewareFolder+optionsMiddleware));
                }
            break;
            case 'function':
                newApp.use(`${ApiUrl}*`, optionsMiddleware);
            break;
        }
    }
    //Set Opitons Middleware

    newRouteFile=RouteFile;
}

SetMiddlewares=(middleware)=>{
    let AllRouteMiddlewares=[];
    
    if(newRootMiddleware || middleware){
        if(newRootMiddleware){
            newRootMiddleware=newRootMiddleware.toString();
        }else{
            newRootMiddleware='';
        }

        if(middleware){
            if(typeof middleware ==='function'){
                middleware=middleware;
            }else{
                middleware=middleware.toString();
            }
        }else{
            middleware='';
        }
    }

    if(newRootMiddleware &&  middleware){
        
        let test=(newRootMiddleware+','+middleware).split(',');
        AllRouteMiddlewares=test;
    }else if(newRootMiddleware){
        AllRouteMiddlewares=(newRootMiddleware).split(',');
    }else if(middleware){
        AllRouteMiddlewares=(middleware).split(',');
    }



    AllRouteMiddlewares=AllRouteMiddlewares.filter((a,b,c)=>{
        return c.indexOf(a)=== b;
    });

    return AllRouteMiddlewares;
}

let groupMiddleware;

List=(routeList)=>{

   
    const MiddlewareFolder=newMiddlewares && newMiddlewares!='' ? newMiddlewares+'/' : '';
    const ControllerFolder=newControllers+'/';

    routeList.map(route=>{
        let keys=Object.keys(route);
        if(keys.join(',').indexOf('group')==-1){
            NewGroupUrl=OldGroupUrl.length>0 ? '/'+OldGroupUrl.join('/') : '';

            let {
                url,
                controller,
                action,
                method,
                middleware
            } = route;
            method=method.toLowerCase();


            let FullUrl=ApiUrl+NewGroupUrl+(url ? '/'+url : '');
            let FullControllerPath=ControllerFolder+controller;

            if(fs.existsSync(FullControllerPath+'.js')){
                if(typeof require(`${FullControllerPath}`)[`${action}`] !=='undefined'){

                    //Middleware List(s)
                    let AllRouteMiddlewares=[]
                    let groupMiddArray=[];
                    if(MiddlewareFolder!=''){
                        AllRouteMiddlewares=SetMiddlewares(middleware);
                        if(groupMiddleware!=''){
                            if(typeof groupMiddleware === 'string'){
                                AllRouteMiddlewares.push(groupMiddleware);
                            }else if(typeof groupMiddleware === 'object'){
                                for(let i=0;i<groupMiddleware.length;i++){
                                    groupMiddArray.push(groupMiddleware[i]);
                                }
                                AllRouteMiddlewares=SetMiddlewares(groupMiddArray);
                            }
                        }
                    }
                    AllRouteMiddlewares=AllRouteMiddlewares.filter((a,b,c)=>{
                        return c.indexOf(a)=== b;
                    });
                    //Middleware List(s)

                    if(newLog){
                        if(!thisIsLogin){
                            console.log(`\n${colors.magenta.underline(newRouteFile)}`);
                            thisIsLogin=true;
                        }else{
                            thisIsLogin=true;
                        }
                        console.log(`[${colors.green(method)}] ${colors.cyan(FullUrl)} ${colors.yellow(controller)}@${colors.yellow(action)} ${colors.cyan((AllRouteMiddlewares.length>0 && MiddlewareFolder!='' ? ((AllRouteMiddlewares.length>1) ? '| Middlewares - '+AllRouteMiddlewares.toString() : '| Middleware - '+AllRouteMiddlewares.toString()) : ''))}`);
                    }

                    if(AllRouteMiddlewares.length>0 && MiddlewareFolder!=''){

                        newApp[method](`${FullUrl}`
                            ,(typeof AllRouteMiddlewares==='object')
                                ?  AllRouteMiddlewares.map(mid=>{
                                    if(typeof mid === 'function'){
                                        return mid
                                    }else{
                                        return require(MiddlewareFolder+mid)
                                    }
                                })
                                : require(MiddlewareFolder+AllRouteMiddlewares)
                            ,require(`${FullControllerPath}`)[`${action}`]);
                    }else{
                        newApp[method](`${FullUrl}`,require(`${FullControllerPath}`)[`${action}`]);
                    }


                }else{
                    console.log(`[${method}]`,FullUrl,action,"Action Error in",controller);
                }
            }else{
                console.log(`[${method}]`,FullUrl," Controller Error");
            }

        }else{
            if(route.groupUrl && route.groupUrl !== ''){
                OldGroupUrl.push(route.groupUrl);
            }
            if(route.middleware){
                groupMiddleware=route.middleware;
            }
            List(route.groupRoutes,Dir);
            OldGroupUrl=[];
            groupMiddleware='';
        }
    });
}

class Index {
    constructor(){
        this.Config=this.Config.bind(this);
    }

    Config(options){
        ImportFile(options);
    }
}

module.exports = new Index();