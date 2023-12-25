<script setup>
import {
    Management,
    Promotion,
    UserFilled,
    User,
    Crop,
    EditPen,
    SwitchButton,
    CaretBottom,
    MessageBox,
    Service,
    Upload,
    Download
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'


import { librarianInfoService } from '@/api/librarian.js';
import useUserInfoStore from '@/stores/userInfo.js';
import { ElMessage, ElMessageBox } from 'element-plus';
import {useTokenStore} from '@/stores/token.js'

const tokenStore = useTokenStore();
const userInfoStore = useUserInfoStore();
const getUserInfo = async () => {

    let result = await librarianInfoService();

    userInfoStore.setInfo(result.data);
}
console.log(userInfoStore.info.librarianNumber);
getUserInfo();

import { useRouter } from 'vue-router';
const router = useRouter();


const handleCommand = (command) => {
    console.log(command);
    if (command === 'logout') {
        //logout
        ElMessageBox.confirm(
            '确定退出登陆吗?',
            '🔔温馨提示🔔',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
            .then(async () => {
                
                tokenStore.removeToken();
                userInfoStore.removeInfo();

                router.push('/login');

                ElMessage({
                    type: 'success',
                    message: '退出登陆成功',
                })
                
            })
            .catch(() => {
                ElMessage({
                    type: 'info',
                    message: '取消退出',
                })
            })
    }
    else {
        router.push('/librarian');
    }
}
</script>

<template>
    <el-container class="layout-container">
        <!-- 左侧菜单 -->
        <el-aside width="200px">
            <div class="el-aside__logo"></div>
            <el-menu active-text-color="#ffd04b" background-color="#041c32" text-color="#fff" unique-opened="true" router>
                <el-menu-item index="/book">
                    <el-icon>
                        <Management />
                    </el-icon>
                    <span>图书</span>
                </el-menu-item>
                <el-sub-menu index="1">
                    <template #title>
                        <el-icon>
                            <MessageBox />
                        </el-icon>
                        <span>借阅管理</span>
                    </template>
                    <el-menu-item index="/borrow">
                        <el-icon>
                            <Upload />
                        </el-icon>
                        <span>登记借阅</span>
                    </el-menu-item>
                    <el-menu-item index="/return">
                        <el-icon>
                            <Download />
                        </el-icon>
                        <span>还书</span>
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item index="/reservation">
                    <el-icon>
                        <Promotion />
                    </el-icon>
                    <span>预约管理</span>
                </el-menu-item>
                <el-sub-menu index="2">
                    <template #title>
                        <el-icon>
                            <UserFilled />
                        </el-icon>
                        <span>账号管理</span>
                    </template>
                    <el-menu-item index="/reader">
                        <el-icon>
                            <User />
                        </el-icon>
                        <span>读者账号</span>
                    </el-menu-item>
                    <el-menu-item index="/librarian">
                        <el-icon>
                            <Service />
                        </el-icon>
                        <span>管理员账号</span>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
        <!-- 右侧主区域 -->
        <el-container>
            <!-- 头部区域 -->
            <el-header>
                <div>管理员：<strong>{{ userInfoStore.info.librarianNumber ? userInfoStore.info.librarianNumber : '' }}</strong></div>
                <el-dropdown placement="bottom-end" @command="handleCommand">
                    <span class="el-dropdown__box">
                        <strong>{{ userInfoStore.info.name ? userInfoStore.info.name : '' }}</strong>
                        
                        <el-icon>
                            <CaretBottom />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="info" :icon="User">基本资料</el-dropdown-item>
                            <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 中间区域 -->
            <el-main>
                <router-view></router-view>
            </el-main>
            <!-- 底部区域 -->
            <el-footer>图书管理系统 ©2023 Created by chennann</el-footer>
        </el-container>
    </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;

    .el-aside {
        background-color: #041c32;

        &__logo {
            height: 120px;
            background: url('@/assets/library.png') no-repeat center / 120px auto;
        }

        .el-menu {
            border-right: none;
        }
    }

    .el-header {
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .el-dropdown__box {
            display: flex;
            align-items: center;

            .el-icon {
                color: #999;
                margin-left: 10px;
            }

            &:active,
            &:focus {
                outline: none;
            }
        }
    }

    .el-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: #666;
    }
}
</style>