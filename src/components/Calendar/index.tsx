import React, { useMemo, useState } from "react";
import {
  CalendarActions,
  CalendarBody,
  CalendarContainer,
  CalendarDay,
  CalendarHeader,
  CalendarTitle,
} from "./styles";
import { CaretLeft, CaretRight } from "phosphor-react";
import { getWeekDays } from "@/utils/get-week-days";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useRouter } from "next/router";

interface BlockedDates {
  blockedWeekDays: number[];
}

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelected: (date: Date) => void;
}

function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    return dayjs().set("date", 1);
  });

  function handlePreviousMonth() {
    const previousMonthDate = currentDate.subtract(1, "month");

    setCurrentDate(previousMonthDate);
  }

  function handleNextMonth() {
    const nextMonthDate = currentDate.add(1, "month");

    setCurrentDate(nextMonthDate);
  }

  const shortWeekDays = getWeekDays({ short: true });

  const currentMonth = currentDate.format("MMMM");
  const currentYear = currentDate.format("YYYY");

  const router = useRouter();
  const username = String(router.query.username);

  const { data: blockedDates } = useQuery<BlockedDates>({
    queryKey: [
      "blocked-dates",
      currentDate.get("year"),
      currentDate.get("month"),
    ],
    queryFn: async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: currentDate.get("year"),
          month: currentDate.get("month"),
        },
      });

      return response.data;
    },
  });

  const calendarWeeks = useMemo(() => {
    const daysInMonthArray = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, index) => {
      return {
        date: currentDate.set("date", index + 1),
        disabled: false,
      };
    });
    const firstWeekDay = currentDate.get("day");

    const previousMonthFillArray = Array.from({ length: firstWeekDay }).map(
      (_, index) => {
        return {
          date: currentDate.subtract(firstWeekDay - index, "day"),
          disabled: true,
        };
      }
    );

    const lastDayInCurrentMonth = currentDate.set(
      "date",
      currentDate.daysInMonth()
    );
    const lastWeekDay = lastDayInCurrentMonth.get("day");

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, index) => {
      return {
        date: lastDayInCurrentMonth.add(index + 1, "day"),
        disabled: true,
      };
    });

    const calendarDays = [
      ...previousMonthFillArray,
      ...daysInMonthArray.map((day) => {
        return {
          ...day,
          disabled:
            day.date.endOf("day").isBefore(new Date()) ||
            blockedDates?.blockedWeekDays.includes(day.date.get("day")),
        };
      }),
      ...nextMonthFillArray,
    ];

    const calendarWeeks = [];

    for (let i = 0; i < calendarDays.length; i += 7) {
      calendarWeeks.push({
        week: i / 7 + 1,
        days: calendarDays.slice(i, i + 7),
      });
    }

    return calendarWeeks;
  }, [currentDate, blockedDates]);

  return (
    <CalendarContainer>
      <CalendarHeader>
        <CalendarTitle>
          {currentMonth} <span>{currentYear}</span>
        </CalendarTitle>

        <CalendarActions>
          <button onClick={handlePreviousMonth}>
            <CaretLeft />
          </button>

          <button onClick={handleNextMonth}>
            <CaretRight />
          </button>
        </CalendarActions>
      </CalendarHeader>

      <CalendarBody>
        <thead>
          <tr>
            {shortWeekDays.map((weekDay) => {
              return <th key={weekDay}>{weekDay}.</th>;
            })}
          </tr>
        </thead>

        <tbody>
          {calendarWeeks.map(({ week, days }) => {
            return (
              <tr key={week}>
                {days.map(({ date, disabled }) => {
                  return (
                    <td key={date.toString()}>
                      <CalendarDay
                        disabled={disabled}
                        onClick={() => onDateSelected(date.toDate())}
                      >
                        {date.get("date")}
                      </CalendarDay>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </CalendarBody>
    </CalendarContainer>
  );
}

export default Calendar;
