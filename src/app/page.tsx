import LaserCutQueueList from "@/components/LaserCutQueueList";
import ThreeDPQueueList from "@/components/ThreeDPQueueList";

function Home() {
  return (
    <div className="bg-background overflow-auto mb-4">
      <LaserCutQueueList />
      <ThreeDPQueueList />
    </div>
  );
}

export default Home;
