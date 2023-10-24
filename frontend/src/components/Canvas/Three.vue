<script setup lang="ts">
import { ref, computed } from 'vue';
import * as THREE from 'three';
import { TresCanvas, useTresContext } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { Face } from 'three/addons/math/ConvexHull.js';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import discs from '@/assets/img/disc.png'
import { useShapeDetails } from "@/stores/shapeDetails.js";

  const store = useShapeDetails();
  const axesHelper = new THREE.AxesHelper( 20 );

// textures

  const loader = new THREE.TextureLoader();
  const texture = loader.load( discs );
  texture.colorSpace = THREE.SRGBColorSpace;

  let group = new THREE.Group();

  // points
  let generateGeometry = null
  let dodecahedronGeometry = new THREE.DodecahedronGeometry( 10 );
  let torusknotGeometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 ); 

  // if normal and uv attributes are not removed, mergeVertices() can't consolidate indentical vertices with different normal/uv data

  dodecahedronGeometry.deleteAttribute( 'normal' );

  dodecahedronGeometry = BufferGeometryUtils.mergeVertices( dodecahedronGeometry );

  const faces = [];
  const edges = [];
  const vertices = [];
  
  const positionAttribute = dodecahedronGeometry.getAttribute( 'position' );

  for ( let i = 0; i < positionAttribute.count; i ++ ) {
    const vertex = new THREE.Vector3();
    vertex.fromBufferAttribute( positionAttribute, i );
    vertices.push( vertex );

  }

  const pointsMaterial = new THREE.PointsMaterial( {
    color: 0x0080ff,
    map: texture,
    size: 1,
    alphaTest: 0.5
  } );

  const pointsGeometry = new THREE.BufferGeometry().setFromPoints( vertices );

  const points = new THREE.Points( pointsGeometry, pointsMaterial );
  group.add( points );

  // convex hull

  const meshMaterial = new THREE.MeshLambertMaterial( {
    color: 0xffffff,
    opacity: 0.5,
    side: THREE.DoubleSide,
    transparent: true
  } );

  const meshGeometry = new ConvexGeometry( vertices );

  const mesh = new THREE.Mesh( meshGeometry, meshMaterial );
  group.add(mesh);

// faces

  for ( let i = 0; i < positionAttribute.count; i += 3 ) {
    const a = i;
    const b = i + 1;
    const c = i + 2;
    const faceAttribute = new THREE.Vector3(a, b, c);
    faces.push( faceAttribute );
  }
  // wireframe
  var wireGeo = new THREE.EdgesGeometry( meshGeometry ); // or WireframeGeometry
  var wireMat = new THREE.LineBasicMaterial( { color: 0xffffff } );
  var wireframe = new THREE.LineSegments( wireGeo, wireMat );
  mesh.add(wireframe);
  
  store.changeFaces( faces )
  store.changeVertices( vertices )
  console.log(mesh)
</script>

<template>
  <TresCanvas clear-color="#f0f0f0" class="h-screen w-full">
    <TresPerspectiveCamera
      :position="[50, 5, 50]"
      :fov="45"
      :look-at="[0, 0, 0]"
    />
    <primitive :object="axesHelper" />
    <primitive ref="geometry" :object="group" />
    <TresAmbientLight :intensity="1" />
    <OrbitControls />
  </TresCanvas>
</template>
