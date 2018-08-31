import * as THREE from "three";
window.THREE = THREE;
import TweenMax from "gsap/TweenMax";
import Stats from 'three/examples/js/libs/stats.min.js';
// import TWEEN from'three/examples/js/libs/tween.min.js';
require('three/examples/js/renderers/Projector')
require('three/examples/js/renderers/CanvasRenderer')
require('three/examples/js/controls/OrbitControls')

class FireworksCtrl {
    constructor($rootScope, $scope, $state, eventConstant, identityService, $http, md5, variables) {
        Object.assign(this, { $rootScope, $scope, $state, eventConstant, identityService, $http, md5, variables });
        this.container = document.getElementById('canvas-container');
        this.camera = null;
        this.scene = null;
        this.renderer = null;
        this.particle = null;
        this.group = null;

        this.t1 = new Date().getTime(); 
        this.clock = new THREE.Clock();
        this.speed = 80;
        this.riseDurtime = 1.8;
        this.delta = null;

        this.init();
        this.animate();

    }
    init() {
        this.initCamera();

        this.scene = new THREE.Scene();

        this.initParticles();

        this.renderer = new THREE.CanvasRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize($(this.container).width(), $(this.container).height());

        this.container.appendChild(this.renderer.domElement);

        // 性能检测
        this.stats = new Stats();
        this.container.appendChild(this.stats.dom);

        window.addEventListener('resize', () => {
            this.onWindowResize();
        }, false)
        
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(75, $(this.container).width() / $(this.container).height(), 1, 3000);
        this.camera.position.z = 1000;
        this.camera.position.y = 0;
    }
    // 创建粒子
    initParticles() {
        this.group = new THREE.Group();

        this.scene.add(this.group);

        // 创建一个球形用作最后的形状
        this.geometry = new THREE.SphereGeometry(500, 32, 32);
        const vlen = this.geometry.vertices.length;

        let particle;
        for(let i =0; i<vlen; i++) {
            // 为每个点附上材质
            let material = new THREE.SpriteCanvasMaterial({
                color: Math.random() * 0x808008 + 0x808080,
                program: context => {
                    context.beginPath();
                    context.arc( 0, 0, 0.5, 0, Math.PI * 2, true );
					context.fill();
                }
            })

            particle = new THREE.Sprite(material);
            particle.position.x = 0;
            particle.position.y = -500;
            particle.position.z =0;
            particle.scale.x = particle.scale.y = Math.random() * 6 + 3;
            this.group.add( particle );
        }
    }

    fsin(x) {     //正弦函数
        return 50*Math.sin(0.8*x*Math.PI/180);
    }

    render() {
        this.delta = 10 * this.clock.getDelta();
        let speed = 80;
        this.delta = this.delta < 2 ? this.delta : 2;
        let dur = new Date().getTime() - this.t1;
        if (dur < 1800) {
            this.group.traverse(child => {
                if (child.position.y < 0) {
                    child.position.y += this.delta * speed * Math.random();
                    child.position.x = this.fsin(child.position.y);
                }	        
            });
        } else if(!this.runTweenMax) {
            // 为每个点加动画
            this.runTweenMax = true;
            this.maxTimerandom = 0;
            let index = 0;
            this.group.traverse(particle => {

                if(this.geometry.vertices[index]) {
                    let timerandom = 0.5*Math.random() + 0.5;
                    this.maxTimerandom = Math.max(this.maxTimerandom, timerandom);
                    TweenMax.to(
                        particle.position,
                        timerandom,
                        {
                            x: this.geometry.vertices[index].x + ((0.5 - Math.random()) * 50),
                            y: this.geometry.vertices[index].y + ((0.5 - Math.random()) * 50),
                            z: this.geometry.vertices[index].z + (Math.random()*50),
                        }
                    )
        
                    TweenMax.to(
                        particle.position,
                        timerandom,                
                        {
                            y:'-2000',
                            z:'300',
                            delay:timerandom,
                            ease: Power2.easeIn
                        } 
                    );
                    
                    TweenMax.to(
                        particle.position,
                        0.01,                
                        {
                            y:'-500',
                            z:'0',
                            x: '0',
                            delay:timerandom * 2,
                            onComplete: (timerandom) => {
                                if(timerandom >= this.maxTimerandom ) {
                                    setTimeout(() => {
                                        this.t1 = new Date().getTime();
                                        this.runTweenMax = false;
                                    }, 200)
                                }
                                
                            },
                            onCompleteParams: [timerandom]
                        } 
                    );
                    
                    index++;
                }
                
            });

        }
        this.renderer.render( this.scene, this.camera );
    }

    animate() {
        requestAnimationFrame( () => {
            this.animate()
        } );
        this.render();
        this.stats.update();

    }

    onWindowResize() {
        this.camera.aspect = $(this.container).width() / $(this.container).height();
        this.camera.updateProjectionMatrix();

        this.renderer.setSize( $(this.container).width(), $(this.container).height() );

    }
}

FireworksCtrl.$inject = ['$rootScope', '$scope', '$state', 'eventConstant', 'identityService', '$http', 'md5', 'variables'];

export default FireworksCtrl
