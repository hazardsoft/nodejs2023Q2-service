import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';

export const ApiCreateDecorators = (entityName: string) => {
  return applyDecorators(
    ApiOperation({
      summary: `Add new ${entityName}`,
      description: `Adds new ${entityName}`,
    }),
    ApiCreatedResponse({
      description: `${entityName} is created`,
      schema: { $ref: getSchemaPath(entityName) },
    }),
    ApiBadRequestResponse({
      description: 'Bad request: body does not contain required fields',
    }),
  );
};

export const ApiGetAllDecorators = (entityName: string) => {
  return applyDecorators(
    ApiOperation({
      summary: `Get list of ${entityName}s`,
      description: `Gets list of ${entityName}s`,
    }),
  );
};

export const ApiGetOneDecorators = (entityName: string) => {
  return applyDecorators(
    ApiOperation({
      summary: `Get single ${entityName} by id`,
      description: `Gets single ${entityName} by id`,
    }),
    ApiBadRequestResponse({
      description: 'Bad request: id is invalid (not uuid)',
    }),
    ApiNotFoundResponse({
      description: `${entityName} was not found`,
    }),
  );
};

export const ApiPutDecorators = (entityName: string) => {
  return applyDecorators(
    ApiOperation({
      summary: `Update ${entityName}'s information`,
      description: `Updates ${entityName}'s information by UUID`,
    }),
    ApiBadRequestResponse({
      description: 'Bad request: id is invalid (not uuid)',
    }),
    ApiNotFoundResponse({
      description: `${entityName} was not found`,
    }),
  );
};

export const ApiDeleteDecorators = (entityName: string) => {
  return applyDecorators(
    ApiOperation({
      summary: `Delete ${entityName}`,
      description: `Deletes ${entityName}`,
    }),
    ApiNoContentResponse({ description: `${entityName} deleted successfully` }),
    ApiBadRequestResponse({
      description: 'Bad request: id is invalid (not uuid)',
    }),
    ApiNotFoundResponse({
      description: `${entityName} was not found`,
    }),
  );
};
