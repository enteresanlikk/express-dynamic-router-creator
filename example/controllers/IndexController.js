'use strict';
const route = require('../../index').default;

class IndexController{
    Index(req,res){
        let fullData = route.get('Url', req.url);
        let otherKey = route.get('test');
        res.json({
            fullData,
            otherKey
        });
    }
}

module.exports=new IndexController();
