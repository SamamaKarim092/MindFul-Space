import { Resolver, Query } from '@nestjs/graphql';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class HealthStatus {
  @Field()
  status: string;

  @Field()
  timestamp: string;

  @Field()
  version: string;
}

@Resolver()
export class HealthResolver {
  @Query(() => HealthStatus, { name: 'health' })
  getHealth(): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
