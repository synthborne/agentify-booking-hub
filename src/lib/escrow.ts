import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function initiateEscrow(bookingId: string, customerId: string, agentId: string, amount: number) {
  const { data: customerData } = await supabase
    .from('profiles')
    .select('wallet_id')
    .eq('id', customerId)
    .single();

  const { data: agentData } = await supabase
    .from('profiles')
    .select('wallet_id')
    .eq('id', agentId)
    .single();

  if (!customerData?.wallet_id || !agentData?.wallet_id) {
    throw new Error('Wallet information not found');
  }

  // Create escrow transaction
  const { error: transactionError } = await supabase
    .from('escrow_transactions')
    .insert({
      booking_id: bookingId,
      from_wallet_id: customerData.wallet_id,
      to_wallet_id: 'escrow_wallet',
      amount,
      transaction_type: 'escrow_lock',
      status: 'completed'
    });

  if (transactionError) throw transactionError;

  // Call RPC function to process the transfer
  const { data: transferSuccess, error: transferError } = await supabase
    .rpc('process_wallet_transfer', {
      from_wallet: customerData.wallet_id,
      to_wallet: 'escrow_wallet',
      transfer_amount: amount
    });

  if (transferError || !transferSuccess) {
    throw new Error('Failed to transfer funds to escrow');
  }

  // Update booking status
  const { error: bookingError } = await supabase
    .from('bookings')
    .update({ status: 'in_escrow' })
    .eq('id', bookingId);

  if (bookingError) throw bookingError;
}

export async function releaseEscrow(bookingId: string, agentId: string, amount: number) {
  const { data: agentData } = await supabase
    .from('profiles')
    .select('wallet_id')
    .eq('id', agentId)
    .single();

  if (!agentData?.wallet_id) {
    throw new Error('Agent wallet not found');
  }

  // Create release transaction
  const { error: transactionError } = await supabase
    .from('escrow_transactions')
    .insert({
      booking_id: bookingId,
      from_wallet_id: 'escrow_wallet',
      to_wallet_id: agentData.wallet_id,
      amount,
      transaction_type: 'escrow_release',
      status: 'completed'
    });

  if (transactionError) throw transactionError;

  // Process the transfer
  const { data: transferSuccess, error: transferError } = await supabase
    .rpc('process_wallet_transfer', {
      from_wallet: 'escrow_wallet',
      to_wallet: agentData.wallet_id,
      transfer_amount: amount
    });

  if (transferError || !transferSuccess) {
    throw new Error('Failed to release funds from escrow');
  }

  // Update booking status
  const { error: bookingError } = await supabase
    .from('bookings')
    .update({ status: 'completed' })
    .eq('id', bookingId);

  if (bookingError) throw bookingError;
}

export async function refundEscrow(bookingId: string, customerId: string, amount: number) {
  const { data: customerData } = await supabase
    .from('profiles')
    .select('wallet_id')
    .eq('id', customerId)
    .single();

  if (!customerData?.wallet_id) {
    throw new Error('Customer wallet not found');
  }

  // Create refund transaction
  const { error: transactionError } = await supabase
    .from('escrow_transactions')
    .insert({
      booking_id: bookingId,
      from_wallet_id: 'escrow_wallet',
      to_wallet_id: customerData.wallet_id,
      amount,
      transaction_type: 'escrow_refund',
      status: 'completed'
    });

  if (transactionError) throw transactionError;

  // Process the transfer
  const { data: transferSuccess, error: transferError } = await supabase
    .rpc('process_wallet_transfer', {
      from_wallet: 'escrow_wallet',
      to_wallet: customerData.wallet_id,
      transfer_amount: amount
    });

  if (transferError || !transferSuccess) {
    throw new Error('Failed to refund from escrow');
  }

  // Update booking status
  const { error: bookingError } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId);

  if (bookingError) throw bookingError;
}