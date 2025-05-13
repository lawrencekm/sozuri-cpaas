// CampaignTemplate type
export default interface CampaignTemplate {
  id: string;
  project_id: string;
  name: string;
  channel: 'sms' | 'whatsapp' | 'viber' | 'rcs' | 'voice';
  content: string;
  type: 'transactional' | 'marketing' | 'notification' | 'reminder';
  variables: string[];
  created_at: string;
  updated_at: string;
}

// CampaignAutomation type
export interface CampaignAutomation {
  id: string;
  project_id: string;
  name: string;
  trigger_event: string;
  campaign_template_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
