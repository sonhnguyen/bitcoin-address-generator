// import * as bitcoinjs from 'bitcoinjs-lib';

const bitcoin = require('bitcoinjs-lib')
const HDNode = require('bip32')

async function main() {
    const segwitAddress = await segwitFromSeedPath('ddddddddddddddddddddddddddddddddddddddddddddddddddd', "0/0/1")
    console.log(segwitAddress)

    const multisigAddress = await generateMultiSigP2SHAddress()
    console.log(multisigAddress)
}

async function segwitFromSeedPath(seed, path) {
    var root = HDNode.fromSeed(Buffer.from(seed, 'hex'))
    var child = root.derivePath(path)
    const { address } = bitcoin.payments.p2wpkh({ pubkey: child.publicKey });
    return address;
}

async function generateMultiSigP2SHAddress(n, m, addresses) {
    const pubkeys = [
        '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
        '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
        '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
    ].map(hex => Buffer.from(hex, 'hex'));
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: 2, pubkeys }),
    });
    return address;
}

main()
