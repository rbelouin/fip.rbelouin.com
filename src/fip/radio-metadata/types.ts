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
  authors: string;
  anneeEditionMusique?: number | undefined;
  label?: string | undefined;
  visual: string;
};

export type FipLevel = {
  items: string[];
  position: number;
};
