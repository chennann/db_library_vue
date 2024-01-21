<script setup>
import {
    Edit,
    Delete,
    Document,
    Select
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
const borrows = ref([
    {
        "borrowingId": 5,
        "readerId": 66,
        "readerName": "",
        "bookId": "C301.1",
        "borrowTime": "2023-11-27 11:47:50",
        "dueTime": "2023-12-07 11:47:50",
        "returnTime": "2023-11-27 11:48:14",
        "fine": 0
    }
])

import { borrowListService, returnBookService } from '@/api/borrow.js'
import useUserInfoStore from '@/stores/userInfo.js';
const loading = ref(false)
const userInfoStore = useUserInfoStore();

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(5)//每页条数
//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size;
    borrowList();
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num;
    borrowList();
}

const rId = ref('');
const state = ref('2');


const borrowList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        readerId: userInfoStore.info.readerId ? userInfoStore.info.readerId : null,
        status: state.value ? state.value : null
    }

    let result = await borrowListService(params);

    total.value = result.data.total;
    borrows.value = result.data.items;


    for (let i = 0; i < borrows.value.length; i++) {
        let borrow = borrows.value[i];
        if (borrow.returnTime == null) borrow.returnTime = '/'
        borrow.readerName = userInfoStore.info.name
    }
}
borrowList();


const qqq = () => {
    console.log("asdasd");
}

</script>

<template>
    <el-card class="page-container">
        <!-- 搜索表单 -->
        <el-form inline>

            <el-form-item label="借阅状态：">
                <el-select placeholder="请选择" v-model="state">
                    <el-option label="已还" value="0"></el-option>
                    <el-option label="未还" value="1"></el-option>
                    <el-option label="全部" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="borrowList">搜索</el-button>
                <el-button @click="rId = ''; state = '';borrowList()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="borrows" style="width: 100%">
            <el-table-column label="序号" width="80" type="index"></el-table-column>
            <el-table-column label="姓名" prop="readerName"></el-table-column>
            <el-table-column label="书本编号" prop="bookId"> </el-table-column>
            <el-table-column label="还书时间" prop="returnTime"></el-table-column>
            <el-table-column label="罚金" prop="fine"></el-table-column>
            <!-- <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Document" circle plain type="info"  @click="qqq"></el-button>
                </template>
            </el-table-column> -->
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