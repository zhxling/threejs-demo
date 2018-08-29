import * as THREE from "three";
window.THREE = THREE;

require('three-fbx-loader');
require('three/examples/js/controls/OrbitControls')

class loginController {
    constructor($rootScope, $scope, $state, eventConstant, identityService, loginApi, $http, md5, variables) {
        Object.assign(this, { $rootScope, $scope, $state, eventConstant, identityService, loginApi, $http, md5, variables });
        this.facilityModels = [];

        this.init();
    }

    init() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.renderer = new THREE.WebGLRenderer( {
            canvas : document.getElementById('canvasId'),
            antialias: true
        } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        document.body.appendChild(this.renderer.domElement);

        // 在容器上注册事件
        document.addEventListener( 'mousedown', this.handlers().onMouseDown, false );

        // 浏览器缩放时
        window.addEventListener( 'resize', this.handlers().onWindowResize, false );

        // 相机
        this.initCamera();

        // 场景                                                         
        this.scene = new THREE.Scene();

        // 灯光
        this.initLight();

        // 添加对场景的移动放大缩小控制
        this.initControls();

        // 加载模型
        this.loadModel();

        // 静态变量
        loginController.renderer = this.renderer;
        loginController.controls = this.controls;
        loginController.scene = this.scene;
        loginController.camera = this.camera;
        loginController.facilityModels = this.facilityModels;
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight,0.01, 1e10);
        this.camera.position.set(0,10000, 1000);
        this.camera.up.set(0, 1, 0);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    initLight() {
        this.scene.add(new THREE.AmbientLight(0xcccccc));
    }

    // 模型放大缩小/移动
    initControls() {
        // controls
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.controls.update();
    }
    /**
     * 加载模型
     */
    loadModel() {
        let _FBXLoader = new THREE.FBXLoader();
        _FBXLoader.load('./assets/images/J6.FBX', (object3d) => {
            this.scene.add(object3d);

            var box3 = new THREE.Box3();
            // 模型边界
            this.boundingBox = box3.expandByObject(object3d);
            // 向场景添加设备
            this.bulidFacilities(this.boundingBox);
            this.drawFacility(this.facilities);


            loginController.render();
            
           
        });
    }

    // 构建设备数据
    bulidFacilities(boundingBox) {
        this.facilities = [];
        const FACILITYNUMBER = 20;

        for(let i =0; i<FACILITYNUMBER; i++) {
            this.facilities.push({
                type: 1020 + Math.ceil(Math.random() * 3),
                x: Math.random() * (boundingBox.max.x - boundingBox.min.x) + boundingBox.min.x,
                y: Math.random() * (boundingBox.max.y - boundingBox.min.y) + boundingBox.min.y,
                z: Math.random() * (boundingBox.max.z - boundingBox.min.z) + boundingBox.min.z,
            })
        }

    }

    static render() {
        requestAnimationFrame(loginController.render);
        for(let f of loginController.facilityModels) {
            f.rotation.x += 0.009;
			f.rotation.y += 0.03;
        }
        loginController.controls.update();
        loginController.renderer.render(loginController.scene, loginController.camera);
    }

    drawFacility(facilities) {
        let mesh;
        for(let f of facilities) {
            var texture = new THREE.TextureLoader().load( this.variables.facilitiesImages[f.type] );
            var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
            var material = new THREE.MeshBasicMaterial( { map: texture } );
            mesh = new THREE.Mesh( geometry, material );
            mesh.position.x = f.x;
            mesh.position.y = f.y;
            mesh.position.z = f.z;

            this.facilityModels.push(mesh);
            this.scene.add( mesh );
            // animate();
        }

        console.log(this.facilityModels);

        // function animate() {
        //     requestAnimationFrame( animate );
        //     mesh.rotation.x += 0.005;
        //     mesh.rotation.y += 0.01;
        //     this.renderer.render( this.scene, this.camera );
        // }
    }

    handlers() {
        return {
            onMouseDown: event => {
                let BBox = this.renderer.domElement.getBoundingClientRect();
                this.mouse.x = ( (event.clientX - BBox.left) / this.renderer.domElement.clientWidth ) * 2 - 1;
                this.mouse.y = - ( (event.clientY - BBox.top) / this.renderer.domElement.clientHeight ) * 2 + 1;
             
                this.raycaster.setFromCamera( this.mouse, this.camera );

                for(let f of this.facilityModels) {
                    let intersects = this.raycaster.intersectObject( f );
             
                    if ( intersects.length > 0 ) {
                        f.material.color.setHex( 0xff0000 );
                
                    } else {
                        f.material.color.setHex( 0x00ff00 );
                
                    }
                }
             
                
            },
            onWindowResize: () => {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize( window.innerWidth, window.innerHeight );
            }
        }
    }

}

loginController.$inject = ['$rootScope', '$scope', '$state', 'eventConstant', 'identityService', 'loginApi', '$http', 'md5', 'variables'];

export default loginController
