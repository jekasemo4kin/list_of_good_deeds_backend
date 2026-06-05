import { Module, forwardRef } from '@nestjs/common';
import { TodoGateway } from './todo.gateway';
import { TodosModule } from '../todos/todos.module';

@Module({
  imports: [forwardRef(() => TodosModule)],
  providers: [TodoGateway],
  exports: [TodoGateway],
})
export class GatewayModule {}