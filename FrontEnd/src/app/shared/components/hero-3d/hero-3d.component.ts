import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener,
  ChangeDetectorRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export interface StationHologram {
  id: string;
  name: string;
  badge: string;
  detail: string;
  pos3d: THREE.Vector3;
  screenPos: { x: number; y: number; visible: boolean };
}

interface SecondaryVehicle {
  group: THREE.Group;
  wheels: THREE.Mesh[];
  speed: number;
  laneX: number;
}

@Component({
  selector: 'app-hero-3d',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-3d.component.html',
  styleUrl: './hero-3d.component.css',
})
export class Hero3dComponent implements OnInit, OnDestroy {
  @ViewChild('canvasRef', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('containerRef', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('stageRef', { static: false }) stageRef?: ElementRef<HTMLDivElement>;

  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  isLoaded = false;
  isHovered = false;
  isMobile = false;

  // Station cards tracked in 3D & projected to 2D
  stations: StationHologram[] = [
    {
      id: 'cairo',
      name: 'محطة القاهرة والرمسيس',
      badge: '📍 محطة قيام رسمية',
      detail: 'مواكبة لحظية • تكييف كامل',
      pos3d: new THREE.Vector3(-5.2, 2.2, -8),
      screenPos: { x: 0, y: 0, visible: false },
    },
    {
      id: 'alex',
      name: 'موقف الإسكندرية (الموقف الجديد)',
      badge: '🌊 خط مباشر VIP',
      detail: 'سرعة وأمان • حجز مقعدك',
      pos3d: new THREE.Vector3(5.5, 2.4, -18),
      screenPos: { x: 0, y: 0, visible: false },
    },
    {
      id: 'luxor',
      name: 'محطة الأقصر وسوهاج',
      badge: '🏛️ مواعيد منتظمة',
      detail: 'أحدث حافلات وميكروباصات',
      pos3d: new THREE.Vector3(-5.8, 2.8, -28),
      screenPos: { x: 0, y: 0, visible: false },
    },
  ];

  // Three.js internal objects
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private composer!: EffectComposer;
  private bloomPass!: UnrealBloomPass;

  // Objects in scene
  private busGroup!: THREE.Group;
  private busWheels: THREE.Mesh[] = [];
  private trafficVehicles: SecondaryVehicle[] = [];
  private roadMesh!: THREE.Mesh;
  private roadTexture!: THREE.CanvasTexture;
  private particlesMesh!: THREE.Points;
  private particlePositions!: Float32Array;
  private particleVelocities: number[] = [];
  private nodeMeshes: THREE.Group[] = [];
  private billboardGroups: THREE.Group[] = [];

  // Motion & Animation state
  private animFrameId: number | null = null;
  private isRendering = false;
  private isVisibleInViewport = true;
  private isTabActive = true;
  private prefersReducedMotion = false;

  // Mouse & Parallax tracking
  private mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  private scrollY = 0;
  private targetScrollY = 0;
  private roadOffset = 0;
  private baseSpeed = 0.24;
  private currentSpeed = 0.24;

  // Observers
  private intersectionObserver?: IntersectionObserver;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.checkReducedMotion();
    this.checkMobile();
    this.initThree();
    this.createSceneContent();
    this.setupPostProcessing();
    this.setupVisibilityListeners();
    this.onResize();

    // Start loop
    this.startLoop();
  }

  ngOnDestroy(): void {
    this.stopLoop();
    this.cleanupListeners();
    this.cleanupThree();
  }

  private checkReducedMotion(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  private checkMobile(): void {
    if (typeof window !== 'undefined') {
      this.isMobile = window.innerWidth < 768;
    }
  }

  // -------------------------------------------------------------------------
  // THREE.JS SETUP & SCENE CREATION
  // -------------------------------------------------------------------------

  private initThree(): void {
    const container = this.containerRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;

    const width = Math.max(container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 800), 320);
    const height = Math.max(container.clientHeight || 550, 320);

    // Scene with smooth fog extending into the horizon
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0d1012);
    this.scene.fog = new THREE.FogExp2(0x0d1012, 0.015);

    // Camera elevated & angled over the highway
    const fov = this.isMobile ? 54 : 46;
    const camY = this.isMobile ? 4.2 : 3.4;
    const camZ = this.isMobile ? 10.0 : 7.8;

    this.camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 160);
    this.camera.position.set(0, camY, camZ);
    this.camera.lookAt(0, 1.0, -4);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !this.isMobile,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height);
    const pixelRatio = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, this.isMobile ? 1.0 : 1.75);
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    // Lighting (Bright & Vivid)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xc3f400, 2.5);
    dirLight.position.set(6, 14, 10);
    this.scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x6366f1, 2.8);
    backLight.position.set(-6, 8, -12);
    this.scene.add(backLight);
  }

  private createSceneContent(): void {
    this.buildInfiniteHighway();
    this.buildMainExpressBus();
    this.buildPassingTraffic();
    this.buildRoadsideBillboards();
    this.buildParticleSystem();
    this.buildHologramNodes();
  }

  // 1) EXTENDED INFINITE HIGHWAY (180 Units Length)
  private buildInfiniteHighway(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Asphalt surface
    ctx.fillStyle = '#111518';
    ctx.fillRect(0, 0, 512, 512);

    // Outer neon border lines (#c3f400)
    ctx.fillStyle = '#c3f400';
    ctx.fillRect(18, 0, 14, 512);
    ctx.fillRect(480, 0, 14, 512);

    // Inner glowing lane dividers (#6366f1)
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(160, 0, 6, 512);
    ctx.fillRect(346, 0, 6, 512);

    // Center dashed white/neon lines
    ctx.fillStyle = '#ffffff';
    for (let y = 0; y < 512; y += 64) {
      ctx.fillRect(250, y, 12, 38);
    }

    this.roadTexture = new THREE.CanvasTexture(canvas);
    this.roadTexture.wrapS = THREE.RepeatWrapping;
    this.roadTexture.wrapT = THREE.RepeatWrapping;
    this.roadTexture.repeat.set(1, 32);

    const roadGeo = new THREE.PlaneGeometry(16, 250);
    const roadMat = new THREE.MeshStandardMaterial({
      map: this.roadTexture,
      roughness: 0.3,
      metalness: 0.5,
      emissive: new THREE.Color(0x14181c),
      emissiveIntensity: 0.35,
    });

    this.roadMesh = new THREE.Mesh(roadGeo, roadMat);
    this.roadMesh.rotation.x = -Math.PI / 2;
    this.roadMesh.position.set(0, 0, -115);
    this.scene.add(this.roadMesh);
  }

  // 2) STYLIZED LOW-POLY BUS (Scaled down appropriately for desktop & mobile)
  private buildMainExpressBus(): void {
    this.busGroup = new THREE.Group();
    const scale = this.isMobile ? 0.72 : 0.82;
    this.busGroup.scale.set(scale, scale, scale);

    // Body Chassis
    const bodyGeo = new THREE.BoxGeometry(2.2, 1.4, 4.8);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x161a1d,
      metalness: 0.9,
      roughness: 0.15,
    });
    const busBody = new THREE.Mesh(bodyGeo, bodyMat);
    busBody.position.y = 0.95;
    this.busGroup.add(busBody);

    // Roof Accent Strip (Neon Lime)
    const roofGeo = new THREE.BoxGeometry(2.15, 0.14, 4.7);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0xc3f400,
      emissive: 0xc3f400,
      emissiveIntensity: 0.7,
    });
    const busRoof = new THREE.Mesh(roofGeo, roofMat);
    busRoof.position.y = 1.7;
    this.busGroup.add(busRoof);

    // Glass Windows
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.95,
      roughness: 0.05,
    });

    const windshieldGeo = new THREE.BoxGeometry(2.05, 0.7, 0.1);
    const windshield = new THREE.Mesh(windshieldGeo, glassMat);
    windshield.position.set(0, 1.2, 2.36);
    this.busGroup.add(windshield);

    const sideWinGeo = new THREE.BoxGeometry(2.24, 0.6, 3.8);
    const sideWindows = new THREE.Mesh(sideWinGeo, glassMat);
    sideWindows.position.y = 1.2;
    this.busGroup.add(sideWindows);

    // 4 Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.36, 14);
    wheelGeo.rotateZ(Math.PI / 2);

    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e2328, roughness: 0.7 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xc3f400, emissive: 0xc3f400, emissiveIntensity: 0.6 });

    const wheelPositions = [
      [-1.12, 0.4, 1.4],
      [1.12, 0.4, 1.4],
      [-1.12, 0.4, -1.4],
      [1.12, 0.4, -1.4],
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wGroup = new THREE.Group();
      const tire = new THREE.Mesh(wheelGeo, wheelMat);
      wGroup.add(tire);

      const rimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.38, 8);
      rimGeo.rotateZ(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, rimMat);
      wGroup.add(rim);

      wGroup.position.set(x, y, z);
      this.busGroup.add(wGroup);
      this.busWheels.push(tire);
    });

    // Headlights (White/Cyan glow)
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hlGeo = new THREE.BoxGeometry(0.38, 0.16, 0.08);

    [-0.78, 0.78].forEach((x) => {
      const hl = new THREE.Mesh(hlGeo, hlMat);
      hl.position.set(x, 0.8, 2.41);
      this.busGroup.add(hl);

      const spotLight = new THREE.SpotLight(0xffffff, 5.0, 22, Math.PI / 5, 0.4);
      spotLight.position.set(x, 0.8, 2.45);
      spotLight.target.position.set(x * 1.2, 0, 14);
      this.busGroup.add(spotLight);
      this.busGroup.add(spotLight.target);
    });

    // Taillights
    const tailMat = new THREE.MeshStandardMaterial({ color: 0xff2a6d, emissive: 0xff2a6d, emissiveIntensity: 2.5 });
    const tailGeo = new THREE.BoxGeometry(0.48, 0.14, 0.08);
    [-0.78, 0.78].forEach((x) => {
      const tl = new THREE.Mesh(tailGeo, tailMat);
      tl.position.set(x, 0.8, -2.41);
      this.busGroup.add(tl);
    });

    // Neon Underglow
    const underglowGeo = new THREE.PlaneGeometry(2.1, 4.6);
    const underglowMat = new THREE.MeshBasicMaterial({
      color: 0xc3f400,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const underglow = new THREE.Mesh(underglowGeo, underglowMat);
    underglow.rotation.x = Math.PI / 2;
    underglow.position.set(0, 0.05, 0);
    this.busGroup.add(underglow);

    // Position main bus centered on highway in dedicated 3D viewport
    this.busGroup.position.set(0, 0, 0);
    this.scene.add(this.busGroup);
  }

  // 3) DYNAMIC TRAFFIC (Passing Cars & Vans on Adjacent Lanes)
  private buildPassingTraffic(): void {
    const trafficConfigs = [
      { color: 0x38bdf8, laneX: -2.6, startZ: -25, speed: 0.18, type: 'car' },
      { color: 0xc3f400, laneX: -2.6, startZ: -65, speed: 0.22, type: 'van' },
      { color: 0x818cf8, laneX: 2.4, startZ: -45, speed: 0.15, type: 'car' },
    ];

    trafficConfigs.forEach((cfg) => {
      const group = new THREE.Group();
      const wheels: THREE.Mesh[] = [];

      if (cfg.type === 'car') {
        // Sedan Car
        const bodyGeo = new THREE.BoxGeometry(1.6, 0.8, 3.2);
        const bodyMat = new THREE.MeshStandardMaterial({ color: cfg.color, metalness: 0.8, roughness: 0.2 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.5;
        group.add(body);

        const cabinGeo = new THREE.BoxGeometry(1.4, 0.6, 1.8);
        const cabinMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
        const cabin = new THREE.Mesh(cabinGeo, cabinMat);
        cabin.position.set(0, 1.1, -0.2);
        group.add(cabin);
      } else {
        // Microbus / Minivan
        const bodyGeo = new THREE.BoxGeometry(1.8, 1.1, 3.8);
        const bodyMat = new THREE.MeshStandardMaterial({ color: cfg.color, metalness: 0.85, roughness: 0.2 });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.7;
        group.add(body);
      }

      // Wheels
      const wGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 10);
      wGeo.rotateZ(Math.PI / 2);
      const wMat = new THREE.MeshStandardMaterial({ color: 0x1e2328 });

      [[-0.85, 0.3, 1.0], [0.85, 0.3, 1.0], [-0.85, 0.3, -1.0], [0.85, 0.3, -1.0]].forEach(([x, y, z]) => {
        const w = new THREE.Mesh(wGeo, wMat);
        w.position.set(x, y, z);
        group.add(w);
        wheels.push(w);
      });

      // Headlights & Taillights
      const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const hlGeo = new THREE.BoxGeometry(0.3, 0.12, 0.06);
      [-0.6, 0.6].forEach((x) => {
        const hl = new THREE.Mesh(hlGeo, hlMat);
        hl.position.set(x, 0.6, cfg.type === 'car' ? 1.61 : 1.91);
        group.add(hl);
      });

      group.position.set(cfg.laneX, 0, cfg.startZ);
      this.scene.add(group);

      this.trafficVehicles.push({
        group,
        wheels,
        speed: cfg.speed,
        laneX: cfg.laneX,
      });
    });
  }

  // 4) ROADSIDE NEON BILLBOARD GANTRY SIGNS
  private buildRoadsideBillboards(): void {
    const signs = [
      { text: 'القاهرة ──► الإسكندرية • مواعيد رسمية', x: -6.5, y: 4.2, z: -15 },
      { text: 'موقف الصعيد المباشر • حافلات VIP', x: 6.5, y: 4.5, z: -35 },
    ];

    signs.forEach((s) => {
      const gantryGroup = new THREE.Group();

      // Support pillars
      const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 6, 8);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x272e35, metalness: 0.8 });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(0, 3, 0);
      gantryGroup.add(pillar);

      // Neon sign frame
      const frameGeo = new THREE.BoxGeometry(4.2, 1.2, 0.15);
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x161a1d,
        emissive: 0xc3f400,
        emissiveIntensity: 0.5,
      });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.set(0, 5.2, 0);
      gantryGroup.add(frame);

      gantryGroup.position.set(s.x, 0, s.z);
      this.scene.add(gantryGroup);
      this.billboardGroups.push(gantryGroup);
    });
  }

  // 5) GPU PARTICLE SYSTEM (STARFIELD & SPEED TRAILS)
  private buildParticleSystem(): void {
    const count = this.isMobile ? 400 : 800;
    const geometry = new THREE.BufferGeometry();
    this.particlePositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color(0xc3f400),
      new THREE.Color(0x6366f1),
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 32;
      const y = Math.random() * 10 + 0.2;
      const z = (Math.random() - 0.5) * 70 - 15;

      this.particlePositions[i * 3] = x;
      this.particlePositions[i * 3 + 1] = y;
      this.particlePositions[i * 3 + 2] = z;

      this.particleVelocities.push(0.18 + Math.random() * 0.4);

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    this.particlesMesh = new THREE.Points(geometry, material);
    this.scene.add(this.particlesMesh);
  }

  // 6) FLOATING 3D HOLOGRAM NODE MARKERS
  private buildHologramNodes(): void {
    this.stations.forEach((st) => {
      const group = new THREE.Group();

      const octGeo = new THREE.OctahedronGeometry(0.5, 0);
      const octMat = new THREE.MeshStandardMaterial({
        color: 0xc3f400,
        emissive: 0xc3f400,
        emissiveIntensity: 1.4,
        wireframe: true,
      });
      const octMesh = new THREE.Mesh(octGeo, octMat);
      group.add(octMesh);

      const ringGeo = new THREE.TorusGeometry(0.75, 0.035, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      group.add(ringMesh);

      const lineGeo = new THREE.CylinderGeometry(0.02, 0.02, st.pos3d.y * 2, 6);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xc3f400, transparent: true, opacity: 0.45 });
      const lineMesh = new THREE.Mesh(lineGeo, lineMat);
      lineMesh.position.y = -st.pos3d.y / 2;
      group.add(lineMesh);

      group.position.copy(st.pos3d);
      this.scene.add(group);
      this.nodeMeshes.push(group);
    });
  }

  // 7) UNREAL BLOOM POST-PROCESSING (Tuned for legibility)
  private setupPostProcessing(): void {
    const container = this.containerRef.nativeElement;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 550;

    const renderPass = new RenderPass(this.scene, this.camera);
    const bloomStrength = this.isMobile ? 0.4 : 0.55;
    const bloomRadius = this.isMobile ? 0.25 : 0.35;

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      bloomStrength,
      bloomRadius,
      0.25
    );

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderPass);
    this.composer.addPass(this.bloomPass);
  }

  // -------------------------------------------------------------------------
  // INTERACTION & MOUSE PARALLAX
  // -------------------------------------------------------------------------

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.prefersReducedMotion) return;
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.mouse.targetX = (x / rect.width) * 2 - 1;
    this.mouse.targetY = -(y / rect.height) * 2 + 1;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (this.prefersReducedMotion || !event.touches[0]) return;
    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    this.mouse.targetX = (x / rect.width) * 2 - 1;
    this.mouse.targetY = -(y / rect.height) * 2 + 1;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      this.targetScrollY = window.scrollY || 0;
    }
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
    this.mouse.targetX = 0;
    this.mouse.targetY = 0;
  }

  // -------------------------------------------------------------------------
  // ANIMATION LOOP & RENDER
  // -------------------------------------------------------------------------

  private startLoop(): void {
    if (this.isRendering) return;
    this.isRendering = true;
    this.animate();
  }

  private stopLoop(): void {
    this.isRendering = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private animate = (): void => {
    if (!this.isRendering) return;
    this.animFrameId = requestAnimationFrame(this.animate);

    if (!this.isVisibleInViewport || !this.isTabActive) return;

    this.updateSceneState();
    this.composer.render();

    if (!this.isLoaded) {
      this.isLoaded = true;
      this.cdr.detectChanges();
    }
  };

  private updateSceneState(): void {
    const time = performance.now() * 0.003;

    // Smooth scroll interpolation & scroll acceleration
    this.scrollY = THREE.MathUtils.lerp(this.scrollY, this.targetScrollY, 0.08);
    const scrollDelta = Math.abs(this.targetScrollY - this.scrollY);
    const scrollBoost = Math.min(scrollDelta * 0.008, 0.5);

    // 1) Target speed & lerp
    const targetSpeed = this.isHovered ? this.baseSpeed * 1.5 : this.baseSpeed;
    const speed = this.prefersReducedMotion ? 0.05 : targetSpeed + scrollBoost;
    this.currentSpeed = THREE.MathUtils.lerp(this.currentSpeed, speed, 0.08);

    // 2) Infinite Road scroll
    this.roadOffset += this.currentSpeed * 0.08;
    this.roadTexture.offset.y = this.roadOffset;

    // 3) Main Bus position & forward drive on Z-axis with page scroll
    const scrollZOffset = Math.min(this.scrollY * 0.008, 14);
    this.busGroup.position.z = THREE.MathUtils.lerp(this.busGroup.position.z, -scrollZOffset, 0.08);

    this.busWheels.forEach((w) => {
      w.rotation.x += this.currentSpeed * 0.45;
    });

    if (!this.prefersReducedMotion) {
      this.busGroup.position.y = Math.sin(time * 3) * 0.04 - Math.min(this.scrollY * 0.001, 0.4);
      this.busGroup.rotation.z = Math.cos(time * 2) * 0.015;
      this.busGroup.rotation.x = THREE.MathUtils.lerp(
        this.busGroup.rotation.x,
        this.isHovered || scrollDelta > 2 ? -0.06 : 0,
        0.05
      );
    }

    // 4) Passing Traffic Motion
    this.trafficVehicles.forEach((veh) => {
      veh.group.position.z += veh.speed * (this.currentSpeed * 4.0);

      // Rotate wheels
      veh.wheels.forEach((w) => (w.rotation.x += veh.speed * 0.5));

      // Wrap around when past camera
      if (veh.group.position.z > 12) {
        veh.group.position.z = -60 - Math.random() * 30;
      }
    });

    // 5) Particles speed lines & starfield parallax
    if (this.particlePositions) {
      const count = this.particlePositions.length / 3;
      for (let i = 0; i < count; i++) {
        const vel = this.particleVelocities[i] * (this.currentSpeed * 3.8);
        this.particlePositions[i * 3 + 2] += vel;

        if (this.particlePositions[i * 3 + 2] > 12) {
          this.particlePositions[i * 3 + 2] = -50;
          this.particlePositions[i * 3] = (Math.random() - 0.5) * 32;
        }
      }
      this.particlesMesh.geometry.attributes['position'].needsUpdate = true;
      this.particlesMesh.rotation.y += 0.0003;
    }

    // 6) Floating Hologram Nodes
    this.nodeMeshes.forEach((mesh, idx) => {
      mesh.children[0].rotation.y += 0.02;
      mesh.children[1].rotation.z += 0.015;
      mesh.position.y = this.stations[idx].pos3d.y + Math.sin(time * 2.2 + idx) * 0.18;
    });

    // 7) Mouse Parallax Camera & Smooth Target Lerp
    if (!this.prefersReducedMotion) {
      this.mouse.x = THREE.MathUtils.lerp(this.mouse.x, this.mouse.targetX, 0.05);
      this.mouse.y = THREE.MathUtils.lerp(this.mouse.y, this.mouse.targetY, 0.05);

      const baseCamY = this.isMobile ? 4.2 : 3.4;
      const baseCamZ = this.isMobile ? 10.0 : 7.8;

      this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, this.mouse.x * (this.isMobile ? 0.9 : 1.8), 0.05);
      this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, baseCamY + this.mouse.y * 0.6, 0.05);
      this.camera.position.z = THREE.MathUtils.lerp(this.camera.position.z, baseCamZ - Math.min(this.scrollY * 0.004, 3.0), 0.05);

      this.camera.lookAt(this.mouse.x * 0.6, 0.8, -4);
    }

    // 8) Update projected 2D screen positions for Station Cards
    this.updateScreenPositions(time);
  }

  private updateScreenPositions(time: number): void {
    const container = this.containerRef.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.stations.forEach((st, idx) => {
      const nodeMesh = this.nodeMeshes[idx];
      if (!nodeMesh) return;

      const tempV = new THREE.Vector3();
      nodeMesh.getWorldPosition(tempV);

      // Add gentle floating offset to screen card
      const floatOffset = Math.sin(time * 2.5 + idx * 1.5) * 0.12;
      tempV.y += 0.75 + floatOffset;

      tempV.project(this.camera);

      const x = (tempV.x * 0.5 + 0.5) * width;
      const y = (-(tempV.y * 0.5) + 0.5) * height;

      const visible = tempV.z < 1.0 && x > 30 && x < width - 30 && y > 30 && y < height - 30;

      st.screenPos = { x, y, visible };
    });
  }

  // -------------------------------------------------------------------------
  // LIFECYCLE & PERFORMANCE OBSERVERS
  // -------------------------------------------------------------------------

  private setupVisibilityListeners(): void {
    if (typeof IntersectionObserver !== 'undefined') {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          this.isVisibleInViewport = entries[0]?.isIntersecting ?? true;
        },
        { threshold: 0.1 }
      );
      this.intersectionObserver.observe(this.containerRef.nativeElement);
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    }
  }

  private onVisibilityChange = (): void => {
    this.isTabActive = !document.hidden;
  };

  @HostListener('window:resize')
  onResize(): void {
    if (!isPlatformBrowser(this.platformId) || !this.renderer) return;

    this.checkMobile();
    const container = this.containerRef.nativeElement;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 550;

    this.camera.fov = this.isMobile ? 54 : 48;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);

    const pixelRatio = Math.min(window.devicePixelRatio, this.isMobile ? 1.0 : 1.75);
    this.renderer.setPixelRatio(pixelRatio);
  }

  private cleanupListeners(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }
  }

  private cleanupThree(): void {
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.composer) {
      this.composer.dispose();
    }
    if (this.scene) {
      this.scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mesh = obj as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
    }
  }
}
