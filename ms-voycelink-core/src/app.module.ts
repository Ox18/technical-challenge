import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TenantsModule } from './contexts/tenants/tenants.module';
import { ComplianceModule } from './contexts/compliance/compliance.module';
import { ClockInModule } from './contexts/clock-in/clock-in.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TenantsModule, ComplianceModule, ClockInModule],
  controllers: [AppController],
})
export class AppModule {}
