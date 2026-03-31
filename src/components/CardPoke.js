//import
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase.js";
import { uid } from "uid";
import { set, ref, get, remove } from "firebase/database";
import { Link } from 'react-router-dom';
//css
import './style/Pokemon.css';

export default function CardPoke(props) {
    const { dataProp, flag, loadSave } = props;
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {   //richiama 'loadSavedPokemons' ogni volta che cambia il valore di 'loadSave'
        loadSavedPokemons();
    }, [loadSave]);

    // verifica se il pokemon è già stato salvato
    const loadSavedPokemons = () => {
        // 'ref' crea un riferimento a un percorso nel db firebase
        const savedPokemonsRef = ref(db, `PokedexPersonal/${auth.currentUser.uid}`);    // riferimento specifico all'utente specifico (auth.currentUser.uid)
    
        get(savedPokemonsRef).then((snapshot) => {  // prende i dati nel percorso specificato
            if (snapshot.exists()) {    // se non ci sono dati il check del save viene impostato su false
                const savedPokemonData = snapshot.val(); // estrapola e salva i dati dello snapshot (valore in questo istante dell'oggetto)
                const matchingPokemon = Object.values(savedPokemonData).find(savedCard =>
                    savedCard.pokemonSave === dataProp.nome && savedCard.pokemonProg === dataProp.progressivo
                );
                setIsChecked(matchingPokemon !== undefined);    // se il pokemon è stato trovato viene impostato come salvato
            } else {
                setIsChecked(false);
            }
        });        
    };

    const handleCheck = () => {
        setIsChecked(!isChecked);   //importa isChecked con il suo valore opposto
    
        const savedPokemonKey = `saved_pokemon_${auth.currentUser.uid}_${dataProp.nome}`;   // crea una chiave basata sull'uid
        localStorage.setItem(savedPokemonKey, !isChecked);
    
        if (!isChecked) {   // controlla se il pokemon è selezionato o no
            const uidd = uid();
            set(ref(db, `PokedexPersonal/${auth.currentUser.uid}/${uidd}`), {
                pokemonSave: dataProp.nome,
                pokemonNum: dataProp.numero,
                pokemonProg: dataProp.progressivo
            }); // il pokemon viene salvato nel 'pokedex' dell'utente sotto il suo uid univoco
        } else {
            const savedPokemonsRef = ref(db, `PokedexPersonal/${auth.currentUser.uid}`);
            // si cerca una corrispondenza del pokemon appena deselezionato nel db sotto l'uid univoco dell'utente
            get(savedPokemonsRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const savedPokemonData = snapshot.val();
                    
                    const matchingPokemonKey = Object.keys(savedPokemonData).find(key => 
                        savedPokemonData[key].pokemonSave === dataProp.nome && savedPokemonData[key].pokemonProg === dataProp.progressivo
                    );
                    
                    if (matchingPokemonKey) {   // se trovato viene eliminato
                        remove(ref(db, `PokedexPersonal/${auth.currentUser.uid}/${matchingPokemonKey}`));
                    }
                }
            });
        }
    };
    
    return (
        <div key={dataProp.id} className=" d-flex align-items-center justify-content-center mb-4">
            <div className="card">
                <div className="header" style={{ backgroundImage: `url(${dataProp.url})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: '100%'}}>
                    <div className="blurBg" style={{ backdropFilter: 'blur(10px)'}}>
                        <h3>{dataProp.nome}</h3>
                        <p>#{dataProp.numero}</p>
                        { dataProp.noSave != true &&
                            <Link to="/SingleCard" state={{ dataProp, check:isChecked }}>
                                <img className="photoPoke" src={dataProp.url} />
                            </Link>
                        }
                        {flag !== false && <div><h1>{dataProp.progressivo}</h1></div>}
                    </div>
                </div>
                { dataProp.noSave != true &&
                    <div className="card-socials">
                        <label className="container">
                            <input className="input" type="checkbox" checked={isChecked} onChange={handleCheck}/>
                            <svg className="save-regular" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z"></path></svg>
                            <svg className="save-solid" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"></path></svg>
                        </label>
                    </div>
                }
            </div>
        </div>
    );
}