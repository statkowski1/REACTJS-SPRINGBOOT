import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import img from '../Images/brak-zdjecia.jpg';

const AdminRoom = () => {

    const navigate = useNavigate();

    const [Room, setRoom] = useState([]);
    const [PaginatedRoom, setPaginatedRoom] = useState([]);
    const [LimitPagination, setLimitPagination] = useState(6);
    const [ActualPage, setActualPage] = useState(1);
    const [EndPage, setEndPage] = useState(1);

    const [FilteredRoom, setFilteredRoom] = useState([]);
    const [FilterNumberOfRoom, setFilterNumberOfRoom] = useState('')
    const [FilterTypeRoom, setFilterTypeRoom] = useState('Wszystkie');
    const [FilterStatusRoom, setFilterStatusRoom] = useState('Wszystkie');
    const [FilterPriceFrom, setFilterPriceFrom] = useState(null);
    const [FilterPriceTo, setFilterPriceTo] = useState(null);
    const [SortedBy, setSortedBy] = useState('Default');

    const [RoomId, setRoomId] = useState(null);
    const [NumberOfRoom, setNumberOfRoom] = useState('');
    const [TypeRoom, setTypeRoom] = useState('');
    const [Price, setPrice] = useState(0);
    const [Image, setImage] = useState(null);

    const [OptionImage, setOptionImage] = useState(0);
    const [ImagePreview, setImagePreview] = useState(null);


    const [Room2, setRoom2] = useState([]);
    useEffect(() => {
        getAllRooms();
        // setRoom2(Room);
        // if(JSON.stringify(Room) === JSON.stringify(Room2))
        // {
        //     console.log("Równe");
        // }
        // else
        // {
        //     console.log("Nie równe");
        // }
        // if(Room2.length === 0)
        // {
        //     console.log("Pusta");
        // }
        // else
        // {
        //     console.log("Nie pusta");
        // }
    }, [])

    useEffect(() => {
        if(FilteredRoom.length === PaginatedRoom.length)
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
            const roomStatus = FilterStatusRoom != 'Wszystkie' ? (room.status === FilterStatusRoom) : (roomNumber);
            const roomPrice = FilterPriceFrom != null && FilterPriceTo != null ? (room.price >= FilterPriceFrom && room.price <= FilterPriceTo) : FilterPriceTo == null ? (room.price >= FilterPriceFrom) : FilterPriceFrom == null ? (room.price <= FilterPriceTo) : (roomNumber);
            return roomNumber && roomType && roomStatus && roomPrice;
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
    }, [Room, FilterNumberOfRoom, FilterTypeRoom, FilterStatusRoom, FilterPriceFrom, FilterPriceTo, SortedBy])
    

    const getAllRooms = () => {
        axios.get('http://localhost:8080/room/showAllRooms').then((response) => {
            setRoom(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getRoom = (roomId) => {
        axios.get('http://localhost:8080/room/showRoom', {params: {roomId: roomId}}).then((response) => {
            setRoomId(response.data.id);
            setNumberOfRoom(response.data.numberOfRoom);
            setTypeRoom(response.data.typeRoom);
            setPrice(response.data.price);
            setImage(response.data.image);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleEditRoom = () => {
        const formData = new FormData();
        formData.append("option", OptionImage);
        formData.append("newNumberOfRoom", NumberOfRoom);
        formData.append("newTypeRoom", TypeRoom);
        formData.append("newPrice", Price);
        formData.append("newImage", Image);
        axios.put(`http://localhost:8080/room/editRoom/${RoomId}`, formData).then((response) => {
            getAllRooms();
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleDeleteRoom = (roomId) => {
        axios.delete('http://localhost:8080/room/deleteRoom', {params: {roomId: roomId}}).then((response) => {
            console.log(response);
            getAllRooms();
            alert(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const previewImage = (uploadImage) => {
        const reader = new FileReader();
        const imageFile = uploadImage;
        if(uploadImage) {
          reader.onload = () => {
            setImagePreview(reader.result);
          }
          reader.readAsDataURL(imageFile);
        }
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
        {JSON.parse(localStorage.getItem('user'))?.typeUser === "Kierownik" && (
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
                        <label class="form-label">Status pokoju</label>
                        <select
                            class="form-select"
                            value={FilterStatusRoom}
                            onChange={(e) => setFilterStatusRoom(e.target.value)}
                        >
                            <option>Wszystkie</option>
                            <option>Wolny</option>
                            <option>Zajęty</option>
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
                <div class="album py-5 bg-light">
                    <div class="row">
                            {PaginatedRoom.map(
                                room => 
                                <div key={room.id} class="col-md-4">
                                    <div class="card mb-4 box-shadow">
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
                                                    <button type="button" class="btn btn-sm btn-outline-secondary" data-room-id={room.id} onClick={(e) => sectionComments(e.currentTarget.getAttribute('data-room-id'))}>Komentarze</button>
                                                    <button type="button" class="btn btn-sm btn-outline-secondary" data-room-id={room.id} onClick={(e) => getRoom(e.currentTarget.getAttribute('data-room-id'))} data-bs-toggle="modal" data-bs-target="#exampleModal">Edytuj</button>
                                                    <button type="button" class="btn btn-sm btn-outline-secondary" data-room-id={room.id} onClick={(e) => handleDeleteRoom(e.target.getAttribute('data-room-id'))}>Usuń</button>
                                                </div>
                                                <small class="text-muted">{room.status}</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h1 class="modal-title fs-5" id="exampleModalLabel">Edytuj pokój</h1>
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body">
                                        <form>
                                            <p class="card-text">
                                                <label class="form-label">Numer pokoju:</label>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    value={NumberOfRoom}
                                                    onChange={(e) => setNumberOfRoom(e.target.value)}
                                                />
                                            </p>
                                            <p class="card-text">
                                                <label class="form-label">Cena:</label>
                                                <div class="input-group">
                                                    <input
                                                        type="text"
                                                        class="form-control"
                                                        value={Price}
                                                        onChange={(e) => setPrice(e.target.value)}
                                                    />
                                                    <div class="input-group-text">zł</div>
                                                </div>
                                            </p>
                                            <p class="card-text">
                                                <label class="form-label">Numer pokoju:</label>
                                                <select
                                                    type="text"
                                                    class="form-select"
                                                    placeholder="Typ pokoju"
                                                    value={TypeRoom}
                                                    onChange={(e) => setTypeRoom(e.target.value)}
                                                >
                                                    <option>Jednoosobowy</option>
                                                    <option>Dwuosobowy</option>
                                                    <option>Apartament</option>
                                                </select>
                                            </p>
                                            <p class="card-text">
                                                <label class="form-label">&nbsp;&nbsp;Edycja zdjęcia</label>
                                                <br/>
                                                <select
                                                    type="text"
                                                    class="form-select"
                                                    onChange={(e) => setOptionImage(e.target.value)}
                                                >
                                                    <option value={0}>Bez zmian</option>
                                                    <option value={1}>Zmień</option>
                                                    <option value={2}>Usuń</option>
                                                </select>
                                                <br/>
                                                <input
                                                    type="file"
                                                    class="form-control"
                                                    placeholder=""
                                                    onChange={(e) => {
                                                        setImage(e.target.files[0]);
                                                        previewImage(e.target.files[0]);
                                                    }}
                                                />
                                                <br/>
                                                {Image == null || ImagePreview == null ? (
                                                    <img class="card-img-top rounded" src={img}/>
                                                ) : (
                                                    <img class="card-img-top rounded" src={ImagePreview}/>
                                                )}
                                            </p>
                                        </form>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Zamknij</button>
                                        <button onClick={handleEditRoom} type="button" class="btn btn-primary">Zapisz</button>
                                    </div>
                                </div>
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
            </div>
        )}
    </div>
  )
}

export default AdminRoom