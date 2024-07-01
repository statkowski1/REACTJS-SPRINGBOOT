import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { format } from 'date-fns';
import img from '../Images/brak-zdjecia.jpg';
import img2 from '../Images/blank-profile-picture-600px.jpg';

const AdminShoppingCart = () => {

    const [ShoppingCartAndServiceOrders, setShoppingCartAndServiceOrders] =  useState([]);
    const [PaginatedShoppingCartAndServiceOrders, setPaginatedShoppingCartAndServiceOrders] = useState([]);
    const [LimitPagination, setLimitPagination] = useState(5);
    const [ActualPage, setActualPage] = useState(1);
    const [EndPage, setEndPage] = useState(1);
  
    let number = (ActualPage - 1) * LimitPagination + 1;
    const [ReloadPage, setReloadPage] = useState(true);

    const [Services, setServices] = useState([]);
    const [Users, setUsers] = useState([]);

    const [ModalOption, setModalOption] = useState(0);
    const [User, setUser] = useState(null);
    const [Service, setService] = useState(null);

    useEffect(() => {
        getAllShoppingCart();
        getAllService();
        getAllCustomersFirstNameAndLastName();
    }, [ReloadPage])

    useEffect(() => {
        setEndPage(Math.ceil(ShoppingCartAndServiceOrders.length / LimitPagination));
        console.log("ActualPage="+ActualPage);
        setPaginatedShoppingCartAndServiceOrders(ShoppingCartAndServiceOrders.slice((ActualPage - 1) * LimitPagination, ActualPage * LimitPagination))
      }, [ShoppingCartAndServiceOrders, ActualPage, LimitPagination])

    useEffect(() => {
        if(ModalOption == 0)
        {
            setService(null);
            setUser(null);
        }
    }, [ModalOption])
    
    const getUser = (userId) => {
        axios.get('http://localhost:8080/user/showUserById', {params: { id: userId }}).then((response) => {
            setUser(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getService = (serviceId) => {
        axios.get('http://localhost:8080/service/showService', {params: { serviceId: serviceId }}).then((response) => {
            setService(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getAllShoppingCart = () => {
        axios.get('http://localhost:8080/shoppingCart/showAllShoppingCart').then((response) => {
            setShoppingCartAndServiceOrders(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getAllService = () => {
        axios.get('http://localhost:8080/service/showAllService').then((response) => {
            setServices(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getAllCustomersFirstNameAndLastName = () => {
        axios.get('http://localhost:8080/user/showAllCustomersFirstNameAndLastName').then((response) => {
            setUsers(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    // const getServiceName = (serviceId) => {
    //     axios.get('http://localhost:8080/service/showServiceName', {params: { serviceId: serviceId }}).then((response) => {
    //         console.log(response.data);
    //         return response.data;
    //     }).catch((error) => {
    //         console.log(error);
    //         return '';
    //     })
    // }

    const getServiceName = (serviceId) => {
        const service = Services.find((service) => service.id == serviceId);
        return service ? service.name : '';
    }

    const getUserName = (userId) => {
        const user = Users.find((user) => user.id == userId);
        return user ? (user.firstName+" "+user.lastName) : '';
    }

    const fullPrice = (shoppingCartId) => {
        const shoppingCartAndServiceOrders = ShoppingCartAndServiceOrders.find((shoppingCartAndServiceOrder) => shoppingCartAndServiceOrder.shoppingCart.id == shoppingCartId);
        if (shoppingCartAndServiceOrders && shoppingCartAndServiceOrders.serviceOrders) {
            const totalPrice = shoppingCartAndServiceOrders.serviceOrders.reduce((sum, serviceOrder) => sum + serviceOrder.price * serviceOrder.quantity, 0);         
            return totalPrice;
        }
        return 0;
    }

    const changeShoppingCartPaymentStatus = (shoppingCartId, paymentStatus) => {
        const shoppingCart = {
            paymentStatus: paymentStatus
        };

        axios.put(`http://localhost:8080/shoppingCart/changeShoppingCartPaymentStatus/${shoppingCartId}`, shoppingCart).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const changeShoppingCartReceiveStatus = (shoppingCartId, paymentStatus) => {
        const shoppingCart = {
            paymentStatus: paymentStatus
        };

        axios.put(`http://localhost:8080/shoppingCart/changeShoppingCartReceiveStatus/${shoppingCartId}`, shoppingCart).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const deleteShoppingCart = (shoppingCartId) => {
        axios.delete('http://localhost:8080/shoppingCart/deleteShoppingCart', {params: { shoppingCartId: shoppingCartId }}).then((response) => {
            console.log(response.data);
            ReloadPageFunction();
        }).catch((error) => {
            console.log(error);
        })
    }

    const deleteServiceOrder = (serviceOrderId) => {
        axios.delete('http://localhost:8080/serviceOrder/deleteServiceOrder', {params: { serviceOrderId: serviceOrderId }}).then((response) => {
            console.log(response.data);
            ReloadPageFunction();
        }).catch((error) => {
            console.log(error);
        })
    }

    const ReloadPageFunction = () => {
        if(ReloadPage)
        {
          setReloadPage(false);
        }
        else
        {
          setReloadPage(true);
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
        {(JSON.parse(localStorage.getItem('user'))?.typeUser === "Kierownik" || JSON.parse(localStorage.getItem('user'))?.typeUser === "Kucharz" ) && (
            <div>
                <table class="table table-secondary table-striped">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Imię i Nazwisko</th>
                            <th>Data zamówienia</th>
                            <th>Status płatności</th>
                            <th>Status zamówienia</th>
                            <th>Łączna cena</th>
                            <th>Ilość pozycji</th>
                            <th>Opcje</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        {PaginatedShoppingCartAndServiceOrders.map(
                            shoppingCartAndServiceOrders =>
                            <>
                                <tr>
                                    <td>{shoppingCartAndServiceOrders.id}</td>
                                    <td>{getUserName(shoppingCartAndServiceOrders.shoppingCart.userId)}</td>
                                    <td>{shoppingCartAndServiceOrders.shoppingCart.dateOfOrder}</td>
                                    {/* <td>
                                        {
                                            format(new Date(shoppingCartAndServiceOrders.shoppingCart.dateOfOrder), 'yyyy-MM-dd HH:mm')
                                        }
                                    </td> */}
                                    <td>
                                        <select
                                            class="form-select bg-primary text-white"
                                            data-shoppingCart-id={shoppingCartAndServiceOrders.shoppingCart.id}
                                            value={shoppingCartAndServiceOrders.shoppingCart.paymentStatus}
                                            onChange={(e) => changeShoppingCartPaymentStatus(e.currentTarget.getAttribute('data-shoppingCart-id'), e.target.value)}
                                        >
                                            <option>Zamówiono</option>
                                            <option>Zapłacono</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            class="form-select bg-primary text-white"
                                            data-shoppingCart-id={shoppingCartAndServiceOrders.shoppingCart.id}
                                            value={shoppingCartAndServiceOrders.shoppingCart.receiveStatus}
                                            onChange={(e) => changeShoppingCartReceiveStatus(e.currentTarget.getAttribute('data-shoppingCart-id'), e.target.value)}
                                        >
                                            <option>Oczekujący</option>
                                            <option>Otrzymany</option>
                                        </select>
                                    </td>
                                    <td>{fullPrice(shoppingCartAndServiceOrders.shoppingCart.id)} zł</td>
                                    <td>{shoppingCartAndServiceOrders.serviceOrders.length}</td>
                                    <td>
                                        <div class="btn-group" role="group" aria-label="Basic outlined example">
                                            <button type="button" class="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#exampleModal" data-user-id={shoppingCartAndServiceOrders.shoppingCart.userId} onClick={(e) => {getUser(e.currentTarget.getAttribute('data-user-id')); setModalOption(2);}}>Klient</button>
                                            {JSON.parse(localStorage.getItem('user'))?.typeUser === "Kierownik" && (
                                                <button type="button" class="btn btn-outline-danger" data-shoppingCart-id={shoppingCartAndServiceOrders.shoppingCart.id} onClick={(e) => deleteShoppingCart(e.currentTarget.getAttribute('data-shoppingCart-id'))}>Usuń</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan={`${JSON.parse(localStorage.getItem('user'))?.typeUser === "Kierownik" ? ('9') : ('8')}`}>
                                        <table class="table table-secondary mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Nazwa usługi</th>
                                                    <th>Ilość</th>
                                                    <th>Cena</th>
                                                    <th>Opcje</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {shoppingCartAndServiceOrders?.serviceOrders.map(
                                                    (serviceOrder, index) =>
                                                    <tr>
                                                        <td>{index+1}</td>
                                                        <td>{getServiceName(serviceOrder.serviceId)}</td>
                                                        <td>{serviceOrder.quantity}</td>
                                                        <td>{serviceOrder.price} zł</td>
                                                        <td>
                                                            <div class="btn-group" role="group" aria-label="Basic outlined example">
                                                                <button type="button" class="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#exampleModal" data-service-id={serviceOrder.serviceId} onClick={(e) => {getService(e.currentTarget.getAttribute('data-service-id')); setModalOption(1);}}>Usługa</button>
                                                                {JSON.parse(localStorage.getItem('user'))?.typeUser === "Kierownik" && (
                                                                    <button type="button" class="btn btn-outline-danger" data-serviceOrder-id={serviceOrder.id} onClick={(e) => deleteServiceOrder(e.currentTarget.getAttribute('data-serviceOrder-id'))}>Usuń</button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class={`modal-dialog ${ModalOption == 2 ? ('modal-lg') : ('')}`}>
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={(e) => setModalOption(0)}></button>
                            </div>
                            {Service != null && ModalOption == 1 ? (
                                <div class="modal-body">
                                    <div class="card mb-3">
                                        {Service.image == null ? (
                                            <img class="card-img-top" src={img} alt="..." />
                                        ) : (
                                            <img class="card-img-top" src={`data:image/jpeg;base64,${Service.image}`} alt="..." />
                                        )}
                                        <div class="card-body">
                                            <h5 class="card-title">Nazwa usługi: {Service.name}</h5>
                                            <p class="card-text">Typ usługi: {Service.typeService}</p>
                                            <p class="card-text">Cena: {Service.price} zł</p>
                                            <p class="card-text"><small class="text-body-secondary">{Service.status}</small></p>
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

export default AdminShoppingCart