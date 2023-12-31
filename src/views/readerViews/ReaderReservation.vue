<script setup>
import {
    Edit,
    Delete,
    Document,
    DocumentDelete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { reservationListService, reservationCancelService, reservationAddService } from '@/api/reservation.js'
import useUserInfoStore from '@/stores/userInfo.js';
const rId = ref('');
const userInfoStore = useUserInfoStore();
// const visibleDrawer = ref(false);
const loading = ref(false)

const reservations = ref([
    {
        "reservationId": 6,
        "readerId": 3,
        "isbn": "ISBN7-301-02368-9",
        "reservationTime": "2023-12-24T01:00:11",
        "days": "",
        "reservationDueTime": "2024-01-01T01:00:11",
        "bookId": ""
    }
])

const readers = ref([
    {
        "readerId": 5,
        "name": "RRR",
        "phone": "15921035666",
        "email": "2662222222@qq.com"
    }
])
import { readerListService } from '@/api/reader.js'

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数
//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size;
    reservationList();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num;
    reservationList();
}



const reservationList = async () => {
    // loading.value = true;
    // let Rparams = {
    //     pageNum: 1,
    //     pageSize: 10
    // }

    // let Rresult = await readerListService(Rparams);

    // readers.value = Rresult.data.items;

    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        readerId: userInfoStore.info.readerId ? userInfoStore.info.readerId : null
    }

    let result = await reservationListService(params);

    total.value = result.data.total;
    reservations.value = result.data.items;

    for (let i = 0; i < reservations.value.length; i++) {
        let reservation = reservations.value[i];
        if (reservation.bookId == null) reservation.bookId = '/';
        reservation.readerName = userInfoStore.info.name
    }
    loading.value = false;
}
reservationList();

const cancelReservation = async (readerId, isbn, bookId)=> {
    console.log(readerId, isbn, bookId);

    ElMessageBox.confirm(
    '核销该预约吗?',
    '🔔温馨提示🔔',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
        let reult = await reservationCancelService(readerId, isbn, bookId);
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      reservationList();
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除取消',
      })
    })
}





</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>预约管理</span>

            </div>
        </template>
        <!-- 搜索表单 -->

        <!-- 文章列表 -->
        <el-table v-loading="loading" :data="reservations" style="width: 100%">
            <el-table-column label="序号" width="80" type="index"></el-table-column>
            <el-table-column label="姓名" prop="readerName"></el-table-column>
            <el-table-column label="ISBN" prop="isbn"> </el-table-column>
            <el-table-column label="书本编号" prop="bookId"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Document" circle plain type="info"  @click=""></el-button>
                    <el-button :icon="DocumentDelete" circle plain type="danger" @click="cancelReservation(row.readerId, row.isbn, row.bookId)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
    </el-card>

</template>

<style lang="scss" scoped>
.page-container {
    // position: relative; /* 相对定位 */
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

// .pagination-container {
//     position: absolute; /* 绝对定位 */
//     bottom: 20px; /* 定位到底部 */
//     width: 100%; /* 宽度与父容器相同 */
// }
/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>