# FUNDAMENTAL OF ACTIVE DIRECTORY DOMAIN SERVICES – ATTENDEE PREPARATION GUIDE
**Instructor:** THANYAPON SANANAKIN

## 1. Lab Network Diagram
โครงสร้างเครือข่ายสำหรับทำ Lab (เชื่อมต่อกันผ่าน Hypervisor Internal Network):
*   **Host Computer:** สามารถเชื่อมต่อ Internet หรือ Host External Network ได้ (Optional)
*   **Virtual Machine - Server (Windows Server 2019):**
    *   `LAB-DC01` : IP 192.168.10.10
    *   `LAB-DC02` : IP 192.168.10.11
    *   `LAB-SPARE` : IP 192.168.10.12
*   **Virtual Machine - Client (Windows 10/11 Pro):**
    *   `LAB-CLIENT` : IP 192.168.10.100

---

## 2. PREPARING VM HOST ON AZURE
การเตรียมความพร้อมสำหรับ Host บน Azure สำหรับการทำ Nested Virtualization:
*   **Deploy ARM Template:** 
    *   ใช้ Sample Code จาก Microsoft Developer Tools โดยเลือก Template "Hyper-V Host Virtual Machine with nested VMs"
*   **VM Size Configuration:**
    *   Deploy ด้วยพารามิเตอร์เริ่มต้น (Default) แต่ให้เปลี่ยนขนาด VM Size เป็น **E4s_v3** หรือ **Standard E4ds v5** (4 vCPU, RAM 32 GB)
*   **In-place Upgrade (Windows Server 2016 to Windows Server 2022):**
    *   Install All Windows Updates
    *   Create In-place Upgrade Media disk จากนั้นทำการ Attach Media Disk เข้ากับ VM
    *   ใช้คำสั่งผ่าน Command/PowerShell: `.\Setup.exe /auto upgrade /dynamicupdate disable`
    *   เลือก Image เป็น *Windows Server 2022 Datacenter (Desktop Experience)* และเลือกเก็บไฟล์ตั้งค่าไว้ (Keep files, settings, and apps)

---

## 3. PREPARING WINDOWS SERVER 2019 VM
การเตรียมความพร้อมสำหรับเครื่อง VM ที่ใช้ Windows Server 2019:
*   **Download ISO/VHD:** ดาวน์โหลดไฟล์ Windows Server 2019 ISO File หรือ VHD สำหรับ Hyper-V
*   **Windows Server Configurations (การตั้งค่าระบบ):**
    *   Time Zone (GMT +7.00)
    *   Set time to current time
    *   Computer Name
    *   IP Address
    *   Disable IPv6
    *   Sysprep (หากจำเป็นต้อง copy harddisk) เครื่องมืออยู่ที่ `C:\windows\system32\sysprep` โดยเลือก System Cleanup Action เป็น OOBE และกด Generalize
*   **Windows Server Administrative Template:** ดาวน์โหลด Administrative Templates (.admx) สำหรับ Windows 11 (25H2)

---

## 4. PREPARING WINDOWS 11 CLIENT VM FOR HYPER-V
การเตรียมความพร้อมสำหรับเครื่อง VM Client (Windows 11):
*   **Supported Client Guest Operating Systems:**
    *   Maximum number of virtual processors: 32
    *   Integration Services: Built-in
    *   ระบบต้องการฟีเจอร์ Generation 2 virtual machine
    *   *หมายเหตุ:* Windows 11 ต้องการ CPU instruction สำหรับการติดตั้งและการบูต (POPCNT และ SSE4.2) อาจต้องเข้าไป Disable processor compatibility เพื่อให้รองรับฟีเจอร์เหล่านี้
*   **Download ISO:** ดาวน์โหลดไฟล์ Windows 11 Enterprise ISO
*   **Hyper-V VM Configurations:**
    *   Specify Generation: เลือกเป็น **Generation 2**
    *   Security: ติ๊กเลือก **Enable Trusted Platform Module** (TPM)
*   **Client Configurations (การตั้งค่าเครื่อง Client):**
    *   Use Local account
    *   Time Zone (GMT +7.00)
    *   Set time to current time
    *   Computer Name
    *   IP Address
    *   Disable IPv6
