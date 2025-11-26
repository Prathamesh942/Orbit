
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model({ customization, ...props }) {
  const { nodes, materials } = useGLTF('/controller1.glb')
  let skin = false;
  if (customization.face[0] != '#') skin = true
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.controller.geometry} material={skin ? materials[customization.face] : materials.face} material-color={skin ? undefined : customization.face}>
        <mesh castShadow receiveShadow geometry={nodes.a.geometry} material={materials.abxy}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Text003.geometry}
            material={materials.letter}
          />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.b.geometry} material={materials.abxy}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Text001.geometry}
            material={materials.letter}
          />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.dpad.geometry} material={materials.dpad} material-color={customization.dpads} />
        {customization.grips && <mesh castShadow receiveShadow geometry={nodes.grip.geometry} material={materials.grip} />}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.thumbstick1.geometry}
          material={materials.thumbstick}
          material-color={customization.thumbsticks}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.thumbstick2.geometry}
          material={materials.thumbstick}
          material-color={customization.thumbsticks}
        />
        <mesh castShadow receiveShadow geometry={nodes.x.geometry} material={materials.abxy}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Text.geometry}
            material={materials.letter}
          />
        </mesh>
        <mesh castShadow receiveShadow geometry={nodes.y.geometry} material={materials.abxy}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Text002.geometry}
            material={materials.letter}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube002_1.geometry}
          material={materials.back}
          material-color={customization.body}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube002_2.geometry}
          material={materials.bumper}
          material-color={customization.bumpers}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube002_3.geometry}
          material={materials.triggers}
          material-color={customization.triggers}
        />
      </mesh>
      <mesh castShadow receiveShadow geometry={nodes.Cube.geometry} material={materials.ghost} />
      <mesh castShadow receiveShadow geometry={nodes.Cube001.geometry} material={materials.panda} />
      <mesh castShadow receiveShadow geometry={nodes.Cube003.geometry} material={materials.venom} />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube004.geometry}
        material={materials.spiderman}
      />
    </group>
  )
}

useGLTF.preload('/controller1.glb')
