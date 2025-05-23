## **Deployment Steps Summary**

### **Set up AWS Infrastructure and Services**

* Create VPC
* Create Subnets
* Create Internet Gateway
* Create Route Table
* Create Security Group
* Create EC2 Instance
* Create RDS
* Create S3 Bucket
* Create DynamoDB
* Create SQS Queue
* Create DLQ (Dead Letter Queue)
* Create Lambda Function (Task operations)
* Create Lambda Function (Notification handler)
* Create API Gateway
* Create Cognito User Pool

---

### **Set up VPC and Subnets**

* CIDR Block: `10.0.0.0/16`
* 2 Public Subnets in `us-east-1a` and `us-east-1b`
* 2 Private Subnets in `us-east-1a` and `us-east-1b`
* 5 Private RDS Subnets in `us-east-1a`, `us-east-1b`, `us-east-1c`, `us-east-1d`, and `us-east-1f`
* Attach Internet Gateway to VPC and route Public Subnets to it
* Enable Private Subnet access to S3 via VPC Endpoint (Gateway Type)

---

### **Set up Security Groups**

* Security Group for EC2 to access RDS
* Security Group for Lambda to access RDS and DynamoDB
* Inbound rules for EC2 (e.g., SSH, HTTP/HTTPS)
* Outbound rules to allow connections to S3, RDS, DynamoDB

---

### **Set up Frontend**

SSH into the EC2 instance and run:

```bash
sudo yum update -y
sudo yum install -y git
sudo yum install -y nodejs
sudo npm create vite@latest task-management-client -- --template react
cd task-management-client
npm install
npm run dev
```

* Update frontend config to use API Gateway URL and Cognito user pool ID
* Host frontend via EC2, S3 + CloudFront, or any static site solution (optional)

---

### **Configure Cognito User Pool and Registration**

* Create User Pool
* Create App Client (Type: SPA)
* Set callback and sign-out URLs
* Enable email verification (SES required)
* Configure triggers for user signup events

---

### **Configure User Insertion into RDS**

* Create **PostConfirmation Trigger** on Cognito

* Attach Lambda function that inserts new user info into RDS

* Add Lambda to RDS subnets and assign these roles:

  * `AmazonRDSDataFullAccess`
  * `AWSLambdaBasicExecutionRole`

* Add inline policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "ec2:CreateNetworkInterface",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DeleteNetworkInterface",
      "ec2:AssignPrivateIpAddresses",
      "ec2:UnassignPrivateIpAddresses"
    ],
    "Resource": "*"
  }]
}
```

* Implement logic in Lambda to parse event and insert into RDS

---

### **Configure API Gateway**

* Create REST API
* Define routes: `/tasks`, `/tasks/{id}`
* Integrate each route with corresponding Lambda function
* Enable CORS on all routes:

  * `Access-Control-Allow-Origin: *`
  * `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
  * `Access-Control-Allow-Headers: Content-Type, Authorization, X-Amz-Date, X-API-Key, X-Amz-Security-Token`

---

### **Configure Task Operations with Lambda, DynamoDB, and S3**

* Write Lambda logic for:

  * Create, Read, Update, Delete task
  * Upload and retrieve attachments from S3
  * Store task metadata in DynamoDB
  * Store relational links in RDS
* If task is updated:

  * Send message to SQS with task and user info as message body

---

### **Configure Asynchronous Notifications**

* Create SQS Queue (e.g., `TaskNotificationQueue`)
* Create **DLQ** (Dead Letter Queue) and associate it with the main SQS queue
* Create Lambda function to process messages from SQS
* Lambda logic:

  * Extract task and user info from event
  * Send notification (e.g., email via SES)
* Assign these roles:

  * `AmazonSQSFullAccess`
  * `AmazonSESFullAccess`
  * `AWSLambdaBasicExecutionRole`
* Enable retry and failure handling:

  * Configure retry settings in SQS trigger
  * Messages that fail multiple times are moved to DLQ for inspection

---

### **Configure SES (Email Service)**

* Verify sender email address (required in dev environment)
* Verify receiver email (for testing)
* For production: request SES production access to remove sandbox restrictions
* Use SES in notification Lambda to send user updates
---
### **Architecture diagram**:
![deepseek_mermaid_20250523_e4aa92](https://github.com/user-attachments/assets/a2434d2d-b479-474b-bb39-6683ee1ed72c)
---
# **User Guide**
**Deployed At**: [https://54.227.149.197:5173](https://54.227.149.197:5173)

---

## **1. Sign-Up and Login Process**

### **Sign-Up**
To create a new account:

- Navigate to: `https://54.227.149.197:5173/register`
- Fill in the required fields:
  - **Email**: Must be a valid, verified email address.
  - **Password**: Minimum 8 characters, including 1 uppercase letter and 1 number.
  - **First Name** and **Last Name**
  - **Phone Number**: Must follow international format `+[country code][number]` (e.g., `+201234567890`)
- Click **Create Account**

**System Behavior**:
- User is created in **AWS Cognito**
- A **Lambda** function stores user info in **PostgreSQL RDS**
- Confirmation email sent via **Amazon SES**

### **Login**
To access your account:

- Visit: `https://54.227.149.197:5173/login`
- Enter your email and password
- Click **Sign In**

**System Behavior**:
- Authenticated through **Cognito User Pool**
- JWT token generated and stored in the browser
- Redirected to `/dashboard`

---

## **2. Creating a Task**

To create a new task:

- From Dashboard, click **+ New Task**
- Complete the task form:
  - **Title**: Short, descriptive (e.g., "Deploy AWS Lambda")
  - **Description**: Detailed explanation (Markdown supported)
  - **Status**:
    - Pending (default)
    - In Progress
    - Completed
  - **Priority**:
    - Low (blue)
    - Medium (orange)
    - High (red)
  - **Due Date**: Use calendar widget
  - **Attachments**:
    - PDF, DOCX, JPG, PNG
    - Max size: 5MB per file
    - Max files: 5 (total 25MB)
- Click **Save Task**

**Backend Behavior**:
- Task saved to **DynamoDB**
- Files uploaded to **S3** bucket `task-files-uploads` via pre-signed URLs

---

## **3. Viewing and Updating Tasks**

### **Viewing Tasks**
To view task details:

- Click any task from Dashboard
- Displays:
  - Description (rendered with Markdown)
  - Color-coded priority badge
  - Countdown to due date (e.g., "Due in 3 days")
  - Downloadable attachment thumbnails

### **Editing Tasks**
To edit a task:

- Click **Edit** in task detail view
- Modify any fields as needed
- If status is set to **Completed**:
  - Sends message to **Amazon SQS**
  - Triggers email notification via **SES**
- Click **Update** to save changes

---

## **4. Task Analytics**

To access analytics:

- Navigate to **Analytics** tab
- Includes:
  - **Completion Rate**: % of tasks by status
  - **Priority Distribution**: Horizontal bar chart by priority
  - **Overdue Tasks**: Highlighted in red

---

## **5. Task Calendar**

To manage tasks via calendar:

- Go to **Calendar** tab
- Features:
  - **Monthly View**: Tasks shown by due date, color-coded
  - **Day Click**: View tasks due on selected day
  - **Drag and Drop**: Reschedule by dragging task to new date

---

## **6. User Profile Management**

To view/manage profile:

- Click profile icon (top-right) → select **Profile**
- Displays:
  - Personal/account data from **Cognito** and **PostgreSQL RDS**
  - List of active sessions

---

## **7. System Requirements and Notes**

| Category         | Requirements / Details                                           |
|------------------|------------------------------------------------------------------|
| **Browser Support**  | Chrome 90+, Firefox 88+, Safari 14+                             |
| **File Attachments** | Max 5 files per task, up to 5MB each (25MB total)              |
| **Security**         | JWT auto-refreshes every 30 minutes                            |
| **S3 Storage**       | Public access blocked at bucket level                          |

---

## **8. Troubleshooting**

| Issue                 | Solution                                                     |
|-----------------------|--------------------------------------------------------------|
| **"Invalid Token"**   | Log out and log back in                                      |
| **Upload Fails**      | Check file type (PDF, DOCX, JPG, PNG) and size (≤5MB)        |
| **Calendar Not Loading** | Ensure third-party cookies are enabled in your browser settings |

---

## **Direct Links**

- **Register**: [https://54.227.149.197:5173/register](https://54.227.149.197:5173/register)
- **Login**: [https://54.227.149.197:5173/login](https://54.227.149.197:5173/login)
