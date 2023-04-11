import { Error401Component } from './error-401/error-401.component';
import { Error404Component } from './error-404/error-404.component';
import { Error408Component } from './error-408/error-408.component';
import { Error500Component } from './error-500/error-500.component';

export const containers = [Error401Component, Error404Component,Error408Component, Error500Component];

export * from './error-401/error-401.component';
export * from './error-404/error-404.component';
export * from './error-500/error-500.component';
export * from './error-408/error-408.component';