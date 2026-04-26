package com.lab.web.security.password;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;

import com.lab.web.constants.SecurityConstants;

public class PasswordEncoderArgon2 {
    private PasswordEncoderArgon2() {}

    private static final Argon2 ARGON2 = Argon2Factory.create(Argon2Factory.Argon2Types.ARGON2id);

    public static String hashPassword(String password) {
        return ARGON2.hash(SecurityConstants.ARGON2_ITERATIONS, SecurityConstants.ARGON2_MEMORY, SecurityConstants.ARGON2_PARALLELISM, password.toCharArray());
    }

    public static boolean verifyPassword(String password, String hashedPassword) {
        return ARGON2.verify(hashedPassword, password.toCharArray());
    }
}
