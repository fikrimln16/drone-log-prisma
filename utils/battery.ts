export function getBatteryColor(percent: number) {
  if (percent <= 20) {
    return "bg-red-100 text-red-700";
  }

  if (percent <= 50) {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-green-100 text-green-700";
}
