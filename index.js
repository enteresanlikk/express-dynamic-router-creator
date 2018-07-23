//Variables
const fs=require('fs');

let Routes=[];

let newRootUrl='';
let newVersionText='';
let newVersionNumber;
let newVersion='';
let newRootMiddleware='';

let newRoutes =[];

let ApiUrl='';

let OldGroupUrl=[],
    NewGroupUrl='',
    Dir='';

let newApp, newDir=process.cwd(), newMiddlewares='', newControllers='', newLog=false;

ImportFile=(options)=>{
    const {
        mainFile,
        folders:{
            routers
        }
    } = options;

    Routes=require(newDir+'\/'+routers+'\/'+mainFile);

    setVariables(options,Routes);
    List(Routes.routes);
}

setVariables=({app,folders:{middlewares,controllers},log}, Routes)=>{
    let {rootUrl,version,routes,middleware} = Routes;

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
            middleware=middleware.toString();
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

List=(routeList)=>{

    const MiddlewareFolder=newDir+'/'+newMiddlewares+'/';
    const ControllerFolder=newDir+'/'+newControllers+'/';

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

                    let AllRouteMiddlewares=SetMiddlewares(middleware);

                    if(newLog){
                        console.log(`[${method}] ${FullUrl} ${controller}@${action} ${(AllRouteMiddlewares.length>0 ? ((AllRouteMiddlewares.length>1) ? '| Middlewares - '+AllRouteMiddlewares.toString() : '| Middleware - '+AllRouteMiddlewares.toString()) : '')}`);
                    }

                    if(AllRouteMiddlewares){

                        newApp[method](`${FullUrl}`
                            ,(typeof AllRouteMiddlewares==='object')
                                ?  AllRouteMiddlewares.map(mid=>{
                                    return require(MiddlewareFolder+mid)
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
            OldGroupUrl.push(route.groupUrl);
            List(route.groupRoutes,Dir);
            OldGroupUrl=[];
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