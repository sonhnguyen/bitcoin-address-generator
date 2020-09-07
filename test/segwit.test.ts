import request from "supertest";
import { expect } from "chai";
import * as HDNode from "bip32";
import * as bip39 from "bip39";

import app from "../src/app";
import * as AddressService from "../src/services/address-service";

describe("GET /segwit", () => {
  it("should return 404", (done) => {
    request(app).get("/segwit").expect(404, done);
  });
});

describe("POST /segwit", () => {
  it("Should return errors for BadRequests", done => {
    const data = {
      mnemonicSeed: "",
      path: ""
    };

    request(app)
      .post("/segwit")
      .type("json")
      .send(data)
      .expect("Content-Type", "application/json")
      .expect(400)
      .end((err, res) => {
        expect(res.type).to.eq("application/json");
        expect(res.error).not.to.be.undefined;
        expect(res.body.error.message).to.be.eq("mnemonicSeed cannot be blank, path cannot be blank, should be a valid bip39 mnemonic seed");
        done();
      });
  });

  it("Should return errors for ApplicationError, bad path", done => {
    const data = {
      mnemonicSeed: "mule board code chronic polar egg lonely pretty good divert shield process",
      path: "aaa"
    };

    request(app)
      .post("/segwit")
      .type("json")
      .send(data)
      .expect("Content-Type", "application/json")
      .expect(500)
      .end((err, res) => {
        expect(res.type).to.eq("application/json");
        expect(res.error).not.to.be.undefined;
        expect(res.body.error.message).to.be.eq("Expected BIP32Path, got String \"aaa\"");
        done();
      });
  });

  it("Should generate correct segwit address", done => {
    const data = {
      mnemonicSeed: "mule board code chronic polar egg lonely pretty good divert shield process",
      path: "m/0/0/1"
    };

    request(app)
      .post("/segwit")
      .type("json")
      .send(data)
      .expect("Content-Type", "application/json")
      .expect(200)
      .end((err, res) => {
        expect(res.type).to.eq("application/json");
        expect(res.body.nativeSegwitAddress).to.eq("bc1q97dx4al6mzzfn6smgsyjqzznq2hjdpydtq7q00");
        expect(res.body.nestedSegwitAddress).to.eq("3Gxz8HgJwqr2nmkpSw2GozVypE8VrpWCDX");
        done();
      });
  });

  it("should able to verify generated segwit address by signing a message", done => {
    const mnemonicSeed = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonicSeed); // 128 bits is enough
    const path = "m/0/0/1";
    const hdMaster = HDNode.fromSeed(seed); // seed from above
    const kp = hdMaster.derivePath(path);
    const privateKey = kp.privateKey;

    const data = {
      mnemonicSeed,
      path,
    };

    request(app)
      .post("/segwit")
      .type("json")
      .send(data)
      .expect("Content-Type", "application/json")
      .expect(200)
      .end((err, res) => {
        expect(res.type).to.eq("application/json");
        const nativeSegwitAddress = res.body.nativeSegwitAddress;
        const nestedSegwitAddress = res.body.nestedSegwitAddress;
        const message = "we need to check if the address is correct";
        const nativeSegwitSignature = AddressService.signMessageSegwit(message, privateKey.toString("hex"), "p2wpkh");
        const nestedSegwitSignature = AddressService.signMessageSegwit(message, privateKey.toString("hex"), "p2sh(p2wpkh)");
        expect(AddressService.verifyMessageSegwit(message, nativeSegwitAddress, nativeSegwitSignature)).to.be.true;
        expect(AddressService.verifyMessageSegwit(message, nestedSegwitAddress, nestedSegwitSignature)).to.be.true;
        done();
      });
  });
});
