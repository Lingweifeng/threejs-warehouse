import * as THREE from 'three';
// 传入zone对象
export default function(zone) {
    console.log('zone', zone);
    let zShelves = zone.shelves;
    // 预设货架支架的厚度
    let thickness = 0.1;
    // 货架组
    let shelves = new THREE.Group();
    // 材质
    let material = new THREE.MeshLambertMaterial({ color: 0x3399ff });
    // 生成每一层
    for(let i = 0; i <= zShelves.rowNum;  i++) {
        let rowY = zShelves.y + thickness/2 + zShelves.height*i;
        // 生成每一格
        for(let j = 0; j < zShelves.columnNum; j++) {
            // 添加隔板(厚度设为支架的一半)
            // let boardGeo = new THREE.BoxBufferGeometry(zShelves.width, thickness/2, zShelves.depth);
            // let boardMesh = new THREE.Mesh(boardGeo, material);
            // 平板的起始位置
            // let boardStartZ = zShelves.z - zone.depth/2 + zShelves.depth/2 + 0.1;
            // let boardZ = boardStartZ + zShelves.depth*j;
            let boardStartX = zShelves.x - zone.width/2 + zShelves.width/2 + 0.1;
            let boardX = boardStartX + zShelves.width*j;
            // boardMesh.position.set(zShelves.x, rowY, boardZ);
            // shelves.add(boardMesh);
            let trestleGeo = new THREE.BoxBufferGeometry(thickness, zShelves.height, thickness);
            // 根据隔板位置定位
            let trestleY = rowY + zShelves.height/2;
            // 水平支架
            let trestleGeoV = new THREE.BoxBufferGeometry(zShelves.width, thickness, thickness);
            // 上v
            mesh = new THREE.Mesh(trestleGeoV, material);
            // mesh.position.set(zShelves.x - zShelves.width/2 + thickness - thickness/2, rowY, boardZ);
            mesh.position.set(boardX, rowY, zShelves.z - zShelves.depth/2 + thickness/2);
            shelves.add(mesh);
            // 下v
            mesh = new THREE.Mesh(trestleGeoV, material);
            // mesh.position.set(zShelves.x + zShelves.width/2 - thickness/2, rowY, boardZ);
            mesh.position.set(boardX, rowY, zShelves.z + zShelves.depth/2 - thickness/2);
            shelves.add(mesh);
            // 中x1
            let trestleGeoH = new THREE.BoxBufferGeometry(thickness, thickness, zShelves.depth);
            mesh = new THREE.Mesh(trestleGeoH, material);
            // mesh.position.set(zShelves.x, rowY, boardZ - zShelves.depth/4 + thickness/2);
            mesh.position.set(boardX - zShelves.width/4 + thickness/2, rowY, zShelves.z);
            shelves.add(mesh);
            // 中x2
            mesh = new THREE.Mesh(trestleGeoH, material);
            // mesh.position.set(zShelves.x, rowY, boardZ + thickness/2);
            mesh.position.set(boardX + thickness/2, rowY, zShelves.z);
            shelves.add(mesh);
            // 中x3
            mesh = new THREE.Mesh(trestleGeoH, material);
            // mesh.position.set(zShelves.x, rowY, boardZ + zShelves.depth/4 + thickness/2);
            mesh.position.set(boardX + zShelves.width/4 + thickness/2, rowY, zShelves.z);
            shelves.add(mesh);
            // 前x
            mesh = new THREE.Mesh(trestleGeoH, material);
            // mesh.position.set(zShelves.x, rowY, boardZ + zShelves.depth/2 - thickness/2);
            mesh.position.set(boardX + zShelves.width/2 - thickness/2, rowY, zShelves.z);
            shelves.add(mesh);
            // 最后一层不用添加竖向支架
            if(i !== zShelves.rowNum) {
                // 添加第一格多出的2根支柱+水平支架
                if(j === 0) {
                    // 左v
                    let mesh = new THREE.Mesh(trestleGeo, material);
                    // mesh.position.set(zShelves.x - zShelves.width/2 + thickness/2, trestleY, boardZ - zShelves.depth/2 + thickness/2);
                    mesh.position.set(boardX - zShelves.width/2 + thickness/2, trestleY, zShelves.z - zShelves.depth/2 + thickness/2);
                    shelves.add(mesh);
                    // 右v
                    mesh = new THREE.Mesh(trestleGeo, material);
                    // mesh.position.set(zShelves.x + zShelves.width/2 - thickness/2, trestleY, boardZ - zShelves.depth/2 + thickness/2);
                    mesh.position.set(boardX - zShelves.width/2 + thickness/2, trestleY, zShelves.z + zShelves.depth/2 - thickness/2);
                    shelves.add(mesh);
                    // 前x
                    let trestleGeoH = new THREE.BoxBufferGeometry(thickness, thickness, zShelves.depth);
                    mesh = new THREE.Mesh(trestleGeoH, material);
                    // mesh.position.set(zShelves.x, rowY, boardZ - zShelves.depth/2 + thickness/2);
                    mesh.position.set(boardX - zShelves.width/2 + thickness/2, rowY, zShelves.z);
                    shelves.add(mesh);
                };
                // 添加箱子
                // if(zShelves.box) {
                    let boxMat = new THREE.MeshLambertMaterial({ color: 0xffcc99 });
                    let boxGeo = new THREE.BoxBufferGeometry(1, 0.8, 1);
                    let boxMesh = new THREE.Mesh(boxGeo, boxMat);
                    // boxMesh.position.set(zShelves.x + zShelves.width/2 - 0.8 - thickness/2, rowY + 0.45, boardZ + zShelves.depth/2 - thickness/2 - 1);
                    boxMesh.position.set(boardX + zShelves.width/2 - thickness/2 - 1, rowY + 0.45, zShelves.z + zShelves.depth/2 - 0.8 - thickness/2);
                    shelves.add(boxMesh);
                // };
                // 每格对应2根垂直支撑柱(0.1*0.1*1)
                let mesh = new THREE.Mesh(trestleGeo, material);
                // mesh.position.set(zShelves.x + zShelves.width/2 - thickness/2, trestleY, boardZ + zShelves.depth/2 - thickness/2);
                mesh.position.set(boardX + zShelves.width/2 - thickness/2, trestleY, zShelves.z + zShelves.depth/2 - thickness/2);
                shelves.add(mesh);
                mesh = new THREE.Mesh(trestleGeo, material);
                // mesh.position.set(zShelves.x - zShelves.width/2 + thickness/2, trestleY, boardZ + zShelves.depth/2 - thickness/2);
                mesh.position.set(boardX + zShelves.width/2 - thickness/2, trestleY, zShelves.z - zShelves.depth/2 + thickness/2);
                // mesh.receiveShadow = true;
                // mesh.castShadow = true;
                shelves.add(mesh);
            };
        };
    };
    // 标示牌的长宽高
    // 平板的起始位置
    // shelves.position.set(zShelves.x, zShelves.y, zShelves.z);
    let boardStartX = zShelves.x - zone.width/2 + zShelves.width/2 + 0.1;
    let flagGeo = new THREE.BoxBufferGeometry(0.01, 0.8, 1.2);
    let flatMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    // 左面的白板
    let mesh = new THREE.Mesh(flagGeo, flatMat);
    // mesh.position.set(zShelves.x, zShelves.height, boardZ + zShelves.depth/2);
    mesh.position.set(boardStartX - zShelves.width/2, zShelves.height, zShelves.z);
    mesh.name = 'flagBoard';
    shelves.add(mesh);
    // 右面的白板
    let boardX = boardStartX + zShelves.width*(zShelves.columnNum - 1);
    mesh = new THREE.Mesh(flagGeo, flatMat);
    // mesh.position.set(zShelves.x, zShelves.height, boardZ + zShelves.depth/2);
    mesh.position.set(boardX + zShelves.width/2, zShelves.height, zShelves.z);
    mesh.name = 'flagBoard';
    shelves.add(mesh);
    shelves.name = zShelves.name;
    return shelves;
};
