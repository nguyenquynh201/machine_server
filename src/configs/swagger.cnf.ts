import { DocumentBuilder, SwaggerCustomOptions } from "@nestjs/swagger";

const swaggerConfig = new DocumentBuilder()
    .setTitle('machine')
    .setDescription('machine')
    .setExternalDoc('Postman Collection', '/api-docs-json')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

const swaggerOption: SwaggerCustomOptions = {
    customSiteTitle: 'machine',
}
export { swaggerConfig, swaggerOption }
