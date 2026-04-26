package com.lab.web.database;

import com.lab.web.data.PointData;
import com.lab.web.database.repository.PointRepository;
import com.lab.web.service.PointCacheService;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.logging.Logger;

@Transactional
public class PointHibernateRepository implements PointRepository {

    @PersistenceContext(unitName = "com.lab.web4")
    private EntityManager entityManager;

    private static final Logger logger = Logger.getLogger(PointHibernateRepository.class.getName());

    @Override
    public List<PointData> getAllPoints(Long userID) {
        return PointCacheService.getPointsCache().get(userID, key -> {
            logger.info("[Hibernate] Cache miss for user " + userID + ". loading points");
            TypedQuery<PointData> query = entityManager.createQuery(
                    "SELECT p FROM PointData p WHERE p.user.id = :userId ORDER BY p.id DESC",
                    PointData.class);
            query.setParameter("userId", userID);
            return query.getResultList();
        });
    }

    @Override
    public void addPoint(PointData point) {
        entityManager.persist(point);
        logger.info("[Hibernate] addPoint(), Point{ x: " + point.getX() + ", y: " + point.getY() + ", r: " + point.getR() + ", isShoot: " + point.getHit());
        PointCacheService.getPointsCache().invalidate(point.getUser().getId());
    }

    public void clearPoints(Long userId) {
        Query query = entityManager.createQuery("DELETE FROM PointData p WHERE p.user.id = :userId");
        query.setParameter("userId", userId);
        int deleted = query.executeUpdate();
        PointCacheService.getPointsCache().invalidate(userId);
        logger.info("[Hibernate] clearPoints: deleted " + deleted + " points for user " + userId);
    }
}