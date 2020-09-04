import request from "supertest";
import app from "../src/app";
import { expect } from "chai";

describe("GET /multisig", () => {
  it("should return 404", (done) => {
      request(app).get("/multisig").expect(404, done);
  });
});


describe("POST /multisig", () => {
  it("Should return errors for invalid requests", done => {
    const pubkeys = [
      "026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01",
      "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
      "03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9"
    ];
    const data = {
      n: 4,
      m: 3,
      pubkeys
    }

    request(app)
      .post("/multisig")
      .type("json")
      .send(data)
      .expect("Content-Type", "application/json")
      .expect(500)
      .expect(response => {console.log(response.body)})
      .end((err, res) => {
        expect(res.type).to.eq('application/json');
        expect(res.error).not.to.be.undefined;
        const body = JSON.parse(res.text);
        console.log(body)
        expect(body.error[0].msg).to.be.eq('m must be integer and greater or equal than n');
        done();
      });
  });

  it("Should generate correct multisig address", done => {
    const pubkeys = [
      "026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01",
      "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
      "03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9"
    ];
    const data = {
      n: 2,
      m: 3,
      pubkeys
    }

    request(app)
      .post("/multisig")
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .send(data)
      .expect("Content-Type", "text/html; charset=utf-8")
      .expect(200)
      .end((err, res) => {
        expect(res.type).to.eq('text/html');
        expect(res.text).to.eq('36NUkt6FWUi3LAWBqWRdDmdTWbt91Yvfu7');
        done();
      });
  });
});
