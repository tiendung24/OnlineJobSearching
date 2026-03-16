
CREATE DATABASE JobOnlineDB;
GO
USE JobOnlineDB;
GO


-- Bảng Roles: Quản lý phân quyền
CREATE TABLE Roles (
    RoleID INT IDENTITY(1,1) PRIMARY KEY,
    RoleName VARCHAR(50) NOT NULL UNIQUE -- Admin, JobSeeker, Employer
);

-- Bảng Users: Quản lý tài khoản chung
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    RoleID INT NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    IsActive BIT DEFAULT 1, -- Admin có thể khóa (0)
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);

-- Bảng JobSeekers: Hồ sơ người tìm việc
CREATE TABLE JobSeekers (
    JobSeekerID INT PRIMARY KEY, 
    FullName NVARCHAR(100) NOT NULL,
    Phone VARCHAR(20),
    Address NVARCHAR(255),
    AvatarUrl NVARCHAR(500),
    FOREIGN KEY (JobSeekerID) REFERENCES Users(UserID)
);

-- Bảng Companies: Thông tin công ty (Gắn với tài khoản Employer)
CREATE TABLE Companies (
    CompanyID INT IDENTITY(1,1) PRIMARY KEY,
    EmployerID INT NOT NULL UNIQUE, -- 1 Employer quản lý 1 Company
    CompanyName NVARCHAR(255) NOT NULL,
    TaxCode VARCHAR(50) UNIQUE,
    Address NVARCHAR(255),
    Description NVARCHAR(MAX),
    LogoUrl NVARCHAR(500),
    Size NVARCHAR(50), -- Vd: 10-50 nhân viên
    IsProfileComplete BIT DEFAULT 0, -- Ràng buộc: =1 mới được đăng Job
    FOREIGN KEY (EmployerID) REFERENCES Users(UserID)
);

-- Bảng CVs: Quản lý CV của JobSeeker
CREATE TABLE CVs (
    CVID INT IDENTITY(1,1) PRIMARY KEY,
    JobSeekerID INT NOT NULL,
    CVName NVARCHAR(100) NOT NULL,
    FilePath NVARCHAR(500) NOT NULL,
    IsDefault BIT DEFAULT 0,
    IsDeleted BIT DEFAULT 0, -- Soft delete để không ảnh hưởng lịch sử ứng tuyển
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (JobSeekerID) REFERENCES JobSeekers(JobSeekerID)
);

-- Bảng Jobs: Tin tuyển dụng
CREATE TABLE Jobs (
    JobID INT IDENTITY(1,1) PRIMARY KEY,
    CompanyID INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    SalaryRange NVARCHAR(100), -- Vd: 10M - 15M / Thương lượng
    Location NVARCHAR(100), -- Tỉnh/Thành phố
    Level NVARCHAR(50), -- Intern, Fresher, Junior, Senior
    JobType NVARCHAR(50), -- Full-time, Part-time, Remote
    Industry NVARCHAR(100),
    Status VARCHAR(50) DEFAULT 'Pending Approval', -- Pending Approval, Published, Closed/Expired, Locked
    CreatedAt DATETIME DEFAULT GETDATE(),
    ExpiredAt DATETIME NOT NULL,
    FOREIGN KEY (CompanyID) REFERENCES Companies(CompanyID)
);

-- Bảng SavedJobs: Việc làm đã lưu
CREATE TABLE SavedJobs (
    JobSeekerID INT NOT NULL,
    JobID INT NOT NULL,
    SavedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (JobSeekerID, JobID),
    FOREIGN KEY (JobSeekerID) REFERENCES JobSeekers(JobSeekerID),
    FOREIGN KEY (JobID) REFERENCES Jobs(JobID)
);

-- Bảng Applications: Đơn ứng tuyển
CREATE TABLE Applications (
    ApplicationID INT IDENTITY(1,1) PRIMARY KEY,
    JobID INT NOT NULL,
    JobSeekerID INT NOT NULL,
    CVID INT NOT NULL, -- CV được chọn khi ứng tuyển
    CoverLetter NVARCHAR(MAX),
    Status VARCHAR(50) DEFAULT 'Sent/Pending', -- Sent/Pending, Viewed, Interviewing, Rejected, Hired/Approved
    AppliedAt DATETIME DEFAULT GETDATE(),
    EmployerNote NVARCHAR(500), -- Lời nhắn từ NTD (Lý do từ chối / Hẹn PV)
    FOREIGN KEY (JobID) REFERENCES Jobs(JobID),
    FOREIGN KEY (JobSeekerID) REFERENCES JobSeekers(JobSeekerID),
    FOREIGN KEY (CVID) REFERENCES CVs(CVID),
    CONSTRAINT UQ_JobSeeker_Job UNIQUE (JobSeekerID, JobID) -- Ràng buộc: 1 người không ứng tuyển 1 job 2 lần
);

-- Bảng Employees: Quản lý nhân sự đã trúng tuyển
CREATE TABLE Employees (
    EmployeeID INT IDENTITY(1,1) PRIMARY KEY,
    CompanyID INT NOT NULL,
    JobSeekerID INT NOT NULL,
    JobID INT NOT NULL, -- Trúng tuyển từ Job nào
    Status VARCHAR(50) DEFAULT 'Active', -- Active, Resigned, Terminated
    HiredDate DATETIME DEFAULT GETDATE(),
    EndDate DATETIME NULL,
    FOREIGN KEY (CompanyID) REFERENCES Companies(CompanyID),
    FOREIGN KEY (JobSeekerID) REFERENCES JobSeekers(JobSeekerID),
    FOREIGN KEY (JobID) REFERENCES Jobs(JobID)
);


-- Insert Roles
INSERT INTO Roles (RoleName) VALUES ('Admin'), ('JobSeeker'), ('Employer');

-- Insert Users (Password đang để text thường cho dễ nhìn, thực tế bạn phải băm - Hash)
INSERT INTO Users (RoleID, Email, PasswordHash) VALUES 
(1, 'admin@gmail.com', '123456'),
(2, 'jobseeker@gmail.com', '123456'), -- JobSeeker 1
(3, 'hr@gmail.com', '123456');   -- Employer 2

-- Insert JobSeekers Profiles (ID 2 và 3 từ bảng Users)
INSERT INTO JobSeekers (JobSeekerID, FullName, Phone, Address) VALUES 
(2, N'Nguyễn Văn A', '0901234567', N'Hà Nội'),
(3, N'Trần Thị B', '0987654321', N'TP. Hồ Chí Minh');

-- Insert Companies (ID 4 và 5 từ bảng Users)
INSERT INTO Companies (EmployerID, CompanyName, TaxCode, Address, Description, Size, IsProfileComplete) VALUES 
(4, N'FPT Software', '0101234567', N'Khu CNC Hòa Lạc, Hà Nội', N'Công ty công nghệ hàng đầu', '1000+', 1),
(5, N'VNG Corporation', '0301234567', N'Quận 7, TP.HCM', N'Kỳ lân công nghệ VN', '500-1000', 1);

-- Insert CVs
INSERT INTO CVs (JobSeekerID, CVName, FilePath, IsDefault) VALUES 
(2, 'CV_Backend_Dev.pdf', '/uploads/cv/user2_cv1.pdf', 1),
(3, 'CV_Marketing.pdf', '/uploads/cv/user3_cv1.pdf', 1),
(3, 'CV_Sales.pdf', '/uploads/cv/user3_cv2.pdf', 0);

-- Insert Jobs (Công ty FPT = ID 1, VNG = ID 2)
INSERT INTO Jobs (CompanyID, Title, Description, SalaryRange, Location, Level, JobType, Industry, Status, ExpiredAt) VALUES 
(1, N'Lập trình viên Java Backend', N'Yêu cầu 2 năm kinh nghiệm Spring Boot', N'15M - 25M', N'Hà Nội', 'Junior', 'Full-time', 'IT', 'Published', '2026-04-30'),
(1, N'Fresher ReactJS', N'Tuyển sinh viên mới ra trường', N'Thỏa thuận', N'Hà Nội', 'Fresher', 'Full-time', 'IT', 'Pending Approval', '2026-05-15'),
(2, N'Chuyên viên Digital Marketing', N'Chạy Ads, lên plan social', N'20M - 30M', N'TP. Hồ Chí Minh', 'Senior', 'Full-time', 'Marketing', 'Published', '2026-04-20');

-- Insert Saved Jobs (Nguyễn Văn A lưu Job Java của FPT)
INSERT INTO SavedJobs (JobSeekerID, JobID) VALUES (2, 1);

-- Insert Applications
-- 1. Nguyễn Văn A nộp Java Backend (FPT) -> NTD đã xem
INSERT INTO Applications (JobID, JobSeekerID, CVID, CoverLetter, Status, AppliedAt) 
VALUES (1, 2, 1, N'Em rất mong muốn được làm việc tại công ty', 'Viewed', GETDATE()-2);

-- 2. Trần Thị B nộp Digital Marketing (VNG) -> Đã trúng tuyển
INSERT INTO Applications (JobID, JobSeekerID, CVID, CoverLetter, Status, AppliedAt, EmployerNote) 
VALUES (3, 3, 2, N'Gửi quý công ty CV của em', 'Hired/Approved', GETDATE()-10, N'Chào mừng bạn gia nhập VNG!');

-- Insert Employees (Hệ quả của việc Trần Thị B trúng tuyển tại VNG)
-- CompanyID = 2 (VNG), JobSeekerID = 3 (Trần Thị B), JobID = 3
INSERT INTO Employees (CompanyID, JobSeekerID, JobID, Status, HiredDate) 
VALUES (2, 3, 3, 'Active', GETDATE()-1);