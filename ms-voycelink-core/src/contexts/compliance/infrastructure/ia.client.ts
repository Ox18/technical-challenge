import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ComplianceRules } from '@/contexts/tenants/domain/compliance-rules';

export interface IaViolation {
  rule: string;
  reason: string;
}

export interface IaValidateResponse {
  compliant: boolean;
  violations: IaViolation[];
  confidence: number;
  model: string;
  trace_id: string;
}

@Injectable()
export class IaClient {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async validate(imageBase64: string, rules: ComplianceRules): Promise<IaValidateResponse> {
    const { data } = await firstValueFrom(
      this.http.post<IaValidateResponse>(
        `${this.config.get('IA_URL')}/validate`,
        { image: imageBase64, rules },
        { headers: { 'X-Internal-Key': this.config.get('IA_INTERNAL_KEY') } },
      ),
    );
    return data;
  }
}
