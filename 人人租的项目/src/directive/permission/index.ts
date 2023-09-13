import { Directive } from 'vue';
import { hasPermissionRouteRoles, splitRouteRoleParams } from '@/utils/route';
import { router } from '@/router/router';
/**
 * @author janesue
 * 自定义指令 权限验证
 * 使用Demo：
 *      <template>
 *          <div class="button" v-roles="'admin'">删除</div>
 *          <div class="button" v-roles="['admin', 'user']">删除</div>
 *      </template>
 *      <script type="ts">
 *          import roles from '@/directives/roles';
 *          import { defineComponent } from "vue";
 *          export default defineComponent({
 *              directives: {
 *                  roles
 *              }
 *          })
 *      </script>
 */

const vRoles: Directive = (el, binding) => {
  const { value } = binding;
  if (value) {
    const params = router.currentRoute.value.query.role || '';
    const userRoles = splitRouteRoleParams(params);
    if (!hasPermissionRouteRoles(userRoles || [], value)) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  } else {
    throw new Error('role必须为数组或字符串!  例如: v-role="[\'super\',\'user\',\'server\']"');
  }
};

// export default roles;
export { vRoles };
