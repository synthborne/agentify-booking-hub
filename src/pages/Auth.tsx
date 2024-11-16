import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/lib/types";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<UserRole>("customer");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (formData: any) => {
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              role: role,
              full_name: formData.full_name,
              state: formData.state,
              district: formData.district,
              wallet_id: formData.wallet_id,
              mobile_number: formData.mobile_number, // Make sure mobile_number is included
              working_hours: formData.working_hours,
              working_days: formData.working_days,
              service_charge: formData.service_charge,
              about_me: formData.about_me,
            },
          },
        });

        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileData?.role === 'agent') {
          navigate('/agent-dashboard');
        } else {
          navigate('/customer-dashboard');
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 px-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold mb-2">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp
                ? "Join our community of real estate professionals"
                : "Sign in to your account"}
            </p>
          </div>

          {isSignUp && (
            <div className="flex gap-4 mb-6">
              <button
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

          <AuthForm
            isSignUp={isSignUp}
            role={role}
            onSubmit={handleAuth}
          />

          <div className="mt-6 text-center text-sm">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-accent hover:underline transition-all"
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;