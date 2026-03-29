package com.eventzen.service;

import com.eventzen.dto.request.VendorRequest;
import com.eventzen.dto.response.VendorResponse;

import java.util.List;

public interface VendorService {
    VendorResponse createVendor(VendorRequest request);
    List<VendorResponse> getAllVendors();
    VendorResponse getVendorById(Long id);
    VendorResponse updateVendor(Long id, VendorRequest request);
    void deleteVendor(Long id);
    List<VendorResponse> getVendorsByEvent(Long eventId);
}