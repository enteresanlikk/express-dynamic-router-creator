'use strict';

class IndexController{
    Index(req,res){
        res.send('index');
    }
}

module.exports=new IndexController();
