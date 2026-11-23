import HeroSection from "@/components/HeroSection";
import OurMission from "@/components/OurMission";
import AboutUs from "@/components/AboutUs";
import ProjectsPreview from "@/components/ProjectsPreview";
import HowItWorks from "@/components/HowItWorks";

import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  // Create the existing Supabase server client.
  const supabase = await createClient();

  // Verify the current user's authentication status.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main>
      {/* Pass authentication status to the Hero button. */}
      <HeroSection isAuthenticated={!!user} />

      {/* Preserve all existing homepage sections. */}
      <OurMission />
      <AboutUs />
      <ProjectsPreview />
      <HowItWorks />
    </main>
  );
}
