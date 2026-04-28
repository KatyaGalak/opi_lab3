package com.lab.web.service;

import com.lab.web.data.PointData;
import com.lab.web.data.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class PointHitTest {

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId((long) 1);
    }

    private boolean checkHitViaService(double x, double y, double r) {
        PointData point = PointService.createPointData(x, y, r, testUser, true);
        return point.getHit();
    }

    @ParameterizedTest
    @CsvSource({
        "0, 0, 5, true",
        "-3, 4, 5, true",
        "-1, 1, 5, true",
        "-4, 4, 5, false"
    })
    void testCircleHit(double x, double y, double r, boolean expected) {
        assertEquals(expected, checkHitViaService(x, y, r));
    }

    @ParameterizedTest
    @CsvSource({
        "0, 0, 5, true",
        "-5, 0, 5, true",
        "0, -2.5, 5, true",
        "-5, -2.5, 5, true",
        "-5.1, -1, 5, false",
        "-1, -2.6, 5, false"
    })
    void testRectangleHit(double x, double y, double r, boolean expected) {
        assertEquals(expected, checkHitViaService(x, y, r));
    }

    @ParameterizedTest
    @CsvSource({
        "0, 0, 5, true",
        "2.5, 0, 5, true",
        "0, -2.5, 5, true",
        "0, -5, 5, false",
        "1, -1, 5, true",
        "2, -2, 5, false"
    })
    void testTriangleHit(double x, double y, double r, boolean expected) {
        assertEquals(expected, checkHitViaService(x, y, r));
    }
}