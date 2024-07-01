import React, { useState } from 'react'
import axios from 'axios'

const AdminCreateUser = () => {
    const [typeUser, setTypeUser] = useState('Klient');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const createUser = (e) => {
        e.preventDefault();
        const newUser = {typeUser, firstName, lastName, address, phone, email, password}

        axios.post('http://localhost:8080/user/createUser', newUser).then((response) => {
            console.log(response.data);
            setTypeUser('Klient');
            setFirstName('');
            setLastName('');
            setAddress('');
            setPhone('');
            setEmail('');
            setPassword('');
            //window.location.reload();
        }).catch((error) => {
            console.log(error);
        })
    }

  return (
    <div class="container">
        {JSON.parse(localStorage.getItem('user'))?.typeUser === "Kierownik" && (
        <div class="row justify-content-center">
            <div class="col-6">
                <h1 class="text-center">Stwórz użytkownika!</h1>
                <form>
                    <div class="mb-3">
                        <label class="form-label">Imię</label>
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Imię"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Nazwisko</label>
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Nazwisko"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Adres</label>
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Adres"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Numer telefonu</label>
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Numer telefonu"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Typ użytkonika</label>
                        <select
                            class="form-select"
                            value={typeUser}
                            onChange={(e) => setTypeUser(e.target.value)}
                            defaultValue="Klient"
                        >
                            <option>Klient</option>
                            <option>Recepcjonista</option>
                            <option>Kucharz</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input
                            type="text"
                            class="form-control"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Hasło</label>
                        <input
                            type="password"
                            class="form-control"
                            placeholder="Hasło"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button onClick={(e) => createUser(e)} class="btn btn-primary" type="submit">Zapisz</button>
                </form>
          </div>
        </div>
        )}
    </div>
  )
}

export default AdminCreateUser