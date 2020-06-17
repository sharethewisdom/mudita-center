type Seconds = number

enum Unit {
  Minute = 60,
  Hour = Unit.Minute * 60,
  Day = Unit.Hour * 24,
}

const formatDuration = (
  seconds: Seconds,
  shortNotationOfZeroDuration: boolean = true
) => {
  let secondsLeft = seconds

  const countDuration = (unit: Unit) => {
    const unitsCount = Math.floor(secondsLeft / unit)
    secondsLeft -= unitsCount * unit
    return unitsCount
  }

  const duration: Record<string, number | string> = {
    d: countDuration(Unit.Day),
    h: countDuration(Unit.Hour),
    m: countDuration(Unit.Minute),
    s: secondsLeft,
  }

  const zeroNotation = shortNotationOfZeroDuration ? "0s" : "0m 0s"

  return (
    Object.keys(duration)
      .reduce((a, b) => {
        return duration[b] !== 0 ? (a += `${duration[b]}${b} `) : a
      }, "")
      .slice(0, -1) || zeroNotation
  )
}

export default formatDuration
