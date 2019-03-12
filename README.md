# **Express Dynamic Router Creator**

### **Because the library is rewritten, please arrange your structure according to the new.*

> With this module you will be able to write dynamic created routing with express.


## **Features**

- Change the folders required for the dynamic router.
    - Routers Folder
    - Middlewares Folder
    - Controllers Folder
    
- Define the main route file in the defined route folder.

> ***Note***: **In order to use this library, you need to include the express and fs libraries.**

## **Install and Configuration**

   `npm install --save express-dynamic-router-creator`

    ...
    
    //Import
    const express = require('express');
    const app = express();
    const path = require('path');
    const DynamicRoute = require('express-dynamic-router-creator').default;
    
    ...
    
    DynamicRoute.Config(
        app,
        {
            Routers: path.join(__dirname,'routers'),
            Middlewares: path.join(__dirname,'middlewares'),
            Controllers: path.join(__dirname,'controllers')
        },
        ['main.js', 'client.js']
    );
    
> **Info:** The files or files you define in mainFile work independently of each other. For example, if you have a router for the front of a route file, then the other file contains the necessary routing for the background. When defining a file, you need to enter the file name into. If you want to define more than one file, you must define your files in an array.

> The output of the open log feature.

![Log Image](log.png)

> **Note:** The file that creates dynamic routing is the **index.js** file. In the example, it is in the **module** folder.
        
### Code Example
   main.js ([example/routers/main.js](example/routers/main.js))
   
    ...

    const cors = require('cors');
    
    ...

    const WhiteList = ['http://localhost:3030'];
    var corsOptions = {
        origin: function (origin, callback) {
            if (WhiteList.indexOf(origin) !== -1 || !origin) {
                callback(null, true)
            } else {
                callback({status:403,data:'You do not have permission!'});
            }
        },
        optionsSuccessStatus: 200,
        methods:'OPTIONS',
        credentials:true
    }

    module.exports= [
    {
        OptionsMiddlewares: [cors(corsOptions)],
        Middlewares: ['TestMid1'],
        Routes: [
            {
                Method: 'POST',
                Controller: 'IndexController',
                Action: (req, res, next)=> {
                    console.log("Inline Code 1");
                    res.json({
                        code: "This is inline code."
                    });
                }
            },
            {
                Url: 'example-1',
                Method: 'GET',
                Middlewares: [
                    (req, res, next)=> {
                        res.setHeader('Middleware','Inline Middleware');
                        next();
                    },
                    (req, res, next)=> {
                        res.setHeader('Middleware_2','Inline Middleware');
                        next();
                    }
                ],
                Routes: [
                        {
                            Method: 'GET',
                            Url: 'home',
                            Controller: 'IndexController',
                            Action: (req, res, next)=> {
                                console.log("Inline Code 2");
                                res.json({
                                    code: "This is inline code."
                                });
                            }
                        },
                        {
                            Url: 'example-2',
                            Middlewares: ['TestMid1'],
                            Method: 'PUT',
                            Routes: [
                                    {
                                        Url: 'home-2',
                                        Controller: 'IndexController',
                                        Action: 'Index',
                                        Method: 'DELETE',
                                        Middlewares: ['TestMid1']
                                    },
                                    {
                                        Url: 'example-3',
                                        Middlewares: ['TestMid2'],
                                        Routes: [
                                            {
                                                Url: 'home-2',
                                                Controller: 'IndexController',
                                                Action: 'Index',
                                                Middlewares: ['TestMid1']
                                            },
                                            {
                                                Url: 'example-4',
                                                Routes: [
                                                    {
                                                        Key: 'test',
                                                        Method: 'GET',
                                                        Url: 'bilal-burada',
                                                        Controller: 'IndexController',
                                                        Action: 'Index'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                Url: 'home-3',
                                Controller: 'IndexController',
                                Action: 'Index'
                            }
                        ]
                    }
                ]
            }
        ];



> ### **Config Params**
|Param|Description|
|--|--|
|**First Param**|Send the express server parameter. **Required**|
|**Second Param**|The folder definitions required for the project are given here. **Routers**, **Middlewares** and **Controllers** parameters can be sent. Must be object. **Required**|
|**Third Param**|Route files are defined here. Must be array. **Required**|
|**Fourth Param**|This parameter is sent to the console to print information. Must be boolean. **Optional**|


> ### **Route File Params**
|Param|Description|Default Values|
|--|--|--|
|**Key**|We use it to draw information about the route. It is used with the *get()* function. Must be string. **Optional**|-|
|**Method**|The route is defined by which request to work. If the method is not sent and if it is in a sub-route, it takes the method of the next route un. Must be string. *It can be optional according to the upper route.*|GET, POST, PUT, DELETE, OPTIONS|
|**Url**|The route url is defined. if this parameter is not sent '/' is defined. If it is located in a sub-route group, it is combined with the top route urls. Must be string. **Optional**|/|
|**Controller**|The name of the file that the route is running. It searches the action function in this file. Must be string. **Required**|-|
|**Action**|Represents the function in which route operations are performed. Must be string or function. **Required**|-|
|**Middlewares**|Used to define the middleware of the route. Must be array in string or function. **Optional**|-|
|**OptionsMiddlewares**|It should only be added to meet the options method. Must be array in string or function. **Optional**|-|
|**Status**|To make the route u active or passive. By default, the route is active. Must be boolean. **Optional**|true, false|
|**Routes**|It is used to group routes. The route properties of this parameter are copied to the subroutines. Must be array and it should consist of *Route File Params*. **Optional**|-|

> ### **Functions**
|Function|Description|
|--|--|
|**get()**|It is used to draw information about the route. Example; [example/controllers/IndexController.js](example/controllers/IndexController.js)|