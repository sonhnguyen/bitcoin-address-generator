
# Generate Native SegWit Address
----
  Returns json data for new native SegWit Address from a seed and a path.

### Endpoint

  `/segwit`

### Method:

  `POST`

### Data Params

  ```json
  {
      "mnemonicSeed": "cave spread evidence cabin various phrase capable obey company never exit code",
      "path": "m/0/0/1"
  }
  ```
- `mnemonicSeed` and `path` are required.
- `path` should be a valid HD wallet path (e.g: `m/0/0/1`).
- `mnemonicSeed` should be a valid BIP39 mnemonic seed.

### Success Response:

  * **Code:** 200 <br />
    **Request:**

    ```json
    {
	    "mnemonicSeed": "mule board code chronic polar egg lonely pretty good divert shield process",
	    "path": "0/0/1"
    }
    ```

    **Content:**
    ```json
    {
        "nativeSegwitAddress": "bc1q97dx4al6mzzfn6smgsyjqzznq2hjdpydtq7q00",
        "nestedSegwitAddress": "3Gxz8HgJwqr2nmkpSw2GozVypE8VrpWCDX"
    }
    ```

### Error Response:

  * **Code:** 400 BAD REQUEST <br />
    **Reason:** Mnemonic Seed is not a valid BIP39 seed.

    ```json
    {
        "mnemonicSeed": "abandon",
        "path": "m/0/0/1"
    }
    ```

    **Content:**
    ```json
    {
        "error": {
            "message": "should be a valid bip39 mnemonic seed",
            "status": 400
        },
        "message": "should be a valid bip39 mnemonic seed"
    }
    ```

  OR

  * **Code:** 500 Internal Server Error <br />
    **Reason:** Wrong input for `path`.

    ```json
    {
	    "mnemonicSeed": "mule board code chronic polar egg lonely pretty good divert shield process",
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

### Sample Call:

```javascript
const settings = {
"url": "http://128.199.230.253/segwit",
"method": "POST",
"timeout": 0,
"headers": {
    "Content-Type": "application/json"
},
"data": JSON.stringify({"mnemonicSeed":"cave spread evidence cabin various phrase capable obey company never exit code  ","path":"m/0/0/1"}),
};

$.ajax(settings).done(function (response) {
console.log(response);
});
```

```sh
curl --location --request POST 'http://128.199.230.253/segwit' \
--header 'Content-Type: application/json' \
--data-raw '{
  "mnemonicSeed": "cave spread evidence cabin various phrase capable obey company never exit code",
  "path": "m/0/0/1"
}'
```
