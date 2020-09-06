import * as bitcoin from "bitcoinjs-lib";
import * as bitcoinMessage from "bitcoinjs-message";
import * as HDNode from "bip32";

// generate bitcoin segwit address from seed and path
export const segwitFromSeedPath = (seed: string, path: string) => {
    const root = HDNode.fromSeed(Buffer.from(seed, "hex"));
    const child = root.derivePath(path);
    const { address } = bitcoin.payments.p2wpkh({ pubkey: child.publicKey });
    return address;
};

// generate n-of-m multisig address where m is length of pubkeys. pubkeys are sorted lexicographically, as that is usually mutually agreed.
export const multiSigAddress = (n: number, pubkeys: string[]) => {
    const bufferedPubkeys = pubkeys.map(hex => Buffer.from(hex, "hex")).sort();
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: n, pubkeys: bufferedPubkeys }),
    });
    return address;
};

export const signMessageSegwit = (message: string, privateKey: string) => {
    const keyPair = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, "hex"));
    const signature = bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed, { segwitType: "p2wpkh" });
    return signature.toString("hex");
};

export const verifyMessageSegwit = (message: string, address: string, signature: string,) => {
    return bitcoinMessage.verify(message, address, Buffer.from(signature, "hex"));
};
