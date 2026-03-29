package com.eventzen.service.impl;

import com.eventzen.dto.request.VendorRequest;
import com.eventzen.dto.response.VendorResponse;
import com.eventzen.entity.Event;
import com.eventzen.entity.Vendor;
import com.eventzen.enums.VendorStatus;
import com.eventzen.exception.ResourceNotFoundException;
import com.eventzen.repository.EventRepository;
import com.eventzen.repository.VendorRepository;
import com.eventzen.service.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorServiceImpl implements VendorService {

    private final VendorRepository vendorRepository;
    private final EventRepository eventRepository;

    @Override
    public VendorResponse createVendor(VendorRequest request) {

        // Find event if eventId is provided
        Event event = null;
        if (request.getEventId() != null) {
            event = eventRepository.findById(request.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Event not found with id: " + request.getEventId()));
        }

        Vendor vendor = Vendor.builder()
                .name(request.getName())
                .contactPerson(request.getContactPerson())
                .email(request.getEmail())
                .phone(request.getPhone())
                .serviceType(request.getServiceType())
                .costPerEvent(request.getCostPerEvent())
                .description(request.getDescription())
                .status(VendorStatus.ACTIVE)
                .event(event)
                .build();

        Vendor savedVendor = vendorRepository.save(vendor);
        return mapToResponse(savedVendor);
    }

    @Override
    public List<VendorResponse> getAllVendors() {
        return vendorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public VendorResponse getVendorById(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Vendor not found with id: " + id));
        return mapToResponse(vendor);
    }

    @Override
    public VendorResponse updateVendor(Long id, VendorRequest request) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Vendor not found with id: " + id));

        // Update event assignment if provided
        if (request.getEventId() != null) {
            Event event = eventRepository.findById(request.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Event not found with id: " + request.getEventId()));
            vendor.setEvent(event);
        }

        vendor.setName(request.getName());
        vendor.setContactPerson(request.getContactPerson());
        vendor.setEmail(request.getEmail());
        vendor.setPhone(request.getPhone());
        vendor.setServiceType(request.getServiceType());
        vendor.setCostPerEvent(request.getCostPerEvent());
        vendor.setDescription(request.getDescription());

        Vendor updatedVendor = vendorRepository.save(vendor);
        return mapToResponse(updatedVendor);
    }

    @Override
    public void deleteVendor(Long id) {
        Vendor vendor = vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Vendor not found with id: " + id));
        vendorRepository.delete(vendor);
    }

    @Override
    public List<VendorResponse> getVendorsByEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Event not found with id: " + eventId));
        return vendorRepository.findByEvent(event)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private VendorResponse mapToResponse(Vendor vendor) {
        return VendorResponse.builder()
                .id(vendor.getId())
                .name(vendor.getName())
                .contactPerson(vendor.getContactPerson())
                .email(vendor.getEmail())
                .phone(vendor.getPhone())
                .serviceType(vendor.getServiceType())
                .costPerEvent(vendor.getCostPerEvent())
                .description(vendor.getDescription())
                .status(vendor.getStatus())
                .eventId(vendor.getEvent() != null ? vendor.getEvent().getId() : null)
                .eventName(vendor.getEvent() != null ? vendor.getEvent().getName() : null)
                .build();
    }
}