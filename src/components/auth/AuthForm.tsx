import { useState } from "react";
import { AuthFormData, UserRole } from "@/lib/types";

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
    service_charge: 0.001,
    about_me: "",
    working_hours: "nine-to-five",
    working_days: "weekdays",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
        required
      />
      
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
        required
      />
      
      {isSignUp && (
        <>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
              required
            />
            <input
              type="text"
              name="district"
              placeholder="District"
              value={formData.district}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
              required
            />
          </div>
          
          <input
            type="text"
            name="wallet_id"
            placeholder="MetaMask Wallet ID"
            value={formData.wallet_id}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
            required
          />
          
          {role === "agent" && (
            <>
              <input
                type="number"
                name="service_charge"
                step="0.001"
                min="0.001"
                placeholder="Service Charge (ETH)"
                value={formData.service_charge}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
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