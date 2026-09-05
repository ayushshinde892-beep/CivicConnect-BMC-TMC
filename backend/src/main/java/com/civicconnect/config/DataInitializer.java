package com.civicconnect.config;

import com.civicconnect.entity.*;
import com.civicconnect.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final OfficerRepository officerRepository;
    private final ComplaintRepository complaintRepository;
    private final ComplaintHistoryRepository historyRepository;
    private final FeedbackRepository feedbackRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, DepartmentRepository departmentRepository,
                           OfficerRepository officerRepository, ComplaintRepository complaintRepository,
                           ComplaintHistoryRepository historyRepository, FeedbackRepository feedbackRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.officerRepository = officerRepository;
        this.complaintRepository = complaintRepository;
        this.historyRepository = historyRepository;
        this.feedbackRepository = feedbackRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping initialization.");
            return;
        }

        log.info("Starting initial sample data generation for CivicConnect...");

        // 1. Create Users
        User admin = User.builder()
                .name("BMC Chief Administrator")
                .email("admin@civicconnect.com")
                .password(passwordEncoder.encode("admin123"))
                .phone("9820012345")
                .role(Role.ROLE_ADMIN)
                .build();
        userRepository.save(admin);

        User citizen1 = User.builder()
                .name("Rahul Sharma")
                .email("citizen@civicconnect.com")
                .password(passwordEncoder.encode("citizen123"))
                .phone("9876543210")
                .role(Role.ROLE_CITIZEN)
                .build();
        userRepository.save(citizen1);

        User citizen2 = User.builder()
                .name("Priya Patil")
                .email("priya@civicconnect.com")
                .password(passwordEncoder.encode("citizen123"))
                .phone("9819283746")
                .role(Role.ROLE_CITIZEN)
                .build();
        userRepository.save(citizen2);

        User officerUser = User.builder()
                .name("Sneha Kulkarni")
                .email("officer@civicconnect.com")
                .password(passwordEncoder.encode("officer123"))
                .phone("9820192838")
                .role(Role.ROLE_OFFICER)
                .build();
        userRepository.save(officerUser);

        // 2. Create Departments
        Department deptSolidWaste = departmentRepository.save(Department.builder().name("Solid Waste Management").municipalCorporation(MunicipalCorporation.BMC).build());
        Department deptRoads = departmentRepository.save(Department.builder().name("Road Department").municipalCorporation(MunicipalCorporation.BMC).build());
        Department deptWater = departmentRepository.save(Department.builder().name("Water Department").municipalCorporation(MunicipalCorporation.BMC).build());
        Department deptDrainage = departmentRepository.save(Department.builder().name("Drainage Department").municipalCorporation(MunicipalCorporation.TMC).build());
        Department deptElectrical = departmentRepository.save(Department.builder().name("Electrical Department").municipalCorporation(MunicipalCorporation.TMC).build());
        Department deptSanitation = departmentRepository.save(Department.builder().name("Sanitation Department").municipalCorporation(MunicipalCorporation.BMC).build());
        Department deptGarden = departmentRepository.save(Department.builder().name("Garden Department").municipalCorporation(MunicipalCorporation.BMC).build());
        Department deptBuilding = departmentRepository.save(Department.builder().name("Building Department").municipalCorporation(MunicipalCorporation.TMC).build());
        Department deptTraffic = departmentRepository.save(Department.builder().name("Traffic Department").municipalCorporation(MunicipalCorporation.BMC).build());

        // 3. Create Officers
        Officer off1 = officerRepository.save(Officer.builder().name("Rajesh Varma").email("rajesh.varma@bmc.gov.in").phone("9820192837").department(deptSolidWaste).build());
        Officer off2 = officerRepository.save(Officer.builder().name("Sneha Kulkarni").email("officer@civicconnect.com").phone("9820192838").department(deptRoads).build());
        Officer off3 = officerRepository.save(Officer.builder().name("Amit Deshmukh").email("amit.deshmukh@bmc.gov.in").phone("9820192839").department(deptWater).build());
        Officer off4 = officerRepository.save(Officer.builder().name("Vikram Jadhav").email("vikram.jadhav@tmc.gov.in").phone("9820192840").department(deptDrainage).build());
        Officer off5 = officerRepository.save(Officer.builder().name("Sunita Rao").email("sunita.rao@tmc.gov.in").phone("9820192841").department(deptElectrical).build());
        Officer off6 = officerRepository.save(Officer.builder().name("Manoj Shinde").email("manoj.shinde@bmc.gov.in").phone("9820192842").department(deptSanitation).build());

        // 4. Create Sample Complaints
        Complaint c1 = Complaint.builder()
                .complaintNumber("CMP-2026-0001")
                .title("Severe Garbage Overflow near Naupada Fish Market")
                .description("Garbage bins have been overflowing for 4 days without municipal clearance. Strong foul odor and stray animals creating serious health hazards for nearby residents and shopkeepers.")
                .category(ComplaintCategory.GARBAGE_AND_WASTE)
                .status(ComplaintStatus.IN_PROGRESS)
                .priority(Priority.HIGH)
                .municipalCorporation(MunicipalCorporation.TMC)
                .location("Near Naupada Market, B-Cabin Road")
                .area("Naupada, Thane West")
                .pincode("400602")
                .latitude(19.1860)
                .longitude(72.9754)
                .citizen(citizen1)
                .department(deptSolidWaste)
                .assignedOfficer(off1)
                .build();
        complaintRepository.save(c1);

        historyRepository.save(ComplaintHistory.builder().complaint(c1).oldStatus(null).newStatus(ComplaintStatus.SUBMITTED).comment("Complaint registered online").updatedBy(citizen1.getName()).build());
        historyRepository.save(ComplaintHistory.builder().complaint(c1).oldStatus(ComplaintStatus.SUBMITTED).newStatus(ComplaintStatus.UNDER_REVIEW).comment("Officer reviewing location and priority").updatedBy("Admin").build());
        historyRepository.save(ComplaintHistory.builder().complaint(c1).oldStatus(ComplaintStatus.UNDER_REVIEW).newStatus(ComplaintStatus.ASSIGNED).comment("Assigned to Solid Waste Management (Thane Division)").updatedBy("Admin").build());
        historyRepository.save(ComplaintHistory.builder().complaint(c1).oldStatus(ComplaintStatus.ASSIGNED).newStatus(ComplaintStatus.IN_PROGRESS).comment("Garbage compactor vehicle dispatched to site").updatedBy(off1.getName()).build());

        Complaint c2 = Complaint.builder()
                .complaintNumber("CMP-2026-0002")
                .title("Dangerous Deep Potholes on WEH near Kalanagar Junction")
                .description("Two large potholes measuring roughly 3 feet wide and 6 inches deep on the south-bound flyover approach. Poses acute accident risk for two-wheelers during evening peak hours.")
                .category(ComplaintCategory.POTHOLES_AND_ROADS)
                .status(ComplaintStatus.RESOLVED)
                .priority(Priority.URGENT)
                .municipalCorporation(MunicipalCorporation.BMC)
                .location("Western Express Highway, South-bound near Kalanagar flyover")
                .area("Bandra East, Mumbai")
                .pincode("400051")
                .latitude(19.0607)
                .longitude(72.8515)
                .resolutionRemarks("Road maintenance contractor deployed mastic asphalt filling. Road surface leveled and inspected successfully.")
                .resolvedAt(LocalDateTime.now().minusDays(1))
                .citizen(citizen1)
                .department(deptRoads)
                .assignedOfficer(off2)
                .build();
        complaintRepository.save(c2);

        historyRepository.save(ComplaintHistory.builder().complaint(c2).oldStatus(null).newStatus(ComplaintStatus.SUBMITTED).comment("Urgent pothole reported by citizen").updatedBy(citizen1.getName()).build());
        historyRepository.save(ComplaintHistory.builder().complaint(c2).oldStatus(ComplaintStatus.SUBMITTED).newStatus(ComplaintStatus.ASSIGNED).comment("Assigned to BMC Road Maintenance Wing (H-East Ward)").updatedBy("Admin").build());
        historyRepository.save(ComplaintHistory.builder().complaint(c2).oldStatus(ComplaintStatus.ASSIGNED).newStatus(ComplaintStatus.IN_PROGRESS).comment("Repair squad on-site with cold mix asphalt").updatedBy(off2.getName()).build());
        historyRepository.save(ComplaintHistory.builder().complaint(c2).oldStatus(ComplaintStatus.IN_PROGRESS).newStatus(ComplaintStatus.RESOLVED).comment("Pothole filled and road restored smoothly").updatedBy(off2.getName()).build());

        feedbackRepository.save(Feedback.builder().complaint(c2).rating(5).comment("Extremely quick action by BMC! Potholes were fixed within 24 hours of reporting. Great work!").citizen(citizen1).build());

        Complaint c3 = Complaint.builder()
                .complaintNumber("CMP-2026-0003")
                .title("Streetlights completely dark along Ghodbunder Service Road")
                .description("Row of 8 consecutive LED streetlights are non-functional between Viviana Mall and Cadbury junction. Causes severe safety hazard for pedestrians and cyclists after dark.")
                .category(ComplaintCategory.STREETLIGHTS)
                .status(ComplaintStatus.ASSIGNED)
                .priority(Priority.MEDIUM)
                .municipalCorporation(MunicipalCorporation.TMC)
                .location("Ghodbunder Service Road, opposite Viviana Mall")
                .area("Thane West")
                .pincode("400606")
                .latitude(19.2094)
                .longitude(72.9734)
                .citizen(citizen2)
                .department(deptElectrical)
                .assignedOfficer(off5)
                .build();
        complaintRepository.save(c3);

        historyRepository.save(ComplaintHistory.builder().complaint(c3).oldStatus(null).newStatus(ComplaintStatus.SUBMITTED).comment("Complaint registered by citizen").updatedBy(citizen2.getName()).build());
        historyRepository.save(ComplaintHistory.builder().complaint(c3).oldStatus(ComplaintStatus.SUBMITTED).newStatus(ComplaintStatus.ASSIGNED).comment("Assigned to Electrical Dept (Wagle Estate Division)").updatedBy("Admin").build());

        Complaint c4 = Complaint.builder()
                .complaintNumber("CMP-2026-0004")
                .title("Contaminated and Murky Water Supply in Majiwada Housing Society")
                .description("Pipeline water has yellowish discoloration and mud particles since yesterday morning. Over 150 families affected. Immediate water testing and pipeline inspection required.")
                .category(ComplaintCategory.WATER_SUPPLY)
                .status(ComplaintStatus.UNDER_REVIEW)
                .priority(Priority.HIGH)
                .municipalCorporation(MunicipalCorporation.TMC)
                .location("Lodha Paradise complex, Majiwada Junction")
                .area("Majiwada, Thane West")
                .pincode("400601")
                .latitude(19.2183)
                .longitude(72.9781)
                .citizen(citizen2)
                .build();
        complaintRepository.save(c4);

        historyRepository.save(ComplaintHistory.builder().complaint(c4).oldStatus(null).newStatus(ComplaintStatus.SUBMITTED).comment("Complaint submitted online").updatedBy(citizen2.getName()).build());
        historyRepository.save(ComplaintHistory.builder().complaint(c4).oldStatus(ComplaintStatus.SUBMITTED).newStatus(ComplaintStatus.UNDER_REVIEW).comment("TMC Water Quality department notified").updatedBy("Admin").build());

        Complaint c5 = Complaint.builder()
                .complaintNumber("CMP-2026-0005")
                .title("Drainage Overflow and Choked Sewer near Kurla Station West")
                .description("Main stormwater chamber overflowing with sewage on station exit road. Pedestrians unable to walk towards auto stand.")
                .category(ComplaintCategory.DRAINAGE_AND_SEWAGE)
                .status(ComplaintStatus.RESOLVED)
                .priority(Priority.URGENT)
                .municipalCorporation(MunicipalCorporation.BMC)
                .location("Station Road, Near Platform 1 Exit")
                .area("Kurla West, Mumbai")
                .pincode("400070")
                .latitude(19.0657)
                .longitude(72.8793)
                .resolutionRemarks("Suction machine used to de-silt main sewer line. Disinfection powder spread.")
                .resolvedAt(LocalDateTime.now().minusDays(2))
                .citizen(citizen1)
                .department(deptDrainage)
                .assignedOfficer(off4)
                .build();
        complaintRepository.save(c5);

        historyRepository.save(ComplaintHistory.builder().complaint(c5).oldStatus(null).newStatus(ComplaintStatus.SUBMITTED).comment("Drainage complaint created").updatedBy(citizen1.getName()).build());
        historyRepository.save(ComplaintHistory.builder().complaint(c5).oldStatus(ComplaintStatus.SUBMITTED).newStatus(ComplaintStatus.ASSIGNED).comment("Assigned to Drainage Wing L-Ward").updatedBy("Admin").build());
        historyRepository.save(ComplaintHistory.builder().complaint(c5).oldStatus(ComplaintStatus.ASSIGNED).newStatus(ComplaintStatus.IN_PROGRESS).comment("Suction and jetting machine deployed").updatedBy(off4.getName()).build());
        historyRepository.save(ComplaintHistory.builder().complaint(c5).oldStatus(ComplaintStatus.IN_PROGRESS).newStatus(ComplaintStatus.RESOLVED).comment("Sewer blockage cleared and chamber sealed properly").updatedBy(off4.getName()).build());

        feedbackRepository.save(Feedback.builder().complaint(c5).rating(4).comment("Prompt response and cleanup. Good work by the municipal staff.").citizen(citizen1).build());

        Complaint c6 = Complaint.builder()
                .complaintNumber("CMP-2026-0006")
                .title("Fallen Tree Branch Blocking Lane near Shivaji Park")
                .description("Large banyan tree branch snapped during heavy winds and is partially blocking vehicular access on Cadell Road near gate 4.")
                .category(ComplaintCategory.TREE_AND_GARDEN)
                .status(ComplaintStatus.SUBMITTED)
                .priority(Priority.MEDIUM)
                .municipalCorporation(MunicipalCorporation.BMC)
                .location("Cadell Road, Shivaji Park Gate 4")
                .area("Dadar West, Mumbai")
                .pincode("400028")
                .latitude(19.0269)
                .longitude(72.8373)
                .citizen(citizen2)
                .build();
        complaintRepository.save(c6);

        historyRepository.save(ComplaintHistory.builder().complaint(c6).oldStatus(null).newStatus(ComplaintStatus.SUBMITTED).comment("Complaint registered by citizen").updatedBy(citizen2.getName()).build());

        Complaint c7 = Complaint.builder()
                .complaintNumber("CMP-2026-0007")
                .title("Unauthorized Construction in Private Society Compound")
                .description("Internal pathway dug up by building contractor without society general body resolution.")
                .category(ComplaintCategory.ILLEGAL_CONSTRUCTION)
                .status(ComplaintStatus.REJECTED)
                .priority(Priority.LOW)
                .municipalCorporation(MunicipalCorporation.BMC)
                .location("Green Acres Society, Chembur East")
                .area("Chembur, Mumbai")
                .pincode("400071")
                .latitude(19.0522)
                .longitude(72.9005)
                .rejectionReason("Issue is strictly internal to private housing society premises and outside municipal public domain jurisdiction. Advised to approach District Registrar of Housing Societies.")
                .citizen(citizen1)
                .department(deptBuilding)
                .build();
        complaintRepository.save(c7);

        historyRepository.save(ComplaintHistory.builder().complaint(c7).oldStatus(null).newStatus(ComplaintStatus.SUBMITTED).comment("Complaint registered online").updatedBy(citizen1.getName()).build());
        historyRepository.save(ComplaintHistory.builder().complaint(c7).oldStatus(ComplaintStatus.SUBMITTED).newStatus(ComplaintStatus.UNDER_REVIEW).comment("Reviewed by Ward Inspector").updatedBy("Admin").build());
        historyRepository.save(ComplaintHistory.builder().complaint(c7).oldStatus(ComplaintStatus.UNDER_REVIEW).newStatus(ComplaintStatus.REJECTED).comment("Rejected: Issue falls under private housing society jurisdiction").updatedBy("Admin").build());

        log.info("CivicConnect sample data loaded successfully with {} complaints!", complaintRepository.count());
    }
}
