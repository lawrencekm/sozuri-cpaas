// Dedicated worker entrypoint
// Run with: node dist/lib/queues/worker-entry.js (after build) or ts-node in dev

import { messageWorker, messageQueueEvents } from './message-queue'

messageQueueEvents.on('completed', ({ jobId }) => {
  console.log('[worker-entry] job completed', jobId)
})

messageQueueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error('[worker-entry] job failed', jobId, failedReason)
})

console.log('[worker-entry] Worker started')