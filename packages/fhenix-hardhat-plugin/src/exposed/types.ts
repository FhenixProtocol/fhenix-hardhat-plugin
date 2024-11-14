export type ExposureItem = {
  name: string;
  type: string;
  position: number;
  children: ExposureItem[];
  count: number;
};
export type FuncExposures = {
  func: any;
  exposures: ExposureItem[];
  count: number;
};
export type ContractExposures = {
  contract: string;
  funcExposures: FuncExposures[];
  count: number;
};
