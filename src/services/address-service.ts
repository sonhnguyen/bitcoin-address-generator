import * as bitcoin from 'bitcoinjs-lib';
import * as HDNode from 'bip32';

// generate bitcoin segwit address from seed and path
export const segwitFromSeedPath = async (seed: string, path: string) => {
    const root = HDNode.fromSeed(Buffer.from(seed, 'hex'))
    const child = root.derivePath(path)
    const { address } = bitcoin.payments.p2wpkh({ pubkey: child.publicKey });
    return address;
}

// generate n-of-m multisig address where m is length of pubkeys
export const multiSigAddress = async (n: number, pubkeys: string[]) => {
    const bufferedPubkeys = pubkeys.map(hex => Buffer.from(hex, 'hex'));
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: n, pubkeys: bufferedPubkeys }),
    });
    return address;
}
