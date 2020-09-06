REST API server for bitcoin address generation.

**Installation**

```
npm install
npm run build
npm run serve
```

**Run test**
```
npm install
npm run test
```

**API Endpoints:**

**Generate Native Segwit Address**
----
  Returns json data for new native Segwit Address from a seed and a path.

* **URL**

  /segwit

* **Method:**

  `POST`
  
* **Data Params**

  ```json
  {
      "seed": "111111111111111111111111111111111",
      "path": "m/0/0/1"
  }
  ```
- `seed` and `path` are required.
- `path` should be a valid HD wallet path (e.g: `m/0/0/1`).
- Seed should be in hex string and contains at least 128 bits (should be at least 32 characters length long).

* **Success Response:**

  * **Code:** 200 <br />
    **Request:**

    ```json
    {
        "seed": "ddddddddddddddddddddddddddddddddddddddddddddd",
        "path": "m/0/0/1"
    }
    ```

    **Content:** 
    ```json
    {
        "address": "bc1qauq64rft3pp0zrep804flwt46tclf6n5grrw5a"
    }
    ```
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Reason:** Seed is not long enough for 128 bits.

    ```json
    {
        "seed": "123",
        "path": "m/0/0/1"
    }
    ```

    **Content:**
    ```json
    {
        "error": {
            "message": "seed should have minimum 32 characters (128 bits)",
            "status": 400
        },
        "message": "seed should have minimum 32 characters (128 bits)"
    }
    ```

  OR

  * **Code:** 500 Internal Server Error <br />
    **Reason:** Wrong input for `path`.

    ```json
    {
        "seed": "500000000000000000000000000000000000000000000  ",
        "path": "m/asd0/0/1"
    }
    ```

    **Content:** 

    ```json
    {
        "error": {
            "message": "Expected BIP32Path, got String \"m/asd0/0/1\"",
            "status": 500
        },
        "message": "Expected BIP32Path, got String \"m/asd0/0/1\""
    }
	```

* **Sample Call:**

    ```javascript
    var settings = {
    "url": "http://localhost:3000/segwit",
    "method": "POST",
    "timeout": 0,
    "headers": {
        "Content-Type": "application/json"
    },
    "data": JSON.stringify({"seed":"500000000000000000000000000000000000000000000  ","path":"m/0/0/1"}),
    };

    $.ajax(settings).done(function (response) {
    console.log(response);
    });
    ```

    ```curl
    curl --location --request POST 'http://localhost:3000/segwit'  --header 'Content-Type: application/json' --data-raw '{"seed": "500000000000000000000000000000000000000000000","path": "m/0/0/1" }'
    ```


**Generate Multisig Address**
----
  Returns json data for new Multisig Address for n-of-m of public keys.

* **URL**

  /multisig

* **Method:**

  `POST`
 
* **Data Params**

  ```
  {
      "n": 2,
      "m": 3,
      "pubkeys": [
          "026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01",
          "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
          "03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9"
      ]
  }
  ```
- `n`, `m` and `pubkeys` are required.
- `n` should be an integer and greater than 0.
- `m` should be an integer and greater than 0.
- `m` should be equal or greater than `n`.
- `pubkeys` should be an array of public keys.
- `pubkeys` should have length equal to `m`.

* **Success Response:**

  * **Code:** 200 <br />
    **Request:**

    ```json
    {
        "n": 2,
        "m": 3,
        "pubkeys": [
            "026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01",
            "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
            "03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9"
        ]
    }
    ```

    **Content:**

    ```
    {
        "address": "36NUkt6FWUi3LAWBqWRdDmdTWbt91Yvfu7"
    }
    ```
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Reason:** `n` and `m` are invalid.

    ```json
    {
        "n": -1,
        "m": -2,
        "pubkeys": [
            "026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01",
            "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
            "03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9"
        ]
    }
    ```

    **Content:**
    ```json
    {
        "error": {
            "message": "n must be integer and greater than 0, m must be integer and greater than 0, m must be integer and equal or greater than n, number of pubkeys should equal m",
            "status": 400
        },
        "message": "n must be integer and greater than 0, m must be integer and greater than 0, m must be integer and equal or greater than n, number of pubkeys should equal m"
    }
    ```

  OR

  * **Code:** 500 Internal Server Error <br />
    **Reason:** Pubkeys are invalid.
    ```json
    {
        "n": 2,
        "m": 3,
        "pubkeys": [
            "026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01",
            "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
            "123"
        ]
    }
    ```

   * **Content:** 

        ```json
        {
            "error": {
                "message": "Expected property \"pubkeys.2\" of type isPoint, got Buffer",
                "status": 500
            },
            "message": "Expected property \"pubkeys.2\" of type isPoint, got Buffer"
        }
        ```

* **Sample Call:**

    ```javascript
    var settings = {
    "url": "http://localhost:3000/multisig",
    "method": "POST",
    "timeout": 0,
    "headers": {
        "Content-Type": "application/json"
    },
    "data": JSON.stringify({"n":2,"m":3,"pubkeys":["026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01","02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9","03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9"]}),
    };

    $.ajax(settings).done(function (response) {
    console.log(response);
    });
    ```

    ```curl
    curl --location --request POST 'http://localhost:3000/multisig' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "n": 2,
        "m": 3,
        "pubkeys": [
            "026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01",
            "02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9",
            "03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9"
        ]
    }'
    ```
