import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";

 const SignUpComponent  = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const saveSignUp = (e) => {
        e.preventDefault();
        const signUpUser = {firstName, lastName, address, phone, email, password}
    
        axios.post('http://localhost:8080/signup', signUpUser).then((respone) =>{
            console.log(respone.data)
            navigate("/");
        }).catch(error =>{
            console.log(error)
        })
    }

    // const saveSignUp = (e) => {
    //     e.preventDefault();
    //     const request = {firstName, lastName, email, password};

    //     axios.post('http://localhost:8080/auth/register', request).then((response) => {
    //         console.log(response.data);
    //         navigate("/");
    //     }).catch((error) => {
    //         console.log(error);
    //     })
    // }

  return (
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-6">
                <h1 class="text-center">Rejestracja</h1>
                <form>
                    <div class="mb-3">
                        <label class="form-label">Imię</label>
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Podaj imię"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nazwisko</label>
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Podaj nazwisko"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Adres</label>
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Podaj adres zamieszkania"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Telefon</label>
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Podaj numer telefonu"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Adres email</label>
                        <input
                            type="email"
                            class="form-control"
                            placeholder="Podaj adres email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Hasło</label>
                        <input
                            type="password"
                            class="form-control"
                            placeholder="Podaj nowe hasło"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button onClick={(e) => saveSignUp(e)} class="btn btn-primary" type="submit">Submit</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default SignUpComponent