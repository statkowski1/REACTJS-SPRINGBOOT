import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { format } from 'date-fns';
import img from '../Images/brak-zdjecia.jpg';
import img2 from '../Images/blank-profile-picture-600px.jpg';

const AdminReservation = () => {

    const [ReservationAndUserAndRoom, setReservationAndUserAndRoom] = useState([]);
    const [PaginatedReservationAndUserAndRoom, setPaginatedReservationAndUserAndRoom] = useState([]);
    const [LimitPagination, setLimitPagination] = useState(10);
    const [ActualPage, setActualPage] = useState(1);
    const [EndPage, setEndPage] = useState(1);
  
    const [ModalOption, setModalOption] = useState(0);
    const [Room, setRoom] = useState(null);
    const [User, setUser] = useState(null);

    let number = (ActualPage - 1) * LimitPagination + 1;

    useEffect(() => {
        getAllReservationAndUserAndRoom();
    }, [])

    useEffect(() => {
        setEndPage(Math.ceil(ReservationAndUserAndRoom.length / LimitPagination));
        console.log("ActualPage="+ActualPage);
        setPaginatedReservationAndUserAndRoom(ReservationAndUserAndRoom.slice((ActualPage - 1) * LimitPagination, ActualPage * LimitPagination))
    }, [ReservationAndUserAndRoom, ActualPage, LimitPagination])

    useEffect(() => {
        if(ModalOption == 0)
        {
            setRoom(0);
            setUser(0);
        }
    }, [ModalOption])
    
    
    const getAllReservationAndUserAndRoom = () => {
        axios.get('http://localhost:8080/reservationAndUserAndRoom/showAllReservationAndUserAndRoom').then((response) => {
            setReservationAndUserAndRoom(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getRoom = (roomId) => {
        axios.get('http://localhost:8080/room/showRoom', {params: { roomId: roomId }}).then((response) => {
            setRoom(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getUser = (userId) => {
        axios.get('http://localhost:8080/user/showUserById', {params: { id: userId }}).then((response) => {
            setUser(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const editStatusReservation = (reservationId, option) => {
        const updatedReservation = {
            id: reservationId,
            statusReservation: option,
        };

        axios.put(`http://localhost:8080/reservation/editStatusReservation/${reservationId}`, updatedReservation).then((response) => {
            getAllReservationAndUserAndRoom();
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const deleteReservation = (reservationId) => {
        axios.delete('http://localhost:8080/reservation/deleteReservation', {params: { reservationId: reservationId }}).then((response) => {
            console.log(response.data);
            getAllReservationAndUserAndRoom();
        }).catch((error) => {
            console.log(error);
        })
    }

    const changePage = (option) => {

        if(ActualPage > 1 && ActualPage != EndPage && option == 1)
        {
          setActualPage(ActualPage - 1);
        }
        else if(ActualPage == EndPage && EndPage > 2 && option == 1)
        {
          setActualPage(ActualPage - 2);
        }
        else if(ActualPage == 2 && EndPage == 2 && option == 1)
        {
          setActualPage(1);
        }
    
        if(ActualPage == 1 && EndPage > 2 && option == 2)
        {
          setActualPage(ActualPage + 1);
        }
        else if(ActualPage == EndPage && EndPage > 2 && option == 2)
        {
          setActualPage(ActualPage - 1);
        }
        else if(ActualPage == 1 && EndPage == 2 && option == 2)
        {
          setActualPage(2);
        }
    
        if(ActualPage < EndPage && option == 3)
        {
          setActualPage(ActualPage + 1);
        }
        if(ActualPage == 1 && option == 3)
        {
          setActualPage(ActualPage + 2);
        }
    }

  return (
    <div class="container">
      <br/>
      {(JSON.parse(localStorage.getItem('user'))?.typeUser === "Kierownik" || JSON.parse(localStorage.getItem('user'))?.typeUser === "Recepcjonista") && (
        <div>
            <table class="table table-secondary table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Imię i Nazwisko</th>
                        <th>Number pokoju</th>
                        <th>Data rezerwacji/zameldowania/wymeldowania</th>
                        <th>Edytuj status rezerwacji</th>
                        <th>Podgląd</th>
                        {JSON.parse(localStorage.getItem('user'))?.typeUser === "Kierownik" && (
                            <th>Opcje</th>
                        )}
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    {PaginatedReservationAndUserAndRoom.map(
                        reservationAndUserAndRoom =>
                        <tr>
                            <td>{reservationAndUserAndRoom.id}</td>
                            <td>{reservationAndUserAndRoom.user.firstName+" "+reservationAndUserAndRoom.user.lastName}</td>
                            <td>{reservationAndUserAndRoom.room.numberOfRoom}</td>
                            {/* <td>
                                {
                                    reservationAndUserAndRoom.reservation.firstDate != null
                                    ? format(new Date(reservationAndUserAndRoom.reservation.firstDate), 'yyyy-MM-dd HH:mm')
                                    : '-'
                                }
                                {
                                    reservationAndUserAndRoom.reservation.secondDate != null
                                    ? '/'+format(new Date(reservationAndUserAndRoom.reservation.secondDate), 'yyyy-MM-dd HH:mm')
                                    : '/-'
                                }
                                {
                                    reservationAndUserAndRoom.reservation.lastDate != null
                                    ? '/'+format(new Date(reservationAndUserAndRoom.reservation.lastDate), 'yyyy-MM-dd HH:mm')
                                    : '/-'
                                }
                            </td> */}
                            <td>
                                {
                                    reservationAndUserAndRoom.reservation.firstDate != null
                                    ? reservationAndUserAndRoom.reservation.firstDate
                                    : '-'
                                }
                                {
                                    reservationAndUserAndRoom.reservation.secondDate != null
                                    ? '/'+reservationAndUserAndRoom.reservation.secondDate
                                    : '/-'
                                }
                                {
                                    reservationAndUserAndRoom.reservation.lastDate != null
                                    ? '/'+reservationAndUserAndRoom.reservation.lastDate
                                    : '/-'
                                }
                            </td>
                            <td>
                                <select
                                    class="form-select bg-primary text-white"
                                    data-reservation-id={reservationAndUserAndRoom.reservation.id}
                                    value={reservationAndUserAndRoom.reservation.statusReservation}
                                    onChange={(e) => editStatusReservation(e.currentTarget.getAttribute('data-reservation-id'), e.target.value)}
                                >
                                    <option>Zarezerwowany</option>
                                    <option>Zakwaterowany</option>
                                    <option>Wymeldowany</option>
                                </select>
                            </td>
                            <td>
                                <div class="btn-group" role="group" aria-label="Basic outlined example">
                                    <button type="button" class="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#exampleModal" data-user-id={reservationAndUserAndRoom.user.id} onClick={(e) => {getUser(e.currentTarget.getAttribute('data-user-id')); setModalOption(2);}}>Klient</button>
                                    <button type="button" class="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#exampleModal" data-room-id={reservationAndUserAndRoom.room.id} onClick={(e) => {getRoom(e.currentTarget.getAttribute('data-room-id')); setModalOption(1);}}>Pokój</button>
                                </div>
                            </td>
                            {JSON.parse(localStorage.getItem('user'))?.typeUser === "Kierownik" && (
                                <td>
                                    <button class="btn btn-danger" data-reservation-id={reservationAndUserAndRoom.reservation.id} onClick={(e) => deleteReservation(e.currentTarget.getAttribute('data-reservation-id'))}>Usuń</button>
                                </td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class={`modal-dialog ${ModalOption == 2 ? ('modal-lg') : ('')}`}>
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={(e) => setModalOption(0)}></button>
                        </div>
                        {Room != null && ModalOption == 1 ? (
                            <div class="modal-body">
                                <div class="card mb-3">
                                    {Room.image == null ? (
                                        <img class="card-img-top" src={img} alt="..." />
                                    ) : (
                                        <img class="card-img-top" src={`data:image/jpeg;base64,${Room.image}`} alt="..." />
                                    )}
                                    <div class="card-body">
                                        <h5 class="card-title">Numer pokoju: {Room.numberOfRoom}</h5>
                                        <p class="card-text">Typ pokoju: {Room.typeRoom}</p>
                                        <p class="card-text">Cena: {Room.price} zł</p>
                                        <p class="card-text"><small class="text-body-secondary">{Room.status}</small></p>
                                    </div>
                                </div>
                            </div>
                        ) : 
                        User != null && ModalOption == 2 ? (
                            <div class="modalbody">
                                <div class="card mb-3 mx-auto bg-primary-subtle rounded-start-pill" style={{ maxWidth: '1000px' }}>
                                    <div class="row g-0">
                                        <div class="col-md-4">
                                            {User.image ? (
                                            <img src={`data:image/jpeg;base64,${User.image}`} class="img-fluid rounded-circle" />
                                            ) : (
                                            <img src={img2} class="img-fluid rounded-circle" />
                                            )}
                                        </div>
                                        <div class="col-md-8">
                                            <div class="card-body">
                                                <h3 class="card-title text-center">{User.firstName} {User.lastName}</h3>
                                                <p class="card-text text-center">Telefon: {User.phone}</p>
                                                <p class="card-text text-center">Adres zamieszkania: {User.address}</p>
                                                <p class="card-text text-center">Email: {User.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : ('')}
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={(e) => setModalOption(0)}>Zamknij</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                    </div>
                </div>
            </div> */}
            <nav aria-label="Page navigation example">
                <ul class="pagination justify-content-center">
                    <li class="page-item">
                        <button class="page-link" onClick={(e) => setActualPage(1)}>&laquo;</button>
                    </li>
                    <li class="page-item"><button class={`page-link ${ActualPage === 1 ? 'active' : ''}`} onClick={() => changePage(1)}>{ActualPage <= 1 || EndPage <= 3 ? (1) : ActualPage >= EndPage && EndPage > 3 ? (ActualPage - 2) : EndPage < 3 ? (1) : (ActualPage - 1)}</button></li>
                    {EndPage >= 2 ? (
                        <li class="page-item"><button class={`page-link ${ActualPage !== 1 && (ActualPage !== EndPage || EndPage < 3) ? 'active' : ''}`} onClick={() => changePage(2)}>{ActualPage <= 1 && EndPage != 2 ? (2) : ActualPage >= EndPage && EndPage != 2 ? (EndPage - 1) : EndPage == 2 ? (2) : (ActualPage)}</button></li>
                    ) : (
                        ''
                    )}
                    {EndPage >= 3 ? (
                        <li class="page-item"><button class={`page-link ${ActualPage === EndPage ? 'active' : ''}`} onClick={() => changePage(3)}>{ActualPage <= 2 ? (3) : ActualPage >= EndPage ? (ActualPage) : (ActualPage + 1)}</button></li>
                    ) : (
                        ''
                    )}
                    <li class="page-item">
                        <button class="page-link" onClick={(e) => setActualPage(EndPage)}>&raquo;</button>
                    </li>
                </ul>
          </nav>
        </div>
      )}
    </div>
  )
}

export default AdminReservation