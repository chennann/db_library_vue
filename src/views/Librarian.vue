<script setup>

</script>

<template>
    <el-card class="page-container">

        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="bookName：">
                <el-input name="bookName" placeholder="请输入bookName" v-model="bookName"></el-input>
            </el-form-item>

            <el-form-item label="bookId：">
                <el-input name="bookId" placeholder="请输入bookId" v-model="bookId"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="bookCopiesList">搜索</el-button>
                <el-button @click="bookName = '';bookId = '';bookCopiesList()">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="bookCopies" style="width: 100%">
            <el-table-column label="序号" width="80" type="index"></el-table-column>
            <el-table-column label="书名" prop="title"></el-table-column>
            <el-table-column label="bookId" prop="bookId"> </el-table-column>
            <el-table-column label="状态" prop="status"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    
                    <el-button :icon="Delete" circle plain type="danger" @click="visibleDrawer = true, borrowModel.bookId = row.bookId"></el-button>
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
         <!-- 抽屉 -->
         <el-drawer v-model="visibleDrawer" title="入库管理" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form :model="borrowModel" label-width="100px" :rules="rules">
                <el-form-item label="readerId">
                    <el-input v-model="borrowModel.readerId" placeholder="请输入readerId"></el-input>
                </el-form-item>
                <el-form-item label="bookId">
                    <el-input v-model="borrowModel.bookId" placeholder="请输入bookId" disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="bookId">
                    <el-date-picker
                        v-model="date"
                        type="datetime"
                        placeholder="选择还书日期"
                        format="YYYY-MM-DD HH:mm:ss"
                        date-format="MMM DD, YYYY"
                        time-format="HH:mm"
                        :disabled-date="disabledDate"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="borrow(date)">确定</el-button>
                    <el-button type="info" @click="visibleDrawer = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
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