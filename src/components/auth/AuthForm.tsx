import { useState } from "react";
import { AuthFormData, UserRole } from "@/lib/types";
import { useSearchParams } from "react-router-dom";

const AuthForm = () => {
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get("mode") === "signup";
  const [role, setRole] = useState<UserRole>("customer");
  
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    fullName: "",
    region: "",
    district: "",
    walletId: "",
    charges: 0.001,
    aboutMe: "",
    workingHours: "nine-to-five",
    workingDays: "weekdays",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication logic here
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {isSignUp && (
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex-1 py-3 px-4 rounded-lg text-center transition-all duration-200 ${
              role === "customer"
                ? "bg-accent text-white"
                : "bg-secondary text-primary"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("agent")}
            className={`flex-1 py-3 px-4 rounded-lg text-center transition-all duration-200 ${
              role === "agent"
                ? "bg-accent text-white"
                : "bg-secondary text-primary"
            }`}
          >
            Agent
          </button>
        </div>
      )}

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
          required
        />
        
        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Region"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
                required
              />
              <input
                type="text"
                placeholder="District"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
                required
              />
            </div>
            <input
              type="text"
              placeholder="MetaMask Wallet ID"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
              required
            />
            
            {role === "agent" && (
              <>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  placeholder="Charges (ETH)"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
                  required
                />
                <textarea
                  placeholder="About Me"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
                  required
                />
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 input-focus"
                  required
                >
                  <option value="nine-to-five">9 to 5</option>
                  <option value="flexible">Flexible Hours</option>
                </select>
                <select
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
      </div>

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