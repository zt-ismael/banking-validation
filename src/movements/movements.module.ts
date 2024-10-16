import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { _baseUrl, MovementsController } from './movements.controller';
import { MovementsService } from './movements.service';
import { BodyMapperMiddleware } from './middlewares/body-mapper.middleware';

@Module({
  controllers: [MovementsController],
  providers: [MovementsService]
})
export class MovementsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BodyMapperMiddleware)  // Apply the middleware
      .forRoutes(`${_baseUrl}/*`);  // Only apply the middleware to the /movements/validation route
  }
}