// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Page, Text, View } from '@react-pdf/renderer'
import styles from '../styles.js'
import picassoStyles from './picassoStyles.js'
import TimeColumn from './TimeColumn.jsx'
import DayColumn from './DayColumn.jsx'
import TimeColumnSpacer from './TimeColumnSpacer.jsx'
import DayHeader from './DayHeader.jsx'
import PicassoFooter from './PicassoFooter.jsx'
import YSLogo from './YSLogo.jsx'
import Categories from './Categories.jsx'
import { utcStringToTimestamp } from '@/common/helpers/dateHelperVCalendar.js'

function PicassoPage(props) {
  // Format: [hour, weight] where weight determines how tall the hour is rendered.
  // TODO This could also be generated depending on the schedule entries present in the camp:
  // e.g. give less weight to hours that contain no schedule entries, or detect which hour is best
  // for the "midnight" cutoff (so far everything also works with hours smaller than 0 or greater
  // than 23)
  const times = [
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 1],
    [5, 1],
    [6, 1],
    [7, 2],
    [8, 2],
    [9, 2],
    [10, 2],
    [11, 2],
    [12, 2],
    [13, 2],
    [14, 2],
    [15, 2],
    [16, 2],
    [17, 2],
    [18, 2],
    [19, 2],
    [20, 2],
    [21, 2],
    [22, 2],
    [23, 1],
    [24, 0], // this last hour is only needed for defining the length of the day, the weight should be 0
  ]

  const period = props.period
  const days = props.days
  const startDate = props.start.hour(times[0][0])
  const endDate = props.end.hour(times[0][0])
  const orientation = props.content.options.orientation
  const anyDayResponsibles = days.some((day) => day.dayResponsibles().items.length > 0)
  const scheduleEntries = period.scheduleEntries().items.filter((scheduleEntry) => {
    return (
      utcStringToTimestamp(scheduleEntry.start) < endDate &&
      utcStringToTimestamp(scheduleEntry.end) > startDate
    )
  })

  return (
    <Page
      size="A4"
      orientation={orientation === 'L' ? 'landscape' : 'portrait'}
      style={styles.page}
      key={period._meta.self}
    >
      <View style={picassoStyles.titleContainer}>
        <Text
          id={`${props.id}-${period.id}`}
          bookmark={{
            title: props.$tc('print.picasso.title', { period: period.description }),
            fit: true,
          }}
          style={{ ...styles.h1, ...picassoStyles.title }}
        >
          {props.$tc('print.picasso.title', { period: period.description })}
        </Text>
        <Text>{period.camp().organizer}</Text>
        {period.camp().printYSLogoOnPicasso ? (
          <YSLogo
            size={picassoStyles.ysLogo.size}
            styles={picassoStyles.ysLogo}
            locale={props.locale}
          />
        ) : (
          <React.Fragment />
        )}
      </View>
      <View style={{ ...picassoStyles.calendarContainer, border: '1pt solid white' }}>
        <TimeColumnSpacer times={times.slice(0, times.length - 1)} />
        {days.map((day) => (
          <DayHeader
            day={day}
            showDayResponsibles={anyDayResponsibles}
            key={day.id}
            styles={{
              borderLeft: day.id === days[0].id ? '1pt solid white' : '',
              borderRight: '1pt solid white',
            }}
            {...props}
          />
        ))}
        <TimeColumnSpacer times={times.slice(0, times.length - 1)} />
      </View>
      <View style={picassoStyles.calendarContainer}>
        <TimeColumn times={times.slice(0, times.length - 1)} align={'right'} />
        {days.map((day) => {
          return (
            <DayColumn
              key={day.id}
              styles={{
                borderLeft: day.id === days[0].id ? '1pt solid grey' : '',
                borderRight: '1pt solid grey',
              }}
              times={times}
              day={day}
              scheduleEntries={scheduleEntries}
            />
          )
        })}
        <TimeColumn times={times.slice(0, times.length - 1)} align={'left'} />
      </View>
      <Categories period={period} />
      <PicassoFooter period={period} {...props} />
    </Page>
  )
}

export default PicassoPage
