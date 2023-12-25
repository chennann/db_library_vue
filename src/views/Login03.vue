<script setup>
import { User, Lock, Wallet } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false)

const registerData = ref({
    librarianNumber: '',
    name: ''
})

const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次确认密码'))
    }
    else if (value != registerData.value.password) {
        callback(new Error('请确保两次输入的密码一样'))
    }
    else {
        callback()
    }
}

const rules = {
    librarianNumber: [
        { required: true, message: '请输入管理员ID', trigger: 'blur' },
        { min: 1, max: 16, message: '长度为1-16位非空字符', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
        { min: 1, max: 16, message: '长度为1-16位非空字符', trigger: 'blur' }
    ]
}

import { librarianAddService, librarianLoginService } from '@/api/librarian.js';
const register = async () => {
    let result = await librarianAddService(registerData.value);

    ElMessage.success(result.message ? result.message : '注册成功。。。。。。');
}

import { useTokenStore } from '@/stores/token.js';
import { useRouter } from 'vue-router'
const router = useRouter();
const tokenStore = useTokenStore();
const login = async () => {
    let params = {
        librarianNumber: registerData.value.librarianNumber,
        name: registerData.value.name
    }


    let result = await librarianLoginService(params);

    ElMessage.success(result.message ? result.message : '登陆成功。。。。。。');

    tokenStore.setToken(result.data);

    router.push('/');
}

const clearRegisterData = () => {
    registerData.value = {
        librarianNumber: '',
        name: ''
    }
}

</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg">
            <div class="hero">
                <h1>图书<br>管理系统</h1>
                
            </div>
        </el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>新增管理员</h1>
                </el-form-item>
                <el-form-item prop="librarianNumber">
                    <el-input :prefix-icon="User" placeholder="请输入管理员ID" v-model="registerData.librarianNumber"></el-input>
                </el-form-item>
                <el-form-item prop="name">
                    <el-input :prefix-icon="Wallet" type="plain" placeholder="请输入姓名"
                        v-model="registerData.name" ></el-input>
                        
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false; clearRegisterData()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-else :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item prop="librarianNumber">
                    <el-input :prefix-icon="User" placeholder="请输入管理员ID" v-model="registerData.librarianNumber"></el-input>
                </el-form-item>
                <el-form-item prop="name">
                    <el-input name="name" :prefix-icon="Wallet" type="plain" placeholder="请输入姓名"
                        v-model="registerData.name"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true; clearRegisterData()">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style>
:root {
    --primary-color: #4460f1;
    --white-color: #ffffff;

    --light-text-color: #9398b3;
    --light-bg-color: #f2f4ff;
    --dark-color: #333333;

    --background-color: #fcfcff;

    --el-border-radius-base: 50px;
}

* {
    font-family: 'Noto Sans SC', sans-serif;
}

.hero {
    position: absolute;
    top: 200px;
    left: 200px;
}

.hero h1 {
    font-size: 80px;
}
.hero::before {
    content: '';
    position: absolute;
    top: 15%;
    left: 0;
    width: 280px;
    height: 100px;
    background: linear-gradient(to right, var(--primary-color), #c471ed, #f64f59);
    z-index: -1;
    filter: blur(70px);
}


.login-page {
    height: 100vh;
    /* background-color: #fff; */

    /* .bg {
        background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    } */


    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}


/*搜索input框 */
.el-input{
    --el-input-border-radius: 20px;
}


</style>