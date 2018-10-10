'use strict';

class IndexController{
    Index(req,res){
        res.json({
            data: 'Home@Index'
        });
    }
}

module.exports=new IndexController();
