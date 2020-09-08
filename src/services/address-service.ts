import * as bitcoin from "bitcoinjs-lib";
import * as bitcoinMessage from "bitcoinjs-message";
import * as HDNode from "bip32";
import * as bip39 from "bip39";

// generate bitcoin nativeSegwitFromSeedPath from mnemonicSeed and path
export const nativeSegwitFromSeedPath = (mnemonicSeed: string, path: string): string => {
    const seed = bip39.mnemonicToSeedSync(mnemonicSeed);
    const root = HDNode.fromSeed(seed);
    const child = root.derivePath(path);
    const { address } = bitcoin.payments.p2wpkh({ pubkey: child.publicKey });
    return address;
};

// generate bitcoin nestedSegwitFromSeedPath from mnemonicSeed and path
export const nestedSegwitFromSeedPath = (mnemonicSeed: string, path: string): string => {
    const seed = bip39.mnemonicToSeedSync(mnemonicSeed);
    const root = HDNode.fromSeed(seed);
    const child = root.derivePath(path);
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({ pubkey: child.publicKey }),
    });
    return address;
};

// validate bip39 mnemonicSeed
export const validateMnemonicSeed = (mnemonicSeed: string): boolean => {
    return bip39.validateMnemonic(mnemonicSeed);
};

// generate n-of-m multisig address.
// pubkeys are sorted lexicographically, as that is usually mutually agreed.
export const multiSigAddress = (n: number, pubkeys: string[]): string=> {
    const bufferedPubkeys = pubkeys.map(hex => Buffer.from(hex, "hex")).sort();
    const { address } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({ m: n, pubkeys: bufferedPubkeys }),
    });
    return address;
};

// generate signature for signing message with privateKey and segwitType
export const signMessageSegwit = (message: string, privateKey: string, segwitType: string): string => {
    const keyPair = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, "hex"));
    const signature = bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed, { segwitType });
    return signature.toString("hex");
};

// verify message signed by that address using the signature
export const verifyMessageSegwit = (message: string, address: string, signature: string): boolean => {
    return bitcoinMessage.verify(message, address, Buffer.from(signature, "hex"));
};
