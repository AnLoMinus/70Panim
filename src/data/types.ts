export interface Method {
  id: string;
  name: string;
  description: string;
}

export interface LevelData {
  level: number;
  title: string;
  description?: string;
  baseColor: string;
  methods: Method[];
}
