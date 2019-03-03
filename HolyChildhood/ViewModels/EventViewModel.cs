﻿using System;

namespace HolyChildhood.ViewModels
{
    public class EventViewModel
    {
        public int Id { get; set; }
        public int CalendarId { get; set; }
        public string Title { get; set; }
        public DateTime Start { get; set; }
        public DateTime? End { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public string Notes { get; set; }
        public bool AllDay { get; set; }
        public int EventTypeId { get; set; }
        public string EventTypeName { get; set; }
        public string Color { get; set; }

        // Recurrence Data
        public bool IsRecurring { get; set; }
        public Guid? RecurrenceId { get; set; }
        public bool Annualy { get; set; }
        public bool Monthly { get; set; }
        public bool Weekly { get; set; }
        public bool UpdateRecurrence { get; set; }

        // Compatibility for Timezone offsets when adding/editing events
        public int StartMonth { get; set; }
        public int StartDay { get; set; }
        public int StartYear { get; set; }
        public int StartHour { get; set; }
        public int StartMinute { get; set; }

        public int EndMonth { get; set; }
        public int EndDay { get; set; }
        public int EndYear { get; set; }
        public int EndHour { get; set; }
        public int EndMinute { get; set; }
    }
}