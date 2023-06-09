import { useState } from "react";
import { gameOutcomeMultiplier, totalOutcomes, cardImageMapping, cards } from './constants';
import _ from 'lodash';
import  CryptoJS from 'crypto-js';


const VerifyResult = () => {
  const [serverSeed, setServerSeed] = useState('');
  const [blockchainHash, setBlockchainHash] = useState('');
  const [nonce, setNonce] = useState('');
  const [data, setData] = useState(null);
  const game = "CARDS";


  const generateResult = (e) => {
    e.preventDefault();
    const randomNumbers = generateRandomNumbers(serverSeed, blockchainHash);
    console.log(randomNumbers);
    // using 104 cards for now, 52+52
    const cardsInitialOrder = cards.concat(cards);
    const shuffledCards = randomNumbers.map((number) => {
      const cardIndex = Math.floor(number);
      const card = cardsInitialOrder[cardIndex];
      cardsInitialOrder.splice(cardIndex, 1);
      return card;
    });
    setData(shuffledCards);
    console.log(shuffledCards);
  }

  const generateRandomNumbers = (serverSeed, blockchainHash) => {
    console.log(serverSeed, blockchainHash, totalOutcomes[game]);
    const hashesRequired = Math.ceil(totalOutcomes[game] / 8);
    const hashes = [];
    for (let i = 0; i < hashesRequired; i++) {
      const hash = generateHash(serverSeed, blockchainHash, i);
      hashes.push(hash);
    }
    console.log(typeof hashes[0]);
    const hashesInDecimal = [].concat(
      ...hashes.map((hash) => {
        let index = 0;
        const decimalNumbers = [];
        while (index < 32) {
          decimalNumbers.push(Number(hash[index]));
          index += 1;
        }
        console.log(decimalNumbers);
        return decimalNumbers;
      }),
    );
    console.log(hashesInDecimal);
    //  convert the decimal bytes array to a floating point numbers array
    const gameOutcomes = bytesToFloatingPoint1(hashesInDecimal, game);
    return gameOutcomes.slice(0, totalOutcomes[game]);
  }

  const generateHash = (serverSeed, blockchainHash, cursor) => {
    // const hash = crypto.createHmac('sha256', serverSeed);
    // update client seed and nonce and currentRound
    // hash.update(`${blockchainHash}:${cursor}`);
    // return hash.digest();

    const concatenatedString = `${blockchainHash}:${cursor}`;
  const hash = CryptoJS.HmacSHA256(concatenatedString, serverSeed);
  const hashWords = hash.words;

  // Convert words to a Uint8Array
  const uint8Array = new Uint8Array(hashWords.length * 4);
  for (let i = 0; i < hashWords.length; i++) {
    const word = hashWords[i];
    uint8Array[i * 4] = (word >> 24) & 0xff;
    uint8Array[i * 4 + 1] = (word >> 16) & 0xff;
    uint8Array[i * 4 + 2] = (word >> 8) & 0xff;
    uint8Array[i * 4 + 3] = word & 0xff;
  }

  return uint8Array;
  }

  const bytesToFloatingPoint1 = (bytes, game) => {
     // convert bytes to floating point
     let index = -1;
     const rand = _.chunk(bytes, 4).map((_chunk) => {
       index += 1;
       return (
         Number(
           _chunk.reduce((result, value, index) => {
             const divider = 256 ** (index + 1);
             const partialResult = Number(value) / divider;
             return Number(result) + partialResult;
           }, 0),
         ) *
         (gameOutcomeMultiplier[game] - index)
       );
     });
     return rand;
   }

    return (
      <div className="max-w-md mx-auto">
      <form className="space-y-6 border-2 border-gray-500 rounded-md p-6 mt-20" onSubmit={generateResult}>
        <div>
          <label htmlFor="serverSeed" className="block text-sm font-medium text-gray-700">
            Server Seed
          </label>
          <input
            id="serverSeed"
            name="serverSeed"
            type="text"
            placeholder="Server Seed"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md outline-none"
            value={serverSeed}
            onChange={(e) => setServerSeed(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="blockchainHash" className="block text-sm font-medium text-gray-700">
            Blockchain Hash
          </label>
          <input
            id="blockchainHash"
            name="blockchainHash"
            type="text"
            placeholder="Blockchain Hash"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md outline-none"
            value={blockchainHash}
            onChange={(e) => setBlockchainHash(e.target.value)}
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Verify
          </button>
        </div>
      </form>

      {/* display cards here */}
        <div className="flex flex-wrap justify-center mt-10">
            {/* display blockchain txn hash, blockchain random hash, and server seed */}
            {data && data!=="loading" && (
              data.slice(0, 13).map((card, index) => {
                return <div key={index} className="m-2">
                  <img key={index} src={cardImageMapping[card]} alt={card} className="w-24 h-auto" />
                  </div>
              })
            )}
            
        </div>
    </div>
    );
}

export default VerifyResult
