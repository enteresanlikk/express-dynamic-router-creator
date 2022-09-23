# **Express Dynamic Router Creator**

> With this module you will be able to write dynamic created routing with [express](https://expressjs.com/).

## **Features**

- Change the folders required for the dynamic router.
  - Routers Folder
  - Middlewares Folder
  - Controllers Folder
- Define the main route file in the defined route folder.

## **Configuration**

```javascript
'use strict';

const express = require('express');
const app = express();
const path = require('path');

const DynamicRouter = require('express-dynamic-router-creator');

new DynamicRouter({
  app,
  folders: {
    routers: path.join(__dirname, 'routers'),
    controllers: path.join(__dirname, 'controllers'),
    middlewares: path.join(__dirname, 'middlewares'),
  },
  routerFiles: ['api/main', 'client'],
}).run();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

> **Info:** The files or files you define in mainFile work independently of each other. For example, if you have a router for the front of a route file, then the other file contains the necessary routing for the background. When defining a file, you need to enter the file name into. If you want to define more than one file, you must define your files in an array.

> The output of the open log feature.

![Log Image](log.png)

### **Code Examples**

1. [Basic Example](/examples/basic-example)
2. [Controller Example](/examples/controllers-example)
3. [Middleware Example](/examples/middlewares-example)
4. [Multiple Example](/examples/multiple-example)
5. [Versioning Example](/examples/versioning-example)

### **Config Params**

```javascript
new DynamicRouter({
  app,
  port: process.env.PORT || 3000,
  folders: {
    routers: path.join(__dirname, 'routers'),
    controllers: path.join(__dirname, 'controllers'),
    middlewares: path.join(__dirname, 'middlewares'),
  },
  routerFiles: ['api/main', 'client'],
  info: true,
});
```

| Param           | Description                                                                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **app**         | Send the express app parameter. **Required**                                                                                                                          |
|**port**| Send the express port parameter. *if the port is set you don't need to do `listen`*. **Optional**|
| **folders**     | The folder definitions required for the project are given here. **routers**, **controllers** and **middlewares** parameters can be sent. Must be object. **Required** |
| **routerFiles** | Route files are defined here. Must be array. **Required**                                                                                                             |
| **info**        | This parameter is sent to the console to print information. Must be boolean. Default value `true`. **Optional**                                                       |

### **Route File Params**

```javascript
[
  {
    url: 'api',
    method: 'get',
    middlewares: [
      (req, res, next) => {
        res.setHeader('npm-module', 'express dynamic router creator');
        next();
      },
    ],
    routes: [
      {
        url: 'users',
        middlewares: ['auth.middleware'],
        controller: 'users.controller',
        routes: [
          {
            action: 'getAll',
          },
          {
            method: 'post',
            action: 'add',
          },
          {
            url: ':id',
            routes: [
              {
                method: 'put',
                action: 'update',
              },
              {
                method: 'delete',
                action: 'delete',
              },
              {
                action: 'get',
              },
            ],
          },
        ],
      },
      {
        key: 'not_found_handler',
        method: 'use',
        action: (req, res, next) => {
          next({
            status: 404,
            message: 'Not Found',
          });
        },
      },
      {
        key: 'error_handler',
        method: 'use',
        action: (error, req, res, next) => {
          res
            .status(error.status || 500)
            .send(error.message || 'Internal Server Error');
        },
      },
    ],
  },
];
```

| Param           | Description                                                                                                                                                                                                                   | Default Values |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| **method**      | The route is defined by which request to work. If the method is not sent and if it is in a sub-route, it takes the method of the next route un. Must be string. **_It can be optional according to the upper route._**        |                |
| **url**         | The route url is defined. if this parameter is not sent '/' is defined. If it is located in a sub-route group, it is combined with the top route urls. Must be string. **_It can be optional according to the upper route._** | /              |
| **controller**  | The name of the file that the route is running. It searches the action function in this file. Must be string. **_It can be optional according to the upper route._**                                                          |                |
| **action**      | Represents the function in which route operations are performed. Must be string or function. **_Required_**                                                                                                                   |                |
| **middlewares** | Used to define the middleware of the route. Must be array in string or function. **_It can be optional according to the upper route._**                                                                                       |                |
| **status**      | To make the route u active or passive. By default, the route is active. Must be boolean. **_Optional_**                                                                                                                       | true           |
| **key**         | Used to distinguish routes. If no value is entered, it will be created automatically according to the url. **_Optional_**                                                                                                     |                |
| **routes**      | It is used to group routes. The route properties of this parameter are copied to the subroutines. Must be array and it should consist of _Route File Params_. **_Optional_**                                                  |                |
