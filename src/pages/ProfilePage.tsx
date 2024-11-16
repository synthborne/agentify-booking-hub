import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Profile, UserRole } from "@/lib/types";

const ProfilePage = () => {
  const session = useSession();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({} as Profile);
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate("/auth");
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        toast.error("Error fetching profile");
        return;
      }

      // Explicitly type the role as UserRole
      const profileWithTypedRole = {
        ...data,
        role: data.role as UserRole
      };

      setProfile(profileWithTypedRole);
      setFormData(profileWithTypedRole);
    };

    fetchProfile();
  }, [session, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from("profiles")
      .update(formData)
      .eq("id", session?.user.id);

    if (error) {
      toast.error("Error updating profile");
      return;
    }

    setProfile({ ...profile, ...formData });
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-2xl mx-auto px-4">
        <div className="glass-card rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-primary">Profile</h1>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  name="full_name"
                  value={formData.full_name || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Mobile Number</label>
                <Input
                  name="mobile_number"
                  value={formData.mobile_number || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">State</label>
                <Input
                  name="state"
                  value={formData.state || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">District</label>
                <Input
                  name="district"
                  value={formData.district || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">About Me</label>
                <textarea
                  name="about_me"
                  value={formData.about_me || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                <p className="text-lg">{profile.full_name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Mobile Number</h3>
                <p className="text-lg">{profile.mobile_number}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p className="text-lg">{profile.state}, {profile.district}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Wallet ID</h3>
                <p className="text-lg font-mono">{profile.wallet_id}</p>
              </div>

              {profile.about_me && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">About</h3>
                  <p className="text-lg">{profile.about_me}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;