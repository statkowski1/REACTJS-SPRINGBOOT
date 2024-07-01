import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { format } from 'date-fns';
import img from '../Images/brak-zdjecia.jpg';

const Reservation = () => {
    const [Reservation, setReservation] = useState(null);
    const [Room, setRoom] = useState(null);

    useEffect(() => {
        getReservation();
    }, [])

    useEffect(() => {
        if(Reservation != null)
        {
            getRoom();
        }
    }, [Reservation])
    
    
    const getReservation = () => {
        axios.get('http://localhost:8080/reservation/showReservation', {params: { userId: JSON.parse(localStorage.getItem('user')).id }}).then((response) => {
            setReservation(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getRoom = () => {
        axios.get('http://localhost:8080/room/showRoom', {params: { roomId: Reservation.idRoom }}).then((response) => {
            setRoom(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const deleteReservation = () => {
        axios.delete('http://localhost:8080/reservation/deleteReservation', {params: { reservationId: Reservation.id }}).then((response) => {
            setReservation(null);
            setRoom(null);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

  return (
    <div class="container w-50 p-3">
        {Reservation != null && Room != null ? (
        <div class="card mb-3">
            {Room.image == null ? (
                <img class="card-img-top" src={img} />
            ) : (
                <img class="card-img-top" src={`data:image/jpeg;base64,${Room.image}`} />
            )}
            <div class="card-img-overlay">
                {Reservation.statusReservation === "Zarezerwowany" && (
                    <button type="button" class="btn btn-outline-danger position-absolute top-50 start-50 translate-middle" onClick={deleteReservation}>Anuluj rezerwacje</button>
                )}
            </div>
            <div class="card-body">
                <h5 class="card-title">Rezerwacja: {Room != null ? (Room.numberOfRoom) : ('')}</h5>
                <p class="card-text">Typ pokoju: {Room != null ? (Room.typeRoom) : ('')}</p>
                <p class="card-text">Cena: {Room != null ? (Room.price) : ('')} zł</p>
                <p class="card-text"><small class="text-body-secondary">Data rezerwacji: {Reservation.firstDate}</small></p>
            </div>
        </div>
        ) : ('')}
    </div>
  )
}

export default Reservation