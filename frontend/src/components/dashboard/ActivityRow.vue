<template>
  <tr class="row">
    <th style="text-align: left" class="tabular-nums" scope="row">
      <TextAlignBaseline
        ><span class="smaller">{{ scheduleEntry.number }}</span></TextAlignBaseline
      >
      <br />
      <CategoryChip small dense :category="category" class="d-sm-none" />
    </th>
    <td class="d-none d-sm-table-cell">
      <CategoryChip small dense :category="category" />
    </td>
    <td class="nowrap">
      {{ start }}<br />
      <span class="e-subtitle">{{ duration }}</span>
    </td>
    <td style="width: 100%" class="contentrow">
      <span style="display: inline-block">
        <router-link
          :to="routerLink"
          class="text-decoration-none text-decoration-hover-underline black--text font-weight-medium d-block"
        >
          {{ title }}
        </router-link>
      </span>

      <span
        v-if="$vuetify.breakpoint.mdAndUp"
        class="e-subtitle"
        style="font-size: 0.7em"
      >
        {{ progressLabel }}
      </span>

      <br />
      <span class="e-subtitle">{{ location }}</span>

      <template v-if="!$vuetify.breakpoint.mdAndUp">
        <br />
        <span class="e-subtitle" style="font-size: 0.7em">
          {{ progressLabel }}
        </span>
      </template>
    </td>
    <td class="contentrow avatarrow overflow-visible">
      <AvatarRow :camp-collaborations="collaborators" max-size="28" class="ml-auto" />
    </td>
  </tr>
</template>

<script>
import AvatarRow from '@/components/generic/AvatarRow.vue'
import CategoryChip from '@/components/generic/CategoryChip.vue'
import { dateHelperUTCFormatted } from '@/mixins/dateHelperUTCFormatted.js'
import TextAlignBaseline from '@/components/layout/TextAlignBaseline.vue'

export default {
  name: 'ActivityRow',
  components: { CategoryChip, AvatarRow, TextAlignBaseline },
  mixins: [dateHelperUTCFormatted],
  props: {
    scheduleEntry: { type: Object, required: true },
  },
  computed: {
    collaborators() {
      return this.scheduleEntry
        .activity()
        .activityResponsibles()
        .items.map((responsible) => responsible.campCollaboration())
    },
    category() {
      return this.scheduleEntry.activity().category()
    },
    title() {
      return this.scheduleEntry.activity().title
    },
    progressLabel() {
      return this.scheduleEntry.activity().progressLabel?.().title
    },
    location() {
      return this.scheduleEntry.activity().location
    },
    start() {
      return this.hourShort(this.scheduleEntry.start)
    },
    duration() {
      return this.timeDurationShort(this.scheduleEntry.start, this.scheduleEntry.end)
    },
    routerLink() {
      return {
        name: 'activity',
        params: {
          campId: this.scheduleEntry.period().camp().id,
          scheduleEntryId: this.scheduleEntry.id,
        },
      }
    },
  },
}
</script>

<style scoped>
.row {
  display: table-row;
  vertical-align: baseline;
}

tr + tr :is(td, th) {
  border-top: 1px solid #ddd;
}

:is(td, th) {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

:is(td, th) + :is(td, th) {
  padding-left: 0.5rem;
}

.contentrow {
  max-width: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.avatarrow {
  vertical-align: middle;
}

.e-subtitle {
  font-size: 0.9em;
  color: #666;
}

.nowrap {
  white-space: nowrap;
}

.smaller {
  font-size: 0.75em;
}

.text-decoration-hover-underline:hover {
  text-decoration: underline !important;
}
</style>
