import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import img from '../Images/brak-zdjecia.jpg';
import img1 from '../Images/pexels-vecislavas-popa-1743231.jpg'
import img2 from '../Images/pexels-pixabay-164595.jpg'
import img3 from '../Images/chastity-cortijo-R-w5Q-4Mqm0-unsplash.jpg'
import axios from 'axios';

export const Room = () => {

  const navigate = useNavigate();

  const [Room, setRoom] = useState([]);
  const [PaginatedRoom, setPaginatedRoom] = useState([]);
  const [LimitPagination, setLimitPagination] = useState(6);
  const [ActualPage, setActualPage] = useState(1);
  const [EndPage, setEndPage] = useState(1);

  const [FilteredRoom, setFilteredRoom] = useState([]);
  const [FilterNumberOfRoom, setFilterNumberOfRoom] = useState('')
  const [FilterTypeRoom, setFilterTypeRoom] = useState('Wszystkie');
  const [FilterPriceFrom, setFilterPriceFrom] = useState(null);
  const [FilterPriceTo, setFilterPriceTo] = useState(null);
  const [SortedBy, setSortedBy] = useState('Default');

  useEffect(() => {
    getRoomFree();
  }, [])

  useEffect(() => {
    if(FilteredRoom.length > 0 && FilteredRoom.length === PaginatedRoom.length)
    {
      setEndPage(Math.ceil(Room.length / LimitPagination));
      console.log("ActualPage="+ActualPage);
      setPaginatedRoom(Room.slice((ActualPage - 1) * LimitPagination, ActualPage * LimitPagination));
    }
    else
    {
      setEndPage(Math.ceil(FilteredRoom.length / LimitPagination));
      setPaginatedRoom(FilteredRoom.slice((ActualPage - 1) * LimitPagination, ActualPage * LimitPagination));
    }
  }, [Room, ActualPage, LimitPagination, FilteredRoom])


useEffect(() => {
    const filteredRooms = Room.filter((room) => {
      const roomNumber = room.numberOfRoom.includes(FilterNumberOfRoom);
      const roomType = FilterTypeRoom != 'Wszystkie' ? (room.typeRoom === FilterTypeRoom) : (roomNumber);
      const roomPrice = FilterPriceFrom != null && FilterPriceTo != null ? (room.price >= FilterPriceFrom && room.price <= FilterPriceTo) : FilterPriceTo == null ? (room.price >= FilterPriceFrom) : FilterPriceFrom == null ? (room.price <= FilterPriceTo) : (roomNumber);
      return roomNumber && roomType && roomPrice;
    })

    if(SortedBy === 'Default')
    {
      filteredRooms.sort((a, b) => a.id - b.id);
    }
    else if(SortedBy === 'Name-A-Z')
    {
      filteredRooms.sort((a, b) => a.numberOfRoom.localeCompare(b.numberOfRoom));
    }
    else if(SortedBy === 'Name-Z-A')
    {
      filteredRooms.sort((a, b) => b.numberOfRoom.localeCompare(a.numberOfRoom));
    }
    else if(SortedBy === 'PriceLowToHigh')
    {
      filteredRooms.sort((a, b) => a.price - b.price);
    }
    else if(SortedBy === 'PriceHighToLow')
    {
      filteredRooms.sort((a, b) => b.price - a.price);
    }

    setFilteredRoom(filteredRooms);
  }, [Room, FilterNumberOfRoom, FilterTypeRoom, FilterPriceFrom, FilterPriceTo, SortedBy])

  const getRoomFree = () => {
    axios.get('http://localhost:8080/room').then((response) => {
      setRoom(response.data);
      console.log(response.data);
    }).catch(error => {
      console.log(error);
    })
  }

  const handleReservation = (roomId) => {
    const reservation = {
      userId: JSON.parse(localStorage.getItem('user')).id,
      roomId: roomId,
    };

    axios.post('http://localhost:8080/room/reservation', null, {
      params: { userId: JSON.parse(localStorage.getItem('user')).id, roomId: reservation.roomId }}).then((response) => {
      console.log(response);
      console.log("createReservation - userId:", reservation.userId, "roomId:", roomId);
      getRoomFree();
      //console.log("Id użytkownika: ", userData);
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

  const sectionComments = (roomId) => {
    const url = `/comments/room/${roomId}`;
    navigate(url);
  };

  return (
    <div>
      {(JSON.parse(localStorage.getItem('user'))?.typeUser === "Klient" || JSON.parse(localStorage.getItem('user'))?.typeUser === "Recepcjonista") && (
        <div class="container">
          <br/>
          <div class="row g-3">
            <div class="col-sm">
              <label class="form-label">Sortuj</label>
              <select
                class="form-select"
                value={SortedBy}
                onChange={(e) => setSortedBy(e.target.value)}
              >
                <option value="Default">Domyślnie</option>
                <option value="Name-A-Z">Alfabetycznie A-Z</option>
                <option value="Name-Z-A">Alfabetycznie Z-A</option>
                <option value="PriceLowToHigh">Po cenie rosnąco</option>
                <option value="PriceHighToLow">Po cenie malejąco</option>
              </select>
            </div>
            <div class="col-sm-3">
              <label class="form-label">Numer pokoju</label>
              <input class="form-control" placeholder="Numer pokoju" onChange={(e) => setFilterNumberOfRoom(e.target.value)}/>
            </div>
            <div class="col-sm">
              <label class="form-label">Typ pokoju</label>
              <select
                class="form-select"
                value={FilterTypeRoom}
                onChange={(e) => setFilterTypeRoom(e.target.value)}
              >
                <option>Wszystkie</option>
                <option>Jednoosobowy</option>
                <option>Dwuosobowy</option>
                <option>Apartament</option>
              </select>
            </div>
            <div class="col-sm">
              <label class="form-label">Cena</label>
              <div class="input-group mb-3">
                <input type="number" min="0" class="form-control" placeholder="od" onChange={(e) => setFilterPriceFrom(e.target.value)}/>
                <input type="number" min="0" class="form-control" placeholder="do" onChange={(e) => setFilterPriceTo(e.target.value)}/>
              </div>
            </div>
            <div class="col-sm">
              <label class="form-label">Ilość pozycji na stronie</label>
              <select
                class="form-select"
                value={LimitPagination}
                onChange={(e) => setLimitPagination(e.target.value)}
              >
                <option>6</option>
                <option>12</option>
                <option>18</option>
              </select>
            </div>
          </div>
          <div class="album py-5 bg-body-tertiary">
            <div class="container">
              <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                
                  {PaginatedRoom.map(
                    room =>
                    <div key = {room.id} class="col">
                      <div class="card shadow-sm">
                        {room.image == null ? (
                            <img class="card-img-top" src={img} />
                          ) : (
                            <img class="card-img-top" src={`data:image/jpeg;base64,${room.image}`} />
                        )}
                        <div class="card-body">
                          <p class="card-text">Numer pokoju: {room.numberOfRoom}</p>
                          <p class="card-text">Typ pokoju: {room.typeRoom}</p>
                          <p class="card-text">Cena: {room.price} zł</p>
                          <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                            {JSON.parse(localStorage.getItem('user'))?.typeUser === "Klient" && (
                              <>
                                <button type="button" class="btn btn-sm btn-outline-secondary" data-room-id={room.id} onClick={(e) => handleReservation(e.target.getAttribute('data-room-id'))}>Rezerwuj</button>
                                <button type="button" class="btn btn-sm btn-outline-secondary" data-room-id={room.id} onClick={(e) => sectionComments(e.currentTarget.getAttribute('data-room-id'))}>Napisz komentarz</button>
                              </>
                            )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                
              </div>
            </div>
          </div>
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
