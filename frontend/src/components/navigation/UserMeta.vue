<template>
  <v-menu
    v-if="authUser"
    v-model="open"
    offset-y
    dark
    right
    :content-class="
      ['ec-usermenu', $vuetify.breakpoint.xsOnly && 'rounded-lg mt-2'].join(' ')
    "
    transition="slide-y-transition"
    :close-on-content-click="false"
    z-index="5"
  >
    <template #activator="{ on, value, attrs }">
      <v-toolbar-items v-if="!avatarOnly">
        <v-btn
          right
          text
          v-bind="attrs"
          :class="[btnClasses, { 'v-btn--open': value }]"
          v-on="on"
        >
          <user-avatar v-if="authUser" :user="authUser" :size="40" />
          <span class="sr-only-sm-and-down mx-3">
            {{ authUser.displayName }}
          </span>
        </v-btn>
      </v-toolbar-items>
      <v-btn
        v-else
        fab
        text
        v-bind="attrs"
        :class="[btnClasses, { 'v-btn--open': value }]"
        v-on="on"
      >
        <user-avatar v-if="authUser" :user="authUser" :size="40" />
        <span class="sr-only-sm-and-down mx-3">
          {{ authUser.displayName }}
        </span>
      </v-btn>
    </template>
    <v-list dense class="user-nav" tag="ul" light color="blue-grey lighten-5">
      <v-list-item
        tag="li"
        block
        :to="{ name: 'profile', query: { isDetail: true } }"
        @click="open = false"
      >
        <v-icon left>mdi-account</v-icon>
        <span>{{ $tc('components.navigation.userMeta.profile') }}</span>
      </v-list-item>
      <v-list-item block tag="li" exact :to="{ name: 'camps' }" @click="open = false">
        <v-icon left>mdi-format-list-bulleted-triangle</v-icon>
        <span>{{ $tc('components.navigation.userMeta.myCamps') }}</span>
      </v-list-item>
      <v-list-item block tag="li" @click="logout">
        <v-progress-circular
          v-if="logoutInProgress"
          indeterminate
          size="18"
          class="mr-2"
        />
        <v-icon v-else left>mdi-logout</v-icon>

        <span>{{ $tc('components.navigation.userMeta.logOut') }}</span>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import UserAvatar from '../user/UserAvatar.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'UserMeta',
  components: { UserAvatar },
  props: {
    avatarOnly: {
      type: Boolean,
      default: false,
    },
    btnClasses: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      open: false,
      logoutInProgress: false,
    }
  },
  computed: {
    ...mapGetters({
      authUser: 'getLoggedInUser',
    }),
  },
  methods: {
    async logout() {
      this.logoutInProgress = true
      await this.$auth.logout()
      this.logoutInProgress = false
    },
  },
}
</script>
