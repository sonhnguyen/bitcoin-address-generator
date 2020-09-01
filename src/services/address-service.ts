const bitcoin = require('bitcoinjs-lib')
const HDNode = require('bip32')

const segwitFromSeedPath = async function segwitFromSeedPath(seed: string, path: string) {
    var root = HDNode.fromSeed(Buffer.from(seed, 'hex'))
    var child = root.derivePath(path)
    const { address } = bitcoin.payments.p2wpkh({ pubkey: child.publicKey });
    return address;
}

export {
    segwitFromSeedPath,
};
