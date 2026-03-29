package com.eventzen.controller;

import com.eventzen.dto.request.VendorRequest;
import com.eventzen.dto.response.ApiResponse;
import com.eventzen.dto.response.VendorResponse;
import com.eventzen.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/vendors")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class VendorController {

    private final VendorService vendorService;

    @PostMapping
    public ResponseEntity<ApiResponse<VendorResponse>> createVendor(
            @Valid @RequestBody VendorRequest request) {
        VendorResponse response = vendorService.createVendor(request);
        return ResponseEntity.ok(
                ApiResponse.success("Vendor created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VendorResponse>>> getAllVendors() {
        List<VendorResponse> vendors = vendorService.getAllVendors();
        return ResponseEntity.ok(
                ApiResponse.success("Vendors fetched successfully", vendors));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VendorResponse>> getVendorById(
            @PathVariable Long id) {
        VendorResponse response = vendorService.getVendorById(id);
        return ResponseEntity.ok(
                ApiResponse.success("Vendor fetched successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VendorResponse>> updateVendor(
            @PathVariable Long id,
            @Valid @RequestBody VendorRequest request) {
        VendorResponse response = vendorService.updateVendor(id, request);
        return ResponseEntity.ok(
                ApiResponse.success("Vendor updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteVendor(
            @PathVariable Long id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.ok(
                ApiResponse.success("Vendor deleted successfully", null));
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<ApiResponse<List<VendorResponse>>> getVendorsByEvent(
            @PathVariable Long eventId) {
        List<VendorResponse> vendors = vendorService.getVendorsByEvent(eventId);
        return ResponseEntity.ok(
                ApiResponse.success("Vendors fetched for event", vendors));
    }
}