export default function CirclePattern() {
  return (
    <div className="absolute inset-0 opacity-20">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <pattern
          id="pattern-circles"
          x="0"
          y="0"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="10" cy="10" r="1.6" fill="#fff" />
        </pattern>
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="url(#pattern-circles)"
        />
      </svg>
    </div>
  );
}
