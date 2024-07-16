export default function AnimatedLoading() {
  return (
    <div className="h-full relative overflow-x-hidden z-[1000]">
      <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 absolute top-0 left-0 animate-loader"></div>
    </div>
  );
}
