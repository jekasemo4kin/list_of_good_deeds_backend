import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TodosModule } from './modules/todos/todos.module';
import { GatewayModule } from './modules/gateway/gateway.module';

@Module({
  imports: [AuthModule, TodosModule, GatewayModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],              
})
export class AppModule {}