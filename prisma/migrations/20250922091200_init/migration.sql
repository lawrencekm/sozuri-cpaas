/*
  Warnings:

  - Added the required column `updatedAt` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ApiKey" ADD COLUMN     "projectId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."Conversation" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "subject" TEXT,
    "customerId" TEXT NOT NULL,
    "customerName" TEXT,
    "assignedAgent" TEXT,
    "primaryChannel" TEXT NOT NULL,
    "activeChannels" TEXT[],
    "preferredChannel" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "category" TEXT,
    "tags" TEXT[],
    "journeyStage" TEXT,
    "lastChannel" TEXT,
    "channelHistory" JSONB,
    "metadata" JSONB,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConversationParticipant" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "participantType" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'participant',
    "phoneNumber" TEXT,
    "email" TEXT,
    "name" TEXT,
    "preferredChannels" TEXT[],
    "blockedChannels" TEXT[],
    "timezone" TEXT DEFAULT 'Africa/Nairobi',
    "language" TEXT DEFAULT 'en',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3),

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UnifiedMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "externalId" TEXT,
    "parentMessageId" TEXT,
    "channel" TEXT NOT NULL,
    "channelProvider" TEXT,
    "fromId" TEXT NOT NULL,
    "fromType" TEXT NOT NULL,
    "fromIdentifier" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "toType" TEXT NOT NULL,
    "toIdentifier" TEXT NOT NULL,
    "messageType" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "subject" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "deliveryStatus" TEXT,
    "readAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "routeId" TEXT,
    "isAutoRouted" BOOLEAN NOT NULL DEFAULT false,
    "routingReason" TEXT,
    "fallbackLevel" INTEGER NOT NULL DEFAULT 0,
    "intent" TEXT,
    "sentiment" TEXT,
    "urgency" TEXT,
    "priority" TEXT,
    "isAutomated" BOOLEAN NOT NULL DEFAULT false,
    "automationId" TEXT,
    "cost" DECIMAL(10,4),
    "currency" TEXT DEFAULT 'KES',
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnifiedMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MessageRoute" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "primaryChannel" TEXT NOT NULL,
    "fallbackChannels" TEXT[],
    "routingStrategy" TEXT NOT NULL,
    "decisionFactors" JSONB NOT NULL,
    "channelStatus" JSONB NOT NULL,
    "attemptedChannels" TEXT[],
    "successfulChannel" TEXT,
    "totalAttempts" INTEGER NOT NULL DEFAULT 0,
    "routedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "MessageRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ConversationState" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "subState" TEXT,
    "reason" TEXT,
    "context" JSONB,
    "customerData" JSONB,
    "agentNotes" TEXT,
    "workflowStage" TEXT,
    "nextActions" TEXT[],
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChannelPreference" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "customerType" TEXT NOT NULL DEFAULT 'phone',
    "preferredChannels" TEXT[],
    "blockedChannels" TEXT[],
    "availableHours" JSONB,
    "timezone" TEXT NOT NULL DEFAULT 'Africa/Nairobi',
    "smsPreferences" JSONB,
    "whatsappPreferences" JSONB,
    "emailPreferences" JSONB,
    "voicePreferences" JSONB,
    "responseRates" JSONB,
    "engagementScore" INTEGER DEFAULT 0,
    "lastChannelUsed" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChannelPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApiVersion" (
    "id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "deprecatedAt" TIMESTAMP(3),
    "sunsetAt" TIMESTAMP(3),
    "migrationGuide" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApiKeyV2" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "keyHash" TEXT NOT NULL,
    "keyPrefix" TEXT NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "scopes" JSONB NOT NULL DEFAULT '[]',
    "rateLimit" JSONB,
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKeyV2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApiUsageAnalytics" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "apiKeyId" TEXT,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "responseTimeMs" INTEGER,
    "requestSizeBytes" INTEGER,
    "responseSizeBytes" INTEGER,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "apiVersion" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiUsageAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_conversationId_key" ON "public"."Conversation"("conversationId");

-- CreateIndex
CREATE INDEX "Conversation_projectId_idx" ON "public"."Conversation"("projectId");

-- CreateIndex
CREATE INDEX "Conversation_customerId_idx" ON "public"."Conversation"("customerId");

-- CreateIndex
CREATE INDEX "Conversation_status_idx" ON "public"."Conversation"("status");

-- CreateIndex
CREATE INDEX "Conversation_primaryChannel_idx" ON "public"."Conversation"("primaryChannel");

-- CreateIndex
CREATE INDEX "Conversation_lastActivity_idx" ON "public"."Conversation"("lastActivity");

-- CreateIndex
CREATE INDEX "Conversation_createdAt_idx" ON "public"."Conversation"("createdAt");

-- CreateIndex
CREATE INDEX "ConversationParticipant_conversationId_idx" ON "public"."ConversationParticipant"("conversationId");

-- CreateIndex
CREATE INDEX "ConversationParticipant_participantId_idx" ON "public"."ConversationParticipant"("participantId");

-- CreateIndex
CREATE INDEX "ConversationParticipant_participantType_idx" ON "public"."ConversationParticipant"("participantType");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_conversationId_participantId_key" ON "public"."ConversationParticipant"("conversationId", "participantId");

-- CreateIndex
CREATE UNIQUE INDEX "UnifiedMessage_messageId_key" ON "public"."UnifiedMessage"("messageId");

-- CreateIndex
CREATE INDEX "UnifiedMessage_conversationId_idx" ON "public"."UnifiedMessage"("conversationId");

-- CreateIndex
CREATE INDEX "UnifiedMessage_projectId_idx" ON "public"."UnifiedMessage"("projectId");

-- CreateIndex
CREATE INDEX "UnifiedMessage_messageId_idx" ON "public"."UnifiedMessage"("messageId");

-- CreateIndex
CREATE INDEX "UnifiedMessage_channel_idx" ON "public"."UnifiedMessage"("channel");

-- CreateIndex
CREATE INDEX "UnifiedMessage_status_idx" ON "public"."UnifiedMessage"("status");

-- CreateIndex
CREATE INDEX "UnifiedMessage_fromIdentifier_idx" ON "public"."UnifiedMessage"("fromIdentifier");

-- CreateIndex
CREATE INDEX "UnifiedMessage_toIdentifier_idx" ON "public"."UnifiedMessage"("toIdentifier");

-- CreateIndex
CREATE INDEX "UnifiedMessage_createdAt_idx" ON "public"."UnifiedMessage"("createdAt");

-- CreateIndex
CREATE INDEX "UnifiedMessage_sentAt_idx" ON "public"."UnifiedMessage"("sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "MessageRoute_routeId_key" ON "public"."MessageRoute"("routeId");

-- CreateIndex
CREATE INDEX "MessageRoute_conversationId_idx" ON "public"."MessageRoute"("conversationId");

-- CreateIndex
CREATE INDEX "MessageRoute_projectId_idx" ON "public"."MessageRoute"("projectId");

-- CreateIndex
CREATE INDEX "MessageRoute_primaryChannel_idx" ON "public"."MessageRoute"("primaryChannel");

-- CreateIndex
CREATE INDEX "MessageRoute_routedAt_idx" ON "public"."MessageRoute"("routedAt");

-- CreateIndex
CREATE INDEX "ConversationState_conversationId_idx" ON "public"."ConversationState"("conversationId");

-- CreateIndex
CREATE INDEX "ConversationState_state_idx" ON "public"."ConversationState"("state");

-- CreateIndex
CREATE INDEX "ConversationState_validFrom_idx" ON "public"."ConversationState"("validFrom");

-- CreateIndex
CREATE INDEX "ChannelPreference_projectId_idx" ON "public"."ChannelPreference"("projectId");

-- CreateIndex
CREATE INDEX "ChannelPreference_customerId_idx" ON "public"."ChannelPreference"("customerId");

-- CreateIndex
CREATE INDEX "ChannelPreference_preferredChannels_idx" ON "public"."ChannelPreference"("preferredChannels");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelPreference_projectId_customerId_customerType_key" ON "public"."ChannelPreference"("projectId", "customerId", "customerType");

-- CreateIndex
CREATE UNIQUE INDEX "ApiVersion_version_key" ON "public"."ApiVersion"("version");

-- CreateIndex
CREATE INDEX "ApiVersion_version_idx" ON "public"."ApiVersion"("version");

-- CreateIndex
CREATE INDEX "ApiVersion_status_idx" ON "public"."ApiVersion"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKeyV2_keyHash_key" ON "public"."ApiKeyV2"("keyHash");

-- CreateIndex
CREATE INDEX "ApiKeyV2_projectId_idx" ON "public"."ApiKeyV2"("projectId");

-- CreateIndex
CREATE INDEX "ApiKeyV2_userId_idx" ON "public"."ApiKeyV2"("userId");

-- CreateIndex
CREATE INDEX "ApiKeyV2_keyHash_idx" ON "public"."ApiKeyV2"("keyHash");

-- CreateIndex
CREATE INDEX "ApiKeyV2_isActive_idx" ON "public"."ApiKeyV2"("isActive");

-- CreateIndex
CREATE INDEX "ApiKeyV2_expiresAt_idx" ON "public"."ApiKeyV2"("expiresAt");

-- CreateIndex
CREATE INDEX "ApiKeyV2_lastUsedAt_idx" ON "public"."ApiKeyV2"("lastUsedAt");

-- CreateIndex
CREATE INDEX "ApiUsageAnalytics_projectId_idx" ON "public"."ApiUsageAnalytics"("projectId");

-- CreateIndex
CREATE INDEX "ApiUsageAnalytics_apiKeyId_idx" ON "public"."ApiUsageAnalytics"("apiKeyId");

-- CreateIndex
CREATE INDEX "ApiUsageAnalytics_timestamp_idx" ON "public"."ApiUsageAnalytics"("timestamp");

-- CreateIndex
CREATE INDEX "ApiUsageAnalytics_endpoint_idx" ON "public"."ApiUsageAnalytics"("endpoint");

-- CreateIndex
CREATE INDEX "ApiUsageAnalytics_statusCode_idx" ON "public"."ApiUsageAnalytics"("statusCode");

-- CreateIndex
CREATE INDEX "ApiKey_projectId_idx" ON "public"."ApiKey"("projectId");

-- CreateIndex
CREATE INDEX "ApiKey_keyHash_idx" ON "public"."ApiKey"("keyHash");

-- AddForeignKey
ALTER TABLE "public"."ApiKey" ADD CONSTRAINT "ApiKey_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UnifiedMessage" ADD CONSTRAINT "UnifiedMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UnifiedMessage" ADD CONSTRAINT "UnifiedMessage_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UnifiedMessage" ADD CONSTRAINT "UnifiedMessage_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "public"."MessageRoute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessageRoute" ADD CONSTRAINT "MessageRoute_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MessageRoute" ADD CONSTRAINT "MessageRoute_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ConversationState" ADD CONSTRAINT "ConversationState_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChannelPreference" ADD CONSTRAINT "ChannelPreference_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApiKeyV2" ADD CONSTRAINT "ApiKeyV2_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApiKeyV2" ADD CONSTRAINT "ApiKeyV2_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApiUsageAnalytics" ADD CONSTRAINT "ApiUsageAnalytics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ApiUsageAnalytics" ADD CONSTRAINT "ApiUsageAnalytics_apiKeyId_fkey" FOREIGN KEY ("apiKeyId") REFERENCES "public"."ApiKeyV2"("id") ON DELETE SET NULL ON UPDATE CASCADE;
