<template>
    <div class="page-main">
        <section class="searchbox">
            <el-button type="primary" @click="showDialog({ name: '仓库A' })">仓库A</el-button>
            <el-button type="primary" @click="showDialog({ name: '仓库B' })">仓库B</el-button>
        </section>
        <el-dialog :visible.sync="dialogFormVisible" v-model="currentWareHouse"></el-dialog>
    </div>
</template>

<script>
// import commonMixin from '@/components/global/mixins';
// import overallMixin from '@/components/wms/mixins/overall';
// import pageMixin from '@/components/wms/mixins';
import elDialog from './dialog.vue';
export default {
    name: 'warehouseThree',
    // mixins: [ commonMixin, pageMixin, overallMixin ],
    data() {
        return {
            dialogFormVisible: true,
            currentWareHouse: { name: '仓库B' },
            imgSrc: require('./img/floor.jpg'),
        }
    },
    components: {
        elDialog
    },
    methods: {
        showDialog(obj) {
            this.dialogFormVisible = true;
            this.currentWareHouse = obj;
        }
    }
};
</script>
<style lang="scss" scoped>
@import "@/assets/elementui_reset.scss";
</style>