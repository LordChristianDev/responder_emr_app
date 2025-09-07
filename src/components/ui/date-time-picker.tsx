"use client";

import * as React from "react";
import { add, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "./time-picker";

interface DateTimePickerProps extends Omit<React.ComponentProps<"input">, "type"> {
	// Additional props specific to DateTimePicker can go here if needed
}

export const DateTimePicker = React.forwardRef<HTMLInputElement, DateTimePickerProps>(
	({ className, value, defaultValue, onChange, onBlur, name, disabled, ...props }, ref) => {
		// Use value prop (from RHF) or fallback to defaultValue
		const [date, setDate] = React.useState<Date | undefined>(() => {
			const initialValue = (value as string) || (defaultValue as string);
			if (initialValue) {
				return new Date(initialValue);
			}
			return undefined;
		});

		/**
		 * carry over the current time when a user clicks a new day
		 * instead of resetting to 00:00
		 */
		const handleSelect = (newDay: Date | undefined) => {
			if (!newDay) return;
			let newDate: Date;

			if (!date) {
				newDate = newDay;
			} else {
				const diff = newDay.getTime() - date.getTime();
				const diffInDays = diff / (1000 * 60 * 60 * 24);
				newDate = add(date, { days: Math.ceil(diffInDays) });
			}

			setDate(newDate);
			handleDateChange(newDate);
		};

		// Handle date/time changes and notify React Hook Form
		const handleDateChange = (newDate: Date | undefined) => {
			if (onChange) {
				const formattedDate = newDate ? format(newDate, "yyyy-MM-dd HH:mm:ss") : "";
				// Create a synthetic event for React Hook Form compatibility
				const syntheticEvent = {
					target: {
						value: formattedDate,
						name: name || "",
					},
					type: "change"
				} as React.ChangeEvent<HTMLInputElement>;

				onChange(syntheticEvent);
			}
		};

		// Handle time picker changes
		const handleTimeChange = (newDate: Date | undefined) => {
			setDate(newDate);
			handleDateChange(newDate);
		};

		// Handle blur event
		const handleBlur = () => {
			if (onBlur) {
				const syntheticEvent = {
					target: {
						value: date ? format(date, "yyyy-MM-dd HH:mm:ss") : "",
						name: name || "",
					},
					type: "blur"
				} as React.FocusEvent<HTMLInputElement>;

				onBlur(syntheticEvent);
			}
		};

		// Effect to handle external value changes (from RHF)
		React.useEffect(() => {
			const currentValue = (value as string) || (defaultValue as string);
			if (currentValue) {
				setDate(new Date(currentValue));
			} else {
				setDate(undefined);
			}
		}, [value, defaultValue]);

		return (
			<>
				{/* Hidden input for React Hook Form */}
				<input
					ref={ref}
					type="hidden"
					name={name}
					value={date ? format(date, "yyyy-MM-dd HH:mm:ss") : ""}
					{...props}
				/>

				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							disabled={disabled}
							onBlur={handleBlur}
							className={cn(
								"w-full justify-start text-left font-normal",
								!date && "text-muted-foreground",
								className
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{date ? format(date, "PPP HH:mm:ss") : <span>Pick a date</span>}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={date}
							onSelect={handleSelect}
							disabled={disabled}
							initialFocus
						/>
						<div className="p-3 border-t border-border">
							<TimePicker
								setDate={handleTimeChange}
								date={date}
							/>
						</div>
					</PopoverContent>
				</Popover>
			</>
		);
	}
);

DateTimePicker.displayName = "DateTimePicker";