import React, {useState, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import { auth, db } from "../firebase.js";
import { uid } from "uid";
import { set, ref, get, remove } from "firebase/database";
import { Link } from 'react-router-dom';
// css
import './style/SingleCard.css'
// components
import Navbar from './Navbar';

export default function SingleSet() {
	const location = useLocation(); //dati da CarPoke
	const { dataProp, check } = location.state;
	console.log(dataProp)

	const [activeLink, setActiveLink] = useState(0);
	const [isChecked, setIsChecked] = useState(check);
	const [setFind, setSetFind] = useState([]);
	const [previousPokemon, setPreviousPokemon] = useState([]);
    const [nextPokemon, setNextPokemon] = useState([]);

	useEffect(() => {
        findSet();
    }, [dataProp]);

	const findSet = () => {
		// Riferimento al nodo "Pokemon" nel tuo database Firebase
		const pokemonRef = ref(db, "Pokemon");
	
		// Recupera i dati dal database
		get(pokemonRef).then((snapshot) => {
			if (snapshot.exists()) {
				const datiPokemon = snapshot.val();
				for (const chiave in datiPokemon) {
					const set = datiPokemon[chiave];
					const figurine = set.figurine;
					if (figurine) {
						for (const figKey in figurine) {
							const pokemon = figurine[figKey];
							if (pokemon.nome === dataProp.nome) {
								setSetFind(set);
								if (figKey == 0) {
									setPreviousPokemon([figurine[figurine.length-1], figurine[figurine.length-2]]);
									setNextPokemon([figurine[parseInt(figKey)+1], figurine[parseInt(figKey)+2]]);
								} else if (figKey == 1) {
									setPreviousPokemon([figurine[figKey-1], figurine[figurine.length-1]]);
									setNextPokemon([figurine[parseInt(figKey)+1], figurine[parseInt(figKey)+2]]);
								} else if (figKey == figurine.length-1) {
									setPreviousPokemon([figurine[figKey-1], figurine[figKey-2]]);
									setNextPokemon([figurine[0], figurine[1]]);
								} else if (figKey == figurine.length-2) {
									setPreviousPokemon([figurine[figKey-1], figurine[figKey-2]]);
									setNextPokemon([figurine[parseInt(figKey)+1], figurine[0]]);
								} else {
									setPreviousPokemon([figurine[figKey-1], figurine[figKey-2]]);
									setNextPokemon([figurine[parseInt(figKey)+1], figurine[parseInt(figKey)+2]]);
								}
								return; // Esci dalla funzione dopo aver trovato il set
							}
						}
					}
				}
			}
		})
	};	

	const handleLinkClick = (event, index) => {
		event.preventDefault();
		setActiveLink(index);
	};

	 const handleCheck = () => {
        setIsChecked(!isChecked);
    
        const savedPokemonKey = `saved_pokemon_${auth.currentUser.uid}_${dataProp.nome}`;
        localStorage.setItem(savedPokemonKey, !isChecked);
    
        if (!isChecked) {
            const uidd = uid();
            set(ref(db, `PokedexPersonal/${auth.currentUser.uid}/${uidd}`), {
                pokemonSave: dataProp.nome,
                pokemonNum: dataProp.numero,
                pokemonProg: dataProp.progressivo
            });
        } else {
            const savedPokemonsRef = ref(db, `PokedexPersonal/${auth.currentUser.uid}`);
            
            get(savedPokemonsRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const savedPokemonData = snapshot.val();
                    
                    const matchingPokemonKey = Object.keys(savedPokemonData).find(key => 
                        savedPokemonData[key].pokemonSave === dataProp.nome && savedPokemonData[key].pokemonProg === dataProp.progressivo
                    );
                    
                    if (matchingPokemonKey) {
                        remove(ref(db, `PokedexPersonal/${auth.currentUser.uid}/${matchingPokemonKey}`));
                    }
                }
            });
        }
    };

	return (
		<div className='container-fluid'>
			<div className='row justify-content-center align-items-center'>
				<div className='col-12 d-flex justify-content-center align-text-center title'>
					<a className='backHome' href='/Pokemon'>Pokèmon</a>
				</div>
			</div>
			<div className='row justify-content-center align-items-center contSingleCard'>
				<div className='col-lg-5'>
					<div className='row justify-content-center align-items-center imagePokemon'>
						<div className="d-flex align-items-center justify-content-center mb-4">
							<div className="cardSingle">
								<div className="headerSingle" style={{ backgroundImage: `url(${dataProp.url})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: '100%'}}>
									<div className="blurBgSingle" style={{ backdropFilter: 'blur(10px)'}}>
										<img className="photoPokeSingle" src={dataProp.url}/>
									</div>
								</div>
							</div>
						</div>	
					</div>
					<div className='row justify-content-center align-items-center savePoke'>
						<div className="card-socialsSingle">
							<label className="containerSingle">
								<input className="input" type="checkbox" checked={isChecked} onChange={handleCheck}/>
								<svg className="save-regular" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M0 48C0 21.5 21.5 0 48 0l0 48V441.4l130.1-92.9c8.3-6 19.6-6 27.9 0L336 441.4V48H48V0H336c26.5 0 48 21.5 48 48V488c0 9-5 17.2-13 21.3s-17.6 3.4-24.9-1.8L192 397.5 37.9 507.5c-7.3 5.2-16.9 5.9-24.9 1.8S0 497 0 488V48z"></path></svg>
								<svg className="save-solid" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"></path></svg>
							</label>
						</div>
					</div>
				</div>
				<div className='col-lg-7'>
					<div className='row'>
						<div className='col-12 boxDate'>				
							<div className='row'>
								<div className='col-12 nameSingle d-flex justify-content-center align-items-center'>
									{dataProp.nome}
								</div>
							</div>
							<div className='row justify-content-center align-items-center'>
								<div className='col-12 d-flex justify-content-center align-items-center'>
									<nav className="navMenu mt-1">
										<div className='col-6'>
											<a href='' className={`${0 === activeLink ? 'active' : ''}`} onClick={(event) => handleLinkClick(event, 0)}>
												Dati												
											</a>
											{0 === activeLink && <div className="dot"></div>}
										</div>
										<div className='col-6'>
											<a href='' className={`${1 === activeLink ? 'active' : ''}`} onClick={(event) => handleLinkClick(event, 1)}>
												Set		
											</a>
											{1 === activeLink && <div className="dot"></div>}
											</div>
										<div className="dot"></div>
									</nav>
								</div>
							</div>					
							{0 === activeLink ? (
								<div className='row contDate'>
									<div className='col-12'>
										<div className='row subtitleDate justify-content-center align-items-center'>
											Fase
										</div>
										<div className='row date justify-content-center align-items-center'>
											{dataProp.stadio_evolutivo}
										</div>
										<div className='row subtitleDate justify-content-center align-items-center'>
											Abilita'
										</div>
										<div className='row date justify-content-center align-items-center text-justify'>
											{dataProp.abilita.map((abilita, index) => (
												<div className='col-4 d-flex justify-content-center align-items-center text-justify' key={index}>{abilita}</div>
											))}
										</div>
										<div className='row subtitleDate justify-content-center align-items-center'>
											<div className='col-4 d-flex justify-content-center align-items-center ml-5'>
												Numero
											</div>
											<div className='col-4 d-flex justify-content-center align-items-center mr-5'>
												Progressivo
											</div>
										</div>
										<div className='row number justify-content-center align-items-center'>
											<div className='col-5 d-flex justify-content-center align-items-center ml-2 divisore'>
												{dataProp.numero}
											</div>
											<div className='col-5 d-flex justify-content-center align-items-center mr-2'>
												{dataProp.progressivo}
											</div>
										</div>
									</div>
								</div>
							) :(
								<div className='row contDate'>
									<div className='col-12'>
										<div className='row subtitleDate justify-content-center align-items-center'>
											Set di Apparteneza
										</div>
										<div className='row date justify-content-center align-items-center'>
											{setFind.nomeSet}
										</div>
										<div className='row subtitleDate justify-content-center align-items-center'>
											Anno Uscita
										</div>
										<div className='row number justify-content-center align-items-center'>
											{setFind.annoUscita}
										</div>
										<div className='row subtitleDate justify-content-center align-items-center'>
											<div className='col-4 d-flex justify-content-center align-items-center ml-5'>
												Numero Set
											</div>
											<div className='col-4 d-flex justify-content-center align-items-center mr-5'>
												Pokemon Presenti
											</div>
										</div>
										<div className='row number justify-content-center align-items-center'>
											<div className='col-5 d-flex justify-content-center align-items-center ml-2 divisore'>
												{setFind.numeroSet}
											</div>
											<div className='col-5 d-flex justify-content-center align-items-center mr-2'>
												{setFind.figurine.length}
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
				<div className='row justify-content-center align-items-center otherPoke text-center'>Carte Correlate:</div>
				<div className='row justify-content-center align-items-center imagePokemon' style={{backgroundColor: '#000000c9', paddingBottom: '15vh'}}>
					{previousPokemon.map((pokemon, index) => (									
						<div key={index} className="d-flex align-items-center justify-content-center ml-3 mr-3 mt-3 mb-3">
							<div className="cardSingle" style={{height: '300px', width: '215px', boxShadow: '5px 5px 5px 5px #d5a00064'}}>
								<div className="headerSingle" style={{ backgroundImage: `url(${pokemon.url})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: '100%'}}>
									<div className="blurBgSingle" style={{ backdropFilter: 'blur(10px)'}}>
										<Link to="/SingleCard" state={{ dataProp:pokemon, check:isChecked }}>
											<img className="pokeList" src={pokemon.url}/>
										</Link>
									</div>
									<div className='numList'>{pokemon.progressivo}</div>
								</div>
							</div>
						</div>
					)).reverse()}
					<div className="d-flex align-items-center justify-content-center ml-3 mr-3 mt-3 mb-3">
						<div className="cardSingle" style={{boxShadow: '5px 5px 5px 5px #d5a00064'}}>
							<div className="headerSingle" style={{ backgroundImage: `url(${dataProp.url})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: '100%'}}>
								<div className="blurBgSingle" style={{ backdropFilter: 'blur(10px)'}}>
									<img className="pokeList" src={dataProp.url}/>
									<div className='numList'>{dataProp.progressivo}</div>
								</div>
							</div>
						</div>
					</div>
					{nextPokemon.map((pokemon, index) => (									
						<div key={index} className="d-flex align-items-center justify-content-center ml-3 mr-3 mt-3 mb-3">
							<div className="cardSingle" style={{height: '300px', width: '215px', boxShadow: '5px 5px 5px 5px #d5a00064'}}>
								<div className="headerSingle" style={{ backgroundImage: `url(${pokemon.url})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: '100%'}}>
									<div className="blurBgSingle" style={{ backdropFilter: 'blur(10px)'}}>
										<Link to="/SingleCard" state={{ dataProp:pokemon, check:isChecked }}>
											<img className="pokeList" src={pokemon.url}/>
										</Link>
										<div className='numList'>{pokemon.progressivo}</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			<Navbar />
		</div>
	)
};