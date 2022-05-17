import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as THREE from 'three';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas')
  private canvasRef!: ElementRef;

  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGL1Renderer;
  private scene!: THREE.Scene;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private actionZ = 0; //on left click action
  private rotationA = 3.1; // amount of rotation
  private movementSpeed = 10;
  private zoomSpeed = 10;
  private totalObjects = 40000;
  private rotated = false;

  constructor(private router: Router) { }

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
    this.camera = new THREE.PerspectiveCamera(75, this.canvas.width / this.canvas.height, 1, 10000)
    this.camera.position.z = 2000;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x555555, 0.0003);

    const points = [];
    for (let i = 0; i < this.totalObjects; i++) {
      let vertex = new THREE.Vector3();
      vertex.x = Math.random() * 40000 - 20000;
      vertex.y = Math.random() * 7000 - 3500;
      vertex.z = Math.random() * 7000 - 3500;
      points.push(vertex);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.PointsMaterial({ size: 6 });
    const particles = new THREE.Points(geometry, material);

    this.scene.add(particles);

    this.camera.position.x = -10000;

    this.renderer = new THREE.WebGL1Renderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.canvas.width, this.canvas.height);

    const loader = new THREE.TextureLoader();
    this.scene.background = loader.load( 'assets/textures/starb.png' );

    window.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.actionZ = -this.zoomSpeed;
    });

    window.addEventListener('mouseup', () => {
      this.actionZ = 0;
    });

    window.addEventListener('resize', () => {
      this.calculateChatWindowHeight();

      this.camera.aspect = this.canvas.width / this.canvas.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.canvas.width, this.canvas.height);
    });
  }

  private startRenderingLoop() {
    this.calculateChatWindowHeight();
    let component: ProjectsComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.render();
    }());
  }

  render() {
    if (!this.rotated && this.camera.position.x < 11000) {
      if (this.camera.position.x > 10000) {
        this.rotated = true;
        if (this.camera.rotation.y < this.rotationA) {
          this.camera.rotation.y += .015;
          this.rotated = false;
        }
        if (this.camera.position.z > -2000) {
          this.camera.position.z -= 19;
          this.rotated = false;
        }
      }
      else {
        this.camera.position.x += this.movementSpeed;
        this.camera.position.z += this.actionZ;
      }
    }
    else if (this.rotated && this.camera.position.x > -11000) {
      if (this.camera.position.x < -10000) {
        this.rotated = false;
        if (this.camera.rotation.y > 0) {
          this.camera.rotation.y -= .015;
          this.rotated = true;
        }
        if (this.camera.position.z < 2000) {
          this.camera.position.z += 19;
          this.rotated = true;
        }
      }
      else {
        this.camera.position.x -= this.movementSpeed;
        this.camera.position.z -= this.actionZ;
      }
    }

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
