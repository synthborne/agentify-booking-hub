import { supabase } from "@/integrations/supabase/client";
import { sendEther } from "./web3";
import { ESCROW_WALLET_ID } from "@/config/constants";

const handleEscrowTransaction = async (
  bookingId: string,
  fromWalletId: string,
  toWalletId: string,
  amount: number,
  transactionType: 'escrow_lock' | 'escrow_release' | 'escrow_refund'
) => {
  try {
    await sendEther(fromWalletId, toWalletId, amount);

    const { error: transactionError } = await supabase
      .from('escrow_transactions')
      .insert({
        booking_id: bookingId,
        from_wallet_id: fromWalletId,
        to_wallet_id: toWalletId,
        amount,
        transaction_type: transactionType,
        status: 'completed'
      });

    if (transactionError) throw transactionError;

    const newStatus = 
      transactionType === 'escrow_lock' ? 'in_escrow' :
      transactionType === 'escrow_release' ? 'completed' : 'cancelled';

    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ status: newStatus })
      .eq('id', bookingId);

    if (bookingError) throw bookingError;
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
};

export async function initiateEscrow(
  bookingId: string, 
  customerId: string, 
  agentId: string, 
  amount: number
) {
  const { data: customerData } = await supabase
    .from('profiles')
    .select('wallet_id')
    .eq('id', customerId)
    .single();

  if (!customerData?.wallet_id) {
    throw new Error('Customer wallet not found');
  }

  return handleEscrowTransaction(
    bookingId,
    customerData.wallet_id,
    ESCROW_WALLET_ID,
    amount,
    'escrow_lock'
  );
}

export async function releaseEscrow(
  bookingId: string, 
  agentId: string, 
  amount: number
) {
  const { data: agentData } = await supabase
    .from('profiles')
    .select('wallet_id')
    .eq('id', agentId)
    .single();

  if (!agentData?.wallet_id) {
    throw new Error('Agent wallet not found');
  }

  return handleEscrowTransaction(
    bookingId,
    ESCROW_WALLET_ID,
    agentData.wallet_id,
    amount,
    'escrow_release'
  );
}

export async function refundEscrow(
  bookingId: string, 
  customerId: string, 
  amount: number
) {
  const { data: customerData } = await supabase
    .from('profiles')
    .select('wallet_id')
    .eq('id', customerId)
    .single();

  if (!customerData?.wallet_id) {
    throw new Error('Customer wallet not found');
  }

  return handleEscrowTransaction(
    bookingId,
    ESCROW_WALLET_ID,
    customerData.wallet_id,
    amount,
    'escrow_refund'
  );
}