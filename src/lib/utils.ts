import { clsx, type ClassValue } from "clsx"
import L from "leaflet";
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatTime(timeStr: string): string {
  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatTimestampz(timestamp: string): string {
  return format(new Date(timestamp), "MMMM dd, yyyy");
}

export const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Critical': return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'Active': return 'bg-warning/10 text-warning border-warning/20';
    case 'Stable': return 'bg-success/10 text-success border-success/20';
    case 'Transferred': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Closed': return 'bg-muted text-muted-foreground border-muted-foreground/20';
    default: return 'bg-muted text-muted-foreground border-muted-foreground/20';
  }
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'Severe': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Moderate': return 'bg-warning/10 text-warning border-warning/20';
    case 'Mild': return 'bg-success/10 text-success border-success/20';
    default: return 'bg-muted text-muted-foreground border-muted-foreground/20';
  }
};

export const createCustomIcon = (status: string) => {
  const color = getStatusColor(status);
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 6px;
          height: 6px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Critical': return '#ef4444';
    case 'Active': return '#f59e0b';
    case 'Stable': return '#10b981';
    case 'Transferred': return '#3b82f6';
    case 'Closed': return '#6b7280';
    default: return '#6b7280';
  }
};

export const getAgeGroup = (age: number) => {
  if (age < 18) return 'Minor';
  if (age < 30) return 'Young Adult';
  if (age < 50) return 'Adult';
  if (age < 65) return 'Middle Aged';
  return 'Senior';
};

export const getAgeGroupColor = (age: number) => {
  const group = getAgeGroup(age);
  switch (group) {
    case 'Minor': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Young Adult': return 'bg-green-100 text-green-800 border-green-200';
    case 'Adult': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Middle Aged': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Senior': return 'bg-purple-100 text-purple-800 border-purple-200';
    default: return 'bg-muted text-muted-foreground border-muted-foreground/20';
  }
};

export const getSeverityBadgeColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return '#ef4444';
    case 'Severe': return '#f97316';
    case 'Moderate': return '#eab308';
    case 'Mild': return '#22c55e';
    default: return '#6b7280';
  }
};

export const createFullName = (
  firstName: string,
  lastName: string,
  middleName?: string,
  suffix?: string,
) => {
  return [firstName, middleName, lastName, suffix].filter(Boolean).join(" ");
};

export const getRandomCebuCoordinate = () => {
  // Cebu bounding box
  const latMin = 9.4;
  const latMax = 11.5;
  const lonMin = 123.3;
  const lonMax = 124.1;

  const latitude = (Math.random() * (latMax - latMin) + latMin).toFixed(6);
  const longitude = (Math.random() * (lonMax - lonMin) + lonMin).toFixed(6);

  return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
}