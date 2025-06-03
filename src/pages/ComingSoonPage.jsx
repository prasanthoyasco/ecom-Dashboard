import Lottie from "lottie-react";
import comingSoonAnimation from "../assets/coming-soon.json";

export default function ComingSoonPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white text-center">
      <Lottie
        animationData={comingSoonAnimation}
        loop={true}
        className="w-[400px] h-[400px]"
      />
       <h1 className="text-2xl font-semibold text-gray-700 mt-4">Coming Soon</h1>
      <p className="text-gray-500 mt-2">We're Cooking👩‍🍳 something awesome!</p>
    </div>
  );
}3