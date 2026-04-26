package com.lab.web.database;

import com.lab.web.data.User;
import com.lab.web.database.repository.UserRepository;
import com.lab.web.security.password.PasswordEncoderBCrypt;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.util.logging.Logger;

@Transactional
public class UserHibernateRepository implements UserRepository {

    @PersistenceContext(unitName = "com.lab.web4")
    private EntityManager entityManager;

    private static final Logger logger = Logger.getLogger(UserHibernateRepository.class.getName());

    @Override
    public void createUser(User user) {
        entityManager.persist(user);
        logger.info("[Hibernate] createUser(), User: " + user.getUsername());
    }

    @Override
    public boolean userExists(String username) {
        Query query = entityManager.createQuery("SELECT COUNT(u) FROM User u WHERE u.username = :username");
        query.setParameter("username", username);
        Long count = (Long) query.getSingleResult();
        return count > 0;
    }

    public User getUserByUsername(String username) {
        logger.info("[DEBUG] Searching for user: '" + username + "'");
        
        try {
            TypedQuery<User> query = entityManager.createQuery(
                    "SELECT u FROM User u WHERE u.username = :username",
                    User.class);
            query.setParameter("username", username);
            
            User user = query.getSingleResult();
            logger.info("[DEBUG] SUCCESS: User found with ID: " + user.getId());
            return user;
            
        } catch (NoResultException e) {
            logger.warning("[DEBUG] FAILED: No user found in database with username: '" + username + "'");
            return null;
        } catch (Exception e) {
            logger.severe("[DEBUG] ERROR during DB query: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public boolean checkPassword(String username, String plainPassword) {
        TypedQuery<User> query = entityManager.createQuery(
                "SELECT u FROM User u WHERE u.username = :username",
                User.class);
        query.setParameter("username", username);
        try {
            User user = query.getSingleResult();
            return PasswordEncoderBCrypt.verifyPassword(plainPassword, user.getPasswordHash());
        } catch (NoResultException e) {
            return false;
        }
    }

    public User getUserById(Long id) {
        return entityManager.find(User.class, id);
    }
}