import React, {useState, useEffect, useRef} from 'react'
import axios from "axios"
import UserService from '../Services/UserService';
import img from '../Images/blank-profile-picture-600px.jpg';
import img2 from '../Images/blank-profile-picture-600px-modified.png';
import img3 from '../Images/ai-generated-8447645_1920.jpg';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const SignInComponent = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);

    // useEffect(() => {
    //   const loggedInUser = localStorage.getItem('user');
    //   if (loggedInUser) {
    //     const parsedUser = JSON.parse(loggedInUser);
    //     setUserData(parsedUser);
    //   }
    // }, []);
  
  const handleSignIn = () => {
    axios
      .post('http://localhost:8080/signin', null, {params: { email: email, password: password }})
      .then(response => {
        // Reakcja na sukces logowania
        console.log(response.data);
        //setUserData(response.data);
        // setIsLoggedIn(true);
        //Cookies.set('user1', JSON.stringify(response.data));
        //Cookies.set('test', JSON.stringify('test1234'));
        //localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate("/");
        window.location.reload();
      })
      .catch(error => {
        // Reakcja na błąd logowania
        console.error(error);
      });
  };

  const getUserInformation = () => {
    if(JSON.parse(localStorage.getItem('user')) != null){
      axios.get('http://localhost:8080/user/signedin', { params: { id: JSON.parse(localStorage.getItem('user')).id } }).then((response) =>{
        setFirstName(response.data.firstName)
        setLastName(response.data.lastName)
        setAddress(response.data.address)
        setPhone(response.data.phone)
        setImage(response.data.image)
      }).catch(error => {
        console.log(error)
      })
    }
  }

  useEffect(() => {
    getUserInformation();
    }, [])

  const handleKeyPress = (e) => {
    if(e.key === 'Enter') {
      handleSignIn();
    }
  }

  const handleEditImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("newImage", imagePreview2);
    if(imagePreview2) {
      //console.log("ID: "+ userData.id + " zdjęcie: " + formData.get("newImage"));
      axios.put(`http://localhost:8080/user/updateImage/${JSON.parse(localStorage.getItem('user'))?.id}`, formData).then((response) => {
        console.log(response.data);
        getUserInformation();
      }).catch((error) => {
        console.log(error);
      })
    }
  }

  const handleDeleteImage = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8080/user/updateDeleteImage/${JSON.parse(localStorage.getItem('user'))?.id}`).then((response) => {
      console.log(response.data);
      getUserInformation();
    }).catch((error) => {
      console.log(error);
    })
  }

  const previewImage = (uploadImage) => {
    const reader = new FileReader();
    const imageFile = uploadImage;
    reader.onload = () => {
      setImagePreview(reader.result);
    }
    reader.readAsDataURL(imageFile);
  }

  return (
    <div className="container">
      <br />
      {JSON.parse(localStorage.getItem('user')) ? (
        <div>
          <div class="card mb-3 mx-auto bg-secondary rounded-start-pill" style={{ maxWidth: '1000px' }}>
            <div class="row g-0">
              <div class="col-md-4">
                {image ? (
                  <img src={`data:image/jpeg;base64,${image}`} class="img-fluid rounded-circle" />
                ) : (
                  <img src={img} class="img-fluid rounded-circle" />
                )}
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h3 class="card-title text-center">{firstName} {lastName}</h3>
                  <p class="card-text text-center">Telefon: {phone}</p>
                  <p class="card-text text-center">Adres zamieszkania: {address}</p>
                  <p class="card-text"><small class="text-body-secondary d-grid gap-2"><button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">Edytuj zdjęcie</button></small></p>
                  <p class="card-text"><small class="text-body-secondary d-grid gap-2"><button class="btn btn-warning" type="button" onClick={handleDeleteImage}>Usuń zdjęcie</button></small></p>
                </div>
              </div>
            </div>
          </div>

          <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Dodaj zdjęcie!</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input
                      type="file"
                      class="form-control"
                      onChange={e => {
                        setImagePreview2(e.target.files[0]);
                        previewImage(e.target.files[0]);
                      }}
                    />
                  {imagePreview && (
                    <div>
                      <h2 class="text-center">Wybrano zdjęcie:</h2>
                      <img class="mx-auto d-block" style={{ maxWidth: '300px' }} src={imagePreview} alt="Selected" />
                    </div>
                  )}
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Wróć</button>
                  <button type="button" class="btn btn-primary" onClick={handleEditImage}>Dodaj zdjęcie</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div class="row justify-content-center">
          <div class="col-6">
            <form>
            <h1 class="text-center">Logowanie</h1>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
              ></input>
            </div>
            <div className="mb-3">
              <label className="form-label">Hasło</label>
              <input
                type="password"
                className="form-control"
                placeholder="hasło"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              ></input>
            </div>
            <button onClick={handleSignIn} className="btn btn-success" type="button">Zaloguj</button>
          </form>
          </div>
        </div>
      )}
    </div>
  );
};
  
  export default SignInComponent;