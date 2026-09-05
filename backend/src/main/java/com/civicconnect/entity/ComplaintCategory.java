package com.civicconnect.entity;

public enum ComplaintCategory {
    GARBAGE_AND_WASTE("Garbage & Waste"),
    POTHOLES_AND_ROADS("Potholes & Roads"),
    STREETLIGHTS("Streetlights"),
    WATER_SUPPLY("Water Supply"),
    DRAINAGE_AND_SEWAGE("Drainage & Sewage"),
    SANITATION("Sanitation"),
    PUBLIC_TOILETS("Public Toilets"),
    TRAFFIC_AND_PARKING("Traffic & Parking"),
    ILLEGAL_CONSTRUCTION("Illegal Construction"),
    TREE_AND_GARDEN("Tree & Garden Issues"),
    PUBLIC_PROPERTY_DAMAGE("Public Property Damage"),
    OTHER("Other");

    private final String displayName;

    ComplaintCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
