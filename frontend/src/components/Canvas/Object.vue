<template>
    <div>
        {{ context }}
    </div>
</template>

<script setup>
import { useTresContext } from '@tresjs/core'
const context = useTresContext()
</script>

<style lang="scss" scoped>

</style>