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

