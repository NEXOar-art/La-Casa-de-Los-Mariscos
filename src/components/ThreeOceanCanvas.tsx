import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const _targetVec = new THREE.Vector3();

export function ThreeOceanCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || '');
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xfbf8f5, 0);

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfbf8f5, 0.025);

    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    camera.position.set(0, 3.8, 15);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    // Soft sunlit coastal lighting
    const hemiLight = new THREE.HemisphereLight(0xfffaf6, 0xcbe0e8, 1.35);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffe0c8, 1.6);
    keyLight.position.set(8, 12, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9bc4d4, 1.1);
    rimLight.position.set(-10, 4, -8);
    scene.add(rimLight);

    // 1. Undulating Pastel Coastal Wave Particle Surface
    const cols = 72;
    const rows = 44;
    const count = cols * rows;
    const waveGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const baseXZ = new Float32Array(count * 2);
    const colors = new Float32Array(count * 3);

    const deepColor = new THREE.Color(0x74a9be);
    const crestColor = new THREE.Color(0xd5867d);
    const tempColor = new THREE.Color();

    let idx = 0;
    for (let ix = 0; ix < cols; ix++) {
      for (let iz = 0; iz < rows; iz++) {
        const x = (ix - cols / 2) * 0.62;
        const z = (iz - rows / 2) * 0.62 - 4;
        positions[idx * 3] = x;
        positions[idx * 3 + 1] = -2.8;
        positions[idx * 3 + 2] = z;

        baseXZ[idx * 2] = x;
        baseXZ[idx * 2 + 1] = z;

        const mix = (iz / rows) * 0.6;
        tempColor.copy(deepColor).lerp(crestColor, mix * 0.45);
        colors[idx * 3] = tempColor.r;
        colors[idx * 3 + 1] = tempColor.g;
        colors[idx * 3 + 2] = tempColor.b;
        idx++;
      }
    }

    waveGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    waveGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const waveMaterial = new THREE.PointsMaterial({
      size: 0.095,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const wavePoints = new THREE.Points(waveGeometry, waveMaterial);
    scene.add(wavePoints);

    // 2. Composite Maritime Astrolabe Sculpture (Champagne Gold & Sea-Glass Pearl)
    const compassGroup = new THREE.Group();
    compassGroup.position.set(5.4, 0.8, -2.5);

    const champagneMaterial = new THREE.MeshStandardMaterial({
      color: 0xd19a66,
      metalness: 0.78,
      roughness: 0.28,
    });

    const seaMistMaterial = new THREE.MeshStandardMaterial({
      color: 0x7ba5b8,
      metalness: 0.55,
      roughness: 0.42,
    });

    const pearlCoreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf6ebe6,
      metalness: 0.05,
      roughness: 0.16,
      clearcoat: 1.0,
    });

    const outerRingGeo = new THREE.TorusGeometry(2.4, 0.045, 20, 96);
    const outerRing = new THREE.Mesh(outerRingGeo, champagneMaterial);

    const midRingGeo = new THREE.TorusGeometry(1.85, 0.032, 16, 84);
    const midRing = new THREE.Mesh(midRingGeo, seaMistMaterial);
    midRing.rotation.x = Math.PI / 3;

    const innerRingGeo = new THREE.TorusGeometry(1.28, 0.028, 16, 72);
    const innerRing = new THREE.Mesh(innerRingGeo, champagneMaterial);
    innerRing.rotation.y = Math.PI / 4;

    const spindleGeo = new THREE.CylinderGeometry(0.025, 0.025, 4.9, 12);
    const spindle = new THREE.Mesh(spindleGeo, seaMistMaterial);

    const crossSpindle = new THREE.Mesh(spindleGeo, seaMistMaterial);
    crossSpindle.rotation.z = Math.PI / 2;

    const coreGeo = new THREE.OctahedronGeometry(0.38, 2);
    const coreMesh = new THREE.Mesh(coreGeo, pearlCoreMaterial);

    compassGroup.add(
      outerRing,
      midRing,
      innerRing,
      spindle,
      crossSpindle,
      coreMesh
    );
    scene.add(compassGroup);

    // 3. Ambient Floating Sea-Glass Motes
    const moteCount = 85;
    const moteGeo = new THREE.BufferGeometry();
    const motePos = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      motePos[i * 3] = (Math.random() - 0.5) * 32;
      motePos[i * 3 + 1] = Math.random() * 11 - 2;
      motePos[i * 3 + 2] = (Math.random() - 0.5) * 18 - 2;
    }
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
    const moteMat = new THREE.PointsMaterial({
      color: 0xd5867d,
      size: 0.065,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const motes = new THREE.Points(moteGeo, moteMat);
    scene.add(motes);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let scrollProgress = 0;
    let pointerX = 0;
    let pointerY = 0;
    let contextLost = false;
    let frameId = 0;
    let disposed = false;

    const onScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onResize = () => {
      if (disposed) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(
        isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
      );
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
    };

    const onContextRestored = () => {
      contextLost = false;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize);
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function updateScene(elapsed: number, delta: number) {
      const posAttr = waveGeometry.attributes.position as THREE.BufferAttribute;
      const colAttr = waveGeometry.attributes.color as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;
      const colArr = colAttr.array as Float32Array;

      const waveSpeed = prefersReducedMotion ? 0 : elapsed * 0.75;
      const scrollPhase = scrollProgress * 6.0;

      for (let i = 0; i < count; i++) {
        const x = baseXZ[i * 2];
        const z = baseXZ[i * 2 + 1];
        const wave =
          Math.sin(x * 0.36 + waveSpeed + scrollPhase) * 0.55 +
          Math.cos(z * 0.42 - waveSpeed * 0.8) * 0.42;

        posArr[i * 3 + 1] = -2.8 + wave;

        const crestFactor = THREE.MathUtils.clamp((wave + 0.9) / 1.8, 0, 1);
        tempColor.copy(deepColor).lerp(crestColor, crestFactor * 0.65);
        colArr[i * 3] = tempColor.r;
        colArr[i * 3 + 1] = tempColor.g;
        colArr[i * 3 + 2] = tempColor.b;
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;

      if (!prefersReducedMotion) {
        outerRing.rotation.y += delta * 0.14;
        outerRing.rotation.x = Math.sin(elapsed * 0.25) * 0.28 + scrollProgress * 0.9;
        midRing.rotation.z -= delta * 0.22;
        innerRing.rotation.x += delta * 0.32;
        coreMesh.rotation.y -= delta * 0.4;
        motes.rotation.y = elapsed * 0.02;
      }

      const targetGroupX = 5.4 - scrollProgress * 10.2 + pointerX * 0.45;
      const targetGroupY = 0.8 - Math.sin(scrollProgress * Math.PI) * 1.1 + pointerY * 0.35;
      compassGroup.position.x = THREE.MathUtils.damp(
        compassGroup.position.x,
        targetGroupX,
        3.2,
        delta
      );
      compassGroup.position.y = THREE.MathUtils.damp(
        compassGroup.position.y,
        targetGroupY,
        3.2,
        delta
      );

      camera.position.x = THREE.MathUtils.damp(
        camera.position.x,
        pointerX * 0.85,
        2.5,
        delta
      );
      camera.position.y = THREE.MathUtils.damp(
        camera.position.y,
        3.8 - scrollProgress * 1.4 + pointerY * 0.45,
        2.5,
        delta
      );
      _targetVec.set(0, -0.4 - scrollProgress * 0.6, -2);
      camera.lookAt(_targetVec);
    }

    function tick() {
      if (disposed) return;
      if (!contextLost) {
        const delta = Math.min(clock.getDelta(), 0.05);
        const elapsed = clock.getElapsedTime();
        updateScene(elapsed, delta);
        renderer.render(scene, camera);
      }

      if (prefersReducedMotion) {
        return;
      }
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);

      waveGeometry.dispose();
      waveMaterial.dispose();
      outerRingGeo.dispose();
      midRingGeo.dispose();
      innerRingGeo.dispose();
      spindleGeo.dispose();
      coreGeo.dispose();
      champagneMaterial.dispose();
      seaMistMaterial.dispose();
      pearlCoreMaterial.dispose();
      moteGeo.dispose();
      moteMat.dispose();
      envTex.dispose();
      renderer.dispose();

      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
    />
  );
}
