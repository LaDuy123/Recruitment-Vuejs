<script setup>
import { ref } from 'vue' 
import HeaderComponent from './layout/Header.vue'
import SidebarComponent from './layout/Sidebar/Sidebar.vue'
import CandidateList from './views/Candidates/CandidateList.vue'
import Content from './layout/Content/Content.vue'

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

</script>

<template>
    <div class="container">
        <HeaderComponent />
        <main class="main-content" :class="{ 'sidebar-collapsed': isCollapsed }">
            <SidebarComponent :is-collapsed="isCollapsed" @toggle="toggleSidebar"/>
            <!-- <Content> -->
                <router-view />
            <!-- </Content> -->
        </main>
    </div>
</template>

<style scoped>

.main-content {
    flex-grow: 1; 
    background-color: var(--main-bg);
    margin-left: var(--sidebar-width); 
    padding-top: var(--header-height); 
    width: calc(100% - var(--sidebar-width)); 
    height: 100vh; 
    overflow-y: hidden; 
    display: flex; 
    flex-direction: column; 
}

.main-content.sidebar-collapsed {
    margin-left: 50px; 
    width: calc(100% - 50px);
}
</style>

