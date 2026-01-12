-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "nickname" TEXT,
    "name" TEXT,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "avatar" TEXT,
    "socialProfile" TEXT,
    "mobile" TEXT,
    "address" TEXT,
    "postalCode" TEXT,
    "city" TEXT,
    "country" TEXT DEFAULT 'Kenya',
    "email" TEXT,
    "about" TEXT,
    "nationalId" TEXT,
    "password" TEXT,
    "passwordSalt" TEXT,
    "apiToken" TEXT,
    "signature" TEXT,
    "profileImage" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "isClerk" BOOLEAN NOT NULL DEFAULT false,
    "isOfficer" BOOLEAN NOT NULL DEFAULT false,
    "isManager" BOOLEAN NOT NULL DEFAULT false,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isGlobalClerk" BOOLEAN NOT NULL DEFAULT false,
    "isGlobalOfficer" BOOLEAN NOT NULL DEFAULT false,
    "isGlobalManager" BOOLEAN NOT NULL DEFAULT false,
    "isGlobalAdmin" BOOLEAN NOT NULL DEFAULT false,
    "otp" TEXT,
    "otpSecondary" TEXT,
    "otpVerified" BOOLEAN NOT NULL DEFAULT false,
    "multiFactor" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" TIMESTAMP(3),
    "referralCode" TEXT,
    "receiveMessages" BOOLEAN NOT NULL DEFAULT true,
    "details" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT,
    "userId" TEXT NOT NULL,
    "isTrial" BOOLEAN NOT NULL DEFAULT true,
    "trialExpiresAt" TIMESTAMP(3),
    "accountType" TEXT DEFAULT 'basic',
    "smsCredits" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "whatsappCredits" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "voiceCredits" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "safaricomCredits" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "airtelCredits" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "telkomCredits" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Nairobi',
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "defaultSenderId" TEXT,
    "webhookUrl" TEXT,
    "webhookSecret" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "suspensionReason" TEXT,
    "details" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ShortCode" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "provider" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShortCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Alphanumeric" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "description" TEXT,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alphanumeric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SmsMessage" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "campaignId" TEXT,
    "templateId" TEXT,
    "alphanumericId" TEXT,
    "shortCodeId" TEXT,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'text',
    "messageParts" INTEGER NOT NULL DEFAULT 1,
    "channel" TEXT NOT NULL DEFAULT 'sms',
    "provider" TEXT NOT NULL,
    "telco" TEXT,
    "networkCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "statusCode" TEXT,
    "deliveryStatus" TEXT,
    "deliveryDescription" TEXT,
    "direction" TEXT NOT NULL DEFAULT 'outbound',
    "providerMessageId" TEXT,
    "providerResponse" TEXT,
    "providerTimestamp" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "cost" DECIMAL(10,4),
    "price" DECIMAL(10,4),
    "priceUnit" TEXT DEFAULT 'KES',
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "bulkId" TEXT,
    "groupId" TEXT,
    "correlationId" TEXT,
    "traceId" TEXT,
    "apiVersion" TEXT,
    "userAgent" TEXT,
    "sourceIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SmsMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ScheduledSms" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "campaignId" TEXT,
    "templateId" TEXT,
    "alphanumericId" TEXT,
    "shortCodeId" TEXT,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'text',
    "messageParts" INTEGER NOT NULL DEFAULT 1,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Nairobi',
    "channel" TEXT NOT NULL DEFAULT 'sms',
    "provider" TEXT NOT NULL,
    "telco" TEXT,
    "networkCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "statusCode" TEXT,
    "providerMessageId" TEXT,
    "providerResponse" TEXT,
    "providerTimestamp" TIMESTAMP(3),
    "executedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "cost" DECIMAL(10,4),
    "price" DECIMAL(10,4),
    "priceUnit" TEXT DEFAULT 'KES',
    "bulkId" TEXT,
    "groupId" TEXT,
    "correlationId" TEXT,
    "apiVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledSms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SmsCallback" (
    "id" TEXT NOT NULL,
    "smsMessageId" TEXT NOT NULL,
    "callbackType" TEXT NOT NULL,
    "providerMessageId" TEXT,
    "status" TEXT,
    "statusCode" TEXT,
    "description" TEXT,
    "networkCode" TEXT,
    "telco" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "providerTimestamp" TIMESTAMP(3),
    "rawData" JSONB,

    CONSTRAINT "SmsCallback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WhatsappAccount" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "businessVerificationStatus" TEXT,
    "webhookUrl" TEXT,
    "webhookVerifyToken" TEXT,
    "accessToken" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsappAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WhatsappPhoneNumber" (
    "id" TEXT NOT NULL,
    "whatsappAccountId" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" TEXT,
    "webhookUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsappPhoneNumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WhatsappTemplate" (
    "id" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "headerType" TEXT,
    "headerText" TEXT,
    "bodyText" TEXT NOT NULL,
    "footerText" TEXT,
    "buttons" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsappTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WhatsappMessage" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "whatsappAccountId" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "templateId" TEXT,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "messageType" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "templateName" TEXT,
    "templateLanguage" TEXT,
    "templateParameters" JSONB,
    "mediaId" TEXT,
    "mediaUrl" TEXT,
    "mediaCaption" TEXT,
    "mediaFilename" TEXT,
    "mediaMimeType" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "locationName" TEXT,
    "locationAddress" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "statusCode" TEXT,
    "statusDescription" TEXT,
    "providerMessageId" TEXT,
    "providerResponse" JSONB,
    "providerTimestamp" TIMESTAMP(3),
    "pricingCategory" TEXT,
    "cost" DECIMAL(10,4),
    "whatsappFee" DECIMAL(10,4),
    "platformFee" DECIMAL(10,4),
    "totalCost" DECIMAL(10,4),
    "currency" TEXT DEFAULT 'USD',
    "conversationId" TEXT,
    "conversationOrigin" TEXT,
    "contextMessageId" TEXT,
    "expirationTimestamp" TEXT,
    "isBillable" BOOLEAN NOT NULL DEFAULT true,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsappMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContactList" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "totalContacts" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contactListId" TEXT,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "fullName" TEXT,
    "mobile" TEXT NOT NULL,
    "email" TEXT,
    "jobTitle" TEXT,
    "company" TEXT,
    "department" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'Kenya',
    "address" TEXT,
    "postalCode" TEXT,
    "preferredLanguage" TEXT DEFAULT 'en',
    "timezone" TEXT DEFAULT 'Africa/Nairobi',
    "isOptedOut" BOOLEAN NOT NULL DEFAULT false,
    "optedOutAt" TIMESTAMP(3),
    "optOutReason" TEXT,
    "optOutMethod" TEXT,
    "isStarred" BOOLEAN NOT NULL DEFAULT false,
    "isSpam" BOOLEAN NOT NULL DEFAULT false,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "isExcluded" BOOLEAN NOT NULL DEFAULT false,
    "mobileVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "customFields" JSONB,
    "tags" TEXT[],
    "notes" TEXT,
    "source" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Campaign" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'sms',
    "goal" TEXT,
    "audience" TEXT,
    "contactListIds" TEXT[],
    "filters" JSONB,
    "maxBudget" DECIMAL(20,2),
    "maxMessages" INTEGER,
    "dailyLimit" INTEGER,
    "scheduledAt" TIMESTAMP(3),
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Nairobi',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "totalSent" INTEGER NOT NULL DEFAULT 0,
    "totalDelivered" INTEGER NOT NULL DEFAULT 0,
    "totalFailed" INTEGER NOT NULL DEFAULT 0,
    "totalCost" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Template" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "messageType" TEXT NOT NULL DEFAULT 'sms',
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "variables" TEXT[],
    "category" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "isValidated" BOOLEAN NOT NULL DEFAULT false,
    "validationErrors" TEXT[],
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentMethod" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "configuration" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "transactionId" TEXT,
    "paymentMethodId" TEXT NOT NULL,
    "paymentStatusId" TEXT NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "description" TEXT,
    "safaricomAmount" DECIMAL(20,2),
    "airtelAmount" DECIMAL(20,2),
    "telkomAmount" DECIMAL(20,2),
    "internationalAmount" DECIMAL(20,2),
    "creditsAllocated" DECIMAL(20,2),
    "unitCost" DECIMAL(20,4),
    "packageId" TEXT,
    "creditType" TEXT,
    "transactionRef" TEXT,
    "providerRef" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "responseCode" TEXT,
    "responseMessage" TEXT,
    "providerResponse" JSONB,
    "expiryDate" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaybillAccount" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "businessShortCode" TEXT NOT NULL,
    "accountNumber" TEXT,
    "accountName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "consumerKey" TEXT NOT NULL,
    "consumerSecret" TEXT NOT NULL,
    "passkey" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaybillAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MpesaTransaction" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "paybillAccountId" TEXT,
    "transactionType" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "transactionTime" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "businessShortCode" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "accountReference" TEXT,
    "billRefNumber" TEXT,
    "firstName" TEXT,
    "middleName" TEXT,
    "lastName" TEXT,
    "merchantRequestId" TEXT,
    "checkoutRequestId" TEXT,
    "resultCode" TEXT,
    "resultDescription" TEXT,
    "responseCode" TEXT,
    "responseDescription" TEXT,
    "customerMessage" TEXT,
    "orgAccountBalance" DECIMAL(20,2),
    "creditBalance" DECIMAL(20,2),
    "sozuriCreditBalance" DECIMAL(20,2),
    "autoRecharge" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isParent" BOOLEAN NOT NULL DEFAULT false,
    "rawData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MpesaTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TransactionType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TransactionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionTypeId" TEXT NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "description" TEXT,
    "reference" TEXT,
    "creditsAmount" DECIMAL(20,2),
    "creditType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TopupProduct" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "creditAmount" DECIMAL(20,2) NOT NULL,
    "price" DECIMAL(20,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "creditType" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopupProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Topup" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "campaignId" TEXT,
    "transactionId" TEXT,
    "topupProductId" TEXT NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "creditsAmount" DECIMAL(20,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MessageLog" (
    "id" TEXT NOT NULL,
    "messageId" TEXT,
    "projectId" TEXT,
    "campaignId" TEXT,
    "templateId" TEXT,
    "userId" TEXT NOT NULL,
    "messageType" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "deliveryStatus" TEXT,
    "cost" DECIMAL(10,4),
    "currency" TEXT DEFAULT 'KES',
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Webhook" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "events" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "secret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WebhookDelivery" (
    "id" TEXT NOT NULL,
    "webhookId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL,
    "responseCode" INTEGER,
    "responseBody" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "nextRetryAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Integration" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "config" JSONB NOT NULL,
    "isConnected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApiKey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "permissions" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LogEntry" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "context" JSONB,
    "source" TEXT,
    "userId" TEXT,
    "requestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Referral" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reward" DECIMAL(20,2),
    "rewardType" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Collaboration" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "permissions" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "Collaboration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Assignment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskType" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Automation" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "triggerType" TEXT NOT NULL,
    "triggerConfig" JSONB NOT NULL,
    "actionType" TEXT NOT NULL,
    "actionConfig" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastTriggered" TIMESTAMP(3),
    "executionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Automation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "public"."Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "public"."Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_resource_action_key" ON "public"."Permission"("resource", "action");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "public"."UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "public"."RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "public"."User"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_nationalId_key" ON "public"."User"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "User_apiToken_key" ON "public"."User"("apiToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "public"."User"("referralCode");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_mobile_idx" ON "public"."User"("mobile");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "public"."User"("isActive");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "public"."User"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Project_name_key" ON "public"."Project"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Project_code_key" ON "public"."Project"("code");

-- CreateIndex
CREATE INDEX "Project_userId_idx" ON "public"."Project"("userId");

-- CreateIndex
CREATE INDEX "Project_isActive_idx" ON "public"."Project"("isActive");

-- CreateIndex
CREATE INDEX "Project_isTrial_idx" ON "public"."Project"("isTrial");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "public"."Project"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ShortCode_code_key" ON "public"."ShortCode"("code");

-- CreateIndex
CREATE INDEX "ShortCode_projectId_idx" ON "public"."ShortCode"("projectId");

-- CreateIndex
CREATE INDEX "ShortCode_provider_idx" ON "public"."ShortCode"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "Alphanumeric_senderId_key" ON "public"."Alphanumeric"("senderId");

-- CreateIndex
CREATE INDEX "Alphanumeric_projectId_idx" ON "public"."Alphanumeric"("projectId");

-- CreateIndex
CREATE INDEX "Alphanumeric_provider_idx" ON "public"."Alphanumeric"("provider");

-- CreateIndex
CREATE INDEX "Alphanumeric_status_idx" ON "public"."Alphanumeric"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SmsMessage_messageId_key" ON "public"."SmsMessage"("messageId");

-- CreateIndex
CREATE INDEX "SmsMessage_messageId_idx" ON "public"."SmsMessage"("messageId");

-- CreateIndex
CREATE INDEX "SmsMessage_projectId_idx" ON "public"."SmsMessage"("projectId");

-- CreateIndex
CREATE INDEX "SmsMessage_status_idx" ON "public"."SmsMessage"("status");

-- CreateIndex
CREATE INDEX "SmsMessage_deliveryStatus_idx" ON "public"."SmsMessage"("deliveryStatus");

-- CreateIndex
CREATE INDEX "SmsMessage_provider_idx" ON "public"."SmsMessage"("provider");

-- CreateIndex
CREATE INDEX "SmsMessage_to_idx" ON "public"."SmsMessage"("to");

-- CreateIndex
CREATE INDEX "SmsMessage_from_idx" ON "public"."SmsMessage"("from");

-- CreateIndex
CREATE INDEX "SmsMessage_createdAt_idx" ON "public"."SmsMessage"("createdAt");

-- CreateIndex
CREATE INDEX "SmsMessage_scheduledAt_idx" ON "public"."SmsMessage"("scheduledAt");

-- CreateIndex
CREATE INDEX "SmsMessage_sentAt_idx" ON "public"."SmsMessage"("sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduledSms_messageId_key" ON "public"."ScheduledSms"("messageId");

-- CreateIndex
CREATE INDEX "ScheduledSms_messageId_idx" ON "public"."ScheduledSms"("messageId");

-- CreateIndex
CREATE INDEX "ScheduledSms_projectId_idx" ON "public"."ScheduledSms"("projectId");

-- CreateIndex
CREATE INDEX "ScheduledSms_status_idx" ON "public"."ScheduledSms"("status");

-- CreateIndex
CREATE INDEX "ScheduledSms_scheduledAt_idx" ON "public"."ScheduledSms"("scheduledAt");

-- CreateIndex
CREATE INDEX "ScheduledSms_provider_idx" ON "public"."ScheduledSms"("provider");

-- CreateIndex
CREATE INDEX "ScheduledSms_to_idx" ON "public"."ScheduledSms"("to");

-- CreateIndex
CREATE INDEX "ScheduledSms_createdAt_idx" ON "public"."ScheduledSms"("createdAt");

-- CreateIndex
CREATE INDEX "SmsCallback_smsMessageId_idx" ON "public"."SmsCallback"("smsMessageId");

-- CreateIndex
CREATE INDEX "SmsCallback_providerMessageId_idx" ON "public"."SmsCallback"("providerMessageId");

-- CreateIndex
CREATE INDEX "SmsCallback_receivedAt_idx" ON "public"."SmsCallback"("receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsappAccount_accountId_key" ON "public"."WhatsappAccount"("accountId");

-- CreateIndex
CREATE INDEX "WhatsappAccount_projectId_idx" ON "public"."WhatsappAccount"("projectId");

-- CreateIndex
CREATE INDEX "WhatsappAccount_status_idx" ON "public"."WhatsappAccount"("status");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsappPhoneNumber_phoneNumberId_key" ON "public"."WhatsappPhoneNumber"("phoneNumberId");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsappPhoneNumber_phoneNumber_key" ON "public"."WhatsappPhoneNumber"("phoneNumber");

-- CreateIndex
CREATE INDEX "WhatsappPhoneNumber_whatsappAccountId_idx" ON "public"."WhatsappPhoneNumber"("whatsappAccountId");

-- CreateIndex
CREATE INDEX "WhatsappPhoneNumber_phoneNumber_idx" ON "public"."WhatsappPhoneNumber"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsappTemplate_templateId_key" ON "public"."WhatsappTemplate"("templateId");

-- CreateIndex
CREATE INDEX "WhatsappTemplate_phoneNumberId_idx" ON "public"."WhatsappTemplate"("phoneNumberId");

-- CreateIndex
CREATE INDEX "WhatsappTemplate_status_idx" ON "public"."WhatsappTemplate"("status");

-- CreateIndex
CREATE INDEX "WhatsappTemplate_category_idx" ON "public"."WhatsappTemplate"("category");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsappMessage_messageId_key" ON "public"."WhatsappMessage"("messageId");

-- CreateIndex
CREATE INDEX "WhatsappMessage_messageId_idx" ON "public"."WhatsappMessage"("messageId");

-- CreateIndex
CREATE INDEX "WhatsappMessage_projectId_idx" ON "public"."WhatsappMessage"("projectId");

-- CreateIndex
CREATE INDEX "WhatsappMessage_whatsappAccountId_idx" ON "public"."WhatsappMessage"("whatsappAccountId");

-- CreateIndex
CREATE INDEX "WhatsappMessage_phoneNumberId_idx" ON "public"."WhatsappMessage"("phoneNumberId");

-- CreateIndex
CREATE INDEX "WhatsappMessage_status_idx" ON "public"."WhatsappMessage"("status");

-- CreateIndex
CREATE INDEX "WhatsappMessage_direction_idx" ON "public"."WhatsappMessage"("direction");

-- CreateIndex
CREATE INDEX "WhatsappMessage_messageType_idx" ON "public"."WhatsappMessage"("messageType");

-- CreateIndex
CREATE INDEX "WhatsappMessage_to_idx" ON "public"."WhatsappMessage"("to");

-- CreateIndex
CREATE INDEX "WhatsappMessage_from_idx" ON "public"."WhatsappMessage"("from");

-- CreateIndex
CREATE INDEX "WhatsappMessage_createdAt_idx" ON "public"."WhatsappMessage"("createdAt");

-- CreateIndex
CREATE INDEX "WhatsappMessage_sentAt_idx" ON "public"."WhatsappMessage"("sentAt");

-- CreateIndex
CREATE INDEX "ContactList_projectId_idx" ON "public"."ContactList"("projectId");

-- CreateIndex
CREATE INDEX "ContactList_isActive_idx" ON "public"."ContactList"("isActive");

-- CreateIndex
CREATE INDEX "Contact_projectId_idx" ON "public"."Contact"("projectId");

-- CreateIndex
CREATE INDEX "Contact_userId_idx" ON "public"."Contact"("userId");

-- CreateIndex
CREATE INDEX "Contact_mobile_idx" ON "public"."Contact"("mobile");

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "public"."Contact"("email");

-- CreateIndex
CREATE INDEX "Contact_isOptedOut_idx" ON "public"."Contact"("isOptedOut");

-- CreateIndex
CREATE INDEX "Contact_isActive_idx" ON "public"."Contact"("isActive");

-- CreateIndex
CREATE INDEX "Contact_createdAt_idx" ON "public"."Contact"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_mobile_projectId_key" ON "public"."Contact"("mobile", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_projectId_key" ON "public"."Contact"("email", "projectId");

-- CreateIndex
CREATE INDEX "Campaign_projectId_idx" ON "public"."Campaign"("projectId");

-- CreateIndex
CREATE INDEX "Campaign_status_idx" ON "public"."Campaign"("status");

-- CreateIndex
CREATE INDEX "Campaign_type_idx" ON "public"."Campaign"("type");

-- CreateIndex
CREATE INDEX "Campaign_scheduledAt_idx" ON "public"."Campaign"("scheduledAt");

-- CreateIndex
CREATE INDEX "Campaign_createdAt_idx" ON "public"."Campaign"("createdAt");

-- CreateIndex
CREATE INDEX "Template_projectId_idx" ON "public"."Template"("projectId");

-- CreateIndex
CREATE INDEX "Template_messageType_idx" ON "public"."Template"("messageType");

-- CreateIndex
CREATE INDEX "Template_category_idx" ON "public"."Template"("category");

-- CreateIndex
CREATE INDEX "Template_isActive_idx" ON "public"."Template"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_name_key" ON "public"."PaymentMethod"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentStatus_name_key" ON "public"."PaymentStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionRef_key" ON "public"."Payment"("transactionRef");

-- CreateIndex
CREATE INDEX "Payment_projectId_idx" ON "public"."Payment"("projectId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "public"."Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_transactionRef_idx" ON "public"."Payment"("transactionRef");

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "public"."Payment"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaybillAccount_businessShortCode_key" ON "public"."PaybillAccount"("businessShortCode");

-- CreateIndex
CREATE INDEX "PaybillAccount_projectId_idx" ON "public"."PaybillAccount"("projectId");

-- CreateIndex
CREATE INDEX "PaybillAccount_businessShortCode_idx" ON "public"."PaybillAccount"("businessShortCode");

-- CreateIndex
CREATE UNIQUE INDEX "MpesaTransaction_transactionId_key" ON "public"."MpesaTransaction"("transactionId");

-- CreateIndex
CREATE INDEX "MpesaTransaction_projectId_idx" ON "public"."MpesaTransaction"("projectId");

-- CreateIndex
CREATE INDEX "MpesaTransaction_transactionId_idx" ON "public"."MpesaTransaction"("transactionId");

-- CreateIndex
CREATE INDEX "MpesaTransaction_phoneNumber_idx" ON "public"."MpesaTransaction"("phoneNumber");

-- CreateIndex
CREATE INDEX "MpesaTransaction_status_idx" ON "public"."MpesaTransaction"("status");

-- CreateIndex
CREATE INDEX "MpesaTransaction_transactionTime_idx" ON "public"."MpesaTransaction"("transactionTime");

-- CreateIndex
CREATE INDEX "MpesaTransaction_createdAt_idx" ON "public"."MpesaTransaction"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionType_name_key" ON "public"."TransactionType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_key" ON "public"."Transaction"("reference");

-- CreateIndex
CREATE INDEX "Transaction_projectId_idx" ON "public"."Transaction"("projectId");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "public"."Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "public"."Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_createdAt_idx" ON "public"."Transaction"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TopupProduct_name_key" ON "public"."TopupProduct"("name");

-- CreateIndex
CREATE INDEX "Topup_projectId_idx" ON "public"."Topup"("projectId");

-- CreateIndex
CREATE INDEX "Topup_status_idx" ON "public"."Topup"("status");

-- CreateIndex
CREATE INDEX "Topup_createdAt_idx" ON "public"."Topup"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MessageLog_messageId_key" ON "public"."MessageLog"("messageId");

-- CreateIndex
CREATE INDEX "MessageLog_projectId_idx" ON "public"."MessageLog"("projectId");

-- CreateIndex
CREATE INDEX "MessageLog_userId_idx" ON "public"."MessageLog"("userId");

-- CreateIndex
CREATE INDEX "MessageLog_status_idx" ON "public"."MessageLog"("status");

-- CreateIndex
CREATE INDEX "MessageLog_messageType_idx" ON "public"."MessageLog"("messageType");

-- CreateIndex
CREATE INDEX "MessageLog_createdAt_idx" ON "public"."MessageLog"("createdAt");

-- CreateIndex
CREATE INDEX "Webhook_projectId_idx" ON "public"."Webhook"("projectId");

-- CreateIndex
CREATE INDEX "WebhookDelivery_webhookId_idx" ON "public"."WebhookDelivery"("webhookId");

-- CreateIndex
CREATE INDEX "WebhookDelivery_status_idx" ON "public"."WebhookDelivery"("status");

-- CreateIndex
CREATE INDEX "WebhookDelivery_createdAt_idx" ON "public"."WebhookDelivery"("createdAt");

-- CreateIndex
CREATE INDEX "Integration_projectId_idx" ON "public"."Integration"("projectId");

-- CreateIndex
CREATE INDEX "Integration_type_idx" ON "public"."Integration"("type");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_keyHash_key" ON "public"."ApiKey"("keyHash");

-- CreateIndex
CREATE INDEX "ApiKey_userId_idx" ON "public"."ApiKey"("userId");

-- CreateIndex
CREATE INDEX "ApiKey_isActive_idx" ON "public"."ApiKey"("isActive");

-- CreateIndex
CREATE INDEX "LogEntry_level_idx" ON "public"."LogEntry"("level");

-- CreateIndex
CREATE INDEX "LogEntry_createdAt_idx" ON "public"."LogEntry"("createdAt");

-- CreateIndex
CREATE INDEX "LogEntry_userId_idx" ON "public"."LogEntry"("userId");

-- CreateIndex
CREATE INDEX "Referral_referrerId_idx" ON "public"."Referral"("referrerId");

-- CreateIndex
CREATE INDEX "Referral_referredUserId_idx" ON "public"."Referral"("referredUserId");

-- CreateIndex
CREATE INDEX "Referral_status_idx" ON "public"."Referral"("status");

-- CreateIndex
CREATE INDEX "Collaboration_projectId_idx" ON "public"."Collaboration"("projectId");

-- CreateIndex
CREATE INDEX "Collaboration_userId_idx" ON "public"."Collaboration"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Collaboration_projectId_userId_key" ON "public"."Collaboration"("projectId", "userId");

-- CreateIndex
CREATE INDEX "Assignment_projectId_idx" ON "public"."Assignment"("projectId");

-- CreateIndex
CREATE INDEX "Assignment_userId_idx" ON "public"."Assignment"("userId");

-- CreateIndex
CREATE INDEX "Assignment_status_idx" ON "public"."Assignment"("status");

-- CreateIndex
CREATE INDEX "Automation_projectId_idx" ON "public"."Automation"("projectId");

-- CreateIndex
CREATE INDEX "Automation_userId_idx" ON "public"."Automation"("userId");

-- CreateIndex
CREATE INDEX "Automation_isActive_idx" ON "public"."Automation"("isActive");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ShortCode" ADD CONSTRAINT "ShortCode_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Alphanumeric" ADD CONSTRAINT "Alphanumeric_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmsMessage" ADD CONSTRAINT "SmsMessage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmsMessage" ADD CONSTRAINT "SmsMessage_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmsMessage" ADD CONSTRAINT "SmsMessage_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmsMessage" ADD CONSTRAINT "SmsMessage_alphanumericId_fkey" FOREIGN KEY ("alphanumericId") REFERENCES "public"."Alphanumeric"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmsMessage" ADD CONSTRAINT "SmsMessage_shortCodeId_fkey" FOREIGN KEY ("shortCodeId") REFERENCES "public"."ShortCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ScheduledSms" ADD CONSTRAINT "ScheduledSms_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ScheduledSms" ADD CONSTRAINT "ScheduledSms_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ScheduledSms" ADD CONSTRAINT "ScheduledSms_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ScheduledSms" ADD CONSTRAINT "ScheduledSms_alphanumericId_fkey" FOREIGN KEY ("alphanumericId") REFERENCES "public"."Alphanumeric"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ScheduledSms" ADD CONSTRAINT "ScheduledSms_shortCodeId_fkey" FOREIGN KEY ("shortCodeId") REFERENCES "public"."ShortCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SmsCallback" ADD CONSTRAINT "SmsCallback_smsMessageId_fkey" FOREIGN KEY ("smsMessageId") REFERENCES "public"."SmsMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsappAccount" ADD CONSTRAINT "WhatsappAccount_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsappPhoneNumber" ADD CONSTRAINT "WhatsappPhoneNumber_whatsappAccountId_fkey" FOREIGN KEY ("whatsappAccountId") REFERENCES "public"."WhatsappAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsappTemplate" ADD CONSTRAINT "WhatsappTemplate_phoneNumberId_fkey" FOREIGN KEY ("phoneNumberId") REFERENCES "public"."WhatsappPhoneNumber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsappMessage" ADD CONSTRAINT "WhatsappMessage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsappMessage" ADD CONSTRAINT "WhatsappMessage_whatsappAccountId_fkey" FOREIGN KEY ("whatsappAccountId") REFERENCES "public"."WhatsappAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsappMessage" ADD CONSTRAINT "WhatsappMessage_phoneNumberId_fkey" FOREIGN KEY ("phoneNumberId") REFERENCES "public"."WhatsappPhoneNumber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WhatsappMessage" ADD CONSTRAINT "WhatsappMessage_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."WhatsappTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ContactList" ADD CONSTRAINT "ContactList_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Contact" ADD CONSTRAINT "Contact_contactListId_fkey" FOREIGN KEY ("contactListId") REFERENCES "public"."ContactList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Campaign" ADD CONSTRAINT "Campaign_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Template" ADD CONSTRAINT "Template_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "public"."PaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_paymentStatusId_fkey" FOREIGN KEY ("paymentStatusId") REFERENCES "public"."PaymentStatus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaybillAccount" ADD CONSTRAINT "PaybillAccount_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MpesaTransaction" ADD CONSTRAINT "MpesaTransaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MpesaTransaction" ADD CONSTRAINT "MpesaTransaction_paybillAccountId_fkey" FOREIGN KEY ("paybillAccountId") REFERENCES "public"."PaybillAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_transactionTypeId_fkey" FOREIGN KEY ("transactionTypeId") REFERENCES "public"."TransactionType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Topup" ADD CONSTRAINT "Topup_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Topup" ADD CONSTRAINT "Topup_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Topup" ADD CONSTRAINT "Topup_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Topup" ADD CONSTRAINT "Topup_topupProductId_fkey" FOREIGN KEY ("topupProductId") REFERENCES "public"."TopupProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessageLog" ADD CONSTRAINT "MessageLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessageLog" ADD CONSTRAINT "MessageLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessageLog" ADD CONSTRAINT "MessageLog_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessageLog" ADD CONSTRAINT "MessageLog_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."Template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Webhook" ADD CONSTRAINT "Webhook_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebhookDelivery" ADD CONSTRAINT "WebhookDelivery_webhookId_fkey" FOREIGN KEY ("webhookId") REFERENCES "public"."Webhook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Integration" ADD CONSTRAINT "Integration_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApiKey" ADD CONSTRAINT "ApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LogEntry" ADD CONSTRAINT "LogEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Referral" ADD CONSTRAINT "Referral_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Collaboration" ADD CONSTRAINT "Collaboration_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Collaboration" ADD CONSTRAINT "Collaboration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assignment" ADD CONSTRAINT "Assignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Automation" ADD CONSTRAINT "Automation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Automation" ADD CONSTRAINT "Automation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
