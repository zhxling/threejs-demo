import * as THREE from "three";
window.THREE = THREE;
window.FBXLoader = null;
require('three-fbx-loader');
require('three/examples/js/controls/OrbitControls')
require('three/examples/js/renderers/Projector')
import Stats from 'three/examples/js/libs/stats.min.js';
import TWEEN from'three/examples/js/libs/tween.min.js';
require('three/examples/js/libs/dat.gui.min.js');
import './cpmovie4.json';
import './teapot.json'

console.log(TWEEN);

class NotFoundCtrl {
    constructor($rootScope, $scope, $state, eventConstant, identityService, $http, md5, variables) {
        Object.assign(this, { $rootScope, $scope, $state, eventConstant, identityService, $http, md5, variables });
        // this.initStats();
        // this.init();
        var renderer, scene, camera, stats, tween, particleSystem, tweenBack;

        function render() {
            TWEEN.update();
            stats.update();
            app.update();
            window.requestAnimationFrame(render)
        }

        var app = {
            init: function(){
                var self = this;
                var WIDTH = window.innerWidth;
                var HEIGHT = window.innerHeight;
                var container = document.getElementById('container');
                console.log(container);
                camera = new THREE.PerspectiveCamera(40, WIDTH/HEIGHT, 1, 10000 );
                camera.position.z = 150;
                scene = new THREE.Scene();
    
    
                // add light
                var light = new THREE.DirectionalLight( 0xffffff );
                light.position.set( 0, 200, 0 );
                scene.add( light );
    
                self.addObjs();
    
    
                renderer = new THREE.WebGLRenderer();
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(WIDTH, HEIGHT);
                
                container.appendChild(renderer.domElement);
    
                stats = new Stats();
                container.appendChild(stats.dom);
    
                window.addEventListener( 'resize', function(e){
                    self.resize();
                }, false);
    
    
    
                self.scene = scene;
                self.camera = camera;
                self.renderer = renderer;
    
                // android 微信 崩溃
                // window.requestAnimationFrame(function(time){
                // 	TWEEN.update();
                // 	stats.update();
                // 	self.update(time);
                // 	window.requestAnimationFrame(arguments.callee)
                // });
                
                render()
            },
            addObjs: function(){
                var self = this;
                var loader = new THREE.JSONLoader();
                var obj1, obj2, loaded;
                loader.load('json/cpmovie4.json', function(obj) {
                    console.log(obj);
                    obj.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));
                    obj.applyMatrix(new THREE.Matrix4().makeScale(20, 20, 20));
                    obj.applyMatrix(new THREE.Matrix4().makeTranslation(80, 20, 0));
                    obj1 = obj;
                    if(obj1 && obj2 && !loaded) {
                        loaded = true;
                        self.addPartice(obj1, obj2);
                    }
                });	
                loader.load('json/teapot.json.js', function(obj) {
                    console.log(obj);
                    obj2 = obj;
                    if(obj1 && obj2 && !loaded) {
                        loaded = true;
                        self.addPartice(obj1, obj2);
                    }
                });	
            },
            addPartice: function(obj1, obj2){
                var moreObj, lessObj;
                if(obj1.vertices.length > obj2.vertices.length) {
                    moreObj = obj1;
                    lessObj = obj2;
                } else {
                    moreObj = obj2;
                    lessObj = obj1;
                }
                moreObj = new THREE.BufferGeometry().fromGeometry(moreObj);
                lessObj = new THREE.BufferGeometry().fromGeometry(lessObj);
                var morePos = moreObj.attributes.position.array;
                var lessPos = lessObj.attributes.position.array;
                var moreLen = morePos.length;
                var lessLen = lessPos.length;
                var position2 = new Float32Array(moreLen);
                position2.set(lessPos);
                for(var i = lessLen, j = 0; i < moreLen; i++, j++) {
                    j %= lessLen;
                    position2[i] = lessPos[j];
                    position2[i+1] = lessPos[j+1];
                    position2[i+2] = lessPos[j+2];
                }
    
                var sizes = new Float32Array(moreLen);
                for (var i = 0; i < moreLen; i++) {
                    sizes[i] = 4;
                }
                moreObj.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
                moreObj.addAttribute('position2', new THREE.BufferAttribute(position2, 3));
                var uniforms = {
                    color:{value: new THREE.Color(0xffffff)},
                    texture:{value: new THREE.TextureLoader().load( "//game.gtimg.cn/images/tgideas/2017/three/shader/dot.png")},
                    val: {value: 1.0}
                };
                var shaderMaterial = new THREE.ShaderMaterial({
                    uniforms:       uniforms,
                    vertexShader:   document.getElementById('vertexshader').textContent,
                    fragmentShader: document.getElementById('fragmentshader').textContent,
                    blending:       THREE.AdditiveBlending,
                    depthTest:      false,
                    transparent:    true
                });
                particleSystem = new THREE.Points(moreObj, shaderMaterial);
                particleSystem.position.y = -15;
    
    
                var pos = {val: 1};
                tween = new TWEEN.Tween(pos).to({val: 0}, 2000).easing(TWEEN.Easing.Quadratic.InOut).delay(1000).onUpdate(callback);
                tweenBack = new TWEEN.Tween(pos).to({val: 1}, 2000).easing(TWEEN.Easing.Quadratic.InOut).delay(1000).onUpdate(callback);
                tween.chain(tweenBack);
                tweenBack.chain(tween);
                tween.start();
    
                function callback(){
                    particleSystem.material.uniforms.val.value = this.val;
                }
    
                this.scene.add(particleSystem);
                this.particleSystem = particleSystem;		
            },
            resize: function(){
                this.camera.aspect = window.innerWidth/window.innerHeight;
                this.camera.updateProjectionMatrix();
    
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            },
            update: function(time){
                var time = Date.now() * 0.005;
                if(this.particleSystem) {
                    var bufferObj = this.particleSystem.geometry;
                    this.particleSystem.rotation.y = 0.1 * time;
    
                    var sizes = bufferObj.attributes.size.array;
                    var len = sizes.length;
    
                    for (var i = 0; i < len; i++) {
    
                        sizes[i] = 2 * (1.0 + Math.sin(0.02 * i + time));
    
                    }
    
    
                    bufferObj.attributes.size.needsUpdate = true;
                }
                
                this.renderer.render(this.scene, this.camera);
            }
        }
        app.init();
    
    }

    init() {
        this.facilityModels = [];
        this.SELECTEDFACILITY = null;
        this.INTERSECTED = null;

        this.container = document.getElementById('canvasId');
        this.WIDTH = $(this.container).width();
        this.HEIGHT = $(this.container).height();

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.offset = new THREE.Vector3();

        this.renderer = new THREE.WebGLRenderer( {
            canvas : this.container,
            antialias: true,
            alpha: true
        } );
        this.renderer.setClearColor(0x0F0F0F,1.0);

        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        
        // 相机
        this.initCamera();

        // 场景                                                         
        this.scene = new THREE.Scene();

        this.addPoint();

        // 灯光
        this.initLight();

        // 添加对场景的移动放大缩小控制
        this.initControls();

        // 静态变量
        NotFoundCtrl.renderer = this.renderer;
        NotFoundCtrl.controls = this.controls;
        NotFoundCtrl.scene = this.scene;
        NotFoundCtrl.camera = this.camera;
        NotFoundCtrl.facilityModels = this.facilityModels;

        NotFoundCtrl.render();
    }

    initStats() {
        this.stats = new Stats();
		this.stats.setMode(0); // 0 为监测 FPS；1 为监测渲染时间
        $('body').append(this.stats.domElement);
        NotFoundCtrl.stats = this.stats;
	}


    addPoint() {
        // 创建粒子geometry
        let particleCount = 1800;
        // 每个 Geometry 中模拟5万个点
		let geometry = new THREE.Geometry();
		for (var i = 0; i < particleCount; i++) {
			var vertext = new THREE.Vector3(
				Math.random() * 2000 - 1000,
				Math.random() * 2000 - 1000,
				Math.random() * 2000 - 1000
			);
			geometry.vertices.push(vertext);
		}
		
		var loader = new THREE.TextureLoader();
		var sprite = loader.load(this.variables.facilitiesImages[1021]);
		var color = [1.0, 0.2, 0.3];
		var size = 20;
			
		// 创建粒子
		let pointsMaterial = new THREE.PointsMaterial( {size: size, map: sprite, depthTest: false, transparent: true, opacity: 1.0, blending: THREE.AdditiveBlending} );
		pointsMaterial.color.setRGB(color[0], color[1], color[2]);
		this.particles = new THREE.Points(geometry, pointsMaterial);
		this.particles.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
		
		this.scene.add(this.particles);

    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(60, this.WIDTH/this.HEIGHT,0.01, 1e10);
        this.camera.position.set(0, 0, 200);
        this.camera.up.set(0, 1, 0);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    initLight() {
        this.ambientLight = new THREE.AmbientLight(0x0c0c0c);
		this.scene.add(this.ambientLight);
		
		this.spotLight = new THREE.SpotLight(0xffffff);
        this.spotLight.position.set(0, 260, 230);
		this.spotLight.shadow.mapSize.width = 5120; // 必须是 2的幂，默认值为 512
		this.spotLight.shadow.mapSize.height = 5120; // 必须是 2的幂，默认值为 512
        this.spotLight.castShadow = true;
        this.scene.add(this.spotLight);

    }

    // 模型放大缩小/移动
    initControls() {
        // controls
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.controls.update();
    }

    static render() {
		NotFoundCtrl.stats.update();
        requestAnimationFrame(NotFoundCtrl.render);
        NotFoundCtrl.controls.update();
        NotFoundCtrl.renderer.render(NotFoundCtrl.scene, NotFoundCtrl.camera);
    }
}

NotFoundCtrl.$inject = ['$rootScope', '$scope', '$state', 'eventConstant', 'identityService', '$http', 'md5', 'variables'];

export default NotFoundCtrl
