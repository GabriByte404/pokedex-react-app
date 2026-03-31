import React from 'react'
//css
import './style/Pokemon.css';

const Loading = () => {
  return (
    <div className="container-poke">
        <div className="pokeball"></div>
        <div className="loader">
            <span>L</span>
            <span>O</span>
            <span>A</span>
            <span>D</span>
            <span>I</span>
            <span>N</span>
            <span>G</span>
        </div>
    </div>   
  )
}

export default Loading