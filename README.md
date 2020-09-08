# Bitcoin Address Generator

## Overview

This is a RESTful API server that support Bitcoin address generation for:

- SegWit address based on BIP39 mnemonic seed and path. [Reference](#api-references)
    ```sh
    curl --location --request POST 'http://128.199.230.253/segwit' \
    --header 'Content-Type: application/json' \
    --data-raw '{
      "mnemonicSeed": "cave spread evidence cabin various phrase capable obey company never exit code",
      "path": "m/0/0/1"
    }'
    ```

- MultiSig address for n-of-m public keys. [Reference](#api-references)
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

You can try out those APIs by sending `POST` request to:

`http://128.199.230.253/segwit`

`http://128.199.230.253/multisig`


## API references

We designed those APIs in a RESTful manner. We leverage the use of `POST` request method for security reasons. In reality, this should be deployed with a HTTPS certificate server to prevent known man-in-the-middle attack vectors and sniffing URLs for confidential secrets.

Find out more examples and expected results at:
- [Generate SegWit Address](src/controllers/segwit/README.md)
- [Generate MultiSig Address](src/controllers/multisig/README.md)


## Development
This project uses TypeScript and comes with a collection of npm scripts to make life easier. You should be able to run them with `npm run <script name>`:

- `build`: Build to `dist/` folder and lint.
- `serve`: Start server at `dist/server.js`.
- `test`: Run all tests at `tests/`.
- `watch`: Serve and hot-reload as files changes.


**Build and serve server**:
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
