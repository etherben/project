package com.fyp.pftracker_backend.repository;

import java.util.Optional;

import com.fyp.pftracker_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface LoginUserRepo extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);


}
