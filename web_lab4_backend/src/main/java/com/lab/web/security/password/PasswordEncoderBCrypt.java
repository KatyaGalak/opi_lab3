package com.lab.web.security.password;

import at.favre.lib.crypto.bcrypt.BCrypt;

import com.lab.web.constants.SecurityConstants;

public class PasswordEncoderBCrypt {
    private PasswordEncoderBCrypt() {}

    public static String hashPassword(String password) {
        return BCrypt.withDefaults().hashToString(SecurityConstants.BCRYPT_COST, password.toCharArray());
    }

    public static boolean verifyPassword(String password, String hashedPassword) {
        BCrypt.Result result = BCrypt.verifyer().verify(password.toCharArray(), hashedPassword);
        return result.verified;
    }
}