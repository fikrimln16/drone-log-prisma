export type Mission = {
  mission_name: string;

  total_flights: number;

  total_duration: number;

  avg_duration: number;

  last_flight: string;
};

export type LowBatteryFlight = {
  flight_id: string;

  battery_id: string;

  end_percent: number;
};

export type ActiveFlight = {
  id: number;

  flight_id: string;

  mission_name: string;

  battery_id: string;

  start_time: string;

  end_time: string;

  duration_min: number;

  end_percent: number;
};

export type DashboardStats = {
  total_missions: number;

  total_flights: number;

  total_duration: number;

  avg_duration: number;

  active_flights: number;

  battery_alerts: number;

  latest_upload: string;

  mission_growth: number;

  flight_growth: number;

  duration_growth: number;

  avg_growth: number;

  active_flight_list: ActiveFlight[];

  low_battery_flights: LowBatteryFlight[];
};

export type SortKey =
  | "mission_name"
  | "last_flight"
  | "total_flights"
  | "total_duration"
  | "avg_duration";
