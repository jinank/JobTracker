export interface MessageIndex {
  msg_id_internal: string;
  account_id: string;
  provider_message_id: string;
  provider_thread_id: string;
  rfc5322_message_id: string | null;
  from_domain: string;
  from_email: string;
  subject_text: string;
  received_at: number;
  snippet: string;
  processed: boolean;
}
