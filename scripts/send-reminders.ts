import "dotenv/config";
console.log("SUPABASE_URL =", process.env.SUPABASE_URL);
console.log(
  "SUPABASE_SERVICE_KEY existe =",
  !!process.env.SUPABASE_SERVICE_KEY
);
import { createClient } from "@supabase/supabase-js";
import { addMonths, differenceInCalendarDays } from "date-fns";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function main() {
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (!settings?.email) {
    console.log("No hay email configurado");
    return;
  }

  const { data: products } = await supabase
    .from("products")
    .select("*");

  if (!products) return;

  const today = new Date();

  for (const product of products) {

    const expiryDate = addMonths(
      new Date(product.purchase_date),
      product.duration_months
    );

    const daysRemaining = differenceInCalendarDays(
      expiryDate,
      today
    );

    let subject = "";
    let message = "";
    let fieldToUpdate = "";

    if (
      settings.send_7_days_before &&
      daysRemaining === 7 &&
      !product.notification_7_days
    ) {
      subject = "Tu garantía vence en 7 días";
      message =
        `La garantía de ${product.name} vence el ${expiryDate.toLocaleDateString()}.`;

      fieldToUpdate = "notification_7_days";
    }

    else if (
      settings.send_1_day_before &&
      daysRemaining === 1 &&
      !product.notification_1_day
    ) {
      subject = "Tu garantía vence mañana";

      message =
        `La garantía de ${product.name} vence mañana.`;

      fieldToUpdate = "notification_1_day";
    }

    else if (
      settings.send_on_expiry &&
      daysRemaining <= 0 &&
      !product.notification_expired
    ) {
      subject = "Tu garantía ha vencido";

      message =
        `La garantía de ${product.name} ya ha vencido.`;

      fieldToUpdate = "notification_expired";
    }

    else {
      continue;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: settings.email,
      subject,
      text: message,
    });
    await supabase
      .from("products")
      .update({
        [fieldToUpdate]: true,
      })
      .eq("id", product.id);

    console.log(`Correo enviado: ${product.name}`

    );
  }
}

main();