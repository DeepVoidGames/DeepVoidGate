import { GameHeader } from "@/components/GameHeader";
import MilestonesManager from "@/components/Milestones/MilestonesManager";
import { MobileTopNav } from "@/components/Navbar";

function Milestones() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-background/90 text-foreground p-4 md:p-6 my-12">
        <div className="max-w-7xl mx-auto space-y-4">
          <GameHeader />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <MilestonesManager />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Milestones;
