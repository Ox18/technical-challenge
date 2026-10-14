import { ClockInPhoto } from "modules/clock-in/components/ClockInPhoto";

export default function Page() {
  return (
    <main className="page">
      <h1>Clock in</h1>
      <p className="muted">Take a photo to check your workstation before your shift starts.</p>
      <ClockInPhoto />
    </main>
  );
}
