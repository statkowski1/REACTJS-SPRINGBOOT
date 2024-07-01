import React, { useState } from 'react';
import axios from "axios";

const AddRoom = () => {

    const [numberOfRoom, setNumberOfRoom] = useState('');
    const [typeRoom, setTypeRoom] = useState('Jednoosobowy');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState(null);

    const addRoom = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("newNumberOfRoom", numberOfRoom);
        formData.append("newTypeRoom", typeRoom);
        formData.append("newPrice", price);
        formData.append('roomImage', image);

        console.log([...formData]);

        axios.post('http://localhost:8080/room/addRoom', formData).then((response) => {
            console.log(response.data);
            setNumberOfRoom('');
            setTypeRoom('Jednoosobowy');
            setPrice(0);
            setImage(null);
            alert(response.data);
        }).catch((error) => {
            console.log(error);
            alert(error.response.data);
        })
    }

  return (
    <div class="container">
        {JSON.parse(localStorage.getItem('user'))?.typeUser === "Kierownik" && (
        <div class="row justify-content-center">
            <div class="col-6">
                <h1 class="text-center">Dodaj nowy pokój!</h1>
                <form>
                    <div class="mb-3">
                        <label class="form-label">Numer pokoju</label>
                        <input 
                            type="text"
                            class="form-control"
                            placeholder="Numer pokoju"
                            value={numberOfRoom}
                            onChange={(e) => setNumberOfRoom(e.target.value)}
                        />
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Typ pokoju</label>
                        <select 
                            type="text"
                            class="form-select"
                            placeholder="Typ pokoju"
                            value={typeRoom}
                            onChange={(e) => setTypeRoom(e.target.value)}
                            defaultValue="Jednoosobowy"
                        >
                            <option>Jednoosobowy</option>
                            <option>Dwuosobowy</option>
                            <option>Apartament</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Cena</label>
                        <div class="input-group">
                            <input 
                                type="text"
                                class="form-control"
                                placeholder="Cena"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                            <div class="input-group-text">zł</div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Zdjęcie</label>
                        <input 
                            type="file"
                            class="form-control"
                            placeholder=""
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </div>
                    <button onClick={(e) => addRoom(e)} class="btn btn-primary" type="submit">Zapisz</button>
                </form>
            </div>
        </div>
        )}
    </div>
  )
}

export default AddRoom