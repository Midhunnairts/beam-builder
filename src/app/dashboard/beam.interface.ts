type SupportType = 'fixed' | 'roller' | 'pinned' | 'hing';
type LoadType = 'fixed' | 'distributed' | 'triangular' | 'moment';

interface BaseLoad {
  type: LoadType;
  position: number;
}

interface FixedLoad extends BaseLoad {
  value: number;
  angle: number;
}

interface DistributedLoad extends BaseLoad {
  value: number;
  start: number;
  end: number;
}

interface TriangularLoad extends BaseLoad {
  start: number;
  end: number;
  startValue: number;
  endValue: number;
}

interface MomentLoad extends BaseLoad {
  value: number;
}

type Load = FixedLoad | DistributedLoad | TriangularLoad | MomentLoad;
interface support {
    type: SupportType;
    position: number;
}

export interface Beam {
  length: number;
  support: support[];
  load: Load[];
}
