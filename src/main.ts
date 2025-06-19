import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  // Swagger 세팅
  const config = new DocumentBuilder()
    .setTitle('sungwoo blog api')
    .setDescription('it is my blog')
    .setVersion('1.0')
    .addTag('sungwoo')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = configService.get<number>('SERVER_PORT') || 3000;
  await app.listen(port);
}
bootstrap();
