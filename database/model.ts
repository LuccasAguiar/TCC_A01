let mongoose = require("mongoose");

let Schema = mongoose.Schema;



let BlockChainSchema = new Schema({

    ts: {
        required: true,
        type: Schema.Types.Date,
        default: Date.now()
    },

    transactions: {
        required: true,
        type: Schema.Types.Array,

    },

    previousHash: {
        required: true,
        type: Schema.Types.String,
    },

    hash:{
        required: true,
        type: Schema.Types.String,
    }
});

module.exports = mongoose.model("BlockChain", BlockChainSchema);