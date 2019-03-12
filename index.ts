//Libraries
import {default as colors} from './colors';

class DynamicRoute {
    private App: any;
    private Folders: FolderModel;
    private RouteFiles: Array<string> = [];
    private Info: boolean = true;

    /*
     * Modül ayarları yapılıyor.
     */
    public Config(App: any = null, Folders: FolderModel, RouteFiles: string[] = [], Info: boolean = true) {
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
    private AllRoutes: Array<RoutesModel> = [];
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
                route.Key = route.Key || '';
                route.Middlewares = typeof route.Middlewares === 'function' ? [route.Middlewares] : (route.Middlewares || []);

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

                route.Url = '/'+route.Url;

                this.FinishedRoutes.push(route);
                this.AllRoutes.push(route);
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
                            this.App.use(`${route.Url}/*`, 
                                route.OptionsMiddlewares.map(mid => {
                                    if(typeof mid === 'function') {
                                        return mid
                                    }else{
                                        return require(MiddlewaresFolder+'/'+mid)
                                    }
                                })
                            );
                        }

                        if(typeof route.Action === 'function') {
                            this.routeLog(route.Method, route.Key, route.Url, '', '', route.Middlewares, route.OptionsMiddlewares, '', 'Inline Code');
                        } else {
                            this.routeLog(route.Method, route.Key, route.Url, route.Controller, route.Action, route.Middlewares, route.OptionsMiddlewares);
                        }

                        this.App[`${route.Method.toLowerCase()}`](`${route.Url}`,
                            route.Middlewares.map(mid=> {
                                if(typeof mid === 'function') {
                                    return mid
                                } else {
                                    return require(MiddlewaresFolder+'/'+mid)
                                }
                            })
                            , (typeof route.Action === 'function' ? route.Action : require(`${FullControllerPath}`)[`${route.Action}`]) );

                    } else {
                        this.routeLog(route.Method, route.Key, route.Url, route.Controller, route.Action, route.Middlewares, route.OptionsMiddlewares, 'Passive');
                    }
                } else {
                    this.routeLog(route.Method, route.Key, route.Url, route.Controller, route.Action, route.Middlewares, route.OptionsMiddlewares, 'Method error');
                }
            });
        } catch(e) {
            console.log(e);
            console.log(colors.red(e));
        }
    }

    private Search(key: string, value: string, array: Array<RoutesModel>) {
        let retVal = <RoutesModel>{
            Key: '',
            Method: '',
            Url: '',
            Controller: '',
            Action: '',
            Status: null
        };

        for(let i=0; i < array.length; i++) {
            let elem = array[i];
            if(elem[key] == value) {
                delete elem.OptionsMiddlewares;
                delete elem.Middlewares;
                return elem;
            }
        }
        return retVal;
    }

    public get(key: string, value?: string) {
        if(value) {
            return this.Search(key, value, this.AllRoutes);
        } else {
            return this.Search('Key', key, this.AllRoutes);
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
     * Routelar için bilgiler console a basılıyor.
     */
    private routeLog(method: string, key: string, url: string, controller: string, action: string, middlewares: any[], optionsMiddlewares: any[], error: string = '', codeInfo: string = '') {
        let text: string = `${error ? `[${colors.red(`${method}`)}]` : (codeInfo ? `[${colors.cyan(`${method}`)}]` : `[${colors.green(`${method}`)}]`) }${key ? `[${key}]` : ''} ${colors.cyan(url)}`;
        text += controller && action ? ` ${colors.yellow(`${controller}`)}@${colors.yellow(`${action}`)}` : '';
        if(middlewares.length > 0) {
            text+= ' '+colors.underline(colors.green('Middleware'+(middlewares.length > 1 ? 's':'')));
            
            let midStr: string = '';
            middlewares.map((mid, i) => {
                if(typeof mid === 'function') {
                    midStr += `Function${i}`;
                } else {
                    midStr += `${mid}`;
                }
                midStr += middlewares.length-1 !== i ? ', ': '';
            });
            text += ` -> ${midStr}`;
        }
        if(optionsMiddlewares && optionsMiddlewares.length > 0) {
            text+= ' -> '+colors.blue('Options Middleware'+(optionsMiddlewares.length > 1 ? 's':''));
        }
        if(error) {
            text += colors.red(' -> '+error);
        }
        if(codeInfo) {
            text += colors.cyan(' -> '+codeInfo);
        }
        this.log(text);
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
    Key: string;
    Method: string;
    Url: string;
    Controller: string;
    Action: any;
    Middlewares: any[];
    OptionsMiddlewares: any[];
    Status: boolean;
    Routes: Array<RoutesModel>;
}

export default new DynamicRoute;