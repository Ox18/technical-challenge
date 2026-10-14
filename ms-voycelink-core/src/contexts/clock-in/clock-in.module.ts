import { Module } from '@nestjs/common';
import { TenantsModule } from '../tenants/tenants.module';
import { ComplianceModule } from '../compliance/compliance.module';
import { ClockInController } from './infrastructure/clock-in.controller';

@Module({
  imports: [TenantsModule, ComplianceModule],
  controllers: [ClockInController],
})
export class ClockInModule {}
