package com.lab.web.database.repository;

import java.util.List;

import com.lab.web.data.PointData;

public interface PointRepository {
    List<PointData> getAllPoints(Long userId);

    void addPoint(PointData point);

    // void addPoints(List<Point> points);
    
}
