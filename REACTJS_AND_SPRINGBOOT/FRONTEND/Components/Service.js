import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import img from '../Images/brak-zdjecia.jpg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Service = () => {

  const navigate = useNavigate();

  const [Service, setService] = useState([]);
  const [PaginatedService, setPaginatedService] = useState([]);
  const [LimitPagination, setLimitPagination] = useState(6);
  const [ActualPage, setActualPage] = useState(1);
  const [EndPage, setEndPage] = useState(1);

  const [FilteredService, setFilteredService] = useState([]);
  const [FilterServiceName, setFilterServiceName] = useState('')
  const [FilterTypeService, setFilterTypeService] = useState('Wszystkie');
  const [FilterPriceFrom, setFilterPriceFrom] = useState(null);
  const [FilterPriceTo, setFilterPriceTo] = useState(null);
  const [SortedBy, setSortedBy] = useState('Default');
    
  useEffect(() => {
    getServices();
  }, [])

  useEffect(() => {
    if(FilteredService.length === 0 && FilteredService.length === PaginatedService.length)
    {
      setEndPage(Math.ceil(Service.length / LimitPagination));
      console.log("ActualPage="+ActualPage);
      setPaginatedService(Service.slice((ActualPage - 1) * LimitPagination, ActualPage * LimitPagination));
    }
    else
    {
      setEndPage(Math.ceil(FilteredService.length / LimitPagination));
      setPaginatedService(FilteredService.slice((ActualPage - 1) * LimitPagination, ActualPage * LimitPagination));
    }
  }, [Service, ActualPage, LimitPagination, FilteredService])

  useEffect(() => {
    const filteredServices = Service.filter((service) => {
      const serviceName = service.name.includes(FilterServiceName);
      const serviceType = FilterTypeService != 'Wszystkie' ? (service.typeService === FilterTypeService) : (serviceName);
      const servicePrice = FilterPriceFrom != null && FilterPriceTo != null ? (service.price >= FilterPriceFrom && service.price <= FilterPriceTo) : FilterPriceTo == null ? (service.price >= FilterPriceFrom) : FilterPriceFrom == null ? (service.price <= FilterPriceTo) : (serviceName);
      return serviceName && serviceType && servicePrice;
    })

    if(SortedBy === 'Default')
    {
      filteredServices.sort((a, b) => a.id - b.id);
    }
    else if(SortedBy === 'Name-A-Z')
    {
      filteredServices.sort((a, b) => a.name.localeCompare(b.name));
    }
    else if(SortedBy === 'Name-Z-A')
    {
      filteredServices.sort((a, b) => b.name.localeCompare(a.name));
    }
    else if(SortedBy === 'PriceLowToHigh')
    {
      filteredServices.sort((a, b) => a.price - b.price);
    }
    else if(SortedBy === 'PriceHighToLow')
    {
      filteredServices.sort((a, b) => b.price - a.price);
    }

    setFilteredService(filteredServices);
  }, [Service, FilterServiceName, FilterTypeService, FilterPriceFrom, FilterPriceTo, SortedBy])

  const getServices = () => {
      axios.get('http://localhost:8080/service/showServices').then((response) => {
          setService(response.data);
          console.log(response.data);
      }).catch((error) => {
          console.log(error);
      })
  }

  const getService = (ServiceId) => {
    axios.get('http://localhost:8080/service/showService', { params: { serviceId: ServiceId}}).then((response) => {
    console.log(response.data);
    return {
      name: response.data.name,
      price: response.data.price
    }
    }).catch((error => {
      console.log(error);
    }))
  }

  const addToShoppingCart = (ServiceId) => {
    const currentList = JSON.parse(localStorage.getItem('serviceList')) || [];
    const existingRow = currentList.find(row => row.serviceId === ServiceId);
    if(!existingRow)
    {
      axios.get('http://localhost:8080/service/showService', { params: { serviceId: ServiceId}}).then((response) => {
        currentList.push({serviceId: ServiceId, quantity: 1, name: response.data.name, price: response.data.price});
        localStorage.setItem('serviceList', JSON.stringify(currentList));
        console.log(response.data);
      }).catch((error => {
        console.log(error);
      }))
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

  const sectionComments = (serviceId) => {
    const url = `/comments/service/${serviceId}`;
    navigate(url);
  };

    // const addToShoppingCart = (ServiceId) => {
    //   const getServicesData = () => JSON.parse(Cookies.get('servicesData')) || {};
    //   const servicesData = {
    //     getServicesData();
    //     serviceId: ServiceId,
    //     serviceQuantity: 1,
    //   };
    //   const existingData = getServicesData();
    //   existingData[ServiceId] = 1;
    //   Cookies.set('servicesData', JSON.stringify(existingData), { expires: 7 });
    //   console.log(JSON.parse(Cookies.get('servicesData')));
    // }

  return (
    <div>
      {JSON.parse(localStorage.getItem('user'))?.typeUser === "Klient" && (
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
              <label class="form-label">Nazwa usługi</label>
              <input class="form-control" placeholder="Nazwa usługi" onChange={(e) => setFilterServiceName(e.target.value)}/>
            </div>
            <div class="col-sm">
              <label class="form-label">Typ usługi</label>
              <select
                class="form-select"
                value={FilterTypeService}
                onChange={(e) => setFilterTypeService(e.target.value)}
              >
                <option>Wszystkie</option>
                <option>Jedzenie</option>
                <option>Masaż</option>
                <option>Bilet</option>
                <option>Inne</option>
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
                    {PaginatedService.map(
                      service =>
                      <div key = {service.id} class="col">
                        <div class="card shadow-sm">
                          {service.image == null ? (
                              <img class="card-img-top" src={img} />
                            ) : (
                              <img class="card-img-top" src={`data:image/jpeg;base64,${service.image}`} />
                          )}
                          <div class="card-body">
                            <p class="card-text">Nazwa usługi: {service.name}</p>
                            <p class="card-text">Typ usługi: {service.typeService}</p>
                            <p class="card-text">Cena: {service.price} zł</p>
                            <div class="d-flex justify-content-between align-items-center">
                              <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-secondary" data-service-id={service.id} onClick={(e) => addToShoppingCart(e.currentTarget.getAttribute('data-service-id'))}>Dodaj do koszyka</button>
                                <button type="button" class="btn btn-sm btn-outline-secondary" data-service-id={service.id} onClick={(e) => sectionComments(e.currentTarget.getAttribute('data-service-id'))}>Napisz komentarz</button>
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

export default Service