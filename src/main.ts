import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RedocModule, RedocOptions } from 'nestjs-redoc';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { validationPipeConfig } from './validation-pipe.config';  // Import config

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  // Enable global validation pipe with shared config
  app.useGlobalPipes(new ValidationPipe(validationPipeConfig));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Banking Validation API')
    .setDescription('API for validating banking movements and balances')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  /**
   * SWAGGER / REDOC
   */
  const redocOptions: RedocOptions = {
    title: 'Banking Validation API Documentation',
    favicon: 'https://play-lh.googleusercontent.com/-FtfA_SxOkyrRFV5yIkUzI0l8KCKHKc5RrgFpqArk9SpO0MPpuGuLdQbb6vDhDonJw=w240-h480-rw',
    logo: {
      url: 'https://www.dougs.fr/static/0c7fb8882de67b0b9b9c998504e566ef/c973f/dougs-logo.webp',
      backgroundColor: '#F0F0F0',
    },
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
    // auth: {
    //   enabled: true,
    //   user: 'admin',
    //   password: '123'
    // },
    tagGroups: [
      {
        name: 'Validation',
        tags: ['movements']
      }
    ],
  };
  // Instead of using SwaggerModule.setup() you call this module
  await RedocModule.setup('/documentation', app as any, document, redocOptions);

  await app.listen(3000);
}
bootstrap();
