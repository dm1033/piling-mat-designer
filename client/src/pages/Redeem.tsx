/**
 * Redeem Page — Legacy access code redemption
 * No longer used in per-design model. Redirects to calculator.
 */
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Redeem() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/calculator");
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
