export type Flight = {
  id: number;

  flight_date: string;

  ama: string;

  estate: string;

  flight_id: string;

  mission_name: string;

  battery_id: string;

  battery_id_2: string;

  battery_color: string;

  start_percent: number;

  end_percent: number;

  start_volt: number;

  end_volt: number;

  start_time: string;

  end_time: string;

  duration_min: number;

  notes: string;
};

export type SortKey =
  | "flight_date"
  | "ama"
  | "estate"
  | "flight_id"
  | "battery_id"
  | "duration_min"
  | "notes";
