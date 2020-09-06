import request from "supertest";
import app from "../src/app";
import { expect } from "chai";

describe("GET /multisig", () => {
  it("should return 404", (done) => {
    request(app).get("/multisig").expect(404, done);
  });
});

describe("POST /multisig", () => {
  const pubkeys = [
    "026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01",
    "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
    "03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9"
  ];

  it("Should return errors for BadRequests", done => {
    const data = {
      n: -1,
      m: -2,
      pubkeys
    };

    request(app)
      .post("/multisig")
      .type("json")
      .send(data)
      .expect("Content-Type", "application/json")
      .expect(400)
      .end((err, res) => {
        expect(res.type).to.eq("application/json");
        expect(res.error).not.to.be.undefined;
        expect(res.body.error.message).to.be.eq("n must be integer and greater than 0, m must be integer and greater than 0, m must be integer and equal or greater than n, number of pubkeys should equal m");
        done();
      });
  });

  it("Should return errors for ApplicationError, bad pubkey", done => {
    const badPubkeys = [
      "026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01",
      "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
      "123123123123123123123123123123123123123123123123123123123123aaaaaa"
    ];
    const data = {
      n: 2,
      m: 3,
      pubkeys: badPubkeys
    };

    request(app)
      .post("/multisig")
      .type("json")
      .send(data)
      .expect("Content-Type", "application/json")
      .expect(500)
      .end((err, res) => {
        expect(res.type).to.eq("application/json");
        expect(res.error).not.to.be.undefined;
        expect(res.body.error.message).to.be.eq("Expected property \"pubkeys.2\" of type isPoint, got Buffer");
        done();
      });
  });

  it("Should generate correct multisig address", done => {
    const data = {
      n: 2,
      m: 3,
      pubkeys
    };

    request(app)
      .post("/multisig")
      .type("json")
      .send(data)
      .expect("Content-Type", "application/json")
      .expect(200)
      .end((err, res) => {
        expect(res.type).to.eq("application/json");
        expect(res.body.address).to.eq("36NUkt6FWUi3LAWBqWRdDmdTWbt91Yvfu7");
        done();
      });
  });

  it("Should generate correct multisig address when order of pubkeys is changed", done => {
    const reorderedPubkeys = [pubkeys[0], pubkeys[2], pubkeys[1]];
    const data = {
      n: 2,
      m: 3,
      pubkeys: reorderedPubkeys
    };

    request(app)
      .post("/multisig")
      .type("json")
      .send(data)
      .expect("Content-Type", "application/json")
      .expect(200)
      .end((err, res) => {
        expect(res.type).to.eq("application/json");
        expect(res.body.address).to.eq("36NUkt6FWUi3LAWBqWRdDmdTWbt91Yvfu7");
        done();
      });
  });
});
