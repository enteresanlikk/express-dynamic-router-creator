"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Libraries
var colors_1 = require("./colors");
var DynamicRoute = /** @class */ (function () {
    function DynamicRoute() {
        this.RouteFiles = [];
        this.Info = true;
        /*
         * Ana url ayarlanıyor.
         */
        this.FinishedRoutes = [];
        this.AllRoutes = [];
        /*
         * url ler düzenlenecek. Group lar direk objeye dönüşecek.
         */
        this.routeIds = [];
        this.routeId = 0;
        this.groupRoute = [];
    }
    /*
     * Modül ayarları yapılıyor.
     */
    DynamicRoute.prototype.Config = function (App, Folders, RouteFiles, Info) {
        if (App === void 0) { App = null; }
        if (RouteFiles === void 0) { RouteFiles = []; }
        if (Info === void 0) { Info = true; }
        this.App = App;
        this.Folders = Folders;
        this.RouteFiles = RouteFiles;
        this.Info = Info;
        try {
            this.ImportFiles();
        }
        catch (e) {
            console.log(colors_1.default.red(e));
        }
    };
    /*
     * Routing dosyaları dahil ediliyor.
     */
    DynamicRoute.prototype.ImportFiles = function () {
        var _this = this;
        try {
            if (!this.Folders.Controllers) {
                throw new Error("Controllers folder not found!");
            }
            if (!this.Folders.Routers) {
                throw new Error("Routers folder not found!");
            }
            //Main Routes File Included
            if (this.Folders.Routers) {
                this.RouteFiles.map(function (file) {
                    _this.log(colors_1.default.blue(colors_1.default.underline(file)));
                    var tempRoutes = require(_this.Folders.Routers + '\/' + file);
                    _this.SetMainRouting(tempRoutes);
                });
            }
        }
        catch (e) {
            console.log(colors_1.default.red(e));
        }
    };
    DynamicRoute.prototype.SetMainRouting = function (Route) {
        try {
            this.EditRoutesIds(Route);
            this.EditRoutes(Route);
            // this.FinishedRoutes.sort((a, b)=>  a.Method > b.Method);
            this.SetRouting(this.FinishedRoutes);
            this.log('');
            this.FinishedRoutes = [];
        }
        catch (e) {
            console.log(colors_1.default.red(e));
        }
    };
    DynamicRoute.prototype.EditRoutesIds = function (Routes) {
        for (var index in Routes) {
            var route = Routes[index];
            if (route.Routes) {
                this.routeIds.push(this.routeId);
                route.Id = this.routeId;
                this.EditRoutesIds(route.Routes);
                this.routeIds.pop();
            }
            else {
                if (this.routeIds.length > 0) {
                    route.ParentIds = this.routeIds.join(',');
                }
            }
            this.routeId++;
        }
    };
    DynamicRoute.prototype.EditRoutes = function (Routes) {
        var _loop_1 = function () {
            var route = Routes[index];
            if (route.Routes) {
                this_1.groupRoute.push(route);
                this_1.EditRoutes(route.Routes);
                this_1.groupRoute.pop();
            }
            else {
                route.Key = route.Key || '';
                route.Middlewares = typeof route.Middlewares === 'function' ? [route.Middlewares] : (route.Middlewares || []);
                if (route.ParentIds) {
                    var routeParentIds_1 = route.ParentIds.split(',');
                    var routeUrls_1 = [];
                    this_1.groupRoute.forEach(function (item) {
                        if (routeParentIds_1.indexOf(item.Id.toString()) > -1) {
                            routeUrls_1.push(item.Url);
                            if (typeof item.Middlewares !== 'undefined') {
                                item.Middlewares.forEach(function (mid) {
                                    route.Middlewares.push(mid);
                                });
                            }
                        }
                    });
                    var organizedMiddlewares = route.Middlewares.filter(function (a, b, c) {
                        return c.indexOf(a) === b;
                    });
                    route.Middlewares = organizedMiddlewares;
                    if (!route.OptionsMiddlewares) {
                        for (var i = 0; i < this_1.groupRoute.length; i++) {
                            if (typeof this_1.groupRoute[i].OptionsMiddlewares !== 'undefined') {
                                route.OptionsMiddlewares = this_1.groupRoute[i].OptionsMiddlewares;
                                break;
                            }
                        }
                    }
                    if (!route.Controller) {
                        for (var i = this_1.groupRoute.length - 1; i >= 0; i--) {
                            if (typeof this_1.groupRoute[i].Controller !== 'undefined') {
                                route.Controller = this_1.groupRoute[i].Controller;
                                break;
                            }
                        }
                    }
                    if (!route.Action) {
                        for (var i = this_1.groupRoute.length - 1; i >= 0; i--) {
                            if (typeof this_1.groupRoute[i].Action !== 'undefined') {
                                route.Action = this_1.groupRoute[i].Action;
                                break;
                            }
                        }
                    }
                    if (!route.Method) {
                        for (var i = this_1.groupRoute.length - 1; i >= 0; i--) {
                            if (typeof this_1.groupRoute[i].Method !== 'undefined') {
                                route.Method = this_1.groupRoute[i].Method;
                                break;
                            }
                        }
                    }
                    if (typeof this_1.groupRoute[0].Status !== 'undefined') {
                        route.Status = this_1.groupRoute[0].Status;
                    }
                    routeUrls_1 = routeUrls_1.filter(function (url) { return url; });
                    route.Url = routeUrls_1.length > 0 ? routeUrls_1.join('/') + (route.Url ? '/' + route.Url : '') : '';
                    delete route.ParentIds;
                }
                if (typeof route.Status === 'undefined') {
                    route.Status = true;
                }
                route.Url = '/' + route.Url;
                this_1.FinishedRoutes.push(route);
                this_1.AllRoutes.push(route);
            }
        };
        var this_1 = this;
        for (var index in Routes) {
            _loop_1();
        }
    };
    /*
     * Method kontrolü yapılıyor.
     */
    DynamicRoute.prototype.RouteMethodControl = function (method) {
        switch (method) {
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
    };
    /*
     * Gerekli url işlemleri burada yapılıyor.
     */
    DynamicRoute.prototype.SetRouting = function (Routes) {
        var _this = this;
        try {
            Routes.map(function (route, index) {
                var hasMethod = _this.RouteMethodControl(route.Method.toLowerCase());
                if (hasMethod) {
                    if (route.Status) {
                        //Route işlemleri burada yapılacak
                        var FullControllerPath = _this.Folders.Controllers + '/' + route.Controller;
                        var MiddlewaresFolder_1 = _this.Folders.Middlewares;
                        if (route.OptionsMiddlewares) {
                            _this.App.use(route.Url + "/*", route.OptionsMiddlewares.map(function (mid) {
                                if (typeof mid === 'function') {
                                    return mid;
                                }
                                else {
                                    return require(MiddlewaresFolder_1 + '/' + mid);
                                }
                            }));
                        }
                        if (typeof route.Action === 'function') {
                            _this.routeLog(route.Method, route.Key, route.Url, '', '', route.Middlewares, route.OptionsMiddlewares, '', 'Inline Code');
                        }
                        else {
                            _this.routeLog(route.Method, route.Key, route.Url, route.Controller, route.Action, route.Middlewares, route.OptionsMiddlewares);
                        }
                        _this.App["" + route.Method.toLowerCase()]("" + route.Url, route.Middlewares.map(function (mid) {
                            if (typeof mid === 'function') {
                                return mid;
                            }
                            else {
                                return require(MiddlewaresFolder_1 + '/' + mid);
                            }
                        }), (typeof route.Action === 'function' ? route.Action : require("" + FullControllerPath)["" + route.Action]));
                    }
                    else {
                        _this.routeLog(route.Method, route.Key, route.Url, route.Controller, route.Action, route.Middlewares, route.OptionsMiddlewares, 'Passive');
                    }
                }
                else {
                    _this.routeLog(route.Method, route.Key, route.Url, route.Controller, route.Action, route.Middlewares, route.OptionsMiddlewares, 'Method error');
                }
            });
        }
        catch (e) {
            console.log(e);
            console.log(colors_1.default.red(e));
        }
    };
    DynamicRoute.prototype.Search = function (key, value, array) {
        var retVal = {
            Key: '',
            Method: '',
            Url: '',
            Controller: '',
            Action: '',
            Status: null
        };
        for (var i = 0; i < array.length; i++) {
            var elem = array[i];
            if (elem[key] == value) {
                delete elem.OptionsMiddlewares;
                delete elem.Middlewares;
                return elem;
            }
        }
        return retVal;
    };
    DynamicRoute.prototype.get = function (key, value) {
        if (value) {
            return this.Search(key, value, this.AllRoutes);
        }
        else {
            return this.Search('Key', key, this.AllRoutes);
        }
    };
    /*
     * Bilgi isteniyorsa burada kontrol edilip yazdırılıyor.
     */
    DynamicRoute.prototype.log = function (text) {
        if (this.Info)
            console.log(text);
    };
    /*
     * Routelar için bilgiler console a basılıyor.
     */
    DynamicRoute.prototype.routeLog = function (method, key, url, controller, action, middlewares, optionsMiddlewares, error, codeInfo) {
        if (error === void 0) { error = ''; }
        if (codeInfo === void 0) { codeInfo = ''; }
        var text = "" + (error ? "[" + colors_1.default.red("" + method) + "]" : (codeInfo ? "[" + colors_1.default.cyan("" + method) + "]" : "[" + colors_1.default.green("" + method) + "]")) + (key ? "[" + key + "]" : '') + " " + colors_1.default.cyan(url);
        text += controller && action ? " " + colors_1.default.yellow("" + controller) + "@" + colors_1.default.yellow("" + action) : '';
        if (middlewares.length > 0) {
            text += ' ' + colors_1.default.underline(colors_1.default.green('Middleware' + (middlewares.length > 1 ? 's' : '')));
            var midStr_1 = '';
            middlewares.map(function (mid, i) {
                if (typeof mid === 'function') {
                    midStr_1 += "Function" + i;
                }
                else {
                    midStr_1 += "" + mid;
                }
                midStr_1 += middlewares.length - 1 !== i ? ', ' : '';
            });
            text += " -> " + midStr_1;
        }
        if (optionsMiddlewares && optionsMiddlewares.length > 0) {
            text += ' -> ' + colors_1.default.blue('Options Middleware' + (optionsMiddlewares.length > 1 ? 's' : ''));
        }
        if (error) {
            text += colors_1.default.red(' -> ' + error);
        }
        if (codeInfo) {
            text += colors_1.default.cyan(' -> ' + codeInfo);
        }
        this.log(text);
    };
    return DynamicRoute;
}());
exports.default = new DynamicRoute;
//# sourceMappingURL=index.js.map