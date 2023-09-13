<!--
  此文件是为了处理pages目录在本地运行时报错问题
  请勿修改此文件！！！
 -->
<template>
  <page-breadcrumb :items="items" />
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
defineProps<{ items: string[] }>();
</script>
