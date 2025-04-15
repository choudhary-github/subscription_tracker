export interface EmailTemplateData {
  userName: string;
  subscriptionName: string;
  renewalDate: string;
  planName: string;
  price: string;
  paymentMethod: string;
  accountSettingsLink?: string;
  supportLink?: string;
  daysLeft?: number;
}

export interface EmailTemplateConfig {
  label: string;
  generateSubject: (data: EmailTemplateData) => string;
  generateBody: (data: EmailTemplateData) => string;
}
