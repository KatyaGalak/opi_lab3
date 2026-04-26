package com.lab.web.database.repository;

import com.lab.web.data.User;


public interface UserRepository {
    void createUser(User user);

    boolean checkPassword(String username, String plainPassword);

    // boolean userExists(User user);

    boolean userExists(String user);
}
