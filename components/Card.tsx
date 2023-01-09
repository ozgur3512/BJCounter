import React from 'react'
import styled from "styled-components";
type Props = {
    value:string
    space: number
}

function Card({value,space}: Props) {
 
  return (
    
    <div className='absolute hover:translate-x-4 transition-all delay-100 ease-in-out' style={{top:space*50}}>
    <img src={`https://www.deckofcardsapi.com/static/img/${value}.png`} height={100} width={100}/>
    </div>
  )
}

export default Card