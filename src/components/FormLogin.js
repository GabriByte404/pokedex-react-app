import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

//css
import './style/Login.css';

export default function FormLogin() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isRegistering, setIsRegistering] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {	// al 'cambio di stato' dell'authentificazione dello user si passa alla schermata dei pokemon
			if (user && user.emailVerified) {
				navigate("/Pokemon");
			}
		});
	}, []);

	const handleSignUpClick = () => {
        setIsRegistering(!isRegistering);
		const errorDiv = document.getElementById("errorDiv");
		errorDiv.textContent = '';
    };

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleSignIn = () => {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				const user = userCredential.user;
				if (user && user.emailVerified) {
					navigate("/Pokemon");
				} else {
					Swal.fire({
						imageUrl: '../../img/alert/Jigglypuff.png',
						imageWidth: '100px',
						imageHeight: '100px',
						title: 'Conferma Email',
						text: 'Devi confermare la tua email prima di poter fare il login!',
						confirmButtonText: 'Conferma',
						confirmButtonColor: '#970404',
						color: '#fff',
						iconColor: '#970404',
						backdrop: `
							#dfdfdf76
						`,
						customClass: {
						  popup: 'custom-popup-error', // Classe personalizzata per il popup di errore
						  container: 'my-swal-container-class',
						  title: 'my-swal-titleError-class'
						}
					  });					  
				}
			})
			.catch((err) => {
				const errorDiv = document.getElementById("errorDiv");
				if (errorDiv) {
					let mss;
					if (err == 'FirebaseError: Firebase: Error (auth/wrong-password).' || err == 'FirebaseError: Firebase: Error (auth/user-not-found).') {
						mss = "Wrong email or password"
						errorDiv.textContent = mss;
					} else {
						Swal.fire({
							icon: 'error',
							title: 'Errore',
							text: err.message,
							confirmButtonText: 'Conferma',
							confirmButtonColor: '#970404',
							color: '#fff',
							iconColor: '#970404',
							backdrop: `
								#dfdfdf76
							`,
							customClass: {
							popup: 'custom-popup-error', // Classe personalizzata per il popup di errore
							container: 'my-swal-container-class',
							title: 'my-swal-titleError-class'
							}
						})		
					}
				}
			  });
	};

	const handleRegister = () => {
		var checkbox = document.getElementById("acceptTerms");
		if (checkbox.checked) {
			createUserWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					const user = userCredential.user;
					sendEmailVerification(user)
						.then(() => {
							Swal.fire({
								imageUrl: '../../img/alert/pikaPiplup.png',
								imageWidth: '225px',
								imageHeight: '125px',
								title: 'Controlla la tua posta',
								text: 'Ti abbiamo inviato, al tuo indirizzo mail, il link per confermare il tuo account.',
								color: '#000',
								confirmButtonText: 'Ho capito',
								confirmButtonColor: '#0075BE',
								backdrop: `
									#FFCC0076
								`,
								customClass: {
									popup: 'custom-popup-confirm',
									container: 'my-swal-container-class',
									title: 'my-swal-titleConfirm-class'
								  }
								});
							setIsRegistering(false);
						})
						.catch((err) => Swal.fire({
								icon: 'error',
								title: 'Errore',
								text: err.message,
								confirmButtonText: 'Conferma',
								confirmButtonColor: '#970404',
								color: '#fff',
								iconColor: '#970404',
								backdrop: `
									#dfdfdf76
								`,
								customClass: {
								popup: 'custom-popup-error', // Classe personalizzata per il popup di errore
								container: 'my-swal-container-class',
								title: 'my-swal-titleError-class'
								}
							})		
						  );
				})
				.catch((err) => Swal.fire({
					icon: 'error',
					title: 'Errore',
					text: err.message,
					confirmButtonText: 'Conferma',
					confirmButtonColor: '#970404',
					color: '#fff',
					iconColor: '#970404',
					backdrop: `
						#dfdfdf76
					`,
					customClass: {
					popup: 'custom-popup-error', // Classe personalizzata per il popup di errore
					container: 'my-swal-container-class',
					title: 'my-swal-titleError-class'
					}
				})		
			  );
		} else{
			  Swal.fire({
				imageUrl: '../../img/alert/piplup.png',
				imageWidth: '100px',
				imageHeight: '100px',
				title: 'Termini e Condizioni',
				text: 'Prima di poterti registrare devi accettare i nostri temini e condizioni!',
				color: '#fff',
				confirmButtonText: 'Ho capito',
				confirmButtonColor: '#0075BE',
				iconColor: '#D5A100',
				backdrop: `
					#0a285f76
				`,
				customClass: {
					popup: 'custom-popup-warning',
					container: 'my-swal-container-class',
					title: 'my-swal-title-class'
				  }
				});
		}
	};

	return (

		<div className="mainCont d-flex align-items-center justify-content-center">
			{isRegistering ? (
				<div className="form">
					<p id="heading">Sign Up</p>
					<div className="field">
						<svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
						</svg>
						<input autoComplete="off" placeholder="Email" className="input-field" type="text" onChange={handleEmailChange} value={email} required='' />
					</div>
					<div className="field">
						<svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
						</svg>
						<input autoComplete="off" placeholder="Password" className="input-field" type="password" onChange={handlePasswordChange} value={password} required=''  />
					</div>
					<div className="checkbox-wrapper-4 d-flex justify-content-center align-items-center">
						<input className="inp-cbx" id="acceptTerms" type="checkbox"/>
						<label className="cbx" htmlFor="acceptTerms"><span>
						<svg width="12px" height="10px">
							
						</svg></span><span>I accept terms and conditions..</span></label>
						<svg className="inline-svg">
							<symbol id="check-4" viewBox="0 0 12 10">
							<polyline points="1.5 6 4.5 9 10.5 1"></polyline>
							</symbol>
						</svg>
					</div>
					<div className="btn">
						<button className="button1" onClick={handleSignUpClick}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Login&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
						<button className="button2" onClick={handleRegister}>Register Me!</button>
					</div>
					<div id="errorDiv"></div>
				</div>
			) : (
				<div className="form">
					<p id="heading">Log In</p>
					<div className="field">
						<svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
						</svg>
						<input autoComplete="off" placeholder="Email" className="input-field" type="text" onChange={handleEmailChange} value={email} required='' />
					</div>
					<div className="field">
						<svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
						<path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
						</svg>
						<input autoComplete="off" placeholder="Password" className="input-field" type="password" onChange={handlePasswordChange} value={password} required=''  />
					</div>
					<div className="btn">
						<button className="button1" onClick={handleSignIn}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Let's Go!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
						<button className="button2" onClick={handleSignUpClick}>Sign Up</button>
					</div>
					<div id="errorDiv"></div>	
				</div>
			)}			
		</div>	
	);
}