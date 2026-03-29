package com.eventzen.service;

import com.eventzen.dto.request.VenueRequest;
import com.eventzen.dto.response.VenueResponse;

import java.util.List;

public interface VenueService {
    VenueResponse createVenue(VenueRequest request);
    List<VenueResponse> getAllVenues();
    VenueResponse getVenueById(Long id);
    VenueResponse updateVenue(Long id, VenueRequest request);
    void deleteVenue(Long id);
}