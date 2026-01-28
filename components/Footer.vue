<template>
  <footer class="py-6 px-6">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4">
      <p class="text-sm text-gray-400">
        {{ t('copyright') }} &copy; {{ currentYear }}
        <a 
          href="https://rheinsullivan.web.id/" 
          target="_blank"
          class="text-primary hover:text-primary-light hover:underline transition-colors"
        >
          Rhein Sullivan
        </a>
        . {{ t('allRightsReserved') }}.
      </p>
      <p class="text-sm text-gray-400">
        {{ t('simplePOS') }} <span class="text-primary">v1.0.0</span>
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { t } = useI18n()
const currentYear = new Date().getFullYear()
</script>