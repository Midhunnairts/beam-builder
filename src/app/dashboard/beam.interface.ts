type SupportType = 'fixed' | 'roller' | 'pinned' | 'hing';
type LoadType = 'pin' | 'distributed' | 'triangular' | 'moment';

export interface BaseLoad {
  type: LoadType;
  position: number;
}

export interface FixedLoad extends BaseLoad {
  value: number;
  angle: number;
}



export interface DistributedLoad extends BaseLoad {
  value: number;
  start: number;
  end: number;
}

export interface TriangularLoad extends BaseLoad {
  start: number;
  end: number;
  startValue: number;
  endValue: number;
  value:number
}

export interface MomentLoad extends BaseLoad {
  value: number;
}

type Load = FixedLoad | DistributedLoad | TriangularLoad | MomentLoad;
export interface support {
    type: SupportType;
    position: number;
}

export interface Beam {
  length: number;
  support: support[];
  load: Load[];
}
