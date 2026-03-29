package com.eventzen.service.impl;

import com.eventzen.dto.request.VenueRequest;
import com.eventzen.dto.response.VenueResponse;
import com.eventzen.entity.Venue;
import com.eventzen.enums.VenueStatus;
import com.eventzen.repository.VenueRepository;
import com.eventzen.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueServiceImpl implements VenueService {

    private final VenueRepository venueRepository;

    @Override
    public VenueResponse createVenue(VenueRequest request) {
        Venue venue = Venue.builder()
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .capacity(request.getCapacity())
                .amenities(request.getAmenities())
                .status(VenueStatus.AVAILABLE)
                .build();

        Venue savedVenue = venueRepository.save(venue);
        return mapToResponse(savedVenue);
    }

    @Override
    public List<VenueResponse> getAllVenues() {
        return venueRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public VenueResponse getVenueById(Long id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));
        return mapToResponse(venue);
    }

    @Override
    public VenueResponse updateVenue(Long id, VenueRequest request) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));

        venue.setName(request.getName());
        venue.setAddress(request.getAddress());
        venue.setCity(request.getCity());
        venue.setCapacity(request.getCapacity());
        venue.setAmenities(request.getAmenities());

        Venue updatedVenue = venueRepository.save(venue);
        return mapToResponse(updatedVenue);
    }

    @Override
    public void deleteVenue(Long id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));
        venueRepository.delete(venue);
    }

    private VenueResponse mapToResponse(Venue venue) {
        return VenueResponse.builder()
                .id(venue.getId())
                .name(venue.getName())
                .address(venue.getAddress())
                .city(venue.getCity())
                .capacity(venue.getCapacity())
                .amenities(venue.getAmenities())
                .status(venue.getStatus())
                .build();
    }
}