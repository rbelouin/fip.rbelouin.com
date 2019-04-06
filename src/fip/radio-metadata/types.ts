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
  titreAlbum: string;
  authors: string;
  anneeEditionMusique: number;
  label: string;
  visual: string;
};

export type FipLevel = {
  items: string[];
  position: number;
};
