<template>
  <dialog-form
    v-model="showDialog"
    :loading="loading"
    :error="error"
    icon="mdi-calendar-plus"
    :title="$tc('entity.activity.new')"
    :submit-action="createActivity"
    :submit-label="$tc('global.button.create')"
    submit-icon="mdi-plus"
    submit-color="success"
    :cancel-action="cancelCreate"
    max-width="700px"
  >
    <template #activator="scope">
      <slot name="activator" v-bind="scope" />
    </template>

    <dialog-activity-form :activity="entityData" :period="period" />
  </dialog-form>
</template>

<script>
import DialogForm from '@/components/dialog/DialogForm.vue'
import DialogBase from '@/components/dialog/DialogBase.vue'
import DialogActivityForm from './DialogActivityForm.vue'
import { uniqueId } from 'lodash'

export default {
  name: 'DialogActivityCreate',
  components: {
    DialogForm,
    DialogActivityForm,
  },
  extends: DialogBase,
  props: {
    scheduleEntry: { type: Object, required: true },

    // currently visible period
    period: { type: Function, required: true },
  },
  data() {
    return {
      entityProperties: ['title', 'location', 'scheduleEntries'],
      embeddedEntities: ['category'],
      entityUri: '/activities',
    }
  },
  watch: {
    showDialog: function (showDialog) {
      if (showDialog) {
        this.setEntityData({
          title: this.entityData?.title || this.$tc('entity.activity.new'),
          location: '',
          scheduleEntries: [
            {
              period: this.scheduleEntry.period,
              start: this.scheduleEntry.start,
              end: this.scheduleEntry.end,
              key: uniqueId(),
              deleted: false,
            },
          ],
        })
      } else {
        // clear the variable parts of the form on exit
        this.entityData.location = ''
        this.entityData.scheduleEntries = []
      }
    },
  },
  methods: {
    cancelCreate() {
      this.close()
    },
    createActivity() {
      const payloadData = {
        ...this.entityData,

        scheduleEntries:
          this.entityData.scheduleEntries
            ?.filter((entry) => !entry.deleted)
            .map((entry) => ({
              period: entry.period()._meta.self,
              start: entry.start,
              end: entry.end,
            })) || [],
      }

      return this.create(payloadData)
    },
    onSuccess(activity) {
      this.close()
      this.$emit('activityCreated', activity)
    },
  },
}
</script>

<style scoped></style>
