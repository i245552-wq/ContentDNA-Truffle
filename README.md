\# ContentDNA - Truffle \& Ganache dApp



MG3012 Blockchain Technology for Business - Assignment 3

Name: Zonaira | Roll No: 24I-5552



\## About

ContentDNA lets a creator register a file's SHA-256 fingerprint on the blockchain with a title and timestamp, so there is a public record of who registered it first. Only the fingerprint is stored, never the file. This is the same contract as Assignment 2, now deployed locally with Truffle and Ganache.



\## Requirements

\- Node.js (v24 used)

\- Truffle: `npm install -g truffle`

\- Ganache: `npm install -g ganache`

\- Google Chrome (the frontend loads ethers.js from a CDN, so internet is needed)



\## Project structure

\- contracts/SmartContract.sol - the ContentDNA smart contract

\- migrations/1\_deploy\_contract.js - deployment script

\- truffle-config.js - connects Truffle to Ganache (127.0.0.1:8545), Solidity 0.8.20

\- frontend/ - index.html, script.js, style.css

\- screenshots/ - proof of compile, deployment and dApp interaction



\## Setup and commands used

1\. Start the local blockchain (keep this window open):

```

ganache --deterministic

```

2\. In a second terminal, inside the project folder, compile:

```

truffle compile

```

3\. Deploy to Ganache:

```

truffle migrate

```

4\. Copy the "contract address" printed by `truffle migrate` and make sure it matches CONTRACT\_ADDRESS at the top of frontend/script.js (with `--deterministic` it stays the same on a fresh start).

5\. Open frontend/index.html in Chrome.



\## How to test

1\. Click "Connect to Ganache" - it should show "Connected as 0x..." and Total registered.

2\. Pick any file - a SHA-256 fingerprint appears.

3\. Type a title and click "Register" - the transaction hash appears and Total registered goes up by 1.

4\. Click "Check if registered" - shows the title, owner and time.

5\. Paste another Ganache account address and click "Transfer" - ownership changes. Click "Check if registered" again to see the new owner.



Registering the same file twice is rejected by the contract (by design).



\## Contract functions

\- registerContent(fingerprint, title)

\- getContent(fingerprint)

\- isRegistered(fingerprint)

\- transferOwnership(fingerprint, newOwner)

\- totalRegistered (public counter)

