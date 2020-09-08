
# Generate Multisig Address
----
  Returns json data for new Multisig Address for n-of-m of public keys.

### Endpoint

  `/multisig`

### Method

  `POST`

### Data Params

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

### Success Response:

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

### Error Response:

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

    **Content:**

        ```json
        {
            "error": {
                "message": "Expected property \"pubkeys.2\" of type isPoint, got Buffer",
                "status": 500
            },
            "message": "Expected property \"pubkeys.2\" of type isPoint, got Buffer"
        }
        ```

### Sample Call:

```javascript
const settings = {
"url": "http://128.199.230.253/multisig",
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

```sh
curl --location --request POST 'http://128.199.230.253/multisig' \
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
