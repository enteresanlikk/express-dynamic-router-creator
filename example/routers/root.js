module.exports={
    status: false,
    routes: [
        {
            method: 'GET',
            url: 'root',
            controller: 'IndexController',
            action: 'Index'
        },
        {
            method: 'GET',
            url: 'root-2',
            controller: 'IndexController',
            action: 'Index'
        }
    ]
};