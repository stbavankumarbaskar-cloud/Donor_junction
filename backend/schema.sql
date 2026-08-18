-- ============================================================
-- DONOR JUNCTION DATABASE SCHEMA (donor_junction)
-- Complete MySQL database schema and initial seed data
-- ============================================================

CREATE DATABASE IF NOT EXISTS `donor_junction` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `donor_junction`;

-- ------------------------------------------------------------
-- 1. USERS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL UNIQUE,
  `email` VARCHAR(100) DEFAULT NULL,
  `blood_group` VARCHAR(10) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `profile_image` VARCHAR(255) DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(11, 8) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 2. BLOOD POSTS TABLE (Requests for Blood)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `patient_name` VARCHAR(100) NOT NULL,
  `blood_group` VARCHAR(10) NOT NULL,
  `units` INT DEFAULT 1,
  `hospital` VARCHAR(150) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `mobile` VARCHAR(20) NOT NULL,
  `urgency` ENUM('Urgent', 'Normal', 'Critical') DEFAULT 'Normal',
  `note` TEXT DEFAULT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(11, 8) DEFAULT NULL,
  `status` ENUM('Active', 'Completed', 'Cancelled') DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 3. CAMPAIGNS TABLE (Blood Drive Camps)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `organization` VARCHAR(150) NOT NULL,
  `location` VARCHAR(200) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `time` VARCHAR(50) NOT NULL,
  `image_url` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 4. BLOGS TABLE (Articles and Guides)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `blogs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `org_name` VARCHAR(150) DEFAULT 'Donor Junction Trust',
  `description` TEXT NOT NULL,
  `image_uri` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 5. LOCATIONS TABLE (Blood Banks and Hospitals)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `locations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `type` ENUM('Blood Bank', 'Hospital', 'Camp') DEFAULT 'Blood Bank',
  `address` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(10, 8) NOT NULL,
  `longitude` DECIMAL(11, 8) NOT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `available_groups` VARCHAR(100) DEFAULT 'A+, B+, O+, AB+',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 6. CERTIFICATES TABLE (Donation Certificates)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `mobile` VARCHAR(20) NOT NULL,
  `donor_name` VARCHAR(100) NOT NULL,
  `donation_date` VARCHAR(50) NOT NULL,
  `certificate_code` VARCHAR(50) NOT NULL,
  `certificate_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 7. SCHEDULE DONATIONS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `schedule_donations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_mobile` VARCHAR(20) NOT NULL,
  `donor_name` VARCHAR(100) NOT NULL,
  `blood_group` VARCHAR(10) NOT NULL,
  `center_name` VARCHAR(150) NOT NULL,
  `donation_date` VARCHAR(50) NOT NULL,
  `time_slot` VARCHAR(50) NOT NULL,
  `notes` TEXT DEFAULT NULL,
  `status` ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 8. CHAT THREADS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `chat_threads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_phone` VARCHAR(20) NOT NULL,
  `partner_mobile` VARCHAR(20) NOT NULL,
  `partner_name` VARCHAR(100) NOT NULL,
  `partner_type` VARCHAR(50) DEFAULT 'hospital',
  `last_message` TEXT DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `user_partner_unique` (`user_phone`, `partner_mobile`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- 9. CHAT MESSAGES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_phone` VARCHAR(20) NOT NULL,
  `partner_mobile` VARCHAR(20) NOT NULL,
  `partner_name` VARCHAR(100) NOT NULL,
  `sender` ENUM('user', 'partner') NOT NULL,
  `text` TEXT NOT NULL,
  `timestamp` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================

-- Seed Users
INSERT INTO `users` (`name`, `mobile`, `email`, `blood_group`, `city`, `password`, `latitude`, `longitude`) VALUES
('John Doe', '9876543210', 'john@example.com', 'O+', 'Chennai', '123456', 13.0827, 80.2707),
('Ravi Kumar', '9123456789', 'ravi@example.com', 'A+', 'Madurai', '123456', 9.9252, 78.1198),
('Sarah Jenkins', '9998887776', 'sarah@example.com', 'B+', 'Coimbatore', '123456', 11.0168, 76.9558);

-- Seed Blood Posts
INSERT INTO `posts` (`patient_name`, `blood_group`, `units`, `hospital`, `city`, `mobile`, `urgency`, `note`, `latitude`, `longitude`) VALUES
('Rajesh Kannan', 'O+', 2, 'Apollo Hospital', 'Chennai', '9876543210', 'Urgent', 'Emergency surgery required by 4 PM today.', 13.0827, 80.2707),
('Meena Kumari', 'B+', 1, 'MGM Healthcare', 'Chennai', '9123456789', 'Critical', 'ICU admission, immediate requirement.', 13.0614, 80.2376),
('Karthik N', 'AB-', 3, 'KMCH Hospital', 'Coimbatore', '9998887776', 'Normal', 'Scheduled heart surgery tomorrow morning.', 11.0168, 76.9558);

-- Seed Campaigns
INSERT INTO `campaigns` (`title`, `organization`, `location`, `date`, `time`, `description`) VALUES
('Mega Blood Donation Camp', 'Rotary Club & Donor Junction', 'Anna Nagar Community Center, Chennai', '2026-09-01', '09:00 AM - 04:00 PM', 'Join our monthly blood donation drive. Refreshments and certificates provided for all donors.'),
('Youth Lifesavers Drive', 'Red Cross Society', 'GRD College Campus, Coimbatore', '2026-09-10', '10:00 AM - 03:00 PM', 'Blood donation drive organized specifically for college students and faculty.');

-- Seed Blogs
INSERT INTO `blogs` (`title`, `org_name`, `description`) VALUES
('Why Donating Blood Regularly Saves 3 Lives', 'Tamil Nadu Blood Donor Federation', 'Every single unit of blood donated can be separated into red cells, plasma, and platelets to help three different patients in critical need.'),
('Eligibility Criteria for First-Time Donors', 'Donor Junction Medical Board', 'Learn about age requirements, body weight standards, hemoglobin levels, and health guidelines before your first donation.');

-- Seed Locations (Map Pins)
INSERT INTO `locations` (`name`, `type`, `address`, `latitude`, `longitude`, `phone`, `available_groups`) VALUES
('Central Blood Bank', 'Blood Bank', 'Greams Road, Thousand Lights, Chennai', 13.0604, 80.2496, '044-28290200', 'A+, B+, O+, AB+, O-'),
('MGM Blood Center', 'Hospital', 'Nelson Manickam Road, Aminjikarai, Chennai', 13.0722, 80.2238, '044-42004200', 'A+, B+, O+, AB+'),
('Government General Hospital', 'Hospital', 'EVR Periyar Salai, Park Town, Chennai', 13.0818, 80.2778, '044-25305000', 'All Blood Groups');

-- Seed Certificates
INSERT INTO `certificates` (`mobile`, `donor_name`, `donation_date`, `certificate_code`) VALUES
('9876543210', 'John Doe', '2026-05-15', 'CERT-DJ-2026-001'),
('9123456789', 'Ravi Kumar', '2026-06-20', 'CERT-DJ-2026-002');
