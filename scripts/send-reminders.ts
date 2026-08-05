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
      settings.send_30_days_before &&
      daysRemaining === 30 &&
      !product.notification_30_days
    ) {
      subject = "Tu garantía vence en 30 días";

      message =
        `La garantía de ${product.name} vence el ${expiryDate.toLocaleDateString()}.`;

      fieldToUpdate = "notification_30_days";
    }

    else if (
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
    let statusText = "";

    if (daysRemaining > 1) {
      statusText = `Faltan ${daysRemaining} días para el vencimiento de esta garantía.`;
    }
    else if (daysRemaining === 1) {
      statusText = "La garantía vence mañana.";
    }
    else if (daysRemaining === 0) {
      statusText = "La garantía vence hoy.";
    }
    else {
      statusText = `La garantía ha vencido hace ${Math.abs(daysRemaining)} día(s).`;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: settings.email,
      subject,
      html: `
  <div style="
    font-family: Arial, Helvetica, sans-serif;
    background-color: #f4f7fb;
    padding: 30px;
  ">
    <div style="
      max-width: 650px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    ">

      <div style="
        background: #163b79;
        color: white;
        padding: 25px;
        text-align: center;
      ">
        <h1 style="margin:0;">🛡️ Warranty Tracker</h1>
        <p style="margin-top:8px;">
          Seguimiento de garantías y recordatorios
        </p>
      </div>

      <div style="padding: 30px;">

        <h2 style="color:#163b79;">
          ${subject}
        </h2>

        <p>
          Este es un recordatorio automático generado por
          <strong>Warranty Tracker</strong>.
        </p>

        <div style="
          background:#f8fafc;
          border-left:4px solid #163b79;
          padding:15px;
          border-radius:8px;
          margin:20px 0;
        ">
          <p><strong>Producto:</strong> ${product.name}</p>
          <p><strong>Vencimiento:</strong> ${expiryDate.toLocaleDateString()}</p>
          <p>
  <strong>${statusText}</strong>
</p>
        </div>

        <p>
  Este recordatorio fue generado automáticamente para ayudarte
  a mantener el control de las garantías registradas en
  Warranty Tracker.
</p>

      </div>

      <div style="
        background:#f1f5f9;
        padding:15px;
        text-align:center;
        color:#64748b;
        font-size:12px;
      ">
        Este correo fue enviado automáticamente por Warranty Tracker.
      </div>

    </div>
  </div>
  `,
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