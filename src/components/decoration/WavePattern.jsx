export default function WavePattern() {
  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <div className="absolute top-0 left-0 z-0 w-full h-64 origin-top-left transform -skew-y-6 bg-indigo-600 opacity-10"></div>
      <div className="absolute bottom-0 right-0 z-0 w-full h-64 origin-bottom-right transform skew-y-6 bg-indigo-400 opacity-10"></div>
      <svg
        className="absolute bottom-0 left-0 w-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#4F46E5"
          fillOpacity="1"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
}
