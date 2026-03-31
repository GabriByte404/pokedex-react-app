import React, { useEffect, useState } from "react";
//form
import FormLogin from ".//FormLogin";
import Loading from './Loading';
//css
import './style/Login.css';

export default function Login() {
    const [loading, setLoading] = useState(true);
    const bgImage = [
        'https://images8.alphacoders.com/124/1243956.jpg',
        'https://www.teahub.io/photos/full/95-954967_pokemon-4k.png',
        'https://pbs.twimg.com/media/CjKcXfVWYAIUXUn.jpg:large',
        'https://w.wallha.com/ws/14/ogOdyeuZ.png'
    ];

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * bgImage.length);
        const randomImage = bgImage[randomIndex];
        const randomBackgroundElement = document.querySelector('main');
        randomBackgroundElement.style.backgroundImage = `url('${randomImage}')`;
        setLoading(false);
    }, []); 

    return (
        <main>
            {loading ? (
                <Loading />          
            ) : (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col">
                            <div className="pokemon-text">PoKéMoN</div>
                            <div className="pikaMascotte"></div>
                            <FormLogin />
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
