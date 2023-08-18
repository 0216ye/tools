<template>
  <template
    v-for="tag in tags"
    :key="tag"
  >
    <a-tag
      v-if="tag"
    >
      {{ tag }}
    </a-tag>
  </template>
</template>
<script>
export default {
  props: {
    list: {
      type: [String, Array],
      default() {
        return [];
      }
    }
  },
  computed: {
    tags() {
      const { list } = this;
      let tags = [];
      if (typeof list === 'string') {
        tags = list.split(',');
      }
      if (Array.isArray(list)) {
        tags = [...list];
      }
      return tags;
    }
  }
}
</script>