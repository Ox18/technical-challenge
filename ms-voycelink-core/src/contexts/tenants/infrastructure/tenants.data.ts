import { ComplianceRules } from '../domain/compliance-rules';

export interface TenantRecord {
  id: string;
  name: string;
  complianceRules: ComplianceRules;
}

export const TENANTS: TenantRecord[] = [
  {
    id: 'tenant-acme',
    name: 'Acme Corp',
    complianceRules: { headset_required: true, plain_background: true, dress_code: true, face_visible: true },
  },
  {
    id: 'tenant-globex',
    name: 'Globex Inc',
    complianceRules: { headset_required: false, plain_background: true, dress_code: false, face_visible: true },
  },
];
