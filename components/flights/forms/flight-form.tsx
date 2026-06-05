import FlightInput from "./flight-input";

import BatterySelect from "./battery-select";

import FlightFormSection from "./flight-form-section";

type Props = {
  form: any;

  setForm: any;

  errors: any;

  disableFlightId?: boolean;
};

export default function FlightForm({
  form,
  setForm,
  errors,
  disableFlightId,
}: Props) {
  return (
    <div className="space-y-10">
      {/* INFO */}
      <FlightFormSection title="Flight Information">
        <div className="grid grid-cols-2 gap-6">
          <FlightInput
            label="Flight Date"
            type="date"
            value={form.flight_date}
            error={errors.flight_date}
            onChange={(value) =>
              setForm({
                ...form,
                flight_date: value,
              })
            }
          />

          <FlightInput
            disabled={disableFlightId}
            label="Flight ID"
            value={form.flight_id}
            error={errors.flight_id}
            onChange={(value) =>
              setForm({
                ...form,
                flight_id: value,
              })
            }
          />

          <FlightInput
            label="AMA"
            value={form.ama}
            error={errors.ama}
            onChange={(value) =>
              setForm({
                ...form,
                ama: value,
              })
            }
          />

          <FlightInput
            label="Estate"
            value={form.estate}
            error={errors.estate}
            onChange={(value) =>
              setForm({
                ...form,
                estate: value,
              })
            }
          />

          <FlightInput
            label="Mission Name"
            value={form.mission_name}
            error={errors.mission_name}
            onChange={(value) =>
              setForm({
                ...form,
                mission_name: value,
              })
            }
          />

          <FlightInput
            label="Battery ID"
            value={form.battery_id}
            error={errors.battery_id}
            onChange={(value) =>
              setForm({
                ...form,
                battery_id: value,
              })
            }
          />

          <FlightInput
            label="Battery ID 2"
            value={form.battery_id_2}
            error={errors.battery_id_2}
            onChange={(value) =>
              setForm({
                ...form,
                battery_id_2: value,
              })
            }
          />

          <BatterySelect
            label="Battery Color"
            value={form.battery_color}
            error={errors.battery_color}
            onChange={(value) =>
              setForm({
                ...form,
                battery_color: value,
              })
            }
          />
        </div>
      </FlightFormSection>
    </div>
  );
}
