class SetHeader {
    constructor(){
        return function handler(req, res, next){
            res.setHeader('Access-Control-Allow-Origin', req.get('origin') || req.get('host'));
            res.setHeader('Access-Control-Allow-Methods', "GET, POST, DELETE, POST, OPTIONS");
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        };
    }
}

module.exports=new SetHeader();