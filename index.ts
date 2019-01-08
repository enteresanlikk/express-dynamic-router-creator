//Libraries
import {default as colors} from './colors';

export default class DynamicRoute {
    private App: any;
    private Folders: FolderModel;
    private RouteFiles: Array<string> = [];
    private Info: boolean = true;

    /*
     * Modül ayarları yapılıyor.
     */
    constructor(App: any = null, Folders: FolderModel, RouteFiles: string[] = [], Info: boolean = true) {
        this.App = App;
        this.Folders = Folders;
        this.RouteFiles = RouteFiles;
        this.Info = Info;

        try {
            this.ImportFiles();
        } catch(e) {
            console.log(colors.red(e));
        }
    }

    /*
     * Routing dosyaları dahil ediliyor.
     */
    private ImportFiles() {
        try {

            if(!this.Folders.Controllers) {
                throw new Error("Controllers folder not found!");
            }
            if(!this.Folders.Routers) {
                throw new Error("Routers folder not found!");
            }
            //Main Routes File Included
            if(this.Folders.Routers) {
                this.RouteFiles.map(file =>{
                    this.log(colors.blue(colors.underline(file)));
                    let tempRoutes = require(this.Folders.Routers+'\/'+file);
                    this.SetMainRouting(tempRoutes);
                });
            }
        } catch(e) {
            console.log(colors.red(e));
        }
    }

    /*
     * Ana url ayarlanıyor.
     */
    private FinishedRoutes: Array<RoutesModel> = [];
    private SetMainRouting(Route: Array<RoutesModel>) {
        try {
            this.EditRoutesIds(Route);
            this.EditRoutes(Route);
            // this.FinishedRoutes.sort((a, b)=>  a.Method > b.Method);
            this.SetRouting(this.FinishedRoutes);
            this.log('');
            this.FinishedRoutes = [];
        } catch(e) {
            console.log(colors.red(e));
        }
    }


    /*
     * url ler düzenlenecek. Group lar direk objeye dönüşecek.
     */
    private routeIds: number[] = [];
    private routeId: number = 0;
    private EditRoutesIds(Routes: Array<RoutesModel>) {
        for(var index in Routes) {
            let route = Routes[index];
            if(route.Routes) {
                this.routeIds.push(this.routeId);
                route.Id = this.routeId;
                this.EditRoutesIds(route.Routes);
                this.routeIds.pop();
            } else {
                if ( this.routeIds.length > 0) {
                    route.ParentIds = this.routeIds.join(',');
                }
            }
            this.routeId++;
        }
    }

    private groupRoute: Array<RoutesModel> = [];
    private EditRoutes(Routes: Array<RoutesModel>) {
        for(var index in Routes) {
            let route = Routes[index];
            if(route.Routes) {
                this.groupRoute.push(route);
                this.EditRoutes(route.Routes);
                this.groupRoute.pop();
            } else {
                if(typeof route.Middlewares === 'undefined') { 
                    route.Middlewares = [];
                }

                if(route.ParentIds) {
                    let routeParentIds: string[] = route.ParentIds.split(',');
                    let routeUrls: string[] = [];
                    this.groupRoute.forEach(item => {
                        if(routeParentIds.indexOf(item.Id.toString()) > -1 ) {
                            routeUrls.push(item.Url);
                            if(typeof item.Middlewares !== 'undefined') { 
                                item.Middlewares.forEach(mid => {
                                    route.Middlewares.push(mid);
                                });
                            }
                        }
                    });

                    let organizedMiddlewares = route.Middlewares.filter((a, b, c)=>{
                        return c.indexOf(a)=== b;
                    });

                    route.Middlewares = organizedMiddlewares;

                    if(!route.OptionsMiddlewares) {
                        for(let i=0; i<this.groupRoute.length;i++) {
                            if (typeof this.groupRoute[i].OptionsMiddlewares !== 'undefined') {
                                route.OptionsMiddlewares = this.groupRoute[i].OptionsMiddlewares;
                                break;
                            }
                        }
                    }

                    if(!route.Controller) {
                        for(let i=this.groupRoute.length-1; i >= 0;i--) {
                            if (typeof this.groupRoute[i].Controller !== 'undefined') {
                                route.Controller = this.groupRoute[i].Controller;
                                break;
                            }
                        }
                    }

                    if(!route.Action) {
                        for(let i=this.groupRoute.length-1; i >= 0;i--) {
                            if (typeof this.groupRoute[i].Action !== 'undefined') {
                                route.Action = this.groupRoute[i].Action;
                                break;
                            }
                        }
                    }

                    if(!route.Method) {
                        for(let i=this.groupRoute.length-1; i>=0;i--) {
                            if (typeof this.groupRoute[i].Method !== 'undefined') {
                                route.Method = this.groupRoute[i].Method;
                                break;
                            }
                        }
                    }

                    if(typeof this.groupRoute[0].Status !== 'undefined') {
                        route.Status = this.groupRoute[0].Status;
                    }
                    

                    routeUrls = routeUrls.filter(url => url);
                    route.Url = routeUrls.length > 0 ? routeUrls.join('/') + (route.Url ? '/'+route.Url: '') : '';

                    delete route.ParentIds;
                }

                if(typeof route.Status === 'undefined') {
                    route.Status = true;
                }

                this.FinishedRoutes.push(route);
            }
        }
    }

    /*
     * Method kontrolü yapılıyor.
     */
    private RouteMethodControl(method: string) {
        switch(method) {
            case 'get':
            case 'post':
            case 'put':
            case 'delete':
            case 'options':
            case 'patch':
            case 'copy':
            case 'head':
            case 'link':
            case 'unlink':
            case 'purge':
                return true;
            default:
                return false;
        }
    }

    /*
     * Gerekli url işlemleri burada yapılıyor.
     */
    private SetRouting(Routes: Array<RoutesModel>) {
        try {
            Routes.map((route, index) => {
                let hasMethod: boolean = this.RouteMethodControl(route.Method.toLowerCase());
                if(hasMethod) {
                    if(route.Status) {
                        //Route işlemleri burada yapılacak
                        let FullControllerPath = this.Folders.Controllers+'/'+route.Controller;
                        let MiddlewaresFolder = this.Folders.Middlewares;

                        if (route.OptionsMiddlewares) {
                            this.App.use(`${this.getFullUrl(route.Url)}*`, 
                                route.OptionsMiddlewares.map(mid => {
                                    if(typeof mid === 'function') {
                                        return mid
                                    }else{
                                        return require(MiddlewaresFolder+'/'+mid)
                                    }
                                })
                            );
                            this.routeLog(route.Method, route.Url, route.Controller, route.Action, route.Middlewares, route.OptionsMiddlewares);
                        } else {
                            this.routeLog(route.Method, route.Url, route.Controller, route.Action, route.Middlewares, route.OptionsMiddlewares);
                        }

                        this.App[`${route.Method.toLowerCase()}`](`${this.getFullUrl(route.Url)}`,
                            route.Middlewares.map(mid=> {
                                if(typeof mid === 'function'){
                                    return mid
                                }else{
                                    return require(MiddlewaresFolder+'/'+mid)
                                }
                            })
                            ,require(`${FullControllerPath}`)[`${route.Action}`]);

                    } else {
                        this.routeLog(route.Method, route.Url, route.Controller, route.Action, route.Middlewares, route.OptionsMiddlewares, 'Passive');
                    }
                } else {
                    this.routeLog(route.Method, route.Url, route.Controller, route.Action, route.Middlewares, route.OptionsMiddlewares, 'Method error');
                }
            });
        } catch(e) {
            console.log(colors.red(e));
        }
    }

    /*
     * Bilgi isteniyorsa burada kontrol edilip yazdırılıyor.
     */
    private log(text: any) {
        if(this.Info)
            console.log(text);
    }

    /*
     * Rıutelar için bilgiler console a basılıyor.
     */
    private routeLog(method: string, url: string, controller: string, action: string, middlewares: any[], optionsMiddlewares: any[], error: string = '') {
        let text: string = `${error ? `[${colors.red(`${method}`)}]` : `[${colors.green(`${method}`)}]`} ${colors.cyan(this.getFullUrl(url))} ${colors.yellow(`${controller}`)}@${colors.yellow(`${action}`)}`;
        if(middlewares.length > 0) {
            text+= ' '+colors.underline(colors.green('Middleware'+(middlewares.length > 1 ? 's':'')));
            text += ' -> '+middlewares.join(',');
        }
        if(optionsMiddlewares && optionsMiddlewares.length > 0) {
            text+= ' -> '+colors.blue('Options Middleware'+(optionsMiddlewares.length > 1 ? 's':''));
        }
        if(error) {
            text += colors.red(' -> '+error);
        }
        this.log(text);
    }

    /*
     * Ana url ile route url i birleştiriliyor.
     */
    private getFullUrl(url: string = '') {
        return url ? '/'+url : '/';
    }
}

/*
* Modeller
*/

interface FolderModel {
    Routers: string;
    Middlewares: string;
    Controllers: string;
}

interface RoutesModel {
    Id: number;
    ParentIds: string;
    Method: string;
    Url: string;
    Controller: string;
    Action: string;
    Middlewares: any[];
    OptionsMiddlewares: any[];
    Status: boolean;
    Routes: Array<RoutesModel>;
}