export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID");
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleString("id-ID");
}
