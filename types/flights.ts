export type Flight = {
  id: number;

  flight_date: string;
  flight_id: string;
  mission_name: string;

  battery_id: string;
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