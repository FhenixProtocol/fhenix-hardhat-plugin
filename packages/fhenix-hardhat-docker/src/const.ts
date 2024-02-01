import { container_name, image } from "./config.json";

export const FHENIX_DEFAULT_IMAGE = image;
export const TASK_FHENIX_DOCKER_START = "localfhenix:start";
export const TASK_FHENIX_DOCKER_STOP = "localfhenix:stop";
export const LOCALFHENIX_CONTAINER_NAME = container_name;
export const SUBTASK_FHENIX_DOCKER_PULL = "localfhenix:pull"