import { useState, useCallback } from "react";
import emailjs from "@emailjs/browser";

interface SendReminderEmailParams {
  toEmail: string;
  productName: string;
  expiryDate: string;
}

export function useReminderEmail() {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const sendReminderEmail = useCallback(
    async ({ toEmail, productName, expiryDate }: SendReminderEmailParams) => {
      setIsSending(true);
      setError(null);

      try {
        const result = await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          {
            to_email: toEmail,
            product_name: productName,
            expiry_date: expiryDate,
          },
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
        );
        return result;
      } catch (err: unknown) {
        console.error(err);
        setError(err);
        throw err;
      } finally {
        setIsSending(false);
      }
    },
    [],
  );

  return { sendReminderEmail, isSending, error };
}
