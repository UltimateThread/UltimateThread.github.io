import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as THREE from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  private camera!: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    if( !!this.canvasRef) {
      return this.canvasRef.nativeElement;
    } else {
      return undefined;
    }
  }

  private renderer!: THREE.WebGL1Renderer;
  private scene!: THREE.Scene;

  private controls;
  private mesh;
  private geometry;
  private material;
  private clock;
  private worldWidth = 128;
  private worldDepth = 128;

  constructor(private router: Router) { }

  @HostListener('window:orientationchange ', ['$event'])
  onOrientationChange() {
    this.calculateChatWindowHeight();
  }

  ngOnInit(): void {
    setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 1);
  }

  ngAfterViewInit(): void {
    this.calculateChatWindowHeight();

    this.createScene();
    this.startRenderingLoop();
  }

  private createScene() {
    this.camera = new THREE.PerspectiveCamera(60, this.canvas.width / this.canvas.height, 1, 20000);
    this.camera.position.y = 200;

    this.clock = new THREE.Clock();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2e2a2a);
    this.scene.fog = new THREE.FogExp2(0x2e2a2a, 0.0007);

    this.geometry = new THREE.PlaneGeometry(20000, 20000, this.worldWidth - 1, this.worldDepth - 1);
    this.geometry.rotateX(- Math.PI / 2);

    const position = this.geometry.attributes.position;
    position.usage = THREE.DynamicDrawUsage;

    for (let i = 0; i < position.count; i++) {

      const y = 35 * Math.sin(i / 2);
      position.setY(i, y);

    }

    const texture = new THREE.TextureLoader().load('/assets/textures/water.jpg');
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);

    this.material = new THREE.MeshBasicMaterial({ color: 0xff0000, map: texture });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    this.renderer = new THREE.WebGL1Renderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.controls = new FirstPersonControls(this.camera, this.renderer.domElement);

    this.controls.movementSpeed = 500;
    this.controls.lookSpeed = 0.1;

    window.addEventListener('resize', (e) => {
      this.calculateChatWindowHeight();

      this.camera.aspect = this.canvas.width / this.canvas.height;
      this.camera.updateProjectionMatrix();
  
      this.renderer.setSize(this.canvas.width, this.canvas.height);
  
      this.controls.handleResize();
    });
  }

  private startRenderingLoop() {
    this.calculateChatWindowHeight();

    let component: HomeComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.render();
    }());
  }

  render() {
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime() * 10;

    const position = this.geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {

      const y = 35 * Math.sin(i / 5 + (time + i) / 7);
      position.setY(i, y);

    }

    position.needsUpdate = true;

    this.controls.update(delta);
    this.renderer.render(this.scene, this.camera);
  }

  calculateChatWindowHeight() {
    const contentWrapper = document.getElementsByClassName('content-wrapper')[0] as HTMLElement;
    const header = document.getElementsByClassName('header')[0] as HTMLElement;

    if (contentWrapper === undefined || header === undefined || this.canvas === undefined) {
      return;
    }

    const chatWindowHeight = innerHeight - header.offsetHeight;
    const width = window.innerWidth;

    this.canvas.height = chatWindowHeight;
    this.canvas.style.height = `${chatWindowHeight}px`;
    this.canvas.width = width;

    contentWrapper.style.height = `${chatWindowHeight}px`;
    contentWrapper.style.width = `${width}px`;
  }
}
