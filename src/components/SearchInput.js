import React, { useState, useEffect } from 'react';
import { db } from "../firebase";
import { onValue, ref } from 'firebase/database';
import './style/Pokemon.css';

const SearchInput = (props) => {
    const [searchResult, setSearchResult] = useState('');
    const [originalData, setOriginalData] = useState(null);
    const [nonePoke, setNonePoke] = useState(null);


    useEffect(() => {
        const databaseRef = ref(db);
        onValue(databaseRef, (snapshot) => {
          const dataFromFirebase = snapshot.val();
          
          const pokemonData = [];
          for (let i = 0; i < dataFromFirebase.Pokemon.length; i++) {
            const pokemon = dataFromFirebase.Pokemon[i];
            if (pokemon.figurine && Array.isArray(pokemon.figurine)) {
              pokemonData.push(...pokemon.figurine);
            }
          }
  
          setOriginalData(pokemonData); // salvo dentro un useState tutti i pokemon in modo da poter re-settare il valore dopo una ricerca non profiqua
        });
        // in caso non venga trovato nulla
        setNonePoke([{
                nome: "None",
                numero: "##",
                url: "https://cdn.cardsrealm.com/images/cartas/xyp-xy-black-star-promos/en/med/altaria-xy46-xy46.png?1537",
                noSave: true
            }]);
    }, []);

    const handleSearch = (inputValue) => {
        const trimmedValue = inputValue.trim(); // il valore di ciò che sta venendo scritto senza spazi (.trim)
        if (trimmedValue === '') {
            setSearchResult(null);
            props.updatePokemonData(originalData);
        } else {
            const partialMatches = originalData.filter(
                (pokemon) => pokemon.nome.toUpperCase().includes(trimmedValue.toUpperCase())
            );
    
            if (partialMatches.length > 0) {
                inputValue = trimmedValue;
                setSearchResult(partialMatches);
                props.updatePokemonData(partialMatches);        
            } else {
                setSearchResult(null);
                props.updatePokemonData(nonePoke);
            }
        }
    };

    return (
        <div className="input-container">
            <input type="text" name="text" className="inputS" placeholder="Search Pokemon..." onChange={(e) => handleSearch(e.target.value)}/>
            <span className="iconS" onClick={() => handleSearch(document.querySelector('.inputS').value)}> 
                <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path opacity="1" d="M14 5H20" stroke="#0075BE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path opacity="1" d="M14 8H17" stroke="#0075BE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="#0075BE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        <path opacity="1" d="M22 22L20 20" stroke="#0075BE" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </g>
                </svg>
            </span>
        </div>
    );
};

export default SearchInput;
