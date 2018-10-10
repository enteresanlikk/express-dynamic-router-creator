'use strict';

class TestMid1 {
    constructor(){
        return function handler(req, res, next) {
            res.setHeader('TestMid1', 'TestMid1');
            next();
        };
    }
}
module.exports=new TestMid1();