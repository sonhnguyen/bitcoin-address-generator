REST API server for bitcoin address generation.

** Installation **

```
npm install
npm run build
npm serve
```

** Run test **
```
npm install
npm run test
```

API Endpoints:

**Generate Native Segwit Address**
----
  Returns json data for new native Segwit Address from a seed and a path.

* **URL**

  /segwit

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
* **Data Params**

```
{
    "seed": "111111111111111111111111111111111",
    "path": "m/0/0/1"
}
```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
```
{
    "address": "bc1qcwtvdvanh0hhk8ycj29g808qlgwd049tecafwx"
}
```
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:**
    
```
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
    **Content:** 

```
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
