package com.civicconnect.entity;

public enum MunicipalCorporation {
    BMC("Brihanmumbai Municipal Corporation"),
    TMC("Thane Municipal Corporation");

    private final String fullName;

    MunicipalCorporation(String fullName) {
        this.fullName = fullName;
    }

    public String getFullName() {
        return fullName;
    }
}
