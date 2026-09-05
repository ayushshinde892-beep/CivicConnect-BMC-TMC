package com.civicconnect.dto;

import com.civicconnect.entity.ComplaintCategory;
import com.civicconnect.entity.MunicipalCorporation;
import com.civicconnect.entity.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ComplaintRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private ComplaintCategory category;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @NotNull(message = "Municipal Corporation is required")
    private MunicipalCorporation municipalCorporation;

    @NotBlank(message = "Location address is required")
    private String location;

    @NotBlank(message = "Area is required")
    private String area;

    @NotBlank(message = "Pincode is required")
    private String pincode;

    private String imageUrl;
    private Double latitude;
    private Double longitude;

    public ComplaintRequest() {
    }

    public ComplaintRequest(String title, String description, ComplaintCategory category, Priority priority,
                            MunicipalCorporation municipalCorporation, String location, String area,
                            String pincode, String imageUrl, Double latitude, Double longitude) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.municipalCorporation = municipalCorporation;
        this.location = location;
        this.area = area;
        this.pincode = pincode;
        this.imageUrl = imageUrl;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public static ComplaintRequestBuilder builder() {
        return new ComplaintRequestBuilder();
    }

    public static class ComplaintRequestBuilder {
        private String title;
        private String description;
        private ComplaintCategory category;
        private Priority priority;
        private MunicipalCorporation municipalCorporation;
        private String location;
        private String area;
        private String pincode;
        private String imageUrl;
        private Double latitude;
        private Double longitude;

        public ComplaintRequestBuilder title(String title) { this.title = title; return this; }
        public ComplaintRequestBuilder description(String description) { this.description = description; return this; }
        public ComplaintRequestBuilder category(ComplaintCategory category) { this.category = category; return this; }
        public ComplaintRequestBuilder priority(Priority priority) { this.priority = priority; return this; }
        public ComplaintRequestBuilder municipalCorporation(MunicipalCorporation municipalCorporation) { this.municipalCorporation = municipalCorporation; return this; }
        public ComplaintRequestBuilder location(String location) { this.location = location; return this; }
        public ComplaintRequestBuilder area(String area) { this.area = area; return this; }
        public ComplaintRequestBuilder pincode(String pincode) { this.pincode = pincode; return this; }
        public ComplaintRequestBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public ComplaintRequestBuilder latitude(Double latitude) { this.latitude = latitude; return this; }
        public ComplaintRequestBuilder longitude(Double longitude) { this.longitude = longitude; return this; }

        public ComplaintRequest build() {
            return new ComplaintRequest(title, description, category, priority, municipalCorporation, location, area, pincode, imageUrl, latitude, longitude);
        }
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ComplaintCategory getCategory() { return category; }
    public void setCategory(ComplaintCategory category) { this.category = category; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public MunicipalCorporation getMunicipalCorporation() { return municipalCorporation; }
    public void setMunicipalCorporation(MunicipalCorporation municipalCorporation) { this.municipalCorporation = municipalCorporation; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}
