import React, { useState, useEffect } from 'react';
import axios from "axios";

const ShoppingCart = () => {

  const [serviceList, setServiceList] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [PaginatedServices, setPaginatedServices] = useState([]);
  const [LimitPagination, setLimitPagination] = useState(5);
  const [ActualPage, setActualPage] = useState(1);
  const [EndPage, setEndPage] = useState(1);

  const [ReloadPage, setReloadPage] = useState(true);

  let number = (ActualPage - 1) * LimitPagination + 1;
    
  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem('serviceList')) || [];
    setServiceList(storedList);
    calculateTotalPrice(storedList);
  }, [ReloadPage]);

  useEffect(() => {
    setEndPage(Math.ceil(serviceList.length / LimitPagination));
    console.log("ActualPage="+ActualPage);
    setPaginatedServices(serviceList.slice((ActualPage - 1) * LimitPagination, ActualPage * LimitPagination))
  }, [serviceList, ActualPage, LimitPagination])

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 5) {
      const updatedList = [...serviceList];
      updatedList[index].quantity = newQuantity;
      localStorage.setItem('serviceList', JSON.stringify(updatedList));
      setServiceList(updatedList);
      calculateTotalPrice(updatedList);
    }
  };

  const calculateTotalPrice = (list) => {
    let totalPriceTmp = 0;
    list.forEach((row) => {
      if (row.price && row.quantity) {
        totalPriceTmp += row.price * row.quantity;
      }
    });
    setTotalPrice(totalPriceTmp);
  };

  const removeFromShoppingCart = (ServiceId) => {
    const storedList = JSON.parse(localStorage.getItem('serviceList')) || [];
    const updatedList = storedList.filter(item => item.serviceId !== ServiceId);
    localStorage.setItem('serviceList', JSON.stringify(updatedList));
    setServiceList(updatedList);
    calculateTotalPrice(updatedList);
  }

  const createShoppingCart = () => {
    const storedServiceOrder = JSON.parse(localStorage.getItem('serviceList'));

    const serviceOrders = storedServiceOrder.map(item => {
        return {
          price: item.price,
          quantity: item.quantity,
          serviceId: item.serviceId,
        }
      }
    )

    axios.post('http://localhost:8080/shoppingCart/createShoppingCart', serviceOrders, { params: { userId: JSON.parse(localStorage.getItem('user'))?.id }}).then((response) => {
      localStorage.removeItem('serviceList');
      ReloadPageFunction();
      console.log(response.data);
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
      {JSON.parse(localStorage.getItem('user'))?.typeUser === "Klient" && (
        <div>
          <br/>
          <table class="table table-secondary table-striped">
            <thead>
              <tr>
                <th colspan="6">
                  <div class="d-grid gap-2">
                    <button type="button" class="btn btn-success" onClick={(e) => createShoppingCart()}>Zapłać</button>
                  </div>
                </th>
              </tr>
              <tr class="table-group-divider">
                <th>#</th>
                <th>Nazwa</th>
                <th>Cena za sztukę</th>
                <th>Ilość</th>
                <th>Razem</th>
                <th>Opcje</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
                {PaginatedServices.map((row, index) => (
                  <tr>
                    <td>{number++}</td>
                    <td>{row.name}</td>
                    <td>{row.price} zł</td>
                    <td>
                      <input 
                        type="number"
                        value={row.quantity}
                        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value, 10))}
                        min="1"
                        max="5"
                      />
                    </td>
                    <td>{row.price * row.quantity} zł</td>
                    <td><button type="button" class="btn btn-sm btn-outline-danger" data-service-shopping-cart-id={row.serviceId} onClick={(e) => removeFromShoppingCart(e.currentTarget.getAttribute('data-service-shopping-cart-id'))}>Usuń</button></td>
                  </tr>
                ))}
                <tr class="table-group-divider">
                  <th colspan="5">Łączna cena:</th>
                  <th>{totalPrice} zł</th>
                </tr>
            </tbody>
          </table>
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

export default ShoppingCart