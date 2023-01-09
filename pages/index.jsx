import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Card from "../components/Card";
import styled from "styled-components";
import { useState } from "react";
let names = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "0", "J", "Q", "K"];
let values = {
  A: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  0: 10,
  J: 10,
  Q: 10,
  K: 10,
};
let suits = ["C", "D", "H", "S"];
export default function Home() {
  const [selectedCards, setSelectedCards] = useState([]);

  const [userCards, setUserCards] = useState([]);
  const [courpierCards, setCourpierCards] = useState([]);
  const [userEnabled, setuserEnabled] = useState(false);
  const [courpierEnabled, setcourpierEnabled] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [blowChance, setBlowChance] = useState(0);
  const [totalSelectedCards, setTotalSelectedCards] = useState(0);
  const [totalPictureCards, settotalPictureCards] = useState(0);
  const [totalLowCards, settotalLowCards] = useState(0);
  const [totalHighCards, settotalHighCards] = useState(0);
  const CardDeck = styled.div`
    width: 100%;
    padding: 1rem;
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    position: relative;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    font-size: 8rem;
  `;
  const CardPicker = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 60%;
  `;
  const CardInput = styled.input`
    width: 100%;
    height: 3rem;
    border: none;
    border-radius: 0.5rem;
    padding: 0.5rem;
    font-size: 1.5rem;
    outline: none;
  `;

  const cardChange = (e) => {
    if (
      e.target.id[0] == "2" ||
      e.target.id[0] == "3" ||
      e.target.id[0] == "4" ||
      e.target.id[0] == "5" ||
      e.target.id[0] == "6"
    ) {
      settotalLowCards(totalLowCards + 1);
    }
    if (
      e.target.id[0] == "7" ||
      e.target.id[0] == "8" ||
      e.target.id[0] == "9" ||
      e.target.id[0] == "0"
    ) {
      settotalHighCards(totalHighCards + 1);
    }
    if (
      e.target.id[0] == "J" ||
      e.target.id[0] == "Q" ||
      e.target.id[0] == "K" ||
      e.target.id[0] == "A"
    ) {
      settotalPictureCards(totalPictureCards + 1);
    }
    if (userEnabled) {
      if (Object.keys(userCards).includes(e.target.id)) {
        setUserCards([
          ...userCards,
          { [e.target.id]: userCards[e.target.id] + 1 },
        ]);
      } else {
        setUserCards([...userCards, { [e.target.id]: 0 }]);
      }
      setUserPoints(userPoints + values[e.target.id[0]]);
    }
    if (courpierEnabled) {
      setCourpierCards([...courpierCards, e.target.id]);
    }
    if (selectedCards.find((item) => Object.keys(item)[0] == e.target.id)) {
      setSelectedCards(
        selectedCards.map((item) => {
          if (Object.keys(item)[0] == e.target.id) {
            return { [e.target.id]: item[e.target.id] + 1 };
          } else {
            return item;
          }
        })
      );
    } else {
      setSelectedCards([...selectedCards, { [e.target.id]: 1 }]);
    }
    setTotalSelectedCards(totalSelectedCards + 1);
  };
  const reset = () => {
    setSelectedCards([]);
    setTotalSelectedCards(0);
    settotalPictureCards(0);
    settotalLowCards(0);
    settotalHighCards(0);
  };
  const resetMyCards = () => {
    setUserCards([]);
    setCourpierCards([]);
    setUserPoints(0);
    setuserEnabled(false);
  };

  const enableButton = (e) => {
    console.log(e.target.id);
    if (e.target.id == "user") {
      setuserEnabled(true);
      if (courpierEnabled) {
        setcourpierEnabled(false);
      }
      return;
    } else if (e.target.id == "courpier") {
      setcourpierEnabled(true);
      if (userEnabled) {
        setuserEnabled(false);
      }
      return;
    }
    setuserEnabled(false);
    setcourpierEnabled(false);
  };
  const calculateChance = () => {
    const maximumValue = 21 - userPoints;
    let lostCases = 0;
    let allCards = suits.map((suit) =>
      names.map((name) => {
        return { [name + suit]: 4 };
      })
    );
    for (const card of allCards.flat()) {
      let cardId = Object.keys(card)[0];
      let foundValue = selectedCards.find(
        (item) => Object.keys(item)[0] == cardId
      );
      if (foundValue) {
        card[cardId] = card[cardId] - foundValue[cardId];
      }
    }
    let remainingCards = allCards
      .flat()
      .filter((item) => Object.values(item)[0] > 0);
    console.log(remainingCards);
    for (const card of remainingCards) {
      let cardId = Object.keys(card)[0];
      let cardValue = values[cardId[0]];
      let cardTimes = card[cardId];
      if (cardValue > maximumValue) {
        lostCases += cardTimes;
      }
    }
    let totalRemainingCards = remainingCards.reduce(
      (acc, item) => acc + Object.values(item)[0],
      0
    );
    let chance = (lostCases / totalRemainingCards) * 100;
    return chance;
  };
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {console.log(selectedCards)}
      <main className="h-screen bg-[#252525] p-5 flex flex-row w-full">
        <div className="flex flex-row justify-around w-[75%] my-5">
          {suits.map((suit, index) => {
            return (
              <CardDeck key={index}>
                {names.map((name, cardIndex) => {
                  return (
                    <div
                      className="absolute hover:translate-x-2 transition-all  ease-in-out"
                      id={name + suit}
                      style={
                        selectedCards.includes(name + suit)
                          ? { top: cardIndex * 55 }
                          : { top: cardIndex * 55 }
                      }
                      key={cardIndex}
                      onClick={cardChange}
                    >
                      <img
                        src={`https://www.deckofcardsapi.com/static/img/${
                          name + suit
                        }.png`}
                        id={name + suit}
                        height={100}
                        width={100}
                      />
                      <div
                        className="bg-[#252525] absolute top-0 right-[3px] rounded-full flex justify-center items-center"
                        id={name + suit}
                        onClick={cardChange}
                        style={{ width: 25, height: 25 }}
                      >
                        <h1 className="text-white absolute text-sm text-center">
                          {selectedCards.find(
                            (item) => Object.keys(item)[0] == name + suit
                          )
                            ? selectedCards.find(
                                (item) => Object.keys(item)[0] == name + suit
                              )[name + suit]
                            : 0}
                        </h1>
                      </div>
                    </div>
                  );
                })}
              </CardDeck>
            );
          })}
        </div>
        <div className="w-[30%]  mx-5 ">
          <div className="text-xl text-center text-[#f0f0f0] font-bold my-11">
            <h1>Probabilities</h1>
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="text-[#f0f0f0] font-bold flex flex-row gap-5 h-[35px] items-center">
              <h1>Chance For 2-3-4-5-6</h1>
              <span>
                {totalLowCards > 0
                  ? (
                      ((100 - totalLowCards) / (260 - totalSelectedCards)) *
                      100
                    ).toFixed(2)
                  : ((100 / (260 - totalSelectedCards)) * 100).toFixed(2)}
                %
              </span>
            </div>
            <div className="text-[#f0f0f0] font-bold flex flex-row gap-5 h-[35px] items-center">
              <h1>Chance For 7-8-9-10</h1>
              <span>
                {totalHighCards > 0
                  ? (
                      ((80 - totalHighCards) / (260 - totalSelectedCards)) *
                      100
                    ).toFixed(2)
                  : ((80 / (260 - totalSelectedCards)) * 100).toFixed(2)}
                %
              </span>
            </div>
            <div className="text-[#f0f0f0] font-bold flex flex-row gap-5 h-[35px] items-center ">
              <h1>Chance For Picture Card</h1>

              <span>
                {totalPictureCards > 0
                  ? (
                      ((80 - totalPictureCards) / (260 - totalSelectedCards)) *
                      100
                    ).toFixed(2)
                  : ((80 / (260 - totalSelectedCards)) * 100).toFixed(2)}
                %
              </span>
            </div>
            <div className="text-[#f0f0f0] font-bold flex flex-row gap-5 h-[35px] items-center">
              <h1>Total Found Aces</h1>
              <span>
                {selectedCards.filter((card) => card[0] == "A").length}
              </span>
            </div>

            <div>
              <button
                className="bg-[#f0f0f0] text-[#252525] font-bold py-2 px-4 rounded-md"
                onClick={reset}
              >
                Reset
              </button>
              <button
                className="bg-[#f0f0f0] text-[#252525] font-bold py-2 px-4 rounded-md mx-5"
                onClick={resetMyCards}
              >
                Reset My Cards
              </button>
            </div>
            <div style={{ height: "0.2rem" }}></div>

            <CardPicker>
              <button
                onClick={enableButton}
                id="general"
                className={
                  !courpierEnabled && !userEnabled
                    ? "bg-red-500 text-[#252525] font-bold py-2 px-4 rounded-md"
                    : "bg-[#f0f0f0] text-[#252525] font-bold py-2 px-4 rounded-md opacity-50"
                }
              >
                General
              </button>
            </CardPicker>
            <div style={{ height: "0.2rem" }}></div>
            <CardPicker>
              <button
                id="user"
                onClick={enableButton}
                className={
                  userEnabled
                    ? "bg-red-500 text-[#252525] font-bold py-2 px-4 rounded-md"
                    : "bg-[#f0f0f0] text-[#252525] font-bold py-2 px-4 rounded-md opacity-50"
                }
              >
                Enable My Card
              </button>
            </CardPicker>
            <div style={{ height: "0.2rem" }}></div>
            <div className="flex flex-row my-5 justify-around">
              <div>
                <h1 className="text-md text-[#f0f0f0]">Pick</h1>
                <h1 className="text-md text-[#f0f0f0]">{userPoints}</h1>
              </div>
              <div>
                <h1 className="text-md text-[#f0f0f0]">Blow Chance On Pick</h1>
                {calculateChance() > 0 ? (
                  <h1 className="text-md text-[#f0f0f0]">
                    {calculateChance().toFixed(2)}%
                  </h1>
                ) : (
                  <h1 className="text-md text-[#f0f0f0]">100% safe pick</h1>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-md text-[#f0f0f0]">Your Cards</h1>
              <div className="flex flex-row gap-5">
                {userCards.map((card, index) => {
                  return (
                    <div key={index}>
                      <img
                        src={`https://www.deckofcardsapi.com/static/img/${card}.png`}
                        height={50}
                        width={50}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
