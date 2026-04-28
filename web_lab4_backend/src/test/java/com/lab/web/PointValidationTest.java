package com.lab.web;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;

import java.time.LocalDateTime;

import com.lab.web.data.User;
import com.lab.web.data.PointData;
import com.lab.web.service.PointService;

public class PointValidationTest {

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId((long) 1);
    }

    @ParameterizedTest
    @ValueSource(doubles = {-3.0, 0.0, 2.5, 5.0})
    void testValidateXValid(double x) {
        assertTrue(PointService.validateX(x));
    }

    @ParameterizedTest
    @ValueSource(doubles = {-3.1, 5.1})
    void testValidateXInvalid(double x) {
        assertFalse(PointService.validateX(x));
    }

    @ParameterizedTest
    @ValueSource(doubles = {-5.0, 0.0, 3.0})
    void testValidateYValid(double y) {
        assertTrue(PointService.validateY(y));
    }

    @ParameterizedTest
    @ValueSource(doubles = {-5.1, 3.1})
    void testValidateYInvalid(double y) {
        assertFalse(PointService.validateY(y));
    }

    @ParameterizedTest
    @ValueSource(doubles = {1.0, 3.0, 5.0})
    void testValidateRValid(double r) {
        assertTrue(PointService.validateR(r));
    }

    @ParameterizedTest
    @ValueSource(doubles = {0.5, 5.5, -1.0})
    void testValidateRInvalid(double r) {
        assertFalse(PointService.validateR(r));
    }

    @Test
    void testCreatePointDataThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> 
            PointService.createPointData(10.0, 0.0, 3.0, testUser, false)
        );
    }

    @Test
    void testCreatePointDataInvalidR_FromGraph() {
        assertThrows(IllegalArgumentException.class, () -> 
            PointService.createPointData(1.0, 1.0, -1.0, testUser, true)
        );
    }
}