<template>
  <slot v-if="isPermission" />
</template>
<script lang="ts">
/**
 * @author janesue
 * 自定义指令 权限验证
 * 使用Demo：
 *     <template>
 *         <permission :roles="['admin', 'super']">
 *             <div class="button">删除</div>
 *         </permission>
 *     </template>
 */

import { useRoute } from 'vue-router';
import { computed, ComputedRef, defineComponent, PropType } from 'vue';
import { hasPermissionRouteRoles, splitRouteRoleParams } from '@/utils/route';

interface PermissionSetupData {
  isPermission: ComputedRef<boolean>;
}

export default defineComponent({
  name: 'permission',
  props: {
    roles: {
      type: [String, Array] as PropType<string[] | string>,
      default: () => '',
    },
  },
  setup(props): PermissionSetupData {
    const route = useRoute();
    const { role } = route.query;
    const params = role || '';
    const userRoles = splitRouteRoleParams(params);
    // 是否有权限
    const isPermission = computed(() => hasPermissionRouteRoles(userRoles || [], props.roles));
    return {
      isPermission,
    };
  },
});
</script>
