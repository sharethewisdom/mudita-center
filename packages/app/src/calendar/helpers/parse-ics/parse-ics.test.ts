/**
 * Copyright (c) Mudita sp. z o.o. All rights reserved.
 * For licensing, see https://github.com/mudita/mudita-center/LICENSE.md
 */

import path from "path"
import parseIcs from "App/calendar/helpers/parse-ics/parse-ics"

test("correct amount of events returned from single file", async () => {
  const eventsFromSingleCalendar = await parseIcs([
    path.join(__dirname, "./calendar.ics"),
  ])
  expect(eventsFromSingleCalendar).toHaveLength(2)
})

test("single events don't have recurrence property", async () => {
  const eventsFromSingleCalendar = await parseIcs([
    path.join(__dirname, "./calendar.ics"),
  ])
  eventsFromSingleCalendar.forEach(event => expect(event).not.toHaveProperty("recurrence"))
})

test("correct amount of events returned from multiple files", async () => {
  const eventsFromMultipleCalendars = await parseIcs([
    path.join(__dirname, "./calendar.ics"),
    path.join(__dirname, "./calendar-recurring-events.ics"),
  ])
  expect(eventsFromMultipleCalendars).toHaveLength(3)
})

test("correct amount of events returned from calendar with recurring events", async () => {
  const recurringEvents = await parseIcs([
    path.join(__dirname, "./calendar-recurring-events.ics"),
  ])
  expect(recurringEvents).toHaveLength(1)
})

test("recurring events do have recurrence property", async () => {
  const recurringEvents = await parseIcs([
    path.join(__dirname, "./calendar-recurring-events.ics"),
  ])
  recurringEvents.forEach(event => expect(event).toHaveProperty("recurrence"))
})
