import Cookies from 'js-cookie';
import React, { useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';

export const HeaderComponent = () => {

    //const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('user') !== null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        //setIsLoggedIn(false);
        // setIsLoggedIn(false);
        // setUserData(null);
        // Cookies.remove('user');
        // Cookies.remove('test');
        navigate("/");
        window.location.reload();
      };

  return (
    <div>
        <header>
            <div class="px-3 py-2 bg-dark text-white">
                <div class="container">
                    <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <a class="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
                            <Link to="/">
                                <a className="d-inline-flex text-decoration-none text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi d-block me-1" viewBox="0 0 16 16">
                                        <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146ZM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5Z"/>
                                    </svg>
                                    Home
                                </a>
                            </Link>
                        </a>
                        <ul class="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
                            {JSON.parse(localStorage.getItem('user'))?.typeUser === "Klient" && (
                                <li>
                                    <a class="nav-link text-white">
                                        <button type="button" class="btn btn-primary">
                                            <Link to="/room" class="text-decoration-none text-white">Rezerwacja</Link>
                                        </button>
                                    </a>
                                </li>
                            )}
                            {JSON.parse(localStorage.getItem('user'))?.typeUser === "Klient" && (
                                <li>
                                    <a class="nav-link text-white">
                                        <button type="button" class="btn btn-primary">
                                            <Link to="/service/showServices" class="text-decoration-none text-white">Usługi</Link>
                                        </button>
                                    </a>
                                </li>
                            )}
                            {JSON.parse(localStorage.getItem('user'))?.typeUser === "Recepcjonista" && (
                                <li>
                                    <a class="nav-link text-white">
                                        <button type="button" class="btn btn-primary">
                                            <Link to="/room" class="text-decoration-none text-white">Pokoje</Link>
                                        </button>
                                    </a>
                                </li>
                            )}
                            {JSON.parse(localStorage.getItem('user'))?.typeUser === "Recepcjonista" && (
                                <li>
                                    <a class="nav-link text-white">
                                        <button type="button" class="btn btn-primary">
                                            <Link to="/reservation/showAllReservation" class="text-decoration-none text-white">Rezerwacje</Link>
                                        </button>
                                    </a>
                                </li>
                            )}
                            {JSON.parse(localStorage.getItem('user'))?.typeUser === "Kucharz" && (
                                <li>
                                    <a class="nav-link text-white">
                                        <button type="button" class="btn btn-primary">
                                            <Link to="/shoppingCart/showAllShoppingCart" class="text-decoration-none text-white">Zamówienia</Link>
                                        </button>
                                    </a>
                                </li>
                            )}
                            {JSON.parse(localStorage.getItem('user'))?.typeUser === "Kierownik" && (
                                <div className="dropdown my-auto" data-bs-theme="dark">
                                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                        Panel kierownika
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <li><a className="dropdown-item"><Link to="/user" class="text-decoration-none text-body">Wyświetl użytkowników</Link></a></li>
                                        <li><a className="dropdown-item"><Link to="/user/createUser" class="text-decoration-none text-body">Stwórz użytkownika</Link></a></li>
                                        <li><a className="dropdown-item"><Link to="/room/showAllRooms" class="text-decoration-none text-body">Wyświetl pokoje</Link></a></li>
                                        <li><a className="dropdown-item"><Link to="/room/addRoom" class="text-decoration-none text-body">Dodaj nowy pokój</Link></a></li>
                                        <li><a className="dropdown-item"><Link to="/service/showAllService" class="text-decoration-none text-body">Wyświetl usługi</Link></a></li>
                                        <li><a className="dropdown-item"><Link to="/service/addService" class="text-decoration-none text-body">Dodaj usługę</Link></a></li>
                                        <li><a className="dropdown-item"><Link to="/shoppingCart/showAllShoppingCart" class="text-decoration-none text-body">Wyświetl zamówienia</Link></a></li>
                                        <li><a className="dropdown-item"><Link to="/reservation/showAllReservation" class="text-decoration-none text-body">Wyświetl rezerwacje użytkowników</Link></a></li>
                                        <div class="dropdown-divider"></div>
                                        <li><a className="dropdown-item"><Link to="/charts" class="text-decoration-none text-body">Statystyki</Link></a></li>
                                    </ul>
                                </div>
                            )}
                            {JSON.parse(localStorage.getItem('user')) == null ? (
                                <>
                                    <li>
                                        <a class="nav-link text-white">
                                            <button type="button" class="btn btn-secondary">
                                                <Link to="/signup" class="text-decoration-none text-white">Rejestracja</Link>
                                            </button>
                                        </a>
                                    </li>
                                    <li>
                                        <a class="nav-link text-white">
                                            <button type="button" class="btn btn-primary">
                                                <Link to="/signin" class="text-decoration-none text-white">Logowanie</Link>
                                            </button>
                                        </a>
                                    </li>
                                </>
                            ) : (
                            <>
                                <li>
                                    <a class="nav-link text-white">
                                        <div class="btn-group" data-bs-theme="dark">
                                            <button type="button" class="btn btn-info">
                                                <Link to="/signin" class="text-decoration-none text-white">Profil</Link>
                                            </button>
                                            <button type="button" class="btn btn-info dropdown-toggle dropdown-toggle-split text-white" data-bs-toggle="dropdown" aria-expanded="false">
                                                <span class="visually-hidden">Toggle Dropdown</span>
                                            </button>
                                            <ul class="dropdown-menu my-auto">
                                                <li>
                                                    <a class="dropdown-item">
                                                        <Link to="/user/update" class="text-decoration-none text-body">Edytuj profil</Link>
                                                    </a>
                                                </li>
                                                {JSON.parse(localStorage.getItem('user'))?.typeUser === "Klient" && (
                                                <li>
                                                    <a class="dropdown-item">
                                                        <Link to="/reservation/showReservation" class="text-decoration-none text-body">Moje rezerwacje</Link>
                                                    </a>
                                                </li>
                                                )}
                                                {JSON.parse(localStorage.getItem('user'))?.typeUser === "Klient" && (
                                                <li>
                                                    <a class="dropdown-item">
                                                        <Link to="/shoppingCart/showAllCustomerShoppingCart" class="text-decoration-none text-body">Moje zamówienia</Link>
                                                    </a>
                                                </li>
                                                )}
                                                <div class="dropdown-divider"></div>
                                                <li>
                                                    <a class="dropdown-item">
                                                        <Link to="/" class="text-decoration-none text-body" onClick={handleLogout}>Wyloguj</Link>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </a>
                                </li>
                                {JSON.parse(localStorage.getItem('user'))?.typeUser === "Klient" && (
                                    <li>
                                        <a class="nav-link">
                                            <button type="button" class="btn btn-light">
                                                <Link to="/shoppingcart">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                        <path d="M10 19.5c0 .829-.672 1.5-1.5 1.5s-1.5-.671-1.5-1.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5zm3.5-1.5c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm1.336-5l1.977-7h-16.813l2.938 7h11.898zm4.969-10l-3.432 12h-12.597l.839 2h13.239l3.474-12h1.929l.743-2h-4.195z"/>
                                                    </svg>
                                                </Link>
                                            </button>
                                        </a>
                                    </li>
                                )}
                            </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    </div>
  )
}
