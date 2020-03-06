<template>
    <div>
        <el-dialog class="dialog-full margin-none" :before-close="beforeClose" @open="onOpen" :title="value.name" :visible.sync="visible" :close-on-click-modal="false" fullscreen>
            <div ref="whContainer" class="wh-container"></div>
            <!-- <div slot="footer" class="dialog-footer">
                <el-button type="primary" :loading="submitLoading">{{$t('确定')}}</el-button>
                <el-button @click="beforeClose">{{$t('取消')}}</el-button>
            </div> -->
        </el-dialog>
    </div>
</template>

<script>
// import overallMixin from '@/components/wms/mixins/overall';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import createFloor from './module/floor'; // 地板
import createWall from './module/wall'; // 墙
import createZone from './module/zone'; // 存储区
import createShelves from './module/shelves'; // 货架
// import font from './module/font'; // 货架
export default {
    // mixins: [ overallMixin ],
    props: ['visible', 'value'],
    watch: {
        visible(val) {
            if (val) {

            }
        },
    },
    data() {
        return {
            camera: null, // 相机
            scene: null, // 场景
            renderer: null, // 渲染器
            controls: null, // 鼠标查看控制器
            dragControls: null, // 拖拽控制
            transformControls: null, // 平衡控件
            draggableObjects: [],
			objects: [], // 可拖拽对象
            depth: 0.1, // 墙体厚度预设
            // 仓库
            wareHouse: {
                width: 40, // 长
                depth: 30, // 深
                height: 5, // 高
            },
            // 存储区
            zoneList: [
                {
                    name: '存储区1',
                    width: 10, // 长
                    depth: 4, // 宽
                    // 三维位置信息
                    position: {
                        x: -14,
                        y: 0.1,
                        z: -8
                    },
                    // 存储区上的货架参数
                    shelves: {
                        name: '货架1',
                        rowNum: 3, // 层数
                        columnNum: 3, // 列数
                        width: 2.8, // 每格宽
                        height: 1, // 每格高
                        depth: 1.8, // 每格深
                        x: -13,
                        y: 0.1,
                        z: -3
                    }
                },
                {
                    name: '存储区2',
                    width: 10, // 长
                    depth: 4, // 宽
                    // 三维位置信息
                    position: {
                        x: 6,
                        y: 0.1,
                        z: -8
                    },
                    // 存储区上的货架参数
                    shelves: {
                        name: '货架2',
                        rowNum: 3, // 层数
                        columnNum: 5, // 列数
                        width: 1.8, // 每格宽
                        height: 1, // 每格高
                        depth: 1.8, // 每格深
                        x: 6,
                        y: 0.1,
                        z: -4
                    }
                },
                // 多级存储区
                {
                    name: '存储区3',
                    width: 12, // 长
                    depth: 12, // 宽
                    // 三维位置信息
                    position: {
                        x: -13,
                        y: 0.1,
                        z: 6
                    },
                    // 子级存储区
                    children: [
                        {
                            name: '存储区3-1',
                            width: 10, // 长
                            depth: 4, // 宽
                            // 三维位置信息
                            position: {
                                x: -13,
                                y: 0.15,
                                z: 3
                            },
                            // 子级存储区
                            children: null,
                            // 存储区上的货架参数
                            shelves: null
                        },
                        {
                            name: '存储区3-2',
                            width: 10, // 长
                            depth: 6, // 宽
                            // 三维位置信息
                            position: {
                                x: -13,
                                y: 0.15,
                                z: 8
                            },
                            // 子级存储区
                            children: null,
                            // 存储区上的货架参数
                            shelves: null
                        },
                    ], 
                    // 存储区上的货架参数
                    shelves: null
                },
                {
                    name: '存储区4',
                    width: 12, // 长
                    depth: 10, // 宽
                    // 三维位置信息
                    position: {
                        x: 6,
                        y: 0.1,
                        z: 6
                    },
                    // 存储区上的货架参数
                    shelves: {
                        name: '货架3',
                        rowNum: 4, // 层数
                        columnNum: 6, // 列数
                        width: 1.8, // 每格宽
                        height: 1, // 每格高
                        depth: 1.8, // 每格深
                        x: 10,
                        y: 0.1,
                        z: 6
                    }
                },
            ],
            zoneNum: 5, // 存储区数量
        }
    },
    components: {
    },
    methods: {
        beforeClose() {
            // 关闭弹窗后清除3D canvas
            let $whContainer = this.$refs.whContainer;
            let childNodes = $whContainer ? $whContainer.childNodes : [];
            if(childNodes[0]) $whContainer.removeChild(childNodes[0]);
            this.$emit('update:visible', false);
        },
        // 初始化光源
        initLight() {
            var light = new THREE.DirectionalLight( 0xdfebff, 1 );
            light.position.set( 50, 200, 100 );
            light.position.multiplyScalar( 1.3 );

            light.castShadow = true;

            light.shadow.mapSize.width = 1024;
            light.shadow.mapSize.height = 1024;

            light.shadow.camera.far = 1;

            this.scene.add( light );
        },
        // 初始化地板
        initFloor() {
            // 添加地板(width, height, depth, position, rotation)
            let floorMesh = createFloor(this.wareHouse.width, this.wareHouse.depth, this.depth, { x: 0, y: 0, z: 0 }, { x: Math.PI / 2 });
            console.log('floor', floorMesh);
            this.scene.add(floorMesh);
        },
        // 初始化仓库墙面
        initWall() {
            // 添加后墙面(width, height, depth, position, rotation)
            let backUpWall = createWall(this.wareHouse.width, this.wareHouse.height, this.depth, { y: this.wareHouse.height/2, z: -this.wareHouse.depth/2 }, { x: 0 });
            this.scene.add(backUpWall);
            // 添加左墙面(width, height, depth, position, rotation)
            let leftWall = createWall(this.wareHouse.depth, this.wareHouse.height, this.depth, { x: -this.wareHouse.width/2, y: this.wareHouse.height/2 }, { y: Math.PI / 2 });
            this.scene.add(leftWall);
            // 添加右墙面(width, height, depth, position, rotation)
            let rightWall = createWall(this.wareHouse.depth, this.wareHouse.height, this.depth, { x: this.wareHouse.width/2, y: this.wareHouse.height/2 }, { y: Math.PI / 2 });
            this.scene.add(rightWall);
        },
        // 存储区
        initZone() {
            let self = this;
            let loader = new THREE.FontLoader();
            loader.load( '/threejs/fonts/SimHei_Regular.json', function ( font ) {

                let text;

                let color = 0x003399;

                let matLite = new THREE.MeshBasicMaterial( {
                    color: color,
                    // transparent: true,
                    // opacity: 0.4,
                    side: THREE.DoubleSide
                } );

                // 递归生成文字
                function creatZoneText(zone, group) {
                    let zonePos = zone.position;
                    let shapes = font.generateShapes( zone.name, 0.2 );
                    let geometry = new THREE.ShapeBufferGeometry( shapes );
                    // 左面文字
                    let txtPos = { x: zonePos.x - zone.width/2 + 0.05, y: zonePos.y + 0.01, z: zonePos.z - zone.depth/2 };
                    let text = new THREE.Mesh( geometry, matLite );
                    text.position.set(txtPos.x, txtPos.y, txtPos.z);
                    text.rotation.x = -Math.PI / 2;
                    text.rotation.z = -Math.PI / 2;
                    if(group) group.add( text );
                    // 右面文字
                    txtPos = { x: zonePos.x + zone.width/2 - 0.05, y: zonePos.y + 0.01, z: zonePos.z + zone.depth/2 };
                    text = new THREE.Mesh( geometry, matLite );
                    text.position.set(txtPos.x, txtPos.y, txtPos.z);
                    text.rotation.x = -Math.PI / 2;
                    text.rotation.z = Math.PI / 2;
                    if(group) group.add( text );
                    // 遍历子级，分别创建子级存储区
                    if(zone.children && zone.children[0]) {
                        zone.children.forEach(child => {
                            creatZoneText(child, group);
                        });
                    };
                };
                // 遍历存储区每个添加
                self.zoneList.forEach(zone => {
                    self.$set(zone, 'height', 0.01);
                    let zoneGroup = createZone(zone);
                    // 添加存储区文字标识
                    creatZoneText(zone, zoneGroup);
                    self.scene.add(zoneGroup);
                    self.objects.push(zoneGroup);
                    // 如果有货架恻添加存储区的货架
                    if(zone.shelves) {
                        self.$set(zone.shelves, 'x', zone.position.x);
                        self.$set(zone.shelves, 'y', 0.1);
                        self.$set(zone.shelves, 'z', zone.position.z);
                        let shelvesGroup = createShelves(zone);
                        console.log('shelvesGroup', shelvesGroup);
                        // shelvesGroup.position.set(x, 0, z);
                        let zShelves = zone.shelves;
                        let boardStartX = zShelves.x - zone.width/2 + zShelves.width/2 + 0.1;
                        let boardX = boardStartX + zShelves.width*(zShelves.columnNum - 1);
                        let shapes = font.generateShapes( `${zone.name}\n${zone.shelves.name}`, 0.2 );
                        let geometry = new THREE.ShapeBufferGeometry( shapes );
                        // 左侧文字
                        let text = new THREE.Mesh( geometry, matLite );
                        text.position.set(boardStartX - zShelves.width/2 - 0.01, zShelves.height + 0.05, zShelves.z - 0.5);
                        text.rotation.y = -Math.PI / 2;
                        shelvesGroup.add( text );
                        // 右侧文字
                        text = new THREE.Mesh( geometry, matLite );
                        text.position.set(boardX + zShelves.width/2 + 0.01, zShelves.height + 0.05, zShelves.z + 0.5);
                        text.rotation.y = Math.PI / 2;
                        shelvesGroup.add( text );
                        self.scene.add(shelvesGroup);
                        self.objects.push(shelvesGroup);
                    };
                });
                // 所有物体加载完成后再加载拖拽控件
                self.initDragControls();
            });
        },
        // 初始化轨迹球控件
        initControls() {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            // // 视角最小距离
            this.controls.minDistance = 0.001;
            // // 视角最远距离
            this.controls.maxDistance = 50;
            // // 最大角度
            this.controls.maxPolarAngle = Math.PI * 0.5;
            this.controls.target = new THREE.Vector3(0.01, 0.01, 0.01);
        },
        // initDragControls
        initDragControls() {
            let self = this;
            // 拖拽的时候需要禁用移动
            // self.controls.enabled = false;
            // 添加平移控件
            this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
            this.transformControls.showY = false;
            // 平移时要禁用掉鼠标旋转
            this.transformControls.addEventListener( 'mouseDown', () => {
                self.controls.enabled = false;
            });
            this.transformControls.addEventListener( 'mouseUp', () => {
                self.controls.enabled = true;
            });
            this.scene.add(this.transformControls);
            console.log('objects', this.objects);
            this.dragControls = new DragControls( [ ...this.objects ], this.camera, this.renderer.domElement );
            console.log('this.dragControls', this.dragControls);
            this.dragControls.addEventListener( 'drag', this.render );
            // 鼠标略过事件
            this.dragControls.addEventListener('hoveron', event => {
                // console.log('hoveron event', event);
                self.draggableObjects = self.dragControls.getObjects();
                // console.log('draggableObjects', self.draggableObjects);
                self.draggableObjects.length = 0;
                // console.log('draggableObjects', self.draggableObjects);
                let parent = event.object.parent;
                // 存储区、货架都是整组平移
                if(parent && parent.type === 'Group') {
                    // hover效果
                    parent.children.forEach(child => {
                        console.log('child', child);
                        child.material.emissive.set( 0x000000 );
                    });
                    self.dragControls.transformGroup = true;
                    // self.draggableObjects.push(parent);
                    self.draggableObjects.length = 0;
                    this.transformControls.attach(parent);
                    let parentPos = parent.position;
                    this.transformControls.position.set(parentPos.x, parentPos.y, parentPos.z);
                    // self.render();
                } else { // 拖拽箱子(自由拖拽)
                    // hover效果
                    event.object.material.emissive.set( 0x000000 );
                    self.dragControls.transformGroup = false;
                    self.draggableObjects.push(event.object);
                    self.transformControls.detach();
                    // self.draggableObjects.push(event.object);
                };
                // debugger;
                // self.controls.enabled = false;
                // 让变换控件对象和选中的对象绑定
                // self.transformControls.attach(event.object.parent);
            });
            // 鼠标离开事件
            this.dragControls.addEventListener('hoveroff', function (event) {
                // console.log('hoveroff event', event);
                self.draggableObjects.length = 0;
                self.dragControls.transformGroup = false;
                self.draggableObjects.push(...self.objects);
                // self.transformControls.detach();
                // debugger;
                // self.controls.enabled = true;
                // 让变换控件对象和选中的对象绑定
                // self.transformControls.detach();
            });
            this.dragControls.addEventListener( 'dragstart', event => {
                console.log('dragstart event', event, event.object.parent);
                self.controls.enabled = false;
                // self.$set(self.controls, 'enabled', false);
                // console.log('self.controls start', self.controls);
                // event.object.material.emissive.set( 0xaaaaaa );
            });
            this.dragControls.addEventListener('drag', (event) => {
                console.log('event', event);
                // event.object.parent.position.copy(event.object.postion);  // parent的位置更新为object的位置
                // event.object.position.set(0, 0, 0); // 相对于parent来说, position置为原始状态
            });
			this.dragControls.addEventListener( 'dragend', event => { 
                self.controls.enabled = true;
                // self.$set(self.controls, 'enabled', true);
                console.log('dragend event', event);
                // self.render();
                // console.log('self.controls end', self.controls);
                // event.object.material.emissive.set( 0x000000 );
                // self.dragControls.transformGroup = false;
            });
        },
        init() {
            let $whContainer = this.$refs.whContainer;
            console.log('$whContainer', $whContainer);
            // 创建场景
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color( 0xcce0ff );
            // 相机设置
            this.camera = new THREE.PerspectiveCamera( 45, $whContainer.clientWidth / $whContainer.clientHeight, 0.1, 20000 );
            this.camera.position.set(-Math.PI*10, 20, 40);
            this.camera.focus = 0.1;
            this.scene.add(this.camera);
            // 3维辅助线
            var axes = new THREE.AxisHelper(30);
            axes.position.y = 0.1
            this.scene.add(axes);
            // 风格辅助线
            let gridHelper = new THREE.GridHelper( 100, 30, 0x333333, 0x999999 );
            gridHelper.position.y = 0.1;
            this.scene.add(gridHelper);
            // 添加光源
            this.initLight();
            // 渲染器
            this.renderer = new THREE.WebGLRenderer( { antialias: true } );
            this.renderer.setSize( $whContainer.clientWidth, $whContainer.clientHeight );
            // 鼠标控件
            this.initControls();
            // 地板
            this.initFloor();
            // 墙
            this.initWall();
            // 存储区
            this.initZone();
            // 文字
            // this.initTxt();
            // 拖拽控件
            // this.initDragControls();
            // this.renderer.render( this.scene, this.camera );
            // 加载之前先删除子节点
            let childNodes = $whContainer.childNodes;
            if(childNodes[0]) $whContainer.removeChild(childNodes[0]);
            $whContainer.appendChild(this.renderer.domElement);
            // 动画
            this.animate();
            // 窗口大小改变时重绘
            window.addEventListener( 'resize', this.onWindowResize, false );
        
        },
        // 窗口变化后需要重新渲染
        onWindowResize() {
            let $whContainer = this.$refs.whContainer;
            this.camera.aspect = $whContainer.clientWidth / $whContainer.clientHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( $whContainer.clientWidth, $whContainer.clientHeight );
        },
        // 更新控件
        update() {
            // only required if controls.enableDamping = true, or if controls.autoRotate = true
            // this.controls.update();
            // this.dragControls.update();  
        },
        // 渲染
        render() {
            this.renderer.render( this.scene, this.camera ); 
        },
        animate() {
            requestAnimationFrame( this.animate );
            this.render();
            // this.update();
        },
        onOpen() {
            this.$nextTick(() => {
                this.init();
                // this.animate();
            });
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.init();
            // this.animate();
        });
    },
};
</script>
<style lang="scss" scoped>
@import "@/assets/elementui_reset.scss";
.el-dialog__body {
    height: 600px;
}
.wh-container {
    height: 100%;
    // background-color:#000;
}
</style>
