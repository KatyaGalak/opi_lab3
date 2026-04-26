package com.lab.web.service;

import com.lab.web.data.PointData;
import com.lab.web.data.User;

import java.time.LocalDateTime;

import com.lab.web.constants.ValidationConstants;

public class PointService {

    public static boolean validateX(Double x) {
        return x >= ValidationConstants.X_MIN && x <= ValidationConstants.X_MAX;
    }

    public static boolean validateY(Double y) {
        return y >= ValidationConstants.Y_MIN && y <= ValidationConstants.Y_MAX;
    }

    public static boolean validateR(Double r) {
        return r >= ValidationConstants.R_MIN && r <= ValidationConstants.R_MAX;
    }

    private static void valudateInput(Double x, Double y, Double r, boolean fromGraph) {
        if (!fromGraph) {
            if (!(validateX(x) && validateY(y) && validateR(r))) {
                throw new IllegalArgumentException("Invalid point values: out of range");
            }
        } else {
            if (r == null || r <= ValidationConstants.R_ABSOLUTE_MIN) {
                throw new IllegalArgumentException("Invalid R value");
            }
        }
    }

    public static PointData createPointData(Double x, Double y, Double r, User user, boolean fromGraph) {
        valudateInput(x, y, r, fromGraph);

        long start = System.nanoTime();
        boolean hit = checkHit(x, y, r);
        long execTime = System.nanoTime() - start;

        return new PointData(x, y, r, hit, execTime, LocalDateTime.now(), user);
    }

    private static boolean checkHit(double x, double y, double r) {

        if (x <= 0 && y >= 0) {
            return (x * x + y * y) <= (r * r);
        }

        if (x <= 0 && y <= 0) {
            return (x >= -r) && (y >= -r / 2.0);
        }

        if (x >= 0 && y <= 0) {
            return (x <= r / 2.0) && y >= -r && (y >= 2 * x - r);
        }

        return false;
    }
}