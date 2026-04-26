package com.lab.web.service;

import java.util.concurrent.TimeUnit;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.util.List;

import com.lab.web.data.PointData;

public class PointCacheService {
    private static final Cache<Long, List<PointData> > pointsCache = Caffeine.newBuilder()
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .maximumSize(1000)
            .build();

    private PointCacheService() {}

    public static Cache<Long, List<PointData> > getPointsCache() {
        return pointsCache;
    }
}
