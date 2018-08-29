import * as THREE from "three";
window.THREE = THREE;
require('three-fbx-loader');
require('three/examples/js/controls/OrbitControls')
require('three/examples/js/renderers/Projector')

class homeCtrl {
    constructor($rootScope, $scope, $state, eventConstant, identityService, $http, md5, variables) {
        Object.assign(this, { $rootScope, $scope, $state, eventConstant, identityService, $http, md5, variables });
        this.init();
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
            antialias: true
        } );
        this.renderer.setClearColor('#428bca',1.0);

        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        
        // document.body.appendChild(this.renderer.domElement);

        // 在容器上注册事件
        document.addEventListener( 'mousedown', this.handlers().onMouseDown, false );
        document.addEventListener( 'mousemove', this.handlers().onMouseMove, false );
        document.addEventListener( 'mouseup', this.handlers().onMouseUp, false );
        
        // 浏览器缩放时
        window.addEventListener( 'resize', this.handlers().onWindowResize, false );

        // 相机
        this.initCamera();

        // 场景                                                         
        this.scene = new THREE.Scene();

        //创建一个长2000宽2000，8*8的网格对象并加上一种基本材质
        this.plane = new THREE.Mesh( new THREE.PlaneGeometry( 5000, 5000, 20, 20 ), new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true, wireframe: true } ) );
        //网格对象是否可见
        this.plane.visible = true;
        //把网格对象加到场景中
        this.scene.add( this.plane );

        //创建一个屏幕和场景转换工具
        this.projector = new THREE.Projector();

        // 灯光
        this.initLight();

        // 添加对场景的移动放大缩小控制
        this.initControls();

        // 加载模型
        this.loadModel();

        // 静态变量
        homeCtrl.renderer = this.renderer;
        homeCtrl.controls = this.controls;
        homeCtrl.scene = this.scene;
        homeCtrl.camera = this.camera;
        homeCtrl.facilityModels = this.facilityModels;
    }

    initCamera() {
        this.camera = new THREE.PerspectiveCamera(60, this.WIDTH/this.HEIGHT,0.01, 1e10);
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


            homeCtrl.render();
            
           
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
        requestAnimationFrame(homeCtrl.render);
        for(let f of homeCtrl.facilityModels) {
            f.rotation.x += 0.009;
			f.rotation.y += 0.03;
        }
        homeCtrl.controls.update();
        homeCtrl.renderer.render(homeCtrl.scene, homeCtrl.camera);
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

                        this.SELECTEDFACILITY = intersects[0].object;

                        //再和水平面相交
                        var intersects1 = this.raycaster.intersectObjects( this.plane );

                        console.log(intersects);
                            
                        //选中位置和水平面位置（物体中心）的偏移量
                        this.offset.copy( intersects[0].point ).sub( this.plane.position );
                        //改变鼠标的样式
                        this.container.style.cursor = 'move';
                
                    } else {
                        f.material.color.setHex( 0x00ff00 );
                
                    }
                }
             
                
            },
            //当鼠标移动时触发的事件
            onMouseMove: event => {
                //阻止本来的默认事件，比如浏览器的默认右键事件是弹出浏览器的选项
                event.preventDefault();
                    
                //mouse.x是指 鼠标的x到屏幕y轴的距离与屏幕宽的一半的比值 绝对值不超过1
                //mouse.y是指 鼠标的y到屏幕x轴的距离与屏幕宽的一半的比值 绝对值不超过1
                //
                //下面的矩形是显示器屏幕，三维空间坐标系的布局以及屏幕的二维坐标系
                //
                // 鼠标是从  二维坐标系
                // 这个点 .-------------------------------------------|-->鼠标x正半轴
                //  开始算|                   个 y     /              |
                //   x,y  |                    |     /                |
                //        |                    |   /                  |
                //        |          三维坐标系| /                    |
                //        | -------------------/-------------------->x|
                //        |                  / |                      |
                //        |                /   |                      |
                //        |              /     |                      |
                //        |__________Z_匕______|______________________|
                //        |
                // 鼠标y  \/
                // 正半轴
                let BBox = this.renderer.domElement.getBoundingClientRect();
                this.mouse.x = ( (event.clientX - BBox.left) / this.renderer.domElement.clientWidth ) * 2 - 1;
                this.mouse.y = - ( (event.clientY - BBox.top) / this.renderer.domElement.clientHeight ) * 2 + 1;
    
                //新建一个三维变换半单位向量 假设z方向就是0.5,这样我左右移的时候，还会有前后移的效果
                var vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 0.5 );
                    
                //屏幕和场景转换工具根据照相机，把这个向量从屏幕转化为场景中的向量
                // this.projector.vector.unproject( vector, this.camera );
                
                //vector.sub( camera.position ).normalize()变换过后的向量vector减去相机的位置向量后标准化
                //新建一条从相机的位置到vector向量的一道光线
                var raycaster = new THREE.Raycaster( this.camera.position, vector.sub( this.camera.position ).normalize() );
    
                //是否有东西被选中
                if ( this.SELECTEDFACILITY ) {
                    //有的话取到这条光线射到的物体所在水平面上所有相交元素的集合,所以这样就可以限制每次拖动距离不能超出水平面panel
                    var intersects = this.raycaster.intersectObject( this.plane );
                    //这个鼠标点中的点的位置减去偏移向量，新位置赋值给选中物体
                    if(intersects.length > 0){
                        this.SELECTEDFACILITY .position.copy( intersects[ 0 ].point.sub( this.offset ) );
                    }
                    return;
    
                }
    
                //否则的话，光线和所有物体相交，返回相交的物体
                var intersects = this.raycaster.intersectObjects( this.facilityModels );
                //如果有物体相交了
                if ( intersects.length > 0 ) {
                    //并且相交物体不是上一个相交物体
                    if ( this.INTERSECTED != intersects[ 0 ].object ) {
                        //将这个对象放到this.INTERSECTED中
                        this.INTERSECTED = intersects[ 0 ].object;
                        //改变水平面的位置
                        this.plane.position.copy( this.INTERSECTED.position );
                        //并把水平面指向到相机的方向
                        this.plane.lookAt( this.camera.position );
    
                    }
                    //改变鼠标的样式
                    this.container.style.cursor = 'pointer';
    
                } else {
                    //改变鼠标的样式
                    this.container.style.cursor = 'auto';
    
                }
    
            },
            onMouseUp: event => {
                event.preventDefault();
                //又能改变视角了
                this.controls.enabled = true;
                //如果有相交物体
                if ( this.INTERSECTED ) {
                    //把位置给水平面
                    this.plane.position.copy( this.NTERSECTED.position );
                    //选中物体置空
                    this.SELECTEDFACILITY = null;
    
                }
                //改变鼠标的样式
                this.container.style.cursor = 'auto';
    
            },
            onWindowResize: () => {
                this.camera.aspect = this.WIDTH / this.HEIGHT;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize( this.WIDTH, this.HEIGHT );
            }
        }
    }

}

homeCtrl.$inject = ['$rootScope', '$scope', '$state', 'eventConstant', 'identityService', '$http', 'md5', 'variables'];

export default homeCtrl
