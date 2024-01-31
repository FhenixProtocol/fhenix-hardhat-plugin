import { config } from "../package.json";

export const FHENIX_DEFAULT_IMAGE = config.image;
export const TASK_FHENIX_DOCKER_START = "localfhenix:start";
export const TASK_FHENIX_DOCKER_STOP = "localfhenix:stop";
export const LOCALFHENIX_CONTAINER_NAME = "localfhenix_hh_plugin";
