import { defineComponent, PropType, ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Breadcrumb } from 'ant-design-vue';
import style from './breadcrumb.module.less';

type TItem = {
  title: string;
  path: string;
  back: boolean;
};

export default defineComponent({
  name: 'page-breadcrumb',
  props: {
    items: {
      type: Array as PropType<string[] | TItem[]>,
      default: () => [],
    },
    path: {
      type: [String, Boolean] as PropType<string | boolean>,
      default: false,
    },
    back: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();

    const navs = ref<string[] | TItem[]>([]);

    watch(
      () => props.items,
      val => {
        navs.value = val;
      },
      { immediate: true },
    );

    onMounted(() => {
      const title = route.meta ? (route.meta.title as string) : '';
      if (!navs.value.length && title) {
        navs.value = title.split('-');
      }
    });

    function previous(index: number) {
      if (props.back && index === navs.value.length - 2) {
        router.go(-1);
      } else if (props.path && index === navs.value.length - 2) {
        router.push({ path: props.path as string, query: { role: route.query.role, origin: route.query.origin } });
      }
    }

    return () => (
      <div class={style['page-breadcrumb']}>
        <Breadcrumb>
          {...navs.value.map((item, index) => (
            <Breadcrumb.Item
              class={(props.path || props.back) && index === navs.value.length - 2 ? style['previous-link'] : ''}
            >
              <span
                onClick={() => previous(index)}
                class={index === navs.value.length - 1 ? style['breadcrumb-last'] : ''}
              >
                {item}
              </span>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </div>
    );
  },
});
