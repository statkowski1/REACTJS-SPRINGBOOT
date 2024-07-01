import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';

const UpdateProfilComponent = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

    const handleFormSubmit = (e) => {
        e.preventDefault();
    
        const updatedUser = {
          id: JSON.parse(localStorage.getItem('user')).id,
          firstName,
          lastName,
          address,
          phone
        };

        axios.put(`http://localhost:8080/user/update/${JSON.parse(localStorage.getItem('user')).id}`, updatedUser)
          .then(response => {
            console.log(response.data);
            //setUserData(userData);
            navigate("/signin");
          })
          .catch(error => {
            console.error(error);
          });
      };
    
      useEffect(() => {
        axios.get('http://localhost:8080/user/signedin', { params: { id: JSON.parse(localStorage.getItem('user')).id } }).then((response) =>{
          setFirstName(response.data.firstName)
          setLastName(response.data.lastName)
          setAddress(response.data.address)
          setPhone(response.data.phone)
        }).catch(error => {
          console.log(error)
        })
      }, [])

      return (
        <div className="container">
          <form>
            <h1>Edytuj profil</h1>
            <div className="col-md-6">
              <label className="form-label">Imię:</label>
              <input
                type="text"
                className="form-control"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Nazwisko:</label>
              <input
              type="text"
              className="form-control"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Adres:</label>
              <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Telefon:</label>
              <input
              type="text"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)} />
            </div>
            <button className="btn btn-success" type="submit" onClick={handleFormSubmit}>Edytuj</button>
            <Link to="/signin" className="btn btn-info">Wróć</Link>
          </form>
        </div>
      );
}

export default UpdateProfilComponent