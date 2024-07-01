package com.example.HotelPracaDyplomowa.Controller;

import com.example.HotelPracaDyplomowa.Model.Comments;
import com.example.HotelPracaDyplomowa.Model.User;
import com.example.HotelPracaDyplomowa.Repository.CommentsRepository;
import com.example.HotelPracaDyplomowa.Repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping(path = "/comments")

public class CommentsController {
    private final CommentsRepository commentsRepository;
    private final UserRepository userRepository;

    public CommentsController(CommentsRepository commentsRepository, UserRepository userRepository) {
        this.commentsRepository = commentsRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/showAllComments")
    public ResponseEntity<List<Comments>> getAllComments(@RequestParam Long placeId, @RequestParam String placeComment) {
        List<Comments> comments = commentsRepository.findAllCommentsByIdAndPlaceComment(placeId, placeComment);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/commentUsers")
    public ResponseEntity<List<User>> getCommentUsers(@RequestParam Long placeId, @RequestParam String placeComment) {
        List<User> users = new ArrayList<>();
        List<Comments> comments = commentsRepository.findAllCommentsByIdAndPlaceComment(placeId, placeComment);

        for(Comments comment : comments) {
            if(!users.stream().anyMatch(user -> user.getId().equals(comment.getUserId()))) {
                User tmpUser = userRepository.findById(comment.getUserId()).orElse(null);
                User user = new User();
                user.setId(tmpUser.getId());
                user.setFirstName(tmpUser.getFirstName());
                user.setLastName(tmpUser.getLastName());
                user.setImage(tmpUser.getImage());
                users.add(user);
            }
        }
        users.sort(Comparator.comparing(User::getId));
        return ResponseEntity.ok(users);
    }

    @PostMapping("/addComment")
    public ResponseEntity<String> addComment(@RequestBody Comments comment) {
        Comments newComment = new Comments();
        newComment.setUserId(comment.getUserId());
        newComment.setPlaceId(comment.getPlaceId());
        newComment.setPlaceComment(comment.getPlaceComment());
        newComment.setText(comment.getText());
        newComment.setCommentStatus("Widoczny");
        commentsRepository.save(newComment);
        return ResponseEntity.ok("Dodano komentarz!");
    }

    @PutMapping("/changeCommentStatus/{id}")
    public ResponseEntity<String> changeCommentStatus(@PathVariable Long id) {
        Comments comment = commentsRepository.findById(id).orElse(null);
        if("Widoczny".equals(comment.getCommentStatus())) {
            comment.setCommentStatus("Ukryty");
        }
        else {
            comment.setCommentStatus("Widoczny");
        }
        commentsRepository.save(comment);
        return ResponseEntity.ok("Zmieniono status komentarza na "+comment.getCommentStatus()+"!");
    }

    @DeleteMapping("/deleteComment")
    public ResponseEntity<String> deleteComment(@RequestParam Long commentId) {
        Comments comment = commentsRepository.findById(commentId).orElse(null);
        commentsRepository.delete(comment);
        return ResponseEntity.ok("Komentarz został usunięty!");
    }
}
