-- CivicConnect - BMC/TMC Complaint Management System
-- MySQL Database Setup and Table Schema Script

CREATE DATABASE IF NOT EXISTS civic_complaint_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE civic_complaint_management;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    municipal_corporation VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

-- 3. Officers Table
CREATE TABLE IF NOT EXISTS officers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    department_id BIGINT,
    CONSTRAINT fk_officer_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    municipal_corporation VARCHAR(50) NOT NULL,
    location VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    image_url VARCHAR(500),
    latitude DOUBLE,
    longitude DOUBLE,
    resolution_remarks TEXT,
    citizen_id BIGINT NOT NULL,
    department_id BIGINT,
    assigned_officer_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    CONSTRAINT fk_complaint_citizen FOREIGN KEY (citizen_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_complaint_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    CONSTRAINT fk_complaint_officer FOREIGN KEY (assigned_officer_id) REFERENCES officers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Complaint History Table (Status Audit Log)
CREATE TABLE IF NOT EXISTS complaint_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    comment TEXT,
    updated_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    complaint_id BIGINT NOT NULL UNIQUE,
    citizen_id BIGINT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_complaint FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_citizen FOREIGN KEY (citizen_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Performance Indexes
CREATE INDEX idx_complaint_status ON complaints(status);
CREATE INDEX idx_complaint_category ON complaints(category);
CREATE INDEX idx_complaint_corporation ON complaints(municipal_corporation);
CREATE INDEX idx_complaint_priority ON complaints(priority);
CREATE INDEX idx_complaint_citizen ON complaints(citizen_id);
