import React from 'react'
import ChangeImageGaleryComponent from './ChangeImageGaleryComponent'
import img1 from '../Images/localization_picture.jpg'
import img2 from '../Images/villa-cortine-palace-gadb9b0578_1280.jpg'
import img3 from '../Images/derek-thomson-TWoL-QCZubY-unsplash.jpg'

const StartPage = () => {
    return (
        <div>
            <ChangeImageGaleryComponent/>
            <br />
            <h2 style={{ textAlign: 'center' }}>Informacje o hotelu</h2>
            <div class="album py-5 bg-body-tertiary">
                <div class="container">
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                        <div class="col">
                            <div class="card shadow-sm">
                                <img src={img1} />
                                <div class="card-body">
                                    <h3 class="card-text text-center">Lokalizacja</h3>
                                    <p class="card-text">Hotel korzystnie usytuowany jest w malowniczej okolicy, zaledwie kilka kroków od piaszczystej plaży i krystalicznie czystego morza. Ta doskonała lokalizacja umożliwia gościom naszego hotelu równoczesne cieszenie się spokojem i relaksem, jak i łatwym dostępem do licznych atrakcji turystycznych oraz lokalnych skarbów kulturowych.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card shadow-sm">
                                <img src={img2} />
                                <div class="card-body">
                                    <h3 class="card-text text-center">Restauracja</h3>
                                    <p class="card-text">Restauracja hotelowa jest wyjątkowym miejscem, gdzie można delektować się niezwykłymi smakami kuchni międzynarodowej, a także cieszyć oko przepięknym wystrojem. Przestrzeń została starannie urządzona, łącząc nowoczesne elementy z eleganckimi detalami, co tworzy niepowtarzalną atmosferę, podkreślającą wyjątkowość każdego posiłku. Goście mogą odkryć nie tylko doskonałe dania, ale także zanurzyć się w luksusie i estetyce, które uczynią każdą wizytę niezapomnianym doświadczeniem dla zmysłów.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div class="card shadow-sm">
                                <img src={img3} />
                                <div class="card-body">
                                    <h3 class="card-text text-center">Plaża</h3>
                                    <p class="card-text">Przy hotelu znajduje się urokliwa plaża, która przyciąga turystów swoim białym piaskiem, szumem fal i malowniczym krajobrazem. To idealne miejsce, aby odpocząć, cieszyć się promieniami słońca i kąpać się w krystalicznie czystych wodach.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StartPage