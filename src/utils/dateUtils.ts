export function getTodayDate(): string {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString().split("T")[0];
}

export function generateTimeSlots(): string[] {
  const slots: string[] = [];
  const addSlots = (start: number, end: number) => {
    for (let h = start; h < end; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
      slots.push(`${String(h).padStart(2, "0")}:30`);
    }
  };
  addSlots(8, 11);
  addSlots(13, 18);
  return slots;
}
