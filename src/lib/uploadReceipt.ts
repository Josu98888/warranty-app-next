import { supabase } from "@/lib/supabase";

export async function uploadReceipt(file: File) {
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("receipts")
    .upload(fileName, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("receipts")
    .getPublicUrl(fileName);

  return publicUrl;
}
