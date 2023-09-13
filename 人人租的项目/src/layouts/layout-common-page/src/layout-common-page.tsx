import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'layout-common-page',
  props: {
    commonProps: {
      type: Object,
      default: () => ({}),
    },
    adminProps: {
      type: Object,
      default: () => ({}),
    },
    shopsProps: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    const route = useRoute();

    return () =>
      route.query.role == 'super' ? (
        <layout-admin-page {...props.commonProps} {...props.adminProps}>
          {slots}
        </layout-admin-page>
      ) : (
        <layout-shops-page {...props.commonProps} {...props.shopsProps}>
          {slots}
        </layout-shops-page>
      );
  },
});
