import request from "supertest";
import { expect } from "chai";
import * as HDNode from "bip32";
import * as crypto from "crypto";

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
      seed: "",
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
        expect(res.body.error.message).to.be.eq("seed cannot be blank, path cannot be blank, seed should have minimum 32 characters (128 bits)");
        done();
      });
  });

  it("Should return errors for ApplicationError, bad path", done => {
    const data = {
      seed: "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
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
      seed: "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
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
        expect(res.body.address).to.eq("bc1qtyyw0wztwtr47utajd5jjqfse6exgzd6w6v2c2");
        done();
      });
  });

  it("should able to verify generated segwit address by signing a message", done => {
    const seed = crypto.randomBytes(16); // 128 bits is enough
    const path = "m/0/0/1";
    const hdMaster = HDNode.fromSeed(seed); // seed from above
    const kp = hdMaster.derivePath(path);
    const privateKey = kp.privateKey;

    const data = {
      seed: seed.toString("hex"),
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
        const address = res.body.address;
        const message = "we need to check if the address is correct";
        const signature = AddressService.signMessageSegwit(message, privateKey.toString("hex"));
        const isCorrectSignature = AddressService.verifyMessageSegwit(message, address, signature);
        expect(isCorrectSignature).to.be.true;
        done();
      });
  });
});
