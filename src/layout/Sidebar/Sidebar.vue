<script setup>
import { defineProps, defineEmits } from 'vue'
import SidebarItem from './SidebarItem.vue'

const props = defineProps({
    isCollapsed: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['toggle'])

const items = [
    { icon: 'fas fa-file-alt', label: 'Tin tuyển dụng' },
    { icon: 'fas fa-user-friends', label: 'Ứng viên', to: '/candidate' },
    { icon: 'fas fa-calendar-alt', label: 'Lịch', to: '/calendar' },
    { icon: 'fas fa-star', label: 'Kho tiềm năng' },
    { icon: 'fas fa-bullhorn', label: 'Chiến dịch tuyển dụng' },
    { icon: 'fas fa-briefcase', label: 'Công việc' },
    { icon: 'fas fa-envelope', label: 'aiMarketing' },
    { icon: 'fas fa-comments', label: 'Trao đổi với ứng viên' },
    { icon: 'fas fa-chart-bar', label: 'Báo cáo' },
    { icon: 'fas fa-cog', label: 'Thiết lập' },
    { icon: 'fas fa-lightbulb', label: 'Kiến thức hữu ích' }
]
</script>

<template>
        <aside class="sidebar" :class="{ collapsed: isCollapsed }">
                <nav class="sidebar-nav">
                        <ul>
                            <SidebarItem v-for="(it, idx) in items" :key="idx" :icon="it.icon" :label="it.label" :to="it.to" :active="it.active || false" :collapsed="isCollapsed" @navigate="() => {}" />
                        </ul>
                </nav>
                <div class="sidebar-footer">
                        <button class="collapse-btn" @click="emit('toggle')">
                                <i :class="isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
                                <span>{{ isCollapsed ? 'Mở rộng' : 'Thu gọn' }}</span>
                        </button>
                </div>
        </aside>
</template>
<!-- <style>
@import "../assets/css/styles.css";
</style> -->
<style scoped>

.sidebar {
    width: var(--sidebar-width); 
    background-color: var(--sidebar-bg);
    color: var(--sidebar-text);
    display: flex;
    flex-direction: column;
    padding: 15px;
    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    z-index: 999; 
    position: fixed; 
    top: var(--header-height); 
    left: 0;
    height: calc(100vh - var(--header-height)); 
    transition: width 0.3s ease, padding 0.3s ease, z-index 0.3s ease, left 0.3s ease; 
}


.sidebar-header i {
    font-size: 15px;
    color: var(--primary-color);
    margin-right: 10px;
}

.sidebar.collapsed .sidebar-header i:nth-child(1),
.sidebar.collapsed .sidebar-header i:nth-child(2) {
    margin-left: 0px; 
}

.app-name {
    font-size: 16px;
    font-weight: bold;
}

.sidebar-nav ul {
    list-style: none;
}

.sidebar-nav li {
    margin-bottom: 5px;
}

.sidebar-nav a {
    display: flex;
    align-items: center;
    color: var(--sidebar-text);
    text-decoration: none;
    padding: 8px 10px;
    border-radius: 5px;
    transition: background-color 0.2s ease;
}

.sidebar-nav a:hover {
    background-color: rgba(255,255,255,0.08);
}

.sidebar-nav li.active a {
    background-color: var(--sidebar-active-bg);
    font-weight: bold;
}

.sidebar-nav i {
    margin-right: 10px;
    font-size: 14px;
}

.sidebar-footer {
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
    text-align: center;
}

.sidebar-footer img {
    max-width: 100%;
    height: auto;
    margin-bottom: 15px;
    border-radius: 5px;
}

.collapse-btn {
    background-color: transparent;
    border: none;
    color: var(--sidebar-text);
    padding: 8px 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: 10px;
    transition: background-color 0.2s ease;
}

.collapse-btn:hover {
    background-color: rgba(255,255,255,0.08);
}

.collapse-btn i {
    margin-right: 5px;
}

.sidebar.collapsed {
    width: 50px; 
    overflow: hidden;
    padding: 15px 0;
    border: none; 
    z-index: 999; 
    visibility: visible; 
}

.sidebar.collapsed .sidebar-header,
.sidebar.collapsed .sidebar-nav,
.sidebar.collapsed .sidebar-footer {
    display: flex; 
    flex-direction: column;
    align-items: center;
}

.sidebar.collapsed .sidebar-nav a span,
.sidebar.collapsed .sidebar-footer span {
    display: none; 
}

.sidebar.collapsed .sidebar-nav a {
    justify-content: center;
    padding: 10px 0;
}

.sidebar.collapsed .sidebar-nav a i,
.sidebar.collapsed .collapse-btn i {
    margin-right: 0px; 
}

.sidebar.collapsed .sidebar-header .app-name {
    display: none;
}

.sidebar.collapsed .sidebar-header i.fas.fa-th,
.sidebar.collapsed .sidebar-header i.fas.fa-user {
    display: inline-block; 
}

.sidebar-nav li span {
    display: inline-block;
}

.sidebar.collapsed .sidebar-nav a.collapsed span {
    display: none;
}

.sidebar.collapsed .sidebar-header .app-name {
    display: none;
}
.sidebar.collapsed .sidebar-header i {
    margin-right: 0;
}

.sidebar.collapsed .collapse-btn i {
    margin-right: 0;
}

.sidebar-header .app-name {
    display: none;
}

.sidebar-header i.fas.fa-th,
.sidebar-header i.fas.fa-user {
    display: none;
}
</style>