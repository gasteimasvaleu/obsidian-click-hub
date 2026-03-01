import { useState, useCallback } from "react";

const CONSENT_KEY = "ai_consent_accepted";

export function useAIConsent() {
  const [showConsent, setShowConsent] = useState(false);

  const hasConsent = useCallback(() => {
    return localStorage.getItem(CONSENT_KEY) === "true";
  }, []);

  const acceptConsent = useCallback(() => {
    localStorage.setItem(CONSENT_KEY, "true");
    setShowConsent(false);
  }, []);

  const requireConsent = useCallback((onAccepted: () => void) => {
    if (hasConsent()) {
      onAccepted();
    } else {
      setShowConsent(true);
    }
  }, [hasConsent]);

  return { hasConsent, showConsent, setShowConsent, acceptConsent, requireConsent };
}
