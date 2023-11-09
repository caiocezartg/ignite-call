import React, { useEffect, useState } from "react";
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from "./styles";
import Calendar from "@/components/Calendar";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { api } from "@/lib/axios";

interface Availability {
  possibleTimesArray: number[];
  availableTimesArray: number[];
}

function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availability, setAvailability] = useState<Availability | null>(null);

  const router = useRouter();
  const username = String(router.query.username);

  const isDateSelected = !!selectedDate;

  const weekDay = selectedDate ? dayjs(selectedDate).format("dddd") : null;
  const fullDate = selectedDate
    ? dayjs(selectedDate).format("DD[ de ]MMMM")
    : null;

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    api
      .get(`/users/${username}/availability`, {
        params: {
          date: dayjs(selectedDate).format("YYYY-MM-DD"),
        },
      })
      .then((response) => {
        setAvailability(response.data);
      });
  }, [selectedDate, username]);

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar
        selectedDate={selectedDate}
        onDateSelected={setSelectedDate}
      />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader size="sm">
            {weekDay} <span>{fullDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability?.possibleTimesArray.map((hour) => {
              return (
                <TimePickerItem
                  key={hour}
                  disabled={!availability.availableTimesArray.includes(hour)}
                >
                  {String(hour).padStart(2, "0")}:00h
                </TimePickerItem>
              );
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  );
}

export default CalendarStep;
