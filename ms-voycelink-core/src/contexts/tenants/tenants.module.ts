import { Module } from '@nestjs/common';
import { TenantsController } from './infrastructure/tenants.controller';
import { TenantsRepository } from './infrastructure/tenants.repository';

@Module({
  controllers: [TenantsController],
  providers: [TenantsRepository],
  exports: [TenantsRepository],
})
export class TenantsModule {}
