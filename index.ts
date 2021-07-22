import * as crypto from 'crypto';


//let mongoose = require("mongoose");
//let blockChainModel = mongoose.model("BlockChain");

class Transaction {
    constructor(
        public information: string,
        public sender: string,
        public receiver: string,
    ){}

    toString(){
        return JSON.stringify(this);
    }    

}

class Block {
    public nonce = Math.round(Math.random() * 99999999);
    constructor(
        public prevHash: string,
        public transaction: Transaction,
        public ts = Date.now(),
    ) {}
    get hash() {
        const str = JSON.stringify(this);
        const hash = crypto.createHash('SHA256');
        hash.update(str).end();
        return hash.digest('hex');
    }
}

class Chain {
    public static instance = new Chain();
    chain: Block[];
    constructor() {
        this.chain = [ ];
    } 
    get lastBlock() {
        return this.chain[this.chain.length - 1];
    }
    mine(nonce: number) {
        let solution = 1;
        while (true) {
            const hash = crypto.createHash('MD5');
            hash.update((nonce + solution).toString()).end();
            const attempt = hash.digest('hex');
            if(attempt.substr(0,4) === '0000') {
                return solution;
            }
            solution += 1;
         }
    }
    addBlock (transaction: Transaction, senderPublicKey: string, signature: Buffer) {
        const verifier = crypto.createVerify('SHA256');
        verifier.update(transaction.toString());
        const isValid = verifier.verify(senderPublicKey, signature);
        console.log(transaction);
        if (isValid) {
            var newBlock;
            if (this.lastBlock == undefined)
            newBlock = new Block('', transaction);
            else
            newBlock = new Block(this.lastBlock.hash, transaction);
            
            this.mine(newBlock.nonce);
            this.chain.push(newBlock);
            
            //let newInstance = new blockChainModel(newBlock);
            //newInstance.save((err) => {
                //if (err) return console.log("Erro ao salvar", err.message);
                //console.log("Foi possível salvar o block no BD");
            //});
        }
    }
}

class Wallet {
    public publicKey: string;
    public privateKey: string;
    constructor() {
        const keypair = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });
        this.publicKey = keypair.publicKey;
        this.privateKey = keypair.privateKey;
    }
    sendInfo(information: string, payeePublicKey: string) {
       const transaction = new Transaction(information, this.publicKey, payeePublicKey);
       const sing = crypto.createSign('SHA256');
       sing.update(transaction.toString()).end();
       const signature = sing.sign(this.privateKey);
       Chain.instance.addBlock(transaction, this.publicKey, signature);
    }
}


//let database = require ("./database/main");
//database.onConnect(() => {
//});

const drrobert = new Wallet;
const arthur = new Wallet;
const lab = new Wallet;

lab.sendInfo('Exame.PDF',arthur.publicKey);
arthur.sendInfo('Solicitar receita',drrobert.publicKey);
drrobert.sendInfo('receita_Arthur.PDF', arthur.publicKey);


console.log(Chain.instance);