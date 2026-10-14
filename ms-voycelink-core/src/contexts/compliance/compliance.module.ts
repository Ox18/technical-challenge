import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IaClient } from './infrastructure/ia.client';

@Module({
  imports: [HttpModule],
  providers: [IaClient],
  exports: [IaClient],
})
export class ComplianceModule {}
