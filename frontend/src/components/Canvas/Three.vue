<script setup lang="ts">
import { TresCanvas, useTresContext } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';

</script>

<template>
  <TresCanvas clear-color="#f0f0f0" >
    <TresPerspectiveCamera
      :position="[3, 3, 3]"
      :fov="45"
      :look-at="[0, 0, 0]"
    />
    <TresMesh>
      <TresTorusGeometry :args="[1, 0.5, 16, 32]" />
      <TresMeshBasicMaterial shadows color="orange" />
    </TresMesh>
    <TresAmbientLight :intensity="1" />
    <OrbitControls />
  </TresCanvas>
</template>
