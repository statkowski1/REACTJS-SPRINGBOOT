import React, {useState, useEffect} from 'react'
import axios from 'axios';
import { format } from 'date-fns';
import img from '../Images/brak-zdjecia.jpg';

const CustomerShoppingCart = () => {

    const [ShoppingCartAndServiceOrders, setShoppingCartAndServiceOrders] =  useState([]);
    const [PaginatedShoppingCartAndServiceOrders, setPaginatedShoppingCartAndServiceOrders] = useState([]);
    const [LimitPagination, setLimitPagination] = useState(5);
    const [ActualPage, setActualPage] = useState(1);
    const [EndPage, setEndPage] = useState(1);

    const [Services, setServices] = useState([]);
    const [Service, setService] = useState([]);

    useEffect(() => {
        getAllShoppingCart();
        getAllService();
    }, [])

    useEffect(() => {
        setEndPage(Math.ceil(ShoppingCartAndServiceOrders.length / LimitPagination));
        console.log("ActualPage="+ActualPage);
        setPaginatedShoppingCartAndServiceOrders(ShoppingCartAndServiceOrders.slice((ActualPage - 1) * LimitPagination, ActualPage * LimitPagination))
      }, [ShoppingCartAndServiceOrders, ActualPage, LimitPagination])

    const getAllShoppingCart = () => {
        axios.get('http://localhost:8080/shoppingCart/showAllCustomerShoppingCart', {params: { userId: JSON.parse(localStorage.getItem('user'))?.id }}).then((response) => {
            setShoppingCartAndServiceOrders(response.data);
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

    const getAllService = () => {
        axios.get('http://localhost:8080/service/showAllService').then((response) => {
            setServices(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getServiceName = (serviceId) => {
        const service = Services.find((service) => service.id == serviceId);
        return service ? service.name : '';
    }

    const fullPrice = (shoppingCartId) => {
        const shoppingCartAndServiceOrders = ShoppingCartAndServiceOrders.find((shoppingCartAndServiceOrder) => shoppingCartAndServiceOrder.shoppingCart.id == shoppingCartId);
        if (shoppingCartAndServiceOrders && shoppingCartAndServiceOrders.serviceOrders) {
            const totalPrice = shoppingCartAndServiceOrders.serviceOrders.reduce((sum, serviceOrder) => sum + serviceOrder.price * serviceOrder.quantity, 0);         
            return totalPrice;
        }
        return 0;
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
        <div>
            {JSON.parse(localStorage.getItem('user'))?.typeUser === "Klient" && (
                <div>
                    <table class="table table-secondary table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Data zamówienia</th>
                                <th>Status płatności</th>
                                <th>Status zamówienia</th>
                                <th>Łączna cena</th>
                                <th>Ilość pozycji</th>
                            </tr>
                        </thead>
                        <tbody class="table-group-divider">
                            {PaginatedShoppingCartAndServiceOrders.map(
                                shoppingCartAndServiceOrder =>
                                <>
                                    <tr>
                                        <td>{shoppingCartAndServiceOrder.id}</td>
                                        <td>
                                            {
                                                format(new Date(shoppingCartAndServiceOrder.shoppingCart.dateOfOrder), 'yyyy-MM-dd HH:mm')
                                            }
                                        </td>
                                        <td>{shoppingCartAndServiceOrder.shoppingCart.paymentStatus}</td>
                                        <td>{shoppingCartAndServiceOrder.shoppingCart.receiveStatus}</td>
                                        <td>{fullPrice(shoppingCartAndServiceOrder.shoppingCart.id)} zł</td>
                                        <td>{shoppingCartAndServiceOrder.serviceOrders.length}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="6">
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
                                                    {shoppingCartAndServiceOrder?.serviceOrders.map(
                                                    (serviceOrder, index) =>
                                                        <tr>
                                                            <td>{index+1}</td>
                                                            <td>{getServiceName(serviceOrder.serviceId)}</td>
                                                            <td>{serviceOrder.quantity}</td>
                                                            <td>{serviceOrder.price} zł</td>
                                                            <td><button type="button" class="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#exampleModal" data-service-id={serviceOrder.serviceId} onClick={(e) => getService(e.currentTarget.getAttribute('data-service-id'))}>Usługa</button></td>
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
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                {Service != null  ? (
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
    </div>
  )
}

export default CustomerShoppingCart