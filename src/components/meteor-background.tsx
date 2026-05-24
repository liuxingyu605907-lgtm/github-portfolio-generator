const meteors = [
  { top: "12%", delay: "0s", duration: "5.2s", width: "180px" },
  { top: "28%", delay: "1.4s", duration: "6.4s", width: "220px" },
  { top: "46%", delay: "2.6s", duration: "5.8s", width: "160px" },
  { top: "68%", delay: "0.8s", duration: "7s", width: "240px" },
];

export function MeteorBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(8,47,73,0.45),transparent_42%),radial-gradient(circle_at_78%_22%,rgba(34,211,238,0.16),transparent_38%)]" />
      {meteors.map((meteor) => (
        <span
          key={`${meteor.top}-${meteor.delay}`}
          className="meteor absolute left-[-260px] h-px rounded-full bg-gradient-to-r from-transparent via-cyan-200 to-white"
          style={{
            top: meteor.top,
            width: meteor.width,
            animationDelay: meteor.delay,
            animationDuration: meteor.duration,
          }}
        />
      ))}
    </div>
  );
}
