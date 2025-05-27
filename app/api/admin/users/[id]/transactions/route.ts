import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Mock transaction data
const generateMockTransactions = (userId: string, count: number = 50) => {
  const types = ['topup', 'sms_send', 'whatsapp_send', 'voice_call', 'refund'];
  const statuses = ['completed', 'pending', 'failed'];
  const transactions = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (i * 3600000 + Math.random() * 3600000)); // Random within last hours
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = type === 'topup' ?
      (Math.random() * 500 + 10) : // Topups: $10-$510
      -(Math.random() * 5 + 0.1); // Charges: $0.10-$5.10

    transactions.push({
      id: `txn_${Date.now()}_${i}`,
      user_id: userId,
      type,
      amount: parseFloat(amount.toFixed(2)),
      status,
      description: getTransactionDescription(type, amount),
      timestamp: timestamp.toISOString(),
      reference_id: type === 'topup' ? `top_${Math.random().toString(36).substring(2, 11)}` :
                   type.includes('send') ? `msg_${Math.random().toString(36).substring(2, 11)}` :
                   `ref_${Math.random().toString(36).substring(2, 11)}`,
      metadata: {
        channel: type.includes('sms') ? 'sms' :
                type.includes('whatsapp') ? 'whatsapp' :
                type.includes('voice') ? 'voice' : null,
        recipient: type.includes('send') || type.includes('call') ?
          `+1${Math.floor(Math.random() * 9000000000) + 1000000000}` : null
      }
    });
  }

  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

function getTransactionDescription(type: string, amount: number): string {
  switch (type) {
    case 'topup':
      return `Credit top-up: $${Math.abs(amount).toFixed(2)}`;
    case 'sms_send':
      return `SMS message sent: $${Math.abs(amount).toFixed(2)}`;
    case 'whatsapp_send':
      return `WhatsApp message sent: $${Math.abs(amount).toFixed(2)}`;
    case 'voice_call':
      return `Voice call: $${Math.abs(amount).toFixed(2)}`;
    case 'refund':
      return `Refund processed: $${Math.abs(amount).toFixed(2)}`;
    default:
      return `Transaction: $${Math.abs(amount).toFixed(2)}`;
  }
}

// Helper function to check if user has admin permissions
function hasAdminPermissions(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader?.includes('Bearer') || false;
}

/**
 * GET /api/admin/users/[id]/transactions
 * Get transaction history for a specific user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!hasAdminPermissions(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    // Generate mock transactions for the user
    let transactions = generateMockTransactions(id, 200);

    // Apply filters
    if (type) {
      transactions = transactions.filter(txn => txn.type === type);
    }

    if (status) {
      transactions = transactions.filter(txn => txn.status === status);
    }

    if (startDate) {
      const start = new Date(startDate);
      transactions = transactions.filter(txn => new Date(txn.timestamp) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      transactions = transactions.filter(txn => new Date(txn.timestamp) <= end);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = transactions.slice(startIndex, endIndex);

    // Calculate summary statistics
    const summary = {
      total_transactions: transactions.length,
      total_topups: transactions.filter(t => t.type === 'topup').reduce((sum, t) => sum + Math.abs(t.amount), 0),
      total_charges: transactions.filter(t => t.type !== 'topup' && t.type !== 'refund').reduce((sum, t) => sum + Math.abs(t.amount), 0),
      total_refunds: transactions.filter(t => t.type === 'refund').reduce((sum, t) => sum + Math.abs(t.amount), 0),
      pending_amount: transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + Math.abs(t.amount), 0)
    };

    return NextResponse.json({
      transactions: paginatedTransactions,
      total: transactions.length,
      page,
      limit,
      totalPages: Math.ceil(transactions.length / limit),
      summary
    });

  } catch (error) {
    console.error("Failed to fetch user transactions:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
