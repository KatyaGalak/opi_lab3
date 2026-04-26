package com.lab.web.constants;

public final class SecurityConstants {
    private SecurityConstants() {}

    public static final long JWT_EXPIRATION_MS = 1000L * 60 * 60 * 8;
    
    public static final int BCRYPT_COST = 12;
    
    public static final String AUTH_HEADER_PREFIX = "Bearer ";

    public static final int ARGON2_ITERATIONS = 3; 
    public static final int ARGON2_MEMORY = 65536;
    public static final int ARGON2_PARALLELISM = 1;
}