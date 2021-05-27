let mongoosedb = require("mongoose");

let BlockChainModel = requise("./model");


mongoosedb.connect("mongodb://localhost:27017/BlockChain", (err) => {
    if (err) 
        return console.log("Error on the DB");
    console.log("DB connected");
    connectionCallBack();

});

let connectionCallBack = () => {};

module.exports.onConnect = (callBack) => {
    connectionCallBack = callBack;
}