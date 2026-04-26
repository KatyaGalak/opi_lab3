package com.lab.web.api;

import com.lab.web.database.UserHibernateRepository;
import com.lab.web.security.JwtProvider;
import com.lab.web.security.password.PasswordEncoderBCrypt;
import com.lab.web.api.record.auth.LoginRequest;
import com.lab.web.api.record.auth.LoginResponse;
import com.lab.web.api.record.auth.RegisterRequest;
import com.lab.web.api.record.auth.RegisterResponse;
import com.lab.web.data.User;

import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auth")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthController {

    @Context
    private HttpServletRequest request;

    @Inject
    private UserHibernateRepository userRepository;

    private final JwtProvider jwtService = new JwtProvider();

    @POST
    @Path("/register")
    @Transactional
    public Response register(RegisterRequest req) {
        String username = req.username().trim();
        String password = req.password().trim();

        if (username.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new RegisterResponse("Username is required", false))
                    .build();
        }
        if (username.length() < 3) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new RegisterResponse("Username must be at least 3 characters long", false))
                    .build();
        }
        if (password.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new RegisterResponse("Password is required", false))
                    .build();
        }
        if (password.length() < 5) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new RegisterResponse("Password must be at least 5 characters long", false))
                    .build();
        }

        if (userRepository.userExists(username)) {
            return Response.status(Response.Status.CONFLICT)
                    .entity(new RegisterResponse("User with this username already exists", false))
                    .build();
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPasswordHash(PasswordEncoderBCrypt.hashPassword(password));

        userRepository.createUser(newUser);

        String token = jwtService.generateToken(newUser.getId());

        return Response.ok(new RegisterResponse("user registered successfully", true, token)).build();
    }

    @POST
    @Path("/login")
    public Response login(LoginRequest req) {

        String username = req.username().trim();
        String password = req.password().trim();

        if (!userRepository.userExists(username)) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new LoginResponse("invalid username or password", null))
                    .build();
        }

        if (!userRepository.checkPassword(username, password)) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(new LoginResponse("invalid username or password", null))
                    .build();
        }

        User user = userRepository.getUserByUsername(username);
        String token = jwtService.generateToken(user.getId());

        return Response.ok(new LoginResponse("login successful", token)).build();
    }

    @GET
    @Path("/logout")
    public Response logout() {
        return Response.ok(new LoginResponse("logout successful", null)).build();
    }
}