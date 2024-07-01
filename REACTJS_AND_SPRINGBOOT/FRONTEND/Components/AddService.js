import React, { useState } from 'react'
import axios from "axios";

const AddService = () => {
  const [Name, setName] = useState('');
  const [TypeService, setTypeService] = useState('Jedzenie');
  const [Price, setPrice] = useState(0);
  const [Status, setStatus] = useState('Dostępne');
  const [Description, setDescription] = useState('');
  const [Image, setImage] = useState(null);

  const addService = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("newName", Name);
    formData.append("newTypeService", TypeService);
    formData.append("newPrice", Price);
    formData.append("newStatus", Status);
    formData.append("newDescription", Description);
    formData.append("serviceImage", Image);

    console.log([...formData]);

    axios.post('http://localhost:8080/service/addService', formData).then((response) => {
      console.log(response.data);
      setName('');
      setTypeService('Jedzenie');
      setPrice(0);
      setStatus('Dostępne');
      setDescription('');
      setImage(null);
      alert(response.data);
    }).catch((error) => {
      console.log(error);
      alert(error.response.data);
    })
  }

  return (
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-6">
          <h1 class="text-center">Dodaj nową usługę!</h1>
          <form>
            <div class="mb-3">
              <label class="form-label">Nazwa usługi</label>
              <input
                type="text"
                class="form-control"
                placeholder="Nazwa usługi"
                value={Name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Cena</label>
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Cena"
                  value={Price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <div class="input-group-text">zł</div>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Typ usługi</label>
              <select
                class="form-select"
                value={TypeService}
                onChange={(e) => setTypeService(e.target.value)}
                defaultValue="Jedzenie"
              >
                <option>Jedzenie</option>
                <option>Masaż</option>
                <option>Bilet</option>
                <option>Plaża</option>
                <option>Inne</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Status</label>
              <select
                class="form-select"
                value={Status}
                onChange={(e) => setStatus(e.target.value)}
                defaultValue="Dostępne"
              >
                <option>Dostępne</option>
                <option>Niedostępne</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Zdjęcie</label>
              <input
                type="file"
                class="form-control"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Opis</label>
              <textarea 
              class="form-control"
              rows="8"
              placeholder="Opis usługi"
              onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button onClick={(e) => addService(e)} class="btn btn-primary" type="submit">Zapisz</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddService