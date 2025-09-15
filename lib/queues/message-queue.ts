// BullMQ setup for background message delivery
// Uses ioredis via REDIS_URL; processes jobs to deliver messages using ConversationOrchestrator

import { Queue, QueueEvents, Worker, JobsOptions } from 'bullmq'
import IORedis from 'ioredis'
import { ConversationOrchestrator } from '../services/conversation-orchestrator'

export const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
})

export type DeliveryJobData = {
  messageId: string
  // Minimal fields needed by orchestrator delivery
  message: any
  routingDecision: any
  channel: 'sms' | 'whatsapp' | 'email' | 'voice'
}

export const messageQueueName = 'message-delivery'

export const messageQueue = new Queue<DeliveryJobData>(messageQueueName, { connection })
export const messageQueueEvents = new QueueEvents(messageQueueName, { connection })

// Background worker
const orchestrator = new ConversationOrchestrator()

export const messageWorker = new Worker<DeliveryJobData>(
  messageQueueName,
  async (job) => {
    const { message, routingDecision, channel } = job.data
    return orchestrator.deliverThroughChannel(message, channel, routingDecision)
  },
  { connection, concurrency: 5 }
)

messageWorker.on('failed', (job, err) => {
  console.error('[messageWorker] Job failed', job?.id, err?.message)
})

messageWorker.on('completed', (job) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('[messageWorker] Job completed', job.id)
  }
})

export async function enqueueDelivery(
  data: DeliveryJobData,
  opts?: JobsOptions
) {
  return messageQueue.add('deliver', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,
    ...opts,
  })
}