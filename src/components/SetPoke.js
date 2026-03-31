import React from 'react';
import { Link } from 'react-router-dom';
import './style/Set.css';

export default function SetPoke(props) {
    const { dataProp } = props;

    return (
        <div className="cardGcc">
            <div className="infos">
                <div className="image"><img className='image' src='../img/pokeball.png' alt="Pokeball"></img></div>
                <div className="info">
                    <div>
                        <p className="name">
                            {dataProp.nomeSet}
                        </p>
                        <p className="function">
                            Anno: {dataProp.annoUscita}
                        </p>
                    </div>
                    <div className="stats">
                        <p className="flex flex-col">
                            N. Set
                            <span className="state-value">
                                {dataProp.numeroSet}
                            </span>
                        </p>
                        <p className="flex">
                            N. Pokemon
                            <span className="state-value">
                                {dataProp.figurine.length}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <Link to="/SingleSet" state={{ dataProp }}>
                <button className="request" type="button">
                    Scopri Pokemon
                </button>
            </Link>
        </div>
    )
}
