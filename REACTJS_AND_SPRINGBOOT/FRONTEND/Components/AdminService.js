import axios from 'axios';
import React, { useEffect, useState } from 'react';
import img from '../Images/brak-zdjecia.jpg';
import { useNavigate } from 'react-router-dom';

const AdminService = () => {

  const navigate = useNavigate();

  const [Service, setService] = useState([]);
  const [PaginatedService, setPaginatedService] = useState([]);
  const [LimitPagination, setLimitPagination] = useState(6);
  const [ActualPage, setActualPage] = useState(1);
  const [EndPage, setEndPage] = useState(1);

  const [FilteredService, setFilteredService] = useState([]);
  const [FilterServiceName, setFilterServiceName] = useState('')
  const [FilterTypeService, setFilterTypeService] = useState('Wszystkie');
  const [FilterStatusService, setFilterStatusService] = useState('Wszystkie');
  const [FilterPriceFrom, setFilterPriceFrom] = useState(null);
  const [FilterPriceTo, setFilterPriceTo] = useState(null);
  const [SortedBy, setSortedBy] = useState('Default');

  const [ServiceId, setServiceId] = useState(null);
  const [Name, setName] = useState('');
  const [Description, setDescription] = useState('');
  const [TypeService, setTypeService] = useState('');
  const [Price, setPrice] = useState(0);
  const [Image, setImage] = useState(null);

  const [OptionImage, setOptionImage] = useState(0);
  const [ImagePreview, setImagePreview] = useState(null);

  // const [EditService, setEditService] = useState(null);

  useEffect(() => {
    getAllService();
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
      const serviceStatus = FilterStatusService != 'Wszystkie' ? (service.status === FilterStatusService) : (serviceName);
      const servicePrice = FilterPriceFrom != null && FilterPriceTo != null ? (service.price >= FilterPriceFrom && service.price <= FilterPriceTo) : FilterPriceTo == null ? (service.price >= FilterPriceFrom) : FilterPriceFrom == null ? (service.price <= FilterPriceTo) : (serviceName);
      return serviceName && serviceType && serviceStatus && servicePrice;
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
  }, [Service, FilterServiceName, FilterTypeService, FilterStatusService, FilterPriceFrom, FilterPriceTo, SortedBy])

  const getAllService = () => {
    axios.get('http://localhost:8080/service/showAllService').then((response) => {
      setService(response.data);
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    })
  }

  const getService = (serviceId) => {
    axios.get('http://localhost:8080/service/showService', {params: {serviceId: serviceId}}).then((response) => {
      // setEditService(response.data);
      setServiceId(response.data.id);
      setName(response.data.name);
      setDescription(response.data.description);
      setTypeService(response.data.typeService);
      setPrice(response.data.price);
      setImage(response.data.image);
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    })
  }

  const handleEditStatusService = (serviceId) => {
    axios.put('http://localhost:8080/service/editServiceStatus', null, {params: { serviceId: serviceId }}).then((response) => {
      console.log(response.data);
      getAllService();
      alert(response.data);
    }).catch((error) => {
      console.log(error);
    })
}

  const handleEditService = () => {
    const formData = new FormData();
    formData.append("option", OptionImage);
    formData.append("newName", Name);
    formData.append("newDescription", Description);
    formData.append("newTypeService", TypeService);
    formData.append("newPrice", Price);
    formData.append("newImage", Image);
    axios.put(`http://localhost:8080/service/editService/${ServiceId}`, formData).then((response) => {
      getAllService();
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    })
  }

  const handleDeleteService = (serviceId) => {
    axios.delete('http://localhost:8080/service/deleteService', { params: { serviceId: serviceId } }).then((response) => {
      console.log(response.data);
      getAllService();
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

  const sectionComments = (serviceId) => {
    const url = `/comments/service/${serviceId}`;
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
              <label class="form-label">Status usługi</label>
              <select
                class="form-select"
                value={FilterStatusService}
                onChange={(e) => setFilterStatusService(e.target.value)}
              >
                <option>Wszystkie</option>
                <option>Dostępne</option>
                <option>Niedostępne</option>
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
              {PaginatedService.map(
                service =>
                <div key={service.id} class="col-md-4">
                  <div class="card mb-4 box-shadow">
                    {service.image == null ? (
                      <img class="card-img-top" src={img}/>
                    ) : (
                      <img class="card-img-top" src={`data:image/jpeg;base64,${service.image}`}/>
                    )
                    }
                    <div class="card-body">
                      <p class="card-text">Nazwa usługi: {service.name}</p>
                      <p class="card-text">Cena: {service.price} zł</p>
                      <p class="card-text">{(service.description != 'null' && service.description != null) ? (service.description) : ('')}</p>
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                          <button type="button" class="btn btn-sm btn-outline-secondary" data-service-id={service.id} onClick={(e) => getService(e.currentTarget.getAttribute('data-service-id'))} data-bs-toggle="modal" data-bs-target="#exampleModal">Edytuj</button>
                          <button type="button" class="btn btn-sm btn-outline-secondary" data-service-id={service.id} onClick={(e) => handleEditStatusService(e.currentTarget.getAttribute('data-service-id'))}>
                            {service.status == "Dostępne" ? (
                              <div>Ukryj</div>
                            ) : (
                              <div>Odkryj</div>
                            )
                            }
                          </button>
                          <button type="button" class="btn btn-sm btn-outline-secondary" data-service-id={service.id} onClick={(e) => sectionComments(e.currentTarget.getAttribute('data-service-id'))}>Komentarze</button>
                          <button type="button" class="btn btn-sm btn-outline-secondary" data-service-id={service.id} onClick={(e) => handleDeleteService(e.currentTarget.getAttribute('data-service-id'))}>Usuń</button>
                        </div>
                        <small class="text-muted">{service.status}</small>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            
              <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">Edytuj usługę</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <form>
                        <p class="card-text">
                          <label class="form-label">Nazwa: </label>
                          <input
                            type="text"
                            class="form-control"
                            value={Name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </p>
                        <p class="card-text">
                          <label class="form-label">Cena: </label>
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
                          <label class="form-label">Opis: </label>
                          <textarea
                            type="text"
                            class="form-control"
                            rows="5"
                            value={Description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </p>
                        <p class="card-text">
                          <label class="form-label">Typ usługi: </label>
                          <select
                            type="text"
                            class="form-select"
                            placeholder="Typ usługi"
                            value={TypeService}
                            onChange={(e) => setTypeService(e.target.value)}
                          >
                            <option>Jedzenie</option>
                            <option>Bilet</option>
                            <option>Masaż</option>
                            <option>Inne</option>
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
                          )
                          }
                        </p>
                      </form>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Zamknij</button>
                      <button onClick={handleEditService} type="button" class="btn btn-primary">Zapisz</button>
                    </div>
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
      )}
    </div>
  )
}

export default AdminService