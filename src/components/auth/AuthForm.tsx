import { useState } from "react";
import { AuthFormData, UserRole } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AuthFormProps {
  isSignUp: boolean;
  role: UserRole;
  onSubmit: (data: AuthFormData) => void;
}

const AuthForm = ({ isSignUp, role, onSubmit }: AuthFormProps) => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    full_name: "",
    state: "",
    district: "",
    wallet_id: "",
    mobile_number: "",
    service_charge: 0.001,
    about_me: "",
    working_hours: "nine-to-five",
    working_days: "weekdays",
  });

  const validateWalletId = (walletId: string) => {
    // Basic Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(walletId);
  };

  const validateMobileNumber = (number: string) => {
    // Basic mobile number validation (10 digits)
    return /^\d{10}$/.test(number);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp) {
      if (!validateWalletId(formData.wallet_id || "")) {
        toast.error("Please enter a valid wallet ID");
        return;
      }

      if (!validateMobileNumber(formData.mobile_number || "")) {
        toast.error("Please enter a valid 10-digit mobile number");
        return;
      }
    }

    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <Input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      
      {isSignUp && (
        <>
          <Input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />
          
          <Input
            type="text"
            name="mobile_number"
            placeholder="Mobile Number (10 digits)"
            value={formData.mobile_number}
            onChange={handleChange}
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="district"
              placeholder="District"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </div>
          
          <Input
            type="text"
            name="wallet_id"
            placeholder="MetaMask Wallet ID (0x...)"
            value={formData.wallet_id}
            onChange={handleChange}
            required
          />
          
          {role === "agent" && (
            <>
              <Input
                type="number"
                name="service_charge"
                step="0.001"
                min="0.001"
                placeholder="Service Charge (ETH)"
                value={formData.service_charge}
                onChange={handleChange}
                required
              />
              
              <textarea
                name="about_me"
                placeholder="About Me"
                value={formData.about_me}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
                required
              />
              
              <select
                name="working_hours"
                value={formData.working_hours}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
                required
              >
                <option value="nine-to-five">9 to 5</option>
                <option value="flexible">Flexible Hours</option>
              </select>
              
              <select
                name="working_days"
                value={formData.working_days}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
                required
              >
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="full-week">Full Week</option>
              </select>
            </>
          )}
        </>
      )}

      <button
        type="submit"
        className="w-full py-3 px-4 bg-accent text-white rounded-lg button-hover"
      >
        {isSignUp ? "Create Account" : "Sign In"}
      </button>
    </form>
  );
};

export default AuthForm;