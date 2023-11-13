import React, { useState } from "react";
import CalendarStep from "./CalendarStep";
import ConfirmStep from "./ConfirmStep";

function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>();

  function handleClearSelectedDateTime() {
    setSelectedDateTime(null);
  }

  if (selectedDateTime) {
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        handleClearSelectedDateTime={handleClearSelectedDateTime}
      />
    );
  }

  return <CalendarStep onSelectDateTime={setSelectedDateTime} />;
}

export default ScheduleForm;
