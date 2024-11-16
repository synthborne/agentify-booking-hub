import { supabase } from "@/integrations/supabase/client";
import { sendEther } from "./web3";
import { toast } from "sonner";

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

  try {
    // Send Ether to escrow wallet
    await sendEther(
      customerData.wallet_id,
      'escrow_wallet', // This should be your escrow contract address in production
      amount
    );

    // Create escrow transaction record
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

    // Update booking status
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ status: 'in_escrow' })
      .eq('id', bookingId);

    if (bookingError) throw bookingError;
  } catch (error) {
    console.error('Escrow error:', error);
    throw error;
  }
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

  try {
    // Send Ether from escrow to agent
    await sendEther(
      'escrow_wallet', // This should be your escrow contract address in production
      agentData.wallet_id,
      amount
    );

    // Create release transaction record
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

    // Update booking status
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ status: 'completed' })
      .eq('id', bookingId);

    if (bookingError) throw bookingError;
  } catch (error) {
    console.error('Release error:', error);
    throw error;
  }
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

  try {
    // Send Ether from escrow back to customer
    await sendEther(
      'escrow_wallet', // This should be your escrow contract address in production
      customerData.wallet_id,
      amount
    );

    // Create refund transaction record
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

    // Update booking status
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (bookingError) throw bookingError;
  } catch (error) {
    console.error('Refund error:', error);
    throw error;
  }
}