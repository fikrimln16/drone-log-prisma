"use client";

import { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import FlightDetailModal from "./flights/flight-detail-modal";
import AddFlightModal from "./flights/add-flight-model";

type Props = {
  mission: string | null;
  onClose: () => void;
};

export default function MissionDetailModal({ mission, onClose }: Props) {
  const [flights, setFlights] = useState<any[]>([]);

  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  // const [openAdd, setOpenAdd] = useState(false);

  // const isChildOpen = openAdd || !!selectedFlight;

  useEffect(() => {
    if (!mission) return;

    fetch(`/api/missions/${mission}`)
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res)) {
          setFlights(res);
        }
      });
  }, [mission]);

  return (
    <>
      <Dialog open={!!mission} onOpenChange={onClose}>
        <DialogContent
          // onPointerDownOutside={(e) => {
          //   if (isChildOpen) e.preventDefault();
          // }}
          // onInteractOutside={(e) => {
          //   if (isChildOpen) e.preventDefault();
          // }}
          className="flex h-[700px] w-[1200px] flex-col overflow-hidden rounded-[32px] bg-white p-0 shadow-2xl"
        >
          {/* HEADER */}
          <div className="border-b px-8 py-7">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-3xl font-bold tracking-tight">
                  {mission}
                </DialogTitle>

                <p className="text-muted-foreground mt-2 text-lg">
                  {flights.length} flights logged
                </p>
              </div>

              {/* <Button
                className="h-11 rounded-xl px-5 text-base font-semibold"
                onClick={() => setOpenAdd(true)}
              >
                + Add Flight
              </Button> */}
            </div>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-auto px-8 py-8">
            {/* STATS */}
            <div className="mb-10 grid grid-cols-3 gap-6">
              {/* TOTAL FLIGHTS */}
              <div className="bg-background rounded-2xl border p-8">
                <h1 className="text-5xl font-bold">{flights.length}</h1>

                <p className="text-muted-foreground mt-3 text-sm tracking-wide">
                  TOTAL FLIGHTS
                </p>
              </div>

              {/* TOTAL DURATION */}
              <div className="bg-background rounded-2xl border p-8">
                <h1 className="text-5xl font-bold">
                  {flights.reduce((a, b) => a + b.duration_min, 0)} min
                </h1>

                <p className="text-muted-foreground mt-3 text-sm tracking-wide">
                  TOTAL DURATION
                </p>
              </div>

              {/* AVG DURATION */}
              <div className="bg-background rounded-2xl border p-8">
                <h1 className="text-5xl font-bold">
                  {Math.round(
                    flights.reduce((a, b) => a + b.duration_min, 0) /
                      (flights.length || 1)
                  )}{" "}
                  min
                </h1>

                <p className="text-muted-foreground mt-3 text-sm tracking-wide">
                  AVG DURATION
                </p>
              </div>
            </div>

            {/* TABLE TITLE */}
            <div className="mb-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Flight Logs
              </h2>
            </div>

            {/* TABLE */}
            <div className="rounded-2xl border">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="h-14">DATE</TableHead>

                    <TableHead>FLIGHT ID</TableHead>

                    <TableHead>BATTERY ID</TableHead>

                    <TableHead>DURATION</TableHead>

                    <TableHead>NOTES</TableHead>

                    <TableHead className="text-right">ACTION</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {flights.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30">
                      {/* DATE */}
                      <TableCell className="font-medium whitespace-nowrap">
                        {new Date(item.flight_date).toLocaleDateString(
                          "id-ID",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </TableCell>

                      {/* FLIGHT ID */}
                      <TableCell>
                        <div className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                          {item.flight_id}
                        </div>
                      </TableCell>

                      {/* BATTERY */}
                      <TableCell>{item.battery_id}</TableCell>

                      {/* DURATION */}
                      <TableCell>
                        <div className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                          {item.duration_min} min
                        </div>
                      </TableCell>

                      {/* NOTES */}
                      <TableCell className="max-w-[250px] truncate">
                        {item.notes}
                      </TableCell>

                      {/* ACTION */}
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          className="rounded-xl"
                          onClick={() => setSelectedFlight(item)}
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end border-t px-8 py-5">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* DETAIL MODAL */}
      {/* <AddFlightModal
        mission={mission || ""}
        open={openAdd}
        onClose={() => setOpenAdd(false)}
      /> */}
      <FlightDetailModal
        data={selectedFlight}
        onClose={() => setSelectedFlight(null)}
      />
    </>
  );
}
