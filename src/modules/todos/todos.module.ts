import { Module, forwardRef } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { PrismaService } from '../../prisma.service';
import { GatewayModule } from '../gateway/gateway.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => GatewayModule),
    AuthModule
  ],
  controllers: [TodosController],
  providers: [TodosService, PrismaService],
})
export class TodosModule {}