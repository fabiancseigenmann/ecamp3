<template>
  <component
    :is="contentNodeComponent"
    v-if="contentNodeComponent"
    :content-node="contentNode"
  />
  <Text v-else>{{ contentTypeName }}</Text>
</template>
<script>
import PdfComponent from '@/PdfComponent.js'
import ColumnLayout from './ColumnLayout.vue'
import LAThematicArea from './LAThematicArea.vue'
import Storyboard from './Storyboard.vue'
import Notes from './Notes.vue'
import SafetyConcept from './SafetyConcept.vue'
import Material from './Material.vue'
import Storycontext from './Storycontext.vue'

export default {
  name: 'ContentNode',
  extends: PdfComponent,
  props: {
    contentNode: { type: Object, required: true },
  },
  computed: {
    contentTypeName() {
      return this.contentNode.contentTypeName
    },
    contentNodeComponent() {
      return {
        ColumnLayout,
        LAThematicArea,
        Storyboard,
        Notes,
        SafetyConcept,
        Material,
        Storycontext,
      }[this.contentTypeName]
    },
  },
}
</script>
<pdf-style>
.content-node {
  margin-bottom: 6pt;
}
</pdf-style>
