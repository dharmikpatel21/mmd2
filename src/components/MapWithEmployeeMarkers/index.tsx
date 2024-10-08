"use client";
import React, { useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Spinner from "../Spinner";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

type Props = {
  empDataWithCoordinates: Record<string, any>[];
  loading: boolean;
};

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapWithEmployeeMarkers = ({ empDataWithCoordinates, loading }: Props) => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const uniqueCoordinates = new Set<string>();

  return (
    <>
      <Sheet
        open={!!selectedEmployee}
        onOpenChange={() => setSelectedEmployee(null)}
      >
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm z-10 w-[600px] max-md:w-[400px] max-sm:[200px] aspect-square border">
              <Spinner />
            </div>
          )}
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={2}
            style={{ isolation: "isolate" }}
            className="w-[600px] max-md:w-[400px] max-sm:[200px] aspect-square"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {empDataWithCoordinates.map((employee, index) => {
              const lat = parseFloat(employee?.coordinates?.lat);
              const lng = parseFloat(employee?.coordinates?.lon);
              const position = `${lat},${lng}`;

              if (uniqueCoordinates.has(position)) {
                return null;
              }
              uniqueCoordinates.add(position);

              const employeeCount = empDataWithCoordinates.filter(
                (emp) =>
                  parseFloat(emp?.coordinates?.lat) === lat &&
                  parseFloat(emp?.coordinates?.lon) === lng
              ).length;

              return (
                <Marker
                  key={position}
                  position={{ lat, lng }}
                  icon={DefaultIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedEmployee(employee);
                    },
                  }}
                >
                  {selectedEmployee &&
                    selectedEmployee.EmpID === employee.EmpID && (
                      <SheetContent className="overflow-y-scroll flex flex-col gap-4 max-w-[500px] w-full">
                        <SheetHeader>
                          <SheetTitle>
                            total employees:{employeeCount}
                          </SheetTitle>
                        </SheetHeader>
                        <div className="flex flex-col  gap-4">
                          {empDataWithCoordinates
                            .filter(
                              (emp) =>
                                parseFloat(emp?.coordinates?.lat) === lat &&
                                parseFloat(emp?.coordinates?.lon) === lng
                            )
                            .map((emp) => (
                              <div
                                key={emp.EmpID}
                                className="rounded-lg p-2 border border-black"
                              >
                                <div className="flex gap-2">
                                  <span className="font-semibold">
                                    AccountSPOC:
                                  </span>
                                  <span>{emp.AccountSPOC}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="font-semibold">
                                    Designation:
                                  </span>
                                  <span>{emp.Designation}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="font-semibold">EmpID:</span>
                                  <span>{emp.EmpID}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="font-semibold">
                                    EmpName:
                                  </span>
                                  <span>{emp.EmpName}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="font-semibold">
                                    Experience:
                                  </span>
                                  <span>{emp.Experience}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="font-semibold">
                                    PhoneNo:
                                  </span>
                                  <span>{emp.PhoneNo}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="font-semibold">Skills:</span>
                                  <span>{emp.Skills}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="font-semibold">
                                    Primary Skills:
                                  </span>
                                  <span className="break-all">
                                    {emp["Primary Skills "]}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="font-semibold">
                                    Resource Status:
                                  </span>
                                  <span>{emp["Resource Status"]}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="font-semibold">
                                    Location:
                                  </span>
                                  <span>{emp.Location}</span>
                                </div>

                                {/* <p>
                                      Latitude and Longitude:{" "}
                                      {emp.coordinates.lat},{" "}
                                      {emp.coordinates.lon}
                                    </p> */}
                              </div>
                            ))}
                        </div>
                      </SheetContent>
                    )}
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </Sheet>
    </>
  );
};

export default MapWithEmployeeMarkers;
