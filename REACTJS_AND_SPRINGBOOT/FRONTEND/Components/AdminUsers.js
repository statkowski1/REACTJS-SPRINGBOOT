import React, { useState, useEffect } from 'react';
import axios from "axios";
import img from '../Images/blank-profile-picture-600px.jpg';

const AdminUsers = () => {

  const [Users, setUsers] = useState([]);
  const [PaginatedUsers, setPaginatedUsers] = useState([]);
  const [LimitPagination, setLimitPagination] = useState(8);
  const [ActualPage, setActualPage] = useState(1);
  const [EndPage, setEndPage] = useState(1);

  const [User, setUser] = useState(null);

  let number = (ActualPage - 1) * LimitPagination + 1;

  useEffect(() => {
    getAllUsers();
  }, [])

  useEffect(() => {
    setEndPage(Math.ceil(Users.length / LimitPagination));
    setPaginatedUsers(Users.slice((ActualPage - 1) * LimitPagination, ActualPage * LimitPagination))
  }, [Users, ActualPage, LimitPagination])

  const getAllUsers = (e) => {
    axios.get('http://localhost:8080/user').then((response) => {
      setUsers(response.data);
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

  const changeTypeUser = (userId, userType) => {
    const updatedUser = {
      id: userId,
      typeUser: userType
    };
    
    axios.put(`http://localhost:8080/user/updateUserType/${userId}`, updatedUser).then((response) => {
      getAllUsers();
      console.log(userType);
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    })
  }

  const changeUserStatus = (userId, userStatus) => {
    const updatedUser = {
      id: userId,
      statusUser: userStatus
    };

    axios.put(`http://localhost:8080/user/changeUserStatus/${userId}`, updatedUser).then((response) => {
      getAllUsers();
      console.log(userStatus);
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    })
    
  }

  const changeColorSelectStatus = (text) => {
    if(text === "Aktywne")
    {
      return "form-select bg-success text-white";
    }
    else if(text == "Zablokowane")
    {
      return "form-select bg-danger text-white";
    }
    else
    {
      return "form-select";
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

  return (
    <div class="container">
      <br/>
      {JSON.parse(localStorage.getItem('user'))?.typeUser === "Kierownik" && (
        <div>
          <table class="table table-secondary table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Imię i Nazwisko</th>
                <th>Numer telefonu</th>
                <th>Email</th>
                <th>Typ użytkownika</th>
                <th>Adres zamieszkania</th>
                <th>Podgląd</th>
                <th>Status konta</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              {PaginatedUsers.map(
                user => 
                <tr>
                  <td>{number++}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.typeUser !== "Kierownik" ? (
                    <select
                      class="form-select text-white bg-success"
                      data-user-id={user.id}
                      value={user.typeUser}
                      onChange={(e) => changeTypeUser(e.currentTarget.getAttribute('data-user-id'), e.target.value)}
                    >
                      <option>Klient</option>
                      <option>Recepcjonista</option>
                      <option>Kucharz</option>
                    </select>
                    ) : (
                      <select
                        class="form-select text-white bg-danger"
                        disabled
                      >
                        <option>Kierownik</option>
                      </select>
                    )}
                  </td>
                  <td>{user.address}</td>
                  <td><button type="button" class="btn btn-outline-dark" data-user-id={user.id} data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={(e) => getUser(e.currentTarget.getAttribute('data-user-id'))}>Podgląd</button></td>
                  <td>
                    <select
                      class={changeColorSelectStatus(user.statusUser)}
                      data-user-id={user.id}
                      value={user.statusUser}
                      onChange={(e) => changeUserStatus(e.currentTarget.getAttribute('data-user-id'), e.target.value)}
                      disabled={user.typeUser === "Kierownik"}
                    >
                      <option class="bg-success">Aktywne</option>
                      <option class="bg-danger">Zablokowane</option>
                    </select>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                {User != null ? (
                  <div class="modalbody">
                    <div class="card mb-3 mx-auto bg-primary-subtle rounded-start-pill" style={{ maxWidth: '1000px' }}>
                      <div class="row g-0">
                        <div class="col-md-4">
                          {User.image ? (
                          <img src={`data:image/jpeg;base64,${User.image}`} class="img-fluid rounded-circle" />
                          ) : (
                          <img src={img} class="img-fluid rounded-circle" />
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
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Zamknij</button>
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
    )}
    </div>
  )
}

export default AdminUsers