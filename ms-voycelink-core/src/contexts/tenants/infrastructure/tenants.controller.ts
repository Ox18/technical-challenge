import { Controller, Get } from '@nestjs/common';
import { TenantsRepository } from './tenants.repository';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenants: TenantsRepository) {}

  @Get()
  findAll() {
    return this.tenants.findAll();
  }
}
