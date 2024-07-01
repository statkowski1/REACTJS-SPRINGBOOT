package com.example.HotelPracaDyplomowa.Repository;

import com.example.HotelPracaDyplomowa.Model.Comments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentsRepository extends JpaRepository<Comments, Long> {
    @Query("SELECT c FROM Comments c WHERE c.placeId = :placeId AND c.placeComment LIKE :placeComment")
    List<Comments> findAllCommentsByIdAndPlaceComment(Long placeId, String placeComment);
    //List<Comments> findAllCommentsByIdAndPlaceCommentAndCommentAnswer(Long id, Long commentAnswer, String placeComment);
}
