// src/features/warranty/hooks/useReminderSettings.ts
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface ReminderSettingsData {
  email: string;
  send30DaysBefore: boolean;
  send7DaysBefore: boolean;
  send1DayBefore: boolean;
  sendOnExpiry: boolean;
}

export function useReminderSettings(initial: ReminderSettingsData) {
  const [email, setEmail] = useState(initial.email);
  const [send30DaysBefore, setSend30DaysBefore] = useState(
    initial.send30DaysBefore,
  );
  const [send7DaysBefore, setSend7DaysBefore] = useState(
    initial.send7DaysBefore,
  );
  const [send1DayBefore, setSend1DayBefore] = useState(initial.send1DayBefore);
  const [sendOnExpiry, setSendOnExpiry] = useState(initial.sendOnExpiry);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // Cargar settings desde Supabase al montar
  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (error || !data) {
        setError(error);
        setIsLoading(false);
        return;
      }

      setEmail(data.email);
      setSend30DaysBefore(data.send_30_days_before);
      setSend7DaysBefore(data.send_7_days_before);
      setSend1DayBefore(data.send_1_day_before);
      setSendOnExpiry(data.send_on_expiry);
      setIsLoading(false);
    }

    loadSettings();
  }, []);

  // Guardar settings en Supabase
  const saveSettings = useCallback(async () => {
    setIsSaving(true);
    setError(null);

    const { error } = await supabase
      .from("settings")
      .update({
        email,
        send_30_days_before: send30DaysBefore,
        send_7_days_before: send7DaysBefore,
        send_1_day_before: send1DayBefore,
        send_on_expiry: sendOnExpiry,
      })
      .eq("id", 1);

    setIsSaving(false);

    if (error) {
      setError(error);
      throw error;
    }
  }, [email, send30DaysBefore, send7DaysBefore, send1DayBefore, sendOnExpiry]);

  return {
    email,
    setEmail,
    send30DaysBefore,
    setSend30DaysBefore,
    send7DaysBefore,
    setSend7DaysBefore,
    send1DayBefore,
    setSend1DayBefore,
    sendOnExpiry,
    setSendOnExpiry,
    saveSettings,
    isLoading,
    isSaving,
    error,
  };
}
