package com.lab.web.security;

import jakarta.ejb.Stateless;
import jakarta.security.auth.message.AuthException;

import java.util.logging.Logger;

import com.lab.web.constants.SecurityConstants;

@Stateless
public class AuthService {

    private static final Logger logger = Logger.getLogger(AuthService.class.getName());

    private final JwtProvider jwtService = new JwtProvider();

    private String normalizeToken(String token) throws AuthException {
        if (token == null || token.trim().isEmpty()) {
            logger.warning("Attempt without token");
            throw new AuthException("Token required");
        }
        token = token.trim();

        if (token.startsWith(SecurityConstants.AUTH_HEADER_PREFIX)) {
            return token.substring(SecurityConstants.AUTH_HEADER_PREFIX.length());
        }
        
        return token;
    }

    public Long getUserIDbyToken(String token) throws AuthException {
        token = normalizeToken(token);

        if (!jwtService.isTokenValid(token)) {
            logger.warning("Invalid or expired token");
            throw new AuthException("Invalid or expired token");
        }

        Long userId = jwtService.extractUserId(token);
        logger.info("Successfully verified token for userId: " + userId);
        return userId;
    }
}