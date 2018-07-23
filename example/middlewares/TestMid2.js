class TestMid2 {
    constructor(){
        return function handler(req, res, next) {
            res.setHeader("TestMid2","TestMid2");
            next();
        };
    }
}
module.exports=new TestMid2();