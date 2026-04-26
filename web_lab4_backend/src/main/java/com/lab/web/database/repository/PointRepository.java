package com.lab.web.database.repository;

import com.lab.web.data.PointData;

import java.util.List;

public interface PointRepository {
    List<PointData> getAllPoints(Long userId);

    void addPoint(PointData point);

    // void addPoints(List<Point> points);
    
}
