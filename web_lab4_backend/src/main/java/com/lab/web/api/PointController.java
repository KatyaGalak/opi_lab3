package com.lab.web.api;

import com.lab.web.api.record.point.Point;
import com.lab.web.data.PointData;
import com.lab.web.data.User;
import com.lab.web.database.PointHibernateRepository;
import com.lab.web.database.UserHibernateRepository;
import com.lab.web.security.AuthService;
import com.lab.web.service.PointService;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

import java.util.List;

@Path("/points")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PointController {

    @Context
    private HttpServletRequest request;

    @Inject
    private PointHibernateRepository pointRepository;

    @Inject
    private UserHibernateRepository userRepository;

    @Inject
    private AuthService userVerification;

    @GET
    public Response getPoints(@HeaderParam("Authorization") String token) {
        try {
            Long userId = userVerification.getUserIDbyToken(token);
            List<PointData> points = pointRepository.getAllPoints(userId);
            return Response.ok(points).build();
        } catch (Exception e) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("{\"error\": \"invalid token\"}").build();
        }
    }

    @POST
    @Transactional
    public Response addPoint(Point point, @HeaderParam("Authorization") String token) {
        try {
            Long userId = userVerification.getUserIDbyToken(token);

            User user = userRepository.getUserById(userId);

            PointData newPoint = PointService.createPointData(point.x(), point.y(), point.r(), user, point.fromGraph() != null && point.fromGraph());
            pointRepository.addPoint(newPoint);

            return Response.ok(newPoint).build();
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity("{\"error\": \"" + e.getMessage() + "\"}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("{\"error\": \"invalid token\"}").build();
        }
    }

    @DELETE
    @Transactional
    public Response clearPoints(@HeaderParam("Authorization") String token) {
        try {
            Long userId = userVerification.getUserIDbyToken(token);
            pointRepository.clearPoints(userId);
            return Response.ok("{\"message\": \"points cleared\"}").build();
        } catch (Exception e) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("{\"error\": \"invalid token\"}").build();
        }
    }
}