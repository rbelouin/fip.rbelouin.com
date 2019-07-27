export type FipNow = {
  playing_item: FipTimelineItem;
  song: FipSongOnAir;
};

export type FipTimelineItem = {
  start_time: number;
  end_time: number;
};

export type FipSongOnAir = {
  title: string;
  cover?: string | undefined;
  interpreters?: string[] | undefined;
  label?: string | undefined;
  album?: string | undefined;
};
