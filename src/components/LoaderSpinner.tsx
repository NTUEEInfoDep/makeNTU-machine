import { Loader } from "lucide-react";

function LoaderSpiner() {
  return (
    <div className="h-screen w-11/12 mx-auto flex items-center justify-center">
      <Loader className="animate-spin text-blue-500" size={80} />
    </div>
  );
}

export default LoaderSpiner;
