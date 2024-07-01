import React, { useState, useEffect } from 'react';
import axios from 'axios';
import img from '../Images/brak-zdjecia.jpg';
import img2 from '../Images/blank-profile-picture-600px.jpg';
import likeIcon from '../Images/like-icon.png';
import dislikeIcon from '../Images/dislike-icon.png';

const Comments = () => {

    const [ServiceOrRoom, setServiceOrRoom] = useState([]);
    const [Comments, setComments] = useState([]);
    const [CommentUsers, setCommentUsers] = useState([]);
    const [CommentText, setCommentText] = useState();
    const currentUrl = window.location.href;
    const segments = currentUrl.split('/').filter(segment => segment !== '');
    const [placeComment, ServiceOrRoomId] = segments.slice(-2);

    useEffect(() => {
        getServiceOrRoom();
        getAllComments();
        getCommentUsers();
    }, [])
    

    const getServiceOrRoom = () => {
        if(placeComment === "service")
        {
            axios.get('http://localhost:8080/service/showService', {params: { serviceId: ServiceOrRoomId }}).then((response) => {
                setServiceOrRoom(response.data);
                console.log(response.data);
            }).catch((error) => {
                console.log(error);
            })
        }
        else if(placeComment === "room")
        {
            axios.get('http://localhost:8080/room/showRoom', {params: { roomId: ServiceOrRoomId }}).then((response) => {
                setServiceOrRoom(response.data);
                console.log(response.data);
            }).catch((error) => {
                console.log(error);
            })
        }
    }

    const getAllComments = () => {
        axios.get('http://localhost:8080/comments/showAllComments', {params: { placeId: ServiceOrRoomId, placeComment: placeComment }}).then((response) => {
            setComments(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const getCommentUsers = () => {
        axios.get('http://localhost:8080/comments/commentUsers', {params: { placeId: ServiceOrRoomId, placeComment: placeComment }}).then((response) => {
            setCommentUsers(response.data);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const addComment = () => {
        const requestData = {
            userId: JSON.parse(localStorage.getItem('user'))?.id,
            placeId: ServiceOrRoomId,
            placeComment: placeComment,
            text: CommentText
        };
        axios.post('http://localhost:8080/comments/addComment', requestData).then((response) => {
            console.log(response.data);
            window.location.reload();
        }).catch((error) => {
            console.log(error);
        })
    }

    const changeCommentStatus = (commentId) => {
        axios.put(`http://localhost:8080/comments/changeCommentStatus/${commentId}`).then((response) => {
            getAllComments();
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const deleteComment = (commentId) => {
        axios.delete('http://localhost:8080/comments/deleteComment', {params: { commentId: commentId }}).then((response) => {
            console.log(response.data);
            window.location.reload();
        }).catch((error) => {
            console.log(error);
        })
    }

    const getUserName = (userId) => {
        const user = CommentUsers.find((user) => user.id == userId);
        return user ? (user.firstName+" "+user.lastName) : '';
    }

    const getUserImage = (userId) => {
        const user = CommentUsers.find((user) => user.id == userId);
        return user ? (user.image) : null;
    }

  return (
    <div class="container w-75 p-3">
        {JSON.parse(localStorage.getItem('user')) && (
        <div>
            <div class="card mb-3">
                {ServiceOrRoom.image == null ? (
                    <img class="card-img-top" src={img} />
                ) : (
                    <img class="card-img-top" src={`data:image/jpeg;base64,${ServiceOrRoom.image}`} />
                )}
                <div class="card-body">
                    <h5 class="card-title">{placeComment === 'service' ? ("Nazwa usługi: "+ServiceOrRoom.name) : placeComment === 'room' ? ("Numer pokoju: "+ServiceOrRoom.numberOfRoom) : ('')}</h5>
                    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                    <p class="card-text"><small class="text-body-secondary">Last updated 3 mins ago</small></p>
                </div>
            </div>

            <div class="container p-3 border border-secondary-subtle bg-light rounded mb-3">
                <div class="row position-relative justify-content-start align-items-center mb-3">
                    <div class="col-1">
                        {JSON.parse(localStorage.getItem('user'))?.image == null ? (
                            <img class="rounded-circle" src={img2}  style={{ maxWidth: '60px' }}/>
                          ) : (
                            <img class="rounded-circle" src={`data:image/jpeg;base64,${JSON.parse(localStorage.getItem('user'))?.image}`} style={{ maxWidth: '60px' }}/>
                        )}
                    </div>
                    <div class="col-3">{JSON.parse(localStorage.getItem('user'))?.firstName+" "+JSON.parse(localStorage.getItem('user'))?.lastName}</div>
                </div>
                <div class="row">
                    <div class="col-10 offset-md-1 mb-3">
                        <textarea
                            class="form-control"
                            rows="3"
                            placeholder="Napisz komentarz"
                            onChange={(e) => setCommentText(e.target.value)}
                        ></textarea>
                    </div>
                </div>
                <div class="row">
                    <div class="col offset-md-10">
                        <button type="button" class="btn btn-outline-secondary" onClick={(e) => addComment()}>Skomentuj</button>
                    </div>
                </div>
            </div>
            {Comments.map(
                comment =>
                <div>
                    {(comment.commentStatus === "Widoczny" || JSON.parse(localStorage.getItem('user'))?.typeUser == 'Kierownik') && (
                    <div class="container p-3 border border-secondary-subtle bg-light rounded mb-3">
                        <div class="row position-relative justify-content-start align-items-center mb-3">
                            <div class="col-1">
                                {getUserImage(comment.userId) == null ? (
                                    <img class="rounded-circle" src={img2}  style={{ maxWidth: '60px' }}/>
                                ) : (
                                    <img class="rounded-circle" src={`data:image/jpeg;base64,${getUserImage(comment.userId)}`} style={{ maxWidth: '60px' }}/>
                                )}
                            </div>
                            <div class="col-3">{getUserName(comment.userId)}</div>
                            {(JSON.parse(localStorage.getItem('user'))?.id == comment.userId && JSON.parse(localStorage.getItem('user'))?.typeUser != 'Kierownik') && (
                                <div class="col-1 offset-md-7">
                                    <button type="button" class="btn btn-outline-danger" data-comment-id={comment.id} onClick={(e) => deleteComment(e.currentTarget.getAttribute('data-comment-id'))}>Usuń</button>
                                </div>
                            )}
                            {JSON.parse(localStorage.getItem('user'))?.typeUser == 'Kierownik' && (
                                <div class="col-3 offset-md-5 btn-group">
                                    <button type="button" class="btn btn-outline-danger" data-comment-id={comment.id} onClick={(e) => deleteComment(e.currentTarget.getAttribute('data-comment-id'))}>Usuń</button>
                                    <button type="button" class="btn btn-outline-warning" data-comment-id={comment.id} onClick={(e) => changeCommentStatus(e.currentTarget.getAttribute('data-comment-id'))}>Zmień widoczność</button>
                                </div>
                            )}
                        </div>
                        <div class="row mb-3">
                            <div class="col-10 offset-md-1 bg-white rounded">{comment.text}</div>
                        </div>
                        <div class="row">
                            {/* <div class="col-1 offset-md-1">
                                <button type="button" class="btn btn-link text-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 18">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                                    </svg>
                                </button>
                            </div>
                            <div class="col-1">
                                <button type="button" class="btn btn-link text-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 2">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                                    </svg>
                                </button>
                            </div> */}
                            <div class="col-1 offset-md-11">
                                {JSON.parse(localStorage.getItem('user'))?.typeUser == 'Kierownik' && (
                                    <p style={{ fontSize: '12px' }}>{comment.commentStatus}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            )}
        </div>
        )}
    </div>
  )
}

export default Comments