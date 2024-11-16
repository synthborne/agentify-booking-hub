import { Button } from "@/components/ui/button";
import { initiateEscrow, releaseEscrow, refundEscrow } from "@/lib/escrow";
import { toast } from "sonner";

interface BookingActionsProps {
  bookingId: string;
  customerId: string;
  agentId: string;
  serviceCharge: number;
  bookingStatus: string;
  onStatusChange: (newStatus: string) => void;
}

const BookingActions = ({
  bookingId,
  customerId,
  agentId,
  serviceCharge,
  bookingStatus,
  onStatusChange,
}: BookingActionsProps) => {
  const handleConfirmBooking = async () => {
    try {
      await initiateEscrow(bookingId, customerId, agentId, serviceCharge);
      onStatusChange('in_escrow');
      toast.success('Payment held in escrow');
    } catch (error) {
      toast.error('Failed to process payment');
      console.error('Escrow error:', error);
    }
  };

  const handleConfirmDeal = async () => {
    try {
      await releaseEscrow(bookingId, agentId, serviceCharge);
      onStatusChange('completed');
      toast.success('Payment released to agent');
    } catch (error) {
      toast.error('Failed to release payment');
      console.error('Release error:', error);
    }
  };

  const handleCancelBooking = async () => {
    try {
      await refundEscrow(bookingId, customerId, serviceCharge);
      onStatusChange('cancelled');
      toast.success('Payment refunded');
    } catch (error) {
      toast.error('Failed to process refund');
      console.error('Refund error:', error);
    }
  };

  if (bookingStatus === "initial") {
    return (
      <Button
        className="w-full"
        size="lg"
        onClick={handleConfirmBooking}
      >
        Confirm Booking
      </Button>
    );
  }

  if (bookingStatus === "in_escrow") {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-secondary rounded-lg">
          <h3 className="font-semibold mb-2">Payment Status</h3>
          <p className="text-muted-foreground">Payment held in escrow</p>
        </div>
        <div className="flex gap-4">
          <Button
            className="flex-1"
            variant="default"
            size="lg"
            onClick={handleConfirmDeal}
          >
            Confirm Deal
          </Button>
          <Button
            className="flex-1"
            variant="destructive"
            size="lg"
            onClick={handleCancelBooking}
          >
            Cancel Booking
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default BookingActions;