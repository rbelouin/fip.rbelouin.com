export type FipLiveMeta = {
  steps: {
    [stepId: string]: FipStep;
  };
  levels: FipLevel[];
};

export type FipStep = {
  uuid: string;
  start: number;
  end: number;
  title: string;
  titreAlbum?: string | undefined;
  authors?: string | undefined;
  anneeEditionMusique?: number | undefined;
  label?: string | undefined;
  visual?: string | undefined;
};

export type FipLevel = {
  items: string[];
  position: number;
};
