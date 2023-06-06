import React from 'react'
import { useState } from "react";
import cards from './constants.js';
import cardImage from '../public/images/2_of_hearts.png'

const Home = () => {
    // request api and get the data
    // display the data
    const url = "https://cards-game-d3he.onrender.com/api/cardGame/distributeCards"
    const [rawData, setRawData] = useState(null);
    const [playerId, setPlayerId] = useState('');
    const [data, setData] = useState(null);
    const fetchData = async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerId: playerId,
        }),
      });
        const data = await response.json();
        console.log(data.userCards);
        setData(data.userCards.shuffledCards);
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
          {data && (
            data.slice(0, 13).map((card, index) => {
              return <div key={index} className="m-2">
                <img key={index} src={cards[card]} alt={card} className="w-24 h-auto" />
                </div>
            })
          )}
            </div>
      </div>
    );
  }

export default Home
