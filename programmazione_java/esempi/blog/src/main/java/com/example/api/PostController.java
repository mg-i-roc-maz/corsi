package com.example.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {
    @Autowired
    private PostRepository postRepository;

    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    @GetMapping("/{id}")
    public Post getPostById(@PathVariable Long id) {
        return postRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Post createPost(@RequestBody Post post) {
        post.setDataCreazione(java.time.LocalDateTime.now());
        return postRepository.save(post);
    }

    @PostMapping("/{id}/like")
    public Post addLike(@PathVariable Long id) {
        Post post = postRepository.findById(id).orElse(null);
        if (post != null) {
            post.setPostLike(post.getPostLike() + 1);
            return postRepository.save(post);
        }
        return null;
    }

    @PostMapping("/{id}/dislike")
    public Post addDislike(@PathVariable Long id) {
        Post post = postRepository.findById(id).orElse(null);
        if (post != null) {
            post.setPostDislike(post.getPostDislike() + 1);
            return postRepository.save(post);
        }
        return null;
    }
}
