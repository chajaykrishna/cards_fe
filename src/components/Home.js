import React from 'react'
import { useState } from "react";
import {cardImageMapping as cards} from './constants.js';
import { Link } from "react-router-dom";

const Home = () => {
    // request api and get the data
    // display the data
    const url = "https://cards-game-d3he.onrender.com/api/cardGame/distributeCards"
    const [playerId, setPlayerId] = useState('');
    const [data, setData] = useState(null);
    const [response, setResponse] = useState(null);
    const mumbai_polygonscan_url = "https://mumbai.polygonscan.com/tx/"
    const fetchData = async () => {
      setData("loading");
      setResponse(null);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          
        }),
      });
        const data = await response.json();
        console.log(data.userCards);
        setData(data.userCards.shuffledCards);
        setResponse(data.userCards);
    };

    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
          <h1 className='text-5xl font-bold mb-10 mt-10'>Cards Game</h1>
          <div className='mb-20'>
            <input type="text" placeholder="Player Id" className="border-2 border-gray-500 rounded-lg p-2 m-2" 
            onChange={(event)=> {
              setPlayerId(event.target.value)
            }}/>
          <button onClick={fetchData} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>PLAY</button>
          </div>
          <div className="flex flex-wrap justify-center">
          {/* if there is no data, add spinner instead of the cards */}
          { data==="loading" && <div className="loader ease-linear rounded-full border-4 border-t-8 border-gray-200 h-32 w-32"></div>}
          {/* display blockchain txn hash, blockchain random hash, and server seed */}
          {data && data!=="loading" && (
            data.slice(0, 13).map((card, index) => {
              return <div key={index} className="m-2">
                <img key={index} src={cards[card]} alt={card} className="w-24 h-auto" />
                </div>
            })
          )}
          
            </div>
            {response && (
            <div className="flex flex-col items-center justify-center mt-36">
              {/* add hyperlink to the txhHash div */}
              <div className="text-sm mb-2" >
                Blockchain Txn Hash:{" "}
                <a className = "font-bold underline" href={mumbai_polygonscan_url+response.txnHash} target="_blank" rel="noreferrer">{response.txnHash}</a>
                </div>
              <div className="text-sm mb-2">Blockchain Random Hash: {response.blockchainHash}</div>
              <div className="text-sm mb-2">Server Seed: {response.serverSeed}</div>
              <div className="text-sm mb-2">
                <Link to="/verifyResult" className='font-bold text-blue-800 underline'>Verify</Link>
              </div>
            </div>
          )}
      </div>
    );
  }

export default Home
