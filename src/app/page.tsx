import Map from "@/components/Map";
import LaserCutQueueList from "@/components/LaserCutQueueList";
import ThreeDPQueueList from "@/components/ThreeDPQueueList";

function Home() {
  return (
    <div className="bg-background overflow-auto mb-4">
      <Map />
      <LaserCutQueueList />
      <ThreeDPQueueList />
    </div>
  );
}

export default Home;
