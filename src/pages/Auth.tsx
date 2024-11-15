import AuthForm from "@/components/auth/AuthForm";
import { Link, useSearchParams } from "react-router-dom";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const isSignUp = searchParams.get("mode") === "signup";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 px-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-xl p-8">
          <h1 className="text-2xl font-semibold text-center mb-2">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {isSignUp
              ? "Join our community of real estate professionals"
              : "Sign in to your account"}
          </p>
          
          <AuthForm />
          
          <div className="mt-6 text-center text-sm">
            {isSignUp ? (
              <p>
                Already have an account?{" "}
                <Link
                  to="/auth"
                  className="text-accent hover:underline transition-all"
                >
                  Sign In
                </Link>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <Link
                  to="/auth?mode=signup"
                  className="text-accent hover:underline transition-all"
                >
                  Sign Up
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;