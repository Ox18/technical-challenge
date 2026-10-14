import { Injectable } from '@nestjs/common';
import { ComplianceRules } from '../domain/compliance-rules';
import { TENANTS } from './tenants.data';

@Injectable()
export class TenantsRepository {
  async findAll() {
    return TENANTS.map(({ id, name }) => ({ id, name }));
  }

  async findComplianceRules(tenantId: string): Promise<ComplianceRules | null> {
    return TENANTS.find((tenant) => tenant.id === tenantId)?.complianceRules ?? null;
  }
}
