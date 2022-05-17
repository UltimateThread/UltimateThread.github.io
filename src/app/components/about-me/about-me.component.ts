import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGL1Renderer;
  private scene!: THREE.Scene;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private group;

  constructor() { }

  @HostListener('window:orientationchange ', ['$event'])
  onOrientationChange() {
    this.calculateChatWindowHeight();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.calculateChatWindowHeight();

    this.createScene();
    this.startRenderingLoop();
  }

  private createScene() {
    this.camera = new THREE.PerspectiveCamera(95, this.canvas.width / this.canvas.height, 1, 20000);
    this.camera.position.z = 500;

    this.scene = new THREE.Scene();

    let geometry = new THREE.CylinderGeometry(0, 100, 100, 3);
    let materials = [
      new THREE.MeshPhongMaterial({
        // light
        specular: '#b03b2e',
        // intermediate
        color: '#a31a0b',
        // dark
        emissive: '#7d1409',
        shininess: 50,
        transparent: true,
        opacity: 0.2,
      }),
      new THREE.MeshPhongMaterial({
        // light
        specular: '#2fa4b1',
        // intermediate
        color: '#0b94a3',
        // dark
        emissive: '#0b7681',
        shininess: 50,
        transparent: true,
        opacity: 0.2,
      })];

    this.group = new THREE.Object3D();

    for (var i = 0; i < 350; i++) {
      var mesh = new THREE.Mesh(geometry, materials[Math.floor(Math.random() * materials.length)]);
      mesh.position.x = Math.random() * 2000 - 1000;
      mesh.position.y = Math.random() * 2000 - 1000;
      mesh.position.z = Math.random() * 2000 - 1000;
      mesh.rotation.x = Math.random() * 2 * Math.PI;
      mesh.rotation.y = Math.random() * 2 * Math.PI;
      // mesh.opacity = 50;
      mesh.matrixAutoUpdate = false;
      mesh.updateMatrix();
      this.group.add(mesh);
    }

    this.scene.add(this.group);

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    directionalLight.intensity = 0.2;
    this.scene.add(directionalLight);

    this.renderer = new THREE.WebGL1Renderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvas.width, this.canvas.height);
    this.renderer.sortObjects = false;

    window.addEventListener('resize', () => {
      this.calculateChatWindowHeight();

      this.camera.aspect = this.canvas.width / this.canvas.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.canvas.width, this.canvas.height);
    });
  }

  private startRenderingLoop() {
    this.calculateChatWindowHeight();
    let component: AboutMeComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.render();
    }());
  }

  render() {
    this.camera.lookAt(this.scene.position);

    let currentSeconds = Date.now();
    this.group.rotation.x = Math.sin(currentSeconds * 0.0007) * 0.5;
    this.group.rotation.y = Math.sin(currentSeconds * 0.0003) * 0.5;
    this.group.rotation.z = Math.sin(currentSeconds * 0.0002) * 0.5;

    this.renderer.render(this.scene, this.camera);
  }

  calculateChatWindowHeight() {
    const chatWindow = document.getElementsByClassName('content-wrapper')[0] as HTMLElement;
    const header = document.getElementsByClassName('header')[0] as HTMLElement;

    if (chatWindow === undefined || header === undefined) {
      return;
    }

    const chatWindowHeight = innerHeight - header.offsetHeight;
    const width = window.innerWidth;

    this.canvas.height = chatWindowHeight;
    this.canvas.style.height = `${chatWindowHeight}px`;
    this.canvas.width = width;

    chatWindow.style.height = `${chatWindowHeight}px`;
    chatWindow.style.width = `${width}px`;
  }
}
