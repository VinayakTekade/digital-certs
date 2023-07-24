# Node.js Encryption Middleware Example

This repository contains an example Node.js application showcasing the implementation of a middleware for encrypting and decrypting HTTPS request payloads in JSON format. The middleware uses the Advanced Encryption Standard (AES) with the Cipher Block Chaining (CBC) mode for encryption and decryption.

## Installation

1. Clone the repository to your local machine:

```
git clone https://github.com/VinayakTekade/digital-certs.git
```

2. Navigate to the project directory:

```
cd digital-certs.git
```

3. Install the required Node.js packages:

```
npm install
```

## Usage

The example application provides two API endpoints:

### Encrypt API:

-   URL: POST /encrypt
-   Description: Accepts a JSON payload and encrypts it using AES encryption.
-   Example usage with curl:

```
curl --location 'http://localhost:3000/encrypt' --header 'Content-Type: application/json' --data '{ "name": "John Doe", "age": 30 }'
```

### Decrypt API

-   URL: POST /decrypt
-   Description: Accepts the encrypted data and decrypts it using AES decryption.
-   Example usage with curl:

```
curl --location 'http://localhost:3000/decrypt' --header 'Content-Type: application/json' \
 --data '{
     "encryptedData": {
         "iv": "97c7807b2451e58d4648cb5c0d3b29c3",
         "encryptedData": "d0e6ea795d535b7f3e5cfc6b163fea2702db510e33d8701d5bced568749712696e75d9b4291d46819a84fa28169b274d"
     }
 }'
```

# Contributing

Contributions to this example project are welcome. Feel free to open issues or pull requests if you find any bugs or have suggestions for improvements.

# License

This example is open-source and available under the [MIT License](/LICENSE). You are free to use, modify, and distribute the code as per the terms of the license.
