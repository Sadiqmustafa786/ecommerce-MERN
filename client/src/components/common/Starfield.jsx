import useThemeStore from "../../store/themeStore";

const stars = [
  ["6%", "12%", "4.5s", "-1s", "small"],
  ["18%", "27%", "6s", "-3s", "medium"],
  ["31%", "9%", "5.2s", "-2s", "small"],
  ["45%", "38%", "7s", "-4s", "large"],
  ["57%", "17%", "5.8s", "-1.5s", "small"],
  ["69%", "52%", "6.5s", "-3.5s", "medium"],
  ["82%", "21%", "4.8s", "-2.5s", "small"],
  ["94%", "42%", "7.4s", "-5s", "large"],
  ["11%", "68%", "6.8s", "-4.5s", "medium"],
  ["26%", "84%", "5.5s", "-2.8s", "small"],
  ["42%", "63%", "7.8s", "-6s", "large"],
  ["61%", "79%", "4.9s", "-1.8s", "small"],
  ["76%", "91%", "6.2s", "-4.2s", "medium"],
  ["88%", "72%", "5.7s", "-3.2s", "small"],
  ["3%", "36%", "5.1s", "-2.4s", "small"],
  ["14%", "91%", "8.1s", "-6.3s", "medium"],
  ["22%", "54%", "6.4s", "-1.7s", "small"],
  ["36%", "76%", "4.7s", "-3.7s", "large"],
  ["49%", "6%", "7.2s", "-5.1s", "small"],
  ["54%", "92%", "5.9s", "-2.1s", "medium"],
  ["64%", "42%", "8.4s", "-7s", "small"],
  ["72%", "8%", "4.6s", "-1.2s", "large"],
  ["84%", "58%", "6.7s", "-4.1s", "medium"],
  ["97%", "87%", "5.3s", "-2.9s", "small"],
  ["8%", "79%", "7.6s", "-5.6s", "large"],
  ["29%", "33%", "4.9s", "-0.8s", "medium"],
  ["67%", "68%", "6.1s", "-3.4s", "small"],
  ["91%", "14%", "8.7s", "-6.8s", "large"],
];

const Starfield = () => {
  const isDark = useThemeStore((state) => state.isDark);

  if (!isDark) return null;

  return (
    <div className="global-starfield" aria-hidden="true">
      {stars.map(([left, top, duration, delay, size]) => (
        <span
          className={`global-star global-star-${size}`}
          key={`${left}-${top}`}
          style={{
            "--star-left": left,
            "--star-top": top,
            "--star-duration": duration,
            "--star-delay": delay,
          }}
        />
      ))}
    </div>
  );
};

export default Starfield;