<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
        <a href="#about-the-project">About The Project</a>    
    </li>
    <li>
        <a href="#built-with">Built With</a>
    </li>
    <li>
        <a href="#getting-started">Getting Started</a>
    </li>
    <li>
        <a href="#contact">Contact</a>
    </li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

An Web3 dapp that allows users to mint a photo from a photography collection. The contract is on the Rinkeby chain and minting doesn't cost anything, just gas of course! 

It uses a PostgreSQL database to keep track of photos I would like visitors to mint. Once a photo is minted, it is deleted from the db (edit: there is an issue with this currently.)

Users can mint a random photo or select their preferences.

## Built With

* [React.js](https://reactjs.org/)
* [Express.js](https://expressjs.com/)
* [PostgreSQL](https://www.postgresql.org/)
* [Solidity](https://soliditylang.org/)

## Getting Started

First, you should install dependencies in both Backend and Frontend folders.

`npm i`

Then you can start both the backend and frontend using:

`npm start`

To access admin page add `\admin` to the localhost.

Make sure to deploy your own smart contract and attach it to this app :) 

## Contact

Feel free to contact me! 

You can find me on twitter @george_karaan 





