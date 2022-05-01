import { inject } from "vue";

export interface ContainerI {}

export const containerKey = Symbol("container");

export function injectContainer(): ContainerI {
  return inject(containerKey) as ContainerI;
}

export function createContainer(): ContainerI {
  return {};
}
