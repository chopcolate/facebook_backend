import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

require('dotenv').config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT || 9000);
  console.log("App listening on port " + process.env.PORT);
}
bootstrap();
